/**
 * Camera keyframes and composition rules — HERO_SCENE_SPEC.md §5.
 *
 * The camera is the only thing that moves the object on screen; the object
 * never rotates in world space, so the poster (captured at the Hero key)
 * registers exactly with the live scene.
 */
import { Vector3 } from "three";
import { BEAT_START_VH } from "./timeline";
import { MORPH_HALF_VH, PILLAR_FORMATION, PILLAR_VH, pillarHoldVh } from "./formationTrack";

export const FOV = 32;

export interface CameraKey {
  /** Scroll position in viewport heights. */
  at: number;
  position: Vector3;
  lookAt: Vector3;
}

// The hero composition was chosen from capture rounds on 22 September 2026:
// the sheet sits right of the copy, seen from upper-left so the inflection
// bends through the frame and its lower edge draws the S-curve.
const HERO = { position: new Vector3(-1.3, 1.3, 6.0), lookAt: new Vector3(-1.0, -0.15, 0) };
const TRUST = { position: new Vector3(-1.1, 1.9, 6.8), lookAt: new Vector3(-0.9, -0.4, 0) };
const RESOLVE = { position: new Vector3(-0.6, 0.9, 4.9), lookAt: new Vector3(-0.5, -0.05, 0) };
/**
 * The turning point, looking down along the sheet: the S-curve reads in
 * profile, with the ember line lit exactly where it turns, right of the
 * copy (capture, 24 September 2026).
 */
const INFLECTION = { position: new Vector3(-2.4, 9.0, 2.8), lookAt: new Vector3(-2.4, 0, 0) };

/**
 * The pillar formations are 3.5 to 4.4 units across, against the sheet's
 * 4.8 by 2.6 seen close: from the hero key the lattice and the plane ran
 * into the copy column and off the right edge (capture, 23 September 2026).
 * So the pinned chapter pulls back and shifts the look-at left, which puts
 * the object's centre at about 72% of the width, and the camera orbits a
 * further 18° per formation (CREATIVE_DIRECTION_3D.md §9 Phase 3).
 */
function orbit(azimuthDeg: number, elevationDeg: number, distance: number, lookAt: Vector3) {
  const az = (azimuthDeg * Math.PI) / 180;
  const el = (elevationDeg * Math.PI) / 180;
  const offset = new Vector3(
    Math.sin(az) * Math.cos(el) * distance,
    Math.sin(el) * distance,
    Math.cos(az) * Math.cos(el) * distance
  );
  return { position: lookAt.clone().add(offset), lookAt };
}

/** One camera per pillar formation, lattice to plane. */
export const PILLAR_CAMERA = [
  orbit(-20, 16, 9.2, new Vector3(-1.9, -0.1, 0)),
  orbit(-28, 14, 8.4, new Vector3(-1.9, 0, 0)),
  orbit(16, 12, 8.4, new Vector3(-1.8, 0, 0)),
  orbit(22, 28, 11.2, new Vector3(-2.0, -0.3, 0.2)),
] as const;

const key = (at: number, k: { position: Vector3; lookAt: Vector3 }): CameraKey => ({
  at,
  position: k.position,
  lookAt: k.lookAt,
});

function buildKeys(): CameraKey[] {
  const b = BEAT_START_VH;
  // The camera rises into the profile view as order arrives in Beat 2,
  // holds it through the proof, and comes back down before the lattice.
  const out: CameraKey[] = [
    key(0, HERO),
    key(b[1], TRUST),
    key(b[2], RESOLVE),
    key(b[2] + 27, INFLECTION),
    key(b[4] - 44, INFLECTION),
    key(b[4] - 24, RESOLVE),
  ];
  // Each formation's camera holds for the formation's hold and moves only
  // while the morph runs, so the object never drifts while a row is read.
  PILLAR_FORMATION.forEach((f, i) => {
    const hold = pillarHoldVh(f);
    out.push(key(hold, PILLAR_CAMERA[i]));
    out.push(key(hold + PILLAR_VH - 2 * MORPH_HALF_VH, PILLAR_CAMERA[i]));
  });
  // Hidden from the end of Beat 4's fade: back to the hero composition for
  // the intelligence band and the ask. The jump happens while opacity is 0.
  out.push(key(b[5] + 30, PILLAR_CAMERA[3]));
  out.push(key(b[5] + 31, HERO));
  return out;
}

export const keys: CameraKey[] = buildKeys();

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
