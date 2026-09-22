# Phase 0 Brief — Foundations

**For:** the agent running Phase 0 (Opus 5, fast mode)
**From:** the planning session of 21 and 22 September 2026
**Scope:** everything the 3D build depends on, and nothing that is the 3D build. No canvas, no shaders, no formations. Those are Phase 1 and belong to a different session.

Read this file, then the documents in Section 1, then start at Section 3. Where this brief and another document disagree, this brief wins for Phase 0. Where you are unsure, do not guess: finish everything else, write the question in `PHASE0_REPORT.md` (Section 8), and stop.

---

## 1. Read first, in this order

1. `PERFORMANCE_PLAN.md` — the measured baseline and the budgets. Sections 2.2, 5, 6, 7 and 9 are your acceptance criteria.
2. `CREATIVE_DIRECTION_3D.md` — Sections 5 (visual identity: tokens and type), 8 (animation system: the primitives you are building), 9 Phase 0, and 11 (never ship).
3. `HERO_SCENE_SPEC.md` — Section 9.2 only (the tier decision; you implement the decision, not the probe).
4. `SCROLL_NARRATIVE.md` — Section 8.1 (pre-motion fixes; two of three are already done) and Section 7 (the copy; you do not change any of it).
5. `CLAUDE.md` — the locked header rule and the project rules.

## 2. Decisions already made (do not re-open)

| Decision | Outcome | Date |
|---|---|---|
| Chunk budgets | Shell ≤ 205 KB gz, motion ≤ 60 KB, environment ≤ 190 KB. These are gate thresholds. | 22 Sep 2026 |
| Post-processing | The `postprocessing` and `@react-three/postprocessing` packages are **never installed**. | 22 Sep 2026 |
| Unreferenced and original images | **Moved** to `assets-src/` (committed, not served). Never deleted. | 22 Sep 2026 |
| Placeholder testimonials | Removed from the live site, components deleted, carousel dependencies removed, portraits moved to `assets-src/`. **Done.** | 22 Sep 2026 |
| Client roster, offer copy, GA4 wiring, brand mark files | **Done.** Commits `bf51f09`, `1f93809`. | 21 to 22 Sep 2026 |
| Copy | Variant A is approved and placed in `SCROLL_NARRATIVE.md` Section 7. You place nothing new and rewrite nothing. | 22 Sep 2026 |
| Header | `src/app/components/Header.tsx` is locked. Its diff against `main` must be empty at hand-back. | standing |

## 3. Tasks

Work on a branch named `phase-0-foundations`. One commit per task, in the order below, each with the message convention in Section 7. Run `npx tsc --noEmit` before every commit.

### Task 1 — Dependencies

Install, then pin to the resolved versions:

```
npm i three @react-three/fiber gsap lenis web-vitals
npm i -D @types/three sharp lighthouse chrome-launcher
npm un aos @types/aos
```

Do not install: `postprocessing`, `@react-three/postprocessing`, `@react-three/drei`, `maath`, `framer-motion`, any carousel, any cursor library. `@react-three/fiber` must be a 9.x release (React 19).

Acceptance: `npm ls three @react-three/fiber gsap lenis web-vitals` shows one version each; `aos` and `react-slick` are gone from `package.json` and the lockfile.

### Task 2 — Design tokens and global CSS

In `src/app/globals.css`, inside the existing `@theme` block, add the Obsidian register from `CREATIVE_DIRECTION_3D.md` Section 5.2 exactly:

```
--color-obsidian-950: #07080B;  --color-obsidian-900: #0A0C10;
--color-obsidian-800: #10131A;  --color-obsidian-700: #181C25;
--color-silver-100: #E6E7EA;    --color-silver-300: #C9CBD1;   --color-silver-500: #A9ADB8;
--color-graphite: #8F8D8D;      --color-ember: #FF3B2F;
```

Add the type tiers from Section 5.3 as utility classes in a `@layer components` block: `.type-display-xl`, `.type-display-l`, `.type-h2`, `.type-h3`, `.type-body-l`, `.type-body`, `.type-eyebrow`, `.type-telemetry`, with the exact sizes, weights, tracking and line heights in that table. `text-wrap: balance` on the display and H2 tiers. `font-variant-numeric: tabular-nums` on telemetry.

Remove `html { scroll-behavior: smooth; }` (it fights Lenis). Remove the selector hack at the bottom of the file (`main div:has(> a[href="/contact"]) …`); find the elements that relied on it and give them `rounded-[6px]` explicitly. Keep the reduced-motion block and the focus ring; add a second focus ring rule for dark surfaces: `.on-obsidian :focus-visible { outline-color: #E6E7EA; }`.

Acceptance: the site renders identically to before on every route (compare screenshots at 1280 px for `/`, `/solutions`, `/academy`, `/contact`); no red focus ring is invisible anywhere.

### Task 3 — Fonts

In `src/app/layout.tsx`: Rubik weights become `["400", "500", "600", "700"]` (add 600, which `font-semibold` has been synthesising; drop 800, which has zero uses). Krub becomes `["500"]` (400 and 600 have no uses in the new type system; verify with a grep for `font-krub` and Krub weight classes before removing, and report if anything depends on them). Keep `subsets: ["latin"]`, `display: "swap"`, `adjustFontFallback: true`.

Acceptance: after `next build`, the preloaded font files in `.next/server/app/index.html` total ≤ 48 KB (measure as `PERFORMANCE_PLAN.md` Section 1 did).

### Task 4 — Motion primitives and the motion chunk

Create `src/motion/`:

| File | Spec |
|---|---|
| `tokens.ts` | Verbatim from `CREATIVE_DIRECTION_3D.md` Section 8.1. |
| `loadMotion.ts` | Dynamically imports GSAP, ScrollTrigger, SplitText and Lenis **after** the `onLCP` callback from `web-vitals` fires, inside `requestIdleCallback` with a 2,000 ms timeout fallback. Exposes a promise and a `motionReady` flag. This is the "motion chunk" in the performance plan; confirm with the build output that GSAP and Lenis are not in any chunk referenced by the prerendered HTML. |
| `LenisProvider.tsx` | Client component. Starts Lenis (`lerp: 0.09`, `smoothTouch: false`) once `loadMotion` resolves; registers ScrollTrigger; bridges them (`lenis.on('scroll', ScrollTrigger.update)`, `gsap.ticker.add(...)`, `gsap.ticker.lagSmoothing(0)`). Off entirely under reduced motion. Mounted once inside `src/app/MarketingChrome.tsx`. |
| `useMotionTier.ts` | Implements the seven-step decision in `HERO_SCENE_SPEC.md` Section 9.2, returns `"A" | "B" | "C"`, memoised, re-evaluated only on a `prefers-reduced-motion` change. **No frame probe** in this phase. Unit-test the decision table with `node --test` in `src/motion/__tests__/`. |
| `Reveal.tsx` | Per Section 8.2. Before the motion chunk arrives it must still work: render with a CSS class that runs the same 480 ms / 16 px / `ease.out` entrance via a keyframe, triggered by an `IntersectionObserver` at 20% visibility. Once GSAP is available, new instances use GSAP; existing ones are left alone. Reduced motion: opacity only, 1 ms. |
| `SplitLines.tsx` | Per Section 8.2. Waits for `document.fonts.ready` before splitting. Falls back to `Reveal` when SplitText is unavailable or before the motion chunk arrives. |
| `Counter.tsx`, `Magnetic.tsx`, `Thread.tsx` | Per Sections 8.2 and `SCROLL_NARRATIVE.md` 8.3. `Thread` is a 1 px, 48 px line that draws top to bottom in 480 ms; colour prop `ember` or `red-500`; `x` prop. |
| `DevStats.tsx` | Frame-time overlay (last 120 frames, p50 and p99, in ms), rendered only when `process.env.NODE_ENV !== "production"`. |

Then replace every local `useInView` hook (grep `function useInView` in `src/app`; there are seven) with `Reveal`, preserving each element's current delay. This is a refactor: the pages must look and move the same as before.

Acceptance: `npm run build` succeeds; the prerendered `/` HTML references no chunk containing `gsap` or `lenis`; `grep -rn "function useInView" src/app` returns nothing; tier tests pass.

### Task 5 — Image pipeline and `next/image`

This is the largest task and the one the gate depends on.

1. **Inventory.** Write `scripts/image-inventory.mjs`: walks `src/` for every path under `/assets`, `/logos`, `/icons`, `/section1` and root-level rasters; writes `scripts/image-inventory.json` with `{ path, referencedBy[], bytes, width, height }` (dimensions via `sharp`). Files in `public/` not in the inventory are **unreferenced**.
2. **Move unreferenced files** to `assets-src/` mirroring their path (`git mv`). Never delete.
3. **Convert referenced rasters.** Write `scripts/optimise-images.mjs` (sharp): for each referenced PNG or JPEG photograph, move the original to `assets-src/<same path>` and write a WebP sibling in `public/` at the same path with the extension changed to `.webp`, resized to a maximum width of 1920 (never upscaled), quality 78, `effort: 6`. Flat graphics and icons that are PNG stay PNG but are run through `sharp().png({ palette: true, compressionLevel: 9 })`. SVGs are left alone except the one partner or client logo that embeds a raster (`public/logos/atc.svg`), which becomes a 240 px wide WebP. Then a codemod updates every reference in `src/` from the old extension to `.webp`. Targets: no served raster over 250 KB; every photograph under 120 KB at 1280 wide; `public/` under 15 MB.
4. **`next/image` everywhere on the marketing pages.** Replace all 73 `<img>` tags (not `/admin`) with `next/image`, supplying `width` and `height` from the inventory, `sizes` matching the rendered width (use `100vw` for full-bleed, `(min-width: 1024px) 50vw, 100vw` for half-width columns, and so on), `priority` only on the single LCP image of each page (the hero), and default lazy loading elsewhere. Keep `alt` text as it is. Set `images: { formats: ["image/avif", "image/webp"] }` in `next.config.ts` so Vercel serves AVIF from the WebP sources.
5. **Do not** touch `public/brand/` (the mark assets) or the header's logo `next/image` call.

Acceptance: `public/` ≤ 15 MB; a script-generated table of every served raster with its byte size, none over 250 KB; zero `<img` tags remain under `src/app` outside `/admin`; Lighthouse on `/` reports no "image elements do not have explicit width and height" audit failure; CLS on every gated route ≤ 0.02.

### Task 6 — Field measurement

Create `src/app/components/WebVitals.tsx` (client): uses `web-vitals` `onLCP`, `onINP`, `onCLS`, `onTTFB`, and sends each as a `gtag('event', name, { value, rating, tier, effective_type, page_path })` when `window.gtag` exists; otherwise logs in development only. Mount it in the marketing layout beside `GoogleAnalytics`. `tier` comes from `useMotionTier`. Keep it under 2 KB of our own code.

Acceptance: with a dummy `NEXT_PUBLIC_GA_MEASUREMENT_ID` set locally, the network panel shows one `collect` request per metric after load, and none before the LCP mark.

### Task 7 — The performance gate

Create `scripts/perf-gate.mjs` and `npm run perf`:

1. Builds if `.next` is missing, starts `next start` on a free port, waits for it.
2. Runs Lighthouse (node API, mobile preset, the built-in "slow 4G" throttling, 4× CPU) against `/`, `/solutions`, `/solutions/network-infrastructure`, `/academy`, `/contact`, three runs each, taking the median.
3. Asserts the lab thresholds in `PERFORMANCE_PLAN.md` Section 9.1: TTFB ≤ 0.6 s, FCP ≤ 1.8 s, LCP ≤ 2.5 s, CLS ≤ 0.02, TBT ≤ 200 ms, Speed Index ≤ 3.0 s.
4. Reads the prerendered `/` HTML from `.next/server/app/index.html`, resolves its script tags to files in `.next/static`, gzips them, and asserts the shell ≤ 205 KB; asserts no chunk on that page contains the strings `gsap` or `lenis`; asserts the preloaded fonts ≤ 48 KB.
5. Prints one table and exits non-zero on any failure.

Also add `scripts/budgets.json` holding the numbers so the gate and future scripts share them.

Acceptance: `npm run perf` passes on the branch. The current stock hero photograph, converted to WebP in Task 5, is the LCP element on `/`; if LCP still fails, reduce its width to 1600 and quality to 72 before doing anything else.

## 4. Things you must not do

- Modify `src/app/components/Header.tsx`.
- Touch `src/app/admin`, `src/app/api`, `prisma/`, `src/lib`, `src/middleware.ts`.
- Change any copy. If a component you refactor contains text, it comes out byte-identical.
- Change `src/app/academy/data.ts` or the Academy pages beyond the image and `Reveal` refactors.
- Install anything not listed in Task 1.
- Add a canvas, a WebGL context, a shader, or a worker. That is Phase 1.
- Delete any file under `public/`. Move it.
- Widen the Content Security Policy beyond what GA4 needed.
- Use `any` to make TypeScript pass.

## 5. Things that look wrong but are intentional

- The hero on `/` is still a stock photograph over a dark overlay. The redesign replaces it in Phase 1. In Phase 0 it is simply converted to WebP and given dimensions.
- `react-icons` remains in `package.json` because the locked header imports two icons from it.
- `public/brand/mark.svg` is a traced provisional. Leave it.
- `CXO/` at the repo root is untracked and not part of this work.
- `.claude/settings.json` shows as modified; not yours, leave it.

## 6. Gate 0 checklist (all must be true at hand-back)

- [ ] `npm run build` passes with no warnings about images or fonts.
- [ ] `npm run perf` passes on all five routes.
- [ ] `git diff main -- src/app/components/Header.tsx` is empty.
- [ ] `public/` ≤ 15 MB; `assets-src/` holds every original.
- [ ] No `<img` under `src/app` outside `/admin`.
- [ ] No `function useInView` under `src/app`.
- [ ] Preloaded fonts ≤ 48 KB.
- [ ] Reduced motion disables Lenis and all reveals (verify in DevTools rendering emulation).
- [ ] Screenshots of `/`, `/solutions`, `/academy`, `/contact` at 1280 px and 390 px, before and after, attached to the report; the only visible differences are the removed testimonial block and sharper or identical images.

## 7. Commit convention

Branch `phase-0-foundations`. One commit per task:

```
phase0(deps): install 3D and motion dependencies, remove aos
phase0(tokens): add Obsidian register and type tiers, remove smooth-scroll and the button hack
phase0(fonts): trim to Rubik 400/500/600/700 and Krub 500
phase0(motion): motion primitives, deferred motion chunk, replace local useInView hooks
phase0(images): move originals to assets-src, WebP conversion, next/image everywhere
phase0(vitals): report web vitals to GA4 with tier labels
phase0(gate): Lighthouse and bundle perf gate with budgets.json
```

Every commit message ends with:

```
Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```

## 8. Hand-back

Write `PHASE0_REPORT.md` at the repo root with: the perf gate's output table for each route; the served-image table from Task 5; the before and after payload figures for `/` in the same format as `PERFORMANCE_PLAN.md` Section 1.1; every question you could not answer, each with the file and line it concerns; and anything you changed that this brief did not ask for, with the reason. Do not open a pull request; the owner reviews the branch. Stop when the report is written.
