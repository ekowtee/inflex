import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { duration, ease, distance } from "../tokens";

/**
 * The CSS-driven entrances in globals.css must use the same numbers as
 * tokens.ts. This test reads the stylesheet and compares, so the two cannot
 * drift apart silently.
 */
const css = readFileSync("src/app/globals.css", "utf8");

const cssVar = (name: string): string => {
  const match = css.match(new RegExp(`--${name}:\\s*([^;]+);`));
  assert.ok(match, `globals.css is missing --${name}`);
  return match[1].trim();
};

test("durations in globals.css match tokens.ts", () => {
  assert.equal(cssVar("motion-duration-micro"), `${duration.micro}ms`);
  assert.equal(cssVar("motion-duration-ui"), `${duration.ui}ms`);
  assert.equal(cssVar("motion-duration-reveal"), `${duration.reveal}ms`);
  assert.equal(cssVar("motion-duration-scene"), `${duration.scene}ms`);
});

test("easings in globals.css match tokens.ts", () => {
  assert.equal(cssVar("motion-ease-out"), ease.out);
  assert.equal(cssVar("motion-ease-in-out"), ease.inOut);
  assert.equal(cssVar("motion-ease-exit"), ease.exit);
});

test("distances in globals.css match tokens.ts", () => {
  assert.equal(cssVar("motion-distance-reveal"), `${distance.reveal}px`);
  assert.equal(cssVar("motion-distance-line"), `${distance.line}px`);
});

test("no overshoot easings are defined", () => {
  for (const banned of ["bounce", "elastic", "back("]) {
    assert.ok(
      !css.toLowerCase().includes(banned),
      `globals.css must not use ${banned} easings`
    );
  }
});
