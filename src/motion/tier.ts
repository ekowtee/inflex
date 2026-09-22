/**
 * Motion tier decision — HERO_SCENE_SPEC.md §9.2.
 *
 *   A  full scene, post-processing, pointer parallax
 *   B  reduced scene, no post, touch drift
 *   C  posters only; the environment chunk is never downloaded
 *
 * The decision is split into a pure function over an explicit environment so
 * it can be unit tested, and a reader that samples the real browser. The
 * runtime frame-time probe that can demote a tier belongs to Phase 1 and is
 * deliberately not implemented here.
 */

export type Tier = "A" | "B" | "C";

export interface TierEnv {
  /** prefers-reduced-motion: reduce */
  reducedMotion: boolean;
  /** navigator.connection.saveData */
  saveData: boolean;
  /** prefers-reduced-data: reduce */
  reducedData: boolean;
  /** a webgl2 context could be created */
  hasWebGL2: boolean;
  /** navigator.deviceMemory, in GB; undefined when unreported */
  deviceMemory?: number;
  /** navigator.hardwareConcurrency; undefined when unreported */
  hardwareConcurrency?: number;
  viewportWidth: number;
  /** the primary pointer is coarse (touch) */
  coarsePointer: boolean;
}

const DESKTOP_MIN_WIDTH = 1024;

/** Pure tier decision. The seven steps run in order; the first match wins. */
export function decideTier(env: TierEnv): Tier {
  if (env.reducedMotion) return "C";
  if (env.saveData || env.reducedData) return "C";
  if (!env.hasWebGL2) return "C";
  if (env.deviceMemory !== undefined && env.deviceMemory < 4) return "C";
  if (env.hardwareConcurrency !== undefined && env.hardwareConcurrency < 4) {
    return env.viewportWidth >= DESKTOP_MIN_WIDTH ? "B" : "C";
  }
  if (env.viewportWidth < DESKTOP_MIN_WIDTH || env.coarsePointer) return "B";
  return "A";
}

interface ConnectionLike {
  saveData?: boolean;
}

function detectWebGL2(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2"));
  } catch {
    return false;
  }
}

/** Sample the current browser. Safe to call only on the client. */
export function readTierEnv(): TierEnv {
  const nav = navigator as Navigator & {
    connection?: ConnectionLike;
    deviceMemory?: number;
  };

  return {
    reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
    saveData: nav.connection?.saveData === true,
    reducedData: matchMedia("(prefers-reduced-data: reduce)").matches,
    hasWebGL2: detectWebGL2(),
    deviceMemory: nav.deviceMemory,
    hardwareConcurrency: nav.hardwareConcurrency,
    viewportWidth: window.innerWidth,
    coarsePointer: matchMedia("(pointer: coarse)").matches,
  };
}
