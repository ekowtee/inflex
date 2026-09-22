/**
 * Damped pointer for parallax and proximity — HERO_SCENE_SPEC.md §8.
 *
 * The maximum angular velocity is bounded by the damping, so a fast sweep
 * produces a slow, heavy tilt. 0.06 is the feel parameter; never above 0.09.
 */
import { store } from "./store";

export const YAW_MAX = (4 * Math.PI) / 180;
export const PITCH_MAX = (2.5 * Math.PI) / 180;
export const PARALLAX_DAMPING = 0.06;
export const PROXIMITY_DAMPING = 0.08;

export interface PointerState {
  /** Damped normalised pointer in [−1, 1]. */
  x: number;
  y: number;
  /** Damped world-space pointer on the z = 0 plane. */
  worldX: number;
  worldY: number;
  /** True when a fine pointer has been seen this session. */
  active: boolean;
}

export const pointer: PointerState = { x: 0, y: 0, worldX: 0, worldY: 0, active: false };

/** Frame-rate independent damping factor for a per-60Hz rate. */
export function damp(rate: number, dtSeconds: number): number {
  return 1 - Math.pow(1 - rate, dtSeconds * 60);
}

/**
 * Advance the damped values toward the raw store values. `unproject` maps a
 * normalised pointer to world x/y on the z = 0 plane for the current camera.
 */
export function stepPointer(
  dtSeconds: number,
  unproject: (nx: number, ny: number) => [number, number]
): void {
  const kParallax = damp(PARALLAX_DAMPING, dtSeconds);
  pointer.x += (store.pointerX - pointer.x) * kParallax;
  pointer.y += (store.pointerY - pointer.y) * kParallax;

  const [wx, wy] = unproject(store.pointerX, store.pointerY);
  const kProx = damp(PROXIMITY_DAMPING, dtSeconds);
  pointer.worldX += (wx - pointer.worldX) * kProx;
  pointer.worldY += (wy - pointer.worldY) * kProx;
}

/** Attach window listeners. Returns a disposer. No-op for coarse pointers. */
export function attachPointer(): () => void {
  if (typeof window === "undefined") return () => {};
  if (matchMedia("(pointer: coarse)").matches) return () => {};

  const onMove = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    pointer.active = true;
    store.pointerX = (event.clientX / window.innerWidth) * 2 - 1;
    store.pointerY = -((event.clientY / window.innerHeight) * 2 - 1);
  };
  const onLeave = () => {
    store.pointerX = 0;
    store.pointerY = 0;
  };

  window.addEventListener("pointermove", onMove, { passive: true });
  document.documentElement.addEventListener("pointerleave", onLeave);
  return () => {
    window.removeEventListener("pointermove", onMove);
    document.documentElement.removeEventListener("pointerleave", onLeave);
  };
}
