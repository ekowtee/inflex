/**
 * Camera keyframes and composition rules — HERO_SCENE_SPEC.md §5.
 *
 * The camera is the only thing that moves the object on screen; the object
 * never rotates in world space, so the poster (captured at the Hero key)
 * registers exactly with the live scene.
 */
import { Vector3 } from "three";

export const FOV = 32;

export interface CameraKey {
  /** Scroll position in viewport heights. */
  at: number;
  position: Vector3;
  lookAt: Vector3;
}

// Composition chosen from capture rounds on 22 September 2026: the sheet
// sits right of the copy, seen from upper-left so the inflection bends
// through the frame and its lower edge draws the S-curve.
export const keys: CameraKey[] = [
  { at: 0, position: new Vector3(-1.3, 1.3, 6.0), lookAt: new Vector3(-1.0, -0.15, 0) },
  { at: 100, position: new Vector3(-1.1, 1.9, 6.8), lookAt: new Vector3(-0.9, -0.4, 0) },
  { at: 130, position: new Vector3(-0.6, 0.9, 4.9), lookAt: new Vector3(-0.5, -0.05, 0) },
];

/** power4.inOut, the curve behind ease.inOut. */
function quartInOut(t: number): number {
  return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
}

const outPosition = new Vector3();
const outLookAt = new Vector3();

/** Exploration only (capture stage ?cam=px,py,pz,lx,ly,lz): overrides every key. */
export let cameraOverride: CameraKey | null = null;
export function setCameraOverride(key: CameraKey | null): void {
  cameraOverride = key;
}

/**
 * Interpolate the keyframe track at `scrollVh`. Position and look-at are
 * interpolated separately. Beyond the last key the camera holds.
 */
export function sampleCamera(scrollVh: number): { position: Vector3; lookAt: Vector3 } {
  if (cameraOverride) {
    return { position: outPosition.copy(cameraOverride.position), lookAt: outLookAt.copy(cameraOverride.lookAt) };
  }
  if (scrollVh <= keys[0].at) {
    return { position: outPosition.copy(keys[0].position), lookAt: outLookAt.copy(keys[0].lookAt) };
  }
  for (let i = 1; i < keys.length; i += 1) {
    const a = keys[i - 1];
    const b = keys[i];
    if (scrollVh <= b.at) {
      const t = quartInOut((scrollVh - a.at) / (b.at - a.at));
      return {
        position: outPosition.copy(a.position).lerp(b.position, t),
        lookAt: outLookAt.copy(a.lookAt).lerp(b.lookAt, t),
      };
    }
  }
  const last = keys[keys.length - 1];
  return { position: outPosition.copy(last.position), lookAt: outLookAt.copy(last.lookAt) };
}

/**
 * Aspect handling (§5.3): widen the camera on narrow viewports so the object
 * clears the copy.
 */
export function aspectAdjust(aspect: number): { zOffset: number; yOffset: number; fov: number } {
  if (aspect >= 1.4) return { zOffset: 0, yOffset: 0, fov: FOV };
  if (aspect >= 1.0) return { zOffset: 0.6, yOffset: 0, fov: FOV };
  // Portrait: stacked layout, object in the lower 55% of the viewport.
  return { zOffset: 1.0, yOffset: 0.55, fov: 40 };
}

/** Breathing (§5.4): an 18-second drift below conscious notice. */
export function breathing(time: number): { x: number; y: number } {
  return {
    x: 0.008 * Math.sin(time * 0.23 + 1.3),
    y: 0.012 * Math.sin(time * 0.35),
  };
}

/**
 * Touch drift (§8.4): a 12-second ellipse of 4° when there is no pointer.
 * The spec's 1.5° over 20 s read as a still image on a phone, where there
 * is no parallax to supply motion; 4° is the least that visibly breathes.
 */
export function touchDrift(time: number): { yaw: number; pitch: number } {
  const w = (Math.PI * 2) / 12;
  const rad = (4 * Math.PI) / 180;
  // 4° of yaw is the full pointer range, so the scene's truck moves with it.
  return { yaw: Math.sin(time * w) * rad, pitch: Math.cos(time * w) * ((2.5 * Math.PI) / 180) * 0.8 };
}
