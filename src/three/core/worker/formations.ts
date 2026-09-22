/**
 * The Core's geometry — HERO_SCENE_SPEC.md §4.
 *
 * Generates every node position for formations 0 to 4 and the edge list,
 * deterministically from CORE_SEED. Runs in a Web Worker in the browser and
 * under Node for the poster bake and the tests; nothing here touches the DOM
 * or three.js.
 *
 * Topology is fixed: an edge joins the same two node indices in every
 * formation and only the endpoints move. Each formation is therefore a
 * locality-preserving map of the Inflection sheet (a 2D hex grid) into its
 * shape, so sheet neighbours stay close and edges stay short. The vertex
 * shader fades any edge that still stretches beyond a threshold.
 *
 * Node order is not arbitrary (spec §4.1):
 *   - indices 0..HALF-1 are a uniform subsample of the whole set, so Tier B
 *     can draw the first half and keep the silhouette;
 *   - within each half, nodes that are ember in any formation come first,
 *     so the ember layer pass draws a prefix and never touches graphite;
 *   - edges with both ends in the first half come first, for the same reason.
 */
import { CORE_SEED, Simplex3, mulberry32 } from "./noise";

export const NODE_COUNT = 16384;
export const HALF = NODE_COUNT / 2;
export const FORMATIONS = 6;
export const TEXTURE_WIDTH = 128;
/** Rows per formation block in the position texture (128 × 128 = 16384). */
export const BLOCK_ROWS = NODE_COUNT / TEXTURE_WIDTH;

export interface CoreData {
  /** RGBA per node per formation: x, y, z, heat. Length NODE_COUNT * 4 * FORMATIONS. */
  positions: Float32Array;
  /** Analytic sheet normal for formation 0, xyz per node. Length NODE_COUNT * 3. */
  normals: Float32Array;
  /** Node index pairs. Length edgeCount * 2. */
  edges: Uint16Array;
  edgeCount: number;
  /** Ember-capable prefix lengths for draw ranges. */
  emberCountA: number;
  emberCountB: number;
  /** Edges whose both endpoints are in the first half: prefix length. */
  edgesInHalf: number;
  /** Per-node stable seed in [0, 1) for shader phase and stagger. */
  seeds: Float32Array;
}

// ─── formation 0: the Inflection sheet ───────────────────────────────────────

const SHEET_X = 2.4;
const SHEET_Y = 1.3;
// The hero spec quoted 0.038, which yields about 10k hex cells on this sheet.
// Spacing is derived from the target count instead: hex cell area is
// s²·√3/2, so s = √(area / (N·1.03·√3/2)) with 3% over-generation to trim.
const SPACING = Math.sqrt((SHEET_X * 2 * SHEET_Y * 2) / (NODE_COUNT * 1.03 * (Math.sqrt(3) / 2)));
const JITTER = SPACING * 0.16;
/** About 2.4 spacings: keeps the 3 nearest neighbours and nothing further. */
const EDGE_MAX_F0 = SPACING * 2.4;

const sheetZ = (x: number) => 0.9 * Math.tanh(1.6 * x);
const sheetSlope = (x: number) => {
  const c = Math.cosh(1.6 * x);
  return (0.9 * 1.6) / (c * c);
};

const smoothstep = (a: number, b: number, t: number) => {
  const x = Math.min(1, Math.max(0, (t - a) / (b - a)));
  return x * x * (3 - 2 * x);
};

interface SheetNode {
  col: number;
  row: number;
  x: number;
  y: number;
  z: number;
  nx: number;
  ny: number;
  nz: number;
}

function buildSheet(rand: () => number, noise: Simplex3): SheetNode[] {
  // A hex lattice: rows are SPACING·√3/2 apart, odd rows offset by half.
  const rowStep = SPACING * Math.sqrt(3) / 2;
  const cols = Math.ceil((SHEET_X * 2) / SPACING) + 1; // 127
  const rows = Math.ceil((SHEET_Y * 2) / rowStep) + 1; // 80
  const candidates: SheetNode[] = [];

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const x0 = -SHEET_X + c * SPACING + (r % 2 ? SPACING / 2 : 0);
      const y0 = -SHEET_Y + r * rowStep;
      const x = x0 + (rand() - 0.5) * 2 * JITTER;
      const y = y0 + (rand() - 0.5) * 2 * JITTER;
      const slope = sheetSlope(x);
      const len = Math.hypot(-slope, 1);
      const nx = -slope / len;
      const nz = 1 / len;
      // Per-node displacement along the normal so the sheet is not ruled.
      const bump = noise.fbm(x, y, 0.37, 3, 1.7) * 0.05;
      candidates.push({
        col: c,
        row: r,
        x: x + nx * bump,
        y,
        z: sheetZ(x) + nz * bump,
        nx,
        ny: 0,
        nz,
      });
    }
  }

  // Trim to exactly NODE_COUNT by dropping the outermost nodes.
  candidates.sort(
    (a, b) =>
      Math.max(Math.abs(a.x) / SHEET_X, Math.abs(a.y) / SHEET_Y) -
      Math.max(Math.abs(b.x) / SHEET_X, Math.abs(b.y) / SHEET_Y)
  );
  const kept = candidates.slice(0, NODE_COUNT);
  // Restore row-major order so (col,row) mapping stays meaningful.
  kept.sort((a, b) => a.row - b.row || a.col - b.col);
  return kept;
}

function heatF0(x: number): number {
  // A line, not a band: about 2% of nodes are ember, with a short skirt.
  const ax = Math.abs(x);
  if (ax < 0.032) return 1;
  if (ax < 0.12) return 0.25 * (1 - smoothstep(0.032, 0.12, ax));
  return 0;
}

// ─── edges: 3 nearest sheet neighbours ───────────────────────────────────────

function buildEdges(nodes: SheetNode[]): Array<[number, number]> {
  // Hash nodes into cells so neighbour search is local.
  const cell = SPACING * 1.5;
  const grid = new Map<string, number[]>();
  const key = (x: number, y: number) => `${Math.floor(x / cell)},${Math.floor(y / cell)}`;
  nodes.forEach((n, i) => {
    const k = key(n.x, n.y);
    const list = grid.get(k);
    if (list) list.push(i);
    else grid.set(k, [i]);
  });

  const pairs = new Set<number>();
  const edges: Array<[number, number]> = [];
  for (let i = 0; i < nodes.length; i += 1) {
    const n = nodes[i];
    const cx = Math.floor(n.x / cell);
    const cy = Math.floor(n.y / cell);
    const near: Array<[number, number]> = [];
    for (let dx = -1; dx <= 1; dx += 1) {
      for (let dy = -1; dy <= 1; dy += 1) {
        const list = grid.get(`${cx + dx},${cy + dy}`);
        if (!list) continue;
        for (const j of list) {
          if (j === i) continue;
          const m = nodes[j];
          const d = Math.hypot(m.x - n.x, m.y - n.y, m.z - n.z);
          if (d <= EDGE_MAX_F0) near.push([d, j]);
        }
      }
    }
    near.sort((a, b) => a[0] - b[0]);
    for (const [, j] of near.slice(0, 3)) {
      const a = Math.min(i, j);
      const b = Math.max(i, j);
      const id = a * NODE_COUNT + b;
      if (pairs.has(id)) continue;
      pairs.add(id);
      edges.push([a, b]);
    }
  }
  return edges;
}

// ─── formations 1 to 4 as maps of (col, row) ─────────────────────────────────

type Placement = { x: number; y: number; z: number; heat: number };

function formationLattice(nodes: SheetNode[], rand: () => number): Placement[] {
  // 32 × 16 × 32 = 16384. Sheet columns fold into x and part of y, rows into
  // z and the rest of y, so a sheet neighbour is at most one lattice step away
  // in some axis.
  const step = 0.11;
  const shear = Math.tan((8 * Math.PI) / 180);
  // Exact assignment: sort nodes by sheet cell (z-band, x-band, then
  // position) and hand out lattice slots in that order. Every lattice point
  // gets exactly one node, and sheet neighbours land in adjacent slots.
  const ranked = nodes
    .map((n, i) => {
      const u = (n.x / SHEET_X + 1) / 2;
      const v = (n.y / SHEET_Y + 1) / 2;
      return { i, cz: Math.min(31, Math.floor(v * 32)), cx: Math.min(31, Math.floor(u * 32)), u, v };
    })
    .sort((p, q) => p.cz - q.cz || p.cx - q.cx || p.v - q.v || p.u - q.u);
  const out: Placement[] = new Array(nodes.length);
  const slotToNode = new Int32Array(nodes.length);
  ranked.forEach((r, k) => {
    const gz = k >> 9;
    const gx = (k >> 4) & 31;
    const gy = k & 15;
    slotToNode[k] = r.i;
    const x = (gx - 15.5) * step;
    const y = (gy - 7.5) * step;
    const z = (gz - 15.5) * step;
    out[r.i] = { x: x + shear * y, y, z, heat: 0 };
  });

  // Traffic: ember paths walking along lattice lines.
  const index = new Map<string, number>();
  for (let k = 0; k < nodes.length; k += 1) {
    index.set(`${(k >> 4) & 31},${k & 15},${k >> 9}`, slotToNode[k]);
  }
  for (let walk = 0; walk < 26; walk += 1) {
    let gx = Math.floor(rand() * 32);
    let gy = Math.floor(rand() * 16);
    let gz = Math.floor(rand() * 32);
    const axis = Math.floor(rand() * 3);
    for (let s = 0; s < 40; s += 1) {
      const i = index.get(`${gx},${gy},${gz}`);
      if (i !== undefined) out[i].heat = Math.max(out[i].heat, 0.85 + rand() * 0.15);
      if (axis === 0) gx = (gx + 1) % 32;
      else if (axis === 1) gz = (gz + 1) % 32;
      else gy = (gy + 1) % 16;
      if (rand() < 0.08) {
        gy = Math.max(0, Math.min(15, gy + (rand() < 0.5 ? -1 : 1)));
      }
    }
  }
  return out;
}

function sheetToDirection(n: SheetNode): [number, number, number] {
  // Equirectangular: sheet x → longitude, sheet y → latitude (95% of the
  // range so the poles are not crowded).
  const lon = (n.x / SHEET_X) * Math.PI;
  const lat = (n.y / SHEET_Y) * (Math.PI / 2) * 0.95;
  const c = Math.cos(lat);
  return [c * Math.sin(lon), Math.sin(lat), c * Math.cos(lon)];
}

function formationEnclosure(nodes: SheetNode[], rand: () => number): Placement[] {
  return nodes.map((n) => {
    const [dx, dy, dz] = sheetToDirection(n);
    const inner = (n.col + n.row) % 4 === 0;
    const r = inner ? 0.95 : 1.35;
    const heat = !inner && rand() < 0.045 ? 0.8 + rand() * 0.2 : 0;
    return { x: dx * r, y: dy * r, z: dz * r, heat };
  });
}

function formationNebula(nodes: SheetNode[], rand: () => number, noise: Simplex3): Placement[] {
  const placed = nodes.map((n) => {
    const [dx, dy, dz] = sheetToDirection(n);
    const f = noise.fbm(dx * 1.3, dy * 1.3, dz * 1.3, 3, 1);
    // Push a fraction inward for volume; cube root keeps density even.
    const depth = rand() < 0.35 ? Math.cbrt(rand()) : 1;
    const r = (1.0 + 0.45 * f) * (0.55 + 0.45 * depth);
    return { x: dx * r, y: dy * r, z: dz * r, heat: 0, f };
  });
  // The densest region (highest fbm) carries the ember.
  const sorted = [...placed].map((p, i) => [p.f, i] as const).sort((a, b) => b[0] - a[0]);
  const hot = Math.floor(NODE_COUNT * 0.06);
  for (let k = 0; k < hot; k += 1) placed[sorted[k][1]].heat = 0.7 + rand() * 0.3;
  return placed.map(({ x, y, z, heat }) => ({ x, y, z, heat }));
}

function formationPlane(nodes: SheetNode[], noise: Simplex3): Placement[] {
  const placed = nodes.map((n) => {
    const u = n.x / SHEET_X;
    const v = n.y / SHEET_Y;
    // Stepped height field: quantised fbm gives columns rather than hills.
    const f = noise.fbm(u * 2.1 + 5, v * 2.1 + 5, 0.11, 3, 1);
    const h = Math.max(0, Math.round(((f + 1) / 2) * 6) / 6) * 1.2;
    return { x: u * 2.2, y: h - 0.7, z: v * 1.6, heat: 0, h };
  });
  const sorted = [...placed].map((p, i) => [p.h, i] as const).sort((a, b) => b[0] - a[0]);
  const hot = Math.floor(NODE_COUNT * 0.06);
  for (let k = 0; k < hot; k += 1) placed[sorted[k][1]].heat = 1;
  return placed.map(({ x, y, z, heat }) => ({ x, y, z, heat }));
}

// ─── assembly with the ordering invariants ───────────────────────────────────

export function generateCore(seed: number = CORE_SEED): CoreData {
  const rand = mulberry32(seed);
  const noise = new Simplex3(seed ^ 0x9e3779b9);

  const sheet = buildSheet(rand, noise);
  if (sheet.length !== NODE_COUNT) {
    throw new Error(`sheet produced ${sheet.length} nodes, expected ${NODE_COUNT}`);
  }
  const rawEdges = buildEdges(sheet);

  const f0: Placement[] = sheet.map((n) => ({ x: n.x, y: n.y, z: n.z, heat: heatF0(n.x) }));
  const f1 = formationLattice(sheet, rand);
  const f2 = formationEnclosure(sheet, rand);
  const f3 = formationNebula(sheet, rand, noise);
  const f4 = formationPlane(sheet, noise);
  const formations = [f0, f1, f2, f3, f4];

  // Order: uniform halves (alternate by index), ember-capable first in each.
  const emberCapable = (i: number) => formations.some((f) => f[i].heat > 0);
  const halfA: number[] = [];
  const halfB: number[] = [];
  for (let i = 0; i < NODE_COUNT; i += 1) (i % 2 === 0 ? halfA : halfB).push(i);
  const orderHalf = (ids: number[]) => {
    const hot = ids.filter(emberCapable);
    const cold = ids.filter((i) => !emberCapable(i));
    return { order: [...hot, ...cold], hot: hot.length };
  };
  const a = orderHalf(halfA);
  const b = orderHalf(halfB);
  const order = [...a.order, ...b.order];
  const remap = new Uint16Array(NODE_COUNT);
  order.forEach((oldIndex, newIndex) => {
    remap[oldIndex] = newIndex;
  });

  const positions = new Float32Array(NODE_COUNT * 4 * FORMATIONS);
  for (let f = 0; f < FORMATIONS; f += 1) {
    // Formation 5 (the mark) is filled later by the silhouette sampler; until
    // then it mirrors formation 0 so a premature morph is harmless.
    const src = formations[Math.min(f, 4)];
    for (let newIndex = 0; newIndex < NODE_COUNT; newIndex += 1) {
      const p = src[order[newIndex]];
      const o = (f * NODE_COUNT + newIndex) * 4;
      positions[o] = p.x;
      positions[o + 1] = p.y;
      positions[o + 2] = p.z;
      positions[o + 3] = f === 5 ? 0 : p.heat;
    }
  }

  const normals = new Float32Array(NODE_COUNT * 3);
  const seeds = new Float32Array(NODE_COUNT);
  const seedRand = mulberry32(seed ^ 0x51ed27);
  for (let newIndex = 0; newIndex < NODE_COUNT; newIndex += 1) {
    const n = sheet[order[newIndex]];
    normals[newIndex * 3] = n.nx;
    normals[newIndex * 3 + 1] = n.ny;
    normals[newIndex * 3 + 2] = n.nz;
    seeds[newIndex] = seedRand();
  }

  // Edges: remap, then those inside the first half first.
  const mapped = rawEdges.map(([p, q]) => [remap[p], remap[q]] as [number, number]);
  const inHalf = mapped.filter(([p, q]) => p < HALF && q < HALF);
  const rest = mapped.filter(([p, q]) => !(p < HALF && q < HALF));
  const ordered = [...inHalf, ...rest];
  const edges = new Uint16Array(ordered.length * 2);
  ordered.forEach(([p, q], i) => {
    edges[i * 2] = p;
    edges[i * 2 + 1] = q;
  });

  return {
    positions,
    normals,
    edges,
    edgeCount: ordered.length,
    emberCountA: a.hot,
    emberCountB: b.hot,
    edgesInHalf: inHalf.length,
    seeds,
  };
}

/** A cheap fingerprint for the bake-vs-worker equality check. */
export function fingerprint(data: CoreData): string {
  let h = 2166136261;
  const mix = (v: number) => {
    h ^= Math.round(v * 1e4) & 0xffff;
    h = Math.imul(h, 16777619) >>> 0;
  };
  for (let i = 0; i < data.positions.length; i += 97) mix(data.positions[i]);
  for (let i = 0; i < data.edges.length; i += 89) mix(data.edges[i]);
  return `${h.toString(16)}-${data.edgeCount}-${data.emberCountA}-${data.emberCountB}`;
}
