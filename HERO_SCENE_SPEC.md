# Inflexions I.T. — Hero Scene Specification

**3D art direction and technical direction for the home page arrival (Beat 0 to Beat 2)**
**Prepared:** 21 September 2026
**Audience:** the engineer or agent implementing `src/three/core/`, and the owner for the two decisions in Section 11
**Relation to other documents:** `CREATIVE_DIRECTION_3D.md` Section 6 defines the Core in principle. This document is authoritative for the hero and revises three things there: formation data is generated on the client instead of downloaded (Section 4.3), bloom is selective rather than luminance-thresholded (Section 6.4), and there is no intro dolly (Section 5.2). `SCROLL_NARRATIVE.md` owns the copy and beat order.

---

## 0. What the hero is

A dark, still room with one object in it. The object is the Core in its resting formation, the **Inflection**: about sixteen thousand graphite points on an S-curve sheet, joined by hairline edges, with a single line of ember-lit nodes running along the curve's inflection. Type sits on the left. The object sits on the right, slightly behind the type in depth, breathing. When the visitor moves the cursor, the object tilts a few degrees toward it and the nodes nearest the cursor warm. When the visitor scrolls, the camera rises and the object recedes to make room for the client roster.

Nothing spins. Nothing flies in. The only "arrival" motion is the ember line lighting from left to right over 1.8 seconds after the live scene replaces the poster. The visitor should feel they walked into a room where something was already running.

---

## 1. Brand palette in the scene

Colours are authored as sRGB hex in the design tokens and used in linear space in the shaders. The renderer converts on output. Values below are the linear equivalents the shader uniforms carry.

| Token | sRGB | Linear RGB | Role in the scene |
|---|---|---|---|
| `obsidian-950` | `#07080B` | 0.0021, 0.0024, 0.0033 | Vignette edge colour |
| `obsidian-900` | `#0A0C10` | 0.0030, 0.0037, 0.0056 | Renderer clear colour, fog colour, poster background |
| `graphite` | `#8F8D8D` | 0.274, 0.266, 0.266 | Node base colour, edge colour |
| `silver-300` | `#C9CBD1` | 0.584, 0.597, 0.630 | Key-lit node colour (heat 0.5) |
| `silver-100` | `#E6E7EA` | 0.791, 0.799, 0.822 | Rim highlight |
| `ember` | `#FF3B2F` | 1.000, 0.045, 0.028 | Lit nodes, emitted at 1.4× for selective bloom |
| `red-500` | `#BD2E25` | 0.508, 0.027, 0.018 | Never in the scene. UI only. |

### 1.1 Three things about red that decide the pipeline

1. **Red is dark.** Ember's relative luminance is 0.25, so a conventional luminance-threshold bloom (threshold 0.8) never sees it. Pushing ember to 4× intensity to clear the threshold would pass it through the tone mapper at a value that skews toward orange and pink. The scene therefore uses **selective bloom**: ember nodes are rendered to their own layer and bloomed with threshold 0. Ember stays at a modest 1.4× and keeps its hue. See Section 6.4.
2. **Red on near-black halates on real displays.** A saturated red at full intensity next to `#0A0C10` fringes on OLED phones and cheap office panels. Ember nodes are never larger than 4 px, and the bloom radius is small (mipmap blur, two levels). The glow reads as heat, not as a neon sign.
3. **Tone mapping must not shift ember's hue.** ACES pushes bright saturated red toward orange. The scene uses **AgX** tone mapping (`THREE.AgXToneMapping`, exposure 1.0), which holds hue better in this range. Verify with a swatch test in Phase 1: an ember node at 1.4× must read as `#FF3B2F` ±6° hue on a calibrated display after the full pipeline.

### 1.2 What the palette rules out

No blue-white fill, no cyan glow, no gradient backgrounds that drift toward navy. The brand is white, grey, and red; in the dark register that means obsidian, graphite, silver, and ember. Any cool tint that creeps in through fog, vignette, or noise is a defect. The rim light is neutral silver, not cool.

### 1.3 Banding

Dark gradients on 8-bit panels band. The obsidian vignette and the fog falloff are both gradients from almost-black to black. Mitigation is mandatory: the composer runs in `HalfFloatType` buffers, output is sRGB, and the final `Noise` pass at 0.035 opacity doubles as dither. Check by screenshotting the hero on a 1080p panel and levelling the shadows +60 in an image editor: no visible stepping is the bar.

---

## 2. Device mix

### 2.1 What we know and what we do not

The site has no analytics instrumentation (no GA4, no Vercel Analytics, nothing in `src/` or `package.json`). The mix below is an **assumption** built from the audience analysis in `CREATIVE_DIRECTION_3D.md` Section 2, the Ghanaian market data StatCounter publishes for platform and mobile OS share ([platform share, Ghana](https://gs.statcounter.com/platform-market-share/desktop-mobile-tablet/ghana); [mobile OS share, Ghana](https://gs.statcounter.com/os-market-share/mobile/ghana); [mobile vendors, Ghana](https://gs.statcounter.com/vendor-market-share/mobile/ghana)), and the fact that this is a B2B site read mostly in working hours.

**Add analytics in Phase 0** (Vercel Analytics is the zero-config option on this host, and it respects the existing Content Security Policy once `va.vercel-scripts.com` is added to `script-src` and `connect-src`) and replace this table with a month of real data before Gate 1.

### 2.2 Assumed mix and what each row gets

| Segment | Assumed share | Typical hardware | GPU class | Tier |
|---|---|---|---|---|
| Office Windows laptop, Chrome or Edge | 40% | i5 or i7, Intel UHD 620 to Iris Xe, 1366×768 or 1920×1080, DPR 1 to 1.25 | Integrated | **A** |
| Office or home Mac, Safari or Chrome | 8% | Apple silicon, 2560×1600, DPR 2 | Strong integrated | **A** |
| Android phone, Chrome | 35% | Samsung A-series, Tecno, Infinix; Mali-G52 to G57 or Adreno 6xx; 2 to 6 GB RAM; DPR 2 to 3 | Weak to mid | **B** if RAM ≥ 4 GB and viewport ≥ 360 px; otherwise **C** |
| iPhone, Safari | 10% | A13 or newer, DPR 3 | Strong | **B** (mobile layout) |
| Tablet | 3% | iPad or Samsung Tab | Mid to strong | **B** |
| Anything with reduced motion, save-data, no WebGL 2, or a failed probe | 4% (overlaps the above) | Any | Any | **C** |

Roughly half of visits get the live scene, a third get the reduced scene, and the rest get the posters. All three are designed, and Tier C is reviewed on a real phone before Phase 1 is signed off.

### 2.3 Reference devices for acceptance

| Tier | Device | Condition |
|---|---|---|
| A floor | 2018 Windows laptop, Intel UHD 620, 1920×1080 at DPR 1, Chrome | Must hold Tier A. If it downgrades, the scene is too heavy. |
| A target | Intel Iris Xe laptop, 1920×1080 at DPR 1.25 | 60 fps with post-processing |
| B floor | Samsung Galaxy A14 or equivalent, Chrome, real 4G in Accra | 45 fps or better, no post |
| B target | iPhone 13 or newer, Safari | 60 fps, no post |
| C | Any device with reduced motion enabled | Posters, never a canvas |

---

## 3. Loading budget

### 3.1 The two clocks

The hero has two independent deadlines. Missing the first is a failure. Missing the second is graceful.

| Clock | Target | On what | What the visitor sees if missed |
|---|---|---|---|
| **Largest Contentful Paint** | ≤ 2.5 s | Lighthouse mobile, slow 4G (1.6 Mbps down, 150 ms RTT), 4× CPU throttle | A slow site. Unacceptable. |
| **Time to live scene** | ≤ 2.0 s after LCP on desktop wifi; ≤ 6.0 s on Tier B over 4G | Real devices | The poster stays a little longer. Fine. After 8 s the swap is abandoned and the poster stays for the session. |

### 3.2 Critical path (what must arrive before LCP)

| Asset | Budget (gzipped or as served) | Notes |
|---|---|---|
| HTML document with hero copy | ≤ 30 KB | Copy is server-rendered. The H1 is in the first byte. |
| Route shell JavaScript | ≤ 190 KB | Next runtime, React, page, motion primitives, GSAP core and ScrollTrigger, Lenis. Nothing from three.js. |
| CSS | ≤ 25 KB | Tailwind output for the marketing routes. |
| Rubik 700 and 400, Krub 500 | ≤ 90 KB | Already `display: swap` and preloaded via `next/font`. Latin subset only. |
| Poster LQIP | ≤ 1 KB | 24 px wide WebP as a base64 `data:` URI in the HTML, blurred with CSS, painted immediately. |
| Poster (the LCP element) | ≤ 160 KB desktop, ≤ 90 KB mobile | See Section 9.1. A dark point field compresses extremely well. |
| **Total before LCP** | **≤ 500 KB** | At 1.6 Mbps that is about 2.5 s including RTTs, which is why the shell budget is hard. |

### 3.3 Deferred path (after LCP, Tier A and B only)

> **Budgets and the post stage are superseded by `PERFORMANCE_PLAN.md` Sections 2 and 3 (22 September 2026):** the `postprocessing` library is replaced by a three-pass hand-written stage, GSAP and Lenis move to a separate motion chunk, and the DPR cap becomes a 4.2-megapixel canvas cap.

| Asset | Budget | Notes |
|---|---|---|
| Environment chunk | ≤ 230 KB gzipped | `three` core, `@react-three/fiber`, `postprocessing`, the Core components and shaders. Tree-shaken; no `drei` beyond what is imported by name. |
| Mark silhouette | ≤ 12 KB | `public/brand/mark.svg`, fetched only when the visitor reaches Beat 8. Not part of the hero load. |
| Formation data | **0 KB** | Generated on the client in a Web Worker. See Section 4.3. This replaces the 700 KB `core.bin` in the creative direction. |
| GPU upload | ≈ 1.6 MB VRAM | Position texture 128×768 RGBA16F plus geometry buffers. Trivial. |

Desktop office wifi at 20 Mbps: the environment chunk arrives in about 0.1 s and the worker generates all six formations in under 80 ms on an i5. Time to live scene is dominated by shader compilation, roughly 0.3 to 0.8 s on Intel integrated graphics. Compile happens while the poster is showing, so the visitor never sees it.

### 3.4 Runtime budget per frame (Tier A, 1920×1080, DPR 1.25)

| Pass | Budget | Notes |
|---|---|---|
| Nodes (Points) | 1.2 ms | 16,384 vertices, one draw call |
| Edges (LineSegments) | 1.0 ms | 49,152 vertices, one draw call |
| Ground | 0.1 ms | Off in the hero formation |
| Ember layer re-render for selective bloom | 0.6 ms | Nodes only, ember subset via draw range |
| Bloom (mipmap blur, 2 levels, half resolution) | 1.6 ms | The most expensive pass; do not raise levels |
| Vignette + Noise + tone map (merged effect pass) | 0.5 ms | One full-screen pass |
| **Total GPU** | **≤ 5.0 ms** | Leaves headroom under 16.7 ms for the browser's own compositing |
| CPU per frame | ≤ 1.5 ms | Uniform writes, damping, no allocations in the loop |

---

## 4. Model list and geometry limits

There are four renderable objects. Nothing else is added to the scene without a budget line.

| # | Object | Type | Vertex count | Draw calls | Tier A | Tier B | Notes |
|---|---|---|---|---|---|---|---|
| 1 | Core nodes | `THREE.Points`, custom `ShaderMaterial` | 16,384 | 1 (+1 for ember layer) | 16,384 | 8,192 via `drawRange` | Positions fetched from a texture in the vertex shader |
| 2 | Core edges | `THREE.LineSegments`, custom `ShaderMaterial` | 49,152 (24,576 segments) | 1 | 24,576 seg | 12,288 seg via `drawRange` | Endpoints reference node indices |
| 3 | Ground grid | `THREE.Mesh`, `PlaneGeometry(14, 14)` | 4 (2 triangles) | 1 | on in formations 1 and 4 | on | Off in the hero. Listed so nobody adds a 1024-segment plane later. |
| 4 | Mark silhouette (formation 5) | data only, sampled into object 1 | — | 0 | — | — | 16,384 sample points from `mark.svg`, computed once on first use |

**Hard limits.** Total scene vertices ≤ 66,000. Total draw calls including post passes ≤ 8. No meshes with more than 2 triangles in the hero. No skinned or morph-target meshes anywhere. No loaded `.glb` in this phase.

### 4.1 Node ordering (this matters)

Node index order is not random. The bake sorts nodes so that:
- Indices 0 to 8,191 are a uniform stratified subsample of the full set. Tier B draws only these and the object keeps its silhouette.
- Within each half, ember-capable nodes (heat > 0 in any formation) come first. The ember layer pass draws only the leading run of each half with `drawRange`, so selective bloom never touches graphite nodes.
- Edge segments are sorted the same way: edges whose both endpoints are within the first 8,192 nodes come first, so Tier B's `drawRange` on the edges is also a clean prefix.

### 4.2 The Inflection formation (hero geometry)

- Sheet: `z = 0.9 · tanh(1.6 · x)` for `x ∈ [−2.4, 2.4]`, `y ∈ [−1.3, 1.3]`.
- Sampling: hexagonal lattice with 0.038 spacing, jittered by 0.006, which yields about 16,400 candidates trimmed to exactly 16,384 by dropping the outermost.
- Per-node y noise: 3-octave simplex, amplitude 0.05, frequency 1.7, so the sheet is not a perfect ruled surface.
- Heat: nodes with `|x| < 0.11` get heat 1.0 (the inflection line, about 6% of nodes). Nodes with `0.11 ≤ |x| < 0.35` get a falloff `1 − smoothstep(0.11, 0.35, |x|)` scaled to 0.3. All others 0.
- Edges: for each node, connect to its 3 nearest neighbours in the lattice (deduplicated), which gives about 24,000 segments. Edges longer than 0.09 are dropped so the sheet never shows stray long lines.
- Object space is centred at the origin. World placement is done by the camera, not by transforming the object.

### 4.3 Generation on the client (revision to the creative direction)

The creative direction specified a 700 KB baked `core.bin`. That is the wrong trade. Sixteen thousand points on analytic surfaces are cheap to compute and expensive to download on 4G. The revised approach:

- `src/three/core/worker/formations.worker.ts` generates formations 0 to 4 from a fixed seed (`0x1NF1EX`) using a seeded PRNG (`mulberry32`) and a small simplex implementation. Determinism is required so the posters match the live scene exactly.
- Output is a single `Float32Array` of `16,384 × 6 × 4` (RGBA, A unused) transferred to the main thread and uploaded as one `DataTexture` 128 × 768, `RGBA16F`, `NearestFilter`, no mipmaps. Row block `f` (128 rows) holds formation `f`.
- Edge index pairs are a `Uint16Array` of 49,152, generated in the same worker from formation 0's lattice and reused for all formations (the edge *topology* never changes, only the endpoint positions).
- Formation 5 (the mark) is generated lazily when Beat 8 first comes within 200 vh: fetch `mark.svg`, sample 16,384 points inside its filled path with rejection sampling, sort them to match the node ordering rule, and write into row block 5.
- `scripts/bake-core.mjs` remains, but its job is now to run the identical generator in Node for the poster capture route and to assert byte-equality with the worker output in CI.

Worker time on an i5: under 80 ms total. On a Galaxy A14: about 250 ms, still hidden behind the poster.

---

## 5. Camera

### 5.1 Rig

- `PerspectiveCamera`, vertical FOV 32°, near 0.1, far 40.
- The camera is the only thing that moves the object on screen. The object never rotates in world space. This keeps the poster and the live scene in exact registration, because the poster is captured from the same camera keyframe.
- Composition target: the object's visual centre sits at **68% of viewport width, 52% of viewport height** on desktop aspect ratios (≥ 1.4). Type occupies columns 1 to 5 of 12 and never overlaps the object's dense region.

### 5.2 Keyframes

There is no intro dolly. The poster is captured at the *hero* keyframe, so any camera motion during the crossfade would show as a jump. The arrival is expressed by light (Section 6.5), not by camera.

| Key | Scroll (vh) | Position (x, y, z) | Look-at (x, y, z) | FOV | Notes |
|---|---|---|---|---|---|
| **Hero** | 0 | 0.90, 0.35, 5.40 | 0.45, 0.05, 0 | 32 | Poster is captured here. Object slightly right and below centre-line of the camera so its top edge clears the H1 baseline. |
| **Trust** | 100 | 0.70, 0.90, 6.10 | 0.30, −0.20, 0 | 32 | Camera rises and pulls back. The object drops to the lower 60% of the viewport, making room for the roster to slide across the top third. |
| **Turning point** | 130 | 0.40, 0.50, 4.40 | 0.10, 0.00, 0 | 32 | Camera comes in close and centres. Beat 2's copy sits left; the object fills the right half. Noise displacement begins here (owned by the timeline, not the camera). |

Interpolation between keys is scrubbed by ScrollTrigger with `scrub: 0.8` and `power4.inOut` on the eased progress. Position and look-at are interpolated separately; FOV is constant in the hero so the poster registration holds.

### 5.3 Aspect handling

| Aspect | Adjustment |
|---|---|
| ≥ 1.4 (desktop) | As specified. |
| 1.0 to 1.4 (small laptop, tablet landscape) | Camera z +0.6. Object centre moves to 62% width. |
| < 1.0 (portrait) | Stacked layout. Camera z 6.4, y 0.9, look-at (0, 0.55, 0), FOV 40. Object occupies the lower 55% of the viewport below the copy. The dense region must not sit behind the CTA. |

### 5.4 Breathing

A constant, scroll-independent idle: the camera position gets `+0.012 · sin(t · 0.35)` on y and `+0.008 · sin(t · 0.23 + 1.3)` on x. Period around 18 s. It is below conscious notice and prevents the frame from ever being perfectly static. Disabled in Tier B on touch (the object's own idle motion, Section 6.6, is enough) and in Tier C (no canvas).

---

## 6. Lighting rig

The nodes and edges are unlit primitives. Scene lights do nothing to them. The rig is therefore **implemented in the shaders as three virtual lights plus atmosphere**, and it is documented as a rig so that art decisions are made as lighting decisions, not as colour hacks.

| Light | Direction (world, normalised) | Colour | Term | Contribution |
|---|---|---|---|---|
| **Key** | from upper-left-front: (−0.55, 0.75, 0.37) | `silver-300` | `0.55 + 0.45 · max(0, dot(n, L_key))` where `n` is the sheet's analytic normal at the node (computed in the worker, stored in a second texture row block for formation 0 only; other formations use `normalize(pos)`) | Sets the graphite-to-silver gradient across the sheet. The upper-left of the sheet reads brightest, which places the light on the side of the type and ties the two halves of the composition. |
| **Rim** | from behind-right: (0.65, 0.15, −0.74) | `silver-100` | `0.35 · pow(max(0, dot(n, L_rim)), 3.0)` | Separates the object's right silhouette from the obsidian. Without it the far edge dissolves. Neutral, never cool. |
| **Ember** | self-illumination | `ember` × 1.4 | `heat · pulse`, where `pulse = 0.85 + 0.15 · sin(t · 0.9 + seed · 6.28)` | The only saturated colour in the scene. Sent to the selective bloom layer. |

Atmosphere:
- **Fog**: `FogExp2(obsidian-900, 0.085)`. At the hero keyframe the near edge of the sheet is at camera distance ≈ 4.4 (fog factor 0.69) and the far edge ≈ 6.6 (0.57). The depth cue is gentle; the fog is there to kill the far edge's crispness, not to hide the object.
- **Vignette**: `offset 0.35, darkness 0.6`, colour `obsidian-950`.
- **Noise**: 0.035, premultiplied, animated per frame (it is dither, not film grain; it must not be visible as texture).
- **No ambient term, no environment map, no shadows.** There is nothing for them to act on.

### 6.4 Selective bloom (revision to the creative direction)

- Ember-capable nodes are on `layers` bit 1 in addition to bit 0. The `SelectiveBloomEffect` from `postprocessing` renders bit 1 to its own buffer and blooms it with `luminanceThreshold: 0`, `intensity: 0.55`, `mipmapBlur: true`, `levels: 2`, `radius: 0.5`, `resolutionScale: 0.5`.
- Because the ember layer is re-rendered, it is drawn with the node `drawRange` restricted to the ember prefix (Section 4.1). Cost is 0.6 ms, not another full nodes pass.
- Bloom intensity is a uniform the timeline can raise in Beat 8 (to 0.9) and nowhere else.

### 6.5 The arrival light

The one scripted lighting event in the hero. After the poster-to-live crossfade completes:

- `uHeatGate` runs from −0.3 to 1.3 over 1.8 s with `expo.out`. Each node's effective heat is `heat · smoothstep(uHeatGate − 0.25, uHeatGate, (x + 2.4) / 4.8)`, so the ember line lights from left to right across the sheet.
- Two posters are captured: **unlit** (`uHeatGate = −0.3`) and **lit** (`1.3`). The LCP poster is the unlit one. The live scene mounts at the unlit state, so the poster-to-live crossfade shows no visible change; then the arrival light plays in the live scene. A single lit poster would force the crossfade to dim the line before relighting it, which reads as a glitch, so the unlit poster is not optional.
- Tier C, which has no live scene, crossfades unlit poster → lit poster over 1.8 s with CSS and gets the same beat for about 60 KB extra. See Section 9.

### 6.6 Object idle

Independent of the camera breathing: each node's position gets `0.02 · sin(t · 0.6 + seed · 6.28)` along the sheet normal. Edges follow because their endpoints sample the same displaced positions. The sheet looks like it is breathing very slowly. Amplitude is a uniform so Tier B can halve it.

---

## 7. Material treatment

### 7.1 Nodes

Vertex shader:
- Fetch `posFrom` and `posTo` from the position texture by `(aIndex, uFrom)` and `(aIndex, uTo)`.
- Per-node travelling mix: `m = smoothstep(0, 1, (uMix − aSeed · 0.35) / 0.65)`.
- Curl-noise displacement at mid-transition: `pos += curl(pos · 0.8 + uTime · 0.1) · 0.18 · sin(m · π)`. In the hero `uMix = 0`, so this is inert.
- Idle displacement along normal (Section 6.6).
- Point size: `uSize · (1.0 + 0.4 · heat) · (uDPR) · (5.4 / viewDistance)`, clamped to `[1.5, 4.0] · uDPR` px. Base `uSize = 2.2`.
- Pass `vHeat`, `vShade` (key + rim term), `vDepth` to the fragment shader.

Fragment shader:
- Soft disc: `core = 1 − smoothstep(0.18, 0.28, d)` and `halo = (1 − smoothstep(0.28, 0.5, d)) · 0.35`, where `d` is distance from sprite centre in `[0, 0.5]`. The hard core is what makes the nodes read as points rather than blobs.
- Colour ramp by heat: `mix(graphite · vShade, silver300 · vShade, smoothstep(0, 0.5, heat))` then `mix(that, ember · 1.4, smoothstep(0.5, 1.0, heat · pulse))`.
- Alpha: `(core + halo) · depthCue`, with `depthCue = 1 − 0.45 · smoothstep(4.5, 7.5, vDepth)`.
- Blending: normal, premultiplied alpha, `depthWrite: false`, `depthTest: true`. Ember nodes are not additive; their glow comes from the bloom pass, which keeps them from blowing out into white.

### 7.2 Edges

- Each edge vertex carries `aIndex` (its node) and `aOther` (the other endpoint's node) so the shader can compute `vHot = min(heat(aIndex), heat(aOther))`.
- Colour: `graphite · 0.9` at alpha 0.18; where `vHot > 0.5`, `ember` at alpha 0.5. The edge alpha also takes the depth cue.
- Width: 1 device pixel. WebGL cannot draw wider lines portably and this scene does not want them. On DPR 2 and 3 devices, 1 device pixel is a genuinely fine hairline, which is the intended look.
- Blending: normal, premultiplied, `depthWrite: false`.

### 7.3 Ground grid (not visible in the hero)

- Unlit `ShaderMaterial` drawing a 0.5-unit grid with 1.5 px anti-aliased lines via `fwidth`, alpha 0.06, radial fade to 0 at radius 6. Colour `graphite`. Rendered only when `uGroundAlpha > 0`, which the timeline sets in formations 1 and 4.

### 7.4 What is banned in materials

`MeshStandardMaterial`, `MeshPhysicalMaterial`, transmission, clearcoat, environment maps, HDR textures, sprite textures for the nodes (the disc is procedural), additive blending on graphite, any texture larger than the 128×768 position texture.

---

## 8. Interaction on cursor move

Three responses, all damped, all capped, none of them visible on touch.

### 8.1 Parallax (the object tilts toward the cursor)

- Input: pointer position normalised to `[−1, 1]` on both axes over the viewport, `uPointer`.
- The camera orbits about the look-at point by `yaw = −uPointer.x · 4°` and `pitch = uPointer.y · 2.5°`. Applied as an offset on top of the scroll keyframes, so it composes with the scroll-out.
- Damping: `current += (target − current) · 0.06` per frame at 60 Hz, made frame-rate independent with `1 − pow(1 − 0.06, dt · 60)`.
- On `pointerleave` from the window, target returns to `(0, 0)` and settles over about 1.2 s.
- Behind the pointer, nothing accelerates. The maximum angular velocity is bounded by the damping, so a fast mouse sweep produces a slow, heavy tilt. This is the single most important feel parameter. Tune `0.06`, never higher than `0.09`.

### 8.2 Proximity warmth (nodes near the cursor warm up)

- The pointer is unprojected onto the plane `z = 0.9 · tanh(1.6 · x)` approximately by ray-marching the sheet in the vertex shader's inverse: in practice, unproject onto the plane `z = 0` and pass `uPointerWorld` (x, y). The sheet is shallow enough that this is visually correct.
- Per node: `prox = 1 − smoothstep(0.35, 0.95, distance(pos.xy, uPointerWorld))`. Effective heat becomes `max(heat, prox · 0.35)`. Nodes near the cursor rise toward silver, not toward ember; only the inflection line is ever ember. Edges near the cursor get alpha × 1.6.
- `uPointerWorld` is damped at 0.08 so the warmth trails the cursor slightly, like heat lingering.
- Radius and strength are uniforms. Do not let the effect exceed 0.35 heat; at 0.5 the cursor starts "painting" and the scene becomes a toy.

### 8.3 Nothing else

- The CTA button is a DOM element with its own magnetic behaviour (`Magnetic.tsx`, 6 px cap). It does not talk to the scene.
- Clicking the canvas does nothing. `pointer-events: none` on the canvas; the pointer is read from a `window` listener.
- No cursor sprite, no trail, no ripple on click.

### 8.4 Touch and reduced motion

- Touch devices: parallax and proximity are off. The camera runs a slow 20 s elliptical drift of 1.5° instead, so the scene is not dead.
- Reduced motion: no canvas at all (Tier C).

---

## 9. Fallback for low-power devices

### 9.1 Posters

Captured from the real scene by `scripts/capture-posters.mjs` (Playwright, headless Chromium with `--use-angle=swiftshader` for determinism) at the **Hero** keyframe.

| Poster | Size | Format | Target weight | Purpose |
|---|---|---|---|---|
| `f0-unlit-desktop.webp` | 2560×1440 | WebP q80 | ≤ 160 KB | LCP element on desktop |
| `f0-lit-desktop.webp` | 2560×1440 | WebP q80 | ≤ 170 KB | Tier C arrival crossfade target |
| `f0-unlit-mobile.webp` | 1170×2532 | WebP q80 | ≤ 90 KB | LCP element on portrait |
| `f0-lit-mobile.webp` | 1170×2532 | WebP q80 | ≤ 100 KB | Tier C arrival |
| LQIP | 24×14 | WebP, base64 inline | ≤ 1 KB | Painted at first byte, blurred 24 px |

Posters are served through `next/image` with `priority` and `fetchPriority="high"`, `sizes="100vw"`. The `<img>` sits in a fixed full-viewport container behind the copy with `object-fit: cover; object-position: 68% 52%` on desktop and `50% 70%` on portrait so the object's visual centre matches the camera composition at any viewport.

### 9.2 Tier decision, in order

Run once on the client, before the environment chunk is requested.

1. `prefers-reduced-motion: reduce` → **C**.
2. `navigator.connection.saveData === true` or `prefers-reduced-data: reduce` → **C**.
3. No WebGL 2 context (`canvas.getContext('webgl2')` fails) → **C**.
4. `navigator.deviceMemory` defined and < 4 → **C**.
5. `navigator.hardwareConcurrency` defined and < 4 → **B** (if viewport ≥ 1024) or **C**.
6. Viewport < 1024 px, or a coarse primary pointer → **B**.
7. Otherwise → **A**.

Then the **probe**: for the first 90 frames after the live scene is mounted (still hidden behind the poster), measure frame time. If the mean exceeds 24 ms in Tier A, demote to B (halve node and edge draw ranges, dispose the composer). If the mean exceeds 24 ms in Tier B, demote to C: dispose the renderer, never crossfade, keep the poster. The probe result is stored in `sessionStorage` so a demotion does not repeat on every route.

### 9.3 The crossfade contract

- The live scene is only allowed to replace the poster when all of: shaders compiled, the worker has delivered formation 0, three consecutive frames rendered under 20 ms, and fewer than 8 s have elapsed since LCP.
- Crossfade: 900 ms, `ease.out`, poster opacity 1 → 0 over the live canvas, with the live scene at the unlit state and the camera at the Hero keyframe plus whatever scroll offset the visitor has already reached. Then the arrival light plays.
- If the visitor has scrolled past 130 vh before the scene is ready, skip the arrival light; the scene fades in at its scrubbed state.
- On `webglcontextlost`: fade the poster back in over 300 ms, dispose, do not attempt restore. The poster is the correct state for the rest of the session.

### 9.4 What each tier gets in the hero

| Element | Tier A | Tier B | Tier C |
|---|---|---|---|
| Nodes | 16,384 | 8,192 | Poster |
| Edges | 24,576 seg | 12,288 seg | Poster |
| Post-processing | Bloom, vignette, noise | None. Ember glow is faked in-shader: ember nodes get a 2.4× soft halo with additive blending, which costs nothing. Vignette is a CSS radial gradient over the canvas. | CSS vignette over the poster |
| DPR | min(devicePixelRatio, 1.75) | 1.0 | n/a |
| Arrival light | Yes, 1.8 s | Yes, 1.8 s | Unlit → lit poster crossfade, 1.8 s, CSS |
| Camera breathing | Yes | Only if fine pointer | None |
| Parallax and proximity | Yes | Only if fine pointer | None |
| Touch drift | n/a | Yes | None |
| Scroll-out camera | Yes | Yes | Poster scales 1.0 → 1.06 and translates up 40 px over 0 to 130 vh (CSS, scrubbed via `animation-timeline: scroll()` where supported, else static) |
| Tone mapping | AgX | AgX (renderer-level, free) | Baked into the poster |

Tier B is not a degraded Tier A. It is designed on its own, and the in-shader halo must be tuned so a side-by-side with Tier A reads as the same object.

---

## 10. Acceptance checks specific to the hero

1. **Registration.** Overlay the unlit desktop poster on a live Tier A frame at the Hero keyframe at 50% opacity. Every node must land on itself. Any drift means the worker and the bake diverged or the camera moved.
2. **Hue.** Sample the brightest ember pixel after the full pipeline. Hue must be within ±6° of `#FF3B2F`.
3. **Banding.** Level the shadows +60 on a 1080p screenshot. No visible stepping in the vignette or fog.
4. **Frame time.** Tier A floor device: 99th percentile ≤ 20 ms across a 30 s idle plus a full 0 to 130 vh scroll. Tier B floor: ≤ 26 ms.
5. **Poster weight.** All four posters within budget. If the lit desktop poster exceeds 170 KB, reduce quality to 76 before touching resolution.
6. **LCP.** ≤ 2.5 s, Lighthouse mobile preset, with the environment chunk confirmed absent from the critical path (it must not appear before the LCP mark in the network waterfall).
7. **Parallax feel.** A fast mouse sweep edge to edge produces a tilt that takes at least 0.6 s to settle. If it snaps, damping is too high.
8. **Proximity cap.** With the cursor held on the sheet's centre, no node exceeds silver; no ember appears outside the inflection line.
9. **Tier C on a real phone.** Galaxy A-series with reduced motion on: no canvas element in the DOM, posters within budget, the arrival crossfade plays, text is readable over the poster at every viewport from 360 px.
10. **Context loss.** Simulate `WEBGL_lose_context`. Poster returns within 300 ms; no console errors after.

---

## 11. Decisions and assets needed from the owner

1. ~~Analytics.~~ **Decided 21 September 2026: GA4 approved and wired.** `src/app/components/GoogleAnalytics.tsx` loads gtag.js only when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set; the Content Security Policy in `next.config.ts` allows the Google Tag Manager script host and the GA4 collection endpoints. **Remaining action for the owner:** create a GA4 web data stream for inflexions.tech and set the Measurement ID (starts with `G-`) in the Vercel project's environment variables. Until it is set, nothing is tracked.
2. ~~The vector mark.~~ **Resolved provisionally on 21 September 2026.** No vector source existed anywhere in `public/`, so the mark was reconstructed from the 500 px favicon: upscaled 4×, thresholded to a binary mask with ImageMagick, red parts separated by saturation, and both traced to Bézier paths with a potrace port. Files in `public/brand/`: `mark.svg` (flat two-tone, `#BD2E25` and `#8F8D8D`, viewBox 500×512), `mark-silhouette.svg` (single `currentColor` path for the Formation 5 sampler), `mark-mask.png` and `mark-heat.png` (2000×2048 binary masks; the heat mask marks the red regions so the sampler can assign ember to the head, arms, and right leg). Quality is production-adequate for the 3D sampling and for the flat lockup at 24 px and above. A designer's master vector is still preferred for print and for the header lockup, and should replace these files when it exists; the file names and viewBox are the contract, so nothing downstream changes.

---

## 11a. Implementation notes (Phase 1, 22 September 2026)

What the build found that this specification got wrong or left open. Each
is now the behaviour of `src/three/core/`.

- **No React binding for three.** `@react-three/fiber` imports the whole of
  three as a namespace and resolves classes by name at runtime, which
  defeats tree shaking in every bundler: the environment chunk measured
  248 KB gzipped. The scene is vanilla three with named imports, driven by
  one `requestAnimationFrame` loop in `CoreScene.ts`; the chunk is 146 KB.
- **Custom shaders get no sRGB output transform** from three. Every shader
  that writes to the canvas encodes linear → sRGB itself (`toSRGB`), and the
  Tier A composite encodes once for the whole frame.
- **No tone mapping.** AgX crushed the palette, which is dark by design, to
  black. Colours are authored in sRGB, used in linear, written back
  unchanged; ember at 1.4× clips to a saturated red as intended.
- **Sheet spacing is derived from the node count**, not 0.038 as written in
  §4.2, which yields only 10k hex cells. Spacing is about 0.029.
- **Point size floor is 2.5 CSS px, base 3.6.** Below that the soft-disc
  fragment samples almost entirely in the halo and a dense sheet renders as
  specks.
- **The ember line is |x| < 0.032** (about 2% of nodes) with a skirt to
  0.12, not 0.11 and 0.35: the wider band read as a painted stripe.
- **Key shading is positional**, not normal-based: a near-flat sheet gives a
  normal-based key nothing to vary against. Rim stays normal-based.
- **The sheet dissolves at its borders and varies in density** (`presence`
  in both shaders) so it reads as a structure of light rather than a cut
  rectangle of cloth. Ember ignores the density field but respects the
  border.
- **Hero camera key** is (−1.3, 1.3, 6.0) looking at (−1.0, −0.15, 0),
  chosen from two capture rounds: the sheet sits right of the copy, seen
  from upper-left so its lower edge draws the S-curve.
- **`scene.background` must stay null.** three forces a clear on every
  `render()` when it is a Color, which wiped the base layer under the
  additive ember pass in Tier B.
- **Capture mode** (`capture: true`) disables the probe, the deadline, idle
  motion and pointer influence so headless software rendering can produce
  still, reproducible posters. Posters came in at 207 KB WebP / 120 KB AVIF
  desktop, above the §9.1 budget; see PERFORMANCE_PLAN.md for the decision.
- **Display XL is 4.6vw**, not 6.5vw, which wrapped the hero headline to six
  lines at 1440 px and pushed the call to action below the fold.
- **Tier B stand-ins for the post stage** (from the first real phone, 22
  September): the ember pass draws each ember node as a 3.2× soft Gaussian
  halo, additive, so the line glows without a bloom pass instead of reading
  as bare dots; the sheet takes a 1.25 linear gain to match the Tier A
  poster it fades from (`tierB` in rig.ts, `uEmberHalo` and `uGain`).
- **Touch drift is 4° over 12 s**, not 1.5° over 20 s: on a phone there is
  no parallax to supply motion and the spec value read as a still image.
- **The ember pulse travels down the line** (phase by height with a little
  per-node scatter) rather than flickering per node.


## 12. File additions

```
src/three/core/
  worker/formations.worker.ts   seeded generator, formations 0–4, edge topology
  worker/simplex.ts             small simplex + curl helpers shared with the bake
  tier.ts                       tier decision + probe (Section 9.2)
  posters.ts                    generated LQIP map and poster paths
  shaders/nodes.vert.glsl       Section 7.1
  shaders/nodes.frag.glsl
  shaders/edges.vert.glsl       Section 7.2
  shaders/edges.frag.glsl
  shaders/ground.frag.glsl
  rig.ts                        light directions, colours in linear, fog, bloom params
  camera.ts                     keyframes (Section 5.2), aspect rules, breathing
  pointer.ts                    damped pointer + unprojection (Section 8)
public/three/posters/
  f0-unlit-desktop.webp  f0-lit-desktop.webp  f0-unlit-mobile.webp  f0-lit-mobile.webp
scripts/
  bake-core.mjs                 runs the same generator in Node; asserts equality with the worker
  capture-posters.mjs           Playwright capture at the Hero keyframe, both light states, both aspects
```
