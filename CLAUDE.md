# Project Rules — Inflexions IT Website

## Navbar (Header.tsx) — LOCKED
Do NOT modify the navbar layout, positioning, or structure unless the user explicitly requests it. The following are locked:

- **Logo**: Absolutely positioned in the left margin, centered between the left viewport edge and the content area. Uses `calc((100vw - 80rem) / 4 + 1rem)` for left positioning. Hidden on mobile.
- **Nav links**: Left-aligned inside the `max-w-7xl` container. Order: Home, About, Solutions (dropdown), Services (dropdown), Academy (dropdown), Case study, Careers.
- **Contact us button**: Right-aligned, full navbar height (`h-16`), red background (`bg-red-600`).
- **Social icons**: Between nav links and Contact button on desktop, in mobile menu on mobile.
- **Container**: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` — all nav items and the Contact button sit within these margins.
- **Height**: `h-16` (64px), fixed to top with `z-50`.
- **Dropdown state**: Single `openDropdown` state (string | null) controls which menu is open — extend this state pattern when adding new dropdowns, don't add per-menu booleans.

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

## Known Issue: `.next` cache corruption
On Windows, the `.next` build cache frequently corrupts when files change while the dev server is running, producing `ENOENT: no such file or directory` errors for `app-build-manifest.json` or `_buildManifest.js.tmp`. Fix: `rm -rf .next` and restart the dev server.

## Tech Stack
- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 (CSS-first config via `@theme` in globals.css, NO tailwind.config.js)
- Fonts: Rubik (headings), Krub (body)
- Brand color: `--color-primary: #D0281F`
