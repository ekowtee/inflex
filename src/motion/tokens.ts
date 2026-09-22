/**
 * Motion tokens — CREATIVE_DIRECTION_3D.md §8.1.
 *
 * No component writes its own easing or duration. Bounce, elastic, back and
 * any overshoot are banned.
 *
 * globals.css mirrors these as CSS custom properties (--motion-*) for the
 * CSS-driven reveals that run before the motion chunk loads. The two are kept
 * in step by src/motion/__tests__/tokens.test.ts, which fails if they drift.
 */

export const duration = {
  micro: 120, // colour, opacity on hover
  ui: 240, // dropdowns, toggles, tabs
  reveal: 480, // text and card entrances
  scene: 900, // poster crossfade, register changes
  morph: 1600, // Core formation change (when not scrubbed)
} as const;

export const ease = {
  out: "cubic-bezier(0.16, 1, 0.3, 1)", // expo-out: entrances, hovers
  inOut: "cubic-bezier(0.76, 0, 0.24, 1)", // quart in-out: scrubs, morphs
  exit: "cubic-bezier(0.7, 0, 0.84, 0)", // expo-in: exits only
} as const;

export const stagger = { lines: 60, rows: 40, cards: 60, max: 600 } as const;

export const distance = { reveal: 16, line: 12, parallaxMax: 40 } as const;

/** GSAP names for the same three curves. */
export const gsapEase = {
  out: "expo.out",
  inOut: "power4.inOut",
  exit: "expo.in",
} as const;

export type Duration = keyof typeof duration;
export type Ease = keyof typeof ease;
