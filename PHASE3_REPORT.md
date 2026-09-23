# Phase 3 Report — Formations and the pinned pillars

**Branch:** `phase-3-formations`, off `main` at `cfcb7a1`.
**Date:** 23 September 2026.

The Core now changes shape with the scroll. Until Phase 2 it held its resting sheet the whole way down the page.

## 1. What was built

| Piece | Where | Notes |
|---|---|---|
| Formation track | `src/three/core/formationTrack.ts` | A pure function from the virtual timeline (vh) to formation from/to, mix, Beat 2 noise, ember gate and ground grid. Six unit tests lock the resolve, the holds, one-formation-at-a-time morphs and continuity across the whole pinned chapter. |
| Smoothing | `CoreScene.ts` | The scene eases its own timeline position toward the reader's with a 0.22 s time constant (the equivalent of a 0.8 s scrub), so a fast scroll reads as intent rather than a skipped film. |
| Beat 1 and 2 | track | The sheet comes apart through the trust strip (noise to 0.35, ember out right to left) and resolves across the whole of Beat 2, the ember relighting left to right behind the order. |
| Beat 4 morphs | track, `camera.ts` | Lattice, enclosure, nebula, plane, 80 vh each. Each morph straddles a row boundary, 16 vh either side, so the first and last 20 % of every row hold still. The lattice begins forming just before the pin. Ground grid under the lattice and the plane. |
| Camera | `camera.ts` | One key per chapter. In the pillars the camera pulls back, shifts the look-at so the object's centre sits at about 72 % of the width, and orbits about 18° per formation; it holds while a formation holds and moves only during the morph. It resets to the hero composition while hidden, for the intelligence band and the ask. |
| Composition by aspect | `CoreScene.ts` | Portrait centres the pillar formations (they were half off a phone screen). Narrow landscape, 1024 × 768, pulls back and pushes the object further right, clear of the copy. |
| Threads | `timeline.ts`, `globals.css` | The scene projects two anchors every frame: the foot of the sheet's ember line and the cap of the plane's tallest ember column. The spine places the Beat 2 thread once the sheet has resolved and the Beat 4 thread on the last row; placing a thread is what draws it, so the line falls from the object rather than appearing. Unplaced, it is collapsed. |
| Phone posters | `public/three/posters/f1..f4-lit-mobile.*`, `Pillars.tsx` | One poster per formation, captured from the real scene by `capture-posters.mjs --formations 1,2,3,4 --sizes mobile --lights lit`. 30 to 89 KB WebP. |
| Point scale | `CoreScene.ts` | Points scale with viewport height above 900 px, up to 1.6×: at 2560 × 1440 the formations read as dust. |
| Capture stage | `core-capture/CaptureStage.tsx` | Now holds the requested formation every frame (every capture had silently come out as the sheet, because the canvas resets the store when it mounts) and uses each formation's page camera. |
| Lattice ember | `formations.ts` | 16 traffic walks, not 26: at 26 the lattice read as noise. |
| Tests | `package.json` | The scene's tests (`src/three/core/__tests__`) were never in the test script. They are now: 84 tests, all passing. |

## 2. Gate 3

| Check | Result |
|---|---|
| Morphs hold 60 fps on the desktop reference and never tear under fast scroll | **1440 × 900, Tier A, Intel Iris Xe:** 60 fps slow and fast, 95th-percentile frame 18.6 ms, worst 29 ms. **1920 × 1080:** 58 to 59 fps, 95th percentile 19.6 to 22.4 ms, occasional spikes to about 60 ms. No tearing: the mix is continuous by test and by eye. The Iris Xe is below the plan's desktop reference; a discrete GPU is the real check. |
| Rows reachable by keyboard and screen reader with correct `aria-current` | Unchanged from Phase 2, still passing: focus on a row scrolls the pin to it, `aria-current` follows the active row. |
| No copy obscured by the object from 1024 px up | Checked at 1024, 1280, 1440, 1920 and 2560, first and last rows. Clear at all five after the narrow-landscape correction. |
| Tier B at 50 % node count | All four formations read. The lattice is the weakest: a fine grey box with sparse ember. |

**At 2560 × 1440 this laptop demotes to Tier B**, by design: its integrated GPU fails the startup probe at 3.7 megapixels with bloom, then holds 60 fps on Tier B. A 2560 monitor with a discrete GPU should stay on Tier A.

## 3. Not in this phase

- **The mark (formation 5)** is Phase 4 and needs the mark silhouette asset.
- **A literal detaching node** (a single ember point falling out of the object) is not built: the thread is placed at the projected node and drawn down from it. The spec's own wording asks for the placement; the falling point is a Phase 6 polish candidate.
- **Posters for Tier C on desktop** in the pillars: desktop Tier C still shows the resting poster behind the whole page, not per-row formations.

## 4. Owner checks

1. On a desktop, scroll slowly from the hero into the pillars and through all four rows. The sheet should scatter, pull back into order with the ember line relighting, then become the lattice as the pin arrives, and change once per row.
2. Scroll the same stretch fast. It should read as a continuous scrub, never jump.
3. On a phone, the pillars show one poster per row, all four different.
