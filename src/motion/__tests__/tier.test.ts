import { test } from "node:test";
import assert from "node:assert/strict";
import { decideTier, type TierEnv } from "../tier";

/** A capable desktop: every gate passes, so tier A. */
const desktop: TierEnv = {
  reducedMotion: false,
  saveData: false,
  reducedData: false,
  hasWebGL2: true,
  deviceMemory: 8,
  hardwareConcurrency: 8,
  viewportWidth: 1920,
  coarsePointer: false,
};

const env = (overrides: Partial<TierEnv>): TierEnv => ({
  ...desktop,
  ...overrides,
});

test("a capable desktop gets tier A", () => {
  assert.equal(decideTier(desktop), "A");
});

test("reduced motion always wins, even on capable hardware", () => {
  assert.equal(decideTier(env({ reducedMotion: true })), "C");
});

test("save-data and reduced-data both force tier C", () => {
  assert.equal(decideTier(env({ saveData: true })), "C");
  assert.equal(decideTier(env({ reducedData: true })), "C");
});

test("no WebGL 2 means tier C", () => {
  assert.equal(decideTier(env({ hasWebGL2: false })), "C");
});

test("under 4 GB of device memory means tier C", () => {
  assert.equal(decideTier(env({ deviceMemory: 2 })), "C");
  assert.equal(decideTier(env({ deviceMemory: 4 })), "A");
});

test("unreported device memory does not demote", () => {
  assert.equal(decideTier(env({ deviceMemory: undefined })), "A");
});

test("few cores demote to B on desktop and C on a small viewport", () => {
  assert.equal(decideTier(env({ hardwareConcurrency: 2 })), "B");
  assert.equal(
    decideTier(env({ hardwareConcurrency: 2, viewportWidth: 390 })),
    "C"
  );
});

test("unreported core count does not demote", () => {
  assert.equal(decideTier(env({ hardwareConcurrency: undefined })), "A");
});

test("a small viewport is tier B", () => {
  assert.equal(decideTier(env({ viewportWidth: 390 })), "B");
  assert.equal(decideTier(env({ viewportWidth: 1023 })), "B");
  assert.equal(decideTier(env({ viewportWidth: 1024 })), "A");
});

test("a coarse pointer on a wide screen is tier B", () => {
  assert.equal(decideTier(env({ coarsePointer: true })), "B");
});

test("a mid-range Android phone lands on tier B", () => {
  assert.equal(
    decideTier({
      reducedMotion: false,
      saveData: false,
      reducedData: false,
      hasWebGL2: true,
      deviceMemory: 4,
      hardwareConcurrency: 8,
      viewportWidth: 390,
      coarsePointer: true,
    }),
    "B"
  );
});

test("a low-memory phone lands on tier C", () => {
  assert.equal(
    decideTier({
      reducedMotion: false,
      saveData: false,
      reducedData: false,
      hasWebGL2: true,
      deviceMemory: 2,
      hardwareConcurrency: 4,
      viewportWidth: 360,
      coarsePointer: true,
    }),
    "C"
  );
});
