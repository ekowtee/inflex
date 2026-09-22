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
| Route shell | 204.1 KB gz | 205 KB |
| Motion chunk | 49.1 KB gz | 60 KB |
| **Environment chunk** | **141.5 KB gz** | 190 KB |
| Preloaded fonts | 46.1 KB | 48 KB |
| Posters, desktop (1920 wide) | 158 KB WebP / 108 KB AVIF | 160 / 110 KB |
| Posters, mobile (780 wide) | 86 KB WebP / 63 KB AVIF | 90 / 65 KB |

The environment chunk was 248 KB with `@react-three/fiber`; removing it and writing the scene in vanilla three with named imports brought it to 146 KB, and a single import site for the canvas to 141.5 KB. The gate now counts only the lazy chunks the home route can reach, because the bundler emits a second copy of the environment for the capture route and the directory-wide count was adding both. The shell rose 3 KB for the arrival component and sits 1.2 KB under its ceiling, which is tight; Phase 2 should expect to take something out of the shell before adding to it.

## 3. Acceptance checks from HERO_SCENE_SPEC.md §10

| # | Check | Result |
|---|---|---|
| 1 | Registration: poster over live frame at 50% | **Pass.** At a 1440×900 viewport (a different aspect from the 1920×1080 capture) the RMSE between the cover-cropped poster and the live frame is 0.029, and a one-pixel shift doubles it, so there is no systematic offset. Object-position is centred; this is what keeps the vertical field of view shared. |
| 2 | Ember hue after the pipeline | Not measured on a calibrated display. No tone mapping is applied, so the encoded value is the authored one. |
| 3 | Banding | Dither is in the composite. Not verified on a physical 1080p panel. |
| 4 | Frame time, Tier A and B floors | **Not measurable here.** Headless Chrome renders through SwiftShader. Needs the device matrix. |
| 5 | Poster weight | **Pass** (table above). |
| 6 | LCP ≤ 2.5 s, environment chunk absent before LCP | The first CI run on this branch measured home LCP at 3.55 s with the headline as the LCP element (a full-viewport image is never an LCP candidate in Chrome; PERFORMANCE_PLAN.md §9.4). Causes found and fixed: both posters preloaded on every device, lit posters fetched up front, the environment evaluated inside the blocking window on Tier B. Re-measured figure: see the CI comment on the latest commit. |
| 7 | Parallax settles in ≥ 0.6 s | By construction (damping 0.06 per frame). Needs a hand on a mouse. |
| 8 | Proximity never exceeds silver | By construction (cap 0.35 heat, below the ember threshold). |
| 9 | Tier C on a real phone | Reduced-motion emulation: no canvas in the document, the unlit poster is the LCP element, the lit poster crossfades in. Needs the real phone for the rest. |
| 10 | Context loss | Handler wired; not simulated. |

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
- **`/privacy` returns 404**; the footer links to it. Pre-existing.
- **Mobile poster registration** is exact only at the captured 390×844 aspect; other phone aspects crop slightly differently from the live scene. Tier B on phones tolerates this because the crossfade is subtle at that scale, but the mobile poster should be captured at two aspects if the field data shows a dominant second shape.
- **Formation 5 (the mark)** mirrors formation 0 until Phase 4 samples `mark-silhouette.svg`.
