# Inflexions I.T. Services — Design System v3.0

**The Obsidian/Ivory redesign — 25 September 2026**

**Version:** 3.0.0
**Last updated:** 2026-09-25
**Sources of truth:** `src/app/globals.css` (tokens and utility classes), `src/motion/tokens.ts` (motion), the components named below, `scripts/budgets.json` (performance). Direction: `CREATIVE_DIRECTION_3D.md` §5 and §8, `HERO_SCENE_SPEC.md`, `PERFORMANCE_PLAN.md`, `PHASE5_BRIEF.md` §2.

> **How to read this file.** **Part A** (new) documents the redesign as built and is authoritative. **Part B** is the v2.0 system of February 2026, kept below unchanged for history. Wherever the two conflict, Part A wins. Part B section headings that conflict carry a "(superseded by Part A §n)" marker.
>
> **Superseded v2.0 content, by name:**
> - **Colour:** the Navy palette (1.3) and every navy alias; the surface overlays and `surface-dark` (1.5); the Semantic Aliases (1.7), which put navy on headings and white on dark; the Dark Mode Palette (1.8). There is no `prefers-color-scheme` dark mode: the dark register is Obsidian.
> - **Typography:** Font Families weights (2.1), the 9-level Composite Text Styles (2.2), Responsive Typography (2.3) and Text Colour Pairing (2.4). They are replaced by the `type-*` classes.
> - **Spacing:** Section Spacing (3.3).
> - **Icon rules:** red as the icon accent (4.4).
> - **Components:** Navbar and Mobile Menu (01, 02); Home Hero Banner, Inner Page Hero and Call-to-Action Banner (04–06); all four v2 buttons (07–10); every card style (11–17); the text, dark, textarea and subscribe inputs (18, 19, 21, 22); the Floating Badge, Testimonial Dot, Consultation Box, Badge/Tag and Alert Banner (25, 26, 28, 30, 31); Image Hover Zoom, Swap Grid, Partner Logo Marquee, Testimonial Slider and Footer (35–39).
> - **Layout:** the Common Layout Templates (7.3), which include the full-bleed hero with a black overlay.
> - **Motion:** all of section 8. Its easings, durations, stagger and the 600 ms ceiling are replaced by the tokens and rules in Part A §5.
> - **Accessibility:** the Colour Contrast table (9.2, navy pairs) and the single red focus ring (9.3).
> - **Tokens:** the Design Tokens JSON (10), the CSS Custom Properties (11) and the Figma guide (12). `globals.css` and `tokens.ts` are now the only token sources.

---

# Part A — v3.0 (authoritative)

## A1. Registers

The site has two registers. Every full-width section is one or the other. There is nothing in between.

| Register | Role | Class | Background / text | Marker attributes |
|---|---|---|---|---|
| **Obsidian** | The environment: arrivals, the object, proof, closing bands, footer | `band-obsidian on-obsidian` | `--color-obsidian-950` `#07080B` / `--color-silver-100` `#E6E7EA` | `data-register="obsidian"` **and** `data-header-dark=""` |
| **Ivory** | The reading room: detail, lists, forms, photography | `band-ivory` | `#FFFFFF` / `#171A20` | `data-register="ivory"` (optional) |
| Ivory soft | Defined for Beat 9's white panels. **No current consumer:** SideDoors now uses `band-ivory`. | `band-ivory-soft` | `#F7F8FA` / `#171A20` | — |

**The contract.**
- `band-obsidian` is always paired with `on-obsidian`, so the dark focus ring applies (§8.3).
- `data-header-dark` drives the header. It is **functional**: the header goes dark while any element carrying it overlaps the bar (`top < headerPx && bottom > headerPx × 0.5`, with headerPx 56 on phones and 64 from `lg`).
- `data-register` is a **descriptive marker** for audits and briefs. No code reads it on sections. The header writes its own `data-register` (`obsidian` or `ivory`) to reflect its current state.
- The footer is Obsidian (`on-obsidian bg-obsidian-950`, `data-header-dark`) on every page. It uses `bg-obsidian-950` rather than `band-obsidian`, so it stays opaque when the Core is live.

**The header's two registers** (`Header.tsx`, partly locked: read CLAUDE.md "Navbar" before touching it).

| State | When | Bar | Logo | Links |
|---|---|---|---|---|
| Dark | A `data-header-dark` element is under the bar, or the mobile menu is open | `bg-obsidian-950/45 backdrop-blur-md border-b border-white/[0.08]`, and `bg-obsidian-950/35` where backdrop-filter is supported. The open mobile menu forces `!bg-obsidian-950`. | `/inflexlogo-light.png` | `text-silver-300`, hover and focus `text-silver-100` |
| Light | Otherwise | `bg-white border-b border-[#E6E6E6]` | `/inflexlogo.png` | `text-gray-700`, hover `text-red-600` (the header's own reds; new components use `primary-*`) |

The server renders the dark bar, because every marketing route opens on an Obsidian band. A page that opens light corrects it on mount. The register change transitions at `--motion-duration-ui` with `--motion-ease-out`. Heights are `h-14` and `lg:h-16`, fixed, `z-50`. Anything placed at the top of a page must start below the bar: `top-14 lg:top-16`, or `pt-28` for content.

**`html[data-core-live]`.** `Arrival.tsx` sets this attribute on the root while the live Core is on screen (Tier A or B, after the poster crossfade). Tier C never sets it. While it is present:
- `.band-obsidian` and `section[data-beat="0"]` go `background: transparent`, so the fixed canvas shows through them.
- `html` takes `--color-obsidian-950` and `body` goes transparent.
- Ivory bands and the footer keep their own backgrounds and cover the canvas.
- `[data-pillar-poster]` (Beat 4's phone posters) is hidden.

Consequence: a dark section on the home page must use `band-obsidian`, not a raw `bg-obsidian-*`, or it will hide the Core.

---

## A2. Colour

### A2.1 Tokens defined in `@theme`

| Group | Token | Value | Use |
|---|---|---|---|
| **Obsidian** | `--color-obsidian-950` | `#07080B` | Obsidian band and footer background; root colour while the Core is live |
| | `--color-obsidian-900` | `#0A0C10` | Scene clear colour; the footer's input field |
| | `--color-obsidian-800` | `#10131A` | Raised surface on dark (sparingly) |
| | `--color-obsidian-700` | `#181C25` | Border on dark (usually written as `white/10`–`white/15` instead) |
| **Silver** (text on dark) | `--color-silver-100` | `#E6E7EA` | Headings and display text on Obsidian; also the dark focus ring |
| | `--color-silver-300` | `#C9CBD1` | Body text on Obsidian |
| | `--color-silver-500` | `#A9ADB8` | Eyebrows, telemetry and muted text on Obsidian |
| | `--color-graphite` | `#8F8D8D` | Logo grey; the Core's node base colour |
| **Ember** | `--color-ember` | `#FF3B2F` | Emissive red for the 3D scene. Outside the scene: the ember Thread and the one live-status dot only. Never text, never UI. |
| **Primary red** | `--color-primary-500` | `#BD2E25` | Primary action fill; the Ivory focus ring; the red Thread |
| | `--color-primary-600` | `#A02923` | Primary hover; form error text |
| | `--color-primary-50` … `-900` | `#FDE8E7` … `#52110D` | The full scale is still defined (unchanged from v2) |
| **Neutral** (text on Ivory) | `--color-neutral-900` | `#171A20` | Headings and strong text on Ivory; outline-button text |
| | `--color-neutral-600` | `#41444B` | Lead paragraphs on Ivory |
| | `--color-neutral-500` | `#5C6280` | Labels, telemetry, struck ledger lines, helper text |
| | `--color-neutral-400` | `#8C8C8C` | Placeholders only |
| | `--color-neutral-300` | `#A6A6A6` | Field and outline-button borders |
| | `--color-neutral-200` | `#D0D0D0` | Hairlines on Ivory (entries, DoorFrame) |
| | `--color-neutral-50` | `#F2F2F2` | Outline-button hover fill |
| Surface, semantic, navy | `--color-surface-*`, `--color-{success,warning,error,info}-*`, `--color-navy-*` | as in v2 | Still defined, for the admin area and legacy code. **Not for new marketing components.** |

Values used as literals: header hairline `#E6E6E6`; door hover surface `#F4F5F7` (SideDoors); `band-ivory-soft` `#F7F8FA`.

Hairlines on Obsidian are white at low alpha: `border-white/15` above entries, `border-white/10` for dividers and the footer, `border-white/20` for the secondary button and the footer input, `white/[0.08]` for the header hairline and the secondary button's hover fill.

The brand red in code is `--color-primary-500` `#BD2E25`. CLAUDE.md's `--color-primary: #D0281F` is not a defined token. `#D0281F` survives only as `--color-error-border`.

### A2.2 Rules

| Rule | Detail |
|---|---|
| **Red is for actions** | Red means primary buttons, the Ivory focus ring and the red Thread. Outside those, the only red is the one live-status dot: an ember `h-1.5 w-1.5 rounded-full bg-ember` in `Receipt.tsx`, beside "In progress". No red icon badges, tiles, bars, rules or ticks. |
| **No pure white text on Obsidian** | Use `silver-100` for headings, `silver-300` for body and `silver-500` for muted text, because pure white halates on near-black. The one exception is `text-white` on a red button. |
| **Red on dark is large-only** | `primary-500` on `obsidian-900` is 3.9:1, so on dark it is for large text and icons only, never body copy. (Measured in CREATIVE_DIRECTION_3D.md §5.2: `silver-300` 12.9:1, `silver-500` 8.6:1.) |
| **No navy** in any new component | This includes navy washes over photographs. |
| **Cards** | No near-white card on a white section. No card inside a card. No accent-bar cards: no coloured `border-left` or `border-right` over 1 px on any card, list item or callout. Where a page lists things, use hairline entries (§6.6). |
| **Shadows** | Nothing on Obsidian has a shadow. On Ivory there is one shadow, `.shadow-ivory` (`0 1px 2px rgb(23 26 32 / 0.06), 0 8px 24px rgb(23 26 32 / 0.06)`), and only where a surface genuinely lifts. Use a border or a shadow, never both. (The class is defined but currently unused.) |
| **Grid lines** | Only in the 3D scene's ground plane. Never in the reading room. |

---

## A3. Typography

**Faces** (`next/font/google` in `layout.tsx`, `display: swap`, preloaded):

| Face | Variable | Weights loaded | Stack | Role |
|---|---|---|---|---|
| Rubik | `--font-rubik` (also `--font-sans`) | 400, 500, 600, 700 | `var(--font-rubik), "Rubik Metric", system-ui, sans-serif` | Everything except eyebrow and telemetry |
| Krub | `--font-krub` | 500 only | `var(--font-krub), "Krub Metric", system-ui, sans-serif` | `type-eyebrow`, `type-telemetry` |

**Metric fallback faces** (PERFORMANCE_PLAN.md §5.4) are `@font-face` rules over `local("Arial")`, Liberation Sans, Roboto and Helvetica. Their size and ascent/descent overrides are measured against the web fonts, so the font swap moves nothing:

| Face | Weight | size-adjust | ascent / descent |
|---|---|---|---|
| Rubik Metric | 400 | 104.41% | 89.55% / 23.94% |
| Rubik Metric | 500 | 108.24% | 86.38% / 23.10% |
| Rubik Metric | 600 | 102.31% | 91.39% / 24.44% |
| Rubik Metric | 700 | 104.13% | 89.79% / 24.01% |
| Krub Metric | 500 | 106.53% | 94.53% / 27.50% |

**Type tiers** (`@layer components` in `globals.css`). Each class sets size, weight, tracking and line height only. Colour, max-width and margin belong to the component, so a tier works in either register.

| Class | Face | Size | Weight | Tracking | Line height | Extras | Where |
|---|---|---|---|---|---|---|---|
| `type-display-xl` | Rubik | `clamp(2.125rem, 4.6vw, 4.75rem)` | 700 | −0.035em | 0.98 | `text-wrap: balance` | Home H1 only |
| `type-display-l` | Rubik | `clamp(2rem, 4.5vw, 4rem)` | 700 | −0.03em | 1 | balance | **Every interior H1** (Phase 5 gate); home chapter headings |
| `type-h2` | Rubik | `clamp(1.75rem, 3vw, 2.5rem)` | 700 | −0.02em | 1.1 | balance | Section titles; large tabular figures (years, step numbers) |
| `type-h3` | Rubik | `1.5rem` | 600 | −0.01em | 1.25 | — | Entry titles |
| `type-body-l` | Rubik | `clamp(1rem, 0.9rem + 0.35vw, 1.125rem)` | 400 | 0 | 1.6 | — | Leads, offer lines (about `max-w-[56ch]`–`[60ch]`) |
| `type-body` | Rubik | `clamp(0.9375rem, 0.88rem + 0.2vw, 1rem)` | 400 | 0 | 1.6 | — | Everything else; form fields |
| `type-eyebrow` | Krub | `0.75rem` | 500 | +0.18em | 1 | uppercase | Section labels, ExitLink, dt labels |
| `type-telemetry` | Krub | `0.6875rem` | 500 | +0.12em | 1 | uppercase, `tabular-nums` | Status lines, form labels, footnotes, counter labels |

**Colour by register.**
- Obsidian: display and headings `text-silver-100`, body `text-silver-300`, eyebrow and telemetry `text-silver-500`.
- Ivory: headings `text-neutral-900`, leads `text-neutral-600`, labels and telemetry `text-neutral-500`.

**Rules.**
- H1 is `type-display-l`, H2 is `type-h2`, H3 is `type-h3`.
- No "01 —" section numbering on eyebrows; short labels are fine.
- Animate lines only, never letters.
- Numbers use `tabular-nums`.

---

## A4. Spacing and layout

| Item | Value |
|---|---|
| Container | `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8` (80rem; matches the header) |
| Reading-room band | `py-24 md:py-32`, on both Ivory and Obsidian content bands and on AskBand |
| Home chapters | `min-h-[100svh]` in the environment; content bands as above. SideDoors: `py-20 md:py-28` |
| PageHero | `min-h-[80svh]` (default) or `min-h-[56svh]` (compact); copy `pt-28 pb-16 md:pb-20`, bottom-aligned on phones and centred from `md` |
| Copy column over an object | `max-w-2xl lg:max-w-[52%]` (PageHero); `md:max-w-[52%] lg:max-w-[50%]` (home). The object sits centre-right. |
| Two-column content | `grid gap-12 lg:grid-cols-2 lg:gap-20` |
| Entry grids | `mt-16 grid gap-x-12 gap-y-10 md:grid-cols-3`. Entry `pt-8` under its hairline. Short lists: `entryGrid()` (§6.6) |
| Vertical rhythm | H2 → lead `mt-6`; lead → list `mt-10`; → CTA `mt-10`; → entry grid `mt-16` |
| Radii | Buttons and fields `rounded-[6px]`; checkboxes `rounded-[2px]`; photographs in the shared templates are square-cornered |
| Footer | `py-16 md:py-20`, grid `lg:grid-cols-[1.4fr_1fr_1fr_1.4fr]` |

Breakpoints are Tailwind's defaults (as in Part B §7.1). `lg` (1024 px) is also the Tier A/B viewport threshold and the header's desktop switch.

---

## A5. Motion

### A5.1 Tokens (`src/motion/tokens.ts`)

| Group | Token | Value | CSS variable | Use |
|---|---|---|---|---|
| duration | `micro` | 120 ms | `--motion-duration-micro` | Colour and opacity on hover |
| | `ui` | 240 ms | `--motion-duration-ui` | Dropdowns, toggles, tabs, header register, Magnetic return |
| | `reveal` | 480 ms | `--motion-duration-reveal` | Text and entry entrances, Thread, strike, DoorFrame strokes |
| | `scene` | 900 ms | `--motion-duration-scene` | Poster crossfade, register changes, Counter default |
| | `morph` | 1600 ms | — (TS only) | Core formation change when not scrubbed (canvas only) |
| ease | `out` | `cubic-bezier(0.16, 1, 0.3, 1)` · GSAP `expo.out` | `--motion-ease-out` | Entrances, hovers |
| | `inOut` | `cubic-bezier(0.76, 0, 0.24, 1)` · GSAP `power4.inOut` | `--motion-ease-in-out` | Scrubs, morphs |
| | `exit` | `cubic-bezier(0.7, 0, 0.84, 0)` · GSAP `expo.in` | `--motion-ease-exit` | Exits only |
| stagger | `lines` / `rows` / `cards` / `max` | 60 / 40 / 60 / 600 ms | — | `max` caps any delay and any block's choreography |
| distance | `reveal` / `line` / `parallaxMax` | 16 / 12 / 40 px | `--motion-distance-reveal`, `--motion-distance-line` (parallax is TS only) | |

`src/motion/__tests__/tokens.test.ts` fails if the CSS variables drift from `tokens.ts`, or if `globals.css` contains `bounce`, `elastic` or `back(`.

**Tailwind defaults are remapped** in `@theme`:
- `--default-transition-duration: var(--motion-duration-micro)`
- `--default-transition-timing-function: var(--motion-ease-out)`
- `--ease-out` → the `out` token, `--ease-in-out` → `inOut`, `--ease-in` → `exit`

So a bare `transition-colors` runs at 120 ms expo-out, and Tailwind's stock 150 ms `cubic-bezier(0.4, 0, 0.2, 1)` can never reach the page. When a class needs a specific token, write it as `duration-[var(--motion-duration-ui)] ease-[var(--motion-ease-out)]`.

### A5.2 Rules

- No component writes its own duration or easing. Every value comes from the tokens.
- No bounce, elastic, back or overshoot easing.
- No per-letter animation.
- Nothing moves its layout on hover. Hover shifts are transforms on a child (for example the ExitLink arrow's `translate-x-1`). Buttons change colour only: no scale, no shadow.
- **The 1 s ceiling.** No DOM motion runs longer than 1 s outside the pinned chapter (CREATIVE_DIRECTION_3D.md §10.2). Where older specs named longer values, the code moved them onto tokens: Counter counts over `scene` (900 ms) instead of 1.2 s, the lit poster crossfade uses `scene` instead of 1800 ms, and the strike and DoorFrame use `reveal`. **Documented exceptions:**
  1. Scroll-scrubbed motion has no duration of its own: Core morphs, camera and bloom, and the pinned Beat 4.
  2. Inside the canvas: `duration.morph` (1600 ms) and the scene's arrival light (`ARRIVAL_LIGHT_MS` 1800 in `CoreScene.ts`).
  3. The hero scroll cue (`.motion-scroll-cue`), an ambient 2.4 s loop that stops once `[data-scrolled]` is set.
- Choreography: heading lines stagger at 60 ms. Body follows the heading, CTA last. The whole block takes 600 ms or less (`stagger.max`).

### A5.3 Reduced motion

`prefers-reduced-motion: reduce` has these effects:
- Tier C, so there is no canvas.
- The global rule collapses every animation and transition to 0.01 ms, with one iteration.
- `Reveal` content simply appears.
- `SplitLines` does not split.
- `Counter` prints the final value.
- `Magnetic` is off.
- `LenisProvider` does not start, so scrolling is native.
- The `.strike` is already drawn, and `DoorFrame` stays drawn.
- Pins keep working, because they are CSS `position: sticky`.

### A5.4 Tiers and the frame-time guard

`decideTier()` in `src/motion/tier.ts` runs these checks in order; the first match wins:

1. Reduced motion → **C**
2. `saveData` or `prefers-reduced-data` → **C**
3. No WebGL 2 → **C**
4. Software GL (SwiftShader, llvmpipe and similar) → **C**
5. `deviceMemory` below 4 → **C**
6. `hardwareConcurrency` below 4 → **B** at ≥ 1024 px, otherwise **C**
7. Viewport below 1024 px, or a coarse pointer → **B**
8. Otherwise → **A**

`useMotionTier()` returns `"C"` on the server and on the first paint. It re-evaluates only when the reduced-motion preference changes.

| Tier | Gets |
|---|---|
| **A** | Full Core with the hand-written post stage (bloom, vignette, dither), pointer parallax |
| **B** | Half node and edge counts, no post stage, touch drift |
| **C** | Posters only. The environment chunk is never downloaded. A first-class design, not a failure state. |

The guard lives in `CoreScene.ts`:
- **Probe.** It measures the first 90 frames (`PROBE_FRAMES`). If their mean is above 24 ms (`PROBE_LIMIT_MS`), the scene demotes one step (A → B, B → C).
- **Readiness.** The poster may fade only when the shaders have compiled and 3 consecutive frames have run under 20 ms, within 8 s of mount. Otherwise the scene goes to **C**. The crossfade takes 900 ms.
- **Watchdog.** While live, it judges each window of 90 frames. A window is slow if its average is above 40 ms (`WATCH_LIMIT_MS`), or if more than 5% of its frames (`JANK_SHARE`) took over 34 ms (`JANK_MS`). Two consecutive slow windows demote the scene.
- **Pauses.** Frames over 250 ms, or with the tab hidden, count toward neither the probe nor the watchdog.
- **Persistence.** A demotion is stored in `sessionStorage` under `core-tier-demoted`, so it does not repeat on every route.

---

## A6. Page primitives

### A6.1 `PageHero` (`src/app/components/PageHero.tsx`)

This is the Obsidian arrival band every interior page opens on. It is a server component; the only client JavaScript is `Magnetic` on the CTA.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `title` | `string` | required | Renders as `<h1 class="type-display-l text-silver-100">` |
| `eyebrow` | `string` | — | `type-eyebrow text-silver-500` |
| `lead` | `string` | — | `type-body-l text-silver-300 max-w-[58ch]` |
| `cta` | `{ label, href }` | — | Primary button inside `Magnetic` |
| `formation` | `Formation` | `"none"` | The page's own object (§6.3) |
| `size` | `"default" \| "compact"` | `"default"` | `min-h-[80svh]`, or `min-h-[56svh]` for programme pages, case-study detail, `/jobs` and `/internships` |
| `children` | `ReactNode` | — | Page-specific content under the lead, above the CTA |

It renders `section.band-obsidian.on-obsidian` with `data-register="obsidian"` and `data-header-dark`. The H1, not the image, is the LCP candidate, so the still is never `priority`.

### A6.2 `FormationStill`

This component fills its positioned parent with a formation poster. It is `aria-hidden` and `pointer-events-none`.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `formation` | `Exclude<Formation, "none">` | required | |
| `belowHeader` | `boolean` | `true` | Starts at `top-14 lg:top-16`, clear of the bar. `false` fills the whole band (AskBand). |

- It uses a plain `<picture>` with AVIF and WebP sources, not `next/image`, because the desktop still (1920×1080, from 768 px) and the mobile still (780×1688) have different aspect ratios.
- Opacity is `opacity-35` on phones, where the object crosses the copy, and `md:opacity-100` from `md`.
- Paths:
  - Numbered formations: `/three/posters/f{n}-lit-{desktop|mobile}`. Formations 0 and 5 use `-mobile-centred`.
  - `"curve"`: `f0-bend-lit-*`.
  - Shapes: `s-{name}-lit-{desktop|mobile}`.
- No scrim is needed on desktop: the left 45% of every still is black.

### A6.3 The formation map: which page carries which object

`Formation = 0 | 1 | 2 | 3 | 4 | 5 | "curve" | Shape | "none"`. The owner's rule (25 September 2026): each object stays on its page's subject, and no object repeats another section's.

| Route | Formation |
|---|---|
| `/` | The live Core (`Arrival.tsx`); Tier C gets posters |
| `/solutions` | `0`, the sheet the pillars are made from |
| `/solutions/network-infrastructure` · `data-security` · `cloud-services` · `data-centric-solutions` | `1` lattice · `2` enclosure · `3` nebula · `4` plane |
| `/about` | `5`, the mark |
| `/services` | `"curve"`, the inflection point |
| `/services/professional` · `managed` · `support` | `"gear"` · `"radar"` · `"lifebuoy"` |
| `/academy` | `"open-book"` |
| `/academy/for-organizations` | `"tower"` |
| `/academy/[domain]` and its programmes (compact) | Mapped in `src/app/academy/heroFormation.ts`: `ai-intelligent-systems` → `"neural-net"`, `infrastructure-cloud` → `"rack"`, `cybersecurity-compliance` → `"padlock"`, `digital-strategy` → `"pawn"`, otherwise `"open-book"` |
| `/case-study`, `/case-studies/[id]` (compact) | `"checkmark"` |
| `/careers` · `/jobs` (compact) · `/internships` (compact) | `"staircase"` · `"puzzle"` · `"sprout"` |
| `/resources` | `"lightbulb"` |
| `/contact` | `"speech-bubble"` |
| AskBand, on every interior page | `0`, the resting sheet with its ember line |
| 404 | An Obsidian band with no still |

### A6.4 `AskBand` (`src/app/components/AskBand.tsx`)

This is the closing Obsidian band on every interior page, and the last section before the footer. It carries no heading and no photograph: one line, one button.

| Prop | Type | Default |
|---|---|---|
| `variant` | `"default" \| "academy"` | `"default"` |
| `line` | `string` | The approved offer: "Book a 30-minute architecture review. With a Solutions Architect, not a salesperson. No pitch." |
| `label` | `string` | "Book the review" |
| `href` | `string` | `/contact` |

- **Default** adds the friction line "No obligation. One conversation." in `type-eyebrow text-silver-500`, and is labelled `aria-label="Book the review"`.
- **`academy`** carries the page's own enquiry line and target verbatim, drops the friction line, and is labelled "Train your team". It is used on `/academy`, domain, programme and For Organisations pages.

Layout: `py-24 md:py-32`, with `FormationStill formation={0} belowHeader={false}`.

### A6.5 `ServicePage` and `SolutionPage`

These are the shared layouts. The content lives in each page file.

| Template | Props | Sections, in order |
|---|---|---|
| `ServicePage` | `formation, title, lead, overviewHeading, overviewBody, included[], idealFor, cta, image, stepsHeading, steps[{title, description}]` | 1. PageHero. 2. Ivory overview: H2, lead, a "What's Included" hairline list and a primary CTA to `/contact`; beside it, an "Ideal For" telemetry label and a `photo-grade` 4:3 photograph. 3. Obsidian steps: numbered `01`, `02`… in `type-h2 tabular-nums text-silver-500`, as entries. 4. AskBand. |
| `SolutionPage` | `slug, formation, title, lead, overviewHeading, overviewBody, overviewImage, imageSide ("left"\|"right"), capabilities[], cta, benefitsHeading, benefitsLead, benefits[{title, description}]` | 1. PageHero. 2. Ivory overview with the capability hairline list, CTA and photograph. `imageSide` follows CLAUDE.md: Network and Cloud put the image right, Security and Data-centric put it left. 3. Obsidian benefits as three entries. 4. `SolutionPartners`. 5. `RelatedTraining`. 6. AskBand. |

Capability lists carry no ticks. Steps keep their numbers because they are a sequence.

### A6.6 Hairline entries and `entryGrid`

Entries replace cards everywhere. Reference implementations: `Receipt.tsx`, `SideDoors.tsx`, `ServicePage`, `SolutionPage`.

| Pattern | Ivory | Obsidian |
|---|---|---|
| List | `<ul class="border-t border-neutral-200">`, with each item `type-body border-b border-neutral-200 py-4 text-neutral-900` | — |
| Entry | `border-t border-neutral-200 pt-8` | `border-t border-white/15 pt-8` |
| Anatomy | Optional telemetry or large tabular figure, then a `type-h3` title, then `type-body` text | Same, in silver |
| Whole entry as link | The title's `<Link>` stretches with `after:absolute after:inset-0 after:content-['']` on a `group relative` entry. The title takes the focus ring. It underlines on hover (`underline-offset-[6px]`), and a Lucide `ArrowUpRight` moves `-translate-y-1 translate-x-1` at the `ui` token. | Same |

`entryGrid(count)` (`src/app/components/entryGrid.ts`) sizes a grid to a short list, so one or two entries never sit in a mostly empty three-column row. Use it as `` `grid gap-x-12 gap-y-16 ${entryGrid(n)}` ``.

| Count | Returns |
|---|---|
| 3 or more | `"sm:grid-cols-2 lg:grid-cols-3"` |
| 2 | `"sm:grid-cols-2 lg:max-w-3xl"` |
| 1 | `"max-w-sm"` |

### A6.7 `DoorFrame` (`components/home/DoorFrame.tsx`)

This is a hairline frame that draws itself open for links used as surfaces (the side doors). It takes `children` only.

Drawing order:
1. The centre divider draws out from its middle over `reveal`.
2. The top and bottom `neutral-200` hairlines extend outward, delayed by `ui`.
3. The content lifts 12 px and fades in, delayed by `reveal`.

The whole gesture stays inside 1 s. The frame collapses only if it is below the fold at mount (IntersectionObserver threshold 0.35). Under reduced motion it stays drawn.

Surfaces inside the frame warm on hover and focus (`hover:bg-[#F4F5F7]` at `ui`), with no shadow and no border.

### A6.8 `ExitLink` (`components/home/ExitLink.tsx`)

This is the one way out of a section: a `type-eyebrow` link with a Lucide `ArrowRight` (`h-3.5 w-3.5`, `strokeWidth={1.75}`) that shifts `translate-x-1` on hover at `micro`.

Props: `href`, `children: string`, `className` (sets the colour, for example `text-silver-100`). A section carries one exit, never two. The four pillar rows are the documented exception. Draw the arrow as the icon, never the `→` glyph.

---

## A7. Motion primitives (`src/motion/`)

| Primitive | Props | Behaviour | Use for |
|---|---|---|---|
| `Reveal` | `children`, `delay` (ms, capped at 600), `as` (`div`, `section`, `article`, `span`, `p`, `li`, `h1`–`h4`), `className` | CSS-driven (`.motion-reveal` → `.motion-reveal-in`): fades and lifts 16 px over `reveal` with ease-out, once. One IntersectionObserver is shared by every instance (threshold 0.2). Content is visible in the server HTML, and only elements below 90% of the viewport at mount are hidden, so above-the-fold copy never waits for JavaScript. | Body, eyebrows, blocks, single headings |
| `SplitLines` | `children`, `as` (`h1`, `h2` (default), `h3`, `p`, `div`), `className`, `delay` | Waits for `document.fonts.ready`, then uses GSAP SplitText to split the heading into masked lines. Each line rises from `yPercent: 110` with an opacity fade over `reveal`, `expo.out`, staggered at 60 ms, starting at `"top 80%"`, once. Until then, or without the motion chunk, it behaves as a `Reveal`. | Display and H2 headings |
| `Counter` | `value`, `prefix`, `suffix`, `duration` (default `scene`, 900 ms), `decimals`, `className` | Uses requestAnimationFrame rather than GSAP, with expo-out, tabular numerals, starting at 40% visibility, once. | Proof figures |
| `Magnetic` | `children`, `strength` (capped at 6 px), `className` | Moves the button up to 6 px toward the pointer and returns at `ui` with ease-out, using transform only. It is off on coarse pointers and under reduced motion. | **Primary CTAs only.** Not form submits. |
| `Thread` | `tone` (`"ember"` on Obsidian (default), `"red"` on Ivory), `x` (`left`, `center`, `right`), `height` (48), `className` | A 1 px hairline that draws downward (`scaleY`) over `reveal` at 90% visibility. `aria-hidden`. Sits in a 48 px `.thread-slot`. The home spine may place it with `--thread-x`, so it drops from the Core. | The carry between home beats |
| `LenisProvider` | — | Mounted once in `MarketingChrome`. Starts after the motion chunk loads, with `lerp: 0.09`, `wheelMultiplier: 1` and `syncTouch: false`, and bridges to ScrollTrigger. In-page `#` anchors go through `lenis.scrollTo` (offset −80). There is no `scroll-behavior: smooth`. | — |
| `useMotionTier` / `tier.ts` | — | See §5.4 | Gate anything heavier than a poster |

Other CSS motion classes:
- `.strike` with `[data-struck]`: the ledger strike-through, drawn over `reveal`.
- `.motion-scroll-cue`: the hero scroll cue.

---

## A8. Buttons, forms, focus, photography

### A8.1 Buttons

| Button | Class (verbatim) | Where |
|---|---|---|
| **Primary** | `inline-flex h-14 items-center rounded-[6px] bg-primary-500 px-8 font-semibold text-white transition-colors duration-[var(--motion-duration-micro)] hover:bg-primary-600`. Submits add `disabled:opacity-50`. | Either register. Wrap the page's primary CTA in `<Magnetic>`. |
| **Outline** (secondary on Ivory) | `inline-flex h-14 items-center rounded-[6px] border border-neutral-300 px-8 font-semibold text-neutral-900 transition-colors duration-[var(--motion-duration-micro)] hover:bg-neutral-50` | Ivory, beside a primary (`/services`, `/careers`, `/jobs`) |
| **Secondary on Obsidian** | `btn-secondary-obsidian text-silver-100`. The class sets `height: 3.5rem`, `padding-inline: 2rem`, `1px solid rgb(255 255 255 / 0.2)`, `6px` radius, and a `rgb(255 255 255 / 0.08)` hover fill at `micro`. | Obsidian, beside a primary (`/careers`, `/jobs`) |
| **Tertiary** | `ExitLink` (§6.8) | Either |

Buttons have one primary per view, no icon-only red circles, no scale and no shadow.

### A8.2 Forms

Forms live on Ivory. The pattern below is shared by `careers/ApplicationForm.tsx`, `academy/for-organizations/TrainingEnquiryForm.tsx` and `contact/ContactForm.tsx`.

| Part | Spec |
|---|---|
| Field | `w-full rounded-[6px] border border-neutral-300 bg-white px-4 py-3 type-body text-neutral-900 transition-colors duration-[var(--motion-duration-micro)] placeholder:text-neutral-400 hover:border-neutral-500`, placed `mt-3` under its label. The same class serves `select` and `textarea` (`resize-y`). |
| File field | The field class plus `file:mr-4 file:cursor-pointer file:rounded-[6px] file:border-0 file:bg-neutral-900 file:px-4 file:py-2 file:font-semibold file:text-white` |
| Label | `type-telemetry block text-neutral-500`, above the field, with `htmlFor` set. Optional fields say "(optional)" in the label. |
| Checkbox | `h-4 w-4 rounded-[2px] border-neutral-300 accent-primary-500` |
| Helper text | `type-body mt-2 text-neutral-500`, linked with `aria-describedby` |
| Layout | Form `space-y-6`; field grid `grid grid-cols-1 gap-6 md:grid-cols-2` |
| Honeypot | `<input type="text" name="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-px w-px opacity-0">`. If it is filled, the API pretends success and drops the submission. |
| Turnstile | Only when `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is set. The script is `https://challenges.cloudflare.com/turnstile/v0/api.js` via `next/script` `afterInteractive`, with a `<div class="cf-turnstile" data-sitekey>` in place. The token is checked before sending, and the widget is `turnstile.reset()` after every send and failure. |
| Status line | `<p role="status" aria-live="polite" class="type-body max-w-[60ch]">`. Success is `text-neutral-900`, error is `text-primary-600`. Copy says plainly what happened. A failure says "Nothing was sent" and gives an email fallback. |
| Submit | The primary button, disabled while sending, with the label "Sending…". Not wrapped in Magnetic. |

The admin area (`src/app/admin/`) keeps its own dark form set and is outside this system.

### A8.3 Focus rings

```css
:focus-visible { outline: 2px solid #BD2E25; outline-offset: 2px; }             /* Ivory */
.on-obsidian :focus-visible, .on-obsidian:focus-visible { outline-color: #E6E7EA; } /* Obsidian */
```

Every dark surface carries `.on-obsidian`, or the red ring disappears on it. Never remove an outline without an equal replacement. The skip link ("Skip to main content", in `layout.tsx`) is the first focusable element.

### A8.4 Photography

- **`.photo-grade`** is `filter: grayscale(0.4) saturate(0.85) contrast(1.04) brightness(0.96)`. Put it on every photograph and never on logos, posters or icons.
- Photographs live in the reading room, for example `relative aspect-[4/3] overflow-hidden` holding a `next/image` `fill` with `photo-grade object-cover`, and `alt=""` when decorative.
- No hero photography, holograms, circuits or glowing globes. Heroes carry objects (§6.3).
- No colour overlays or washes on photographs.

---

## A9. Iconography

- **Lucide React only.** No other icon library.
- In use: `ArrowRight` (ExitLink, `strokeWidth 1.75`), `ArrowUpRight` (entry links, `strokeWidth 1.5`, `h-6 w-6`), `Menu`, `X`, `ChevronDown` (header), and `Instagram`, `Facebook`, `Twitter`, `Linkedin` (footer, `h-5 w-5`, `strokeWidth 1.5`, `silver-500` → `silver-100`).
- The header's social icons are PNGs in `/icons/`. They are header-owned, so leave them.
- Icons inherit their text colour. No red icon tiles, badges or ticks.
- Decorative icons are `aria-hidden`. Icon-only links carry an `aria-label`.

---

## A10. Performance budgets

These are enforced by `scripts/perf-gate.mjs`, which reads `scripts/budgets.json` (from PERFORMANCE_PLAN.md §2.2 and §9.1, approved 22 September 2026). Run `npm run perf`, or `npm run perf -- --bundles` for budgets only.

| Budget | Limit | Loads |
|---|---|---|
| Route shell JS | **205 KB** gz (209,920 B) | Immediately |
| Motion chunk (GSAP, ScrollTrigger, SplitText, Lenis) | **60 KB** gz (61,440 B) | After LCP, every tier except reduced motion |
| Environment chunk (three, the Core, shaders, post stage, worker) | **190 KB** gz (194,560 B) | After the motion chunk, home page only, Tier A and B only |
| Preloaded fonts | 48 KB (49,152 B) | With the page |
| Any served raster image | 250 KB (256,000 B) | — |
| `public/` total | 15 MB (15,728,640 B) | — |
| Posters (enforced by `capture-posters.mjs`) | Desktop ≤ 160 KB WebP and ≤ 110 KB AVIF; mobile ≤ 90 KB WebP and ≤ 65 KB AVIF | — |

**Lab thresholds** (Lighthouse, mobile emulation):
- Server response 600 ms
- FCP 1.8 s
- **LCP 2.5 s**
- **CLS 0.02**
- **TBT 200 ms**
- Speed Index 3.0 s

They are checked on `/`, `/solutions`, `/solutions/network-infrastructure`, `/academy`, `/contact`, `/solutions/data-security`, `/services`, `/academy/ai-intelligent-systems`, `/case-study` and `/about`.

No interior page loads the environment chunk.

Other gates:
- `npm test` covers the token sync and the tier decision.
- `npm run goldens` runs the visual goldens.
- `npm run a11y` runs the axe audit.

---

## A11. Where to extend

### A11.1 A new interior page

1. **`PageHero`** with the page's own on-topic object: `formation={…}`, a `type-display-l` title (automatic), an optional eyebrow, lead and one CTA. Use `size="compact"` for detail pages. If no existing object fits, make one (§11.2). Never borrow another section's.
2. **Ivory sections** (`band-ivory w-full py-24 md:py-32` with the standard container). Write the H2 through `Reveal` or `SplitLines`, then the lead, then **hairline entries or lists**, never cards. Use `entryGrid()` for short lists and `photo-grade` on any photograph. An Obsidian content band in between is allowed (`band-obsidian on-obsidian` with `data-register="obsidian" data-header-dark=""`).
3. **`AskBand`** last. Use `variant="academy"` on Academy pages.
4. Check the page against these rules:
   - one primary CTA per view, in `Magnetic`
   - no navy
   - no red outside actions
   - no pure white on Obsidian
   - no accent bars and no card-in-card
   - only token durations
   - Lucide only
5. Run `npm run perf`, `npm run a11y` and `npm run goldens`.
6. Add the route to `budgets.json` if it is a new top-level page.

### A11.2 A new hero object

1. Add a builder to `src/three/core/worker/shapes.ts` and register it in the `SHAPES` map. Build it about the origin, roughly 2.5 units tall, and `place()` it where the mark sits (0.45 right of centre), so one camera frames every shape. It must be a map of the Inflection sheet, as the existing shapes are: parametric parts or hex-filled regions. Shapes are capture-only and never reach the live Core.
2. Add the name to the `Shape` union in `PageHero.tsx`.
3. Capture the lit stills into slot 5 with `--shape`, desktop and mobile in separate runs, because `--cam` applies to a whole run:
   ```
   NEXT_PUBLIC_CORE_CAPTURE=1 npx next build
   node scripts/capture-posters.mjs --formations 5 --shape <name> --lights lit --sizes desktop --cam -1.72,1.88,8.4,-1.3,-0.15,0
   node scripts/capture-posters.mjs --formations 5 --shape <name> --lights lit --sizes mobile  --cam 0.45,1.6,12.5,0.45,-0.2,0
   ```
   This writes `public/three/posters/s-<name>-lit-{desktop,mobile}.{webp,avif}` within the poster budgets. Use `--port 3000` against a running server instead of building.
4. Use it: `<PageHero formation="<name>" … />`. For an Academy domain, add it to `heroFormation.ts`.
5. Review the still at 390, 768, 1280 and 1920 px. The object must stay right of the copy on desktop and read at 35% opacity on phones.

---
---

# Part B — Design System v2.0 (February 2026, kept for history)

> Superseded by Part A wherever the two conflict. Kept unchanged apart from the "(superseded by Part A §n)" markers on conflicting headings.


# Inflexions I.T. Services — Design System v2.0

**Version:** 2.0.0
**Last Updated:** 2026-02-22
**Brand Archetype:** The Expert — Authoritative, Precise, Trustworthy
**Design Philosophy:** Corporate-professional with restrained warmth. Clean geometry, generous whitespace, deliberate motion. Technology-forward without being cold.

---

## 0. Design Principles

Five principles that govern every design decision. When in conflict, the higher-numbered principle yields to the lower.

| # | Principle | What It Means | Anti-Pattern |
|---|-----------|---------------|--------------|
| 1 | **Clarity over cleverness** | Every element must communicate its purpose instantly. Remove decoration that doesn't aid comprehension. | Gratuitous animation, cryptic icons, aesthetic-only flourishes |
| 2 | **Consistency is trust** | Identical patterns for identical functions. A user who learns one card learns them all. | One-off components, page-specific colors, inconsistent CTAs |
| 3 | **Accessible by default** | WCAG AA is the floor, not the ceiling. Keyboard-first, screen-reader-tested, motion-safe. | Color-only indicators, unlabelled icons, trapped focus |
| 4 | **Content-first hierarchy** | Typography and spacing do the heavy lifting. If the design works in grayscale, color is a bonus. | Over-reliance on color to create hierarchy |
| 5 | **Progressive disclosure** | Show what's needed now. Reveal complexity on demand. | Information overload, exposing admin-level detail to visitors |

---

## 1. Color System

### 1.1 Three-Tier Token Architecture (superseded by Part A §2)

Colors are organized in three layers. Designers and developers should **only use Semantic or Component tokens** — never raw Global values directly in markup.

```
┌─────────────────────────────────────────────────┐
│  GLOBAL (Raw Palette)                           │
│  red-500: #BD2E25                               │
│  ↓                                              │
│  SEMANTIC (Intent-Based Aliases)                │
│  color-action-primary: {red-500}                │
│  ↓                                              │
│  COMPONENT (Scoped)                             │
│  button-primary-bg: {color-action-primary}      │
└─────────────────────────────────────────────────┘
```

Changing the brand from red to blue = **one alias edit**, not a find-and-replace across 30 components.

### 1.2 Global Palette — Primary (Red)

| Token | Hex | RGB | Contrast on White |
|-------|-----|-----|-------------------|
| `red-50` | `#FDE8E7` | 253, 232, 231 | — (bg only) |
| `red-100` | `#F9C4C1` | 249, 196, 193 | — (bg only) |
| `red-200` | `#F4A8A4` | 244, 168, 164 | 2.3:1 |
| `red-300` | `#E87A73` | 232, 122, 115 | 3.1:1 |
| `red-400` | `#D5524A` | 213, 82, 74 | 4.2:1 |
| `red-500` | `#BD2E25` | 189, 46, 37 | **5.04:1** AA ✓ |
| `red-600` | `#A02923` | 160, 41, 35 | 6.5:1 |
| `red-700` | `#8A2019` | 138, 32, 25 | 8.3:1 |
| `red-800` | `#6E1812` | 110, 24, 18 | 10.8:1 |
| `red-900` | `#52110D` | 82, 17, 13 | 13.6:1 |

### 1.3 Global Palette — Navy (Consolidated from 5 → 3) (superseded by Part A §2)

Previously: `#16213E`, `#1B3764`, `#1D3C6D`, `#1E3161`, `#265982` — five near-identical values creating drift. **Consolidated:**

| Token | Hex | RGB | Replaces | Usage |
|-------|-----|-----|----------|-------|
| `navy-900` | `#16213E` | 22, 33, 62 | `#16213E` | Primary headings (hero, section titles) |
| `navy-700` | `#1B3764` | 27, 55, 100 | `#1B3764`, `#1D3C6D`, `#1E3161` | Subheadings, card titles, badge text |
| `navy-500` | `#265982` | 38, 89, 130 | `#265982` | Accent headings, solution labels |

**Migration:** All instances of `#1D3C6D` and `#1E3161` in the codebase should be replaced with `#1B3764` (`navy-700`).

### 1.4 Global Palette — Neutral

| Token | Hex | RGB | Contrast on White | Usage |
|-------|-----|-----|-------------------|-------|
| `neutral-950` | `#000000` | 0, 0, 0 | 21:1 | Maximum contrast (rare) |
| `neutral-900` | `#171A20` | 23, 26, 32 | 17.4:1 | Primary body text |
| `neutral-800` | `#262626` | 38, 38, 38 | 14.7:1 | Emphasized body text |
| `neutral-700` | `#333333` | 51, 51, 51 | 12.6:1 | Secondary body text |
| `neutral-600` | `#41444B` | 65, 68, 75 | 8.2:1 | Paragraph text |
| `neutral-500` | `#5C6280` | 92, 98, 128 | **5.5:1** AA ✓ | Muted body text, descriptions |
| `neutral-400` | `#8C8C8C` | 140, 140, 140 | 3.5:1 | Placeholder text (large only) |
| `neutral-300` | `#A6A6A6` | 166, 166, 166 | 2.7:1 | Disabled text |
| `neutral-200` | `#D0D0D0` | 208, 208, 208 | — | Borders, dividers |
| `neutral-100` | `#E6E6E6` | 230, 230, 230 | — | Subtle borders |
| `neutral-50` | `#F2F2F2` | 242, 242, 242 | — | Alternate bg |

> **Breaking change (P0):** `neutral-500` changed from `#666C89` (4.6:1 — marginal AA) to `#5C6280` (5.5:1 — safe AA). This eliminates the contrast risk on the site's most-used body text color.

### 1.5 Global Palette — Surface (superseded by Part A §2)

| Token | Hex | Usage |
|-------|-----|-------|
| `surface-white` | `#FFFFFF` | Primary background |
| `surface-light` | `#F4F4F4` | Section alternate bg (standardized) |
| `surface-muted` | `#F6F6F6` | Card backgrounds |
| `surface-dark` | `#2A2A2A` | Dark sections |
| `surface-overlay-light` | `rgba(0,0,0,0.30)` | Home hero overlay |
| `surface-overlay-medium` | `rgba(0,0,0,0.40)` | Join Us CTA overlay |
| `surface-overlay-dark` | `rgba(0,0,0,0.50)` | Inner page hero overlays |

> **Note:** `#F4F4F4` and `#F6F6F6` were used interchangeably. Now formalized: `surface-light` for full-width section backgrounds, `surface-muted` for card/component backgrounds.

### 1.6 Global Palette — Semantic (Improved)

Each semantic color now ships with **background**, **text**, and **border** variants for proper alert/banner/form-error styling:

| Intent | Background | Text | Border | Icon |
|--------|-----------|------|--------|------|
| **Success** | `#E8F5E9` | `#2E7D32` | `#4CAF50` | `#4CAF50` |
| **Warning** | `#FFF3E0` | `#E65100` | `#FB8C00` | `#FB8C00` |
| **Error** | `#FFEBEE` | `#C62828` | `#D0281F` | `#D0281F` |
| **Info** | `#E3F2FD` | `#1565C0` | `#42A5F5` | `#42A5F5` |

### 1.7 Semantic Aliases (superseded by Part A §2)

These are the tokens designers and developers should reference. They decouple **intent** from **value**:

```
/* ─── Text ─── */
--color-heading:          var(--navy-900)        /* #16213E */
--color-subheading:       var(--navy-700)        /* #1B3764 */
--color-body:             var(--neutral-600)     /* #41444B */
--color-body-muted:       var(--neutral-500)     /* #5C6280 */
--color-body-inverse:     var(--surface-white)   /* #FFFFFF */

/* ─── Actions ─── */
--color-action-primary:       var(--red-500)     /* #BD2E25 */
--color-action-primary-hover: var(--red-600)     /* #A02923 */
--color-action-primary-active:var(--red-700)     /* #8A2019 */
--color-action-secondary:     var(--neutral-950) /* #000000 */

/* ─── Links ─── */
--color-link:             var(--red-500)         /* #BD2E25 */
--color-link-hover:       var(--red-600)         /* #A02923 */
--color-link-visited:     var(--red-700)         /* #8A2019 */

/* ─── Borders ─── */
--color-border-default:   var(--neutral-200)     /* #D0D0D0 */
--color-border-subtle:    var(--neutral-100)     /* #E6E6E6 */
--color-border-strong:    var(--neutral-700)     /* #333333 */
--color-border-accent:    var(--red-500)         /* #BD2E25 */

/* ─── Backgrounds ─── */
--color-bg-primary:       var(--surface-white)   /* #FFFFFF */
--color-bg-secondary:     var(--surface-light)   /* #F4F4F4 */
--color-bg-tertiary:      var(--surface-muted)   /* #F6F6F6 */
--color-bg-inverse:       var(--surface-dark)    /* #2A2A2A */
--color-bg-brand:         var(--red-500)         /* #BD2E25 */

/* ─── Focus ─── */
--color-focus-ring:       var(--red-500)         /* #BD2E25 */
```

### 1.8 Dark Mode Palette (superseded by Part A §1 and §2)

| Semantic Token | Light Value | Dark Value |
|----------------|------------|------------|
| `--color-bg-primary` | `#FFFFFF` | `#111827` |
| `--color-bg-secondary` | `#F4F4F4` | `#1F2937` |
| `--color-bg-tertiary` | `#F6F6F6` | `#1F2937` |
| `--color-bg-inverse` | `#2A2A2A` | `#0F172A` |
| `--color-heading` | `#16213E` | `#E5E7EB` |
| `--color-body` | `#41444B` | `#D1D5DB` |
| `--color-body-muted` | `#5C6280` | `#9CA3AF` |
| `--color-action-primary` | `#BD2E25` | `#E04A42` |
| `--color-border-default` | `#D0D0D0` | `#374151` |

---

## 2. Typography

### 2.1 Font Families (superseded by Part A §3)

| Token | Family | Weights | Usage |
|-------|--------|---------|-------|
| `font-sans` / `font-rubik` | Rubik | 400, 500, 700, 800 | Primary — headings & body |
| `font-krub` | Krub | 400, 500, 600 | Secondary — accents, labels, badges |
| `font-system` | system-ui, sans-serif | — | Fallback stack |

### 2.2 Composite Text Styles (9 Levels) (superseded by Part A §3)

Each style is a **composite token** — size, weight, line-height, and tracking shipped as one unit. Developers apply the full style, never mix-and-match individual properties.

Built on a **1.250 Major Third** modular scale, base 16px. Line-heights adjusted to snap to **4px sub-grid** for vertical rhythm.

| Style | Size | Weight | Line Height | Computed LH | Tracking | Tailwind |
|-------|------|--------|-------------|-------------|----------|----------|
| **Display** | 48px | 700 (Bold) | 1.167 | 56px (÷4 ✓) | -0.5px | `text-5xl font-bold tracking-tight` |
| **H1** | 36px | 700 (Bold) | 1.222 | 44px (÷4 ✓) | -0.25px | `text-4xl font-bold` |
| **H2** | 32px | 600 (Semi) | 1.25 | 40px (÷4 ✓) | 0 | `text-[32px] font-semibold leading-[40px]` |
| **H3** | 24px | 600 (Semi) | 1.333 | 32px (÷4 ✓) | 0 | `text-2xl font-semibold leading-8` |
| **H4** | 20px | 600 (Semi) | 1.4 | 28px (÷4 ✓) | 0 | `text-xl font-semibold` |
| **Body LG** | 18px | 400 (Regular) | 1.556 | 28px (÷4 ✓) | 0 | `text-lg leading-7` |
| **Body** | 16px | 400 (Regular) | 1.5 | 24px (÷4 ✓) | 0 | `text-base leading-6` |
| **Body SM** | 14px | 400 (Regular) | 1.429 | 20px (÷4 ✓) | 0 | `text-sm leading-5` |
| **Caption** | 12px | 400 (Regular) | 1.333 | 16px (÷4 ✓) | +0.25px | `text-xs leading-4 tracking-wide` |

> **Breaking changes from v1.0:**
> - H1 weight: 400 → **700** (headings should assert hierarchy)
> - H2 weight: 400 → **600**
> - H3 size: 25px → **24px** (snaps to 4px grid)
> - Line-heights recalculated so every computed value divides by 4
> - Letter-spacing added at Display (-0.5px) and Caption (+0.25px)

### 2.3 Responsive Typography (superseded by Part A §3)

| Style | Mobile (<768px) | Tablet (768px+) | Desktop (1024px+) |
|-------|-----------------|-----------------|-------------------|
| Display | 28px / 36px LH | 40px / 48px LH | 48px / 56px LH |
| H1 | 24px / 32px LH | 30px / 36px LH | 36px / 44px LH |
| H2 | 22px / 28px LH | 28px / 36px LH | 32px / 40px LH |
| H3 | 20px / 28px LH | 22px / 28px LH | 24px / 32px LH |
| H4 | 18px / 24px LH | 20px / 28px LH | 20px / 28px LH |
| Body LG | 16px / 24px LH | 18px / 28px LH | 18px / 28px LH |
| Body | 15px / 24px LH | 16px / 24px LH | 16px / 24px LH |
| Body SM | 13px / 20px LH | 14px / 20px LH | 14px / 20px LH |

### 2.4 Text Color Pairing Rules (superseded by Part A §2 and §3)

| Context | Color Token | Never Use |
|---------|-------------|-----------|
| Page headings, hero titles | `--color-heading` (navy-900) | Raw hex values |
| Section subheadings | `--color-subheading` (navy-700) | Mixed navy shades |
| Primary body copy | `--color-body` (neutral-600) | neutral-500 for body |
| Secondary/muted copy | `--color-body-muted` (neutral-500) | neutral-400 (fails AA) |
| Text on dark backgrounds | `--color-body-inverse` (white) | Gray on dark bg |
| Text on brand (red) bg | `#FFFFFF` | Any non-white color |

---

## 3. Spacing System (8px Grid)

### 3.1 Base Scale

| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| `space-0` | 0px | `0` | Reset |
| `space-1` | 4px | `1` | Tight inline spacing, icon gaps |
| `space-2` | 8px | `2` | Icon-text gaps, tight padding |
| `space-3` | 12px | `3` | Form input padding |
| `space-4` | 16px | `4` | Standard element padding |
| `space-5` | 20px | `5` | Small component gaps |
| `space-6` | 24px | `6` | Card padding, section gaps |
| `space-8` | 32px | `8` | Component gaps, grid gutters |
| `space-10` | 40px | `10` | Section vertical padding (mobile) |
| `space-12` | 48px | `12` | Section vertical padding (standard) |
| `space-16` | 64px | `16` | Section vertical padding (large) |
| `space-20` | 80px | `20` | Major section divisions |
| `space-24` | 96px | `24` | Page-level top/bottom margins |

### 3.2 Container System

| Token | Value | Usage |
|-------|-------|-------|
| `container-max` | 80rem (1280px) | `max-w-7xl` — Primary content max-width |
| `container-px-sm` | 16px | `px-4` — Mobile horizontal padding |
| `container-px-md` | 24px | `sm:px-6` — Tablet horizontal padding |
| `container-px-lg` | 32px | `lg:px-8` — Desktop horizontal padding |

**Standard container class:** `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`

### 3.3 Section Spacing (superseded by Part A §4)

| Context | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Between major sections | 40px (`py-10`) | 48px (`py-12`) | 64px (`py-16`) |
| Section inner padding | 16px (`py-4`) | 40px (`py-10`) | 80px (`py-20`) |
| Component gaps (grid) | 16px (`gap-4`) | 24px (`gap-6`) | 32px (`gap-8`) |
| Card internal padding | 16px (`p-4`) | 24px (`p-6`) | 32px (`p-8`) |

### 3.4 Density Modes

Three density configurations for different contexts. Default is **Comfortable** for marketing pages:

| Mode | Card Padding | Row Height | Grid Gap | Usage |
|------|-------------|------------|----------|-------|
| **Spacious** | 48px | 72px | 32px | Landing pages, premium sections |
| **Comfortable** (default) | 32px | 56px | 24px | Marketing pages, content sections |
| **Compact** | 16px | 40px | 16px | Admin dashboards, data tables, job listings |

---

## 4. Iconography

### 4.1 Icon Library

**Standard:** Lucide React (already dominant in codebase — 15+ icons used).

> **Action item:** Remove `react-icons/fi` dependency. Replace `FiMail`, `FiPhone`, `FiClock` in [contact/page.tsx](src/app/contact/page.tsx) with Lucide equivalents (`Mail`, `Phone`, `Clock`).

### 4.2 Current Icon Inventory (superseded by Part A §9)

| Icon | Import | Used In |
|------|--------|---------|
| `Search` | lucide-react | Careers search |
| `ArrowRight` | lucide-react | Case study details, CTAs |
| `ArrowUpRight` | lucide-react | Case study hover overlays |
| `Play` | lucide-react | Video thumbnail |
| `ChevronRight` | lucide-react | FAQ accordion |
| `ChevronDown` | lucide-react | Navigation dropdowns |
| `Quote` | lucide-react | Testimonials |
| `Phone` | lucide-react | Footer, Contact |
| `Mail` | lucide-react | Footer, Contact |
| `MapPin` | lucide-react | Footer |
| `Clock` | lucide-react | Contact |
| `Check` | lucide-react | Feature badges |
| `Menu` / `X` | lucide-react | Mobile nav toggle |

### 4.3 Icon Sizing Scale

| Token | Size | Stroke | Usage |
|-------|------|--------|-------|
| `icon-xs` | 14px | 1.5px | Inline with Caption text |
| `icon-sm` | 16px | 1.5px | Inline with Body SM text |
| `icon-md` | 20px | 2px | Default — inline with Body text |
| `icon-lg` | 24px | 2px | Standalone, nav icons |
| `icon-xl` | 32px | 2px | Feature icons, hero elements |
| `icon-2xl` | 48px | 2px | Play button overlays |

### 4.4 Icon Rules (superseded by Part A §9)

- **Color:** Inherit parent `text-color` by default. Use `red-500` for interactive/accent.
- **Icon + text pairing:** 8px gap (`gap-2`), vertically centered (`items-center`)
- **Icon-only buttons:** Minimum 44x44px touch target. **Must** have `aria-label`.
- **Decorative icons:** Add `aria-hidden="true"` (Lucide does this by default).
- **Loading state:** Use `animate-spin` on `Loader2` icon from Lucide.

---

## 5. Component Specifications

### 5.1 Status Labels

Every component carries a maturity label:

| Label | Meaning |
|-------|---------|
| **Stable** | Production-ready, fully specified |
| **Beta** | Functional but may change |
| **Planned** | Not yet built, spec only |
| **Deprecated** | Scheduled for removal |

---

### 5.2 Navigation

#### Component 01: Navbar `Stable` (superseded by Part A §1)
- **Height:** 60px
- **Background:** white / `bg-white`
- **Shadow:** none (clean edge)
- **Container:** `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- **Logo:** 168x42px
- **Nav links:** Body (16px), weight 400, color `--color-body`
- **States:**
  - Default: `text-neutral-800`
  - Hover: `text-red-500`
  - Active/Current: `text-red-500 font-medium`
  - Focus: `ring-2 ring-red-500 ring-offset-2 rounded`
- **Dropdown:** `bg-white shadow-lg rounded-md`, 150ms ease-in-out
- **Contact CTA:** `h-16 bg-red-500 text-white px-6`
- **Mobile breakpoint:** 1024px — hamburger icon triggers slide-down
- **Keyboard:** Tab through links, Enter/Space opens dropdowns, Escape closes them
- **ARIA:** `role="navigation"`, `aria-label="Main navigation"`, `aria-expanded` on dropdown triggers

#### Component 02: Mobile Menu `Stable` (superseded by Part A §1)
- **Trigger:** Menu icon (24px), swaps to X icon when open
- **Panel:** Full-width dropdown, `bg-white shadow-lg`
- **Links:** `py-3 px-4 text-base`, stacked vertically
- **Animation:** Height transition, 200ms ease
- **Focus trap:** Focus stays within menu while open
- **Keyboard:** Escape to close, Tab through items, focus returns to trigger on close
- **ARIA:** `aria-expanded`, `aria-controls`, menu panel has `role="menu"`

#### Component 03: Breadcrumb `Planned`
- **Separator:** `ChevronRight` icon, 14px, `neutral-400`
- **Links:** Body SM, `--color-link`
- **Current page:** Body SM, `--color-body-muted`, no link
- **Keyboard:** Standard link navigation
- **ARIA:** `nav` with `aria-label="Breadcrumb"`, current item has `aria-current="page"`
- **Use on:** Case study detail, blog detail (future), any page 2+ levels deep

---

### 5.3 Heroes & Banners (superseded by Part A §6)

#### Component 04: Home Hero Banner `Stable` (superseded by Part A §6)
- **Height:** 300px (mobile) / 500px (md+)
- **Image:** Full-bleed, `object-cover`
- **Overlay:** `surface-overlay-light` (`bg-black/30`)
- **Content position:** Bottom-left, `bottom-10 md:bottom-28`
- **Title:** Display style, `--color-body-inverse`
- **Subtitle:** Body SM, `white/90` opacity
- **CTA:** Primary Button (Component 07)

#### Component 05: Inner Page Hero `Stable` (superseded by Part A §6)
- **Height:** 300px (mobile) / 500px (md+)
- **Overlay:** `surface-overlay-dark` (`bg-black/50`)
- **Title:** Display style, `--color-body-inverse`
- **Content:** Centered vertically, left-aligned within container

#### Component 06: Call-to-Action Banner `Stable` (superseded by Part A §6)
- **Height:** 300-440px responsive
- **Image:** Full-bleed, `object-cover`
- **Overlay:** `surface-overlay-medium` (`bg-black/40`)
- **Content:** Centered, stacked vertically
- **Title:** H1 style, `--color-body-inverse`
- **Buttons:** Ghost (border) + Primary, stacked on mobile, inline on desktop

---

### 5.4 Buttons (superseded by Part A §8)

#### Component 07: Primary Button `Stable` (superseded by Part A §8)
- **Min width:** 120px
- **Height:** 48-56px (padding-based)
- **Background:** `--color-action-primary`
- **Text:** White, `font-semibold` (600), 16px
- **Border-radius:** 6px
- **Padding:** `py-3 px-8`
- **States:**
  | State | Background | Text | Border | Other |
  |-------|-----------|------|--------|-------|
  | Default | `red-500` | white | none | — |
  | Hover | `red-600` | white | none | — |
  | Active | `red-700` | white | none | `scale(0.98)` |
  | Focus | `red-500` | white | none | `ring-2 ring-red-500 ring-offset-2` |
  | Disabled | `red-500` | white | none | `opacity-50 cursor-not-allowed` |
  | Loading | `red-500` | hidden | none | Spinner icon centered, `cursor-wait` |
- **Variants:**
  - Icon Left: 8px gap before text, icon 20px
  - Icon Right: 8px gap after text, icon 20px
  - Full Width: `w-full` on mobile forms
- **Keyboard:** Enter/Space to activate
- **ARIA:** `aria-disabled="true"` when disabled, `aria-busy="true"` when loading

#### Component 08: Secondary Button (Outline) `Stable` (superseded by Part A §8)
- **Border:** `2px solid --color-action-secondary`
- **Text:** `--color-action-secondary`, `font-medium`
- **Border-radius:** 6px
- **States:**
  | State | Background | Text | Border |
  |-------|-----------|------|--------|
  | Default | transparent | black | `2px solid black` |
  | Hover | black | white | `2px solid black` |
  | Active | `neutral-800` | white | `2px solid neutral-800` |
  | Focus | transparent | black | `ring-2 ring-neutral-500 ring-offset-2` |

#### Component 09: Ghost Button (White) `Stable` (superseded by Part A §8)
- **Background:** White
- **Text:** `red-500`, `font-semibold`
- **Used on:** Dark backgrounds (CTA sections, hero overlays)
- **States:**
  | State | Background | Text |
  |-------|-----------|------|
  | Default | white | `red-500` |
  | Hover | `neutral-50` | `red-600` |
  | Active | `neutral-100` | `red-700` |
  | Focus | white | `red-500` + `ring-2 ring-white ring-offset-2 ring-offset-black` |

#### Component 10: Icon Button `Stable` (superseded by Part A §2 and §8)
- **Size:** 44x44px minimum (WCAG touch target)
- **Visual size:** 40x40px circle with 2px padding for touch area
- **Border:** `1px solid red-500`
- **Icon:** 16px, `text-red-500`
- **States:**
  | State | Background | Icon Color | Border |
  |-------|-----------|------------|--------|
  | Default | transparent | `red-500` | `red-500` |
  | Hover | `red-500` | white | `red-500` |
  | Focus | transparent | `red-500` | `ring-2 ring-red-500 ring-offset-2` |
- **ARIA:** Must have `aria-label` describing the action

---

### 5.5 Cards (superseded by Part A §2 and §6)

#### Component 11: Blog Card `Stable` (superseded by Part A §6)
- **Background:** `--color-bg-tertiary` (`surface-muted`)
- **Border-radius:** 16px (`rounded-2xl`)
- **Shadow:** `shadow-md`
- **Image:** Top, `h-40 md:h-48`, `rounded-t-2xl`, `object-cover`
- **Padding:** `py-6 px-4`
- **Title:** H4 style, `--color-heading`
- **Description:** Body SM, `--color-body-muted`, `line-clamp-3`
- **Link:** `text-red-500 font-medium`, "READ MORE →"
- **States:**
  - Default: As above
  - Hover: `shadow-lg`, subtle lift (`translate-y-[-2px]`, 200ms)
  - Focus-within: `ring-2 ring-red-500 ring-offset-2`

#### Component 12: Featured Job Card `Stable` (superseded by Part A §6)
- **Background:** White
- **Border-radius:** 8px (`rounded-lg`)
- **Shadow:** `shadow-md`
- **Image:** Top, `h-48`, `object-cover`
- **Padding:** `p-6`
- **Title:** H4 style, `--color-heading`
- **Link:** Underline, `--color-body hover:text-red-500`
- **States:** Same hover/focus pattern as Blog Card

#### Component 13: Solution Card (Image Overlay) `Stable` (superseded by Part A §6)
- **Dimensions:** `w-[260px]` desktop, full-width mobile
- **Shadow:** `shadow-md`
- **Image:** Full card, `object-cover`
- **Label:** Bottom-left, white text on image
- **Subtitle:** `text-red-500 text-sm`
- **Hover:** `scale(1.05)`, 300ms ease-out
- **Focus:** `ring-2 ring-red-500 ring-offset-2`

#### Component 14: Info Card (Border-left) `Stable` (superseded by Part A §2 and §6)
- **Border-left:** `2px solid neutral-200`
- **Padding-left:** 24px (`pl-6`)
- **Title:** H4, `--color-heading`
- **Subtitle:** Body LG, `font-medium`, `--color-body`
- **Description:** Body SM, `--color-body-muted`
- **Animation:** Fade-up on scroll, staggered

#### Component 15: Service Number Card `Stable` (superseded by Part A §6)
- **Number badge:** `bg-red-500 text-white font-bold text-[28px]`, 48x56px
- **Dashed connector:** `border-l-2 border-dashed neutral-300`, h-16
- **Title:** H3, `--color-subheading`
- **Subtitle:** Body, `--color-body`
- **Description:** Body, `--color-body-muted`

#### Component 16: Advantage Card (Hover Reveal) `Stable` (superseded by Part A §6)
- **Image:** Full card, `object-cover`
- **Hover overlay:** `from-red-500/70` gradient
- **Hover text:** Title + description fade-slide in
- **Animation:** `opacity 0→1`, `translate-y-[8px]→0`, 300ms
- **Keyboard:** Focusable, shows overlay on focus
- **ARIA:** `role="article"`, content visible to screen readers regardless of hover state

#### Component 17: Leader Card `Stable` (superseded by Part A §6)
- **Dimensions:** 300x400px
- **Background:** Black (image container)
- **Image:** Full cover, fades to 0 on hover
- **Info panel:** Bottom 20px, 80% width, 60px initial height
- **Hover:** Panel expands to full height, bio reveals
- **Bio text:** Caption (12px), `text-justify`
- **Social icons:** 3x Icon Button (Component 10)
- **Focus:** Same reveal as hover
- **Keyboard:** Tab to card → focus reveals panel, Tab through social icons
- **ARIA:** `role="article"`, `aria-label="{Name}, {Role}"`

---

### 5.6 Form Elements (superseded by Part A §8)

#### Component 18: Text Input `Stable` (superseded by Part A §8)
- **Height:** Auto (padding-based)
- **Padding:** `p-3` (12px)
- **Border:** `1px solid neutral-200`
- **Border-radius:** 6px (`rounded-md`)
- **Font:** Body (16px) — must be 16px+ to prevent iOS zoom
- **States:**
  | State | Border | Background | Other |
  |-------|--------|-----------|-------|
  | Default | `neutral-200` | white | — |
  | Hover | `neutral-400` | white | — |
  | Focus | `red-500` | white | `ring-2 ring-red-500 outline-none` |
  | Filled | `neutral-200` | white | — |
  | Disabled | `neutral-100` | `neutral-50` | `opacity-60 cursor-not-allowed` |
  | Error | `error-border` | `error-bg` | Error message below in `error-text` |
  | Read-only | `neutral-100` | `neutral-50` | `cursor-default` |
- **Helper text:** Caption, `--color-body-muted`, below input
- **Error message:** Caption, `--color-error-text`, replaces helper on error
- **Character count:** Caption, right-aligned below input
- **Label:** Body SM, `font-medium`, `--color-body`, above input
- **ARIA:** `aria-describedby` for helper/error, `aria-invalid="true"` on error, `aria-required="true"` when required
- **Keyboard:** Standard input behavior

#### Component 19: Dark Input (Contact Form) `Stable` (superseded by Part A §8)
- **Background:** Transparent
- **Border:** `1px solid white`
- **Text:** White
- **Placeholder:** `white/70`
- **Context:** Red background sections only
- **States:** Same as Text Input but with inverted colors

#### Component 20: Search Input `Stable`
- **Icon:** Search, left-positioned, `neutral-400`, 20px
- **Padding-left:** `pl-10`
- **Clear button:** X icon, right-positioned, appears when value exists
- **States:** Same as Text Input
- **Loading state:** Spinner replaces search icon during search
- **No results:** "No results found" message below input
- **ARIA:** `role="search"`, `aria-label="Search"`

#### Component 21: Textarea `Stable` (superseded by Part A §8)
- **Height:** `h-40` (160px), resizable vertically
- **Same styling as Text Input (light) or Dark Input per context**
- **Character count recommended for forms**

#### Component 22: Subscribe Input (Footer) `Stable` (superseded by Part A §1 and §8)
- **Width:** Full on desktop, constrained by footer column
- **Border:** `1px solid neutral-200`
- **Border-radius:** 4px
- **Padding:** `p-3`
- **Paired with:** Primary Button ("Subscribe" / "Send Now")

---

### 5.7 Feedback & Navigation

#### Component 23: Toast / Snackbar `Planned`
- **Position:** Bottom-center, 24px from edge
- **Width:** Auto, max 480px, min 280px
- **Background:** `surface-dark` (default), semantic bg for typed toasts
- **Text:** White (default), semantic text for typed
- **Border-radius:** 8px
- **Shadow:** `shadow-lg`
- **Duration:** 5000ms auto-dismiss, persistent for errors
- **Action:** Optional text button, right-aligned
- **Animation:** Slide-up 300ms ease-out enter, fade-out 200ms exit
- **Stack:** Max 3 visible, newest on bottom
- **ARIA:** `role="status"`, `aria-live="polite"` (or `"assertive"` for errors)
- **Keyboard:** Escape to dismiss, Tab to action button

#### Component 24: Modal / Dialog `Planned`
- **Overlay:** `bg-black/50`, click-outside to close
- **Container:** White, `rounded-xl`, `shadow-xl`, max-width 560px
- **Header:** H3 style, optional close (X) button
- **Body:** Body style, scrollable if overflow
- **Footer:** Right-aligned button row (Secondary + Primary)
- **Animation:** Overlay fade 200ms, dialog scale 0.95→1.0 + fade, 200ms
- **Focus trap:** Focus locked inside while open, returns to trigger on close
- **Keyboard:** Escape to close, Tab cycles within dialog
- **ARIA:** `role="dialog"`, `aria-modal="true"`, `aria-labelledby` → header

#### Component 25: Floating Badge (Pill) `Stable` (superseded by Part A §2)
- **Dimensions:** `w-[262px] py-1`
- **Border:** `1px solid red-500`
- **Border-radius:** `49px` (pill)
- **Background:** White
- **Icon:** Check circle, `text-red-500`
- **Text:** Body (16px), `--color-subheading`
- **Animation:** Slide-in from right, stagger base 400ms + 100ms per item

#### Component 26: Testimonial Dot `Stable` (superseded by Part A §2 and §5)
- **Container:** 44x44px touch target (transparent)
- **Visual dot — Inactive:** 12x12px, `red-200`, `rounded-full`
- **Visual dot — Active:** 20x20px, `red-500`, `rounded-full`
- **Transition:** `all 300ms ease`
- **ARIA:** `role="tablist"` on container, `role="tab"` + `aria-selected` on each dot

#### Component 27: FAQ Accordion `Stable`
- **Container:** `border-b border-neutral-100 pb-4`
- **Question button:** Body LG, `--color-body`, full-width, `text-left`
- **Chevron:** `ChevronRight` 20px, rotates 90° when open
- **Answer:** Body, `--color-body-muted`, slides in/out
- **Animation:** Chevron rotate 200ms, content height transition 200ms
- **Keyboard:**
  - Enter/Space: Toggle open/close
  - ArrowDown: Move to next accordion item
  - ArrowUp: Move to previous item
  - Home: First item
  - End: Last item
- **ARIA:** Button has `aria-expanded`, `aria-controls` → panel id. Panel has `role="region"`, `aria-labelledby` → button id

#### Component 28: Consultation Box (Floating) `Stable` (superseded by Part A §2)
- **Background:** `red-500`
- **Padding:** `p-8`
- **Shadow:** `shadow-lg`
- **Phone icon:** White on `bg-white/20` circle
- **Button:** Ghost Button (Component 09)
- **Position:** Absolutely placed on FAQ section image

#### Component 29: Pagination `Planned`
- **Layout:** Inline row, centered or right-aligned
- **Items:** Previous/Next arrows + page numbers
- **Current page:** `bg-red-500 text-white rounded-md`
- **Other pages:** `text-neutral-600 hover:bg-neutral-50 rounded-md`
- **Item size:** 40x40px minimum
- **Ellipsis:** "..." for truncated ranges
- **Keyboard:** Standard tab navigation
- **ARIA:** `nav` with `aria-label="Pagination"`, current has `aria-current="page"`

#### Component 30: Badge / Tag `Planned` (superseded by Part A §2)
- **Sizes:** SM (20px height), MD (24px height), LG (28px height)
- **Variants:**
  - Filled: `bg-red-50 text-red-700`, `bg-navy-50 text-navy-700`
  - Outline: `border border-red-500 text-red-500`
- **Border-radius:** `pill` (49px)
- **Padding:** `px-3 py-0.5`
- **Usage:** Job categories, blog tags, case study filters

#### Component 31: Alert Banner `Planned` (superseded by Part A §2)
- **Full-width or contained**
- **Variants:** Success, Warning, Error, Info — uses semantic color triad (bg/text/border)
- **Layout:** Icon (left) + Message + optional action (right) + optional dismiss (X)
- **Border-left:** `4px solid {semantic-border}`
- **Border-radius:** 8px
- **ARIA:** `role="alert"` for errors, `role="status"` for info/success

#### Component 32: Tooltip `Planned`
- **Background:** `neutral-900`
- **Text:** White, Caption (12px)
- **Border-radius:** 4px
- **Padding:** `px-3 py-1.5`
- **Arrow:** 6px CSS triangle
- **Position:** Top (default), auto-flip if clipped
- **Delay:** 300ms show, 0ms hide
- **ARIA:** `role="tooltip"`, trigger has `aria-describedby`
- **Keyboard:** Shows on focus, hides on Escape

#### Component 33: Skeleton Loader `Planned`
- **Background:** `neutral-100`
- **Animation:** Pulse shimmer, `animate-pulse`
- **Border-radius:** Matches the component it replaces
- **Variants:** Text line (h-4, rounded), Card (full card shape), Image (aspect ratio preserved)

#### Component 34: Divider `Planned`
- **Horizontal:** `border-t border-neutral-100`, full-width
- **With label:** Text centered, line on both sides, Caption style, `--color-body-muted`
- **Spacing:** `my-8` default

---

### 5.8 Media & Layout

#### Component 35: Image with Hover Zoom `Stable` (superseded by Part A §5 and §8)
- **Container:** `overflow-hidden rounded-lg`
- **Image:** `object-cover w-full h-full`
- **Hover:** `scale(1.05)`, 300ms ease-out
- **Focus:** Same scale as hover (for keyboard users on linked images)

#### Component 36: Swap Grid `Stable` (superseded by Part A §5)
- **Layout:** 3 rows — full-width / 2-col split / full-width
- **Heights:** 200px (full rows), 130px (split row)
- **Split ratio:** `flex-[2]` / `flex-1`
- **Gap:** 16px (`gap-4`)
- **Interaction:** 1-second hover timer swaps image to top position

#### Component 37: Partner Logo Marquee `Stable` (superseded by Part A §5)
- **Container:** `h-[50px]`, masked edges (gradient fade)
- **Items:** `w-[120px] h-[50px]`, absolutely positioned
- **Animation:** `scrollLeft` keyframe, 30s linear infinite
- **Pause:** Pauses on hover
- **Reduced motion:** Static grid fallback, no animation
- **ARIA:** `aria-label="Our Partners"`, individual logos have `alt` text

#### Component 38: Testimonial Slider `Stable` (superseded by Part A §5)
- **Engine:** react-slick
- **Layout:** 2-column (image | content) on desktop, stacked on mobile
- **Image:** Circular on mobile (150x150), full-height on desktop
- **Quote icon:** 64x64 red box with white Quote icon
- **Autoplay:** 5000ms interval
- **Dots:** Custom (Component 26)
- **Keyboard:** Arrow keys to navigate slides
- **ARIA:** `role="region"`, `aria-label="Client testimonials"`, `aria-live="polite"` for auto-advance
- **Reduced motion:** Autoplay disabled, instant transitions

#### Component 39: Footer `Stable` (superseded by Part A §1)
- **Background:** White
- **Layout:** 4-column grid on desktop, stacked on mobile
- **Columns:** Logo/Contact | Pages | Access | Subscribe
- **Contact icons:** `bg-red-500 rounded-full p-3`, white icon
- **Links:** Body SM, `--color-body hover:text-red-500`
- **Social icons:** `neutral-500 hover:text-red-500`, 24px, 44px touch target
- **Subscribe:** Input (Component 22) + Primary Button
- **ARIA:** `role="contentinfo"`, each column in `<nav>` with `aria-label`

#### Component 40: Skip Navigation Link `Planned`
- **Position:** Fixed top-left, hidden until focused
- **Appearance:** `bg-red-500 text-white px-4 py-2 rounded-md shadow-lg`
- **Text:** "Skip to main content"
- **Z-index:** `z-50`
- **Target:** `#main-content`
- **ARIA:** Standard skip link pattern — becomes visible on Tab focus

---

## 6. Content & Voice Guidelines

### 6.1 Brand Voice

| Attribute | Do | Don't |
|-----------|-----|-------|
| **Confident** | "We deliver results" | "We think we can help" |
| **Clear** | "Reduce downtime by 40%" | "Leverage synergies to optimize outcomes" |
| **Human** | "Your team deserves better tools" | "End-users require optimized solutions" |
| **Precise** | "24/7 monitoring with 15-min SLA" | "Round-the-clock support" |

### 6.2 CTA Button Copy

Standardized verb hierarchy for buttons:

| Priority | Pattern | Examples |
|----------|---------|----------|
| **Primary action** | `{Verb}` + `{Object}` | "Get a Quote", "Contact Us", "View Jobs" |
| **Secondary action** | `{Verb}` + `{Modifier}` | "Learn More", "Explore Services", "Read Case Study" |
| **Tertiary action** | `{Verb}` | "Subscribe", "Download", "Share" |

**Rules:**
- Sentence case always ("Get a quote", not "Get A Quote" or "GET A QUOTE")
- No periods, no exclamation marks
- Max 3 words preferred, 5 absolute maximum
- Action-oriented verbs only (Get, View, Explore, Contact, Download — never "Click here")

### 6.3 Capitalization

| Element | Rule | Example |
|---------|------|---------|
| Page titles | Title Case | "Our IT Service Delivery Models" |
| Section headings | Title Case | "Delivering Tangible Value" |
| Body copy | Sentence case | "We partner with organizations like yours..." |
| Navigation | Title Case | "Case Studies", "About Us" |
| Buttons | Sentence case | "Get a quote" |
| Labels/tags | Sentence case | "Cloud infrastructure" |

### 6.4 Truncation

| Context | Method | Example |
|---------|--------|---------|
| Blog card description | `line-clamp-3` + "..." | 3 lines then ellipsis |
| Card titles | `line-clamp-2` | 2 lines max |
| Table cells | Single line + `truncate` | Ellipsis |

---

## 7. Layout Patterns

### 7.1 Breakpoints

| Token | Value | Tailwind | Target |
|-------|-------|----------|--------|
| `bp-sm` | 640px | `sm:` | Large phones landscape |
| `bp-md` | 768px | `md:` | Tablets |
| `bp-lg` | 1024px | `lg:` | Desktops |
| `bp-xl` | 1280px | `xl:` | Large desktops |
| `bp-2xl` | 1536px | `2xl:` | Ultra-wide |

### 7.2 Grid System

| Pattern | Mobile | Tablet | Desktop | Usage |
|---------|--------|--------|---------|-------|
| Hero + Sidebar | Stack | 2-col | 2-col | About hero |
| Content + Image | Stack | 2-col | 2-col | Service sections |
| Card Grid | 1-col | 2-col | 3-col | Blog, Case studies, Jobs |
| Footer | 1-col | 2-col | 4-col | Footer |
| Testimonial | Stack | 12-col grid | 5+7 split | Testimonials |
| Info Cards | 1-col | 2-col | 2-col (in 2/3) | Solutions |
| Leader Cards | 1-col | 2-col | 3-col | Leadership |

### 7.3 Common Layout Templates (superseded by Part A §4 and §11)

```
Full-bleed hero:
  <div class="relative w-full h-[300px] md:h-[500px]">
    <img class="w-full h-full object-cover" />
    <div class="absolute inset-0 bg-black/30" />
    <div class="absolute inset-0 flex items-center">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

Contained section:
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

Full-width colored section:
  <section class="bg-[surface-color]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

Alternating content (image left/right):
  <div class="flex flex-col-reverse md:flex-row items-center gap-8">
  <div class="flex flex-col md:flex-row items-center gap-8">
```

---

## 8. Animation & Motion (superseded by Part A §5)

### 8.1 Easing Curves (superseded by Part A §5)

| Token | Value | Usage |
|-------|-------|-------|
| `ease-productive` | `cubic-bezier(0.2, 0, 0.38, 0.9)` | Standard UI transitions (buttons, toggles, inputs) |
| `ease-expressive` | `cubic-bezier(0.4, 0.14, 0.3, 1)` | Emphasis moments (hero reveals, section entries) |
| `ease-enter` | `cubic-bezier(0, 0, 0.3, 1)` | Elements appearing (modals, toasts, dropdowns) |
| `ease-exit` | `cubic-bezier(0.4, 0, 1, 1)` | Elements leaving (modal close, toast dismiss) |

### 8.2 Duration Scale (superseded by Part A §5)

| Token | Value | Usage |
|-------|-------|-------|
| `duration-instant` | 100ms | Focus rings, color changes |
| `duration-fast` | 150ms | Button hover, link hover, icon rotation |
| `duration-normal` | 200ms | Dropdowns, accordion, tooltip |
| `duration-moderate` | 300ms | Card hover, image zoom, slide transitions |
| `duration-slow` | 450ms | Scroll-reveal entrance |
| `duration-slower` | 600ms | Hero/page-level reveals |

### 8.3 Scroll-Reveal System (superseded by Part A §5)

Uses custom `useInView` hook (IntersectionObserver, threshold 0.1):

| Property | Hidden State | Visible State | Duration | Easing |
|----------|-------------|---------------|----------|--------|
| Fade Up | `translate-y-[30px] opacity-0` | `translate-y-0 opacity-100` | 450ms | `ease-expressive` |
| Fade Right | `translate-x-[30px] opacity-0` | `translate-x-0 opacity-100` | 450ms | `ease-expressive` |

> **Change from v1.0:** Translate distance reduced from 50px to **30px** for subtlety. Large translate distances feel sluggish.

### 8.4 Stagger Pattern (Revised) (superseded by Part A §5)

v1.0 used 800ms-2200ms delays (users wait 2.2s for last element). **Revised to industry-standard timing:**

| Element Order | Delay | Cumulative |
|---------------|-------|------------|
| Title | 0ms | 0ms |
| Paragraph 1 | 100ms | 100ms |
| Paragraph 2 | 100ms | 200ms |
| Button/CTA | 100ms | 300ms |
| Badge/Tag 1 | 100ms | 400ms |
| Badge/Tag 2 | 100ms | 500ms |
| Badge/Tag 3 | 100ms | 600ms |
| Badge/Tag 4 | 100ms | 700ms |

**Stagger increment:** 100ms between siblings
**Max total choreography:** 800ms (no user should wait longer than this for all content to appear)

### 8.5 Interaction Animations (superseded by Part A §5)

| Interaction | Property | Duration | Easing | Enter | Exit |
|-------------|----------|----------|--------|-------|------|
| Button hover | Background | 150ms | `ease-productive` | — | Same |
| Card hover lift | `translateY(-2px)` + shadow | 200ms | `ease-productive` | — | Same |
| Card image zoom | `scale(1.05)` | 300ms | `ease-productive` | — | Same |
| Link hover | Color | 100ms | `ease-productive` | — | Same |
| Dropdown open | Height + opacity | 200ms | `ease-enter` | Scale 0.95→1 | `ease-exit`, 150ms |
| FAQ chevron | `rotate(90deg)` | 200ms | `ease-productive` | — | Same |
| Leader card | Panel height | 400ms | `ease-expressive` | — | Same |
| Modal open | Overlay fade + scale | 200ms | `ease-enter` | Scale 0.95→1 | `ease-exit`, 150ms |
| Toast enter | `translateY(100%)→0` | 300ms | `ease-enter` | — | Fade out 200ms |
| Marquee | `translateX` | 30s | `linear infinite` | — | — |

### 8.6 Motion Principles (superseded by Part A §5)

1. **Enter from bottom or right.** Never from top (feels like falling) or left (fights reading direction).
2. **Exit by fading.** Elements leave by fading out, not sliding out. Simpler, less distracting.
3. **Duration range:** 100ms (micro) — 600ms (page reveal). **Never exceed 600ms.**
4. **Stagger cap:** 800ms total for any group.
5. **One motion per element.** Don't combine scale + translate + rotate. Pick one transform.
6. **Respect `prefers-reduced-motion`.** Disable transforms entirely. Keep opacity fades but make them instant.

### 8.7 Reduced Motion (superseded by Part A §5)

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  .marquee { animation: none !important; }
}
```

---

## 9. Accessibility

### 9.1 Standards

- **Target:** WCAG 2.1 Level AA (all pages)
- **Testing tools:** axe-core, Lighthouse Accessibility, manual keyboard testing
- **Screen readers:** VoiceOver (Mac/iOS), NVDA (Windows)

### 9.2 Color Contrast (superseded by Part A §2)

| Combination | Ratio | Standard | Status |
|-------------|-------|----------|--------|
| `red-500` on white | 5.04:1 | 4.5:1 normal text | **PASS** |
| `navy-900` on white | 14.5:1 | 4.5:1 | **PASS** |
| `neutral-600` on white | 8.2:1 | 4.5:1 | **PASS** |
| `neutral-500` on white | 5.5:1 | 4.5:1 | **PASS** (improved from 4.6:1) |
| `neutral-400` on white | 3.5:1 | 3:1 large text only | **PASS** (large only) |
| White on `red-500` | 5.04:1 | 4.5:1 | **PASS** |
| White on `navy-900` | 14.5:1 | 4.5:1 | **PASS** |
| White on `surface-dark` | 13.1:1 | 4.5:1 | **PASS** |
| White on `overlay-dark` | Variable | — | **AUDIT per image** |

### 9.3 Keyboard Navigation (focus indicator superseded by Part A §8)

**Global requirements:**
- All interactive elements reachable via Tab
- Visible focus indicator on every focusable element
- Focus order matches visual reading order (top→bottom, left→right)
- No keyboard traps (except modals, which trap intentionally)
- Skip-to-content link as first focusable element

**Focus indicator (global):**
```css
:focus-visible {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px;
  border-radius: inherit;
}
```

### 9.4 Landmark Structure

```html
<body>
  <a href="#main-content" class="skip-link">Skip to main content</a>
  <header role="banner">        <!-- Navbar -->
  <nav aria-label="Main">       <!-- Primary navigation -->
  <main id="main-content">      <!-- Page content -->
    <section aria-label="...">  <!-- Named sections -->
  </main>
  <footer role="contentinfo">   <!-- Footer -->
</body>
```

### 9.5 Image Requirements

| Type | Treatment |
|------|-----------|
| Hero backgrounds | `role="img"` with descriptive `aria-label`, or `aria-hidden="true"` if purely decorative |
| Content images | Descriptive `alt` text (currently implemented) |
| Decorative images | `alt=""` + `aria-hidden="true"` |
| Logo images | `alt="Inflexions I.T. Services - Home"` (link to home) |
| Icons | `aria-hidden="true"` (Lucide default) unless icon-only button |

### 9.6 Form Accessibility

- Every input **must** have a visible label or `aria-label`
- Error messages linked via `aria-describedby`
- Required fields: `required` attribute + visual `*` indicator
- Form submission: Success/error announced via `aria-live="polite"` region
- Auto-complete: `autocomplete` attributes on name, email, phone fields

### 9.7 Touch Targets

**Minimum:** 44x44px for all interactive elements (WCAG 2.5.5 Level AAA target, AA best practice).

**Audit items requiring padding increase:**
- Testimonial dots: Visual 12-20px → 44px touch target via padding
- Social media icons in footer: Ensure 44px tap area
- FAQ chevron: Entire question row should be the tap target, not just the icon

---

## 10. Design Tokens (JSON) — Three-Tier Architecture (superseded by Part A §2 and §5)

```json
{
  "$schema": "https://design-tokens.github.io/community-group/format/",
  "version": "2.0.0",

  "global": {
    "color": {
      "red": {
        "50":  { "value": "#FDE8E7", "type": "color" },
        "100": { "value": "#F9C4C1", "type": "color" },
        "200": { "value": "#F4A8A4", "type": "color" },
        "300": { "value": "#E87A73", "type": "color" },
        "400": { "value": "#D5524A", "type": "color" },
        "500": { "value": "#BD2E25", "type": "color", "description": "Brand primary" },
        "600": { "value": "#A02923", "type": "color" },
        "700": { "value": "#8A2019", "type": "color" },
        "800": { "value": "#6E1812", "type": "color" },
        "900": { "value": "#52110D", "type": "color" }
      },
      "navy": {
        "500": { "value": "#265982", "type": "color" },
        "700": { "value": "#1B3764", "type": "color" },
        "900": { "value": "#16213E", "type": "color" }
      },
      "neutral": {
        "50":  { "value": "#F2F2F2", "type": "color" },
        "100": { "value": "#E6E6E6", "type": "color" },
        "200": { "value": "#D0D0D0", "type": "color" },
        "300": { "value": "#A6A6A6", "type": "color" },
        "400": { "value": "#8C8C8C", "type": "color" },
        "500": { "value": "#5C6280", "type": "color", "description": "Improved from #666C89 for AA contrast" },
        "600": { "value": "#41444B", "type": "color" },
        "700": { "value": "#333333", "type": "color" },
        "800": { "value": "#262626", "type": "color" },
        "900": { "value": "#171A20", "type": "color" },
        "950": { "value": "#000000", "type": "color" }
      },
      "surface": {
        "white": { "value": "#FFFFFF", "type": "color" },
        "light": { "value": "#F4F4F4", "type": "color" },
        "muted": { "value": "#F6F6F6", "type": "color" },
        "dark":  { "value": "#2A2A2A", "type": "color" }
      },
      "semantic": {
        "success": {
          "bg":     { "value": "#E8F5E9", "type": "color" },
          "text":   { "value": "#2E7D32", "type": "color" },
          "border": { "value": "#4CAF50", "type": "color" }
        },
        "warning": {
          "bg":     { "value": "#FFF3E0", "type": "color" },
          "text":   { "value": "#E65100", "type": "color" },
          "border": { "value": "#FB8C00", "type": "color" }
        },
        "error": {
          "bg":     { "value": "#FFEBEE", "type": "color" },
          "text":   { "value": "#C62828", "type": "color" },
          "border": { "value": "#D0281F", "type": "color" }
        },
        "info": {
          "bg":     { "value": "#E3F2FD", "type": "color" },
          "text":   { "value": "#1565C0", "type": "color" },
          "border": { "value": "#42A5F5", "type": "color" }
        }
      }
    },
    "typography": {
      "fontFamily": {
        "primary":   { "value": "Rubik, system-ui, sans-serif", "type": "fontFamily" },
        "secondary": { "value": "Krub, system-ui, sans-serif", "type": "fontFamily" }
      },
      "fontSize": {
        "display": { "value": "48px", "type": "fontSize" },
        "h1":      { "value": "36px", "type": "fontSize" },
        "h2":      { "value": "32px", "type": "fontSize" },
        "h3":      { "value": "24px", "type": "fontSize" },
        "h4":      { "value": "20px", "type": "fontSize" },
        "bodyLg":  { "value": "18px", "type": "fontSize" },
        "body":    { "value": "16px", "type": "fontSize" },
        "bodySm":  { "value": "14px", "type": "fontSize" },
        "caption": { "value": "12px", "type": "fontSize" }
      },
      "lineHeight": {
        "display":    { "value": "56px", "type": "lineHeight" },
        "h1":         { "value": "44px", "type": "lineHeight" },
        "h2":         { "value": "40px", "type": "lineHeight" },
        "h3":         { "value": "32px", "type": "lineHeight" },
        "h4":         { "value": "28px", "type": "lineHeight" },
        "bodyLg":     { "value": "28px", "type": "lineHeight" },
        "body":       { "value": "24px", "type": "lineHeight" },
        "bodySm":     { "value": "20px", "type": "lineHeight" },
        "caption":    { "value": "16px", "type": "lineHeight" }
      },
      "fontWeight": {
        "regular":   { "value": "400", "type": "fontWeight" },
        "medium":    { "value": "500", "type": "fontWeight" },
        "semibold":  { "value": "600", "type": "fontWeight" },
        "bold":      { "value": "700", "type": "fontWeight" },
        "extrabold": { "value": "800", "type": "fontWeight" }
      },
      "letterSpacing": {
        "tight":   { "value": "-0.5px", "type": "letterSpacing", "description": "Display headings" },
        "normal":  { "value": "0px", "type": "letterSpacing", "description": "Default" },
        "wide":    { "value": "0.25px", "type": "letterSpacing", "description": "Captions, labels" }
      }
    },
    "spacing": {
      "0":  { "value": "0px", "type": "spacing" },
      "1":  { "value": "4px", "type": "spacing" },
      "2":  { "value": "8px", "type": "spacing" },
      "3":  { "value": "12px", "type": "spacing" },
      "4":  { "value": "16px", "type": "spacing" },
      "5":  { "value": "20px", "type": "spacing" },
      "6":  { "value": "24px", "type": "spacing" },
      "8":  { "value": "32px", "type": "spacing" },
      "10": { "value": "40px", "type": "spacing" },
      "12": { "value": "48px", "type": "spacing" },
      "16": { "value": "64px", "type": "spacing" },
      "20": { "value": "80px", "type": "spacing" },
      "24": { "value": "96px", "type": "spacing" }
    },
    "borderRadius": {
      "none": { "value": "0px", "type": "borderRadius" },
      "sm":   { "value": "4px", "type": "borderRadius" },
      "md":   { "value": "6px", "type": "borderRadius" },
      "lg":   { "value": "8px", "type": "borderRadius" },
      "xl":   { "value": "12px", "type": "borderRadius" },
      "2xl":  { "value": "16px", "type": "borderRadius" },
      "pill": { "value": "49px", "type": "borderRadius" },
      "full": { "value": "9999px", "type": "borderRadius" }
    },
    "shadow": {
      "sm":     { "value": "0 1px 2px rgba(0,0,0,0.05)", "type": "boxShadow" },
      "md":     { "value": "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)", "type": "boxShadow" },
      "lg":     { "value": "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)", "type": "boxShadow" },
      "xl":     { "value": "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)", "type": "boxShadow" },
      "leader": { "value": "0 30px 30px rgba(0,0,0,0.5)", "type": "boxShadow" }
    },
    "easing": {
      "productive": { "value": "cubic-bezier(0.2, 0, 0.38, 0.9)", "type": "easing" },
      "expressive": { "value": "cubic-bezier(0.4, 0.14, 0.3, 1)", "type": "easing" },
      "enter":      { "value": "cubic-bezier(0, 0, 0.3, 1)", "type": "easing" },
      "exit":       { "value": "cubic-bezier(0.4, 0, 1, 1)", "type": "easing" }
    },
    "duration": {
      "instant":  { "value": "100ms", "type": "duration" },
      "fast":     { "value": "150ms", "type": "duration" },
      "normal":   { "value": "200ms", "type": "duration" },
      "moderate": { "value": "300ms", "type": "duration" },
      "slow":     { "value": "450ms", "type": "duration" },
      "slower":   { "value": "600ms", "type": "duration" }
    },
    "breakpoint": {
      "sm":  { "value": "640px", "type": "dimension" },
      "md":  { "value": "768px", "type": "dimension" },
      "lg":  { "value": "1024px", "type": "dimension" },
      "xl":  { "value": "1280px", "type": "dimension" },
      "2xl": { "value": "1536px", "type": "dimension" }
    }
  },

  "semantic": {
    "color": {
      "heading":              { "value": "{global.color.navy.900}" },
      "subheading":           { "value": "{global.color.navy.700}" },
      "body":                 { "value": "{global.color.neutral.600}" },
      "body-muted":           { "value": "{global.color.neutral.500}" },
      "body-inverse":         { "value": "{global.color.surface.white}" },
      "action-primary":       { "value": "{global.color.red.500}" },
      "action-primary-hover": { "value": "{global.color.red.600}" },
      "action-primary-active":{ "value": "{global.color.red.700}" },
      "action-secondary":     { "value": "{global.color.neutral.950}" },
      "link":                 { "value": "{global.color.red.500}" },
      "link-hover":           { "value": "{global.color.red.600}" },
      "border-default":       { "value": "{global.color.neutral.200}" },
      "border-subtle":        { "value": "{global.color.neutral.100}" },
      "border-accent":        { "value": "{global.color.red.500}" },
      "bg-primary":           { "value": "{global.color.surface.white}" },
      "bg-secondary":         { "value": "{global.color.surface.light}" },
      "bg-tertiary":          { "value": "{global.color.surface.muted}" },
      "bg-inverse":           { "value": "{global.color.surface.dark}" },
      "bg-brand":             { "value": "{global.color.red.500}" },
      "focus-ring":           { "value": "{global.color.red.500}" }
    }
  },

  "component": {
    "button-primary": {
      "bg":           { "value": "{semantic.color.action-primary}" },
      "bg-hover":     { "value": "{semantic.color.action-primary-hover}" },
      "bg-active":    { "value": "{semantic.color.action-primary-active}" },
      "text":         { "value": "{global.color.surface.white}" },
      "radius":       { "value": "{global.borderRadius.md}" },
      "font-size":    { "value": "{global.typography.fontSize.body}" },
      "font-weight":  { "value": "{global.typography.fontWeight.semibold}" },
      "padding-x":    { "value": "{global.spacing.8}" },
      "padding-y":    { "value": "{global.spacing.3}" }
    },
    "button-secondary": {
      "bg":           { "value": "transparent" },
      "bg-hover":     { "value": "{semantic.color.action-secondary}" },
      "text":         { "value": "{semantic.color.action-secondary}" },
      "text-hover":   { "value": "{global.color.surface.white}" },
      "border":       { "value": "2px solid {semantic.color.action-secondary}" },
      "radius":       { "value": "{global.borderRadius.md}" }
    },
    "card-blog": {
      "bg":           { "value": "{semantic.color.bg-tertiary}" },
      "radius":       { "value": "{global.borderRadius.2xl}" },
      "shadow":       { "value": "{global.shadow.md}" },
      "padding":      { "value": "{global.spacing.6}" },
      "title-color":  { "value": "{semantic.color.heading}" },
      "body-color":   { "value": "{semantic.color.body-muted}" }
    },
    "input": {
      "bg":            { "value": "{global.color.surface.white}" },
      "border":        { "value": "1px solid {semantic.color.border-default}" },
      "border-focus":  { "value": "{semantic.color.focus-ring}" },
      "radius":        { "value": "{global.borderRadius.md}" },
      "padding":       { "value": "{global.spacing.3}" },
      "font-size":     { "value": "{global.typography.fontSize.body}" }
    },
    "hero-home": {
      "height-mobile":  { "value": "300px" },
      "height-desktop": { "value": "500px" },
      "overlay":        { "value": "rgba(0,0,0,0.30)" }
    },
    "hero-inner": {
      "height-mobile":  { "value": "300px" },
      "height-desktop": { "value": "500px" },
      "overlay":        { "value": "rgba(0,0,0,0.50)" }
    }
  }
}
```

---

## 11. CSS Custom Properties (superseded by Part A §2 and §5)

```css
:root {
  /* ═══════════════════════════════════════════
     GLOBAL TOKENS — Raw palette values
     ═══════════════════════════════════════════ */

  /* ─── Red (Primary Brand) ─── */
  --red-50: #FDE8E7;
  --red-100: #F9C4C1;
  --red-200: #F4A8A4;
  --red-300: #E87A73;
  --red-400: #D5524A;
  --red-500: #BD2E25;
  --red-600: #A02923;
  --red-700: #8A2019;
  --red-800: #6E1812;
  --red-900: #52110D;

  /* ─── Navy (Consolidated: 5 → 3) ─── */
  --navy-500: #265982;
  --navy-700: #1B3764;
  --navy-900: #16213E;

  /* ─── Neutral ─── */
  --neutral-50: #F2F2F2;
  --neutral-100: #E6E6E6;
  --neutral-200: #D0D0D0;
  --neutral-300: #A6A6A6;
  --neutral-400: #8C8C8C;
  --neutral-500: #5C6280;  /* Improved: was #666C89 (4.6:1) → now 5.5:1 */
  --neutral-600: #41444B;
  --neutral-700: #333333;
  --neutral-800: #262626;
  --neutral-900: #171A20;
  --neutral-950: #000000;

  /* ─── Surface ─── */
  --surface-white: #FFFFFF;
  --surface-light: #F4F4F4;
  --surface-muted: #F6F6F6;
  --surface-dark: #2A2A2A;

  /* ─── Semantic ─── */
  --success-bg: #E8F5E9;  --success-text: #2E7D32;  --success-border: #4CAF50;
  --warning-bg: #FFF3E0;  --warning-text: #E65100;  --warning-border: #FB8C00;
  --error-bg: #FFEBEE;    --error-text: #C62828;    --error-border: #D0281F;
  --info-bg: #E3F2FD;     --info-text: #1565C0;     --info-border: #42A5F5;

  /* ═══════════════════════════════════════════
     SEMANTIC TOKENS — Intent-based aliases
     ═══════════════════════════════════════════ */

  /* Text */
  --color-heading: var(--navy-900);
  --color-subheading: var(--navy-700);
  --color-body: var(--neutral-600);
  --color-body-muted: var(--neutral-500);
  --color-body-inverse: var(--surface-white);

  /* Actions */
  --color-action-primary: var(--red-500);
  --color-action-primary-hover: var(--red-600);
  --color-action-primary-active: var(--red-700);
  --color-action-secondary: var(--neutral-950);

  /* Links */
  --color-link: var(--red-500);
  --color-link-hover: var(--red-600);

  /* Borders */
  --color-border-default: var(--neutral-200);
  --color-border-subtle: var(--neutral-100);
  --color-border-strong: var(--neutral-700);
  --color-border-accent: var(--red-500);

  /* Backgrounds */
  --color-bg-primary: var(--surface-white);
  --color-bg-secondary: var(--surface-light);
  --color-bg-tertiary: var(--surface-muted);
  --color-bg-inverse: var(--surface-dark);
  --color-bg-brand: var(--red-500);

  /* Focus */
  --color-focus-ring: var(--red-500);

  /* ═══════════════════════════════════════════
     TYPOGRAPHY
     ═══════════════════════════════════════════ */

  --font-primary: Rubik, system-ui, sans-serif;
  --font-secondary: Krub, system-ui, sans-serif;

  --text-display: 48px;    --lh-display: 56px;
  --text-h1: 36px;         --lh-h1: 44px;
  --text-h2: 32px;         --lh-h2: 40px;
  --text-h3: 24px;         --lh-h3: 32px;
  --text-h4: 20px;         --lh-h4: 28px;
  --text-body-lg: 18px;    --lh-body-lg: 28px;
  --text-body: 16px;       --lh-body: 24px;
  --text-body-sm: 14px;    --lh-body-sm: 20px;
  --text-caption: 12px;    --lh-caption: 16px;

  --tracking-tight: -0.5px;
  --tracking-normal: 0px;
  --tracking-wide: 0.25px;

  --weight-regular: 400;
  --weight-medium: 500;
  --weight-semibold: 600;
  --weight-bold: 700;
  --weight-extrabold: 800;

  /* ═══════════════════════════════════════════
     SPACING (8px grid)
     ═══════════════════════════════════════════ */

  --space-0: 0px;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;

  /* ═══════════════════════════════════════════
     BORDER RADIUS
     ═══════════════════════════════════════════ */

  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-pill: 49px;
  --radius-full: 9999px;

  /* ═══════════════════════════════════════════
     SHADOWS
     ═══════════════════════════════════════════ */

  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);

  /* ═══════════════════════════════════════════
     ANIMATION
     ═══════════════════════════════════════════ */

  --ease-productive: cubic-bezier(0.2, 0, 0.38, 0.9);
  --ease-expressive: cubic-bezier(0.4, 0.14, 0.3, 1);
  --ease-enter: cubic-bezier(0, 0, 0.3, 1);
  --ease-exit: cubic-bezier(0.4, 0, 1, 1);

  --duration-instant: 100ms;
  --duration-fast: 150ms;
  --duration-normal: 200ms;
  --duration-moderate: 300ms;
  --duration-slow: 450ms;
  --duration-slower: 600ms;

  --scroll-reveal-distance: 30px;
  --stagger-increment: 100ms;

  /* ═══════════════════════════════════════════
     LAYOUT
     ═══════════════════════════════════════════ */

  --container-max: 80rem;
  --container-px-sm: 16px;
  --container-px-md: 24px;
  --container-px-lg: 32px;

  /* ─── Z-Index Scale ─── */
  --z-dropdown: 10;
  --z-sticky: 20;
  --z-overlay: 30;
  --z-modal: 40;
  --z-skip-link: 50;
  --z-toast: 60;
}

/* ═══════════════════════════════════════════
   DARK MODE
   ═══════════════════════════════════════════ */

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg-primary: #111827;
    --color-bg-secondary: #1F2937;
    --color-bg-tertiary: #1F2937;
    --color-bg-inverse: #0F172A;
    --color-heading: #E5E7EB;
    --color-subheading: #D1D5DB;
    --color-body: #D1D5DB;
    --color-body-muted: #9CA3AF;
    --color-body-inverse: #111827;
    --color-action-primary: #E04A42;
    --color-border-default: #374151;
    --color-border-subtle: #374151;
  }
}

/* ═══════════════════════════════════════════
   REDUCED MOTION
   ═══════════════════════════════════════════ */

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* ═══════════════════════════════════════════
   FOCUS VISIBLE (Global)
   ═══════════════════════════════════════════ */

:focus-visible {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px;
}
```

---

## 12. Figma Implementation Guide (superseded by Part A §2 and §3)

### 12.1 Text Styles

| Style Name | Font | Size | Weight | Line Height | Tracking |
|------------|------|------|--------|-------------|----------|
| Display/Hero | Rubik | 48px | Bold (700) | 56px | -0.5px |
| Heading/H1 | Rubik | 36px | Bold (700) | 44px | -0.25px |
| Heading/H2 | Rubik | 32px | SemiBold (600) | 40px | 0 |
| Heading/H3 | Rubik | 24px | SemiBold (600) | 32px | 0 |
| Heading/H4 | Rubik | 20px | SemiBold (600) | 28px | 0 |
| Body/Large | Rubik | 18px | Regular (400) | 28px | 0 |
| Body/Default | Rubik | 16px | Regular (400) | 24px | 0 |
| Body/Small | Rubik | 14px | Regular (400) | 20px | 0 |
| Caption | Rubik | 12px | Regular (400) | 16px | +0.25px |

### 12.2 Color Styles

| Style Name | Hex | Opacity |
|------------|-----|---------|
| Primary/Default | #BD2E25 | 100% |
| Primary/Hover | #A02923 | 100% |
| Primary/Active | #8A2019 | 100% |
| Primary/Light | #FDE8E7 | 100% |
| Navy/900 | #16213E | 100% |
| Navy/700 | #1B3764 | 100% |
| Navy/500 | #265982 | 100% |
| Neutral/950 | #000000 | 100% |
| Neutral/900 | #171A20 | 100% |
| Neutral/600 | #41444B | 100% |
| Neutral/500 | #5C6280 | 100% |
| Neutral/200 | #D0D0D0 | 100% |
| Surface/White | #FFFFFF | 100% |
| Surface/Light | #F4F4F4 | 100% |
| Surface/Muted | #F6F6F6 | 100% |
| Surface/Dark | #2A2A2A | 100% |
| Overlay/Light | #000000 | 30% |
| Overlay/Medium | #000000 | 40% |
| Overlay/Dark | #000000 | 50% |
| Success/BG | #E8F5E9 | 100% |
| Success/Text | #2E7D32 | 100% |
| Success/Border | #4CAF50 | 100% |
| Warning/BG | #FFF3E0 | 100% |
| Warning/Text | #E65100 | 100% |
| Warning/Border | #FB8C00 | 100% |
| Error/BG | #FFEBEE | 100% |
| Error/Text | #C62828 | 100% |
| Error/Border | #D0281F | 100% |
| Info/BG | #E3F2FD | 100% |
| Info/Text | #1565C0 | 100% |
| Info/Border | #42A5F5 | 100% |

### 12.3 Effect Styles

| Style Name | Type | Values |
|------------|------|--------|
| Shadow/SM | Drop Shadow | Y:1, Blur:2, #000 5% |
| Shadow/MD | Drop Shadow | Y:4, Blur:6, #000 10% |
| Shadow/LG | Drop Shadow | Y:10, Blur:15, #000 10% |
| Shadow/XL | Drop Shadow | Y:20, Blur:25, #000 10% |
| Shadow/Leader | Drop Shadow | Y:30, Blur:30, #000 50% |

### 12.4 Grid Styles

| Style Name | Type | Count | Gutter | Margin | Max Width |
|------------|------|-------|--------|--------|-----------|
| Mobile | Columns | 4 | 16px | 16px | 100% |
| Tablet | Columns | 8 | 24px | 24px | 100% |
| Desktop | Columns | 12 | 32px | auto | 1280px |

---

## 13. Governance & Lifecycle

### 13.1 Versioning

Follow [SemVer](https://semver.org/):
- **Major** (3.0.0): Breaking changes — renamed tokens, removed components, changed color values
- **Minor** (2.1.0): New components, new tokens, additive changes
- **Patch** (2.0.1): Bug fixes, documentation corrections, contrast adjustments

### 13.2 Component Status Labels

| Label | Meaning | Can Ship? |
|-------|---------|-----------|
| `Stable` | Fully specified, tested, production-ready | Yes |
| `Beta` | Functional, API may change | Yes, with caution |
| `Planned` | Spec only, not yet built | No |
| `Deprecated` | Scheduled for removal in next major | Yes, shows warning |

### 13.3 Deprecation Policy

1. Mark component as `Deprecated` with a removal target version
2. Add console warning in development builds
3. Document migration path to replacement component
4. Remove in next major version (minimum 30-day notice)

### 13.4 Contribution Process

1. **Propose:** Open a GitHub issue describing the new component/token need
2. **Design:** Create Figma mockup following existing patterns
3. **Review:** Design review with at least one other team member
4. **Build:** Implement following this system's conventions
5. **Document:** Add to DESIGN_SYSTEM.md with all states, ARIA, keyboard specs
6. **Ship:** Merge as `Beta`, promote to `Stable` after 2 weeks without issues

### 13.5 Decision Log

| Decision | Rationale | Date |
|----------|-----------|------|
| Rubik as primary font | Geometric sans-serif with excellent weight range. Professional without being sterile. Supports Latin Extended. | v1.0 |
| 8px grid (not 4px) | Simpler mental model for development team. 4px sub-grid used only for line-height alignment. | v1.0 |
| `#BD2E25` as brand red | Existing brand color. 5.04:1 contrast on white passes AA. Warm enough to feel approachable, saturated enough to command attention. | v1.0 |
| Navy consolidated 5→3 | Five near-identical navies created unintentional drift. Three provide sufficient hierarchy (heading/subheading/accent) without ambiguity. | v2.0 |
| `neutral-500` darkened | Previous `#666C89` was 4.6:1 — technically AA but marginal. Darkened to `#5C6280` (5.5:1) for comfortable compliance headroom. | v2.0 |
| Stagger reduced to 100ms | Previous 200ms increment with 800ms base meant 2.2s total wait. Industry standard (Material, Carbon) uses 50-100ms. Content should fully appear within 800ms. | v2.0 |
| 3-tier token architecture | Enables brand theming by swapping semantic layer only. Future-proofs for dark mode, white-label, or rebrand scenarios. | v2.0 |
| Lucide as sole icon library | Already dominant (15+ icons). Removing react-icons/fi eliminates a redundant dependency and ensures consistent stroke weight/sizing. | v2.0 |

---

## 14. Migration Guide (v1.0 → v2.0)

### 14.1 Color Changes

| v1.0 Value | v2.0 Action | Files Affected |
|------------|-------------|----------------|
| `#666C89` | Replace with `#5C6280` | services, case-studies, careers |
| `#1D3C6D` | Replace with `#1B3764` | StrategicPartnerSection |
| `#1E3161` | Replace with `#1B3764` | about, Leaders |
| `#a52620` | Replace with `#A02923` | Footer |
| `#464646` | Replace with `#41444B` | Leaders |
| `#171A20` | Replace with `#171A20` (now `neutral-900`) | careers |
| `#D0281F` (CSS var) | Replace with `#BD2E25` | globals.css `@theme` |

### 14.2 Typography Changes

| v1.0 | v2.0 | Reason |
|------|------|--------|
| H1 weight 400 | H1 weight **700** | Assert hierarchy |
| H2 weight 400 | H2 weight **600** | Assert hierarchy |
| H3 size 25px | H3 size **24px** | Snap to 4px grid |
| No letter-spacing | Display: **-0.5px**, Caption: **+0.25px** | Optical correction |

### 14.3 Animation Changes

| v1.0 | v2.0 | Reason |
|------|------|--------|
| Stagger base 800ms | Stagger base **0ms** | Content visible immediately |
| Stagger increment 200ms | Increment **100ms** | Faster choreography |
| Scroll translate 50px | Translate **30px** | Subtler, more polished |
| 2 easing curves | **4 named curves** | Enter/exit distinction |

### 14.4 globals.css @theme Alignment

The `@theme` block in globals.css should be updated to match the design system tokens. See Section 11 for the complete CSS custom properties that should replace the current `@theme` contents.

---

*Design System v2.0 — Inflexions I.T. Services*
*Reverse-engineered and improved from the production codebase.*
*Aligned to industry best practices: Material Design 3, IBM Carbon, Shopify Polaris, Salesforce Lightning.*
