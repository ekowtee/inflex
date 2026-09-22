# Phase 2 Brief — The chapters

**For:** the agent building the home page chapters (Opus 5)
**From:** the Phase 1 session, 22 September 2026
**Scope:** the ten chapter components of the home page and their text choreography, composed in order on `src/app/page.tsx`, against a DOM contract that the scroll spine (built in parallel by another session) drives. No canvas work, no ScrollTrigger, no pinning, no changes under `src/three/`. Those belong to the spine.

Read this file, then the documents in Section 1, then start at Section 4. Where this brief and another document disagree, this brief wins for Phase 2. Where you are unsure, do not guess: finish everything else, write the question in `PHASE2_REPORT.md` (Section 10), and stop.

---

## 1. Read first, in this order

1. `SCROLL_NARRATIVE.md` — Section 6 (the ten beats: reveal order, copy, carry, exit for each), Section 7 (the copy sheet: every line you place, verbatim), Section 8.2 to 8.7 (component list, the thread, the strike-through, mobile journey, what not to change).
2. `CREATIVE_DIRECTION_3D.md` — Section 5 (tokens, type tiers, layout rhythm, the shadow token), Section 8 (the animation system; you use the primitives, you never write easing or durations), Section 11 (never ship).
3. `COPY_DECK.md` — Section 7 (proof captions) and Section 8 (the pricing frame) for Beat 3 and Beat 8 detail that the copy sheet abbreviates.
4. `CLAUDE.md` — project rules; the navbar section describes the header's two registers and the `data-header-dark` hook you must set on Obsidian chapters.
5. `src/app/components/home/Arrival.tsx` — the one chapter already built. Match its conventions: type tier classes, `on-obsidian`, container, the `Magnetic` CTA, `data-header-dark`.
6. `src/motion/` — `Reveal`, `SplitLines`, `Counter`, `Magnetic`, `Thread`, `tokens.ts`. Read each file's header comment; they document their own constraints.

## 2. Decisions already made (do not re-open)

| Decision | Outcome |
|---|---|
| Copy | Variant A of `COPY_DECK.md`, placed in `SCROLL_NARRATIVE.md` Section 7, is the shipping copy for every beat. Variant B lines are used only where the sheet says so (the two Beat 9 panels). You rewrite nothing and add no line the sheet does not contain. |
| Beat 7, Voices | Omitted. No real attributable quotes exist. Do not build the component, do not leave a placeholder. Beat 6 flows into Beat 8. |
| MTN | Named in Beat 3 as work in progress with the exact eyebrow and phrasing in the sheet. The MTN logo is **not** in the Beat 1 roster and is not added anywhere. |
| Client roster | The seven logos in `public/logos/` in the order: British Airways, CEIBS, ATC, Blu Telecommunications, Innovaddb, Ninani, Lifeforms. |
| Partner columns (Beat 6) | Use the proposed assignment in Section 6 Beat 6 of the narrative. It awaits the owner's confirmation; note it in the report, build it as proposed. |
| Counter values (Beat 3) | 2012, 80+, 50+ as in the sheet. Same status: build as given, note in the report. |
| Header | Rebuilt in Phase 1. Do not modify `src/app/components/Header.tsx`. Your only interaction with it is the `data-header-dark` attribute on Obsidian chapter sections (Section 5.3). |
| Time-anchored claims | None. Never "twelve years", never "same directors". The sheet's lines are the only permitted phrasing. |
| Formations | Phase 2 uses the resting formation only. Anything about morphs, noise, pillar formations or the mark is Phase 3 and Phase 4; you design the DOM for it (Section 5) and build none of it. |

## 3. How the parallel work fits together

Two branches run at once from the same `main`:

- **`phase-2-chapters`** (you): the chapter components, the page composition, the text choreography, the mobile layouts. Everything under `src/app/components/home/`, `src/app/page.tsx`, and small additions to `globals.css` for the register bands and the strike-through.
- **`phase-2-spine`** (the other session): `src/three/core/timeline.ts`, the ScrollTrigger master timeline, the Beat 4 pin, the canvas visibility ranges, the register crossfade driver, and the CI gate change.

The seam between the two is the **DOM contract in Section 5**. The spine finds your sections by attribute and writes state back to them as attributes. You never import from `src/three/`. The spine never edits your components. If the contract does not give you something you need, write it in the report and build the visual as if the spine had done its part (for example, render Beat 4's first row as active by default).

Everything you build must look finished and read correctly **with the spine absent**: no pin, no scrub, native scrolling. That is also exactly what reduced-motion visitors and Tier C phones get.

## 4. Tasks

Work on `phase-2-chapters`. One commit per task in the order below, message convention in Section 9. Run `npx tsc --noEmit` and `npx eslint src/app` before every commit. Your dev server: `npx next dev -p 3100` (port 3000 is the owner's).

### Task 1 — Register bands and shared chapter styles

In `src/app/globals.css`:

1. Two register wrappers as component classes: `.band-obsidian` (`background: var(--color-obsidian-950); color: var(--color-silver-100);`) and `.band-ivory` (`background: #FFFFFF; color: #171A20;`). A third, `.band-ivory-soft`, `#F7F8FA`, for Beat 9's panels. Apply `.on-obsidian` alongside `.band-obsidian` so the dark focus ring rule applies.
2. The Ivory card shadow token from `CREATIVE_DIRECTION_3D.md` Section 5.5 as `.shadow-ivory`. No other shadow anywhere on the home page. Nothing on Obsidian has a shadow.
3. The strike-through rule from `SCROLL_NARRATIVE.md` Section 8.4 as `.strike` on the line and `.strike[data-struck]` for the drawn state, 1.5 px, `#171A20`, `transform-origin: left`, 400 ms `var(--motion-ease-out)`. Under `prefers-reduced-motion: reduce` the struck state is present with no transition.
4. Secondary button on Obsidian per Section 5.5: `.btn-secondary-obsidian` with `border-white/20` and a `white/8` hover fill, `h-14`, `rounded-[6px]`.

Acceptance: `Arrival` still renders identically; the four classes exist and are documented with one comment each.

### Task 2 — `TrustedBy` (Beat 1)

`src/app/components/home/TrustedBy.tsx`, Obsidian. Eyebrow `Trusted by`, caption (sheet, Beat 1), then the seven logos in a single row, monochrome silver (`filter: grayscale(1) brightness(1.6)` on Obsidian, or an equivalent that reads silver, never white), `next/image` with explicit dimensions from the files. On phones the row wraps to two rows of four and three, centred. The section is short: `py-16 lg:py-20`, no `min-h`. It carries `id="trusted-by"` (the arrival's scroll cue links to it) and the DOM contract for the spine's slide (Section 5.2). Without the spine the row is static and fully visible.

Delete the `<div id="trusted-by"><Partners /></div>` from `page.tsx` when this lands. Do not delete `Partners.tsx` or `partners.css`; other pages may use them (check, and report).

### Task 3 — `TurningPoint` (Beat 2)

Obsidian, `min-h-[100svh]`, copy column on the left within `md:max-w-[52%] lg:max-w-[50%]` like the arrival (the Core occupies the right on desktop; leave that space empty, it is not yours to fill). Eyebrow `01 — The inflection point`; H2 with `SplitLines`; body with `Reveal` (the bold phrase "We integrate" as `<strong>`); exit link `How we integrate →` to `/about` in eyebrow style with an arrow that shifts 4 px on hover. A `Thread` at the end of the section, `x="right"`, `tone="ember"`, inside a `[data-thread-slot="2"]` wrapper (Section 5.4). Choreography per `CREATIVE_DIRECTION_3D.md` Section 8.4, total under 600 ms.

### Task 4 — `Receipt` (Beat 3)

Obsidian, `min-h-[100svh]`. Eyebrow `02 — Proof`, H2 with `SplitLines`, then two case cards side by side (stacked on phones, Blu first), then the counter row, then the exit `Read both case studies →` to `/case-study`.

Each card: `bg-obsidian-800`, no shadow, 1 px `white/8` border, a 2 px `ember` left border that draws top to bottom over 480 ms when the card is 20 % visible (implement inside the card with an `IntersectionObserver`, once; reduced motion shows it drawn). Card content is the sheet's Card A and Card B text, the eyebrow in `type-eyebrow`, the title in `type-h3`, body in `type-body`, the footer line in `type-telemetry`. Card A links to `/case-studies/2`, Card B to `/case-studies/1` (whole card is the link; the title carries the visible focus). Card B's eyebrow reads exactly `2026 · In progress · Accra Digital Centre`; its body never uses "delivered", "completed" or "built".

Counter row: four items in `type-telemetry` labels with the number in `type-h2` tabular. Use `Counter` for 80 and 50 (suffix `+`); `2012` is printed, not counted; the fourth item is the certifications line, text only. Captions from the sheet's "Counter captions" row sit under each in `type-body` at `silver-500`.

Thread slot `[data-thread-slot="3"]`, `x="center"`, between the cards and the counters on desktop, after the counters on phones.

### Task 5 — `Pillars` (Beat 4)

The pinned chapter. You build the layout and the row states; the spine pins it and drives which row is active. Obsidian.

Structure (the DOM contract in Section 5.5 is normative):

- A section `[data-beat="4"]` containing a `[data-pin]` container of `min-h-[100svh]` on desktop. Inside, a two-column layout at `lg` and up: left column the eyebrow `03 — Four Pillars. Zero Gaps.` and the four rows; right column empty (the Core lives there). Below `lg`: the rows stack full width, each row preceded by a `[data-pillar-poster]` slot holding a `next/image` of `posters.mobile.unlit` from `src/three/core/posters.ts` at `56vw` height, `object-cover`, which Phase 3 replaces with the per-formation posters. Import only `posters` from that module; nothing else under `src/three/`.
- Each row is a `[data-pillar-row="0..3"]` block: an ember dot (8 px circle, `bg-graphite`, `bg-ember` when active), the pillar name as a link to its pillar page in `type-h3`, the row lead from the sheet ("The layer everything else assumes." etc.) in `type-body-l`, the value proposition in `type-body` at `silver-300`, and the partner line in `type-telemetry`. Names and value propositions are the four in Section 6 Beat 4 of the narrative; partner lines are the exact strings there.
- Row states are CSS driven from the container attribute `data-active="0..3"` (Section 5.5): the active row is at full opacity with the lead and partner line visible; inactive rows are at 55 % opacity with the lead, value proposition and partner line collapsed to zero height and hidden. Transition 240 ms `ease.out` on opacity, 480 ms on the collapse (`grid-template-rows: 0fr → 1fr` is the technique; no JS height measurement). The default when the attribute is absent is `0`. Below `lg` every row is fully expanded and the attribute is ignored.
- Keyboard: the four row links are in DOM order; `aria-current="true"` on the active row's link; no `tabindex` tricks.

Thread slot `[data-thread-slot="4"]`, `x="right"`, at the bottom of the section.

### Task 6 — `Difference` (Beat 5)

Ivory, `py-24 md:py-32`. Eyebrow `04 — Why Inflexions`, H2 with `SplitLines`, then the ledger: a two-column grid at `md` and up (three left lines, three right lines), single column below `md` where each struck line is immediately followed by its right-hand line. Left lines use `.strike` and gain `data-struck` when 30 % visible, once (one `IntersectionObserver` for the block). Each right line is a `Reveal` with `delay` such that it appears 120 ms after its strike completes (400 + 120 = 520 ms after the strike starts; use the `delay` prop, do not write a timer). Right lines carry a 2 px `red-500` left border; the third one's border extends 48 px below the ledger (a `Thread` with `tone="red"` in slot `[data-thread-slot="5"]`, `x="left"`, placed directly under the third right line).

Then the intelligence row, one line: eyebrow `AI in every layer`, the sentence in `type-h3`, and the four terms as links to `/solutions/data-centric-solutions`, separated by ` · `. Then the exit `Why enterprises choose us →` to `/about`.

### Task 7 — `PartnerWall` (Beat 6)

Ivory, `py-24 md:py-32`. Two columns at `md` and up, stacked below: each with an eyebrow (`Infrastructure partners`, `Intelligence partners`), the caption from the sheet, and its logos from `public/assets/partners/` in a flowing grid of fixed 160 × 64 boxes, greyscale at 60 % opacity, 100 % colour on hover and focus, 240 ms. Logos are the SVGs already there, as `next/image` `fill` inside the sized box with `object-contain` and `sizes="160px"` (the pattern in `MainPartners.tsx`, which you may read but must not import). Column assignment per the narrative's proposal. No carousel, no paging, no autoplay. No shadow on the boxes.

### Task 8 — `TheAsk` (Beat 8)

Obsidian, `min-h-[100svh]`. Order: a `Thread` first in slot `[data-thread-slot="8"]` at `x="left"` above the eyebrow; eyebrow `Every engagement is an inflection point.`; H2 with `SplitLines`; the offer in `type-body-l`; the pricing frame as three short lines (sheet, Beat 8, "Pricing frame", split on ` / `) in `type-body` at `silver-300` with a 1 px `white/8` rule above and below; the friction line in `type-eyebrow`; the button `Book the review` to `/contact`, primary, `Magnetic`; the telemetry line with the phone and email as quiet links (`silver-500`, underline on hover only). Copy column left within `lg:max-w-[50%]`; the right is the Core's (Phase 4). The section carries the `data-header-dark` attribute like every Obsidian chapter.

### Task 9 — `SideDoors` (Beat 9)

Ivory-soft, `py-24 md:py-32`. Two equal panels on `#F7F8FA` at `md` and up, stacked below. Left: eyebrow `Inflexions Academy`, `Develop Your Edge.` in `type-display-l`, the Variant B sentence from the sheet, link `Explore programmes →` to `/academy`. Right: eyebrow `Careers`, `Build the thing the country runs on.` in `type-display-l`, its sentence, link `Open roles →` to `/careers`. Each panel is a card with the Ivory shadow token and a 2 px `red-500` left border that draws on entry (same pattern as Beat 3's cards, red rather than ember). One link per panel.

### Task 10 — Compose the page

`src/app/page.tsx` becomes, in order: `Arrival`, `TrustedBy`, `TurningPoint`, `Receipt`, `Pillars`, `Difference`, `PartnerWall`, `TheAsk`, `SideDoors`, then the existing JSON-LD stays where it is. Remove the imports and usage of `Partners`, `StrategicPartnerSection`, `ComprehensiveSolutions`, `InflexionsAdvantage`, `IntelligentAutomation`, `AcademyPromo`, `MainPartners`, `CallToAction` from the home page. **Do not delete their files**; Phase 4 removes the ones nothing else uses, after the owner has seen the page. Report which of them are still imported elsewhere.

Every section carries its `data-beat`, `data-register` and, on Obsidian, `data-header-dark` (Section 5).

Acceptance for the page: at 1280 px and 390 px, scrolling top to bottom with the spine absent shows every beat in order, every reveal fires once, no heading is ever half revealed, no band is blank, the header goes dark over each Obsidian chapter and light over each Ivory one, and the total page copy is under 600 words excluding logos.

## 5. The DOM contract with the spine

Normative. The spine reads and writes exactly these.

### 5.1 Sections

Every chapter's root `<section>` has:

- `data-beat="N"` with N from the narrative (1, 2, 3, 4, 5, 6, 8, 9). The arrival is `0` (add it).
- `data-register="obsidian" | "ivory"`.
- On Obsidian: `data-header-dark=""`.
- An `id` matching the component name in kebab case (`trusted-by`, `turning-point`, `receipt`, `pillars`, `difference`, `partner-wall`, `the-ask`, `side-doors`).

### 5.2 Trusted-by slide

The logo row is a single `[data-slide-row]` element. The spine translates it on scroll (from 160 px right to 0). You give it `will-change: transform` and nothing else; without the spine it sits at 0.

### 5.3 Header registers

Nothing beyond `data-header-dark`. The header handles the rest.

### 5.4 Thread slots

`[data-thread-slot="N"]` is a positioned wrapper (`relative`, full width, `height: 48px`) containing one `Thread`. For beats 2 and 4 the spine may set `style="--thread-x: <px>"` on the wrapper; the wrapper's `Thread` is positioned with `left: var(--thread-x, auto)` when that variable exists. Implement that as a class on the wrapper, `.thread-slot`, in `globals.css` (Task 1 may add it).

### 5.5 Pillars

- `[data-pin]`: the container the spine pins on desktop. It must be the direct child of the section and contain the entire chapter; nothing outside it is pinned.
- `[data-pillar-row="i"]`: the four rows.
- `data-active="i"` on the `[data-pin]` container: written by the spine, read by your CSS. Default `0`.
- Each row's link carries `data-pillar-link="i"`; the spine scrolls to the sub-range when one receives focus.

### 5.6 Nothing else

No other hook is needed. If you believe one is, write it in the report and default the visual.

## 6. Things you must not do

- Edit anything under `src/three/`, `src/motion/`, `src/app/components/Header.tsx`, `src/app/MarketingChrome.tsx`, `.github/`, `scripts/`, `src/app/globals.css` beyond Task 1 and Section 5.4.
- Install anything.
- Write a duration or an easing curve in a component. Use the classes and primitives; if a primitive lacks a prop you need, report it and use the nearest primitive as is.
- Add a canvas, a shader, a ScrollTrigger, a pin, a scrubbed animation, or a parallax.
- Change copy, add copy, or reorder beats. Word budgets in the narrative are ceilings.
- Add a fourth exit to any beat, a grid of four cards, a carousel, an autoplaying anything, a stock photograph, or a testimonial.
- Delete any file. Move nothing under `public/`.
- Put a shadow on Obsidian, a grid line anywhere, or a hover that moves layout.
- Use `any`.

## 7. Things that look wrong but are intentional

- The right half of Beats 2, 3, 4 and 8 is empty on desktop. The Core lives there and the spine places it. Do not fill it.
- Beat 4's mobile posters are all the same image. Phase 3 replaces them.
- Without the spine, Beat 4 is not pinned and the first row is the only expanded one on desktop. That is the contract's default and it is what reduced-motion visitors see.
- The old components remain in the repository, unused by the home page.
- `CXO/` at the repo root is untracked and not yours.

## 8. Gate for hand-back (all true)

- [ ] `npm run build` passes; `npx eslint src/app` clean; `npx tsc --noEmit` clean.
- [ ] `node scripts/perf-gate.mjs --bundles` passes: the route shell stays under 205 KB gz (the chapters add server-rendered HTML, not client JavaScript; anything that needs `"use client"` must justify it in the report).
- [ ] `git diff main -- src/three src/motion src/app/components/Header.tsx` is empty.
- [ ] Every section carries the Section 5.1 attributes; `document.querySelectorAll('[data-beat]').length` is 9 on `/`.
- [ ] Copy on the page matches `SCROLL_NARRATIVE.md` Section 7 byte for byte, checked with a script or by hand and stated in the report.
- [ ] Keyboard: tabbing from the top reaches every link in visual order; every focus ring is visible on both registers.
- [ ] Reduced motion: all reveals present at load, strikes drawn, counters printed, threads drawn.
- [ ] Screenshots of `/` at 1280 px and 390 px, full page, attached to the report.

## 9. Commit convention

Branch `phase-2-chapters`, one commit per task:

```
phase2(styles): register bands, ivory shadow, strike-through, secondary button
phase2(trusted-by): Beat 1 roster
phase2(turning-point): Beat 2 copy and thread slot
phase2(receipt): Beat 3 cards, counters, thread slot
phase2(pillars): Beat 4 rows, row states, mobile posters
phase2(difference): Beat 5 ledger with strikes, intelligence row
phase2(partner-wall): Beat 6 two columns
phase2(the-ask): Beat 8 offer, pricing frame, telemetry
phase2(side-doors): Beat 9 panels
phase2(page): compose the ten beats, retire the legacy sections from the home page
```

Every commit message ends with:

```
Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```

## 10. Hand-back

Write `PHASE2_REPORT.md` at the repo root: the bundle table from the gate; the list of legacy components still imported elsewhere; every question you could not answer with the file and line; anything you changed that this brief did not ask for, with the reason; the two screenshots. Do not open a pull request and do not merge; the spine session integrates both branches. Stop when the report is written.
