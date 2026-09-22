/**
 * The hand-written post stage — PERFORMANCE_PLAN.md §2.3, HERO_SCENE_SPEC.md §6.4.
 *
 *   1. scene → sceneTarget (full resolution, half float)
 *   2. ember layer → emberTarget (half resolution)
 *   3. separable blur at quarter resolution
 *   4. composite: scene + bloom · intensity, vignette, dither → canvas
 *
 * Tone mapping is left to the renderer's output stage on the composite.
 */
import {
  HalfFloatType,
  LinearFilter,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  RGBAFormat,
  Scene,
  ShaderMaterial,
  GLSL3,
  Vector2,
  WebGLRenderTarget,
  type Camera,
  type WebGLRenderer,
  NoBlending,
} from "three";
import { screenVertex, blurFragment, compositeFragment } from "./shaders/post";
import { atmosphere, bloom, palette } from "./rig";

export class PostStage {
  private sceneTarget: WebGLRenderTarget;
  private emberTarget: WebGLRenderTarget;
  private blurA: WebGLRenderTarget;
  private blurB: WebGLRenderTarget;
  private blurMaterial: ShaderMaterial;
  private compositeMaterial: ShaderMaterial;
  private quad: Mesh;
  private quadScene = new Scene();
  private quadCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  private width = 1;
  private height = 1;

  constructor(private renderer: WebGLRenderer) {
    const make = (w: number, h: number) =>
      new WebGLRenderTarget(w, h, {
        type: HalfFloatType,
        format: RGBAFormat,
        minFilter: LinearFilter,
        magFilter: LinearFilter,
        depthBuffer: false,
        stencilBuffer: false,
      });
    this.sceneTarget = make(1, 1);
    this.sceneTarget.depthBuffer = true;
    this.emberTarget = make(1, 1);
    this.blurA = make(1, 1);
    this.blurB = make(1, 1);

    this.blurMaterial = new ShaderMaterial({
      glslVersion: GLSL3,
      vertexShader: screenVertex,
      fragmentShader: blurFragment,
      uniforms: { uTexture: { value: null }, uDirection: { value: new Vector2() } },
      depthTest: false,
      depthWrite: false,
      blending: NoBlending,
    });
    this.compositeMaterial = new ShaderMaterial({
      glslVersion: GLSL3,
      vertexShader: screenVertex,
      fragmentShader: compositeFragment,
      uniforms: {
        uScene: { value: null },
        uBloom: { value: null },
        uBloomIntensity: { value: bloom.rest },
        uVignetteOffset: { value: atmosphere.vignetteOffset },
        uVignetteDarkness: { value: atmosphere.vignetteDarkness },
        uVignetteColor: { value: palette.obsidian950 },
        uNoise: { value: atmosphere.noise },
        uTime: { value: 0 },
      },
      depthTest: false,
      depthWrite: false,
      blending: NoBlending,
    });
    this.quad = new Mesh(new PlaneGeometry(2, 2), this.compositeMaterial);
    this.quad.frustumCulled = false;
    this.quadScene.add(this.quad);
  }

  setSize(width: number, height: number): void {
    if (width === this.width && height === this.height) return;
    this.width = width;
    this.height = height;
    this.sceneTarget.setSize(width, height);
    const ew = Math.max(1, Math.round(width * bloom.emberScale));
    const eh = Math.max(1, Math.round(height * bloom.emberScale));
    this.emberTarget.setSize(ew, eh);
    const bw = Math.max(1, Math.round(ew * bloom.blurScale));
    const bh = Math.max(1, Math.round(eh * bloom.blurScale));
    this.blurA.setSize(bw, bh);
    this.blurB.setSize(bw, bh);
  }

  /**
   * Render one frame. `setEmberPass` toggles the materials' ember mode; the
   * ember objects live on layer 1 and the rest on layer 0.
   */
  render(
    scene: Scene,
    camera: Camera,
    time: number,
    bloomIntensity: number,
    setEmberPass: (on: boolean) => void
  ): void {
    const { renderer } = this;
    const prevAutoClear = renderer.autoClear;

    // 1 — scene, layer 0
    camera.layers.set(0);
    renderer.setRenderTarget(this.sceneTarget);
    renderer.setClearColor(palette.obsidian900, 1);
    renderer.clear();
    renderer.render(scene, camera);

    // 2 — ember layer
    setEmberPass(true);
    camera.layers.set(1);
    renderer.setRenderTarget(this.emberTarget);
    renderer.setClearColor(0x000000, 0);
    renderer.clear();
    renderer.render(scene, camera);
    setEmberPass(false);
    camera.layers.set(0);

    // 3 — blur, two passes at quarter resolution
    this.quad.material = this.blurMaterial;
    this.blurMaterial.uniforms.uTexture.value = this.emberTarget.texture;
    this.blurMaterial.uniforms.uDirection.value.set(1 / this.blurA.width, 0);
    renderer.setRenderTarget(this.blurA);
    renderer.render(this.quadScene, this.quadCamera);
    this.blurMaterial.uniforms.uTexture.value = this.blurA.texture;
    this.blurMaterial.uniforms.uDirection.value.set(0, 1 / this.blurA.height);
    renderer.setRenderTarget(this.blurB);
    renderer.render(this.quadScene, this.quadCamera);

    // 4 — composite to the canvas; the renderer tone-maps this output
    this.quad.material = this.compositeMaterial;
    this.compositeMaterial.uniforms.uScene.value = this.sceneTarget.texture;
    this.compositeMaterial.uniforms.uBloom.value = this.blurB.texture;
    this.compositeMaterial.uniforms.uBloomIntensity.value = bloomIntensity;
    this.compositeMaterial.uniforms.uTime.value = time;
    renderer.setRenderTarget(null);
    renderer.render(this.quadScene, this.quadCamera);

    renderer.autoClear = prevAutoClear;
  }

  dispose(): void {
    this.sceneTarget.dispose();
    this.emberTarget.dispose();
    this.blurA.dispose();
    this.blurB.dispose();
    this.blurMaterial.dispose();
    this.compositeMaterial.dispose();
    this.quad.geometry.dispose();
  }
}
