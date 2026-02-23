# Project Rules — Inflexions IT Website

## Navbar (Header.tsx) — LOCKED
Do NOT modify the navbar layout, positioning, or structure unless the user explicitly requests it. The following are locked:

- **Logo**: Absolutely positioned in the left margin, centered between the left viewport edge and the content area. Uses `calc((100vw - 80rem) / 4 + 1rem)` for left positioning. Hidden on mobile.
- **Nav links**: Left-aligned inside the `max-w-7xl` container. Order: Home, About, Solutions (dropdown), Services (dropdown), Case study, Careers.
- **Contact us button**: Right-aligned, full navbar height (`h-16`), red background (`bg-red-600`).
- **Social icons**: Between nav links and Contact button on desktop, in mobile menu on mobile.
- **Container**: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` — all nav items and the Contact button sit within these margins.
- **Height**: `h-16` (64px), fixed to top with `z-50`.

## Reference Documents
- **PRD.md**: Full product requirements document (site architecture, page specs, design system, content). Always consult before building new pages or components.

## Known Issue: `.next` cache corruption
On Windows, the `.next` build cache frequently corrupts when files change while the dev server is running, producing `ENOENT: no such file or directory` errors for `app-build-manifest.json` or `_buildManifest.js.tmp`. Fix: `rm -rf .next` and restart the dev server.

## Tech Stack
- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 (CSS-first config via `@theme` in globals.css, NO tailwind.config.js)
- Fonts: Rubik (headings), Krub (body)
- Brand color: `--color-primary: #D0281F`
