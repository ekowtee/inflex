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
  /** the context is a software renderer (SwiftShader, llvmpipe): never worth the Core */
  softwareGl?: boolean;
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
  if (env.softwareGl) return "C";
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

const SOFTWARE_GL = /swiftshader|llvmpipe|software|mesa offscreen|basic render/i;

function detectWebGL2(): { hasWebGL2: boolean; softwareGl: boolean } {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2");
    if (!gl) return { hasWebGL2: false, softwareGl: false };
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = String(info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
    return { hasWebGL2: true, softwareGl: SOFTWARE_GL.test(renderer) };
  } catch {
    return { hasWebGL2: false, softwareGl: false };
  }
}

/** Sample the current browser. Safe to call only on the client. */
export function readTierEnv(): TierEnv {
  const nav = navigator as Navigator & {
    connection?: ConnectionLike;
    deviceMemory?: number;
  };

  const gl = detectWebGL2();
  return {
    reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
    saveData: nav.connection?.saveData === true,
    reducedData: matchMedia("(prefers-reduced-data: reduce)").matches,
    hasWebGL2: gl.hasWebGL2,
    softwareGl: gl.softwareGl,
    deviceMemory: nav.deviceMemory,
    hardwareConcurrency: nav.hardwareConcurrency,
    viewportWidth: window.innerWidth,
    coarsePointer: matchMedia("(pointer: coarse)").matches,
  };
}
