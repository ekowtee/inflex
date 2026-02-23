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

### 1.1 Three-Tier Token Architecture

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

### 1.3 Global Palette — Navy (Consolidated from 5 → 3)

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

### 1.5 Global Palette — Surface

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

### 1.7 Semantic Aliases

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

### 1.8 Dark Mode Palette

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

### 2.1 Font Families

| Token | Family | Weights | Usage |
|-------|--------|---------|-------|
| `font-sans` / `font-rubik` | Rubik | 400, 500, 700, 800 | Primary — headings & body |
| `font-krub` | Krub | 400, 500, 600 | Secondary — accents, labels, badges |
| `font-system` | system-ui, sans-serif | — | Fallback stack |

### 2.2 Composite Text Styles (9 Levels)

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

### 2.3 Responsive Typography

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

### 2.4 Text Color Pairing Rules

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

### 3.3 Section Spacing

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

### 4.2 Current Icon Inventory

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

### 4.4 Icon Rules

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

#### Component 01: Navbar `Stable`
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

#### Component 02: Mobile Menu `Stable`
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

### 5.3 Heroes & Banners

#### Component 04: Home Hero Banner `Stable`
- **Height:** 300px (mobile) / 500px (md+)
- **Image:** Full-bleed, `object-cover`
- **Overlay:** `surface-overlay-light` (`bg-black/30`)
- **Content position:** Bottom-left, `bottom-10 md:bottom-28`
- **Title:** Display style, `--color-body-inverse`
- **Subtitle:** Body SM, `white/90` opacity
- **CTA:** Primary Button (Component 07)

#### Component 05: Inner Page Hero `Stable`
- **Height:** 300px (mobile) / 500px (md+)
- **Overlay:** `surface-overlay-dark` (`bg-black/50`)
- **Title:** Display style, `--color-body-inverse`
- **Content:** Centered vertically, left-aligned within container

#### Component 06: Call-to-Action Banner `Stable`
- **Height:** 300-440px responsive
- **Image:** Full-bleed, `object-cover`
- **Overlay:** `surface-overlay-medium` (`bg-black/40`)
- **Content:** Centered, stacked vertically
- **Title:** H1 style, `--color-body-inverse`
- **Buttons:** Ghost (border) + Primary, stacked on mobile, inline on desktop

---

### 5.4 Buttons

#### Component 07: Primary Button `Stable`
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

#### Component 08: Secondary Button (Outline) `Stable`
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

#### Component 09: Ghost Button (White) `Stable`
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

#### Component 10: Icon Button `Stable`
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

### 5.5 Cards

#### Component 11: Blog Card `Stable`
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

#### Component 12: Featured Job Card `Stable`
- **Background:** White
- **Border-radius:** 8px (`rounded-lg`)
- **Shadow:** `shadow-md`
- **Image:** Top, `h-48`, `object-cover`
- **Padding:** `p-6`
- **Title:** H4 style, `--color-heading`
- **Link:** Underline, `--color-body hover:text-red-500`
- **States:** Same hover/focus pattern as Blog Card

#### Component 13: Solution Card (Image Overlay) `Stable`
- **Dimensions:** `w-[260px]` desktop, full-width mobile
- **Shadow:** `shadow-md`
- **Image:** Full card, `object-cover`
- **Label:** Bottom-left, white text on image
- **Subtitle:** `text-red-500 text-sm`
- **Hover:** `scale(1.05)`, 300ms ease-out
- **Focus:** `ring-2 ring-red-500 ring-offset-2`

#### Component 14: Info Card (Border-left) `Stable`
- **Border-left:** `2px solid neutral-200`
- **Padding-left:** 24px (`pl-6`)
- **Title:** H4, `--color-heading`
- **Subtitle:** Body LG, `font-medium`, `--color-body`
- **Description:** Body SM, `--color-body-muted`
- **Animation:** Fade-up on scroll, staggered

#### Component 15: Service Number Card `Stable`
- **Number badge:** `bg-red-500 text-white font-bold text-[28px]`, 48x56px
- **Dashed connector:** `border-l-2 border-dashed neutral-300`, h-16
- **Title:** H3, `--color-subheading`
- **Subtitle:** Body, `--color-body`
- **Description:** Body, `--color-body-muted`

#### Component 16: Advantage Card (Hover Reveal) `Stable`
- **Image:** Full card, `object-cover`
- **Hover overlay:** `from-red-500/70` gradient
- **Hover text:** Title + description fade-slide in
- **Animation:** `opacity 0→1`, `translate-y-[8px]→0`, 300ms
- **Keyboard:** Focusable, shows overlay on focus
- **ARIA:** `role="article"`, content visible to screen readers regardless of hover state

#### Component 17: Leader Card `Stable`
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

### 5.6 Form Elements

#### Component 18: Text Input `Stable`
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

#### Component 19: Dark Input (Contact Form) `Stable`
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

#### Component 21: Textarea `Stable`
- **Height:** `h-40` (160px), resizable vertically
- **Same styling as Text Input (light) or Dark Input per context**
- **Character count recommended for forms**

#### Component 22: Subscribe Input (Footer) `Stable`
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

#### Component 25: Floating Badge (Pill) `Stable`
- **Dimensions:** `w-[262px] py-1`
- **Border:** `1px solid red-500`
- **Border-radius:** `49px` (pill)
- **Background:** White
- **Icon:** Check circle, `text-red-500`
- **Text:** Body (16px), `--color-subheading`
- **Animation:** Slide-in from right, stagger base 400ms + 100ms per item

#### Component 26: Testimonial Dot `Stable`
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

#### Component 28: Consultation Box (Floating) `Stable`
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

#### Component 30: Badge / Tag `Planned`
- **Sizes:** SM (20px height), MD (24px height), LG (28px height)
- **Variants:**
  - Filled: `bg-red-50 text-red-700`, `bg-navy-50 text-navy-700`
  - Outline: `border border-red-500 text-red-500`
- **Border-radius:** `pill` (49px)
- **Padding:** `px-3 py-0.5`
- **Usage:** Job categories, blog tags, case study filters

#### Component 31: Alert Banner `Planned`
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

#### Component 35: Image with Hover Zoom `Stable`
- **Container:** `overflow-hidden rounded-lg`
- **Image:** `object-cover w-full h-full`
- **Hover:** `scale(1.05)`, 300ms ease-out
- **Focus:** Same scale as hover (for keyboard users on linked images)

#### Component 36: Swap Grid `Stable`
- **Layout:** 3 rows — full-width / 2-col split / full-width
- **Heights:** 200px (full rows), 130px (split row)
- **Split ratio:** `flex-[2]` / `flex-1`
- **Gap:** 16px (`gap-4`)
- **Interaction:** 1-second hover timer swaps image to top position

#### Component 37: Partner Logo Marquee `Stable`
- **Container:** `h-[50px]`, masked edges (gradient fade)
- **Items:** `w-[120px] h-[50px]`, absolutely positioned
- **Animation:** `scrollLeft` keyframe, 30s linear infinite
- **Pause:** Pauses on hover
- **Reduced motion:** Static grid fallback, no animation
- **ARIA:** `aria-label="Our Partners"`, individual logos have `alt` text

#### Component 38: Testimonial Slider `Stable`
- **Engine:** react-slick
- **Layout:** 2-column (image | content) on desktop, stacked on mobile
- **Image:** Circular on mobile (150x150), full-height on desktop
- **Quote icon:** 64x64 red box with white Quote icon
- **Autoplay:** 5000ms interval
- **Dots:** Custom (Component 26)
- **Keyboard:** Arrow keys to navigate slides
- **ARIA:** `role="region"`, `aria-label="Client testimonials"`, `aria-live="polite"` for auto-advance
- **Reduced motion:** Autoplay disabled, instant transitions

#### Component 39: Footer `Stable`
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

### 7.3 Common Layout Templates

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

## 8. Animation & Motion

### 8.1 Easing Curves

| Token | Value | Usage |
|-------|-------|-------|
| `ease-productive` | `cubic-bezier(0.2, 0, 0.38, 0.9)` | Standard UI transitions (buttons, toggles, inputs) |
| `ease-expressive` | `cubic-bezier(0.4, 0.14, 0.3, 1)` | Emphasis moments (hero reveals, section entries) |
| `ease-enter` | `cubic-bezier(0, 0, 0.3, 1)` | Elements appearing (modals, toasts, dropdowns) |
| `ease-exit` | `cubic-bezier(0.4, 0, 1, 1)` | Elements leaving (modal close, toast dismiss) |

### 8.2 Duration Scale

| Token | Value | Usage |
|-------|-------|-------|
| `duration-instant` | 100ms | Focus rings, color changes |
| `duration-fast` | 150ms | Button hover, link hover, icon rotation |
| `duration-normal` | 200ms | Dropdowns, accordion, tooltip |
| `duration-moderate` | 300ms | Card hover, image zoom, slide transitions |
| `duration-slow` | 450ms | Scroll-reveal entrance |
| `duration-slower` | 600ms | Hero/page-level reveals |

### 8.3 Scroll-Reveal System

Uses custom `useInView` hook (IntersectionObserver, threshold 0.1):

| Property | Hidden State | Visible State | Duration | Easing |
|----------|-------------|---------------|----------|--------|
| Fade Up | `translate-y-[30px] opacity-0` | `translate-y-0 opacity-100` | 450ms | `ease-expressive` |
| Fade Right | `translate-x-[30px] opacity-0` | `translate-x-0 opacity-100` | 450ms | `ease-expressive` |

> **Change from v1.0:** Translate distance reduced from 50px to **30px** for subtlety. Large translate distances feel sluggish.

### 8.4 Stagger Pattern (Revised)

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

### 8.5 Interaction Animations

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

### 8.6 Motion Principles

1. **Enter from bottom or right.** Never from top (feels like falling) or left (fights reading direction).
2. **Exit by fading.** Elements leave by fading out, not sliding out. Simpler, less distracting.
3. **Duration range:** 100ms (micro) — 600ms (page reveal). **Never exceed 600ms.**
4. **Stagger cap:** 800ms total for any group.
5. **One motion per element.** Don't combine scale + translate + rotate. Pick one transform.
6. **Respect `prefers-reduced-motion`.** Disable transforms entirely. Keep opacity fades but make them instant.

### 8.7 Reduced Motion

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

### 9.2 Color Contrast

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

### 9.3 Keyboard Navigation

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

## 10. Design Tokens (JSON) — Three-Tier Architecture

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

## 11. CSS Custom Properties

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

## 12. Figma Implementation Guide

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
