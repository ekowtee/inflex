# Phase 1 Report — The Core, arrival only

**Branch:** `phase-1-core`, pushed; preview at the Vercel URL for the branch
**Date:** 22 September 2026
**Scope delivered:** the hero (Beats 0 to 2 in `SCROLL_NARRATIVE.md`): the Core in its resting formation, the poster pair, the readiness contract, the arrival light, pointer parallax and proximity, the three tiers, and the capture pipeline. Formations 1 to 5, the pinned pillars and the timeline are Phases 2 to 4 and are not in this branch.

---

## 1. What was built

| Piece | Where | Notes |
|---|---|---|
| Formation generator | `src/three/core/worker/formations.ts`, `noise.ts` | 16,384 nodes, about 24,000 edges, formations 0 to 4, deterministic from a fixed seed. 12 tests lock determinism, edge lengths, ember share and the Tier B ordering invariants. |
| Worker | `worker/formations.worker.ts` | Generates off the main thread, transfers the buffers. Falls back to the main thread where Workers are unavailable. |
| Shaders | `shaders/nodes.ts`, `edges.ts`, `ground.ts`, `post.ts` | GLSL ES 3.0 template strings; positions fetched from a formation texture; explicit sRGB encoding. |
| Scene | `CoreScene.ts`, `CoreObject.ts`, `ground.ts`, `PostStage.ts` | Vanilla three, one rAF loop, no React in the frame path. Three-pass post stage for Tier A; additive ember pass for Tier B. |
| Boundary | `CoreCanvas.tsx`, `store.ts`, `pointer.ts`, `camera.ts`, `rig.ts` | Tier gate, probe, readiness contract, demotion, context loss. |
| Arrival | `src/app/components/home/Arrival.tsx` | Replaces `HeroBanner.tsx`. Unlit poster as a plain `<picture>` (one file per device, requested at high priority); the lit poster is fetched only when the Tier C crossfade is due; the environment is requested after the LCP candidate paints, and on Tier B a further 3 s later. |
| Capture | `src/app/core-capture/`, `scripts/capture-posters.mjs` | Headless-Chrome capture at a fixed camera and light state; posters within budget; LQIP inlined. Route is a 404 unless `NEXT_PUBLIC_CORE_CAPTURE=1` and is disallowed in robots. |

## 2. Budgets

From `npm run perf -- --bundles` on this branch:

| Budget | Actual | Limit |
|---|---|---|
| Route shell | 165.4 KB gz | 205 KB |
| Motion chunk | 49.1 KB gz | 60 KB |
| **Environment chunk** | **141.5 KB gz** | 190 KB |
| Preloaded fonts | 46.1 KB | 48 KB |
| Posters, desktop (1920 wide) | 158 KB WebP / 108 KB AVIF | 160 / 110 KB |
| Posters, mobile (780 wide) | 86 KB WebP / 63 KB AVIF | 90 / 65 KB |

The environment chunk was 248 KB with `@react-three/fiber`; removing it and writing the scene in vanilla three with named imports brought it to 146 KB, and a single import site for the canvas to 141.5 KB. The gate now counts only the lazy chunks the home route can reach, because the bundler emits a second copy of the environment for the capture route and the directory-wide count was adding both. The shell figure fell from 204 to 165 KB because the gate had been counting the 38 KB polyfill bundle, which is a `nomodule` script that module-capable browsers never request. Of the 165 KB, about 143 KB is the React and Next runtime; the site's own client code in the shell is about 22 KB.

## 3. Acceptance checks from HERO_SCENE_SPEC.md §10

| # | Check | Result |
|---|---|---|
| 1 | Registration: poster over live frame at 50% | **Pass.** At a 1440×900 viewport (a different aspect from the 1920×1080 capture) the RMSE between the cover-cropped poster and the live frame is 0.029, and a one-pixel shift doubles it, so there is no systematic offset. Object-position is centred; this is what keeps the vertical field of view shared. |
| 2 | Ember hue after the pipeline | Not measured on a calibrated display. No tone mapping is applied, so the encoded value is the authored one. |
| 3 | Banding | Dither is in the composite. Not verified on a physical 1080p panel. |
| 4 | Frame time, Tier A and B floors | **Not measurable here.** Headless Chrome renders through SwiftShader. Needs the device matrix. |
| 5 | Poster weight | **Pass** (table above). |
| 6 | LCP ≤ 2.5 s, environment chunk absent before LCP | **Pass on the observed paint; the simulated table still says 3.2 s.** See §3a. The environment is requested only after the LCP entry is observed, and on Tier B three seconds later still. |
| 7 | Parallax settles in ≥ 0.6 s | By construction (damping 0.06 per frame). Needs a hand on a mouse. |
| 8 | Proximity never exceeds silver | By construction (cap 0.35 heat, below the ember threshold). |
| 9 | Tier C on a real phone | Reduced-motion emulation: no canvas in the document, the unlit poster is the LCP element, the lit poster crossfades in. Needs the real phone for the rest. |
| 10 | Context loss | Handler wired; not simulated. |

## 3a. The LCP number, and a call for you

The CI table after the hero fixes (commit `39836f1`):

| Route | FCP | LCP (simulated) | SI | TBT |
|---|---|---|---|---|
| `/` | 1221 | 3256 | 1902 | 72 |
| `/solutions` | 1218 | 3179 | 1240 | 58 |
| `/solutions/network-infrastructure` | 1065 | 3047 | 1149 | 78 |
| `/academy` | 1214 | 3070 | 1214 | 55 |
| `/contact` | 1065 | 3083 | 1285 | 41 |

The hero fixes did what they were meant to: home blocking time fell from 511 ms to 72 ms and speed index from 3.9 s to 1.9 s, and the home page now behaves like every other route. What they did not do is move LCP, and neither did anything else: `/contact`, with no hero and no 3D, has the same 2 s gap between first paint and LCP as the home page, and it had it on `main` before Phase 1.

That gap is not real. Lighthouse's own trace of the home page puts first paint and largest paint at the same instant (207 ms unthrottled; identical again under real DevTools throttling). Blocking the web fonts changes nothing. The 2 s comes from the simulated throttling model, which charges a text LCP for every script fetched before the paint, so the headline is billed for downloading and parsing the React and Next runtime on a 4× slowed CPU even though those scripts are `async` and never block the paint. PERFORMANCE_PLAN.md §9.5 has the detail.

The observed pass on the next commit (`6a8c042`), same runner, real throttling:

| Route | FCP | LCP (observed) | SI | TBT | CLS |
|---|---|---|---|---|---|
| `/` | 1679 | **1679** | 1919 | 374 | 0.018 |
| `/solutions` | 1662 | 1933 | 1841 | 40 | 0.000 |
| `/solutions/network-infrastructure` | 1657 | 1861 | 1814 | 46 | 0.000 |
| `/academy` | 1667 | 1903 | 1836 | 42 | 0.006 |
| `/contact` | 1627 | 1627 | 1637 | 60 | 0.083 |

LCP is the first paint on the home page and within 0.3 s of it everywhere else, all under 2.5 s. Two things in this table breach a threshold and neither is the hero:

- **Home TBT 374 ms.** Attributed locally under the same throttling: about 225 ms is the style and layout of the whole home page at first paint (no script; the page is 124 KB of server-rendered HTML), about 160 ms is React hydration, and the rest is the motion engine and the environment evaluating much later, which the observed pass still counts because the animation loops keep the main thread from ever reaching Lighthouse's "interactive" quiet window. The first two are the shell and the page's length, not Phase 1; the third is a lab-window artefact. If it matters for the gate, the honest fix is `content-visibility: auto` on the below-the-fold sections (Phase 2, since it interacts with smooth scroll).
- **Contact CLS 0.083, home 0.018.** Both measure 0.000 locally under the same throttling, and 0.000 on the simulated pass on the same runner minutes earlier. Run-to-run on the shared runner, most likely font arrival timing. Worth watching, not worth acting on from one sample.

What changed as a result:

- `scripts/perf-gate.mjs --throttling devtools` observes the paint under real throttling instead of modelling it. The CI workflow now runs both and prints both tables on the commit.
- The gate no longer counts the `nomodule` polyfill bundle as shell weight (38 KB that modern browsers never fetch).

**The call:** when Lighthouse becomes blocking at the end of Phase 1, which LCP figure gates the build?

1. **Observed (recommended).** It is the paint a visitor sees and it matches what GA4 will report from the field. It varies more run to run on a shared runner, so the threshold should be applied to the median of three runs, as now.
2. **Simulated.** Stable, but it cannot pass 2.5 s on slow 4G while the framework runtime is 143 KB, so gating on it means either accepting a permanent red or raising the threshold to about 3.5 s, at which point it is a shell-weight budget with an LCP label.

Nothing in the hero depends on this choice; it decides what the gate says, not what the page does.

## 4. What to check on real hardware (yours to do)

The preview is behind Vercel's SSO protection, so nothing outside a signed-in browser can reach it; measure with the CI table, and look with your eyes:

1. **Desktop, Tier A.** The poster should be replaced by the live scene within about two seconds on office wifi with no visible jump, then the ember line should ignite left to right over about two seconds. Move the mouse: the object tilts a few degrees and nodes near the cursor warm to silver. A fast sweep should feel heavy, never snappy. Watch the frame counter in `DevStats` if you run a dev build.
2. **A mid-range Android phone.** It should land on Tier B (no bloom, additive glow on the line) or Tier C (posters only). Either must look like the same object.
3. **Any device with reduced motion on.** Posters only, lit crossfade about a second after load.
4. **The 8 s cutoff.** On a very slow connection the poster should simply stay; nothing should flash in late.

## 5. Decisions taken and revisions to the specification

Recorded in `HERO_SCENE_SPEC.md` §11a. The ones that matter to the plan:

- **No React binding for three** (removes a planned dependency; environment chunk 248 → 146 KB).
- **No tone mapping**; explicit sRGB in the shaders.
- **Ember line is 2% of nodes**, not 6%; the wider band read as a painted stripe.
- **Positional key shading, border dissolve and density variation** on the sheet so it reads as a structure rather than fabric.
- **Hero camera key** (−1.3, 1.3, 6.0) → (−1.0, −0.15, 0), object right of the copy, seen from upper-left.
- **Display XL is 4.6vw**, not 6.5vw.
- **Posters captured at 1920 wide**, not 2560; the 2560 captures were 205 KB.
- **Bloom rest intensity 0.38**, not 0.55.

## 6. Known gaps and follow-ups

- **Header logo clips at some widths** (about 1440 px): the locked header's absolute logo position. Untouched by decision.
- **Beats 1 and 2 camera keys** are set (100 vh and 130 vh) but the scroll value comes from a plain scroll listener; the ScrollTrigger timeline replaces it in Phase 2.
- **The canvas is clipped to the hero** for now. It was fixed to the viewport, and on the real site that meant the Core showed through every later section without an opaque background (the partners and stats block, the Academy card). Phase 2 pins it through Beats 1 and 2 with the ScrollTrigger timeline, under sections designed to sit over it.
- **`/privacy` returns 404**; the footer links to it. Pre-existing.
- **Mobile poster registration** is exact only at the captured 390×844 aspect; other phone aspects crop slightly differently from the live scene. Tier B on phones tolerates this because the crossfade is subtle at that scale, but the mobile poster should be captured at two aspects if the field data shows a dominant second shape.
- **Formation 5 (the mark)** mirrors formation 0 until Phase 4 samples `mark-silhouette.svg`.
