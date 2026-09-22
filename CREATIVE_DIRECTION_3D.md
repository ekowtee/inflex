# Inflexions I.T. — Premium 3D Web Experience

**Creative direction and front-end build blueprint**
**Prepared:** 21 September 2026
**Audience:** the coding agent (or engineer) who will build it, and the directors who will sign it off
**Status:** Direction locked in this document. Nothing here is built yet.

Read this whole document before writing code. Section 9 is the build order. Section 10 is the definition of done. Section 11 lists things that must never ship.

---

## 0. The verdict in one page

**What the site is today.** A competent, template-shaped IT services site. White canvas, red buttons, stock photography with holograms, fade-up-on-scroll sections. It reads as "capable mid-tier integrator". It does not read as "the team enterprises call when the stakes are highest", which is the positioning the brand book commits to.

**What the site must become.** A single, continuous, dimensional environment that makes the brand's one idea, the inflection point, physically visible, and then hands the visitor over to calm, editorial reading surfaces where the proof lives. The 3D work is not decoration. It is the argument: *one system, four disciplines, zero gaps*.

**The one idea.** Everything in the new site is built from a single 3D object, called **the Core**. It is a field of roughly sixteen thousand graphite nodes and the edges between them. Under scroll it is sculpted through five formations: a network lattice, a security enclosure, a cloud nebula, a data plane, and finally the Inflexions mark itself. The visitor does not watch four products. They watch one intelligent structure change shape without ever breaking apart. That is the brand promise rendered literally.

**The emotional target on arrival.** An exhale, then a lean forward. Quiet, dark, precise, expensive. Not loud, not "futuristic", not a video game. The feeling a CTO gets walking into a well-run data hall: cold air, low hum, everything labelled.

**The two registers.**
- **Obsidian** — the environment. Near-black, graphite, silver, and red used as *light*, never as fill. Home page narrative, pillar index, and the arrival moment of every interior page.
- **Ivory** — the reading room. The existing white canvas, refined. Proof, detail, forms, Academy catalogue, case studies.

Red stays the only accent. In Obsidian it glows. In Ivory it acts. It never floods.

**Ruthless constraints.** Sixty frames per second on a mid-range laptop. Largest Contentful Paint under 2.5 seconds on a mid-range Android on a 4G connection, because that is the phone the IT manager in Tema is holding. Zero layout shift. Full experience without the 3D chunk for anyone whose device or preferences say no. A premium site that stutters is worse than a plain one.

---

## 1. Brand story analysis

Source: `BRAND_IDENTITY.md`, `PRD.md`, `ACADEMY_PROPOSAL.md`, `src/app/data.ts`.

### 1.1 What the brand actually owns

| Asset | Strength | Use it for |
|---|---|---|
| The name: *inflection point* | Strongest asset. A mathematically precise metaphor for "the moment trajectory changes". Ownable, visual, and true to what a systems integrator does. | The Core's resting geometry is an inflection surface (an S-curve sheet). The word never needs explaining because the object explains it. |
| "Four Pillars. Zero Gaps." | Best line on the current site. It makes a structural claim, not an adjectival one. | The morph sequence is this line as choreography. |
| "Intelligent Infrastructure That Never Sleeps" | Approved hero line in the brand book. Good rhythm, active, specific. | Keep as the H1. |
| "Stop Patching. Start Performing." | Approved closing line. | Keep as the final CTA headline. |
| Proof numbers: founded 2012, 80+ years combined experience, 50+ enterprise clients, Blu Telecom 4G LTE core + Tier III data centre delivered in 2014 | Real, checkable, regional. The Blu case study is a genuinely rare credential in this market. | Counters and the proof chapter. Blu is the featured case on the home page. |
| The mark: ascending figure inside the X | Conceptually rich (human + star + turning point). Recognised by existing clients. | The final formation of the Core. The mark is the one thing allowed to be 3D in the identity because the environment earns it. |
| Archetype: Sage + Magician | Credible and visionary. Correct for enterprise buying. | Sage governs the reading surfaces. Magician governs the environment. Neither leaks into the other's register. |
| Frontier AI lab partnerships (Anthropic, OpenAI, Google, xAI) alongside Cisco, Microsoft, AWS, Huawei, Dell | Differentiator locally. Few regional integrators can show both columns. | Partner wall is split into "Infrastructure" and "Intelligence" columns, not one undifferentiated marquee. |

### 1.2 Where the story currently fails on the page

- **The hero contradicts the brand.** A stock photo of a woman looking at a floating hologram says "we bought a licence to a picture of the future". The brand book's own imagery rule says "no holograms, no glowing circuits, no 'futuristic' clichés". The current hero violates the brand's own guidelines.
- **The pillars are shown as four photos.** Four photos say "four departments". The brand claim is "one integrated stack". The visual grammar argues against the copy.
- **Proof is buried.** The 2014 Blu Telecom LTE build is the most impressive thing the company has done and it is one of six cards on a case study page.
- **No register change.** Every section is white with a red button. Nothing on the page is allowed to be quiet, so nothing is allowed to be loud. Premium is contrast in *tempo*, not just in colour.
- **Motion is generic.** Every element does the same 30px fade-up. Motion that is identical everywhere communicates nothing.

### 1.3 The narrative spine we will build to

Taken directly from the brand book's three-act arc:

1. **Complexity** — legacy systems, threats, data everywhere and informing nothing. (The Core arrives tangled and dim.)
2. **The turning point** — the integrator who sees the whole system. (The Core resolves into the inflection surface, lights up along the curve.)
3. **Outcome** — IT becomes the growth engine. (The Core moves through the four disciplines without breaking, then becomes the mark. Proof follows in the reading room.)

---

## 2. Target audience and what they need to feel

| Segment | Who | State of mind on arrival | What must happen in 10 seconds | Device reality |
|---|---|---|---|---|
| **Primary: CTO / CIO / Head of IT** at Ghanaian and West African banks, telcos, energy, mining, insurers, government agencies | Risk-averse, burned by resellers, judged on uptime and audit outcomes | "Is this a real engineering firm or another reseller with a nice logo?" | See precision, restraint, and proof. Feel the site was built by people who care about milliseconds. | Office laptop, often a 1366×768 or 1920×1080 Windows machine with integrated graphics. Also a Samsung mid-range phone on MTN 4G. |
| **CFO / MD / board** | Wants ROI language and a credible partner | "Can I put this name in front of the board?" | Feel authority and calm. Notice the clients and partners. | Phone first, often on a slow connection. Must get the full story with the static fallback. |
| **IT managers and engineers** evaluating for a tender | Technically literate, allergic to fluff | "Do they actually know SD-WAN / Azure / ISO 27001?" | Get to the pillar pages fast and find real detail. | Desktop. Will open six tabs. Interior pages must be light. |
| **Academy prospects** (individuals and L&D leads) | Curious, comparison shopping against Cisco Academy, AWS Academy, local trainers | "Is this serious, structured, and worth my budget?" | See rigour and structure, not marketing gloss. | Mobile heavy. |
| **Candidates** | Ambitious engineers | "Would I be proud to work here?" | Feel the craft. The site *is* the recruitment pitch. | Mobile and desktop. |
| **Partners and vendors** (Cisco, Microsoft, AWS channel teams) | Assessing partner quality | "Does this firm represent our brand well?" | See their logo in a premium context. | Desktop. |

**Implication for the build.** Two tiers of experience are not a compromise, they are the audience. The full 3D experience is for the desktop evaluation moment. The static, fast, still-beautiful experience is for the phone in the taxi. Both must feel like the same brand.

---

## 3. Competitive landscape

Scan performed 21 September 2026. Ratings are of *web presence*, not of the companies.

### 3.1 Local and regional peers (what the buyer compares us to)

| Competitor | Category | Web presence | What we take from it |
|---|---|---|---|
| Inlaks (East Legon, Accra) | Pan-African systems integrator, banking heavy | Corporate, dense, product-catalogue feel | They win on breadth. We win on focus and craft. |
| IPMC Ghana | Long-established local IT company, training arm | Busy, promotional | Direct Academy competitor. Our Academy must look institutional, theirs looks retail. |
| Radius Consulting Ghana | Hardware and software vendor since 2003 | Template site | Baseline of the category. |
| GuardianTech | Security operations centre, Accra | Security-led messaging | Their SOC claim is strong. Our Data Security pillar must show operational depth, not just "24/7 monitoring". |
| Verge Nexus | Enterprise IT, cyber, cloud, Accra | Modern template | Closest in message. Nothing dimensional. |
| Tarika Group, Hankaka | Managed services and IT outsourcing, Ghana and Nigeria | Service-menu sites | Commodity framing. We must never look like a menu. |
| CWG Plc (Lagos, Accra) | Listed West African IT infrastructure and managed services | Corporate, investor-relations tone | The regional "safe choice". We position as the sharper, faster, engineering-led alternative. |
| MainOne (Equinix) | Data centre and connectivity, Accra and Lagos | Global-brand polish | Sets the local ceiling for polish. We need to clear it. |

**Conclusion.** Nobody in the local or regional category has a dimensional, narrative site. The buyer has never seen one from a Ghanaian integrator. That is the opening. The risk is being the first to try and doing it badly, which is why performance gates are non-negotiable.

### 3.2 Global benchmarks (what "premium" means to this buyer)

The CTO's mental model of a premium technology site is set by Cloudflare, Vercel, Palantir, Stripe, and the WebGL work of studios like Lusion, Active Theory, and Unseen. The common properties, and the ones we adopt:

- One strong object or system, not many effects.
- Dark environment for narrative, light surfaces for detail.
- Scroll drives a scene, it does not drive a page.
- Typography is large, tight, and few.
- Motion is slow, eased, and never bounces.
- Nothing moves under the cursor unexpectedly.

What we deliberately do not adopt: custom cursors, cursor trails, liquid distortion on images, horizontal scroll hijacking, preloader percentage counters, and sound.

Sources: [ensun cyber security companies Ghana](https://ensun.io/search/cyber-security-it/ghana), [TechBehemoths cybersecurity Ghana](https://techbehemoths.com/companies/cybersecurity/ghana), [Inlaks](https://ghana.inlaks.com/), [Radius Consulting](https://www.radiusgh.net/), [Verge Nexus](https://www.vergenexusllc.com/), [Tarika](https://tarikagroup.com/ghana/managed-it-services-accra/), [CWG Plc](https://en.wikipedia.org/wiki/CWG_Plc), [MainOne Ghana](https://mainone.net/ghana/), [Hankaka](https://www.hankaka.com/services), [Utsubo best Three.js sites 2026](https://www.utsubo.com/blog/best-threejs-websites-2026), [Awwwards WebGL](https://www.awwwards.com/websites/webgl/), [Psychoactive best WebGL agencies](https://www.psychoactive.co.nz/content-hub/best-webgl-interactive-3d-agencies).

---

## 4. Emotional reaction on arrival

Design to a timeline, and test against it.

| Time | What the visitor sees | What they should feel | What must be true technically |
|---|---|---|---|
| 0 to 0.4 s | Obsidian background, the white header bar, the H1 already set in type, the Core's poster image (a still of the lattice state) | Stillness. "This is dark and deliberate." | Poster is the LCP element, inlined at low quality then swapped. No blank canvas. No spinner. Ever. |
| 0.4 to 1.2 s | H1 lines reveal upward one at a time. Eyebrow label appears. CTA appears last. | "They are not shouting." | Line reveals, 480 ms, expo-out, 60 ms stagger. Text in the DOM from the first byte. |
| 1.2 to 2.5 s | Poster crossfades into the live Core. The lattice breathes. A few nodes along the inflection curve are lit red. | The lean forward. "Wait, that is moving." | 3D chunk loads after hydration, only on capable devices. Crossfade 900 ms. Position match between poster and live scene must be exact. |
| 2.5 to 6 s | Pointer parallax. The Core tilts a few degrees toward the cursor. Red nodes pulse slowly, out of phase. | Control. "It responds to me but it does not chase me." | Pointer influence capped at 4 degrees. Damped at 0.06 per frame. No effect on touch. |
| 6 to 15 s | First scroll. The header stays. The Core recedes and the client strip slides in under it. | Trust. "They work with those banks." | Client logos are real, monochrome silver, and evenly weighted. |
| 15 to 60 s | The pillar chapter. The Core changes shape four times while the visitor reads four short blocks. | Understanding. "One team, four disciplines, and it actually holds together." | Pinned section. Morphs scrubbed to scroll with 0.8 s smoothing so fast scrolling never tears. |
| 60 s plus | Proof, intelligence, Academy, partners, testimonial, the mark reveal, the CTA. | Conviction, then a decision. | Every chapter under 1 s of motion. Reading is never interrupted by animation. |

If any row fails on the test device matrix (Section 10.3), the phase is not done.

---

## 5. Visual identity review and decisions

### 5.1 Logo

**Assessment.** The lockup at `public/inflexlogo.png` uses a 2009-era bevelled 3D gradient on the figure and X. The brand book already recommends flattening it (Direction A, "Engineered Precision"). On a dimensional site, a fake-3D logo next to real 3D looks like a costume.

**Decision.**
- Site chrome uses a **flat two-tone lockup**: red `#BD2E25`, grey `#8F8D8D`, white monochrome on Obsidian. A vector SVG of the mark is required (see Section 12, asset requests). Until it exists, the PNG stays and the 3D mark formation is built from a traced silhouette.
- The **only** three-dimensional expression of the mark is the Core's final formation. This is the rule that makes the flat logo feel intentional instead of downgraded.

### 5.2 Colour

**Assessment.** The palette is correct in principle (white canvas, grey structure, red action) and wrong in execution: there is no dark register, so the site has one tempo. The navy headings (`#1B3764`, `#265982`) are a leftover the brand book already flags as "not the brand". The CX audit's suggestion of a "space navy" would make the third blue-ish tone. Rejected. The brand is red, grey, and white. Dark must be a *grey* dark.

**Decision. Add the Obsidian register and an emissive red. Retire navy from new work.**

| Token | Hex | Role |
|---|---|---|
| `obsidian-950` | `#07080B` | Page background in the environment |
| `obsidian-900` | `#0A0C10` | Scene clear colour, footer |
| `obsidian-800` | `#10131A` | Raised surfaces on dark (cards, nav dropdown on dark) |
| `obsidian-700` | `#181C25` | Borders on dark at 100% or `white/8` |
| `silver-100` | `#E6E7EA` | Display text on dark |
| `silver-300` | `#C9CBD1` | Body text on dark |
| `silver-500` | `#A9ADB8` | Muted text on dark |
| `graphite` | `#8F8D8D` | Logo grey. Core node base colour. Rules and dividers on dark. |
| `ember` | `#FF3B2F` | Emissive red for the Core's lit nodes and bloom. **Never for text or UI.** |
| `red-500` | `#BD2E25` | Unchanged. Buttons, links, accent borders. |
| Ivory register | unchanged | `#FFFFFF`, `#F7F8FA`, `#F6F6F6`, `#F2F2F2` |

Ratio in Obsidian: 85% dark, 12% silver, 3% red light. Ratio in Ivory: the existing 60/30/10.

Contrast checks (must hold): `silver-300` on `obsidian-900` is 12.9:1. `silver-500` on `obsidian-900` is 8.6:1. `red-500` on `obsidian-900` is 3.9:1, so red on dark is for large text and icons only, never body copy.

### 5.3 Typography

**Assessment.** Rubik and Krub are fine and are pinned by the project rules. The problem is scale and discipline. Display headings top out at 36 to 48 px, tracking is default, and Krub is barely used. Premium type is large, tight, and rare.

**Decision. Keep both faces. Add a display tier and a telemetry tier. Nothing else.**

| Style | Face | Size | Weight | Tracking | Line height | Where |
|---|---|---|---|---|---|---|
| Display XL | Rubik | `clamp(2.75rem, 6.5vw, 6.5rem)` | 700 | −0.035em | 0.95 | Home H1, chapter openers |
| Display L | Rubik | `clamp(2.25rem, 4.5vw, 4rem)` | 700 | −0.03em | 1.0 | Interior H1, pillar names in the pinned chapter |
| H2 | Rubik | `clamp(1.75rem, 3vw, 2.5rem)` | 600 | −0.02em | 1.1 | Section titles |
| H3 | Rubik | 1.5rem | 600 | −0.01em | 1.25 | Card titles |
| Body L | Rubik | 1.125rem | 400 | 0 | 1.6 | Lead paragraphs, max 60ch |
| Body | Rubik | 1rem | 400 | 0 | 1.6 | Everything else, max 68ch |
| Eyebrow | Krub | 0.75rem | 500 | +0.18em, uppercase | 1 | Chapter numbers ("01 — Network"), labels |
| Telemetry | Krub | 0.6875rem | 500 | +0.12em, uppercase, `tabular-nums` | 1 | Counters, coordinates, footnotes in the environment |

Rules:
- Headlines carry at most one line break decision. Use `text-wrap: balance`.
- Never animate individual letters. Lines only.
- Counters use `font-variant-numeric: tabular-nums` so digits do not jitter.
- On Obsidian, headings are `silver-100`, never pure white. Pure white on near-black halates.

### 5.4 Imagery

**Assessment.** The hero stock image with a hologram and the `subtract.png` cut-out shape are the two most damaging assets on the site. The `mid/` and `ai/` photography is acceptable but generic.

**Decision.**
- Hero photography is removed from the home page and pillar index. The Core replaces it.
- Interior page heroes use **pre-rendered stills of the Core** in the relevant formation (captured from the real scene, see Section 9 Phase 5), with photography moved down into the reading room where it carries information.
- Remaining photography gets one consistent grade: slight desaturation (−12%), lifted blacks, no colour overlays. Rounded corners at `12px` in Ivory, `0` on Obsidian (the environment has no soft corners).
- The brand book's "African context" rule stands: replace generic stock over time with real Accra environments and real team-at-work photography.

### 5.5 Layout and rhythm

- Container stays `max-w-7xl` with `px-4 sm:px-6 lg:px-8` to respect the locked header.
- Section rhythm on the home page is set by chapter, not by padding: each chapter is a minimum of `100svh` in the environment and `auto` with `py-24 md:py-32` in the reading room.
- Cards have no drop shadows on Obsidian. On Ivory, one shadow token only: `0 1px 2px rgb(23 26 32 / 0.06), 0 8px 24px rgb(23 26 32 / 0.06)`.
- Buttons stay `rounded-[6px]` and `h-14` for primary. Secondary buttons on Obsidian are `border-white/20` with a `white/8` hover fill.
- Grid lines are allowed as decoration in exactly one place: the environment's ground plane. Nowhere in the reading room.

### 5.6 The header

`src/app/components/Header.tsx` is locked by project rules. The design below works with it as it is: a white bar over the Obsidian hero reads like a gallery label and is a legitimate editorial choice.

However, the premium result wants a transparent header over the environment that becomes frosted on scroll, and a visible mark on mobile (the current header hides the logo below `lg`). **The build must not touch the header unless the owner explicitly unlocks it.** If unlocked, the change is limited to: transparent background and silver text while the hero is in view, `backdrop-blur` and `obsidian-900/80` once scrolled, white bar and dark text on Ivory pages, and a 28 px mark shown on mobile. Layout, positioning, order, and the dropdown state pattern stay exactly as locked.

---

## 6. The 3D environment

> **Hero detail lives in `HERO_SCENE_SPEC.md` (21 September 2026),** which is authoritative for Beats 0 to 2 and revises three points below: formation data is generated on the client in a Web Worker (no `core.bin` download), bloom is selective by layer rather than luminance-thresholded (so ember keeps its hue), and tone mapping is AgX rather than ACES. The tier ladder, the camera keyframes, the shader-side lighting rig, and the poster pair (unlit and lit) are specified there.

### 6.1 Concept: the Core

One object. About 16,384 nodes and about 24,000 edges. It lives in a single persistent WebGL canvas fixed behind the home page. It never unmounts during the home page scroll. It has five formations, and each formation is a full set of target positions baked at build time.

| # | Formation | Discipline | Geometry | Light |
|---|---|---|---|---|
| 0 | **Inflection** | Arrival | Nodes on an S-curve sheet: `z = 0.9·tanh(1.6x)`, sampled on a hexagonal lattice, slight noise in y. Edges connect nearest neighbours in the lattice. | 6% of nodes, those closest to the curve's inflection line, are ember. They pulse slowly. |
| 1 | **Lattice** | Network Infrastructure | A rectilinear 3D lattice, 32×16×32 spacing, sheared 8° so it is not a plain cube. Edges follow the lattice. | Ember nodes form paths through the lattice, like traffic. |
| 2 | **Enclosure** | Data Security | Two concentric geodesic shells (icosphere subdivision 5 and 4). Edges are the geodesic wireframe. | Ember nodes are sparse and sit on the outer shell. The inner shell is dim. |
| 3 | **Nebula** | Cloud Services | A soft volume: sphere displaced by 3-octave simplex noise, nodes distributed by density. Edges are sparse and short. | Ember nodes cluster near the densest region. |
| 4 | **Plane** | Data-centric Solutions | A flat ground grid with a height field of vertical columns (like a bar surface). Edges are the grid and the column verticals. | Ember nodes cap the tallest columns. |
| 5 | **Mark** | The reveal | Nodes sampled from the silhouette of the ascending figure and X, extruded 0.15 units in z. Edges dense inside the silhouette, none outside. | The whole figure is ember at 40%, the star at 100%. |

The formations are ordered 0 → 1 → 2 → 3 → 4 → 5 down the page. Formation 0 is also the idle state on every interior page's poster.

### 6.2 Why points and lines, not meshes

- A point-and-line object at this density renders at 60 fps on integrated graphics. A high-poly mesh with physically based materials does not.
- It reads as engineering. Meshes with glossy materials read as product renders.
- Morphing between formations is a vertex shader mix, which is free.
- It degrades to a still image with zero visual loss of identity.

### 6.3 Rendering specification

**Stack.** `three`, `@react-three/fiber` v9 (React 19), `@react-three/drei` (only `useTexture` and helpers, tree-shaken), `@react-three/postprocessing` with `postprocessing`. WebGL 2. No WebGPU in this phase.

**Canvas.** `position: fixed; inset: 0; z-index: 0; pointer-events: none`. DPR clamped to `[1, 1.75]`. `antialias: false` (post handles it), `powerPreference: "high-performance"`, `alpha: false`, clear colour `obsidian-900`.

**Nodes.** One `THREE.Points` with a custom `ShaderMaterial`.
- Attributes: `aPos0 … aPos5` (six `vec3` targets), `aSeed` (float, for delay and pulse phase), `aHeat` (float 0 to 1, per formation, packed as six floats in two `vec3`s).
- Uniforms: `uFrom` (int), `uTo` (int), `uMix` (0 to 1), `uTime`, `uPointer` (vec2, damped), `uSize`, `uIdle` (idle amplitude).
- Vertex: pick `from` and `to` positions by index, compute per-node mix `m = smoothstep(0, 1, (uMix − aSeed·0.35) / 0.65)` so the morph travels across the object instead of snapping uniformly, add curl-noise displacement scaled by `sin(m·π)` so nodes swirl at mid-transition, add idle breathing `0.02·sin(uTime·0.6 + aSeed·6.28)`. Point size attenuates with distance, minimum 1.5 px, maximum 4 px.
- Fragment: soft disc (`smoothstep(0.5, 0.35, dist)`), colour `mix(graphite, ember, heat·pulse)`, alpha fades with distance for depth cueing. Blending `NormalBlending` for graphite nodes; ember nodes use additive through a second draw call of the same geometry with a `uPass` uniform, or through a single pass with premultiplied alpha. Pick the single pass unless bloom needs more separation.

**Edges.** One `THREE.LineSegments` sharing the same six target sets, duplicated per endpoint. Line colour `graphite` at alpha 0.18, `ember` at 0.5 where both endpoints are hot. WebGL 1 px lines are acceptable here because thin is the look. Fat lines are not required and cost too much.

**Data.** All six formations and the edge index list are baked by `scripts/bake-core.mjs` into `public/three/core.bin` (Float32 positions, Uint16 heat, Uint32 edge pairs) plus `core.json` (counts, bounds). Roughly 2.4 MB raw, about 700 KB gzipped. Loaded with `fetch` after the poster is painted. No geometry is generated at runtime.

**Camera.** Perspective, 32° vertical FOV, positioned by a keyframe track (Section 7) and offset by pointer parallax capped at ±4° yaw and ±2.5° pitch, damped at 0.06 per frame. Touch devices ignore pointer input; the camera drifts on a 20 s ellipse of 1.5° instead.

**Fog.** `THREE.FogExp2(obsidian-900, 0.085)` so the back of the object dissolves into the page.

**Post-processing.** `EffectComposer` with exactly three effects, in this order: `Bloom` (luminance threshold 0.82, smoothing 0.2, intensity 0.55, mipmap blur), `Vignette` (offset 0.35, darkness 0.6), `Noise` (opacity 0.035, premultiply). No chromatic aberration, no depth of field, no god rays, no lens dirt. Tone mapping `ACESFilmic`, exposure 1.0.

**Ground.** A single `PlaneGeometry` at `y = −1.4` with a shader that draws a fading 0.5-unit grid, alpha 0.06, radial fade to zero at radius 6. Only visible in formations 1 and 4. This is the one permitted grid.

**No lights, no environment map, no HDR.** Points and lines are unlit. This also keeps the Content Security Policy in `next.config.ts` untouched; note that `@react-three/drei` environment presets fetch from a third-party CDN, which the current `connect-src 'self'` policy would block. Do not use them.

### 6.4 Motion tiers and the fallback ladder

`useMotionTier()` runs once on the client and returns one of:

| Tier | Condition | Experience |
|---|---|---|
| **A** | `prefers-reduced-motion: no-preference`, WebGL 2 available, `navigator.hardwareConcurrency ≥ 4`, `deviceMemory ≥ 4` or undefined, viewport ≥ 1024 px, not `saveData` | Full Core with post-processing, DPR up to 1.75 |
| **B** | as A but viewport < 1024 px, or `hardwareConcurrency` 2 to 3, or `deviceMemory` 2 to 3 | Core at 50% node count (every other index skipped in the draw range), no post-processing, DPR 1, morphs enabled, idle motion enabled |
| **C** | reduced motion, or no WebGL 2, or `saveData`, or a frame-time probe averaging above 24 ms over the first 90 frames | Poster stills per chapter (WebP, one per formation), CSS crossfade between them at chapter boundaries, no canvas mounted, 3D chunk never downloaded |

Tier is re-evaluated only on `prefers-reduced-motion` change. A tier downgrade at runtime (the frame probe) crossfades to the poster and unmounts the canvas within 600 ms. It never upgrades mid-session.

Tier C is a first-class design, not a failure state. It must be reviewed on a real mid-range Android before Phase 1 is signed off.

### 6.5 Bundle honesty

> **Superseded by `PERFORMANCE_PLAN.md` Section 2 (22 September 2026):** measured shell is 218 KB today; corrected budgets are shell 205 KB, motion 60 KB (GSAP and Lenis, loaded after LCP), environment 190 KB with `postprocessing` replaced by a hand-written post stage.

The PRD budget of 350 KB gzipped JavaScript for the whole page cannot hold three.js plus the app shell. The rule becomes two budgets:

| Chunk | Contents | Gzipped budget | When it loads |
|---|---|---|---|
| Route shell | Next runtime, React, page, motion primitives, GSAP core + ScrollTrigger, Lenis | ≤ 190 KB | Immediately |
| Environment | three, r3f, postprocessing, Core component, shaders | ≤ 230 KB | `next/dynamic` after hydration, Tier A and B only, and only after the poster has painted |
| Data | `core.bin` | ≤ 750 KB | With the environment chunk, `fetch` with `priority: low` |

Tier C devices never fetch the environment or the data. That is how the phone in the taxi stays fast.

---

## 7. The scroll narrative (home page)

> **Superseded on 21 September 2026 by `SCROLL_NARRATIVE.md`.** The chapter table below is kept for the camera and formation reasoning, but the beat order, scroll ranges, copy, and component list in `SCROLL_NARRATIVE.md` Section 6 and 8 are authoritative. Key changes: proof moves up to the third screen, the Advantage and Intelligence chapters are cut or folded, the Academy moves after the ask, and there is one offer.

The home page is a filmstrip. Scroll position is the playhead. The Core, the camera, and the copy are all keyed to the same timeline. Distances are in viewport heights of the scroll container; total home page height is about 12 viewports on desktop.

Copy is taken from approved sources: the brand book, the current components, and `src/app/data.ts`. Where a line is new it is marked **(new)** and needs sign-off.

| Ch. | Scroll range (vh) | Register | Core formation and camera | Copy and layout | Motion |
|---|---|---|---|---|---|
| **00 Arrival** | 0 – 100 | Obsidian | Formation 0 (Inflection). Camera at `(0, 0.4, 5.2)`, looking at origin, object right of centre so text has room. | Eyebrow: `Enterprise IT integration · Accra, Ghana · Since 2012`. H1: **Intelligent Infrastructure That Never Sleeps**. Lead: "We design, deploy, and manage AI-driven networks, cloud, and security — with intelligent automation that keeps you ahead, not just online." Primary CTA: **Get Your Free IT Assessment**. Secondary text link: **See how we work ↓** (new). | Line reveals as Section 4. Poster-to-live crossfade at 900 ms. Idle breathing. Scroll cue: a 1 px silver line that grows from 0 to 32 px and fades, every 2.4 s, stops on first scroll. |
| **00b Trust strip** | 100 – 125 | Obsidian | Camera pulls back 12%, object dims to 70%. | Eyebrow: `Trusted by 50+ enterprises`. Client logos from `public/assets/clients`, monochrome silver at 55% opacity, 100% on hover. | Logos slide in from the right at 0.4 px per pixel of scroll (scrubbed), then hold. No infinite marquee. |
| **01 The turning point** | 125 – 250 | Obsidian | Formation 0 stays. At 125 the object is tangled: a 0.35 noise displacement is applied. As the visitor scrolls to 250 the noise resolves to 0 and the inflection line lights ember from left to right. Camera dollies from 5.2 to 4.4. | Left column, 5 of 12: Eyebrow `01 — The inflection point`. H2 Display L: **We engineer the inflection point.** Body: "Legacy systems drain budget. Threats escalate. Data exists everywhere and informs nothing. Most vendors add products. We integrate — so network, cloud, security, and data work as one intelligent system." (assembled from brand book Act 1 and 2). Link: **From Legacy Burden to Competitive Edge →** to `/about`. | Text triggers once at 20% visibility. The noise-to-order resolve is scrubbed. This is the single most important motion on the site: the visitor *watches disorder become structure*. |
| **02 Four pillars** (pinned) | 250 – 650 | Obsidian | Pinned for 400 vh. Four sub-ranges of 100 vh each: Lattice, Enclosure, Nebula, Plane. Each morph occupies the middle 60% of its range; the first and last 20% hold still so the copy can be read. Camera orbits 18° per formation so each is seen from a new angle. | Left column, sticky: Eyebrow `02 — Four Pillars. Zero Gaps.` Then an index of four rows, each `01 Network Infrastructure`, `02 Data Security`, `03 Cloud Services`, `04 Data-centric Solutions`. The active row is `silver-100` with its ember dot; the others are `silver-500`. Under the active row, the approved value proposition from the brand book (Tier 2) and a link to the pillar page. | Row activation crossfades in 240 ms. The value proposition swaps with a 12 px line reveal. The morph is scrubbed with 0.8 s smoothing. Keyboard users can tab through the four rows; focusing a row scrolls the container to that sub-range. |
| **03 Why enterprises trust us** | 650 – 780 | **Ivory** | Canvas fades to 0 over the first 30 vh and pauses rendering (`frameloop="demand"`). | H2: **Why 50+ Enterprises Trust Inflexions**. A row of four counters: `2012` Founded in Accra, `80+` Years combined experience, `50+` Enterprise clients, `4` Integrated disciplines. Below, the four advantage cards from `InflexionsAdvantage.tsx` re-set as a 2×2 editorial grid: image left at 40%, title and text right, no hover-reveal. Text is always visible. | Counters run once, 1.2 s, expo-out, tabular digits. Cards reveal with 60 ms stagger, 16 px y, 480 ms. Image scales 1.0 → 1.03 over 800 ms on hover. Nothing else moves on hover. |
| **04 Proof** | 780 – 880 | Ivory | Canvas paused. | Eyebrow `Case study`. H2: **A carrier-grade LTE core and a Tier III data centre, delivered under startup pressure.** (new, from the Blu Telecom study). One large card: the Blu Telecommunications summary from `data.ts`, three highlight bullets, link to `/case-studies/{id}` using the Blu entry's numeric `id` in `src/app/data.ts` (ids are "1", "2", …, not slugs). Secondary link **All case studies →**. | Single reveal. The card's left border is 2 px `red-500` that draws from top to bottom over 600 ms when the card enters. |
| **05 The intelligence layer** | 880 – 1000 | **Obsidian** | Canvas resumes. Formation 3 (Nebula) at 60% opacity, camera far, object behind the text as atmosphere. | Eyebrow `03 — AI woven through every pillar`. H2: **Intelligence is not a feature. It is the fabric.** (new, from brand value "Intelligence"). Four capability rows from `IntelligentAutomation.tsx`: Predictive Analytics, Process Automation, Data Strategy & Architecture, AI Integration. Rows, not cards: title left, one sentence right, hairline `white/10` between. | Rows reveal 40 ms stagger. Hovering a row brightens the nearest ember cluster in the Core (a `uFocus` uniform, 0 to 3), which is the only hover-to-3D link on the site. |
| **06 Academy** | 1000 – 1090 | Obsidian → Ivory gradient band | Canvas fades out again by 1090. | Existing `AcademyPromo` content: eyebrow `Inflexions Academy`, H2 **Develop Your Edge.**, the four domain pills, CTAs **Explore Programmes** and **Enterprise Training**. Background is `obsidian-800` panel on an Ivory page, so it reads as a doorway to a second world. | Standard reveal. Pills have no hover motion. |
| **07 Partners** | 1090 – 1160 | Ivory | Paused. | Two columns with eyebrows `Infrastructure partners` and `Intelligence partners`. Logos from `public/assets/partners`, greyscale, 60% opacity, 100% on hover. | Static grid. No marquee. |
| **08 Voices** | 1160 – 1230 | Ivory | Paused. | One testimonial at a time, large Display L quote, name and title in Eyebrow style. Prev and next as text buttons. No autoplay. | 320 ms crossfade. `react-slick` is removed. |
| **09 The mark** | 1230 – 1330 | **Obsidian** | Canvas resumes. Morph from Formation 0 (reset silently while hidden) to Formation 5 (Mark) across the first 60 vh. Camera settles front-on. Ember rises to full. | Centre: eyebrow `Every engagement is an inflection point.` H2 Display XL: **Stop Patching. Start Performing.** Body: "Book a 30-minute AI readiness session with our Solutions Architect. No pitch — just a clear path to intelligent operations." Primary CTA **Book Your Session** to `/contact`. Telemetry line below: `Accra · +233 20 888 9270 · info@inflexions.tech`. | The mark reveal is the payoff and the only moment bloom intensity is allowed to rise (0.55 → 0.9 over 1.2 s). CTA is magnetic within 6 px. |
| **Footer** | 1330 – end | Obsidian | Canvas fades to 0 and unmounts on route change. | Existing footer, re-set on `obsidian-900` with silver text. | None. |

**Rules that govern every chapter.**
- Scene and camera are scrubbed to scroll. Copy is triggered, once, and does not reverse on scroll-up except inside the pinned chapter.
- Only one thing moves in the reading column at a time.
- A chapter's motion never exceeds 1 s of duration outside the pinned section.
- Register changes (Obsidian ↔ Ivory) happen with a 30 vh background crossfade, never a hard edge.

### 7.1 Interior pages

Interior pages are reading rooms with an arrival moment. They do **not** mount the Core.

- **Hero template** for every top-level page: `min-h-[70svh]` Obsidian band, a pre-rendered still of the relevant formation as a `next/image` background with a 6% CSS parallax (`translateY` scrubbed, capped at 40 px), eyebrow, Display L H1, lead, one CTA. Then the page transitions to Ivory.
- **Pillar pages** use their own formation still: Network → Lattice, Security → Enclosure, Cloud → Nebula, Data-centric → Plane. This is how the system extends without cost.
- **Solutions index** (`/solutions`) is the one interior page that mounts the live Core, in a reduced "pillars only" timeline (chapters 02 only, pinned, 4 sub-ranges). It is the second most important page for the evaluating IT manager.
- **Academy** pages use the Inflection still recoloured slightly warmer (exposure +0.1) to signal the second world without a new object.
- **About, Careers, Contact, Case studies** use the Inflection still.

---

## 8. The animation system

All motion is expressed through tokens and four primitives. No component writes its own easing or duration.

### 8.1 Tokens (`src/motion/tokens.ts`)

```ts
export const duration = {
  micro: 120,   // colour, opacity on hover
  ui: 240,      // dropdowns, toggles, tabs
  reveal: 480,  // text and card entrances
  scene: 900,   // poster crossfade, register changes
  morph: 1600,  // Core formation change (when not scrubbed)
} as const;

export const ease = {
  out: "cubic-bezier(0.16, 1, 0.3, 1)",      // expo-out: entrances, hovers
  inOut: "cubic-bezier(0.76, 0, 0.24, 1)",   // quart in-out: scrubs, morphs
  exit: "cubic-bezier(0.7, 0, 0.84, 0)",     // expo-in: exits only
} as const;

export const stagger = { lines: 60, rows: 40, cards: 60, max: 600 } as const;
export const distance = { reveal: 16, line: 12, parallaxMax: 40 } as const;
```

GSAP equivalents: `expo.out`, `power4.inOut`, `expo.in`. Bounce, elastic, back, and any overshoot are banned.

### 8.2 Primitives (`src/motion/`)

| Primitive | Replaces | Behaviour |
|---|---|---|
| `<Reveal>` | the seven copies of `useInView` across components | Wraps a block. Fades and translates 16 px up over `duration.reveal` with `ease.out` when 20% visible. Runs once. Honours reduced motion (opacity only, 1 ms). Accepts `delay` and `as`. |
| `<SplitLines>` | nothing (new) | Splits a heading into lines with GSAP SplitText (free since GSAP 3.13), masks each line with `overflow: hidden`, reveals with a 12 px y and `stagger.lines`. Re-splits on resize with a 200 ms debounce. Falls back to `<Reveal>` when SplitText is unavailable. |
| `<Counter>` | nothing (new) | Counts from 0 to `value` over 1.2 s with `ease.out`, tabular numerals, prefix and suffix support, runs once on visibility. Reduced motion prints the final value. |
| `<Magnetic>` | nothing (new) | Primary CTA only. Translates the button up to 6 px toward the pointer, springs back at `ease.out`. Disabled on touch and reduced motion. |

### 8.3 Scroll infrastructure

- **Lenis** for smooth scroll, `lerp: 0.09`, `wheelMultiplier: 1`, `smoothTouch: false`. Mounted once in `src/motion/LenisProvider.tsx` inside `MarketingChrome`. Remove `scroll-behavior: smooth` from `globals.css`; it fights Lenis. Anchor links go through `lenis.scrollTo`.
- **GSAP ScrollTrigger** drives all scrubs and pins. `ScrollTrigger.scrollerProxy` is not needed with Lenis; instead call `lenis.on('scroll', ScrollTrigger.update)` and `gsap.ticker.add(lenis.raf)`.
- **The bridge to 3D** is a single mutable store, `src/three/core/store.ts`, holding `{ progress, chapter, from, to, mix, focus, pointer }` as plain numbers. ScrollTrigger callbacks write to it. The r3f `useFrame` loop reads it. No React state crosses this boundary per frame; that is what keeps 60 fps.
- **Smoothing** on scrubbed values: `scrub: 0.8` on ScrollTrigger for the camera and mix, so fast scrolling reads as intent, not as a skipped film.
- **Pinning** uses `pin: true, pinSpacing: true`, and the pinned element is the chapter container, not the canvas (the canvas is already fixed).

### 8.4 Text choreography

- Headings: `<SplitLines>`. Body and eyebrows: `<Reveal>` with `delay` after the heading (heading lines × 60 ms + 80 ms).
- CTAs reveal last, `delay` +120 ms after body.
- Maximum total choreography per block: 600 ms from first line to CTA. If a block needs more, it has too much in it.

### 8.5 Hover and pointer

- Buttons: background colour over `duration.micro`; primary CTA magnetic. No scale.
- Cards and rows: no translate, no shadow change. Images scale 1.03 over 800 ms. Row titles shift colour. Border light sweep (a 1 px gradient that travels once along the top edge over 600 ms) is allowed on Obsidian cards only.
- Links in body: underline offset 3 px, underline thickness animates 1 → 2 px.
- Nothing ever moves its layout on hover. The SwapGrid behaviour flagged in the CX audit is the canonical anti-pattern.
- No custom cursor.

### 8.6 Page transitions

- Route changes: 240 ms opacity crossfade with a 12 px y on the incoming page, implemented in `src/app/template.tsx`. If the Next 16 View Transitions flag is enabled in this project, use it for the same values; otherwise the template approach is the default.
- The Core unmounts on leaving the home page with a 300 ms fade so the interior poster never pops.
- Header dropdowns and the mobile menu are governed by the header lock. If unlocked: `duration.ui` with `ease.out`, translate 8 px.

### 8.7 Reduced motion contract

`prefers-reduced-motion: reduce` means: Tier C posters, `<Reveal>` becomes opacity-only at 1 ms, `<SplitLines>` renders plain, `<Counter>` prints the value, `<Magnetic>` is off, Lenis is off, ScrollTrigger pins still work (they are layout, not motion), and register crossfades still occur (they are colour, not movement). The existing global reduced-motion rule in `globals.css` stays.

---

## 9. Build order

Each phase ends with a gate. Do not start the next phase until the gate passes on the device matrix in Section 10.3. Estimated effort assumes one focused engineer or agent.

### Phase 0 — Foundations (2 to 3 days)

1. Install: `three`, `@react-three/fiber@^9`, `@react-three/drei`, `@react-three/postprocessing`, `postprocessing`, `gsap`, `lenis`, `maath`. Dev: `@types/three`, `playwright` (for poster capture and visual goldens). Pin the versions the install resolves.
2. Add the Obsidian and ember tokens and the display type tier to `src/app/globals.css` `@theme`. Remove `scroll-behavior: smooth` and the `main button { border-radius }` selector hack (replace with explicit classes on the components that relied on it).
3. Create `src/motion/` with `tokens.ts`, `LenisProvider.tsx`, `scroll.ts` (GSAP registration and the Lenis bridge), `useMotionTier.ts`, `Reveal.tsx`, `SplitLines.tsx`, `Counter.tsx`, `Magnetic.tsx`.
4. Mount `LenisProvider` in `src/app/MarketingChrome.tsx`. Do not touch `Header.tsx`.
5. Add a dev-only frame-time overlay (`src/motion/DevStats.tsx`, gated on `NODE_ENV`).
6. Add `scripts/perf-gate.mjs`: runs Lighthouse against the local build for `/`, `/solutions`, `/solutions/network-infrastructure`, `/academy` with mobile emulation, fails on LCP > 2.5 s, CLS > 0.02, TBT > 200 ms, or the route shell exceeding 190 KB gzipped (read from the Next build output).
7. Remove `aos` from dependencies (it is unused by the new system). Leave `react-slick` until Phase 4.
8. **Done 21 September 2026:** GA4 wired through `src/app/components/GoogleAnalytics.tsx`, gated on `NEXT_PUBLIC_GA_MEASUREMENT_ID`, with the Content Security Policy updated. The owner sets the Measurement ID in Vercel; the device mix in `HERO_SCENE_SPEC.md` Section 2 is replaced with measured data before Gate 1.

**Gate 0.** Build passes. Lighthouse baseline recorded for the four routes. Reduced motion verified to disable Lenis. Header unchanged (diff of `Header.tsx` is empty).

### Phase 1 — The Core, arrival only (4 to 5 days)

1. `scripts/bake-core.mjs`: generates the six formations and the edge list, writes `public/three/core.bin` and `core.json`. Formation 5 samples `public/brand/mark.svg` (asset request, Section 12); until it exists, sample a traced silhouette from `public/inflexlogo.png` at 2× and mark the result as provisional.
2. `src/three/core/` with `CoreCanvas.tsx` (dynamic import boundary, tier check, poster crossfade), `CoreScene.tsx`, `CoreObject.tsx` (Points + LineSegments), `shaders/core.vert.glsl`, `shaders/core.frag.glsl`, `shaders/edge.vert.glsl`, `shaders/edge.frag.glsl`, `Ground.tsx`, `Post.tsx`, `camera.ts` (keyframe track), `store.ts`.
3. Poster pipeline: `scripts/capture-posters.mjs` opens a hidden route `/_capture?formation=n` with Playwright at 2560×1440 and 1170×2532, saves `public/three/posters/f{n}-{desktop|mobile}.webp` at quality 82, and a 24 px LQIP as base64 into `src/three/core/posters.ts`. The hidden route is excluded from the sitemap and returns 404 in production.
4. Rebuild `HeroBanner.tsx` as `src/app/components/home/Arrival.tsx`: poster as LCP image, copy per Chapter 00, Core mounted behind for Tier A and B.
5. Pointer parallax, idle breathing, ember pulse.

**Gate 1.** On the device matrix: desktop 60 fps steady (no frame over 20 ms in a 30 s idle), Tier B 45 fps or better, Tier C shows the poster with identical composition. LCP ≤ 2.5 s mobile-emulated. Environment chunk ≤ 230 KB gzipped. Poster-to-live crossfade shows no position jump (overlay the two at 50% and confirm alignment). Contrast of every text element on Obsidian passes AA.

### Phase 2 — The scroll spine (3 to 4 days)

1. `src/app/components/home/` gets one component per chapter: `Arrival`, `TrustStrip`, `TurningPoint`, `Pillars`, `Advantage`, `Proof`, `Intelligence`, `AcademyDoor`, `PartnerWall`, `Voices`, `MarkReveal`. `src/app/page.tsx` composes them in order with the register bands.
2. ScrollTrigger timeline in `src/three/core/timeline.ts`: one master timeline mapping scroll to `store.progress`, chapter boundaries, and camera keyframes.
3. Text choreography with `<SplitLines>`, `<Reveal>`, `<Counter>` on every chapter. Still using Formation 0 only.
4. Register crossfades between Obsidian and Ivory bands.

**Gate 2.** Scrolling at any speed never shows a blank band or a half-revealed heading. Keyboard tab order follows the visual order through every chapter. The pinned chapter is scrollable with keyboard and with a trackpad on Safari. CLS remains ≤ 0.02 after pin spacing is added.

### Phase 3 — Formations and the pinned pillars (4 to 5 days)

1. Enable morphs: `uFrom`, `uTo`, `uMix` driven from the store; the travelling mix and curl displacement in the vertex shader.
2. Chapter 01 noise-to-order resolve. Chapter 02 pinned sequence with camera orbit and row activation. Chapter 05 nebula atmosphere and the `uFocus` hover link.
3. Tier B validation at 50% node count.

**Gate 3.** Morphs hold 60 fps on the desktop reference and never tear under fast scroll. The four rows in the pinned chapter are reachable by keyboard and by screen reader with correct `aria-current`. No copy is obscured by the object at any breakpoint from 1024 px up (the object sits right of the text column; verify at 1024, 1280, 1440, 1920, 2560).

### Phase 4 — Payoff and the reading room (3 to 4 days)

1. Chapter 09 mark reveal with the bloom rise, magnetic CTA.
2. Chapter 03 counters and the editorial 2×2 advantage grid (replaces `InflexionsAdvantage.tsx`).
3. Chapter 04 Blu Telecom proof card.
4. Chapter 08 testimonials rebuilt without `react-slick`; remove `react-slick` and `slick-carousel`.
5. Chapter 07 partner wall in two columns.
6. Footer re-set on Obsidian.

**Gate 4.** Every home page component of the old build is either replaced or deleted; no dead files remain. Lighthouse for `/` meets all Phase 0 thresholds. The mark formation is signed off visually by the owner (this is the one subjective gate).

### Phase 5 — Interior pages (4 to 6 days)

1. `src/app/components/PageHero.tsx`: the Obsidian arrival band with formation still, parallax, eyebrow, H1, lead, CTA.
2. Apply to About, Solutions index, four pillar pages, Services index and three service pages, Academy landing, domain pages, programme pages (lighter variant, 50 svh), For Organisations, Case studies, Careers, Contact.
3. `/solutions` mounts the reduced live Core (pillars-only timeline).
4. Photography grade applied via a single CSS filter class. Cards and buttons brought to the Ivory rules in Section 5.5.
5. `RelatedTraining`, `SolutionPartners`, `DomainCard`, `ProgrammeCard` re-set on the new tokens. Academy data in `src/app/academy/data.ts` is untouched.

**Gate 5.** Every interior route passes the perf gate. No interior page other than `/solutions` downloads the environment chunk (verify in the network panel). Every H1 uses Display L.

### Phase 6 — Polish and hardening (3 days)

1. Visual regression goldens with Playwright at 390, 768, 1280, 1920 widths, light and reduced motion, for every route. Commit them.
2. Accessibility pass: axe on every route, screen reader read-through of the home page, focus visible on Obsidian (`outline: 2px solid #E6E7EA` variant needed; the current red outline is invisible on dark).
3. Frame-time probe tuning: confirm Tier C downgrade fires on a throttled CPU (6× in DevTools) and never fires on the desktop reference.
4. Copy sign-off on every line marked **(new)**.
5. Update `CLAUDE.md` Reference Documents to point here, and update `DESIGN_SYSTEM.md` with the new tokens and primitives.

**Gate 6.** Definition of done, Section 10, in full.

---

## 10. Definition of done

### 10.1 Performance

| Metric | Threshold | Where |
|---|---|---|
| LCP | ≤ 2.5 s | Every route, Lighthouse mobile emulation, 4G throttle |
| CLS | ≤ 0.02 | Every route |
| TBT | ≤ 200 ms | Every route |
| Route shell JS | ≤ 190 KB gzipped | Build output |
| Environment chunk | ≤ 230 KB gzipped | Build output |
| Frame time, Tier A | 99th percentile ≤ 20 ms during a full home scroll | Desktop reference |
| Frame time, Tier B | 99th percentile ≤ 26 ms | Tier B reference |
| Idle CPU with Core visible | ≤ 12% of one core | Desktop reference |
| Idle CPU with canvas paused (Ivory chapters) | ≈ 0 | `frameloop="demand"` verified |

### 10.2 Quality

- No layout shift on any hover, anywhere.
- No motion longer than 1 s outside the pinned chapter.
- No element uses an easing or duration that is not in `tokens.ts`.
- No text is animated per letter.
- No pure white (`#FFFFFF`) text on Obsidian.
- No navy in any new component.
- No stock photograph with holograms, circuits, or glowing globes remains in the repo's served assets.
- Every image has correct `alt`, every canvas is `aria-hidden`, every chapter heading is a real heading element in document order.
- All approved copy is verbatim. All **(new)** copy is signed off.
- `Header.tsx` is byte-identical to `main` unless the owner unlocked it in writing.

### 10.3 Device matrix

| Role | Device | Tier expected |
|---|---|---|
| Desktop reference | Windows 11 laptop, integrated graphics (Intel Iris Xe or equivalent), 1920×1080, Chrome and Edge | A |
| Desktop secondary | MacBook Air M-series, Safari and Chrome | A |
| Low desktop | 2018 laptop, Intel UHD 620, 1366×768, Chrome | A, and must not downgrade |
| Tablet | iPad (any recent), Safari | B |
| Phone reference | Samsung Galaxy A-series (mid-range), Chrome, on a real 4G connection in Accra | B or C, both must be beautiful |
| Phone secondary | iPhone (recent), Safari | B |
| Accessibility | Any desktop with reduced motion on, NVDA or VoiceOver | C |

---

## 11. Never ship

- A loading screen, spinner, or percentage counter before the hero.
- A blank canvas frame. The poster is always painted first.
- A custom cursor, cursor trail, or magnetic effect on anything but the primary CTA.
- Horizontal scroll hijacking or scroll-snapping on the home page.
- Autoplaying carousels or infinite logo marquees.
- Bounce, elastic, or overshoot easings.
- Per-letter text animation.
- Lens flares, chromatic aberration, depth of field, god rays, glitch effects.
- Hover effects that move layout or hide the thing being hovered.
- The hologram hero image or the `subtract.png` cut-out.
- Third-party CDN fetches for 3D assets (Content Security Policy blocks them, and they are a dependency we do not control).
- Any 3D on interior pages other than `/solutions`.
- Sound.

---

## 12. Asset and decision requests for the owner

These block specific steps; everything else proceeds without them.

1. ~~Vector logo mark.~~ **Provisional produced 21 September 2026** from the favicon with ImageMagick and a potrace port: `public/brand/mark.svg` (two-tone), `mark-silhouette.svg`, `mark-mask.png`, `mark-heat.png`. Unblocks Formation 5. A designer's master vector should replace these files when available; keep the file names and the 500×512 viewBox.
2. **Header unlock decision.** Yes or no to the transparent-on-Obsidian variant and the mobile mark, scoped exactly as Section 5.6. Default is no; the design works either way.
3. **Sign-off on new copy** marked **(new)** in Section 7. Needed by Gate 4.
4. **Confirmation of the four counter values** (2012, 80+, 50+, 4) and permission to feature Blu Telecommunications by name on the home page.
5. **Partner column assignment**: which logos sit under "Infrastructure" and which under "Intelligence". Proposed: Anthropic, OpenAI, Google, xAI, Microsoft under Intelligence; the rest under Infrastructure. Google and Microsoft can appear in both if preferred.
6. **Real photography** of the Accra office and team, at least six frames, landscape, for the reading room over time. Not blocking.

---

## 13. File map for the build

```
src/
  motion/
    tokens.ts            durations, easings, staggers, distances
    scroll.ts            GSAP + ScrollTrigger registration, Lenis bridge
    LenisProvider.tsx    mounted once in MarketingChrome
    useMotionTier.ts     A | B | C, with the frame-time probe
    Reveal.tsx
    SplitLines.tsx
    Counter.tsx
    Magnetic.tsx
    DevStats.tsx         dev only
  three/
    core/
      CoreCanvas.tsx     dynamic boundary, tier gate, poster crossfade
      CoreScene.tsx      canvas config, fog, post, camera
      CoreObject.tsx     Points + LineSegments, uniforms from store
      Ground.tsx
      Post.tsx           Bloom, Vignette, Noise only
      camera.ts          keyframe track per chapter
      timeline.ts        ScrollTrigger master timeline → store
      store.ts           mutable numbers, no React state
      posters.ts         LQIP map, generated
      shaders/
        core.vert.glsl  core.frag.glsl  edge.vert.glsl  edge.frag.glsl
  app/
    page.tsx             chapter composition
    template.tsx         route crossfade
    components/
      home/
        Arrival.tsx TrustStrip.tsx TurningPoint.tsx Pillars.tsx
        Advantage.tsx Proof.tsx Intelligence.tsx AcademyDoor.tsx
        PartnerWall.tsx Voices.tsx MarkReveal.tsx
      PageHero.tsx       interior arrival band
    _capture/page.tsx    hidden poster capture route, 404 in production
scripts/
  bake-core.mjs          formations + edges → public/three/core.bin, core.json
  capture-posters.mjs    Playwright → public/three/posters/*.webp
  perf-gate.mjs          Lighthouse thresholds
public/
  three/core.bin  three/core.json  three/posters/f0-desktop.webp … f5-mobile.webp
  brand/mark.svg         (asset request)
```

---

## 14. What this replaces

| Old | New |
|---|---|
| `HeroBanner.tsx` with stock hologram image | `home/Arrival.tsx` with the Core |
| `Partners.tsx` ticker | `home/TrustStrip.tsx`, scrubbed slide, no marquee |
| `StrategicPartnerSection.tsx` | `home/TurningPoint.tsx` |
| `ComprehensiveSolutions.tsx` + `SwapGrid.tsx` + `subtract.png` | `home/Pillars.tsx` pinned chapter |
| `InflexionsAdvantage.tsx` hover-reveal grid | `home/Advantage.tsx` editorial grid with counters |
| (nothing) | `home/Proof.tsx` Blu Telecom feature |
| `IntelligentAutomation.tsx` cards | `home/Intelligence.tsx` rows with 3D focus link |
| `AcademyPromo.tsx` | `home/AcademyDoor.tsx` (same content, new register) |
| `MainPartners.tsx` | `home/PartnerWall.tsx` two columns |
| `TestimonialSlider.tsx` on react-slick | `home/Voices.tsx` |
| `CallToAction.tsx` on a photo | `home/MarkReveal.tsx` |
| seven local `useInView` hooks | `motion/Reveal.tsx` |
| `aos`, `react-slick`, `slick-carousel` | removed |
| Interior page hero images with dark overlays | `PageHero.tsx` with formation stills |

The Academy data model, the admin and CRM area, the contact form and its Turnstile integration, the case study data, and the locked header are all untouched by this blueprint.
