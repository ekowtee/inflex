import { test } from "node:test";
import assert from "node:assert/strict";
import { sceneStateAt, pillarHoldVh, FIRST_MORPH_VH, MORPH_VH, PILLAR_FORMATION, PILLAR_VH } from "../formationTrack";
import { BEAT_START_VH } from "../timeline";

test("the hero is the resting sheet, lit, with no noise", () => {
  assert.deepEqual(sceneStateAt(0), { from: 0, to: 0, mix: 0, noise: 0, gate: 1.3, ground: 0, spread: 0, bloom: 0.55, bend: 0 });
});

test("Beat 1 unmakes the sheet and Beat 2 resolves it", () => {
  const start2 = sceneStateAt(BEAT_START_VH[2]);
  assert.ok(Math.abs(start2.noise - 0.35) < 1e-6, `noise at Beat 2 start ${start2.noise}`);
  assert.ok(start2.gate < -0.29, "ember is out at the start of the resolve");
  const early2 = sceneStateAt(BEAT_START_VH[2] + 32);
  assert.ok(early2.noise < 0.01 && early2.gate > 1.25 && early2.bend > 0.99, "resolved, bent and relit as the heading reaches the top");
});

test("the sheet bends into its S over the resolve and relaxes before the network fabric", () => {
  assert.equal(sceneStateAt(BEAT_START_VH[2]).bend, 0);
  assert.ok(sceneStateAt(BEAT_START_VH[3] - 21).bend > 0.95);
  assert.ok(sceneStateAt(BEAT_START_VH[3] + 30).bend > 0.99, "held into the proof");
  assert.equal(sceneStateAt(BEAT_START_VH[4] - FIRST_MORPH_VH).bend, 0, "flat again before the morph");
});

test("each pillar formation holds, whole, with its ground", () => {
  PILLAR_FORMATION.forEach((f) => {
    const s = sceneStateAt(pillarHoldVh(f) + 10);
    assert.equal(s.from, f);
    assert.equal(s.to, f);
    assert.equal(s.ground, f === 1 || f === 4 ? 1 : 0);
  });
});

test("each formation is whole when its row starts, and morphs one at a time before it", () => {
  // Row k starts at b4 + 80k, which is also where a pillar link jumps to.
  PILLAR_FORMATION.forEach((f, k) => {
    const s = sceneStateAt(BEAT_START_VH[4] + PILLAR_VH * k);
    assert.equal(s.from, f, `row ${k} start`);
    assert.equal(s.to, f, `row ${k} start`);
    const w = k === 0 ? FIRST_MORPH_VH : MORPH_VH;
    const mid = sceneStateAt(BEAT_START_VH[4] + PILLAR_VH * k - w / 2);
    assert.equal(mid.to - mid.from, 1, `morph into row ${k}`);
    assert.ok(mid.mix > 0.45 && mid.mix < 0.55, `mix halfway into row ${k} is ${mid.mix}`);
  });
  // The fabric is whole before the pillars' top reaches the viewport top.
  assert.equal(sceneStateAt(BEAT_START_VH[4] - 0.01).mix > 0.99, true);
});

test("mix is continuous across the whole pinned chapter", () => {
  let last = sceneStateAt(BEAT_START_VH[3]);
  for (let vh = BEAT_START_VH[3]; vh < BEAT_START_VH[5]; vh += 0.5) {
    const s = sceneStateAt(vh);
    const a = last.from + last.mix * (last.to - last.from);
    const b = s.from + s.mix * (s.to - s.from);
    assert.ok(Math.abs(b - a) < 0.08, `jump at ${vh}: ${a} → ${b}`);
    last = s;
  }
});

test("warmth spreads through the sheet in the intelligence band only", () => {
  assert.equal(sceneStateAt(BEAT_START_VH[5.5] - 50).spread, 0);
  const mid = sceneStateAt(BEAT_START_VH[5.5]).spread;
  assert.ok(mid > 0.4 && mid < 0.8, `spread at the band's top is ${mid}`);
  assert.equal(sceneStateAt(BEAT_START_VH[5.5] + 40).spread, 1);
  // Spread right up to the ask; the scene gathers it on the chapter's entry,
  // and in the ask the object is no longer the resting sheet.
  assert.equal(sceneStateAt(BEAT_START_VH[8] - 1).spread, 1);
  assert.equal(sceneStateAt(BEAT_START_VH[8] + 5).spread, 1, "carried into the ask");
  assert.equal(sceneStateAt(BEAT_START_VH[4] + 50).spread, 0);
});

test("after the pillars the sheet is back for the intelligence band", () => {
  const s = sceneStateAt(BEAT_START_VH[5.5] + 5);
  assert.equal(s.from, 0);
  assert.equal(s.to, 0);
});

test("the ask's track is the mark, whole, at the bloom peak", () => {
  // The scene forms it on the chapter's entry and dissolves it on its exit
  // (store.askEntry, store.askExit); the track only names the object.
  for (const vh of [BEAT_START_VH[8], BEAT_START_VH[8] + 40, BEAT_START_VH[9]]) {
    const s = sceneStateAt(vh);
    assert.equal(s.to, 5);
    assert.ok(s.mix > 0.99 && Math.abs(s.bloom - 0.9) < 1e-6, `at ${vh}`);
  }
  for (let vh = 0; vh < BEAT_START_VH[9] + 60; vh += 1) {
    const s = sceneStateAt(vh);
    assert.ok(s.bloom <= 0.9 + 1e-6 && (s.bloom === 0.55 || s.to === 5), `bloom rises only in the reveal (${vh})`);
  }
});
