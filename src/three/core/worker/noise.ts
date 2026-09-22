/**
 * Seeded randomness and simplex noise for the formation generator.
 *
 * Determinism is a hard requirement (HERO_SCENE_SPEC.md §4.3): the posters
 * are captured from the same generator that runs in the visitor's browser,
 * and the poster-to-live crossfade only works if every node lands on
 * itself. Nothing here touches Math.random.
 *
 * Pure TypeScript with no DOM or three.js imports, so the same file runs in
 * the Web Worker, in the bake script under Node, and in unit tests.
 */

/** mulberry32: small, fast, good enough for layout jitter. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** The Core's seed. Spelled with the brand in it so nobody "fixes" it. */
export const CORE_SEED = 0x1f1e0e;

// ─── 3D simplex noise (Stefan Gustavson's reference, seeded permutation) ────

const GRAD3 = [
  [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
  [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
  [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1],
];

const F3 = 1 / 3;
const G3 = 1 / 6;

export class Simplex3 {
  private perm = new Uint8Array(512);
  private permMod12 = new Uint8Array(512);

  constructor(seed: number) {
    const rand = mulberry32(seed);
    const p = new Uint8Array(256);
    for (let i = 0; i < 256; i += 1) p[i] = i;
    for (let i = 255; i > 0; i -= 1) {
      const j = Math.floor(rand() * (i + 1));
      const t = p[i];
      p[i] = p[j];
      p[j] = t;
    }
    for (let i = 0; i < 512; i += 1) {
      this.perm[i] = p[i & 255];
      this.permMod12[i] = this.perm[i] % 12;
    }
  }

  /** Returns noise in roughly [−1, 1]. */
  noise(xin: number, yin: number, zin: number): number {
    const { perm, permMod12 } = this;
    const s = (xin + yin + zin) * F3;
    const i = Math.floor(xin + s);
    const j = Math.floor(yin + s);
    const k = Math.floor(zin + s);
    const t = (i + j + k) * G3;
    const x0 = xin - (i - t);
    const y0 = yin - (j - t);
    const z0 = zin - (k - t);

    let i1: number, j1: number, k1: number, i2: number, j2: number, k2: number;
    if (x0 >= y0) {
      if (y0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
      else if (x0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1; }
      else { i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1; }
    } else {
      if (y0 < z0) { i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1; }
      else if (x0 < z0) { i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1; }
      else { i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
    }

    const x1 = x0 - i1 + G3, y1 = y0 - j1 + G3, z1 = z0 - k1 + G3;
    const x2 = x0 - i2 + 2 * G3, y2 = y0 - j2 + 2 * G3, z2 = z0 - k2 + 2 * G3;
    const x3 = x0 - 1 + 3 * G3, y3 = y0 - 1 + 3 * G3, z3 = z0 - 1 + 3 * G3;

    const ii = i & 255, jj = j & 255, kk = k & 255;
    const corner = (dx: number, dy: number, dz: number, gi: number): number => {
      let t0 = 0.6 - dx * dx - dy * dy - dz * dz;
      if (t0 < 0) return 0;
      t0 *= t0;
      const g = GRAD3[gi];
      return t0 * t0 * (g[0] * dx + g[1] * dy + g[2] * dz);
    };

    const n0 = corner(x0, y0, z0, permMod12[ii + perm[jj + perm[kk]]]);
    const n1 = corner(x1, y1, z1, permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]]]);
    const n2 = corner(x2, y2, z2, permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]]]);
    const n3 = corner(x3, y3, z3, permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]]]);
    return 32 * (n0 + n1 + n2 + n3);
  }

  /** Fractal sum, `octaves` layers, persistence 0.5. */
  fbm(x: number, y: number, z: number, octaves = 3, frequency = 1): number {
    let sum = 0;
    let amp = 1;
    let norm = 0;
    let f = frequency;
    for (let o = 0; o < octaves; o += 1) {
      sum += amp * this.noise(x * f, y * f, z * f);
      norm += amp;
      amp *= 0.5;
      f *= 2;
    }
    return sum / norm;
  }
}
