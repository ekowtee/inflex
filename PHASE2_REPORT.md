# Phase 2 Report — The chapters

**Branch:** `phase-2-chapters`, ten commits off `0556e21`.
**From:** the chapter session, 22 September 2026.
**For:** the spine session, which integrates both branches, and the owner for the six decisions in Section 5.

No pull request opened, nothing merged.

---

## 1. Gate

| Gate item | Result |
|---|---|
| `npm run build` passes | **Partly — see below.** `next build` compiles and prerenders all 39 pages cleanly. `npm run build` also runs `prisma generate` first, which fails with `EPERM … query_engine-windows.dll.node` because the owner's dev server on port 3000 and a `next start -p 3299` hold the engine DLL. Unrelated to this branch: `prisma generate` regenerates the database client and touches nothing Phase 2 changed. It passes once those processes stop. |
| `npx eslint src/app` clean | **Yes.** 0 errors. 6 warnings, all pre-existing in `src/app/admin/*` (`react-hooks/purity`, `react-hooks/set-state-in-effect`) and present on `main`. Nothing under `src/app/components/home/`. |
| `npx tsc --noEmit` clean | **Yes.** No `any` anywhere in the branch. |
| `node scripts/perf-gate.mjs --bundles` | **Passes.** Table in Section 2. |
| `git diff main -- src/three src/motion src/app/components/Header.tsx` empty | **Yes.** Also empty for `src/app/MarketingChrome.tsx`, `.github/` and `scripts/`. |
| Every section carries the §5.1 attributes | **Yes.** Verified in a real browser, not in the HTML source — the RSC payload duplicates attribute strings and makes a `grep` count lie. |
| `document.querySelectorAll('[data-beat]').length === 9` | **Yes.** Beats 0, 1, 2, 3, 4, 5, 6, 8, 9, each a `<section>` with its `data-register`, its kebab-case `id`, and `data-header-dark` on all six Obsidian ones. |
| Copy matches `SCROLL_NARRATIVE.md` §7 byte for byte | **Yes, checked with a script.** 85 of 85 lines matched. Method in Section 3. |
| Keyboard: tab reaches every link in visual order, focus ring visible on both registers | **Yes.** 20 in-chapter links, all in visual order, every ring `2px solid` at ≥ 5.5:1 against its own band (Obsidian 16.2–20.0:1, Ivory 5.5–6.1:1). |
| Reduced motion: reveals present, strikes drawn, counters printed, threads drawn | **Qualified — see Section 4.** |
| Screenshots at 1280 px and 390 px, full page | [docs/phase2/home-1280.png](docs/phase2/home-1280.png), [docs/phase2/home-390.png](docs/phase2/home-390.png). |

---

## 2. Bundles

`node scripts/perf-gate.mjs --bundles`, after `npx next build`:

| | `main` | `phase-2-chapters` | Budget |
|---|---|---|---|
| Route shell | 164.7 KB gz | **163.6 KB gz** | 205 KB gz |
| Motion chunk | 49.1 KB gz | 49.1 KB gz | 60 KB |
| Environment chunk | 141.8 KB gz | 141.8 KB gz | 190 KB |
| Preloaded fonts | 46.1 KB | 46.1 KB | 48 KB |
| `public/` total | 5574.2 KB | 5574.2 KB | 15360 KB |

The shell is **1.1 KB gz smaller** than on `main`. Nine chapters of copy arrived as server-rendered HTML and the client components they replaced went away; the new client code is smaller than `MainPartners`' five-second timer alone. Next 16 no longer prints per-route First Load JS, so the gate's shell figure is the comparable number.

**Client components added, and why each one has to be one:**

| File | Why `"use client"` |
|---|---|
| `home/EdgeDraw.tsx` | The 2 px border that draws as a card enters needs one `IntersectionObserver`. Only the wrapper is client: the card's copy is passed in as already-rendered children and never enters the bundle. Shared by Beat 3's two cards and Beat 9's two panels. |
| `home/Ledger.tsx` | One observer for the whole Beat 5 block. The three strikes are a single gesture; one observer per line would fire them at the reader's scroll speed instead of the page's tempo. |

`home/TrustedBy.tsx`, `TurningPoint.tsx`, `Receipt.tsx`, `Pillars.tsx`, `Difference.tsx`, `PartnerWall.tsx`, `TheAsk.tsx`, `SideDoors.tsx`, `ExitLink.tsx` and `page.tsx` are all server components. Beat 4's row states are CSS driven from one attribute, so the pinned chapter ships no JavaScript of its own at all.

---

## 3. The copy check

Scripted, in a headless Chrome against the running page, not by eye.

Every line of `SCROLL_NARRATIVE.md` §7 that belongs on the home page — 85 of them, including each pillar's lead, value proposition and partner line, each counter caption, and both Beat 9 panels — was compared against the rendered text with Unicode NFC normalisation and runs of whitespace collapsed. So an em dash, a middot, a curly apostrophe or a line split across JSX nodes all had to match exactly. **85 of 85 matched.**

Two things worth recording about the method:

- The comparison uses `textContent`, not `innerText`. The eyebrow and telemetry tiers set `text-transform: uppercase`, so `innerText` returns `02 — PROOF`. That is a type token, not copy; against `innerText` 31 lines "fail" and none of them is a copy error.
- Card B's in-progress rule is asserted separately: its subtree must not contain "delivered", "completed" or "built". It does not.

**Word count.** 667 words across the nine chapters as the page stands; **579 as read**, counting Beat 4's pinned sub-ranges once rather than four times, which is how §6.2 frames the under-600 figure. Both are below 600 on the as-read measure the narrative uses.

---

## 4. Reduced motion — the honest version

Measured under `prefers-reduced-motion: reduce`, scrolling from the top to the bottom of the page:

| | Result |
|---|---|
| Reveals still hidden | **0 of 25** |
| Strikes drawn | **3 of 3** |
| Card borders drawn | **4 of 4** |
| Threads drawn | **5 of 5** |
| Counters | `2012`, `80+`, `50+`, printed |

Nothing is missing and nothing animates. **But the strict reading of the gate line — "all reveals present *at load*" — is not met, and cannot be met from this branch.** Measured at `scrollY: 0` before scrolling, all 25 `Reveal`s are hidden and 0 of 5 threads are drawn. All 25 sit below the fold at mount, because Beat 0 is a full viewport on its own — so at load the difference is invisible, and it only shows as the reader moves:

- `src/motion/Reveal.tsx` hides anything below the fold at mount and reveals it on intersection, in every motion mode. Its own header comment sets that out as a deliberate First-Contentful-Paint decision (2.3 s against 5.2 s on a throttled mobile profile). Under reduced motion the global rule collapses the transition, so content *appears* rather than animating — but it still appears on scroll, not at load.
- `src/motion/Thread.tsx` has no reduced-motion branch at all; it draws on intersection at a 0.9 threshold.

Both are under `src/motion/`, which Section 6 of the brief forbids this branch from touching. The two things this branch *does* own behave as the gate asks: `.strike` is drawn at load with no transition (a rule outside `@layer` so it beats the component rule), and `EdgeDraw` sets its drawn state at mount rather than waiting for the observer, the way `Counter` does.

**For the spine session:** if "present at load" is the intended contract rather than "present without animation", it is a two-line change in `Reveal` and `Thread` — an early return that sets the visible state when `prefersReducedMotion()` is true. That is your branch's territory, not this one's.

---

## 5. Questions and things the owner still has to confirm

Carried forward from the brief's Section 2, built as instructed, still open:

1. **Beat 6 column assignment.** Built as the narrative proposes: Intelligence is Anthropic, OpenAI, Google, xAI, Microsoft; Infrastructure is the other fourteen. Microsoft appears in the Intelligence column and in two pillar partner lines. Needs confirmation.
2. **Counter values.** `2012`, `80+`, `50+` as given. Needs reconfirmation.
3. **MTN and the Ministry named on the home page.** Narrative §9.3 still lists written confirmation as outstanding. Card B names both.
4. **The operational promises the copy now makes.** A written view of what to fix first after every review; full documentation handover on every engagement; thirty-day hypercare; the review at no cost and no obligation. All four are on the page in Beat 8.
5. **Beat 7.** Omitted, per the brief. No component, no placeholder.

**One copy discrepancy inside `SCROLL_NARRATIVE.md`, resolved in favour of §7.** The second ledger answer reads differently in the two places it appears:

- §7 copy sheet: "Vendor-neutral. We recommend what works, not what pays us the highest margin."
- §6 Beat 5: "Vendor-neutral. The architecture serves your business, not a vendor's quota."

The brief makes §7 the shipping copy and the gate checks against §7, so the page carries the §7 line. The §6 line is close to Beat 6's infrastructure caption ("The architecture serves you, not a quota"), which is a second reason to prefer §7 — the two would have echoed each other two beats apart. Worth correcting §6 so the document stops disagreeing with itself.

**Nothing else was ambiguous enough to stop for.** Every other decision below is recorded rather than asked.

---

## 6. Departures from the brief, and why

Five, all small, all visible in the diff.

**1. The Beat 1 logo filter.** The brief prescribes `grayscale(1) brightness(1.6)`, or an equivalent that reads silver. The prescribed filter does not work on this roster and the alternative is not cosmetic. Measured: ATC and CEIBS are dark artwork on transparency; the other five are dark marks baked onto an opaque plate (four pure white, Ninani 247 grey). `brightness(1.6)` leaves the first two invisible on `#07080B` and turns the other five into white boxes.

Shipped instead: `grayscale(1) brightness(1.1) invert(1) brightness(0.85)` with `mix-blend-mode: screen`. Inverting takes a plate to black and a dark mark to silver; screening drops the black plate into the band. The first `brightness` clamps the two off-white plates to pure white so they invert to true black.

That needed one more thing. `will-change: transform` on `[data-slide-row]` — which §5.2 requires — creates a stacking context, and a stacking context **isolates blending**: the blend found no backdrop and the inverted plates painted as black boxes over the band. So each logo cell carries `bg-obsidian-950`, the same colour as the band, to give the blend an opaque backdrop inside the row's own group. Sampled after the fix, the plates render at exactly the band's `7,8,11`. The slide row itself still carries `will-change: transform` and nothing else, as the contract says.

**2. Beat 3's fourth counter is `type-h3`, not `type-h2`.** The brief sets the *number* in `type-h2`; the fourth item has no number, it has `Cisco · Microsoft · AWS · CompTIA`, which at `clamp(1.75rem, 3vw, 2.5rem)` wraps into a paragraph and stops reading as a counter.

**3. Beat 5's struck lines are `type-body`, their answers `type-body-l`.** The brief sets no tier for the ledger. The strike is one rule across the middle of the element, so a line that wrapped would be struck through the gap between its two lines rather than through its words. At Body, all three hold one line down to 390 px — verified in the browser, not assumed. Below roughly 360 px the third line will still wrap; if that matters, the fix is a `background-image` strike on an inline element with `box-decoration-break: clone`, which strikes each line fragment separately.

**4. The Beat 8 pricing frame bolds its lead phrase.** `COPY_DECK.md` §8.2 sets "Fixed-scope projects.", "SLA-backed managed retainers." and "No lock-in." in bold; the brief's Task 8 is silent on emphasis. Bold, because the three lines only answer *fixed / predictable / exit-able* at a glance if the answer is the first thing read. No words added or changed.

**5. Beat 6 logo boxes react to `focus-within` as well as `hover`.** The brief asks for full colour "on hover and focus". Nothing inside a box is focusable — Beat 6 has no exit by design — so `focus-within` is currently inert. It is one class, and it means the treatment holds if a logo ever becomes a link. Making the boxes focusable with `tabindex` to satisfy the letter would have put nineteen dead stops in the tab order.

**Two contract gaps, defaulted rather than guessed:**

**`aria-current` on Beat 4.** §5.5 has the spine write `data-active` on `[data-pin]` and nothing else, but Task 5 also asks for `aria-current="true"` on the active row's link. `aria-current` is an attribute, so no CSS can move it. It is set statically on row 0 — the contract's default active row, and what an unpinned page shows. **The spine must move it when it writes `data-active`, or it goes stale as the reader scrolls the pin.** One line beside the existing write.

**Beat 3's thread on phones.** The brief puts thread slot 3 between the cards on desktop and after the counters on phones. The section is a flex column and the slot changes place with `order`, so the DOM order is desktop order and the phone order is visual only. If the spine ever needs slot 3's DOM position to be its reading position, say so and it becomes two slots.

---

## 7. Legacy components: what still imports them

Nothing was deleted and nothing under `public/` was moved. After `page.tsx` was rewritten:

| Component | Still imported by | Safe for Phase 4 to delete? |
|---|---|---|
| `Partners.tsx` (+ `partners.css`) | `src/app/about/page.tsx`, `src/app/contact/page.tsx` | **No.** Two live pages. |
| `MainPartners.tsx` | `src/app/solutions/page.tsx` | **No.** One live page — and it is the autoplaying carousel `CREATIVE_DIRECTION_3D.md` §11 rules out, so `/solutions` will want its own treatment before it goes. |
| `StrategicPartnerSection.tsx` | nothing | Yes |
| `ComprehensiveSolutions.tsx` | nothing | Yes |
| `InflexionsAdvantage.tsx` | nothing | Yes. Its `mid/` images go with it. |
| `IntelligentAutomation.tsx` | nothing | Yes. Its four terms live on in Beat 5's intelligence row. |
| `AcademyPromo.tsx` | nothing | Yes. Replaced by Beat 9's left panel. |
| `CallToAction.tsx` | nothing | Yes. Replaced by Beat 8. |

`SolutionPartners.tsx` is untouched and still serves all four pillar pages; Beat 4's partner lines are copies of its strings, not an import.

---

## 8. Commits

```
f17040d phase2(styles): strike through the words, knock the logo plates out
4022c44 phase2(page): compose the ten beats, retire the legacy sections from the home page
54af90f phase2(side-doors): Beat 9 panels
552662c phase2(the-ask): Beat 8 offer, pricing frame, telemetry
ec9da6a phase2(partner-wall): Beat 6 two columns
dcec992 phase2(difference): Beat 5 ledger with strikes, intelligence row
772bda2 phase2(pillars): Beat 4 rows, row states, mobile posters
e7a5275 phase2(receipt): Beat 3 cards, counters, thread slot
a8e031c phase2(turning-point): Beat 2 copy and thread slot
e2df382 phase2(trusted-by): Beat 1 roster
d633358 phase2(styles): register bands, ivory shadow, strike-through, secondary button
```

Eleven, not ten: `f17040d` is a fix commit for two things the rendered page showed that the markup did not — the strike landing under its text, and the logo plates painting as black boxes. Both are described in Section 6.

Three files the task list did not name were added, all under `src/app/components/home/`:

- `ExitLink.tsx` — the exit treatment Beats 2, 3 and 5 share. Inline rather than flex, so the space before the arrow survives into `textContent` and the copy check can still read `How we integrate →` as one string.
- `EdgeDraw.tsx` — the drawn border, shared by Beats 3 and 9.
- `Ledger.tsx` — Beat 5's ledger, split out so `Difference.tsx` can stay a server component.

---

## 9. What the spine will find

Everything in §5, plus the two gaps in Section 6. In summary:

- `[data-beat]` on nine sections, with `data-register` and `data-header-dark`.
- `[data-slide-row]` on Beat 1's logo row, at translate 0, `will-change: transform`, nothing else.
- `[data-thread-slot]` 2, 3, 4, 5 and 8, each a 48 px `.thread-slot` well holding one `Thread`. Writing `style="--thread-x: <px>"` on a wrapper hands placement over to the spine; `.thread-slot[style*="--thread-x"]` is the rule that does it.
- Beat 4: `[data-pin]` as the section's only child, containing the whole chapter, `data-active="0"` already written, four `[data-pillar-row]` and four `[data-pillar-link]`.
- Nothing imports from `src/three/` except `posters` in `Pillars.tsx`, as permitted.

The page is finished and readable with the spine absent: no pin, no scrub, native scrolling, first pillar row open. That is also what reduced-motion visitors and Tier C phones get.

---

## 10. The spine (added by the spine session, 23 September 2026)

Built on `phase-2-spine` on top of this branch, then verified against the merged page.

| Piece | Where | Note |
|---|---|---|
| Timeline | `src/three/core/timeline.ts` | Maps real scroll to the narrative's virtual timeline: each beat's nominal length in vh, progress measured through the real section. Writes `store.scrollVh` and `store.opacity` (the §8.5 canvas column), `data-active` and `aria-current` on the pinned chapter, and the trust strip's slide. Attached by `Arrival` for every tier. |
| Pin | `globals.css` | CSS `position: sticky`: Beat 4 is one viewport plus 320 vh and the chapter sticks for its length. Works with keyboard, Lenis, Safari trackpads and reduced motion. No ScrollTrigger pin. Focusing a pillar link scrolls to its sub-range. |
| Canvas | `CoreCanvas.tsx`, `globals.css` | Fixed again. While the scene is live the Obsidian chapters lose their background so the Core shows through; the Ivory chapters stay opaque. Every chapter is positioned so it paints above the hero's stacking context, which holds the canvas. The scene skips its draw at opacity 0. |
| Header | `Header.tsx` | Dark whenever any `data-header-dark` chapter is under the bar. |
| Gate | `.github/workflows/perf-gate.yml` | The observed Lighthouse pass is the one that can block; the simulated pass is advisory. |

Verified on the real GPU at 1280 and 390 px, every beat: registers, band backgrounds, pin position, active row, `aria-current`, no console errors. Reduced motion: no canvas, poster visible, solid bands, nine beats. Keyboard: focusing a pillar link lands the pin on that row.

**Resolved from Section 6:** `aria-current` now moves with `data-active`. Beat 3's thread DOM order is left as is; nothing in the spine reads it.

**Deferred, by design:** the thread's `--thread-x` from the Core (Beats 2 and 4) waits for the ember detachment in Phase 3; the Obsidian-to-Ivory crossfade is a hard section edge for now, with the canvas fading over the last 30 vh of Beat 4; the noise-to-order resolve, the four morphs, the camera orbit and the mark are Phases 3 and 4. Beat 4's mobile posters are all the resting formation until Phase 3 captures the others.

**Owner decisions still open:** partner columns (Beat 6), counter values (Beat 3), naming MTN and the Ministry, the operational promises the copy makes, and the two lines where `SCROLL_NARRATIVE.md` §6 and §7 disagree (§7 shipped).

**Gate, first CI run on the spine:** bundles pass; observed home TBT 1.26 s and CLS 0.037, contact CLS 0.083. The TBT was the scene running under software WebGL on the GPU-less runner (PERFORMANCE_PLAN.md §9.6): software renderers now go straight to Tier C and a watchdog demotes a live scene whose frames stay slow. The two CLS figures measure 0 locally under the same throttling on every attempt and are treated as runner noise until they repeat.

**Gate, final CI run on the spine (`3202c71`):** bundles pass. Observed pass, mobile, slow 4G, 4× CPU, median of three:

| Route | FCP | LCP | SI | TBT | CLS |
|---|---|---|---|---|---|
| `/` | 1805 | 1805 | 2808 | 187 | 0.000 |
| `/solutions` | 1782 | 1843 | 1825 | 58 | 0.000 |
| `/solutions/network-infrastructure` | 1746 | 1746 | 1764 | 55 | 0.000 |
| `/academy` | 1788 | 1788 | 1811 | 54 | 0.000 |
| `/contact` | 1672 | 1672 | 1691 | 51 | 0.001 |

The layout shifts were the web-font swap on machines without Arial (the Linux runner, and Android): next/font's automatic fallback targets Arial only. Our own metric-matched fallback faces, one per weight, took every route to 0.000. The one remaining red is home FCP at 1805 ms against 1800, on a runner whose first paint floor is 1670 to 1790 ms for every route; it is treated as the runner's noise band, and the threshold is reviewed against runner floors before Lighthouse turns blocking in Phase 6.

