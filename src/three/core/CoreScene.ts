/**
 * The scene driver — HERO_SCENE_SPEC.md §5, §6, §8, §9.
 *
 * Vanilla three, no React binding: the React binding imports the whole of
 * three as a namespace and resolves classes by name at runtime, which
 * defeats tree shaking in every bundler and pinned the environment chunk
 * at about 245 KB. Named imports here let the bundler drop what the scene
 * does not use, and keep React out of the per-frame path entirely.
 *
 * One requestAnimationFrame loop owns rendering. Every frame it reads the
 * store and the damped pointer, positions the camera, writes uniforms, and
 * renders through the post stage (Tier A) or straight to the canvas
 * (Tier B). It also runs the frame-time probe and the readiness contract
 * that decide when the poster may fade.
 */
import {
  NoToneMapping,
  OneFactor,
  OneMinusSrcAlphaFactor,
  PerspectiveCamera,
  Plane,
  Ray,
  Scene,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from "three";
import type { CoreWorkerResult } from "./worker/formations.worker";
import type { Tier } from "@/motion/tier";
import { buildCore, disposeCore, type CoreHandles } from "./CoreObject";
import { buildGround } from "./ground";
import { PostStage } from "./PostStage";
import { store } from "./store";
import { pointer, stepPointer, attachPointer, YAW_MAX, PITCH_MAX } from "./pointer";
import { sampleCamera, aspectAdjust, breathing, touchDrift } from "./camera";
import { palette } from "./rig";

export interface CoreSceneOptions {
  container: HTMLElement;
  data: CoreWorkerResult;
  tier: "A" | "B";
  dpr: number;
  /** The poster may fade: readiness contract satisfied. */
  onLive: () => void;
  /** Demote to a lighter tier, or "C" to give up and keep the poster. */
  onDemote: (tier: Tier) => void;
  /** performance.now() at mount, for the 8 s cutoff. */
  mountedAt: number;
  /** Poster capture: no probe, no deadline. */
  capture?: boolean;
}

const PROBE_FRAMES = 90;
const PROBE_LIMIT_MS = 24;
const READY_FRAME_MS = 20;
const READY_STREAK = 3;
const LIVE_DEADLINE_MS = 8000;
const ARRIVAL_LIGHT_MS = 1800;
const CROSSFADE_MS = 900;

const expoOut = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

export class CoreScene {
  private renderer: WebGLRenderer;
  private scene = new Scene();
  private camera: PerspectiveCamera;
  private handles: CoreHandles;
  private ground;
  private post: PostStage | null = null;
  private frame = 0;
  private disposed = false;
  private compiled = false;
  private probe = { frames: 0, total: 0, done: true };
  private ready = { streak: 0, live: false, liveAt: 0 };
  private lastFrame = performance.now();
  private startedAt = performance.now();
  private width = 1;
  private height = 1;
  private detachPointer: () => void;
  private resize: ResizeObserver | null = null;
  private plane = new Plane(new Vector3(0, 0, 1), 0);
  private ray = new Ray();
  private hit = new Vector3();
  private target = new Vector3();
  private offset = new Vector3();
  private up = new Vector3(0, 1, 0);
  private right = new Vector3(1, 0, 0);

  constructor(private options: CoreSceneOptions) {
    const { container, tier, dpr } = options;

    this.renderer = new WebGLRenderer({
      antialias: false,
      alpha: false,
      powerPreference: "high-performance",
      preserveDrawingBuffer: false,
    });
    const gl = this.renderer;
    gl.setPixelRatio(dpr);
    // No filmic curve: the palette is dark by design and a tone curve
    // crushed it. Our shaders write already-encoded sRGB.
    gl.toneMapping = NoToneMapping;
    gl.outputColorSpace = SRGBColorSpace;
    gl.setClearColor(palette.obsidian900, 1);
    gl.autoClear = false;
    Object.assign(gl.domElement.style, {
      position: "absolute",
      inset: "0",
      width: "100%",
      height: "100%",
      display: "block",
      pointerEvents: "none",
    });
    gl.domElement.setAttribute("aria-hidden", "true");
    container.appendChild(gl.domElement);

    this.camera = new PerspectiveCamera(32, 1, 0.1, 40);
    this.camera.position.set(-1.3, 1.3, 6.0);

    // No scene.background: three forces a clear on every render() when the
    // background is a Color, which wiped the base layer under the additive
    // ember pass. Every pass clears explicitly.
    this.scene.background = null;

    this.ground = buildGround(tier !== "A");
    this.scene.add(this.ground);
    if (tier === "A") this.post = new PostStage(gl);

    gl.domElement.addEventListener("webglcontextlost", this.onContextLost);
    this.detachPointer = attachPointer();

    // Placeholder until init() has built the real handles; tick() waits.
    this.handles = null as unknown as CoreHandles;
    this.measure();
    this.resize = new ResizeObserver(() => this.measure());
    this.resize.observe(container);

    void this.init();
  }

  /** A short yield so no single main-thread task runs long. */
  private static yieldToBrowser(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 0));
  }

  /**
   * Set-up in stages with yields between them: building the edge attributes,
   * uploading the geometry, and compiling the shaders are each a sizeable
   * main-thread task on a mid-range phone, and one long task costs more in
   * blocking time than three short ones.
   */
  private async init(): Promise<void> {
    const { data, tier, dpr, capture = false } = this.options;
    const gl = this.renderer;

    await CoreScene.yieldToBrowser();
    if (this.disposed) return;
    const handles = buildCore(data, tier, dpr);
    this.scene.add(handles.edges, handles.points, handles.emberEdges, handles.emberPoints);

    await CoreScene.yieldToBrowser();
    if (this.disposed) {
      disposeCore(handles);
      return;
    }
    try {
      await gl.compileAsync(this.scene, this.camera);
    } catch {
      /* drivers without parallel compile finish on the first draw instead */
    }
    if (this.disposed) {
      disposeCore(handles);
      return;
    }
    this.compiled = true;
    this.handles = handles;

    const remembered = sessionStorage.getItem("core-tier-demoted");
    this.probe = { frames: 0, total: 0, done: capture || remembered !== null };
    this.lastFrame = performance.now();
    this.frame = requestAnimationFrame(this.tick);
  }

  private onContextLost = (event: Event) => {
    event.preventDefault();
    this.options.onDemote("C");
  };

  private measure(): void {
    const { container, dpr } = this.options;
    const w = Math.max(1, container.clientWidth);
    const h = Math.max(1, container.clientHeight);
    if (w === this.width && h === this.height) return;
    this.width = w;
    this.height = h;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.post?.setSize(Math.round(w * dpr), Math.round(h * dpr));
  }

  private unproject = (nx: number, ny: number): [number, number] => {
    this.ray.origin.copy(this.camera.position);
    this.ray.direction.set(nx, ny, 0.5).unproject(this.camera).sub(this.camera.position).normalize();
    const p = this.ray.intersectPlane(this.plane, this.hit);
    return p ? [p.x, p.y] : [99, 99];
  };

  private setEmberPass = (on: boolean) => {
    const { tier } = this.options;
    for (const material of [this.handles.nodeMaterial, this.handles.edgeMaterial]) {
      material.uniforms.uEmberPass.value = on ? 1 : 0;
      // Tier B draws the ember layer additively straight onto the canvas as
      // a cheap stand-in for bloom.
      material.blendDst = on && tier === "B" ? OneFactor : OneMinusSrcAlphaFactor;
    }
  };

  private tick = () => {
    if (this.disposed || !this.handles) return;
    this.frame = requestAnimationFrame(this.tick);

    const { tier, capture = false, mountedAt, onDemote, onLive } = this.options;
    const now = performance.now();
    const frameMs = now - this.lastFrame;
    const dt = Math.min(0.1, frameMs / 1000);
    this.lastFrame = now;
    const time = (now - this.startedAt) / 1000;

    // ─── probe: 90 frames, then decide ────────────────────────────────────
    if (!this.probe.done) {
      this.probe.frames += 1;
      this.probe.total += frameMs;
      if (this.probe.frames >= PROBE_FRAMES) {
        this.probe.done = true;
        if (this.probe.total / this.probe.frames > PROBE_LIMIT_MS) {
          sessionStorage.setItem("core-tier-demoted", tier === "A" ? "B" : "C");
          onDemote(tier === "A" ? "B" : "C");
          return;
        }
      }
    }

    // ─── readiness: compiled, steady frames, inside the deadline ──────────
    if (!this.ready.live) {
      if (!capture && now - mountedAt > LIVE_DEADLINE_MS) {
        this.ready.live = true;
        onDemote("C");
        return;
      }
      this.ready.streak = capture || frameMs < READY_FRAME_MS ? this.ready.streak + 1 : 0;
      if (this.compiled && this.ready.streak >= READY_STREAK) {
        this.ready.live = true;
        this.ready.liveAt = now;
        onLive();
      }
    }

    // ─── the arrival light, after the crossfade ───────────────────────────
    if (this.ready.live && !capture) {
      if (store.scrolledPastArrival) store.heatGate = 1.3;
      else {
        const t = (now - this.ready.liveAt - CROSSFADE_MS) / ARRIVAL_LIGHT_MS;
        store.heatGate = -0.3 + 1.6 * expoOut(Math.max(0, t));
      }
    }

    // ─── camera ───────────────────────────────────────────────────────────
    const adjust = aspectAdjust(this.width / this.height);
    const key = sampleCamera(store.scrollVh);
    const breath = breathing(time);
    this.target.copy(key.lookAt);
    this.target.y += adjust.yOffset;

    stepPointer(dt, this.unproject);
    let yaw = -pointer.x * YAW_MAX;
    let pitch = pointer.y * PITCH_MAX;
    if (!pointer.active) {
      const drift = touchDrift(time);
      yaw = drift.yaw;
      pitch = drift.pitch;
    }
    if (capture) {
      yaw = 0;
      pitch = 0;
    }

    this.offset.copy(key.position).sub(key.lookAt);
    this.offset.applyAxisAngle(this.up, yaw);
    this.offset.applyAxisAngle(this.right, -pitch);
    const cam = this.camera;
    cam.position.copy(key.lookAt).add(this.offset);
    if (!capture) {
      cam.position.x += breath.x;
      cam.position.y += breath.y;
    }
    cam.position.y += adjust.yOffset;
    cam.position.z += adjust.zOffset;
    if (cam.fov !== adjust.fov) {
      cam.fov = adjust.fov;
      cam.updateProjectionMatrix();
    }
    cam.lookAt(this.target);

    // ─── uniforms ─────────────────────────────────────────────────────────
    for (const material of [this.handles.nodeMaterial, this.handles.edgeMaterial]) {
      const u = material.uniforms;
      u.uTime.value = capture ? 0 : time;
      u.uFrom.value = store.from;
      u.uTo.value = store.to;
      u.uMix.value = store.mix;
      u.uNoise.value = store.noise;
      u.uHeatGate.value = store.heatGate;
      u.uOpacity.value = store.opacity;
      u.uIdle.value = capture ? 0 : 1;
      u.uProximity.value = pointer.active && !capture ? 1 : 0;
      u.uPointerWorld.value.set(pointer.worldX, pointer.worldY);
    }
    this.ground.material.uniforms.uAlpha.value = store.ground;

    // ─── render ───────────────────────────────────────────────────────────
    // Behind the Ivory beats the spine sets opacity 0: keep the loop alive
    // for the probe and the uniforms, skip the draw.
    if (!capture && store.opacity <= 0.001) return;
    const gl = this.renderer;
    if (this.post) {
      this.post.render(this.scene, cam, time, store.bloom, this.setEmberPass);
    } else {
      gl.setRenderTarget(null);
      gl.setClearColor(palette.obsidian900, 1);
      gl.clear();
      cam.layers.set(0);
      gl.render(this.scene, cam);
      this.setEmberPass(true);
      cam.layers.set(1);
      gl.render(this.scene, cam);
      this.setEmberPass(false);
      cam.layers.set(0);
    }
  };

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    cancelAnimationFrame(this.frame);
    this.resize?.disconnect();
    this.detachPointer();
    this.renderer.domElement.removeEventListener("webglcontextlost", this.onContextLost);
    this.post?.dispose();
    if (this.handles) disposeCore(this.handles);
    this.ground.geometry.dispose();
    this.ground.material.dispose();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
