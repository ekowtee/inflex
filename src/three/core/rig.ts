/**
 * The lighting rig and palette in linear space — HERO_SCENE_SPEC.md §1 and §6.
 *
 * Colours are authored as sRGB in globals.css and used here in linear. The
 * renderer converts back on output with AgX tone mapping.
 */
import { Color, Vector3 } from "three";

const linear = (hex: string) => new Color(hex).convertSRGBToLinear();

export const palette = {
  obsidian950: linear("#07080B"),
  obsidian900: linear("#0A0C10"),
  graphite: linear("#8F8D8D"),
  silver300: linear("#C9CBD1"),
  silver100: linear("#E6E7EA"),
  ember: linear("#FF3B2F"),
} as const;

export const lights = {
  /** From upper-left-front. Sets the graphite-to-silver gradient. */
  key: new Vector3(-0.55, 0.75, 0.37).normalize(),
  /** From behind-right. Separates the far silhouette from the obsidian. */
  rim: new Vector3(0.65, 0.15, -0.74).normalize(),
} as const;

export const atmosphere = {
  fogDensity: 0.085,
  vignetteOffset: 0.35,
  vignetteDarkness: 0.6,
  noise: 0.035,
} as const;

export const bloom = {
  /** Resting intensity; the mark reveal raises it to `reveal`. 0.55 read as a solid bar at poster scale. */
  rest: 0.38,
  reveal: 0.7,
  /** Ember target is rendered at this fraction of the canvas. */
  emberScale: 0.5,
  /** Blur runs at this fraction of the ember target. */
  blurScale: 0.5,
} as const;

export const nodes = {
  /**
   * Base point size in CSS px before DPR and distance. The soft-disc
   * fragment needs a core radius of at least a pixel to read as a point, so
   * the floor is 2.5 CSS px; below that a dense sheet renders as specks.
   */
  size: 3.6,
  idleAmplitude: 1,
} as const;

/** Canvas pixel cap (PERFORMANCE_PLAN.md §3.1): never above 4.2 megapixels. */
export const MAX_CANVAS_PIXELS = 4.2e6;
export const MAX_DPR = 1.75;

export function dprFor(width: number, height: number, devicePixelRatio: number): number {
  const byPixels = Math.sqrt(MAX_CANVAS_PIXELS / Math.max(1, width * height));
  return Math.max(1, Math.min(devicePixelRatio, byPixels, MAX_DPR));
}
