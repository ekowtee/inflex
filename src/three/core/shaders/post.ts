/**
 * The hand-written post stage — PERFORMANCE_PLAN.md §2.3.
 *
 * Three operations and nothing else: blur the ember layer, add it back,
 * then vignette and dither. Tone mapping (AgX) is the renderer's job on the
 * final output. About 4 KB in place of the 113 KB postprocessing library.
 */
import { stripGlsl } from "./strip";

/** Shared full-screen triangle vertex stage. */
export const screenVertex = stripGlsl(/* glsl */ `
  precision highp float;
  out vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`);

/** Separable 9-tap Gaussian; uDirection is (1/w, 0) or (0, 1/h). */
export const blurFragment = stripGlsl(/* glsl */ `
  precision highp float;
  in vec2 vUv;
  uniform sampler2D uTexture;
  uniform vec2 uDirection;
  out vec4 fragColor;

  void main() {
    // Weights for a 9-tap kernel, sigma ≈ 2.
    float w0 = 0.2270270270;
    float w1 = 0.1945945946;
    float w2 = 0.1216216216;
    float w3 = 0.0540540541;
    float w4 = 0.0162162162;
    vec4 sum = texture(uTexture, vUv) * w0;
    sum += texture(uTexture, vUv + uDirection * 1.0) * w1;
    sum += texture(uTexture, vUv - uDirection * 1.0) * w1;
    sum += texture(uTexture, vUv + uDirection * 2.0) * w2;
    sum += texture(uTexture, vUv - uDirection * 2.0) * w2;
    sum += texture(uTexture, vUv + uDirection * 3.0) * w3;
    sum += texture(uTexture, vUv - uDirection * 3.0) * w3;
    sum += texture(uTexture, vUv + uDirection * 4.0) * w4;
    sum += texture(uTexture, vUv - uDirection * 4.0) * w4;
    fragColor = sum;
  }
`);

/** Scene + bloom, vignette, per-frame dither. */
export const compositeFragment = stripGlsl(/* glsl */ `
  precision highp float;
  in vec2 vUv;
  uniform sampler2D uScene;
  uniform sampler2D uBloom;
  uniform float uBloomIntensity;
  uniform float uVignetteOffset;
  uniform float uVignetteDarkness;
  uniform vec3 uVignetteColor;
  uniform float uNoise;
  uniform float uTime;
  out vec4 fragColor;

  // Linear → sRGB. Custom shaders get no automatic output transform.
  vec3 toSRGB(vec3 c) {
    vec3 lo = 12.92 * c;
    vec3 hi = 1.055 * pow(max(c, vec3(0.0)), vec3(1.0 / 2.4)) - 0.055;
    return mix(lo, hi, step(vec3(0.0031308), c));
  }

  // Interleaved-gradient noise: cheap, well distributed, animated by frame.
  float ign(vec2 p) {
    return fract(52.9829189 * fract(0.06711056 * p.x + 0.00583715 * p.y));
  }

  void main() {
    vec3 color = texture(uScene, vUv).rgb;
    color += texture(uBloom, vUv).rgb * uBloomIntensity;

    // Vignette toward obsidian-950.
    vec2 centred = vUv - 0.5;
    float v = smoothstep(uVignetteOffset, 1.0, length(centred) * 1.4142);
    color = mix(color, uVignetteColor, v * uVignetteDarkness);

    // Dither: breaks the banding that near-black gradients show on 8-bit
    // panels. Below the threshold of visible texture.
    color = toSRGB(color);
    float n = ign(gl_FragCoord.xy + fract(uTime * 7.0) * 100.0) - 0.5;
    color += n * uNoise;

    fragColor = vec4(color, 1.0);
  }
`);
