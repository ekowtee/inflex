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
import { BLOOM_REST, BLOOM_REVEAL, FIRST_MORPH_VH, sceneStateAt } from "./formationTrack";
import { BEAT_START_VH } from "./timeline";
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
/** Watchdog while live: demote when this many consecutive frames average over the limit. */
const WATCH_FRAMES = 90;
const WATCH_LIMIT_MS = 40;
/**
 * …or when more than JANK_SHARE of them take longer than JANK_MS (two missed
 * vsyncs at 60 Hz). Averages hide jank: at 6× CPU throttling on the desktop
 * reference (Iris Xe, 1920 × 1080) Tier B averaged 18 ms a frame while one in
 * a hundred took 67 ms and 8% of a full scroll's frames ran over 34 ms. The
 * same machine unthrottled peaks at 0.2%. Phase 6, 25 September 2026.
 */
const JANK_MS = 34;
/** Structure lift (uStruct) for a formed pillar and for the fully bent curve. */
const STRUCT_PILLAR = 2.2;
const STRUCT_BEND = 2.2;
const JANK_SHARE = 0.05;
/** A frame longer than this is a pause (hidden tab, blocked thread), not a render. */
const PAUSE_MS = 250;
const ARRIVAL_LIGHT_MS = 1800;
const CROSSFADE_MS = 900;

/** Camera truck at full pointer deflection, world units. */
const TRUCK_X = 0.32;
const TRUCK_Y = 0.18;

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
  private watch = { frames: 0, total: 0, long: 0, slow: 0 };
  private hiddenCleared = false;
  /** The scene's own, smoothed position on the virtual timeline (vh). */
  private vh = Number.NaN;
  /** The ask's entry and exit, smoothed like vh. */
  private entry = 0;
  private exit = 0;
  /** World points the two threads are born from (see store.thread2X). */
  private anchor2 = new Vector3();
  private anchor4 = new Vector3();
  private projected = new Vector3();
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
    this.findAnchors();

    const remembered = sessionStorage.getItem("core-tier-demoted");
    this.probe = { frames: 0, total: 0, done: capture || remembered !== null };
    this.lastFrame = performance.now();
    this.frame = requestAnimationFrame(this.tick);
  }

  /**
   * The foot of the sheet's ember line, and the cap of the plane's tallest
   * ember column nearest the viewer's right: the points the Beat 2 and
   * Beat 4 threads drop from.
   */
  private findAnchors(): void {
    const p = this.options.data.positions;
    const n = p.length / 4 / 6;
    let best2 = Infinity;
    let best4 = -Infinity;
    for (let i = 0; i < n; i += 1) {
      const o0 = i * 4;
      if (p[o0 + 3] > 0.5 && p[o0 + 1] < best2) {
        best2 = p[o0 + 1];
        this.anchor2.set(p[o0], p[o0 + 1], p[o0 + 2]);
      }
      const o4 = (4 * n + i) * 4;
      if (p[o4 + 3] > 0.5) {
        const score = p[o4 + 1] * 4 + p[o4] - p[o4 + 2] * 0.5;
        if (score > best4) {
          best4 = score;
          this.anchor4.set(p[o4], p[o4 + 1], p[o4 + 2]);
        }
      }
    }
  }

  private screenX(world: Vector3): number {
    this.projected.copy(world).project(this.camera);
    return ((this.projected.x + 1) / 2) * this.width;
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
    // A frame far longer than any real render is a pause, not load: the tab
    // was hidden, the window lost the compositor, DevTools stepped in, or a
    // dev rebuild blocked the thread. Pauses never count toward the probe
    // or the watchdog, or one switch to another window demotes the scene.
    const paused = frameMs > PAUSE_MS || document.hidden;
    const time = (now - this.startedAt) / 1000;

    // ─── probe: 90 frames, then decide ────────────────────────────────────
    if (!this.probe.done && !paused) {
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

    // ─── watchdog: a live scene that cannot hold its frame time steps down ──
    // The probe judges the first 90 frames; this judges every 90 after
    // going live, for devices that start well and then saturate, on the
    // average and on the share of long frames.
    // Two consecutive slow windows, not one, so a short burst of work
    // elsewhere on the page cannot end the scene.
    if (this.ready.live && !capture && !paused) {
      this.watch.frames += 1;
      this.watch.total += frameMs;
      if (frameMs > JANK_MS) this.watch.long += 1;
      if (this.watch.frames >= WATCH_FRAMES) {
        const avg = this.watch.total / this.watch.frames;
        const janky = this.watch.long / this.watch.frames > JANK_SHARE;
        this.watch.frames = 0;
        this.watch.total = 0;
        this.watch.long = 0;
        this.watch.slow = avg > WATCH_LIMIT_MS || janky ? this.watch.slow + 1 : 0;
        if (this.watch.slow >= 2) {
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

    // ─── position on the timeline, smoothed ───────────────────────────────
    // The page reports where the reader is; the scene eases toward it with
    // a 0.22 s time constant, the equivalent of a 0.8 s scrub, so a fast
    // scroll reads as intent. Capture snaps.
    const targetVh = store.scrollVh;
    if (capture || !Number.isFinite(this.vh)) this.vh = targetVh;
    else this.vh += (targetVh - this.vh) * (1 - Math.exp(-dt / 0.22));
    const track = sceneStateAt(this.vh);
    // The ask's entry and exit, smoothed like the timeline. Capture snaps
    // to the requested state and uses the store's own mix and bloom.
    if (capture) {
      this.entry = 0;
      this.exit = 0;
    } else {
      this.entry += (store.askEntry - this.entry) * (1 - Math.exp(-dt / 0.22));
      this.exit += (store.askExit - this.exit) * (1 - Math.exp(-dt / 0.22));
    }
    const sm = (t: number) => {
      const x = Math.min(1, Math.max(0, t));
      return x * x * (3 - 2 * x);
    };
    // The warmth gathers back into the line over the first part of the ask's
    // entry.
    const spread = track.spread * (1 - sm(this.entry / 0.4));
    // The mark forms as the ask comes up, on the chapter's own entry rather
    // than the timeline, which is still on the partner wall until the ask
    // is a third of the way up (a short beat's scroll extent has a floor).
    // Whole by the time the chapter's top is a sixth of the way from the
    // viewport top, so it is there while the offer is read. It comes apart
    // as the chapter leaves: the nodes scatter while the timeline fades
    // them (store.askExit), so it is gone well before the doors reach the
    // top. Owner, 25 September 2026.
    if (track.to === 5 || (this.vh > BEAT_START_VH[5] + 30 && this.entry > 0.001)) {
      const formed = sm((this.entry - 0.1) / 0.75);
      const leaving = sm((this.exit - 0.05) / 0.4);
      track.from = 0;
      track.to = 5;
      track.mix = formed;
      track.bloom = BLOOM_REST + (BLOOM_REVEAL - BLOOM_REST) * formed * (1 - leaving);
      track.noise = Math.max(track.noise, 0.3 * sm((this.exit - 0.05) / 0.35));
    }

    // ─── the ember gate: the arrival light, then the page's own track ─────
    let gate: number;
    if (capture) gate = store.heatGate;
    else if (!this.ready.live) gate = -0.3;
    else {
      const arrival = store.scrolledPastArrival
        ? 1.3
        : -0.3 + 1.6 * expoOut(Math.max(0, (now - this.ready.liveAt - CROSSFADE_MS) / ARRIVAL_LIGHT_MS));
      gate = Math.min(arrival, track.gate);
    }

    // ─── camera ───────────────────────────────────────────────────────────
    const adjust = aspectAdjust(this.width / this.height);
    const key = sampleCamera(this.vh);
    {
      const b4 = BEAT_START_VH[4];
      const b5 = BEAT_START_VH[5];
      const inPillars = Math.min(
        Math.min(1, Math.max(0, (this.vh - (b4 - FIRST_MORPH_VH)) / FIRST_MORPH_VH)),
        Math.min(1, Math.max(0, (b5 + 30 - this.vh) / 10))
      );
      const aspect = this.width / this.height;
      if (aspect < 1) {
        // Portrait: the pillar keys push each formation right of the
        // desktop copy column, which on a phone put it half off the
        // screen. There the copy runs over or above the object, so the
        // pillars are centred; so is the mark in the ask, which then sits
        // behind the offer as a watermark at the phone's dimmed opacity.
        const b8 = BEAT_START_VH[8];
        const b9 = BEAT_START_VH[9];
        // On a phone the ask is reached by its entry, not by the timeline,
        // which holds on the chapter above until the ask's top arrives.
        const byEntry = Math.min(1, Math.max(0, (this.entry - 0.45) * 4));
        const inAsk = Math.max(
          byEntry,
          Math.min(
            Math.min(1, Math.max(0, (this.vh - (b8 - 10)) / 10)),
            Math.min(1, Math.max(0, (b9 + 40 - this.vh) / 10))
          )
        );
        // The turning point's profile view sits right of the copy too.
        const b2 = BEAT_START_VH[2];
        const inTurn = Math.min(
          Math.min(1, Math.max(0, (this.vh - b2) / 40)),
          Math.min(1, Math.max(0, (b4 - FIRST_MORPH_VH - this.vh) / 20))
        );
        const shift = -(key.lookAt.x - 0.45 * inAsk) * Math.max(inPillars, inAsk, inTurn);
        // The pillar formations are wider than tall (the network fabric is
        // 3.9 units across): on a portrait screen pull back so they fit.
        if (inPillars > 0) {
          this.offset.copy(key.position).sub(key.lookAt).multiplyScalar(1 + 0.35 * inPillars);
          key.position.copy(key.lookAt).add(this.offset);
        }
        key.position.x += shift;
        key.lookAt.x += shift;
      } else if (aspect < 1.5 && inPillars > 0) {
        // Narrow landscape (1024 × 768): the copy column is a larger share
        // of the width, and at the desktop keys the first formation ran into it.
        // Pull back and push the object further right.
        const t = inPillars * Math.min(1, (1.5 - aspect) / 0.25);
        this.offset.copy(key.position).sub(key.lookAt).multiplyScalar(1 + 0.2 * t);
        key.lookAt.x -= 0.6 * t;
        key.position.copy(key.lookAt).add(this.offset);
      }
    }
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

    // The orbit pivots on the look-at point, which lies on the sheet's own
    // plane, so rotation alone barely moves a near-flat object (measured:
    // 4 px of ember-line travel across the full pointer range). A truck of
    // the camera and a smaller shift of the target give the parallax a
    // visible, heavy drift while the tilt keeps the perspective change.
    const truckX = (yaw / YAW_MAX) * TRUCK_X;
    const truckY = (pitch / PITCH_MAX) * TRUCK_Y;
    this.offset.copy(key.position).sub(key.lookAt);
    this.offset.applyAxisAngle(this.up, yaw);
    this.offset.applyAxisAngle(this.right, -pitch);
    const cam = this.camera;
    this.target.x -= truckX * 0.35;
    this.target.y -= truckY * 0.35;
    cam.position.copy(key.lookAt).add(this.offset);
    cam.position.x -= truckX;
    cam.position.y -= truckY;
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
    cam.updateMatrixWorld();

    // Where the threads are born, in viewport px, for the spine to place.
    store.thread2X = this.screenX(this.anchor2);
    store.thread4X = this.screenX(this.anchor4);
    store.threadReady = this.ready.live && !capture;

    // ─── uniforms ─────────────────────────────────────────────────────────
    // Points are sized in pixels with a shader clamp; on a tall viewport the
    // same pixels are a smaller share of the frame and the formations thin
    // out (2560 × 1440 read as dust). Scale with height above 900 px.
    this.handles.nodeMaterial.uniforms.uDpr.value =
      this.options.dpr * Math.min(1.6, Math.max(1, this.height / 900));
    // The formed objects carry their shape, not only their ember: the four
    // pillars and the sheet bent into the curve lift their graphite
    // structure (owner, 25 September 2026: "too faint"). The resting sheet
    // and the mark keep the levels they were signed off at.
    const sFrom = capture ? store.from : track.from;
    const sTo = capture ? store.to : track.to;
    const sMix = capture ? store.mix : track.mix;
    const isPillar = (f: number) => (f >= 1 && f <= 4 ? 1 : 0);
    const pillarWeight = isPillar(sFrom) * (1 - sMix) + isPillar(sTo) * sMix;
    const bendWeight = sFrom === 0 && sTo === 0 ? (capture ? store.captureBend : track.bend) : 0;
    const struct = 1 + (STRUCT_PILLAR - 1) * pillarWeight + (STRUCT_BEND - 1) * bendWeight;
    for (const material of [this.handles.nodeMaterial, this.handles.edgeMaterial]) {
      const u = material.uniforms;
      u.uTime.value = capture ? 0 : time;
      u.uFrom.value = capture ? store.from : track.from;
      u.uTo.value = capture ? store.to : track.to;
      u.uMix.value = capture ? store.mix : track.mix;
      u.uNoise.value = capture ? store.noise : track.noise;
      u.uHeatGate.value = gate;
      u.uSpread.value = capture ? 0 : spread;
      u.uBend.value = capture ? store.captureBend : track.bend;
      u.uOpacity.value = store.opacity;
      u.uStruct.value = struct;
      u.uIdle.value = capture ? 0 : 1;
      u.uProximity.value = pointer.active && !capture ? 1 : 0;
      u.uPointerWorld.value.set(pointer.worldX, pointer.worldY);
    }
    this.ground.material.uniforms.uAlpha.value = capture ? store.ground : track.ground;

    // ─── render ───────────────────────────────────────────────────────────
    // Behind the Ivory beats the spine sets opacity 0: keep the loop alive
    // for the probe and the uniforms, skip the draw.
    // Clear once on the way out, or the last presented frame stays on the
    // canvas and shows through the next Obsidian band before it fades in.
    if (!capture && store.opacity <= 0.001) {
      if (!this.hiddenCleared) {
        this.renderer.setRenderTarget(null);
        this.renderer.setClearColor(palette.obsidian900, 0);
        this.renderer.clear();
        this.hiddenCleared = true;
      }
      return;
    }
    this.hiddenCleared = false;
    const gl = this.renderer;
    if (this.post) {
      this.post.render(this.scene, cam, time, capture ? store.bloom : track.bloom, this.setEmberPass);
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
