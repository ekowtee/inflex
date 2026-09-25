# Implementation Plan - Accenture Song CX/UX Enhancements

This plan outlines the visual and interactive enhancements proposed to deliver a premium, high-fidelity user experience across the Inflexions site.

---

## User Review Required

> [!IMPORTANT]
> The dynamic grid component `SwapGrid` will be replaced with a **Stable Feature Showcase Grid**. Instead of shifting elements around on hover (which causes layout instability), the cards will remain stationary but react to hovers with elegant background cross-fades, scale-ups, and glow effects.

> [!WARNING]
> The About page Google Map iframe will be updated to focus on **East Legon** to correct the discrepancy with the Tsui Bleoo Rd (Teshie) location.

---

## Proposed Changes

### Component: Navigation & Header

#### [MODIFY] [Header.tsx](file:///c:/Users/ekowt/Projects/inflexionsweb/src/app/components/Header.tsx)
- Reorganize header layout to place the branding logo inside a responsive container that displays a mobile logo badge on small screens and the full logo wordmark on desktop.
- Replace absolute positioning calculations with clean responsive Flexbox.
- Style the header with dynamic frosted glass styling (`bg-white/80 backdrop-blur-md border-b border-neutral-100`) to integrate cleanly with scroll actions.
- Apply smooth cubic-bezier transitions (`transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]`) to dropdown menus and mobile menu transitions.

---

### Component: Strategic Showcase Grid

#### [MODIFY] [SwapGrid.tsx](file:///c:/Users/ekowt/Projects/inflexionsweb/src/app/components/SwapGrid.tsx)
- Rewrite `SwapGrid` to remove the timer-based positioning swap.
- Re-architect as a stable grid where hovered items reveal their descriptions and show a smooth scale-up effect (`group-hover:scale-105 transition-all duration-500`) and subtle crimson drop shadows.

---

### Component: Location Consistency

#### [MODIFY] [page.tsx (About Page)](file:///c:/Users/ekowt/Projects/inflexionsweb/src/app/about/page.tsx)
- Update the Google Map embed iframe source parameters to point directly to coordinates in East Legon, Accra.
- Match the title of the iframe to point to "East Legon" to maintain alignment with the address overlay card.

---

## Verification Plan

### Automated Tests
- Run tests to check if compilation is clean:
  ```powershell
  npm run build
  ```

### Manual Verification
- Resize browser viewport to verify that the brand logo is visible on both mobile and desktop headers.
- Hover dropdown menus to confirm they slide and fade in smoothly using cubic-bezier easing.
- Hover over grid cards in the "Four Pillars" section to check that they remain stable and react with interactive glows instead of shuffling.
- Verify the Google Map on the About page centers on East Legon and resolves the location discrepancy.
