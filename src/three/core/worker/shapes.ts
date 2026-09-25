/**
 * Capture-only shapes for the interior hero stills (owner, 25 September
 * 2026: every interior page gets its own object, on its own topic, instead
 * of repeating a formation from another section).
 *
 * None of these reach the live Core. The capture stage asks for one by name
 * (/core-capture?formation=5&shape=padlock) and the worker puts it in slot 5,
 * the mark's slot, whose edge fade is the tightest, so a solid silhouette
 * does not trail stray lines. The home page never passes a shape, so its
 * texture, its draw order and its fingerprint are unchanged.
 *
 * Every shape is a map of the Inflection sheet, as the formations are: the
 * sheet is cut into vertical strips, one per part of the object, in
 * proportion to the part's surface area, and each strip is mapped onto its
 * part so sheet neighbours stay close. Edges that cross between parts are
 * long and the edge shader fades them.
 *
 * Parts are either parametric surfaces (a tube, a lathe, a box face), which
 * take the strip's own (u, v), or flat regions inside an outline, which are
 * filled with an even hex grid and assigned scanline by scanline, the way
 * the mark is. All shapes are built about the origin roughly 2.5 units tall,
 * then turned and placed where the mark sits (0.45 right of centre), so one
 * camera frames them all.
 */
import type { Placement, SheetNode } from "./formations";

type V2 = [number, number];
type V3 = [number, number, number];
type HeatFn = (p: V3, u: number, v: number) => number;

interface ParamPart {
  kind: "param";
  weight: number;
  map: (u: number, v: number) => V3;
  heat?: HeatFn;
}
interface RegionPart {
  kind: "region";
  weight: number;
  inside: (x: number, y: number) => boolean;
  bbox: [number, number, number, number];
  to: (x: number, y: number) => V3;
  heat?: HeatFn;
}
type Part = ParamPart | RegionPart;

const TAU = Math.PI * 2;
const deg = (d: number) => (d * Math.PI) / 180;

// ─── 2D paths ────────────────────────────────────────────────────────────────

interface Path {
  pts: V2[];
  closed: boolean;
  length: number;
  at: (s: number) => V2;
  /** Unit tangent at s. */
  tangent: (s: number) => V2;
  inside: (x: number, y: number) => boolean;
  dist: (x: number, y: number) => number;
  bbox: [number, number, number, number];
  area: number;
}

function makePath(pts: V2[], closed = true): Path {
  const n = pts.length;
  const segs = closed ? n : n - 1;
  const cum = [0];
  for (let i = 0; i < segs; i += 1) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[(i + 1) % n];
    cum.push(cum[i] + Math.hypot(x1 - x0, y1 - y0));
  }
  const length = cum[segs];
  const locate = (s: number) => {
    const d = (closed ? ((s % 1) + 1) % 1 : Math.min(1, Math.max(0, s))) * length;
    let lo = 0;
    let hi = segs;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (cum[mid] <= d) lo = mid;
      else hi = mid;
    }
    const t = (d - cum[lo]) / Math.max(1e-9, cum[lo + 1] - cum[lo]);
    return { i: lo, t };
  };
  const at = (s: number): V2 => {
    const { i, t } = locate(s);
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[(i + 1) % n];
    return [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t];
  };
  const tangent = (s: number): V2 => {
    const { i } = locate(s);
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[(i + 1) % n];
    const l = Math.hypot(x1 - x0, y1 - y0) || 1;
    return [(x1 - x0) / l, (y1 - y0) / l];
  };
  const inside = (x: number, y: number) => {
    let c = false;
    for (let i = 0, j = n - 1; i < n; j = i, i += 1) {
      const [xi, yi] = pts[i];
      const [xj, yj] = pts[j];
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
    }
    return c;
  };
  const dist = (x: number, y: number) => {
    let best = Infinity;
    for (let i = 0; i < segs; i += 1) {
      const [x0, y0] = pts[i];
      const [x1, y1] = pts[(i + 1) % n];
      const dx = x1 - x0;
      const dy = y1 - y0;
      const t = Math.max(0, Math.min(1, ((x - x0) * dx + (y - y0) * dy) / (dx * dx + dy * dy || 1)));
      best = Math.min(best, Math.hypot(x - (x0 + dx * t), y - (y0 + dy * t)));
    }
    return best;
  };
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let area = 0;
  for (let i = 0; i < n; i += 1) {
    const [x, y] = pts[i];
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
    const [x1, y1] = pts[(i + 1) % n];
    area += x * y1 - x1 * y;
  }
  return { pts, closed, length, at, tangent, inside, dist, bbox: [minX, minY, maxX, maxY], area: Math.abs(area) / 2 };
}

function circlePts(cx: number, cy: number, r: number, steps = 96, a0 = 0, a1 = TAU): V2[] {
  const out: V2[] = [];
  const full = Math.abs(a1 - a0 - TAU) < 1e-9;
  const count = full ? steps : steps + 1;
  for (let i = 0; i < count; i += 1) {
    const a = a0 + ((a1 - a0) * i) / steps;
    out.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  return out;
}

function roundedRectPts(cx: number, cy: number, w: number, h: number, r: number, steps = 12): V2[] {
  const out: V2[] = [];
  const corners: Array<[number, number, number]> = [
    [cx + w / 2 - r, cy - h / 2 + r, -Math.PI / 2],
    [cx + w / 2 - r, cy + h / 2 - r, 0],
    [cx - w / 2 + r, cy + h / 2 - r, Math.PI / 2],
    [cx - w / 2 + r, cy - h / 2 + r, Math.PI],
  ];
  for (const [x, y, a] of corners) {
    for (let i = 0; i <= steps; i += 1) {
      const t = a + (Math.PI / 2) * (i / steps);
      out.push([x + Math.cos(t) * r, y + Math.sin(t) * r]);
    }
  }
  return out;
}

// ─── part builders ───────────────────────────────────────────────────────────

/** Front and back faces and the side wall of an outline extruded along z. */
function extrude(
  outline: Path,
  depth: number,
  opts: {
    hole?: Path;
    frontHeat?: HeatFn;
    wallHeat?: HeatFn;
    holeWallHeat?: HeatFn;
    frontZ?: (x: number, y: number) => number;
    back?: number;
  } = {}
): Part[] {
  const { hole } = opts;
  const inside = hole ? (x: number, y: number) => outline.inside(x, y) && !hole.inside(x, y) : outline.inside;
  const area = outline.area - (hole ? hole.area : 0);
  const zf = depth / 2;
  const parts: Part[] = [
    {
      kind: "region",
      weight: area,
      inside,
      bbox: outline.bbox,
      to: (x, y) => [x, y, zf + (opts.frontZ ? opts.frontZ(x, y) : 0)],
      heat: opts.frontHeat,
    },
    { kind: "region", weight: area * (opts.back ?? 0.45), inside, bbox: outline.bbox, to: (x, y) => [x, y, -zf] },
    {
      kind: "param",
      weight: outline.length * depth,
      map: (u, v) => {
        const [x, y] = outline.at(u);
        return [x, y, -zf + v * depth];
      },
      heat: opts.wallHeat,
    },
  ];
  if (hole) {
    parts.push({
      kind: "param",
      weight: hole.length * depth,
      map: (u, v) => {
        const [x, y] = hole.at(u);
        return [x, y, -zf + v * depth];
      },
      heat: opts.holeWallHeat,
    });
  }
  return parts;
}

/** A tube of radius r along a path in the xy plane (at depth z). */
function tube(path: Path, r: number, heat?: HeatFn, z = 0): Part {
  return {
    kind: "param",
    weight: path.length * TAU * r,
    map: (u, v) => {
      const [x, y] = path.at(u);
      const [tx, ty] = path.tangent(u);
      const a = v * TAU;
      return [x - ty * Math.cos(a) * r, y + tx * Math.cos(a) * r, z + Math.sin(a) * r];
    },
    heat,
  };
}

/** A tube along an arbitrary 3D polyline. */
function tube3(points: V3[], r: number, heat?: HeatFn): Part {
  const cum = [0];
  for (let i = 1; i < points.length; i += 1) {
    const [a, b] = [points[i - 1], points[i]];
    cum.push(cum[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]));
  }
  const length = cum[cum.length - 1];
  return {
    kind: "param",
    weight: length * TAU * r,
    map: (u, v) => {
      const d = Math.min(0.999999, Math.max(0, u)) * length;
      let i = 1;
      while (i < cum.length - 1 && cum[i] < d) i += 1;
      const a = points[i - 1];
      const b = points[i];
      const t = (d - cum[i - 1]) / Math.max(1e-9, cum[i] - cum[i - 1]);
      const c: V3 = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
      let tx = b[0] - a[0];
      let ty = b[1] - a[1];
      let tz = b[2] - a[2];
      const tl = Math.hypot(tx, ty, tz) || 1;
      tx /= tl;
      ty /= tl;
      tz /= tl;
      // Any perpendicular pair.
      const ref: V3 = Math.abs(ty) < 0.9 ? [0, 1, 0] : [1, 0, 0];
      let nx = ty * ref[2] - tz * ref[1];
      let ny = tz * ref[0] - tx * ref[2];
      let nz = tx * ref[1] - ty * ref[0];
      const nl = Math.hypot(nx, ny, nz) || 1;
      nx /= nl;
      ny /= nl;
      nz /= nl;
      const bx = ty * nz - tz * ny;
      const by = tz * nx - tx * nz;
      const bz = tx * ny - ty * nx;
      const ang = v * TAU;
      const ca = Math.cos(ang) * r;
      const sa = Math.sin(ang) * r;
      return [c[0] + nx * ca + bx * sa, c[1] + ny * ca + by * sa, c[2] + nz * ca + bz * sa];
    },
    heat,
  };
}

/**
 * A surface of revolution about the y axis from a profile of (radius, y)
 * points. v is remapped so nodes are even per unit area (area grows with r).
 */
function lathe(profile: V2[], heat?: HeatFn, weightScale = 1, offset: V3 = [0, 0, 0]): Part {
  const cumA = [0];
  const cumS = [0];
  for (let i = 1; i < profile.length; i += 1) {
    const [r0, y0] = profile[i - 1];
    const [r1, y1] = profile[i];
    const ds = Math.hypot(r1 - r0, y1 - y0);
    cumS.push(cumS[i - 1] + ds);
    cumA.push(cumA[i - 1] + ds * (r0 + r1) * 0.5 * TAU);
  }
  const total = cumA[cumA.length - 1];
  return {
    kind: "param",
    weight: total * weightScale,
    map: (u, v) => {
      const target = Math.min(0.999999, Math.max(0, v)) * total;
      let i = 1;
      while (i < cumA.length - 1 && cumA[i] < target) i += 1;
      const t = (target - cumA[i - 1]) / Math.max(1e-9, cumA[i] - cumA[i - 1]);
      const r = profile[i - 1][0] + (profile[i][0] - profile[i - 1][0]) * t;
      const y = profile[i - 1][1] + (profile[i][1] - profile[i - 1][1]) * t;
      const a = u * TAU;
      return [offset[0] + Math.cos(a) * r, offset[1] + y, offset[2] + Math.sin(a) * r];
    },
    heat,
  };
}

/** An even sphere (uniform in area). */
function sphere(c: V3, r: number, heat?: HeatFn): Part {
  return {
    kind: "param",
    weight: 2 * TAU * r * r,
    map: (u, v) => {
      const z = 2 * v - 1;
      const s = Math.sqrt(Math.max(0, 1 - z * z));
      const a = u * TAU;
      return [c[0] + Math.cos(a) * s * r, c[1] + z * r, c[2] + Math.sin(a) * s * r];
    },
    heat,
  };
}

/** A torus about the z axis (in the xy plane). */
function torus(c: V3, R: number, r: number, heat?: HeatFn): Part {
  return {
    kind: "param",
    weight: TAU * R * TAU * r,
    map: (u, v) => {
      const a = u * TAU;
      const b = v * TAU;
      const rr = R + Math.cos(b) * r;
      return [c[0] + Math.cos(a) * rr, c[1] + Math.sin(a) * rr, c[2] + Math.sin(b) * r];
    },
    heat,
  };
}

/** The visible faces of an axis-aligned box (all but the bottom by default). */
function box(c: V3, size: V3, heat?: HeatFn, withBottom = false): Part[] {
  const [cx, cy, cz] = c;
  const [w, h, d] = size;
  const face = (weight: number, map: (u: number, v: number) => V3): Part => ({ kind: "param", weight, map, heat });
  const parts: Part[] = [
    face(w * h, (u, v) => [cx - w / 2 + u * w, cy - h / 2 + v * h, cz + d / 2]),
    face(w * h * 0.45, (u, v) => [cx - w / 2 + u * w, cy - h / 2 + v * h, cz - d / 2]),
    face(d * h, (u, v) => [cx + w / 2, cy - h / 2 + v * h, cz - d / 2 + u * d]),
    face(d * h, (u, v) => [cx - w / 2, cy - h / 2 + v * h, cz - d / 2 + u * d]),
    face(w * d, (u, v) => [cx - w / 2 + u * w, cy + h / 2, cz - d / 2 + v * d]),
  ];
  if (withBottom) parts.push(face(w * d * 0.45, (u, v) => [cx - w / 2 + u * w, cy - h / 2, cz - d / 2 + v * d]));
  return parts;
}

// ─── assignment of sheet nodes to parts ──────────────────────────────────────

/** Points on an even hex grid inside a region, exactly `count` of them. */
function fillRegion(count: number, inside: (x: number, y: number) => boolean, bbox: [number, number, number, number]): V2[] {
  const [x0, y0, x1, y1] = bbox;
  const grid = (d: number) => {
    const pts: V2[] = [];
    const dy = d * (Math.sqrt(3) / 2);
    let row = 0;
    for (let y = y0 + dy / 2; y < y1; y += dy, row += 1) {
      for (let x = x0 + (row % 2 ? d / 2 : 0) + d / 4; x < x1; x += d) if (inside(x, y)) pts.push([x, y]);
    }
    return pts;
  };
  const boxArea = (x1 - x0) * (y1 - y0);
  let lo = Math.sqrt(boxArea / (count * 6));
  let hi = Math.sqrt((boxArea * 2) / count);
  for (let i = 0; i < 22; i += 1) {
    const mid = (lo + hi) / 2;
    if (grid(mid).length >= count) lo = mid;
    else hi = mid;
  }
  let pts = grid(lo);
  const surplus = pts.length - count;
  if (surplus > 0) {
    const step = pts.length / surplus;
    const drop = new Set<number>();
    for (let k = 0; k < surplus; k += 1) drop.add(Math.floor(k * step));
    pts = pts.filter((_, i) => !drop.has(i));
  }
  while (pts.length < count) pts.push(pts[pts.length % Math.max(1, pts.length)] ?? [0, 0]);
  return pts.slice(0, count);
}

function assign(nodes: SheetNode[], parts: Part[]): Placement[] {
  const n = nodes.length;
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const s of nodes) {
    minX = Math.min(minX, s.x);
    maxX = Math.max(maxX, s.x);
    minY = Math.min(minY, s.y);
    maxY = Math.max(maxY, s.y);
  }
  const order = nodes.map((_, i) => i).sort((a, b) => nodes[a].x - nodes[b].x || nodes[a].y - nodes[b].y);
  const totalW = parts.reduce((t, p) => t + p.weight, 0);
  const counts = parts.map((p) => Math.floor((n * p.weight) / totalW));
  counts[counts.length - 1] += n - counts.reduce((t, c) => t + c, 0);

  const out: Placement[] = new Array(n);
  let cursor = 0;
  parts.forEach((part, k) => {
    const ids = order.slice(cursor, cursor + counts[k]);
    cursor += counts[k];
    if (!ids.length) return;
    let sx0 = Infinity;
    let sx1 = -Infinity;
    for (const i of ids) {
      sx0 = Math.min(sx0, nodes[i].x);
      sx1 = Math.max(sx1, nodes[i].x);
    }
    const uOf = (i: number) => (nodes[i].x - sx0) / Math.max(1e-9, sx1 - sx0);
    const vOf = (i: number) => (nodes[i].y - minY) / Math.max(1e-9, maxY - minY);
    if (part.kind === "param") {
      for (const i of ids) {
        const u = uOf(i);
        const v = vOf(i);
        const p = part.map(u, v);
        out[i] = { x: p[0], y: p[1], z: p[2], heat: part.heat ? part.heat(p, u, v) : 0 };
      }
      return;
    }
    const pts = fillRegion(ids.length, part.inside, part.bbox);
    const [bx0, by0, bx1, by1] = part.bbox;
    const bands = Math.max(4, Math.round(Math.sqrt((ids.length * (by1 - by0)) / Math.max(1e-6, bx1 - bx0))));
    const nodeOrder = ids
      .map((i) => ({ i, band: Math.min(bands - 1, Math.floor(vOf(i) * bands)), x: uOf(i) }))
      .sort((a, b) => a.band - b.band || a.x - b.x);
    const ptOrder = pts
      .map((q, j) => ({ j, band: Math.min(bands - 1, Math.floor(((q[1] - by0) / (by1 - by0)) * bands)), x: q[0] }))
      .sort((a, b) => a.band - b.band || a.x - b.x);
    nodeOrder.forEach((nd, k2) => {
      const q = pts[ptOrder[k2].j];
      const p = part.to(q[0], q[1]);
      out[nd.i] = { x: p[0], y: p[1], z: p[2], heat: part.heat ? part.heat(p, q[0], q[1]) : 0 };
    });
  });
  return out;
}

/** Turn about x then y, scale, and place where the mark sits. */
function place(ps: Placement[], rx: number, ry: number, scale = 1): Placement[] {
  const cx = Math.cos(deg(rx));
  const sx = Math.sin(deg(rx));
  const cy = Math.cos(deg(ry));
  const sy = Math.sin(deg(ry));
  return ps.map(({ x, y, z, heat }) => {
    const y1 = y * cx - z * sx;
    const z1 = y * sx + z * cx;
    const x2 = x * cy + z1 * sy;
    const z2 = -x * sy + z1 * cy;
    return { x: x2 * scale + 0.45, y: y1 * scale - 0.2, z: z2 * scale, heat };
  });
}

const EMBER = 1;
const WARM = 0.42;

// ─── the shapes ──────────────────────────────────────────────────────────────

/** Cybersecurity & Compliance: a padlock, the keyhole in ember. */
function padlock(nodes: SheetNode[]): Placement[] {
  const body = makePath(roundedRectPts(0, -0.5, 1.9, 1.45, 0.24));
  const keyhole = (x: number, y: number) =>
    Math.hypot(x, y + 0.36) < 0.15 || (Math.abs(x) < 0.065 && y < -0.36 && y > -0.8);
  const arc = circlePts(0, 0.55, 0.62, 48, 0, Math.PI).reverse();
  const shackle = makePath([[-0.62, 0.15], ...arc, [0.62, 0.15]], false);
  const parts = [
    ...extrude(body, 0.55, {
      frontHeat: ([x, y]) => (keyhole(x, y) ? EMBER : body.dist(x, y) < 0.05 ? WARM : 0),
      frontZ: (x, y) => (keyhole(x, y) ? -0.03 : 0),
    }),
    tube(shackle, 0.15),
  ];
  return place(assign(nodes, parts), 8, 20);
}

/** Contact: a speech bubble, three ember dots in it. */
function speechBubble(nodes: SheetNode[]): Placement[] {
  const w = 2.5;
  const h = 1.6;
  const cy = 0.2;
  const yb = cy - h / 2;
  // The rounded rectangle runs counter-clockwise from the bottom edge's
  // right end to its left end; the outline closes along the bottom edge,
  // left to right, through the tail.
  const outline = makePath([...roundedRectPts(0, cy, w, h, 0.36), [-0.8, yb], [-1.0, yb - 0.6], [-0.35, yb]]);
  const dots = (x: number, y: number) => [-0.62, 0, 0.62].some((dx) => Math.hypot(x - dx, y - cy) < 0.16);
  const parts = extrude(outline, 0.4, {
    frontHeat: ([x, y]) => (dots(x, y) ? EMBER : outline.dist(x, y) < 0.045 ? WARM : 0),
    frontZ: (x, y) => (dots(x, y) ? 0.05 : 0),
  });
  return place(assign(nodes, parts), 6, 16);
}

/** One edge of a puzzle piece from a to b, with a knob out (1) or in (−1). */
function puzzleEdge(a: V2, b: V2, dir: number): V2[] {
  const mx = (a[0] + b[0]) / 2;
  const my = (a[1] + b[1]) / 2;
  const tx = (b[0] - a[0]) / Math.hypot(b[0] - a[0], b[1] - a[1]);
  const ty = (b[1] - a[1]) / Math.hypot(b[0] - a[0], b[1] - a[1]);
  // Outward normal for a counter-clockwise outline.
  const nx = ty * dir;
  const ny = -tx * dir;
  const neck = 0.12;
  const c: V2 = [mx + nx * 0.28, my + ny * 0.28];
  const l: V2 = [mx - tx * neck, my - ty * neck];
  const r: V2 = [mx + tx * neck, my + ty * neck];
  const R = Math.hypot(l[0] - c[0], l[1] - c[1]);
  const aL = Math.atan2(l[1] - c[1], l[0] - c[0]);
  let aR = Math.atan2(r[1] - c[1], r[0] - c[0]);
  // Go the long way round, through the far side of the knob.
  const far = Math.atan2(ny, nx);
  const sweep = (from: number, to: number) => {
    let d = to - from;
    while (d <= 0) d += TAU;
    return d;
  };
  let ccw = sweep(aL, aR);
  const passesFar = sweep(aL, far) < ccw;
  if (!passesFar) {
    ccw = -(TAU - ccw);
  }
  aR = aL + ccw;
  const out: V2[] = [a, l];
  for (let i = 1; i < 40; i += 1) {
    const t = aL + ((aR - aL) * i) / 40;
    out.push([c[0] + Math.cos(t) * R, c[1] + Math.sin(t) * R]);
  }
  out.push(r);
  return out;
}

/** Jobs: a puzzle piece, the place the role fits. */
function puzzle(nodes: SheetNode[]): Placement[] {
  const s = 0.85;
  const y0 = -0.15;
  const A: V2 = [-s, y0 - s];
  const B: V2 = [s, y0 - s];
  const C: V2 = [s, y0 + s];
  const D: V2 = [-s, y0 + s];
  const pts = [...puzzleEdge(A, B, -1), ...puzzleEdge(B, C, 1), ...puzzleEdge(C, D, 1), ...puzzleEdge(D, A, -1)];
  const outline = makePath(pts);
  const topKnob: V2 = [0, y0 + s + 0.28];
  const parts = extrude(outline, 0.34, {
    frontHeat: ([x, y]) =>
      Math.hypot(x - topKnob[0], y - topKnob[1]) < 0.3 && y > y0 + s - 0.02 ? EMBER : outline.dist(x, y) < 0.045 ? WARM : 0,
  });
  return place(assign(nodes, parts), 8, -18);
}

/** Case studies: a check mark, delivered, its face outlined in ember. */
function checkmark(nodes: SheetNode[]): Placement[] {
  const k = 1.12;
  const outline = makePath(
    (
      [
        [-1.05, 0.0],
        [-0.72, 0.33],
        [-0.33, -0.06],
        [0.74, 1.01],
        [1.07, 0.68],
        [-0.33, -0.72],
      ] as V2[]
    ).map(([x, y]) => [x * k, (y - 0.15) * k] as V2)
  );
  const parts = extrude(outline, 0.4, { frontHeat: ([x, y]) => (outline.dist(x, y) < 0.06 ? EMBER : 0) });
  return place(assign(nodes, parts), 6, 18);
}

/** Careers: a staircase, the next step in ember. */
function staircase(nodes: SheetNode[]): Placement[] {
  const steps = 4;
  const W = 2.4;
  const H = 2.2;
  const sw = W / steps;
  const sh = H / steps;
  const x0 = -W / 2;
  const y0 = -H / 2;
  const pts: V2[] = [
    [x0, y0],
    [x0 + W, y0],
  ];
  for (let i = steps; i >= 1; i -= 1) {
    pts.push([x0 + i * sw, y0 + i * sh]);
    pts.push([x0 + (i - 1) * sw, y0 + i * sh]);
  }
  // The last pushed point is (x0, y0 + sh); the outline closes back to (x0, y0).
  const outline = makePath(pts);
  const topY = y0 + H;
  const parts = extrude(outline, 1.2, {
    wallHeat: ([x, y]) => (Math.abs(y - topY) < 1e-3 && x > x0 + (steps - 1) * sw ? EMBER : Math.abs((y - y0) / sh - Math.round((y - y0) / sh)) < 1e-3 && y > y0 + 1e-3 ? WARM : 0),
    back: 0.6,
  });
  return place(assign(nodes, parts), 14, -36, 0.95);
}

/** For Organisations: an office tower at dusk, a few windows lit. */
function tower(nodes: SheetNode[]): Placement[] {
  const floorH = 0.15;
  const bayW = 0.19;
  const y0 = -1.25;
  const W = 0.95;
  // Scattered lit windows: a fixed hash of (floor, bay, face).
  const lit = (f: number, c: number, face: number) => {
    const h = Math.sin(f * 12.9898 + c * 78.233 + face * 37.719) * 43758.5453;
    return h - Math.floor(h) < 0.08;
  };
  const heat: HeatFn = ([x, y, z]) => {
    const fy = (y - y0) / floorH;
    const front = z > W / 2 - 1e-3;
    const side = x > W / 2 - 1e-3;
    if (!front && !side) return 0;
    const across = front ? x + W / 2 : z + W / 2;
    const fc = across / bayW;
    const onFloorLine = fy - Math.floor(fy) < 0.12;
    const onMullion = fc - Math.floor(fc) < 0.1;
    if (onFloorLine || onMullion) return WARM;
    return lit(Math.floor(fy), Math.floor(fc), front ? 0 : 1) ? EMBER : 0;
  };
  const shaft = 2.1;
  const parts = [
    ...box([0, y0 + shaft / 2, 0], [W, shaft, W], heat),
    ...box([0, y0 + shaft + 0.17, 0], [0.72, 0.34, 0.72]),
    tube3(
      [
        [0, y0 + shaft + 0.34, 0],
        [0, y0 + shaft + 0.72, 0],
      ],
      0.03
    ),
  ];
  return place(assign(nodes, parts), 8, -30);
}

/** Infrastructure & Cloud: a server rack, a few blades showing status. */
function rack(nodes: SheetNode[]): Placement[] {
  const parts: Part[] = [];
  const W = 1.7;
  const H = 2.5;
  const D = 1.0;
  parts.push(...box([-W / 2, 0, 0], [0.07, H, D]));
  parts.push(...box([W / 2, 0, 0], [0.07, H, D]));
  parts.push(...box([0, H / 2, 0], [W + 0.07, 0.07, D]));
  const blades = 9;
  const bh = 0.17;
  const gap = (H - 0.2 - blades * bh) / (blades - 1);
  const litBlades = new Set([1, 3, 4, 6, 8]);
  for (let i = 0; i < blades; i += 1) {
    const yc = -H / 2 + 0.1 + bh / 2 + i * (bh + gap);
    const on = litBlades.has(i);
    parts.push(
      ...box([0, yc, 0.02], [W - 0.1, bh, D - 0.06], ([x, y, z]) => {
        if (z < (D - 0.06) / 2 + 0.02 - 1e-3) return 0;
        if (on && x > 0.5 && x < 0.66 && Math.abs(y - yc) < 0.035) return EMBER;
        return Math.abs(y - yc) < 0.012 ? WARM : 0;
      })
    );
  }
  return place(assign(nodes, parts), 8, -34, 0.98);
}

/** AI & Intelligent Systems: a neural network, input to output. */
function neuralNet(nodes: SheetNode[]): Placement[] {
  const layers = [4, 6, 6, 3];
  const xs = [-1.25, -0.42, 0.42, 1.25];
  const zs = [0.06, -0.04, 0.04, -0.06];
  const units: V3[][] = layers.map((count, l) =>
    Array.from({ length: count }, (_, i) => [xs[l], ((i + 0.5) / count - 0.5) * 2.2, zs[l]] as V3)
  );
  const parts: Part[] = [];
  units.forEach((layer, l) =>
    layer.forEach((c, i) => {
      const out = l === layers.length - 1 && i === 1;
      parts.push(sphere(c, 0.14, () => (out ? EMBER : l === 0 ? WARM : 0)));
    })
  );
  let k = 0;
  for (let l = 0; l < layers.length - 1; l += 1) {
    for (const a of units[l]) {
      for (const b of units[l + 1]) {
        const traffic = k % 9 === 4;
        const phase = k * 0.37;
        parts.push(tube3([a, b], 0.012, (_p, u) => (traffic && (u * 4 + phase) % 1 < 0.2 ? EMBER : 0)));
        k += 1;
      }
    }
  }
  return place(assign(nodes, parts), 4, 10);
}

/** Professional: a gear, the bore in ember. */
function gear(nodes: SheetNode[]): Placement[] {
  const teeth = 10;
  const rTip = 1.2;
  const rRoot = 0.96;
  const pts: V2[] = [];
  const pitch = TAU / teeth;
  for (let i = 0; i < teeth; i += 1) {
    const a = i * pitch;
    const at = (ang: number, r: number): V2 => [Math.cos(ang) * r, Math.sin(ang) * r];
    for (let j = 0; j <= 4; j += 1) pts.push(at(a - pitch / 2 + (j / 4) * (pitch * 0.3), rRoot));
    pts.push(at(a - pitch * 0.14, rTip));
    pts.push(at(a + pitch * 0.14, rTip));
    for (let j = 0; j <= 4; j += 1) pts.push(at(a + pitch * 0.2 + (j / 4) * (pitch * 0.3), rRoot));
  }
  const outline = makePath(pts);
  const bore = makePath(circlePts(0, 0, 0.38, 64));
  const parts = extrude(outline, 0.42, {
    hole: bore,
    holeWallHeat: () => EMBER,
    frontHeat: ([x, y]) => (Math.abs(Math.hypot(x, y) - 0.62) < 0.02 ? WARM : 0),
  });
  return place(assign(nodes, parts), -16, 24);
}

/** Managed: a radar scope, the sweep's leading edge in ember. */
function radar(nodes: SheetNode[]): Placement[] {
  const R = 1.2;
  const disc = makePath(circlePts(0, 0, R, 120));
  const lead = deg(70);
  const trail = deg(40);
  const heat: HeatFn = ([x, y]) => {
    const r = Math.hypot(x, y);
    const a = Math.atan2(y, x);
    const blip = Math.hypot(x - 0.38, y - 0.78) < 0.06 || Math.hypot(x + 0.62, y + 0.35) < 0.05;
    if (blip) return EMBER;
    let d = lead - a;
    while (d < 0) d += TAU;
    if (d < 0.035 && r < R - 0.04) return EMBER;
    if ([0.3, 0.6, 0.9].some((ri) => Math.abs(r - ri) < 0.018)) return WARM;
    if (Math.abs(x) < 0.012 || Math.abs(y) < 0.012) return WARM;
    if (d < trail) return WARM * (1 - d / trail);
    return 0;
  };
  const parts = [...extrude(disc, 0.1, { frontHeat: heat, back: 0.25 }), torus([0, 0, 0], R + 0.06, 0.07)];
  return place(assign(nodes, parts), -14, 18);
}

/** Support: a lifebuoy, four bands in ember. */
function lifebuoy(nodes: SheetNode[]): Placement[] {
  const parts = [torus([0, 0, 0], 0.92, 0.32, (_p, u) => ((u * 4 + 0.06) % 1 < 0.13 ? EMBER : 0))];
  return place(assign(nodes, parts), -26, 18);
}

/** Academy: an open book, lines of text on its pages, an ember ribbon. */
function openBook(nodes: SheetNode[]): Placement[] {
  const W = 1.3; // each page, spine to fore-edge
  const D = 0.9; // half the page height (along z)
  const lift = (ax: number) => 0.32 * (1 - Math.exp(-ax * 4.5)) - 0.06 * ax;
  const text: HeatFn = ([x, , z]) => {
    const ax = Math.abs(x);
    if (ax < 0.16 || ax > W - 0.14 || Math.abs(z) > D - 0.16) return 0;
    return ((z + D) / 0.1) % 1 < 0.2 ? WARM : 0;
  };
  const page = (side: number): Part => ({
    kind: "param",
    weight: W * 2 * D * 1.1,
    map: (u, v) => {
      const ax = u * W;
      return [side * ax, lift(ax), -D + v * 2 * D];
    },
    heat: text,
  });
  const cover = (side: number): Part => ({
    kind: "param",
    weight: W * 2 * D * 0.5,
    map: (u, v) => [side * u * (W + 0.06), -0.06, -D - 0.05 + v * (2 * D + 0.1)],
  });
  const foreEdge = (side: number): Part => ({
    kind: "param",
    weight: 2 * D * 0.3,
    map: (u, v) => [side * W, -0.06 + v * (lift(W) + 0.06), -D + u * 2 * D],
    heat: (_p, _u, v) => ((v * 6) % 1 < 0.35 ? WARM : 0),
  });
  const ribbon = tube3(
    [
      [0.02, 0.01, -0.3],
      [0.05, 0.0, D],
      [0.07, -0.55, D + 0.06],
    ],
    0.03,
    () => EMBER
  );
  const parts = [page(-1), page(1), cover(-1), cover(1), foreEdge(-1), foreEdge(1), ribbon];
  return place(assign(nodes, parts), 42, 0, 1.05).map((p) => ({ ...p, y: p.y + 0.1 }));
}

/** Digital Strategy: a chess pawn, the collar in ember. */
function pawn(nodes: SheetNode[]): Placement[] {
  const head: V2[] = [];
  const hc = 0.82;
  const hr = 0.4;
  const a0 = Math.asin(-0.9);
  for (let i = 0; i <= 24; i += 1) {
    const a = a0 + ((Math.PI / 2 - a0) * i) / 24;
    head.push([Math.cos(a) * hr, hc + Math.sin(a) * hr]);
  }
  const profile: V2[] = [
    [0.0, -1.25],
    [0.82, -1.25],
    [0.82, -1.1],
    [0.66, -1.0],
    [0.54, -0.8],
    [0.42, -0.35],
    [0.33, 0.15],
    [0.3, 0.28],
    [0.52, 0.32],
    [0.52, 0.42],
    [0.24, 0.47],
    ...head,
  ];
  const parts = [lathe(profile, ([x, y, z]) => (y > 0.3 && y < 0.44 && Math.hypot(x, z) > 0.46 ? EMBER : 0))];
  return place(assign(nodes, parts), 8, 0);
}

/** Internships: a sprout, the new bud in ember. */
function sprout(nodes: SheetNode[]): Placement[] {
  const mound = lathe(
    [
      [0.0, -0.92],
      [0.45, -0.97],
      [0.8, -1.07],
      [1.08, -1.22],
    ],
    undefined,
    0.8
  );
  const stem: V3[] = Array.from({ length: 20 }, (_, i) => {
    const t = i / 19;
    return [0.1 * Math.sin(Math.PI * t), -0.95 + 1.55 * t, 0];
  });
  const top = stem[stem.length - 1];
  const leaf = (dir: number, len: number, wid: number, lift: number): Part => {
    // A vesica: inside two circles, in the leaf's own plane.
    const r = (len * len + wid * wid) / (2 * wid);
    const inside = (x: number, y: number) => x > 0 && x < len && Math.hypot(x - len / 2, y + (r - wid / 2)) < r && Math.hypot(x - len / 2, y - (r - wid / 2)) < r;
    const ang = deg(lift);
    return {
      kind: "region",
      weight: len * wid * 0.7,
      inside,
      bbox: [0, -wid / 2, len, wid / 2],
      to: (x, y) => {
        const ax = Math.cos(ang) * dir;
        const ay = Math.sin(ang);
        return [top[0] + ax * x - ay * y * 0.2 * dir, top[1] - 0.12 + ay * x + Math.abs(ax) * y, 0.15 * (x / len) * (x / len) - 0.1 * y * y];
      },
      heat: (_p, x, y) => (Math.abs(y) < 0.012 && x < len * 0.9 ? WARM : 0),
    };
  };
  const parts = [
    mound,
    tube3(stem, 0.05),
    leaf(-1, 1.05, 0.5, 28),
    leaf(1, 0.85, 0.42, 38),
    sphere([top[0], top[1] + 0.08, 0], 0.09, () => EMBER),
  ];
  return place(assign(nodes, parts), 10, 0, 1.05);
}

/** Resources: a lightbulb, the filament in ember. */
function lightbulb(nodes: SheetNode[]): Placement[] {
  const c = 0.42;
  const R = 0.82;
  const glass: V2[] = [];
  const aLow = -Math.asin(0.86);
  for (let i = 0; i <= 32; i += 1) {
    const a = Math.PI / 2 - ((Math.PI / 2 - aLow) * i) / 32;
    glass.push([Math.cos(a) * R, c + Math.sin(a) * R]);
  }
  const profile: V2[] = [
    [0, c + R],
    ...glass.slice(1),
    [0.37, -0.58],
    [0.37, -1.02],
    [0.2, -1.16],
    [0.0, -1.18],
  ];
  const bulb = lathe(profile, ([, y]) => (y < -0.6 && y > -1.02 && ((y + 0.6) / -0.085) % 1 < 0.35 ? WARM : 0), 0.7);
  const coil: V3[] = [[-0.12, -0.45, 0], [-0.2, 0.3, 0]];
  for (let i = 0; i <= 24; i += 1) {
    const t = i / 24;
    coil.push([-0.2 + 0.4 * t, 0.3 + 0.06 * Math.sin(t * Math.PI * 8), 0.02 * Math.cos(t * Math.PI * 8)]);
  }
  coil.push([0.12, -0.45, 0]);
  const parts = [bulb, tube3(coil, 0.022, () => EMBER)];
  return place(assign(nodes, parts), 6, 0, 1.05);
}

export const SHAPES: Record<string, (nodes: SheetNode[]) => Placement[]> = {
  padlock,
  "speech-bubble": speechBubble,
  puzzle,
  checkmark,
  staircase,
  tower,
  rack,
  "neural-net": neuralNet,
  gear,
  radar,
  lifebuoy,
  "open-book": openBook,
  pawn,
  sprout,
  lightbulb,
};
