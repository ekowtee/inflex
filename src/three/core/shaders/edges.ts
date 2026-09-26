/**
 * Edge shaders — HERO_SCENE_SPEC.md §7.2.
 *
 * Each vertex carries its own node index and its partner's, so the shader
 * can reproduce both endpoints with the same displacement maths as the node
 * shader and measure the edge's current length. Topology never changes
 * between formations; an edge that a formation stretches past the threshold
 * simply fades out.
 */
import { stripGlsl } from "./strip";

export const edgesVertex = stripGlsl(/* glsl */ `
  precision highp float;
  precision highp sampler2D;

  in float aIndex;
  in float aOther;
  in float aSeed;
  in float aSeedOther;
  in vec3 aNormal;
  in vec3 aNormalOther;

  uniform sampler2D uPositions;
  uniform int uFrom;
  uniform int uTo;
  uniform float uMix;
  uniform float uTime;
  uniform float uNoise;
  uniform float uHeatGate;
  uniform float uSpread;
  uniform float uBend;
  uniform float uIdle;
  uniform vec2 uPointerWorld;
  uniform float uProximity;
  uniform vec3 uKeyDir;

  out float vHot;
  out float vShade;
  out float vDepth;
  out float vStretch;
  out float vProx;
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

  // Identical to the node shader, so both ends of an edge land on their nodes.
  vec4 place(float indexF, float seed, vec3 normal) {
    int index = int(indexF + 0.5);
    vec4 from = fetchFormation(uFrom, index);
    vec4 to = fetchFormation(uTo, index);
    float m = smoothstep(0.0, 1.0, (uMix - seed * 0.35) / 0.65);
    vec3 pos = mix(from.xyz, to.xyz, m);
    float heat = mix(from.w, to.w, m);
    // Identical to the node shader's bend into y = x³.
    if (uFrom == 0 && uTo == 0 && uBend > 0.0) {
      float u = clamp(from.x / 2.4, -1.0, 1.0);
      float cubic = -1.9 * u * u * u;
      pos.z += (cubic - 0.9 * tanh(1.6 * from.x)) * uBend;
    }

    float swirl = sin(m * 3.14159265) * 0.18;
    if (swirl > 0.0001) {
      pos += vec3(
        sin(pos.y * 2.1 + uTime * 0.31),
        sin(pos.z * 1.7 + uTime * 0.23),
        sin(pos.x * 1.9 + uTime * 0.17)
      ) * swirl;
    }
    if (uNoise > 0.0001) {
      vec3 dir = normalize(vec3(hash(seed * 7.1), hash(seed * 13.3), hash(seed * 29.7)) - 0.5);
      pos += dir * uNoise * (0.6 + 0.4 * sin(uTime * 0.8 + seed * TAU));
    }
    bool resting = uFrom == 0 && uTo == 0;
    vec3 n = resting ? normal : normalize(pos + vec3(0.0001));
    pos += n * 0.02 * sin(uTime * 0.6 + seed * TAU) * uIdle;
    if (resting) {
      float across = (from.x + 2.4) / 4.8;
      heat *= 1.0 - smoothstep(uHeatGate - 0.25, uHeatGate, across);
    }
    // Identical to the node shader's spread, so an edge warms with its ends.
    if (resting && uSpread > 0.0) {
      float front = uSpread * 2.9;
      float reach = abs(from.x) + 0.3 * seed;
      heat = max(heat, 0.78 * (1.0 - smoothstep(front - 0.5, front, reach)));
    }
    return vec4(pos, heat);
  }

  void main() {
    vec4 self = place(aIndex, aSeed, aNormal);
    vec4 other = place(aOther, aSeedOther, aNormalOther);

    vHot = min(self.w, other.w);
    float key = dot(normalize(self.xyz + vec3(0.0001)), uKeyDir);
    vShade = 0.15 + 0.85 * smoothstep(-0.8, 0.9, key);
    // Fade edges that a formation has stretched: 0.22 → 0.30 world units,
    // tightening to 0.07 → 0.11 as the object becomes the mark, where any
    // edge longer than the mesh spacing reads as a scratch across the logo.
    float markness = uTo == 5 ? (uFrom == 5 ? 1.0 : uMix) : (uFrom == 5 ? 1.0 - uMix : 0.0);
    float fadeFrom = mix(0.22, 0.07, markness);
    float fadeTo = mix(0.30, 0.11, markness);
    vStretch = 1.0 - smoothstep(fadeFrom, fadeTo, distance(self.xyz, other.xyz));
    vProx = 1.0 - smoothstep(0.35, 0.95, distance(self.xy, uPointerWorld));
    bool resting = uFrom == 0 && uTo == 0;
    vPresence = presence(self.xyz, resting);

    vec4 mvPosition = modelViewMatrix * vec4(self.xyz, 1.0);
    vDepth = -mvPosition.z;
    gl_Position = projectionMatrix * mvPosition;
  }
`);

export const edgesFragment = stripGlsl(/* glsl */ `
  precision highp float;

  in float vHot;
  in float vShade;
  in vec2 vPresence;
  in float vDepth;
  in float vStretch;
  in float vProx;

  uniform vec3 uGraphite;
  uniform vec3 uSilver300;
  uniform vec3 uEmber;
  uniform vec3 uFogColor;
  uniform float uFogDensity;
  uniform float uOpacity;
  uniform float uProximity;
  uniform float uEmberPass;
  uniform float uEncodeSRGB;
  uniform float uGain;
  uniform float uStruct;

  out vec4 fragColor;

  // Linear → sRGB. Custom shaders get no automatic output transform.
  vec3 toSRGB(vec3 c) {
    vec3 lo = 12.92 * c;
    vec3 hi = 1.055 * pow(max(c, vec3(0.0)), vec3(1.0 / 2.4)) - 0.055;
    return mix(lo, hi, step(vec3(0.0031308), c));
  }

  void main() {
    if (vStretch <= 0.001) discard;
    if (uEmberPass > 0.5 && vHot < 0.5) discard;

    // Graded rather than binary: the spread's 0.78 heat warms an edge
    // toward ember, the line's 1.0 takes it all the way.
    float hot = smoothstep(0.5, 1.0, vHot);
    vec3 color = mix(mix(uGraphite, uSilver300, vShade) * 0.85, uEmber, hot);
    float alpha = mix(0.45, 0.6, hot);
    // The formed object's structure lifts with its nodes (nodes.ts).
    color *= mix(1.0, uStruct, 1.0 - hot);
    alpha *= mix(1.0, 0.5 + 0.5 * uStruct, 1.0 - hot);
    alpha *= 1.0 + 0.6 * vProx * uProximity;

    float fog = 1.0 - exp(-uFogDensity * uFogDensity * vDepth * vDepth);
    color = mix(color, uFogColor, fog);

    float depthCue = 1.0 - 0.45 * smoothstep(4.5, 7.5, vDepth);
    alpha *= depthCue * vStretch * uOpacity * mix(vPresence.y, vPresence.x, hot);

    if (uEmberPass > 0.5) {
      vec3 e = uEmber * 1.2 * hot;
      if (uEncodeSRGB > 0.5) e = toSRGB(min(e, vec3(1.0)));
      fragColor = vec4(e * alpha, alpha);
      return;
    }
    color *= uGain;
    if (uEncodeSRGB > 0.5) color = toSRGB(min(color, vec3(1.0)));
    fragColor = vec4(color * alpha, alpha);
  }
`);
