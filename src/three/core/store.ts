/**
 * The bridge between scroll and the scene — CREATIVE_DIRECTION_3D.md §8.3.
 *
 * Plain mutable numbers. ScrollTrigger callbacks write them; the render loop
 * reads them every frame. No React state crosses this boundary per frame,
 * which is what keeps the scene at 60 fps: a React commit on scroll would
 * cost more than the whole draw.
 */

export type Formation = 0 | 1 | 2 | 3 | 4 | 5;

export interface CoreStore {
  /** Page scroll progress in viewport heights (0 at the top). */
  scrollVh: number;
  /** Formation being left and formation being entered. */
  from: Formation;
  to: Formation;
  /** 0 = fully `from`, 1 = fully `to`. */
  mix: number;
  /** Noise displacement amplitude for the Beat 2 resolve, 0 to 0.35. */
  noise: number;
  /** Ember line gate for the arrival light, −0.3 to 1.3. */
  heatGate: number;
  /** Bloom intensity, 0.55 normally, 0.9 in the mark reveal. */
  bloom: number;
  /** Scene opacity, 0 when hidden behind Ivory beats. */
  opacity: number;
  /** Ground grid alpha, 0 except in formations 1 and 4. */
  ground: number;
  /** Raw pointer in [−1, 1], written by the pointer listener. */
  pointerX: number;
  pointerY: number;
  /** Whether the visitor has scrolled past the arrival (skips the light). */
  scrolledPastArrival: boolean;
  /**
   * Set by the scene when the ember node (Beat 2) or column cap (Beat 4)
   * reaches its detachment point: viewport coordinates for the Thread.
   */
  threadX: number;
  threadY: number;
  threadReady: boolean;
  /**
   * Viewport x, in CSS px, of the two points the threads are born from:
   * the foot of the sheet's ember line (Beat 2) and the cap of the tallest
   * ember column of the plane (Beat 4). Written by the scene every frame.
   */
  thread2X: number;
  thread4X: number;
  /**
   * How far the ask chapter has come into view: 0 with its top at the
   * viewport bottom, 1 with its top at the viewport top. The timeline holds
   * still while a chapter enters (it keys off the chapter under the
   * viewport top), so the one motion that must happen during an entry, the
   * fabric gathering back into the line, is driven from this instead.
   */
  askEntry: number;
}

export const store: CoreStore = {
  scrollVh: 0,
  from: 0,
  to: 0,
  mix: 0,
  noise: 0,
  heatGate: -0.3,
  bloom: 0.55,
  opacity: 1,
  ground: 0,
  pointerX: 0,
  pointerY: 0,
  scrolledPastArrival: false,
  threadX: 0,
  threadY: 0,
  threadReady: false,
  thread2X: 0,
  thread4X: 0,
  askEntry: 0,
};

/** Reset to the arrival state. Used when the scene mounts and on route change. */
export function resetStore(): void {
  store.scrollVh = 0;
  store.from = 0;
  store.to = 0;
  store.mix = 0;
  store.noise = 0;
  store.heatGate = -0.3;
  store.bloom = 0.55;
  store.opacity = 1;
  store.ground = 0;
  store.scrolledPastArrival = false;
  store.threadReady = false;
}
