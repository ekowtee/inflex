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
import { MARK_H, MARK_MASK, MARK_W, MARK_HEAT } from "./markData";
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

function formationFabric(nodes: SheetNode[]): Placement[] {
  // Formation 1, Network Infrastructure: a spine-and-leaf fabric, the
  // topology a modern data-centre network is built on (owner, 24 September
  // 2026, replacing the lattice box). Four spine switches above, eight leaf
  // switches below, every leaf linked to every spine: 12 hubs, 32 links.
  // Hubs are dense balls of nodes on a Fibonacci sphere; links are thin
  // strands of nodes; some links carry ember packets as traffic. Nodes are
  // handed out in sheet order, so each hub and link takes a contiguous run
  // of the sheet and the morph pulls whole regions into each element.
  type Hub = { x: number; y: number; z: number; r: number };
  const spines: Hub[] = [-1.35, -0.45, 0.45, 1.35].map((x) => ({ x, y: 0.95, z: 0, r: 0.2 }));
  const leaves: Hub[] = Array.from({ length: 8 }, (_, i) => ({
    x: -1.75 + i * 0.5,
    y: -0.75,
    z: i % 2 ? 0.32 : -0.32,
    r: 0.14,
  }));
  const hubs = [...spines, ...leaves];
  const links: Array<[Hub, Hub, boolean, number]> = [];
  let k = 0;
  for (const leaf of leaves) {
    for (const spine of spines) {
      // Traffic on a quarter of the links, spread across the fabric.
      links.push([leaf, spine, k % 4 === 1, k * 0.37]);
      k += 1;
    }
  }

  const n = nodes.length;
  const hubShare = 0.36;
  const hubArea = hubs.reduce((t, h) => t + h.r * h.r, 0);
  const counts: number[] = hubs.map((h) => Math.floor((n * hubShare * h.r * h.r) / hubArea));
  const hubTotal = counts.reduce((t, c) => t + c, 0);
  const perLink = Math.floor((n - hubTotal) / links.length);
  links.forEach(() => counts.push(perLink));
  counts[counts.length - 1] += n - counts.reduce((t, c) => t + c, 0);

  const out: Placement[] = new Array(n);
  const golden = Math.PI * (3 - Math.sqrt(5));
  let cursor = 0;
  counts.forEach((count, e) => {
    for (let j = 0; j < count; j += 1) {
      const i = cursor + j;
      if (e < hubs.length) {
        const h = hubs[e];
        const yy = 1 - (2 * (j + 0.5)) / count;
        const rr = Math.sqrt(1 - yy * yy);
        const th = golden * j;
        const spine = e < spines.length;
        out[i] = {
          x: h.x + Math.cos(th) * rr * h.r,
          y: h.y + yy * h.r,
          z: h.z + Math.sin(th) * rr * h.r,
          // Spine switches glow silver-warm; leaves stay graphite.
          heat: spine ? 0.42 : 0,
        };
      } else {
        const [a, bHub, traffic, phase] = links[e - hubs.length];
        const t = (j + 0.5) / count;
        // Run between the two hubs' surfaces, with a slight sag.
        const x = a.x + (bHub.x - a.x) * t;
        const y = a.y + (bHub.y - a.y) * t - 0.06 * Math.sin(Math.PI * t);
        const z = a.z + (bHub.z - a.z) * t;
        const wob = 0.012;
        const packet = traffic && (t * 5 + phase) % 1 < 0.22;
        out[i] = {
          x: x + Math.cos(j * 2.4) * wob,
          y: y + Math.sin(j * 2.4) * wob,
          z: z + Math.sin(j * 1.7) * wob,
          heat: packet ? 1 : 0,
        };
      }
    }
    cursor += count;
  });
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

/** Half-width of the shield outline at height y (both in [−1, 1]). */
function shieldHalfWidth(y: number): number {
  const below = Math.max(0, -0.05 - y) / 0.95;
  return 1 - Math.pow(below, 1.7);
}

/**
 * The shield outline as a closed polyline with cumulative arc length, so a
 * parameter s in [0, 1) walks once around it at even speed: along the top
 * edge left to right, down the right side to the point, up the left side.
 */
const SHIELD_OUTLINE = (() => {
  const pts: Array<[number, number]> = [];
  const STEPS = 200;
  for (let i = 0; i <= STEPS; i += 1) pts.push([-1 + (2 * i) / STEPS, 1]);
  for (let i = 1; i <= STEPS; i += 1) {
    const y = 1 - (2 * i) / STEPS;
    pts.push([shieldHalfWidth(y), y]);
  }
  for (let i = STEPS - 1; i > 0; i -= 1) {
    const y = 1 - (2 * i) / STEPS;
    pts.push([-shieldHalfWidth(y), y]);
  }
  const cum = [0];
  for (let i = 1; i <= pts.length; i += 1) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i % pts.length];
    cum.push(cum[i - 1] + Math.hypot(x1 - x0, y1 - y0));
  }
  return { pts, cum, total: cum[cum.length - 1] };
})();

function shieldOutlineAt(s: number): [number, number] {
  const { pts, cum, total } = SHIELD_OUTLINE;
  const d = (((s % 1) + 1) % 1) * total;
  let lo = 0;
  let hi = pts.length;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (cum[mid] <= d) lo = mid;
    else hi = mid;
  }
  const t = (d - cum[lo]) / Math.max(1e-6, cum[lo + 1] - cum[lo]);
  const [x0, y0] = pts[lo];
  const [x1, y1] = pts[(lo + 1) % pts.length];
  return [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t];
}

function formationShield(nodes: SheetNode[]): Placement[] {
  // Formation 2, Data Security: a solid shield (owner, 24 September 2026:
  // the first attempt, a curved sheet with a backing plate, read as a
  // shell). Three parts from three bands of sheet rows:
  //   front  (top 70%)  the shield face, domed, an even mesh
  //   wall   (next 15%) a side wall running around the whole outline, so
  //                     the thickness shows as an edge in perspective
  //   back   (last 15%) a flat back plate
  // Within each band sheet neighbours stay neighbours; edges that span two
  // bands are long and fade out in the edge shader, so the parts read as
  // one solid rather than being stitched by stray lines. The ember is a
  // chevron standing proud of the front face.
  const HALF_W = 1.1;
  const HALF_H = 1.25;
  const FRONT_RIM = 0.12;
  const DOME = 0.3;
  const BACK = -0.34;
  return nodes.map((n) => {
    const u = n.x / SHEET_X;
    const v = n.y / SHEET_Y;
    if (v > -0.4) {
      const fv = ((v + 0.4) / 1.4) * 2 - 1;
      const hw = shieldHalfWidth(fv);
      const x = u * hw;
      const z = FRONT_RIM + DOME * (1 - u * u) * (1 - fv * fv);
      const chevron = Math.abs(fv - (0.25 - 0.62 * Math.abs(x))) < 0.075 && Math.abs(x) < 0.78;
      // The front rim catches the light: silver warmth, below ember, along
      // the outer edge of the face where it turns into the wall.
      const rim = Math.abs(u) > 0.95 || fv > 0.95 || fv < -0.93;
      const heat = chevron ? 1 : rim ? 0.42 : 0;
      return { x: x * HALF_W, y: fv * HALF_H, z: z + (chevron ? 0.08 : 0), heat };
    }
    if (v > -0.7) {
      const depth = (v + 0.7) / 0.3; // 0 at the back edge, 1 at the front rim
      const [ox, oy] = shieldOutlineAt((u + 1) / 2);
      // A slight bevel: the wall rounds in toward the front rim.
      const inset = 1 - 0.05 * depth * depth;
      return { x: ox * inset * HALF_W, y: oy * inset * HALF_H, z: BACK + (FRONT_RIM - BACK) * depth, heat: 0 };
    }
    const bv = ((v + 1) / 0.3) * 2 - 1;
    return { x: u * shieldHalfWidth(bv) * HALF_W, y: bv * HALF_H, z: BACK, heat: 0 };
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

// ─── formation 5: the mark ──────────────────────────────────────────────────

function decodeBits(b64: string, length: number): Uint8Array {
  const bin = typeof atob === "function" ? atob(b64) : Buffer.from(b64, "base64").toString("binary");
  const out = new Uint8Array(length);
  for (let i = 0; i < length; i += 1) out[i] = (bin.charCodeAt(i >> 3) >> (i & 7)) & 1;
  return out;
}

function formationMark(nodes: SheetNode[], rand: () => number): Placement[] {
  // The Inflexions mark, sampled from the traced logo (scripts/bake-mark.mjs):
  // the grey X and the red figure's head, arm and stroke. The red parts carry
  // the ember and stand a little proud of the grey. 2.6 units tall.
  const mask = decodeBits(MARK_MASK, MARK_W * MARK_H);
  const heatMap = decodeBits(MARK_HEAT, MARK_W * MARK_H);
  const at = (grid: Uint8Array, x: number, y: number) => {
    const gx = Math.min(MARK_W - 1, Math.max(0, Math.floor(x * MARK_W)));
    const gy = Math.min(MARK_H - 1, Math.max(0, Math.floor(y * MARK_H)));
    return grid[gy * MARK_W + gx] === 1;
  };

  // A hex grid over the unit square, spacing found by bisection so that at
  // least NODE_COUNT points fall inside the mark; the surplus is thinned
  // evenly. Deterministic: the jitter comes from the seeded generator.
  const aspect = MARK_W / MARK_H;
  const grid = (d: number) => {
    const pts: Array<[number, number]> = [];
    const dy = d * (Math.sqrt(3) / 2);
    let row = 0;
    for (let y = dy / 2; y < 1; y += dy, row += 1) {
      for (let x = (row % 2 ? d / 2 : 0) + d / 4; x < 1; x += d / aspect) {
        if (at(mask, x, y)) pts.push([x, y]);
      }
    }
    return pts;
  };
  let lo = 0.0005;
  let hi = 0.05;
  for (let i = 0; i < 40; i += 1) {
    const mid = (lo + hi) / 2;
    if (grid(mid).length >= NODE_COUNT) lo = mid;
    else hi = mid;
  }
  let pts = grid(lo);
  const surplus = pts.length - NODE_COUNT;
  if (surplus > 0) {
    const step = pts.length / surplus;
    const drop = new Set<number>();
    for (let k = 0; k < surplus; k += 1) drop.add(Math.floor(k * step));
    pts = pts.filter((_, i) => !drop.has(i));
  }
  pts = pts.slice(0, NODE_COUNT);

  // Scanline assignment: sheet nodes and mark points both sorted by band,
  // then across, so sheet neighbours land near each other on the mark.
  const BANDS = 96;
  const nodeOrder = nodes
    .map((n, i) => ({ i, band: Math.min(BANDS - 1, Math.floor(((1 - n.y / SHEET_Y) / 2) * BANDS)), x: n.x }))
    .sort((a, b) => a.band - b.band || a.x - b.x);
  const ptOrder = pts
    .map(([x, y], i) => ({ i, band: Math.min(BANDS - 1, Math.floor(y * BANDS)), x }))
    .sort((a, b) => a.band - b.band || a.x - b.x);

  const HEIGHT = 2.6;
  const jitter = (0.35 / MARK_W) * HEIGHT;
  const out: Placement[] = new Array(nodes.length);
  nodeOrder.forEach((n, k) => {
    const [mx, my] = pts[ptOrder[k].i];
    const red = at(heatMap, mx, my);
    out[n.i] = {
      // 0.45 right of centre so the raised arm clears the copy column.
      x: (mx - 0.5) * HEIGHT * aspect + 0.45 + (rand() - 0.5) * jitter,
      y: (0.5 - my) * HEIGHT - 0.2 + (rand() - 0.5) * jitter,
      z: (red ? 0.1 : 0) + (rand() - 0.5) * 0.03,
      heat: red ? 1 : 0,
    };
  });
  return out;
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
  const f1 = formationFabric(sheet);
  const f2 = formationShield(sheet);
  const f3 = formationNebula(sheet, rand, noise);
  const f4 = formationPlane(sheet, noise);
  const f5 = formationMark(sheet, rand);
  const formations = [f0, f1, f2, f3, f4, f5];

  // Order: uniform halves (alternate by index), ember-capable first in each.
  // Ember-capable means able to glow ember: heat ≥ 0.5, the shaders' ember
  // threshold. Lower heat is silver warmth (the shield's rim, the sheet's
  // skirt) and never renders in the ember pass.
  const emberCapable = (i: number) => formations.some((f) => f[i].heat >= 0.5);
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
    const src = formations[f];
    for (let newIndex = 0; newIndex < NODE_COUNT; newIndex += 1) {
      const p = src[order[newIndex]];
      const o = (f * NODE_COUNT + newIndex) * 4;
      positions[o] = p.x;
      positions[o + 1] = p.y;
      positions[o + 2] = p.z;
      positions[o + 3] = p.heat;
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
