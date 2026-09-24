import { test } from "node:test";
import assert from "node:assert/strict";
import {
  generateCore,
  fingerprint,
  NODE_COUNT,
  HALF,
  FORMATIONS,
} from "../worker/formations";

const data = generateCore();

const pos = (f: number, i: number) => {
  const o = (f * NODE_COUNT + i) * 4;
  return [data.positions[o], data.positions[o + 1], data.positions[o + 2], data.positions[o + 3]];
};

test("generates exactly the node count in every formation", () => {
  assert.equal(data.positions.length, NODE_COUNT * 4 * FORMATIONS);
  assert.equal(data.normals.length, NODE_COUNT * 3);
  assert.equal(data.seeds.length, NODE_COUNT);
});

test("is deterministic: two runs produce the same fingerprint", () => {
  assert.equal(fingerprint(generateCore()), fingerprint(data));
});

test("a different seed produces different geometry", () => {
  assert.notEqual(fingerprint(generateCore(12345)), fingerprint(data));
});

test("edge count is in the expected band and no edge is a self-loop", () => {
  assert.ok(data.edgeCount >= 18000 && data.edgeCount <= 30000, `edges: ${data.edgeCount}`);
  for (let e = 0; e < data.edgeCount; e += 1) {
    assert.notEqual(data.edges[e * 2], data.edges[e * 2 + 1]);
  }
});

test("no edge exceeds the formation-0 maximum length", () => {
  let longest = 0;
  for (let e = 0; e < data.edgeCount; e += 1) {
    const [ax, ay, az] = pos(0, data.edges[e * 2]);
    const [bx, by, bz] = pos(0, data.edges[e * 2 + 1]);
    longest = Math.max(longest, Math.hypot(ax - bx, ay - by, az - bz));
  }
  assert.ok(longest <= 0.09 + 1e-6, `longest edge ${longest}`);
});

test("formation-0 ember line is about six percent of nodes", () => {
  let hot = 0;
  for (let i = 0; i < NODE_COUNT; i += 1) if (pos(0, i)[3] >= 1) hot += 1;
  const share = hot / NODE_COUNT;
  assert.ok(share > 0.012 && share < 0.04, `ember share ${share}`);
});

test("every formation has some ember and stays within a sane bound", () => {
  for (let f = 0; f < 6; f += 1) {
    let hot = 0;
    let far = 0;
    for (let i = 0; i < NODE_COUNT; i += 1) {
      const [x, y, z, h] = pos(f, i);
      if (h > 0) hot += 1;
      if (Math.hypot(x, y, z) > 3.2) far += 1;
    }
    assert.ok(hot > NODE_COUNT * 0.02, `formation ${f} has too little ember: ${hot}`);
    assert.equal(far, 0, `formation ${f} has nodes outside the bound`);
  }
});

test("ember-capable nodes form a prefix of each half", () => {
  const capable = (i: number) => {
    for (let f = 0; f < 6; f += 1) if (pos(f, i)[3] >= 0.5) return true;
    return false;
  };
  for (let i = 0; i < HALF; i += 1) {
    assert.equal(capable(i), i < data.emberCountA, `half A order broken at ${i}`);
  }
  for (let i = HALF; i < NODE_COUNT; i += 1) {
    assert.equal(capable(i), i - HALF < data.emberCountB, `half B order broken at ${i}`);
  }
});

test("edges inside the first half form a prefix", () => {
  for (let e = 0; e < data.edgeCount; e += 1) {
    const inside = data.edges[e * 2] < HALF && data.edges[e * 2 + 1] < HALF;
    assert.equal(inside, e < data.edgesInHalf, `edge order broken at ${e}`);
  }
  assert.ok(data.edgesInHalf > data.edgeCount * 0.15, "tier B would have too few edges");
});

test("the first half is a uniform subsample: its bounding box matches the whole", () => {
  const box = (from: number, to: number) => {
    let minX = Infinity, maxX = -Infinity;
    for (let i = from; i < to; i += 1) {
      const [x] = pos(0, i);
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
    }
    return [minX, maxX];
  };
  const [aMin, aMax] = box(0, HALF);
  const [allMin, allMax] = box(0, NODE_COUNT);
  assert.ok(Math.abs(aMin - allMin) < 0.05 && Math.abs(aMax - allMax) < 0.05);
});

test("formation-0 normals are unit length and face forward", () => {
  for (let i = 0; i < NODE_COUNT; i += 97) {
    const nx = data.normals[i * 3], ny = data.normals[i * 3 + 1], nz = data.normals[i * 3 + 2];
    assert.ok(Math.abs(Math.hypot(nx, ny, nz) - 1) < 1e-6);
    assert.ok(nz > 0);
  }
});

test("generation is fast enough to hide behind the poster", () => {
  const started = performance.now();
  generateCore();
  const ms = performance.now() - started;
  assert.ok(ms < 2000, `generation took ${ms.toFixed(0)} ms`);
});
