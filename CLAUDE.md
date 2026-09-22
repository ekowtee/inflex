# Project Rules — Inflexions IT Website

## Navbar (Header.tsx) — partly locked
Rebuilt 22 September 2026 with the owner's approval. Do NOT change the items marked locked; the rest may evolve with the redesign.

- **Logo (LOCKED — owner decision):** absolutely positioned in the left margin, centred between the viewport edge and the content area, `calc((100vw - 80rem) / 4 + 1rem)`. Hidden on mobile, where a centred logo sits in the bar. Never move it, even though it clips at some widths.
- **Nav links (locked order):** Home, About, Solutions (dropdown), Services (dropdown), Academy (dropdown), Case study, Careers. Left-aligned inside the `max-w-7xl` container.
- **Contact us:** desktop keeps the full-height (`h-16`) red block, right-aligned. Mobile uses a compact `h-9` pill; the full-screen menu carries a full-width red Contact button as its one red element.
- **Social icons:** between the nav links and Contact on desktop; bottom row of the mobile menu.
- **Container:** `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
- **Height:** `h-14` on mobile, `h-16` desktop, fixed to top with `z-50`.
- **Registers:** transparent over any element carrying `data-header-dark` (the home hero), with the light logo `/inflexlogo-light.png` and silver links; solid white with a hairline once scrolled past it and on every other page. Keep both registers working when editing.
- **Dropdown state (locked pattern):** a single `openDropdown` (string | null) controls which menu is open on desktop and which accordion is open in the mobile menu. Extend this, never add per-menu booleans.
- **Icons:** Lucide only (Menu, X, ChevronDown).

## Offering Categories
Three peer top-level offerings. Do not confuse them or fold one into another:
- **Solutions** (`/solutions/*`) — "What we build". Four pillars: Network Infrastructure, Data Security, Cloud Services, Data-centric Solutions.
- **Services** (`/services/*`) — "How we engage". Professional, Managed, Support.
- **Academy** (`/academy/*`) — "How we upskill". Four competency domains: AI & Intelligent Systems, Infrastructure & Cloud, Cybersecurity & Compliance, Digital Strategy. Plus `/academy/for-organizations` for enterprise training enquiries.

## Academy Data
- Domains and programmes are defined in `src/app/academy/data.ts` as typed static data (no CMS/LMS). Dynamic routes use `generateStaticParams` so all programme pages are pre-rendered at build time.
- Programmes are person-independent: no instructor profiles, no "meet your trainer" sections. Credibility comes from collective domain expertise.
- Solution pages cross-link to the Academy via `RelatedTraining` (maps solution slug → academy domain).

## Reference Documents
- **PRD.md**: Full product requirements document (site architecture, page specs, design system, content). Always consult before building new pages or components.
- **ACADEMY_PROPOSAL.md**: Director-facing strategic brief for Inflexions Academy.
- **ACADEMY_IMPLEMENTATION_PLAN.md**: Technical blueprint that drove the Academy build.
- **CREATIVE_DIRECTION_3D.md**: Creative direction and phased build order for the premium 3D redesign (the "Core" object, Obsidian/Ivory registers, motion tokens, performance gates). Consult before any front-end redesign work.
- **SCROLL_NARRATIVE.md**: Home page narrative spec (beat order, visitor question ladder, copy sheet, thread motif). Supersedes Section 7 of CREATIVE_DIRECTION_3D.md for the home page.
- **HERO_SCENE_SPEC.md**: Hero 3D scene spec (palette in linear space, device tiers, loading budget, camera keyframes, shader lighting rig, geometry limits, cursor interaction, poster fallback). Authoritative for the hero; revises parts of CREATIVE_DIRECTION_3D.md Section 6.
- **COPY_DECK.md**: Full home page text layer in two tonal variants (A Precision, B Momentum) with offer, objection and proof analysis, pricing frame and CTA. SCROLL_NARRATIVE.md copy sheet stays the baseline until the owner picks a variant.
- **PERFORMANCE_PLAN.md**: Measured baseline, corrected chunk budgets (shell 205 / motion 60 / environment 190 KB gz), render cost per scene, image compression plan, lazy-load order, first-paint targets and gates. Overrides the budget numbers in CREATIVE_DIRECTION_3D.md and HERO_SCENE_SPEC.md.

## Known Issue: `.next` cache corruption
On Windows, the `.next` build cache frequently corrupts when files change while the dev server is running, producing `ENOENT: no such file or directory` errors for `app-build-manifest.json` or `_buildManifest.js.tmp`. Fix: `rm -rf .next` and restart the dev server.

## Tech Stack
- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 (CSS-first config via `@theme` in globals.css, NO tailwind.config.js)
- Fonts: Rubik (headings), Krub (body)
- Brand color: `--color-primary: #D0281F`
