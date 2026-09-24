import { test } from "node:test";
import assert from "node:assert/strict";
import { sceneStateAt, pillarHoldVh, PILLAR_FORMATION, PILLAR_VH } from "../formationTrack";
import { BEAT_START_VH } from "../timeline";

test("the hero is the resting sheet, lit, with no noise", () => {
  assert.deepEqual(sceneStateAt(0), { from: 0, to: 0, mix: 0, noise: 0, gate: 1.3, ground: 0, spread: 0, bloom: 0.55 });
});

test("Beat 1 unmakes the sheet and Beat 2 resolves it", () => {
  const start2 = sceneStateAt(BEAT_START_VH[2]);
  assert.ok(Math.abs(start2.noise - 0.35) < 1e-6, `noise at Beat 2 start ${start2.noise}`);
  assert.ok(start2.gate < -0.29, "ember is out at the start of the resolve");
  const late2 = sceneStateAt(BEAT_START_VH[3] - 21);
  assert.ok(late2.noise < 0.01 && late2.gate > 1.25, "resolved and relit before the proof");
});

test("each pillar formation holds, whole, with its ground", () => {
  PILLAR_FORMATION.forEach((f) => {
    const s = sceneStateAt(pillarHoldVh(f) + 10);
    assert.equal(s.from, f);
    assert.equal(s.to, f);
    assert.equal(s.ground, f === 1 || f === 4 ? 1 : 0);
  });
});

test("morphs straddle the row boundaries and move one formation at a time", () => {
  for (let k = 1; k < 4; k += 1) {
    const s = sceneStateAt(BEAT_START_VH[4] + PILLAR_VH * k);
    assert.equal(s.to - s.from, 1, `boundary ${k}`);
    assert.ok(s.mix > 0.45 && s.mix < 0.55, `mix at boundary ${k} is ${s.mix}`);
  }
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
  assert.equal(sceneStateAt(BEAT_START_VH[8] + 5).spread, 0);
  assert.equal(sceneStateAt(BEAT_START_VH[4] + 50).spread, 0);
});

test("after the pillars the sheet is back for the intelligence band", () => {
  const s = sceneStateAt(BEAT_START_VH[5.5] + 5);
  assert.equal(s.from, 0);
  assert.equal(s.to, 0);
});

test("the ask morphs the line into the mark and raises bloom to its peak", () => {
  const start = sceneStateAt(BEAT_START_VH[8] + 2);
  assert.equal(start.to, 5);
  assert.ok(start.mix < 0.01 && Math.abs(start.bloom - 0.55) < 1e-6);
  const done = sceneStateAt(BEAT_START_VH[8] + 75);
  assert.ok(done.mix > 0.99 && Math.abs(done.bloom - 0.9) < 1e-6);
  const doors = sceneStateAt(BEAT_START_VH[9] + 10);
  assert.equal(doors.to, 5, "held through the doors while the Core fades");
  for (let vh = 0; vh < BEAT_START_VH[9] + 60; vh += 1) {
    const s = sceneStateAt(vh);
    assert.ok(s.bloom <= 0.9 + 1e-6 && (s.bloom === 0.55 || s.to === 5), `bloom rises only in the reveal (${vh})`);
  }
});
