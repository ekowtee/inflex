# Phase 6 Report: Polish and hardening

**Branch:** `phase-6-polish`, from `main` at the Phase 5 merge (`0d9fadf`).
**Date:** 25 September 2026.
**Scope:** CREATIVE_DIRECTION_3D.md §9 Phase 6. The gate is §10, the definition of done.

---

## 1. What was done

| Item (§9 Phase 6) | Result |
|---|---|
| 1. Visual regression goldens | `scripts/visual-goldens.mjs` (`npm run goldens`, and `-- --update` after an intended change). It covers 25 routes at 390, 768, 1280 and 1920 px, with motion and with reduced motion: 200 goldens in `tests/goldens/`. It runs against the production build. Each page is captured one viewport at a time and stitched, because a single full-page capture inflates svh and releases the sticky pins. A comparison fails when the size changes or more than 0.5 % of pixels move by more than 24 levels; diffs go to the temp directory. Chrome runs without a GPU (`--disable-gpu`). Otherwise headless Chrome on Windows renders the live Core on the real GPU and no two home captures match. Without the GPU the tier rule serves the poster. A second capture of the home page and two interior pages matched in every variant. |
| 2. Accessibility | `scripts/a11y-audit.mjs` (`npm run a11y`) runs axe (WCAG 2.1 A and AA plus best practice) on 22 routes at 1440 and 390. It now reports **0 violations on 44 of 44 pairs**. Before the fixes: colour contrast on `/services` and a landmark issue on programme pages. The focus-ring test, a tab-through over CDP, and the home page accessibility tree are covered in §3. |
| 3. Frame-time probe | `scripts/tier-check.mjs` (`npm run tier`) runs on the machine's own GPU. On the desktop reference (Iris Xe, 1920 × 1080): **1× CPU stays on A → A → A and never demotes; 6× CPU steps down B → C → C.** Before the change, 6× stopped at B: the watchdog judged the average frame time (18 ms), which hid 8 % of frames running over 34 ms. It now also steps down when more than 5 % of a 90-frame window runs over 34 ms, over two windows. |
| 4. Copy sign-off | Everything from Phase 5 is approved. Six home-page lines still carry **(new)** in SCROLL_NARRATIVE.md with no recorded sign-off (§4). |
| 5. Documents | DESIGN_SYSTEM.md is now v3.0. Part A holds the redesign's tokens, registers, motion and primitives, taken from the code. Part B, the v2.0 content, is marked superseded where it conflicts. CLAUDE.md now lists the reference documents, the hero-object rules and the quality checks, and its Next.js version and brand red are corrected. |

## 2. Definition-of-done fixes (§10.2)

- **Motion tokens.**
  - Tailwind's default transition (150 ms, stock ease) now defaults to the micro token, so every bare `transition-*` follows tokens.ts. The stock `ease-in`, `ease-out` and `ease-in-out` curves are remapped to the token curves.
  - These were over 1 s or off-token and are retimed:
    - the counter: 1.2 s → 0.9 s (the scene token);
    - the Tier C poster crossfade: 1.8 s → 0.9 s;
    - the Ledger strike: 400 → 480 ms;
    - the door hairlines: they now end at 0.96 s;
    - the header's register and menu timings.
- **No pure white text on Obsidian.** Fixed in the footer links and socials, the pillar links (the hover now draws an underline), and the header's dark register and mobile menu.
- **Alt text** now describes the picture on About, Services and Solutions.
- **Images retired from `public/`** (moved, never deleted). Both were unreferenced and are recorded in `archive/README.md`:
  - `hero/herobanner2.webp`, the hologram hero banned by §11;
  - `career/career4.png`, the Tesla circuit board.
- **Accessibility.**
  - Three chapter titles are now real headings.
  - Counters read their final value to screen readers.
  - The header dropdowns are honest disclosures: `aria-controls`, and no menu roles that promised arrow keys.
  - The dark header shows the light focus ring.
  - The open mobile menu makes the page behind it inert and closes on Escape.
  - Social links say they open a new tab.
  - Below lg, no pillar link is marked current.

## 2a. Performance: the home page's blocking time

The home page had sat at or over the 200 ms total blocking time limit since Phase 5. CI's blocking observed pass measured 231, 196, 204, 257, 242, 81 and 275 ms across commits.

Lighthouse's long-task attribution pointed at `SplitLines`:
- every split heading on the page split at load;
- each registered a ScrollTrigger, whose refresh was its own long task.

The same investigation found a bug. `SplitLines` swapped from a `Reveal` wrapper to a plain heading once SplitText had run, so React replaced the element that had just been split, and **the line animation had never shown**.

`SplitLines` is now one stable element, legible as plain text. It splits in place within half a viewport of the screen, and plays as its top crosses 80 % of the viewport; both steps use IntersectionObservers. ScrollTrigger had no other user and is removed, taking the motion chunk from 49 to 32 KB gz.

- **Checked:** nothing is split at load, and after a scroll all 12 lines in 5 headings are visible. The goldens are unchanged, and axe is still clean.
- **CI** (`0eee03c`, blocking observed pass): home total blocking time **126 ms** (was 275), with every route passing. The largest contentful paint is 1.76–2.14 s on every route, and CLS is 0.

## 3. Accessibility findings

- **Landmarks:** banner, `Main` navigation, main and contentinfo, with a region per beat. The skip link comes first.
- **Headings:** one h1. The h2s and h3s follow document order with no skipped levels.
- **The Core:** the canvas is absent from the accessibility tree, and decorative images are hidden.
- **Focus:** 53 tab stops on the home page, each with a visible ring (light on Obsidian, red on Ivory). The same holds on `/contact` with the header light, and in the opened dropdowns and the mobile menu.
- **Needs review:** 57 elements sit over images or the canvas, where axe cannot see the background. They were measured against the pixels behind them: median 9–16:1.

## 4. Decisions for the owner

1. **Served images the done-rule bans** (§10.2: "no stock photograph with holograms, circuits, or glowing globes"). Each has candidates already in `public/`. Replacing them is your call.
   | Image | Where | Problem | Candidates |
   |---|---|---|---|
   | `about/vvvvv.webp` | About | Holographic panels, circuit background | `case/ImageC.webp`, `services/Services2.webp` |
   | `solutions/sol3.webp` | Solutions strip, Data Security overview, an Academy programme | Holographic HUD over a laptop | `solutions/sol5.webp`, `case/casestudy8.webp` |
   | `blog/cloud-computing.webp` | Resources (hybrid cloud) | Glowing holographic cloud | `solutions/sol7.webp` (AWS/Azure/GCP whiteboard) |
   | `blog/blogger.webp` | Resources hero area | Holographic panels | `services/Services1.webp`, `case/ImageB.webp` |
   | `solutions/sol6.webp` | Solutions (Data-centric), two programmes | Glowing holographic network table | `solutions/sol1.webp`, `about/strategy.webp` |
   | `solutions/sol2.webp` | Solutions, Network overview, two programmes | Glowing world-map wall; Gemini watermark | `solutions/sol4.webp`, `case/inner8.webp` |
   | `career/career2.png` | Network Engineer role | Tesla factory | `case/inner8.webp`, `services/Services2.webp` |
   | `career/career3.png` | Cloud Solutions Architect role | Battery cells | `solutions/sol7.webp` |
   | `services/Services4.webp` | Services (Support model) | Stanbic Bank branding in shot | `services/Services2.webp`, `career/career1.webp` |
   | `services/Services3.webp` | Managed, Support, Cybersecurity role | Red Bull cans on the desk | retouch, or `solutions/sol5.webp` |
   | `blog/webinar2.webp` | Resources | Misspelt baked-in text ("NE AGE") | `blog/blog2.png` |

   Borderline: `solutions/sol8.webp` (the hooded "hacker"), `case/inner7.webp` (neon robot arm), and `about/Implementation.webp` (Gemini watermark).
2. **Six home-page lines marked (new)**, all live today. Please confirm them:
   - "Book a 30-minute architecture review. With a Solutions Architect, not a salesperson. No pitch."
   - "Book the review"
   - "See the work ↓"
   - "We have done this at national scale. Twice."
   - "Intelligence is not a feature. It is the fabric."
   - "Not a reseller. Not a generalist. Not a lock-in."
3. **The scroll cue** loops every 2.4 s, as SCROLL_NARRATIVE.md specifies, but a loop that long breaks the 1 s rule. Choose one: keep it as a documented exception, or make it a one-shot cue.
4. **Retimed choreography.** The counter, the poster crossfade and the door hairlines now finish within 1 s (§2). Say if any now feels rushed.
5. **The Intelligence links over the Core** (Beat 5½). At 1280 px and above, the lattice runs behind "Process Automation" and "AI Integration". The median contrast is 10–16:1, but the brightest 5 % of pixels drop to about 3:1. Choose one: frame the lattice further right, or add a scrim.

## 5. Not verifiable here

§10.3's device matrix calls for real hardware: the MacBook, the 2018 UHD 620 laptop, an iPad, a Galaxy A-series on 4G in Accra, an iPhone, and NVDA or VoiceOver. `npm run tier` and `npm run a11y` can be run on any of those machines. The accessibility tree was reviewed programmatically; that is not a substitute for a screen-reader session.
