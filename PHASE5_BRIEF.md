# Phase 5 Brief — The interior pages

**For:** the agent re-setting the interior pages (Opus)
**From:** the Phase 4 session, 24 September 2026
**Scope:** every marketing route other than `/`, brought into the redesign's two registers, type scale and rules. Static page work only: server components, CSS, and the smallest client components the brief names. No canvas, no shaders, nothing under `src/three/` except reading the poster paths.

Read this file, then the documents in Section 1, then start at Section 4. Where this brief and another document disagree, this brief wins for Phase 5. Where you are unsure, do not guess: finish everything else, write the question in `PHASE5_REPORT.md` (Section 10), and stop.

---

## 1. Read first, in this order

1. `CREATIVE_DIRECTION_3D.md` — Section 5 (tokens, type tiers, layout rhythm, the Ivory shadow token), Section 8 (the animation system: you use the primitives, never write easing or durations), Section 9 Phase 5, Section 11 (never ship).
2. `CLAUDE.md` — project rules: the offering categories, the solution-page alternating layout, the Academy data rules, and the navbar rules (the header's two registers and `data-header-dark`).
3. `SCROLL_NARRATIVE.md` Section 7 — the approved lines you will place on `/contact` and the 404, and the offer line and button you will use in every closing band.
4. `COPY_DECK.md` Sections 5, 6 (Beat 9) and 11 — what Variant B is and why it is the Academy and Careers voice. You will draft in it (Task 9), not ship it.
5. The finished home page, as the reference for every decision: `src/app/components/home/*` and `src/app/page.tsx`. `Arrival.tsx` for an Obsidian arrival, `Receipt.tsx` for entries without cards, `SideDoors.tsx` and `DoorFrame.tsx` for links as surfaces, `PartnerWall.tsx` for the partner columns, `TheAsk.tsx` for the closing offer. Match their conventions exactly: type tier classes, `band-obsidian on-obsidian`, `band-ivory`, `ExitLink`, `Magnetic` on primary CTAs, Lucide icons, `rounded-[6px]` buttons.

## 2. Decisions already made (do not re-open)

| Decision | Outcome |
|---|---|
| Copy | Existing interior copy is kept **verbatim** except the approved lines in Task 8 and Task 10. You rewrite nothing else. The Variant B rewrite of Academy and Careers is drafted for the owner in Task 9, not shipped. |
| The accent-bar card | **Banned site-wide** (owner, 23 September 2026): no coloured `border-left` or `border-right` over 1 px on any card, list item or callout; no card with an accent bar; no card inside a card; no near-white card on a white section. Where a page lists things, use entries separated by hairlines, as `Receipt.tsx` and `SideDoors.tsx` do. |
| Section numbers | No "01 —" style numbering on any eyebrow (owner, 23 September 2026). Short labels may stay. |
| Red | Red is for primary actions and the one live-status dot. No red icon badges, no red bars, no red rules. |
| Shadows | Nothing on Obsidian has a shadow. On Ivory, only `.shadow-ivory`, and only where a surface genuinely lifts. Borders or shadow, never both. |
| Headings | Every H1 is `type-display-l` (the Phase 5 gate). H2 is `type-h2`, H3 `type-h3`. The home page's scale is the reference. |
| Header | Do not modify `src/app/components/Header.tsx`. Your interaction with it is `data-header-dark` on each Obsidian band. |
| Footer | Already on Obsidian (Phase 4). Do not modify it. |
| 3D | No interior page loads the 3D engine. The heroes carry a still poster of a formation (Task 1). The live Core on `/solutions` is the spine session's job after you hand back (Section 3). |
| Images | Never delete anything under `public/`; move unused files to `assets-src/unreferenced/`, keeping their paths. |
| Academy data | `src/app/academy/data.ts` is untouched. |

## 3. How this fits with the other session

You work on `phase-5-interior`. After you hand back, the spine session (Fable) adds, on the same branch: the reduced live Core behind the `/solutions` hero (Task 1 leaves it a slot), the header's first-paint register on interior routes, and the Lighthouse run. Do not attempt any of those.

## 4. Tasks

Work on `phase-5-interior`. One commit per task in the order below, message convention in Section 9. Run `npx tsc --noEmit`, `npx eslint src/app` and `npm test` before every commit. Your dev server: `npx next dev -p 3100` (port 3000 is the owner's). On Windows the `.next/dev` cache corrupts when branches change under a running server; if you see `ENOENT` or a stale stylesheet, stop the server, `rm -rf .next/dev`, restart.

### Task 1 — `PageHero`

`src/app/components/PageHero.tsx`, a server component. The Obsidian arrival band for every interior page:

- `section.band-obsidian.on-obsidian` with `data-header-dark=""`, `min-h-[80svh]` (default) or `min-h-[56svh]` (`size="compact"`, for programme and case-study detail pages).
- Props: `eyebrow` (optional), `title`, `lead` (optional), `cta` (optional: label, href; renders the primary button with `Magnetic`), `formation` (`1`–`5`, or `"none"`), `coreSlot` (boolean, for `/solutions` only), `children` (optional, for page-specific content under the lead).
- Copy column left, within `lg:max-w-[52%]`, exactly like `Arrival.tsx`. H1 in `type-display-l`.
- The formation still on the right, from `public/three/posters/f{n}-lit-desktop.{avif,webp}` (1920 × 1080) and `f{n}-lit-mobile.{avif,webp}` (780 × 1688), as a `<picture>` with media sources the way `Arrival.tsx` renders its poster, `object-cover` at `50% 50%`, not `priority` unless it is the LCP candidate (it is not: the H1 is). On phones the poster sits behind the copy dimmed to 35 % opacity, so the text keeps contrast; check it.
- Mapping: Network Infrastructure → 1 (lattice), Data Security → 2 (shield), Cloud Services → 3 (nebula), Data-centric Solutions → 4 (plane), About → 5 (the mark). Academy, Careers, Services, Contact, Case studies, Resources: `"none"`, a plain Obsidian band.
- `coreSlot`: renders an empty `<div data-core-slot className="absolute inset-0" aria-hidden />` behind the copy instead of a poster. Nothing mounts into it yet.

Acceptance: the component renders with and without each optional prop; no client JavaScript.

### Task 2 — `AskBand`, replacing `Banner`

`Banner.tsx` (the navy overlay on a stock photo, "Ready to Transform Your IT?") is on fifteen pages and is the old site's voice. Replace every use with `src/app/components/AskBand.tsx`: a short Obsidian band (`py-24 md:py-32`, `data-header-dark`) with the approved offer line from the copy sheet ("Book a 30-minute architecture review. With a Solutions Architect, not a salesperson. No pitch.") in `type-body-l`, the button **Book the review** to `/contact`, primary, `Magnetic`, and the approved friction line "No obligation. One conversation." in `type-eyebrow`. No heading, no photograph.

On Academy pages, AskBand takes a `variant="academy"` that keeps the page's existing enquiry target and label if the page has one (read what each Academy page's Banner currently links to and says; keep that link and label, restyled). If a page's Banner carries page-specific text that is not the generic line, keep that text verbatim in AskBand and report it.

Delete `Banner.tsx` when nothing imports it. Move its image to `assets-src/unreferenced/` if nothing else uses it.

### Task 3 — Solutions: the index and the four pillars

- `/solutions`: `PageHero` with `coreSlot` (the live Core comes later). Replace `MainPartners` (the autoplaying carousel, banned by `CREATIVE_DIRECTION_3D.md` §11) with the home page's partner columns: refactor `home/PartnerWall.tsx` so its columns render from a shared `PartnerColumns` component that both the home section and `/solutions` use, keeping the home section's `data-beat` and markup unchanged. Then delete `MainPartners.tsx`. Re-set the page's other sections to the rules in Section 2: its cards become hairline entries; images take the photography grade (Task 7).
- The four pillar pages: `PageHero` with their formation. Keep the alternating layout rule from `CLAUDE.md`. `SolutionPartners` and `RelatedTraining` re-set to the tokens: logos in the same fixed boxes and greyscale-to-colour treatment as `PartnerColumns`, no shadow, no card.

### Task 4 — Services: the index and three service pages

`PageHero` with no formation. Re-set every section to Section 2's rules. Where the pages present steps or tiers as cards, make them hairline entries with the step number set as a large tabular numeral (as `Receipt.tsx` sets the year), which is the one place a number may lead a block because the sequence carries meaning.

### Task 5 — Academy: landing, four domains, programmes, For Organisations

`AcademyHero` becomes `PageHero` (delete `AcademyHero.tsx` when unused). Programme pages use `size="compact"`. `DomainCard`, `ProgrammeCard`, `LevelBadge`, `CurriculumAccordion`, `ProgrammeDetailsSidebar` and `AudienceSwitcher` re-set on the tokens: no accent bars, no card-in-card, level badges as `type-telemetry` text with a hairline outline, not filled pills. `generateStaticParams` and every route stay exactly as they are. Programmes stay person-independent (no instructor content).

### Task 6 — About, Careers, Case studies, Resources

- About: `PageHero` with formation 5. Replace the `Partners` ticker (an absolutely positioned CSS marquee that ran a layout every frame) with the home page's roster row from `TrustedBy.tsx`, extracted to a shared `ClientRoster` component used by both, on Ivory using the dark silhouettes (`public/logos/silver/*` rendered without the invert filter). `Leaders` re-set: portraits in the photography grade, names in `type-h3`, no cards.
- Careers: `PageHero`, no formation. `FeaturedJobs` as hairline entries.
- `/case-study` and `/case-studies/[id]`: `PageHero` (`compact` on the detail page). Case entries as `Receipt.tsx` sets them: the year large, status, name, account, hairline above. Keep the in-progress rule for MTN (`SCROLL_NARRATIVE.md` §6 Beat 3): the MTN entry never says delivered, completed or built.
- `/resources`: `PageHero`, `Blog` cards as hairline entries.

When `Partners.tsx`, `partners.css` and `ClientStrip.tsx` are no longer imported, delete them.

### Task 7 — Photography and the small parts

- One CSS class, `.photo-grade`, in `globals.css`: a restrained grade that sits photography inside the palette (desaturate toward the silver register, a slight lift of the shadows toward obsidian). Apply it to every photograph on interior pages. Never on logos, posters or icons.
- Every button to the rules in `CREATIVE_DIRECTION_3D.md` §5.5: primary `h-14 rounded-[6px] bg-primary-500`; secondary on Obsidian `.btn-secondary-obsidian`; secondary on Ivory a 1 px `neutral-300` outline.
- The `Faq` component on `/contact`: questions as `type-h3` rows with a hairline between, the answer revealed with the `0fr → 1fr` grid technique `Pillars.tsx` uses. No icons in circles.

### Task 8 — Contact

`PageHero` with no formation and the approved lines from `SCROLL_NARRATIVE.md` §7: H1 **Book your architecture review.**, lead "Thirty minutes, a Solutions Architect, no pitch. Tell us what you are running and what worries you, and we will come prepared." The form keeps its fields and behaviour; apply the approved labels: the message field's label becomes "What are you running, and what worries you?", the submit button **Request the review**, the success message "Received. A Solutions Architect will reply within one working day to fix a time. If it is urgent, call +233 20 888 9270." Inputs styled on the tokens: 1 px `neutral-300` border, `rounded-[6px]`, focus ring from the palette, error text in the palette's red with the problem and the recovery named.

### Task 9 — Draft the Variant B copy (do not ship)

Write `PHASE5_COPY.md`: for the Academy landing, each domain page's intro, For Organisations, and Careers, a two-column table of the current line and a Variant B rewrite, following `COPY_DECK.md` §5's description of B and its writing rules (active voice, second person for the reader, British spelling, no empty superlatives, no time-anchored claims such as years served or "same team since"). Headlines, leads and CTAs only; leave programme descriptions alone. The owner signs these off; the pages keep the current copy until then.

### Task 10 — 404

`src/app/not-found.tsx` on Obsidian with the approved lines: **That page is not on the network.** / "Try the navigation, or go back to the start." with a link home.

## 5. Things you must not do

- Edit `src/app/components/Header.tsx`, `Footer.tsx`, anything under `src/three/`, `src/motion/`, `src/app/components/home/` beyond the two extractions Tasks 3 and 6 name, `src/app/page.tsx`, `src/app/academy/data.ts`, `src/app/admin`, `src/app/api`, `prisma/`, `src/lib`, `src/proxy.ts`, `.github/`, `scripts/`.
- Install anything.
- Write a duration or an easing curve. Use the primitives and the motion CSS variables.
- Add a canvas, a shader, a scroll-linked animation, a parallax or a carousel.
- Change copy beyond Tasks 8 and 10, or add claims.
- Use a gradient on text, glass or blur as decoration, emoji or text glyphs as icons, or grid lines as decoration.
- Delete anything under `public/`. Use `any`.

## 6. Things that look wrong but are intentional

- `/solutions` has an empty Obsidian hero on the right. The live Core goes there after hand-back.
- Interior headers may flash white for a frame on first load before turning dark over the hero. The spine session fixes that.
- The Academy and Careers pages keep their current copy. Variant B is a draft for sign-off.
- `CXO/` at the repo root is untracked and not yours.

## 7. Gate for hand-back (all true)

- [ ] `npx next build` passes; `npx eslint src/app` 0 errors (the 6 admin warnings are pre-existing); `npx tsc --noEmit` clean; `npm test` passes.
- [ ] `node scripts/perf-gate.mjs --bundles` passes; the route shell does not grow by more than 3 KB gz over `main`.
- [ ] No interior route loads the environment chunk (check the network panel on `/solutions`, a pillar, `/academy`, `/contact`).
- [ ] Every H1 on every interior route is `type-display-l`, checked with a script.
- [ ] `grep -rnE "border-l-[2-9]|border-l-\\[[2-9]" src/app --include=*.tsx` finds nothing outside `admin`.
- [ ] `git diff main -- src/three src/motion src/app/components/Header.tsx src/app/components/Footer.tsx src/app/academy/data.ts` is empty.
- [ ] Every Obsidian band carries `data-header-dark`.
- [ ] Keyboard: every link and control reachable in visual order on each page, focus visible on both registers.
- [ ] Reduced motion: every page reads complete.
- [ ] Full-page screenshots at 1280 and 390 px of `/about`, `/solutions`, one pillar, `/services`, one service, `/academy`, one domain, one programme, `/careers`, `/case-study`, `/contact` and the 404, in `docs/phase5/`.

## 8. Order of work if time runs short

Tasks 1, 2 and 8 first (they touch every page and carry approved copy), then 3, 5, 6, 4, 7, 9, 10. Stop at a clean commit and report what is left.

## 9. Commit convention

Branch `phase-5-interior`, one commit per task:

```
phase5(hero): PageHero with formation stills
phase5(ask): AskBand replaces Banner
phase5(solutions): index, pillars, partner columns shared, carousel gone
phase5(services): index and service pages
phase5(academy): landing, domains, programmes, for organisations
phase5(pages): about, careers, case studies, resources
phase5(parts): photo grade, buttons, FAQ
phase5(contact): approved lines and form
phase5(copy): Variant B drafts for sign-off
phase5(404): not on the network
```

Every commit message ends with:

```
Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>
```

## 10. Hand-back

Write `PHASE5_REPORT.md`: the bundle table; the H1 script output; every page-specific text you kept in an AskBand; every component deleted and every image moved; every question you could not answer, with file and line; anything you changed that this brief did not ask for, with the reason; the screenshot index. Do not open a pull request, do not merge. Push the branch and stop.
