# Inflexions I.T. — Performance Plan

**Front-end performance audit of the animated 3D redesign, before any of it ships**
**Prepared:** 22 September 2026
**Audience:** the engineer or agent building the redesign; the owner for the three budget decisions in Section 10
**Method:** the current site was built for production (`next build`, Next 16 with Turbopack) and its home page payload measured from the prerendered HTML; every file in `public/` was weighed; library sizes were taken from published package data. Estimates are marked as estimates. Everything else is measured.

---

## 0. Verdict

**The current site is not slow because of JavaScript. It is slow because of images.** The home page requests 14.6 MB of images across 52 files, including three 2 MB placeholder portraits and a 1.7 MB PNG photograph as the hero. None of the 73 image tags on the marketing pages carries a width and height, so every one of them can shift layout. The JavaScript is 218 KB gzipped, which is ordinary for a Next 16 site and includes an 18 KB carousel library that is being removed anyway.

**The 3D plan is affordable, with two corrections.** The post-processing library specified in the creative direction weighs 113 KB gzipped on its own and tree-shakes poorly; it would push the environment chunk past its budget by about 25 KB. It is replaced with a three-pass post stage written by hand, about 4 KB. And the route shell budget of 190 KB in the creative direction is below what Next 16 and React 19 cost before a single component is added; the corrected budget is 205 KB, with GSAP and Lenis moved into a separate motion chunk that loads after first paint.

**First paint does not depend on JavaScript.** The hero's poster and headline are server-rendered HTML and an image. The measurable target is a Largest Contentful Paint at or under 2.5 s on a throttled slow 4G lab run and at or under 1.5 s at the 75th percentile in the field on desktop. The design achieves this only if the image plan in Section 5 is executed first. Motion work that starts before the image work is building on a page that fails its own gate.

---

## 1. Baseline: what the site costs today

Measured from `.next/server/app/index.html` after a production build, and from `public/`.

### 1.1 Home page network payload

| Resource | Measured | Notes |
|---|---|---|
| HTML | 17 KB gz (111 KB raw) | 17 inline scripts, mostly React Server Component payload and two JSON-LD blocks. Fine. |
| JavaScript | **218 KB gz**, 12 files | 69 KB React DOM, about 75 KB Next runtime and router, 18 KB `react-slick`, 10 KB `lucide-react`, the rest page code. |
| CSS | 20 KB gz, 4 files | Tailwind output 17 KB plus three small chunks including the slick carousel theme and its icon font. |
| Fonts | **70 KB preloaded**, 4 files | 19 font files are generated (7 weights across unicode-range subsets); 4 Latin files are preloaded. |
| Images | **14.6 MB**, 52 files | 50 `<img>` tags in the HTML. The three testimonial placeholders alone are 7.1 MB. The hero is a 1,792 × 576 PNG at 1.7 MB. |
| Third-party | 0 | Turnstile loads only on `/contact`. GA4 is wired but inactive until an ID is set. |

### 1.2 Repository assets

| Measure | Value |
|---|---|
| `public/` total | 92 MB |
| Rasters by format | 93 PNG, 43 JPEG, 1 WebP |
| Files over 1 MB | 25, the largest 6.2 MB |
| Largest single image on the home page | 2.6 MB (a placeholder portrait) |
| Marketing `<img>` tags | 73 |
| With `width` and `height` | **0** |
| Using `next/image` on marketing pages | 3 components (header, an unused client strip, a testimonial section) |

### 1.3 What this means

At the 1.6 Mbps slow 4G profile, 14.6 MB is 73 seconds of download. The page works today only because the images below the fold are lazy-loaded and most visitors never reach them. The hero PNG alone is about 9 seconds at that speed, which puts the current LCP somewhere between 5 and 10 seconds on a congested mobile connection. The 3D plan inherits none of these images on the home page, which is the single largest performance win available, and it must not inherit the practice that produced them.

---

## 2. Asset weight of the planned site

### 2.1 Library sizes (published package data, gzipped, whole package)

| Package | Version | Whole package | Realistic tree-shaken use | Notes |
|---|---|---|---|---|
| `three` | 0.186 | 185 KB | 120 to 135 KB | Points, LineSegments, ShaderMaterial, WebGLRenderer, DataTexture, render targets, camera, fog. No loaders, no controls, no standard materials. |
| ~~`@react-three/fiber`~~ | — | — | — | **Removed 22 September 2026.** Its namespace import of three defeats tree shaking; the scene is vanilla three. |
| `postprocessing` | 6.39 | **113 KB** | 75 to 85 KB | Poor tree-shaking; the EffectComposer pulls most of the library. **Removed from the plan.** |
| `gsap` core | 3.15 | 27 KB | 27 KB | Plus ScrollTrigger, about 15 KB, and SplitText, about 8 KB. |
| `lenis` | 1.3 | 5.5 KB | 5.5 KB | |
| `web-vitals` | 4 | 2 KB | 2 KB | Added for field measurement. |

### 2.2 Corrected chunk budgets

The creative direction set two budgets: route shell 190 KB, environment 230 KB. Both are revised.

| Chunk | Contents | Budget (gz) | Estimate (gz) | Loads |
|---|---|---|---|---|
| **Route shell** | Next runtime, React DOM, page components, motion primitives (CSS-driven fallbacks only), `lucide-react` icons used on the page | **≤ 205 KB** | 200 KB (218 today minus 18 KB `react-slick`) | Immediately. Does not gate LCP. |
| **Motion** | GSAP core, ScrollTrigger, SplitText, Lenis, the ScrollTrigger timeline | **≤ 60 KB** | 56 KB | After LCP, every tier. Until it arrives, the hero's line reveals run on CSS animations so the arrival never waits for it. |
| **Environment** | `three` (named imports, tree-shaken), the Core, shaders, the hand-written post stage, the formation worker | **≤ 190 KB** | **146 KB measured** | After the motion chunk, Tier A and B only, after the poster has painted and the tier gate has passed. |
| **Formation data** | Generated in the worker | 0 KB | 0 KB | Never downloaded. |
| **Mark silhouette** | `mark-silhouette.svg` re-exported with one-decimal coordinates and run through svgo | ≤ 12 KB | 30 KB today, about 11 KB after | When Beat 8 is within 200 vh. |
| **GA4** | gtag.js | about 95 KB | 95 KB | `lazyOnload`, after everything above. Not on any budget line because it is not ours, and not before LCP under any circumstances. |

Totals by tier: Tier A eventually loads about 435 KB gz of first-party JavaScript over the session; Tier C loads about 260 KB. The PRD's 350 KB figure is met on Tier C and exceeded on Tier A by design; the extra 175 KB arrives after the page is already painted and interactive.

### 2.3 Why `postprocessing` is out and what replaces it

The library's composer, its shader chunks, and the bloom effect together weigh more than the whole of `@react-three/fiber`. The hero needs exactly three operations: blur the ember layer, add it back, and apply a vignette, dither and tone map. Written by hand that is:

1. Render the ember nodes (draw range prefix, Section 4.1 of `HERO_SCENE_SPEC.md`) to a half-resolution `RGBA16F` render target.
2. Two-pass separable Gaussian blur, 9 taps, at quarter resolution, into a second target.
3. One full-screen composite shader: scene colour plus blurred ember times intensity, then vignette, then a per-frame blue-noise dither, with AgX tone mapping done by the renderer's output stage.

About 4 KB of code, three draw calls, and it does only what the scene needs. The bloom rise in Beat 8 is one uniform on the composite pass.

### 2.4 Images and posters (the planned home page)

| Asset | Count | Format | Budget |
|---|---|---|---|
| Hero posters, unlit and lit, desktop and mobile | 4 | AVIF with WebP fallback | ≤ 110 KB AVIF, ≤ 160 KB WebP desktop; ≤ 65 KB AVIF, ≤ 90 KB WebP mobile |
| Formation posters for Tier C, formations 1 to 5, desktop and mobile | 10 | AVIF with WebP fallback | Same per-file budgets; loaded one at a time as each beat approaches |
| Client roster logos | 7 | SVG where a vector exists; otherwise WebP at 240 px wide, 2×, ≤ 8 KB each | ≤ 60 KB total |
| Partner logos | 19 | Existing SVG, run through svgo | ≤ 50 KB total |
| Proof card images | 0 | none | The cards are type and a border. |
| Below-fold photography (Advantage removed; none remains on the home page) | 0 | | |
| **Home page images, Tier A, first view** | | | **≤ 300 KB** including the LCP poster |
| **Home page images, full scroll, Tier C** | | | **≤ 900 KB** |

Dark point-field posters compress unusually well in AVIF because most of the frame is a flat colour; expect AVIF at roughly 55 to 65% of the WebP size. The `<picture>` element serves AVIF first with WebP fallback; `next/image` does this automatically once `images.formats` is set to `['image/avif', 'image/webp']` in `next.config.ts`.

---

## 3. Render cost per scene

Targets are per frame on the Tier A reference device (Intel Iris Xe, 1920 × 1080, DPR 1.25, about 3.4 megapixels of canvas). Tier B is the Galaxy A14 class at DPR 1, about 0.4 megapixels, without the post stage. The whole-frame budget is 16.7 ms at 60 fps; the scene's share is capped at 9 ms so the browser has room for compositing, text reveals and the pinned section's own work.

| Scene | Beat | Draw calls | Vertices | GPU, Tier A | GPU, Tier B | CPU per frame | Notes |
|---|---|---|---|---|---|---|---|
| Hero, idle | 0 | 4 + 3 post | 65k | 5.0 ms | 3.2 ms | ≤ 1.0 ms | Breathing and pointer damping only. |
| Trust strip | 1 | same | 65k | 4.6 ms | 3.0 ms | ≤ 1.0 ms | Object dims to 70%; nothing else changes. |
| Turning point | 2 | same | 65k | 5.6 ms | 3.6 ms | ≤ 1.2 ms | Curl noise in the vertex shader for both nodes and edges during the resolve. |
| Pillars, pinned | 4 | 5 + 3 post | 65k | 6.5 ms | 4.0 ms | ≤ 1.5 ms | Morph plus curl at mid-transition; ground grid on in formations 1 and 4. The highest sustained cost on the page. |
| Ivory beats | 3, 5, 6, 7, 9 | 0 | 0 | 0 | 0 | 0 | Canvas hidden and `frameloop="demand"`. Verify with the frame-time overlay that no frames are rendered. |
| Mark reveal | 8 | 4 + 3 post | 65k | 6.0 ms | 3.4 ms | ≤ 1.0 ms | Bloom intensity 0.9 costs nothing extra; the blur passes are the same size. |
| Interior page hero | all | 0 | 0 | 0 | 0 | 0 | Posters only. |
| `/solutions` pillars-only | | as Beat 4 | 65k | 6.5 ms | 4.0 ms | ≤ 1.5 ms | The only interior page with a live canvas. |

### 3.1 Rules that keep the numbers true

- **Canvas pixel cap, not DPR cap.** The creative direction caps DPR at 1.75, which on a 2560 × 1600 MacBook is 5.4 megapixels and blows the budget. Set DPR so the canvas never exceeds **4.2 megapixels**: `dpr = min(devicePixelRatio, sqrt(4.2e6 / (w × h)), 1.75)`. On the reference laptop this yields 1.25; on the MacBook 1.4; on a 4K monitor 1.0.
- **Post stage at half resolution** for the ember target and quarter for the blur. Never full.
- **No React work per frame.** The store bridge in `src/three/core/store.ts` is plain numbers; `useFrame` reads them; no `setState` in the loop. Confirm with the React profiler that scrolling produces zero commits.
- **One requestAnimationFrame owner.** Lenis, ScrollTrigger and the renderer all run inside GSAP's ticker. Two rAF loops on a mobile GPU is the classic cause of 45 fps that "should be 60".
- **Text motion is transform and opacity only.** No animated `height`, `top`, `filter`, or `box-shadow`. `will-change: transform` is set by the primitive for the duration of the reveal and removed after.
- **Below-fold Ivory sections get `content-visibility: auto`** with an explicit `contain-intrinsic-size`, so their layout cost is deferred until they approach the viewport and their images do not decode early.
- **Shader compilation happens behind the poster.** Call `renderer.compileAsync(scene, camera)` (which uses `KHR_parallel_shader_compile` where available) before the crossfade is permitted. Compilation on Intel integrated graphics is 300 to 800 ms and must never land on a visible frame.
- **No `backdrop-filter` on anything larger than the header strip.** If the header is unlocked for the frosted variant, the blur region is 64 px tall and costs about 1 ms on mobile. A frosted full-height drawer would cost ten times that.

---

## 4. Network conditions of the audience

### 4.1 What is known

Nothing is measured yet: the site has no analytics and no field vitals. GA4 is wired (22 September 2026) and inactive until the Measurement ID is set. The profiles below are working assumptions from the audience analysis and from what Ghanaian mobile networks typically deliver; they are replaced with field data at Gate 1.

### 4.2 Profiles the plan is tested against

| Profile | Who | Downlink | RTT to origin | Share (assumed) | Lab equivalent |
|---|---|---|---|---|---|
| **Office fibre or Wi-Fi, Accra** | CTO, IT manager, evaluators, most weekday traffic | 10 to 50 Mbps | 90 to 160 ms (nearest CDN edge is likely southern Africa or Europe; measure with `curl -w` from Accra) | 50% | No throttling, but RTT matters: every render-blocking round trip costs about 120 ms. |
| **MTN or Telecel 4G, good** | Phone in the office or at home | 5 to 20 Mbps | 60 to 120 ms | 25% | Lighthouse "4G" (9 Mbps / 170 ms) |
| **4G, congested or moving** | Phone in traffic, at an event, in a bank branch | 1.5 to 3 Mbps | 200 to 400 ms | 20% | **Lighthouse "slow 4G" (1.6 Mbps / 150 ms). This is the gate profile.** |
| **3G fallback** | Edge cases outside Accra | 0.4 to 1 Mbps | 400 ms+ | 5% | Not gated; Tier C by the `saveData` or `effectiveType` signal, must still paint text and the LQIP within 3 s. |

### 4.3 The RTT problem is bigger than the bandwidth problem for desktop visitors

A visitor on 30 Mbps fibre in Accra still pays 120 to 160 ms per round trip to a distant edge. The critical path therefore has to be short in round trips, not just in bytes: one HTML response, then CSS, fonts and the poster all in parallel from the same origin over one HTTP/2 connection, then nothing else before paint. Any render-blocking third-party host adds a DNS lookup, a TLS handshake and a request, roughly 400 ms. There are none on the critical path and there must never be.

Action: measure real RTT from Accra to the deployed origin and to the static asset host before Gate 1, and record it in this document. If it exceeds 200 ms, consider whether the static assets should be fronted by a CDN with a West African point of presence.

---

## 5. Fonts

### 5.1 Today

`src/app/layout.tsx` requests Rubik at 400, 500, 700 and 800 and Krub at 400, 500 and 600: seven weights. `next/font` self-hosts them, subsets them by unicode range, and preloads the four Latin files it decides are critical, 70 KB in total. Display is `swap` and `adjustFontFallback` is on, which is correct: the fallback is size-adjusted so the swap does not shift layout.

### 5.2 The plan

The new type system (`CREATIVE_DIRECTION_3D.md` Section 5.3) uses Rubik 400, 600 and 700 and Krub 500. Nothing uses Rubik 800 or Krub 400 and 600 in the new pages. Rubik 500 is used by `font-medium` across the current site; keep it until the last Ivory page is re-set, then drop it.

| Face and weight | Role | Preload | Budget |
|---|---|---|---|
| Rubik 700 | H1, display, H2 | Yes | 12 KB |
| Rubik 400 | Body | Yes | 12 KB |
| Krub 500 | Eyebrow in the hero, telemetry | Yes | about 10 KB |
| Rubik 600 | H2, H3 below the fold | No (fetched on first use, non-blocking) | 12 KB |
| Rubik 500 | Legacy `font-medium` until retired | No | 12 KB |
| **Preloaded total** | | | **≤ 36 KB** (from 70) |

Rules:
- Latin subset only. The site is English; the `latin-ext` glyphs are not needed. Confirm `subsets: ["latin"]` stays as it is.
- Keep `display: "swap"` with `adjustFontFallback`. `optional` would be lighter but would show the system font on a slow first visit, which is the wrong trade for a premium first impression; the swap on same-origin fonts over HTTP/2 lands within about 150 ms of the HTML on every profile except 3G.
- The hero H1 must not be split into lines by SplitText until the font has loaded (`document.fonts.ready`), otherwise the split is measured against the fallback and re-splits visibly. The CSS-driven fallback reveal covers the gap.
- Remove the slick carousel icon font (`slick.woff`) with the carousel.

---

## 6. Compression plan

### 6.1 Images: the one-time clean-up (Phase 0, before any motion work)

1. **Delete what nothing references.** Build a list of every image path referenced in `src/` and delete every file in `public/` that is not on it. Expect the repository's `public/` to fall from 92 MB to under 15 MB from this step alone. The placeholder portraits and the placeholder client logos are already unreferenced.
2. **Convert every remaining photograph** with a script (`scripts/optimise-images.mjs`, using `sharp`): source PNG or JPEG in, AVIF (quality 55) and WebP (quality 78) out, at three widths (640, 1280, 1920) plus a 24 px LQIP. Keep the master JPEG out of `public/` in a `assets-src/` folder that is not served. Photographs are never PNG. Target: no served raster over 250 KB, and every photograph under 120 KB at its 1280 width.
3. **Adopt `next/image` for every raster** on the marketing pages, with `sizes` set to the real rendered width, `width` and `height` always present, `priority` only on the LCP element of each page, and `loading="lazy"` plus `decoding="async"` everywhere else. This eliminates the 73 dimension-less tags and the layout shift they cause.
4. **Set `images.formats: ['image/avif', 'image/webp']`** in `next.config.ts` so the optimiser serves AVIF to browsers that accept it.
5. **SVG logos through svgo** with `removeDimensions` off and `convertPathData` precision 2. The one logo that is a PNG wrapped in an SVG becomes a real 240 px WebP.
6. **Posters** are generated by the capture script directly as AVIF and WebP at the budgets in Section 2.4. The LQIP is a 24 px WebP inlined as a `data:` URI in the component, never a separate request.

### 6.2 JavaScript and CSS

- Vercel serves Brotli; nothing to configure. Budgets in this document are gzip because gzip is what the build tooling reports; Brotli will be about 15% smaller in the field.
- Shaders are template strings; strip comments and leading whitespace at build with a tiny loader so a 6 KB GLSL file ships as 3 KB. Do not minify identifiers; the debug value is worth more than 1 KB.
- `react-slick`, `slick-carousel` and `aos` are removed from `package.json`; `react-icons` stays only because the locked header imports two icons from it.
- Tailwind v4 output is already 17 KB gz; no action.

### 6.3 Data

- Formation geometry is generated in the worker and never crosses the network.
- `mark-silhouette.svg` re-exported with one-decimal coordinates and svgo: 30 KB to about 11 KB. The `viewBox` and file name are the contract; nothing else changes.

---

## 7. Lazy load order

The sequence for the home page on Tier A. Tier B is identical without the post stage. Tier C stops at step 6 and never fetches steps 7 to 9.

| # | Milestone | What loads | Mechanism | Must not |
|---|---|---|---|---|
| 1 | Request | HTML (17 KB gz), prerendered, with the LQIP inline and the hero copy in the markup | Static route (confirmed `○` in the build) served from the CDN | Become dynamic. No `cookies()` or `headers()` in the marketing layout, ever. |
| 2 | HTML parsed | CSS (20 KB), three preloaded fonts (36 KB), the unlit hero poster (65 to 160 KB) | `<link rel=preload>` emitted by `next/font`; the poster is `priority` with `fetchPriority="high"` and `sizes="100vw"` | Preload anything else. Three fonts and one image is the whole preload list. |
| 3 | **First paint** | LQIP blurred behind the copy, H1 set in the fallback font metrics | | |
| 4 | **LCP** | The poster decodes and paints | | Wait for any script. |
| 5 | Hydration | Route shell (≤ 205 KB) | Normal Next chunk loading, `defer` | Include GSAP, Lenis, three. |
| 6 | Interactive | CSS-driven hero line reveals have already run; the CTA is clickable | | |
| 7 | After LCP + idle | Motion chunk (≤ 60 KB) | `requestIdleCallback` after the `onLCP` callback from `web-vitals` fires, with a 2 s timeout fallback; Lenis and ScrollTrigger take over from the CSS reveals seamlessly (they read the same tokens) | Load before LCP. |
| 8 | Tier gate passed | Environment chunk (≤ 190 KB), then the worker starts | `next/dynamic` with `ssr: false`, triggered by the tier decision, at most one call | Load on Tier C. Load if `saveData` is set. |
| 9 | Scene ready | Shaders compiled asynchronously, formation 0 uploaded, three frames under 20 ms measured, crossfade permitted | Section 9.3 of the hero spec | Crossfade after 8 s or after the visitor has scrolled past Beat 2. |
| 10 | Visitor approaches Beat 3 | Nothing; the proof beat is type | | |
| 11 | Beat 4 within 100 vh (Tier C only) | The next formation poster | `IntersectionObserver` with `rootMargin: "100% 0px"`, one poster at a time | Prefetch all five at once. |
| 12 | Beat 8 within 200 vh | `mark-silhouette.svg` (≤ 12 KB) | `fetch` on the observer, then the worker samples it | |
| 13 | Idle, after everything | GA4 (`lazyOnload`), `web-vitals` beacons | `next/script` strategy `lazyOnload` | Ever move to `afterInteractive`. |
| 14 | Link hover or viewport | Next prefetches interior routes | Default `next/link` behaviour; keep it, the RSC payloads are small | Prefetch on mobile with `saveData` set (Next honours this already). |

The order has one invariant: **nothing from step 5 onward is on the path to step 4.** If a change to the plan ever puts a script before the poster, the change is wrong.

---

## 8. Frame budget per scene, and the frame-time gate

Summarised from Section 3 for the acceptance script. The 99th percentile is measured over a 30 s idle plus one full scroll at about 1,000 px per second.

| Scene | Tier A p99 frame | Tier B p99 frame | Renders while hidden |
|---|---|---|---|
| Hero | ≤ 14 ms | ≤ 22 ms | n/a |
| Trust strip and turning point | ≤ 15 ms | ≤ 24 ms | n/a |
| Pillars, pinned | ≤ 16.7 ms | ≤ 26 ms | n/a |
| Ivory beats | ≤ 8 ms (page only) | ≤ 12 ms | **0 frames** |
| Mark reveal | ≤ 16 ms | ≤ 24 ms | n/a |
| Interior pages | ≤ 8 ms | ≤ 12 ms | 0 (no canvas) |

The frame-time probe in the hero spec (90 frames, mean above 24 ms demotes a tier) stays. Add a second rule: **any single frame above 50 ms during the pinned section, twice in a session, demotes Tier A to B.** A single long frame is a scroll hitch the visitor feels; two is a pattern.

---

## 9. Measurable targets for first paint

### 9.1 Lab (gates in `scripts/perf-gate.mjs`, run on every build against `/`, `/solutions`, one pillar page, `/academy`, `/contact`)

| Metric | Slow 4G profile (the gate) | Desktop, no throttle | Notes |
|---|---|---|---|
| TTFB | ≤ 0.6 s | ≤ 0.3 s | Static prerender from the CDN; higher means the route went dynamic. |
| First Contentful Paint | ≤ 1.8 s | ≤ 0.8 s | The H1 in fallback metrics and the LQIP. |
| **Largest Contentful Paint** | **≤ 2.5 s** | **≤ 1.2 s** | The unlit poster. Must be the poster on every viewport; if Lighthouse reports the H1 as the LCP element on mobile, the poster is loading too late. |
| Cumulative Layout Shift | ≤ 0.02 | ≤ 0.02 | Includes the pin spacing of Beat 4. |
| Total Blocking Time | ≤ 200 ms | ≤ 100 ms | Hydration of the shell only; the environment chunk must not be in the trace before LCP. |
| Speed Index | ≤ 3.0 s | ≤ 1.5 s | |
| Route shell | ≤ 205 KB gz | | From the build manifest. |
| Environment chunk | ≤ 190 KB gz | | From the build manifest. |
| Images before LCP | ≤ 1 request | | The poster. |

### 9.2 Field (the numbers that matter, reported to GA4 by `web-vitals` with a `tier` and `effectiveType` label on every event)

| Metric | p75 target | Review |
|---|---|---|
| LCP | ≤ 2.5 s all devices; ≤ 1.5 s desktop | Weekly for the first month after launch, then monthly |
| INP | ≤ 200 ms | The pinned section's keyboard handling is the risk |
| CLS | ≤ 0.05 | |
| Tier distribution | Report only | If Tier C exceeds 25% of desktop sessions, the probe is too strict or the shaders too heavy |
| Crossfade success | ≥ 90% of Tier A sessions reach the live scene within 8 s | Custom event |

### 9.2a Where the lab numbers are taken (added 22 September 2026)

The Lighthouse thresholds are judged on the GitHub Actions runner
(`.github/workflows/perf-gate.yml`), not on a developer laptop. On the
owner's machine, ESET Security's TLS filtering hands Chrome uncompressed
response bodies (the main stylesheet arrives at 105 KB where the wire size is
under 2 KB), so Lighthouse's network model charges about three times the real
bytes and every simulated timing is inflated to match, local and production
alike. The bundle checks are unaffected and remain valid anywhere. To get a
meaningful local reading, exclude the browser from ESET's SSL/TLS protocol
filtering, or use PageSpeed Insights.

First production measurement of the Phase 0 build from a clean runner is the
first run of that workflow; earlier figures in `PHASE0_REPORT.md` §4 were
taken on the affected laptop and are directionally right only.

### 9.4 What Chrome counts as the LCP element (found 22 September 2026)

Chrome does not consider an image that covers the entire viewport as an LCP
candidate; it treats it as wallpaper. Verified with stripped test pages: the
poster at 90% of the viewport is the LCP element, a photograph at full bleed
is not, and the home page's only candidate is the H1. So the hero's LCP
element is the headline, and the LCP time is when the headline last painted,
which moves when the web font arrives. That makes the headline's font path
the thing the metric measures, not the poster. §9.1's note that the LCP
element "must be the poster" is withdrawn.

Consequences applied in `Arrival.tsx`: one poster per device through a
`<picture>` with media-specific sources (two `next/image` elements with
`priority` preloaded both posters on every device); the lit poster is
requested only when the Tier C crossfade needs it; Tier B holds the
environment chunk until three seconds after the LCP candidate so its parse
and compile fall after the page's quiet window.

### 9.5 Modelled LCP against observed LCP (found 22 September 2026)

Every route on `main` and on `phase-1-core` reports an LCP of about 3.0 to 3.4 s
from the CI gate while FCP sits at 1.1 to 1.2 s, and the gap is the same on
`/contact`, which has no hero, no 3D and a text LCP element. The gap is not
real paint time. It is how Lighthouse's default `simulate` throttling models
a text LCP:

- **Observed, unthrottled** (Lighthouse's own trace of the home page): first
  contentful paint 207 ms, largest contentful paint 207 ms. The headline
  paints in the first frame with the fallback font, exactly as intended.
- **Observed, DevTools throttling** (real slow-4G and 4× CPU applied to the
  browser): FCP and LCP identical, both the first paint.
- **Simulated** (the default, and what the CI table shows): FCP 1.2 s,
  LCP 3.1 s, "render delay" 93 % of it. Blocking the web fonts does not
  move it. Lighthouse's Lantern model builds the LCP estimate from every
  request that started before the observed LCP timestamp, so a text LCP
  that happens at first paint is charged for the route shell's download and
  parse on a 4× CPU. The shell scripts are `async` and do not block the
  paint in a real browser.

Consequences:

1. **The simulated LCP is a proxy for shell weight, not for when the
   headline appears.** It will not drop below about 3 s on slow 4G while the
   React and Next runtime is 150 KB gzipped, whatever the hero does. Field
   LCP (the GA4 web-vitals events, §9.2) reports the real paint and is the
   number that counts for ranking.
2. **The CI table now prints both.** `scripts/perf-gate.mjs --throttling
   devtools` observes the paint under throttling; the workflow runs it after
   the simulated pass. The observed figure has more run-to-run variance (it
   is a real browser on a shared runner), which is why the simulated pass
   stays as the stable trend line.
3. **The route shell is 165 KB gzipped for a modern browser, not 204.**
   The 38 KB polyfill bundle is a `nomodule` script that module-capable
   browsers never request; the gate was counting it. Corrected in the gate
   on 22 September 2026. The 205 KB ceiling stands; the headroom is now
   40 KB rather than 1 KB.

Decision for the owner (§10): which LCP figure gates the build once
`LIGHTHOUSE_BLOCKING` turns on at the end of Phase 1. The recommendation is
the observed one, with the simulated table kept for trend.

### 9.3 Definition of "first paint" for this site

First paint is not a blank canvas clearing to obsidian. It is **the H1 legible and the hero composition visible**, which means the LQIP has painted behind the copy. That happens at FCP. The visitor's impression of speed is set at LCP, when the sharp poster replaces the blur. The live 3D scene arriving later is invisible as a performance event because the crossfade starts from an identical still. This is the whole reason the poster pair exists, and it is why the LCP target is the only first-paint number the owner needs to watch.

---

## 10. Decisions for the owner

> **Decided 22 September 2026.** 1: corrected budgets approved; they are the perf-gate thresholds. 2: image clean-up approved as the first Phase 0 task, with unreferenced files **moved** to an unserved `assets-src/` folder rather than deleted. Corrected measurement: only 7.9 MB of the 91 MB is unreferenced; the size comes down through AVIF/WebP conversion of referenced photography, with masters moved to `assets-src/`. 3: `postprocessing` replacement approved; the library is never installed. Also decided: the placeholder testimonial block is removed from the live site now.

1. **Budget revision.** Approve the corrected budgets: route shell 205 KB, motion 60 KB, environment 190 KB (was 190 and 230 in the creative direction). Net first-party JavaScript on Tier A rises from the PRD's 350 KB to about 435 KB, all of it after first paint; Tier C stays under 350 KB.
2. **Image clean-up before motion work.** Approve Phase 0 deleting unreferenced files from `public/` (92 MB to under 15 MB) and converting every remaining photograph to AVIF and WebP. Original files should be kept outside the served folder, not in git history alone.
3. **Post-processing library.** Approve replacing `postprocessing` with the hand-written three-pass stage. It removes about 80 KB and a dependency; the trade is that bloom quality is ours to tune rather than a library default.
4. **Which LCP figure gates the build** (added 22 September 2026, open). Lighthouse's simulated LCP charges the headline for the framework's parse time and cannot pass 2.5 s on slow 4G with a 143 KB runtime; the observed LCP under real throttling is the first paint. §9.5. Recommendation: gate on the observed median of three runs and keep the simulated table for trend.

---

## 11. Changes made with this audit

- `src/app/components/GoogleAnalytics.tsx`: script strategy changed from `afterInteractive` to `lazyOnload` so the tag never competes with the motion or environment chunks.
- `CREATIVE_DIRECTION_3D.md` Section 6.5 and `HERO_SCENE_SPEC.md` Sections 3.3 and 6.4: superseded by Sections 2.2, 2.3 and 3.1 here on budgets, the post stage and the pixel cap. Pointers added.
