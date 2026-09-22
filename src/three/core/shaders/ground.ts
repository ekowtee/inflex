/**
 * The ground grid — HERO_SCENE_SPEC.md §7.3. The one permitted grid on the
 * site. Visible only in the Lattice and Plane formations.
 */
import { stripGlsl } from "./strip";

export const groundVertex = stripGlsl(/* glsl */ `
  precision highp float;
  out vec2 vWorld;
  out float vDepth;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xz;
    vec4 mv = viewMatrix * world;
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`);

export const groundFragment = stripGlsl(/* glsl */ `
  precision highp float;
  in vec2 vWorld;
  in float vDepth;
  uniform vec3 uGraphite;
  uniform vec3 uFogColor;
  uniform float uFogDensity;
  uniform float uAlpha;
  uniform float uEncodeSRGB;
  out vec4 fragColor;

  // Linear → sRGB. Custom shaders get no automatic output transform.
  vec3 toSRGB(vec3 c) {
    vec3 lo = 12.92 * c;
    vec3 hi = 1.055 * pow(max(c, vec3(0.0)), vec3(1.0 / 2.4)) - 0.055;
    return mix(lo, hi, step(vec3(0.0031308), c));
  }

  void main() {
    // 0.5-unit grid with anti-aliased 1.5 px lines via screen-space derivatives.
    vec2 coord = vWorld / 0.5;
    vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
    float line = 1.0 - min(min(grid.x, grid.y) / 1.5, 1.0);
    float radial = 1.0 - smoothstep(3.0, 6.0, length(vWorld));
    float fog = 1.0 - exp(-uFogDensity * uFogDensity * vDepth * vDepth);
    vec3 color = mix(uGraphite, uFogColor, fog);
    if (uEncodeSRGB > 0.5) color = toSRGB(color);
    float alpha = line * radial * 0.06 * uAlpha;
    fragColor = vec4(color * alpha, alpha);
  }
`);
