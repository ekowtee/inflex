/**
 * The formation track — CREATIVE_DIRECTION_3D.md §9 Phase 3,
 * SCROLL_NARRATIVE.md §8.5.
 *
 * A pure function from a position on the narrative's virtual timeline (in
 * viewport heights, the unit timeline.ts reports) to everything the scene
 * needs about the object's shape: which formation it is leaving and
 * entering, how far through the morph, the Beat 2 noise, the ember gate and
 * the ground grid. The scene evaluates it every frame at its own smoothed
 * position, which is what makes a fast scroll read as a scrub rather than a
 * skipped film; nothing here knows about time.
 *
 *   Beat 1        the sheet comes apart: noise rises, the ember line
 *                 goes out right to left.
 *   Beat 2        noise to order: the sheet resolves, reshapes into y = x³
 *                 and the camera rises to see it in profile, the ember
 *                 line relighting left to right at the inflection. Most important motion on the page,
 *                 spread across the whole beat so a fast scroller still sees
 *                 order arrive.
 *   Beat 3        rest (the Core is at 0.3 behind the proof).
 *   end of 3      the morph to the network fabric begins, so the pillars arrive
 *                 already in motion.
 *   Beat 4        four pillars, 80 vh each: network fabric, shield, nebula,
 *                 plane. Each morph straddles the boundary between two rows,
 *                 16 vh either side, so the first and last 20% of every
 *                 sub-range hold still.
 *   after 4       the Core fades out, and while hidden it resets to the
 *                 sheet for the intelligence band and the ask.
 *   Beat 5.5      the intelligence band: warmth spreads from the ember
 *                 line through the whole sheet ("it is the fabric"), rising
 *                 while the band comes up and holding until it leaves.
 *   Beat 8        the ask: the warmth gathers back into the line as the
 *                 chapter comes into view (store.askEntry), then, over the
 *                 pinned chapter, the line becomes the Inflexions mark and
 *                 bloom rises to its only peak. The page's visual full stop.
 */
import { BEAT_START_VH } from "./timeline";

export type FormationIndex = 0 | 1 | 2 | 3 | 4 | 5;

export interface SceneState {
  from: FormationIndex;
  to: FormationIndex;
  mix: number;
  noise: number;
  /** Ember gate from the page's side; the scene takes min() with the arrival light. */
  gate: number;
  ground: number;
  /** Beat 5.5: how far warmth has spread from the line through the sheet, 0 to 1. */
  spread: number;
  /** Bloom intensity for the post stage. Rises only in the mark reveal. */
  bloom: number;
  /** Beat 2: how far the sheet has reshaped into y = x³, 0 to 1. */
  bend: number;
}

/** Resting bloom, and its peak in the mark reveal (SCROLL_NARRATIVE.md §6 Beat 8). */
export const BLOOM_REST = 0.55;
export const BLOOM_REVEAL = 0.9;

/** Row i of the pinned chapter shows formation PILLAR_FORMATION[i]. */
export const PILLAR_FORMATION: readonly FormationIndex[] = [1, 2, 3, 4];

/** Sub-range length and morph half-width inside Beat 4, in vh. */
export const PILLAR_VH = 80;
export const MORPH_HALF_VH = 16;

/** The ground grid shows under the network fabric and the plane. */
const GROUND: Record<number, number> = { 0: 0, 1: 1, 2: 0, 3: 0, 4: 1, 5: 0 };

const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const smooth = (t: number) => {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * clamp01(t);

/** Virtual vh at which formation `f` (1 to 4) is fully formed and holding. */
export function pillarHoldVh(f: number): number {
  const i = PILLAR_FORMATION.indexOf(f as FormationIndex);
  return BEAT_START_VH[4] + PILLAR_VH * Math.max(0, i) + MORPH_HALF_VH;
}

export function sceneStateAt(vh: number): SceneState {
  const b1 = BEAT_START_VH[1];
  const b2 = BEAT_START_VH[2];
  const b3 = BEAT_START_VH[3];
  const b4 = BEAT_START_VH[4];
  const b5 = BEAT_START_VH[5];
  const b55 = BEAT_START_VH[5.5];
  const b8 = BEAT_START_VH[8];
  const b9 = BEAT_START_VH[9];

  const rest: SceneState = { from: 0, to: 0, mix: 0, noise: 0, gate: 1.3, ground: 0, spread: 0, bloom: BLOOM_REST, bend: 0 };

  // ─── Beats 0 to 3: the sheet, its unmaking and its resolve ─────────────
  if (vh < b3 - 20) {
    if (vh < b1) return rest;
    if (vh < b2) {
      const t = smooth((vh - b1) / (b2 - b1));
      return { ...rest, noise: 0.35 * t, gate: lerp(1.3, -0.3, t) };
    }
    // The resolve takes the whole of Beat 2; the ember relights behind the
    // order, over its last two thirds.
    const span = b3 - 20 - b2;
    const t = (vh - b2) / span;
    return {
      ...rest,
      // The chapter's heading reaches the top of the screen about a fifth of
      // the way through the beat, so order arrives by then: the tangle
      // resolves as the heading rises, and the S and the relit line are
      // there to read beside it.
      noise: 0.35 * (1 - smooth(t / 0.25)),
      gate: lerp(-0.3, 1.3, smooth((t - 0.08) / 0.27)),
      bend: smooth((t - 0.04) / 0.26),
    };
  }

  // ─── into and through the pillars ──────────────────────────────────────
  if (vh < b5 + 30) {
    // The bend holds through the proof and relaxes before the network fabric
    // morph begins, where the resting sheet (and so the bend) ends.
    const bend = 1 - smooth((vh - (b4 - 64)) / 38);
    if (vh < b4 - 24) return { ...rest, bend };
    // Boundaries where formation k hands to k+1: the first sits 20 vh before
    // the pin so the network fabric is already forming as the chapter arrives.
    const boundaries = [b4 - 4, b4 + PILLAR_VH, b4 + PILLAR_VH * 2, b4 + PILLAR_VH * 3];
    const seq: FormationIndex[] = [0, ...PILLAR_FORMATION];
    for (let k = 0; k < boundaries.length; k += 1) {
      const c = boundaries[k];
      const half = k === 0 ? 20 : MORPH_HALF_VH;
      if (vh < c + half) {
        if (vh <= c - half) {
          const f = seq[k];
          return { ...rest, from: f, to: f, ground: GROUND[f] };
        }
        const t = smooth((vh - (c - half)) / (2 * half));
        const from = seq[k];
        const to = seq[k + 1];
        return { ...rest, from, to, mix: t, ground: lerp(GROUND[from], GROUND[to], t) };
      }
    }
    return { ...rest, from: 4, to: 4, ground: GROUND[4] };
  }

  // ─── the intelligence band: the sheet, warmth spreading through it ────
  // Starts while the Core is still fading up under the ledger's Ivory, so
  // the spread is well under way when the band's top reaches the viewport
  // top, and completes over the band's own scroll.
  // The spread holds through the hidden stretch and into the ask; the
  // gathering back into the line runs on the ask's entry (store.askEntry,
  // applied in the scene), not on the timeline, which holds still while a
  // chapter comes into view.
  if (vh >= b55 - 40 && vh < b8) {
    return { ...rest, spread: smooth((vh - (b55 - 40)) / 70) };
  }

  // ─── the ask: the line becomes the mark ────────────────────────────────
  // The chapter is pinned on desktop for one screen past its entry. The
  // warmth has gathered back into the line on the way in (the scene, on
  // store.askEntry); over the pin the line morphs into the mark and bloom
  // rises to its one peak. Held through the doors while the Core fades.
  if (vh >= b8 && vh < b9 + 40) {
    const t = smooth((vh - (b8 + 6)) / 64);
    return { ...rest, to: 5, mix: t, bloom: BLOOM_REST + (BLOOM_REVEAL - BLOOM_REST) * t };
  }

  // ─── otherwise: hidden, reset to the sheet ─────────────────────────────
  return rest;
}
