import { test } from "node:test";
import assert from "node:assert/strict";
import { BEAT_START_VH, ENTRY_LEAD_VH, virtualVh, type BeatRect } from "../timeline";
import { sceneStateAt } from "../formationTrack";

const H = 900;
const el = {} as HTMLElement;
// The home page at 1440 x 900: the proof (Beat 3) is 1137 px, the pillars
// pin (Beat 4) 3780.
const beats: BeatRect[] = [
  { beat: 2, top: 1235, height: 900, element: el },
  { beat: 3, top: 2135, height: 1137, element: el },
  { beat: 4, top: 3272, height: 3780, element: el },
  { beat: 5, top: 7052, height: 800, element: el },
];
const pillarsTopAt = (fromTop: number) => beats[2].top - fromTop * H;

test("the pillars' entry is on the timeline, not a hold", () => {
  const lead = ENTRY_LEAD_VH[4];
  assert.equal(virtualVh(pillarsTopAt(1), H, beats).vh, BEAT_START_VH[4] - lead, "entry begins at the lead");
  assert.equal(virtualVh(pillarsTopAt(0), H, beats).vh, BEAT_START_VH[4], "the pin starts at b4");
  const half = virtualVh(pillarsTopAt(0.5), H, beats).vh;
  assert.ok(Math.abs(half - (BEAT_START_VH[4] - lead / 2)) < 1e-9);
});

test("the proof's curve holds until the pillars are a third of the way up, then the fabric forms by the pin", () => {
  const third = sceneStateAt(virtualVh(pillarsTopAt(2 / 3), H, beats).vh);
  assert.equal(third.to, 0, "still the sheet a third of the way up");
  assert.ok(third.mix < 0.01);
  const most = sceneStateAt(virtualVh(pillarsTopAt(0.2), H, beats).vh);
  assert.equal(most.to, 1);
  assert.ok(most.mix > 0.5 && most.mix < 1, `forming as the pillars near the top (${most.mix})`);
  const pinned = sceneStateAt(virtualVh(pillarsTopAt(0), H, beats).vh);
  assert.equal(pinned.from, 1);
  assert.equal(pinned.to, 1);
});

test("the mapping is continuous through the proof and into the pin", () => {
  let last = virtualVh(beats[1].top, H, beats).vh;
  for (let y = beats[1].top; y < beats[2].top + 400; y += 2) {
    const v = virtualVh(y, H, beats).vh;
    assert.ok(v >= last - 1e-9 && v - last < 1.5, `jump at ${y}: ${last} → ${v}`);
    last = v;
  }
});
