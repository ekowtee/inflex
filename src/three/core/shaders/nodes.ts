/**
 * Node shaders — HERO_SCENE_SPEC.md §6 (lighting rig) and §7.1 (material).
 *
 * GLSL ES 3.0 (three's GLSL3), so positions are read with texelFetch from
 * the formation texture: 128 columns, one 128-row block per formation.
 *
 * Kept as template strings so no loader configuration is needed; comments
 * are stripped by stripGlsl() at import time.
 */
import { stripGlsl } from "./strip";

export const nodesVertex = stripGlsl(/* glsl */ `
  precision highp float;
  precision highp sampler2D;

  in float aIndex;
  in float aSeed;
  in vec3 aNormal;

  uniform sampler2D uPositions;
  uniform int uFrom;
  uniform int uTo;
  uniform float uMix;
  uniform float uTime;
  uniform float uNoise;
  uniform float uHeatGate;
  uniform float uIdle;
  uniform float uSize;
  uniform float uDpr;
  uniform vec2 uPointerWorld;
  uniform float uProximity;
  uniform vec3 uKeyDir;
  uniform vec3 uRimDir;

  out float vHeat;
  out float vShade;
  out float vRim;
  out float vDepth;
  out float vPulse;
  out vec2 vPresence;

  const float TAU = 6.28318530718;
  const int TEX_W = 128;

  // Presence: the sheet dissolves at its borders instead of ending in a hard
  // rectangle, and a slow low-frequency variation keeps the field from
  // reading as a uniform grid. Both are functions of the resting position so
  // they hold still under idle motion.
  // Returns (border, border * field): ember uses the border alone so the
  // line fades at the sheet's ends but never dissolves with the field.
  vec2 presence(vec3 rest, bool resting) {
    float border = 1.0;
    if (resting) {
      float fx = 1.0 - smoothstep(0.74, 1.0, abs(rest.x) / 2.4);
      float fy = 1.0 - smoothstep(0.62, 1.0, abs(rest.y) / 1.3);
      border = fx * fy;
    } else {
      border = 1.0 - smoothstep(2.2, 3.0, length(rest));
    }
    float field = 0.5 + 0.5 * sin(rest.x * 1.9 + rest.y * 1.1 + 0.7) * cos(rest.y * 2.7 - rest.x * 0.6);
    return vec2(border, border * mix(0.4, 1.0, field));
  }

  vec4 fetchFormation(int formation, int index) {
    ivec2 texel = ivec2(index % TEX_W, formation * TEX_W + index / TEX_W);
    return texelFetch(uPositions, texel, 0);
  }

  float hash(float n) { return fract(sin(n) * 43758.5453123); }

  void main() {
    int index = int(aIndex + 0.5);
    vec4 from = fetchFormation(uFrom, index);
    vec4 to = fetchFormation(uTo, index);

    // The mix travels across the object: each node starts by its seed so a
    // morph reads as a wave rather than a uniform crossfade.
    float m = smoothstep(0.0, 1.0, (uMix - aSeed * 0.35) / 0.65);
    vec3 pos = mix(from.xyz, to.xyz, m);
    float heat = mix(from.w, to.w, m);

    // Swirl at mid-transition. A cheap sinusoidal curl-like field: three
    // orthogonal sines phase-shifted by time, scaled by sin(m·π) so it is
    // silent at either end of the morph.
    float swirl = sin(m * 3.14159265) * 0.18;
    if (swirl > 0.0001) {
      pos += vec3(
        sin(pos.y * 2.1 + uTime * 0.31),
        sin(pos.z * 1.7 + uTime * 0.23),
        sin(pos.x * 1.9 + uTime * 0.17)
      ) * swirl;
    }

    // Beat 2 disorder: a fixed per-node direction, scaled by uNoise, with a
    // slow breathing so the tangle is alive before it resolves.
    if (uNoise > 0.0001) {
      vec3 dir = normalize(vec3(hash(aSeed * 7.1), hash(aSeed * 13.3), hash(aSeed * 29.7)) - 0.5);
      pos += dir * uNoise * (0.6 + 0.4 * sin(uTime * 0.8 + aSeed * TAU));
    }

    // Idle breathing along the surface normal.
    bool resting = uFrom == 0 && uTo == 0;
    vec3 n = resting ? aNormal : normalize(pos + vec3(0.0001));
    pos += n * 0.02 * sin(uTime * 0.6 + aSeed * TAU) * uIdle;

    // The arrival light: in the resting formation the ember line ignites from
    // left to right as uHeatGate sweeps −0.3 → 1.3.
    if (resting) {
      float across = (from.x + 2.4) / 4.8;
      heat *= 1.0 - smoothstep(uHeatGate - 0.25, uHeatGate, across);
    }

    // Proximity warmth: nodes near the pointer rise toward silver, never ember.
    float prox = 1.0 - smoothstep(0.35, 0.95, distance(pos.xy, uPointerWorld));
    heat = max(heat, prox * 0.35 * uProximity);

    // The rig. A near-flat sheet gives a normal-based key nothing to vary
    // against, so the key is positional: the side of the object facing the
    // light reads silver, the far side graphite. The rim stays normal-based.
    float key = dot(normalize(pos + vec3(0.0001)), uKeyDir);
    vShade = 0.15 + 0.85 * smoothstep(-0.8, 0.9, key);
    vRim = 0.45 * pow(max(0.0, dot(n, uRimDir)), 3.0);
    vHeat = heat;
    vPulse = 0.85 + 0.15 * sin(uTime * 0.9 + aSeed * TAU);
    vPresence = presence(mix(from.xyz, to.xyz, m), resting);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    vDepth = -mvPosition.z;
    gl_Position = projectionMatrix * mvPosition;

    float size = uSize * (1.0 + 0.4 * heat) * (5.4 / max(vDepth, 0.5));
    gl_PointSize = clamp(size, 2.5, 6.0) * uDpr;
  }
`);

export const nodesFragment = stripGlsl(/* glsl */ `
  precision highp float;

  in float vHeat;
  in float vShade;
  in float vRim;
  in float vDepth;
  in float vPulse;
  in vec2 vPresence;

  uniform vec3 uGraphite;
  uniform vec3 uSilver300;
  uniform vec3 uSilver100;
  uniform vec3 uEmber;
  uniform vec3 uFogColor;
  uniform float uFogDensity;
  uniform float uOpacity;
  uniform float uEmberPass;
  uniform float uEncodeSRGB;

  out vec4 fragColor;

  // Linear → sRGB. Custom shaders get no automatic output transform.
  vec3 toSRGB(vec3 c) {
    vec3 lo = 12.92 * c;
    vec3 hi = 1.055 * pow(max(c, vec3(0.0)), vec3(1.0 / 2.4)) - 0.055;
    return mix(lo, hi, step(vec3(0.0031308), c));
  }

  void main() {
    // Ember-only pass for the bloom target: skip every graphite node.
    if (uEmberPass > 0.5 && vHeat < 0.5) discard;

    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;

    // A hard core inside a soft halo: reads as a point, not a blob.
    float core = 1.0 - smoothstep(0.24, 0.34, d);
    float halo = (1.0 - smoothstep(0.34, 0.5, d)) * 0.4;

    vec3 base = mix(uGraphite, uSilver300, vShade);
    vec3 lit = mix(base, uSilver100, smoothstep(0.0, 0.5, vHeat));
    lit += uSilver100 * vRim;
    vec3 ember = uEmber * 1.4 * vPulse;
    vec3 color = mix(lit, ember, smoothstep(0.5, 1.0, vHeat * vPulse));

    // Exponential-squared fog toward the clear colour.
    float fog = 1.0 - exp(-uFogDensity * uFogDensity * vDepth * vDepth);
    color = mix(color, uFogColor, fog);

    float depthCue = 1.0 - 0.45 * smoothstep(4.5, 7.5, vDepth);
    // Ember keeps its presence: the line must not dissolve with the field.
    float keep = mix(vPresence.y, vPresence.x, smoothstep(0.5, 1.0, vHeat));
    float alpha = (core + halo) * depthCue * uOpacity * keep;

    if (uEmberPass > 0.5) {
      // Bloom source: emit the ember colour scaled by the disc, no fog.
      vec3 e = ember * (core + halo) * uOpacity;
      if (uEncodeSRGB > 0.5) e = toSRGB(min(e, vec3(1.0)));
      fragColor = vec4(e, alpha);
      return;
    }
    if (uEncodeSRGB > 0.5) color = toSRGB(min(color, vec3(1.0)));
    fragColor = vec4(color * alpha, alpha);
  }
`);
