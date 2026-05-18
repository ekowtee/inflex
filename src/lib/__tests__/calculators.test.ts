/**
 * Calculator helper tests (Labour + Outstation, spec §8.1 / §8.2).
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  defaultIndirectDays,
  priceLabour,
  priceOutstation,
  type LabourRoleRef,
} from "../calculators";

function near(actual: number, expected: number, tol = 0.01) {
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `Expected ${actual} to be within ${tol} of ${expected}`
  );
}

const roles: LabourRoleRef[] = [
  { id: "term", name: "Term Worker", dailyRate: 250, kind: "DIRECT" },
  { id: "tech", name: "Technician", dailyRate: 400, kind: "DIRECT" },
  { id: "eng1", name: "Engineer I", dailyRate: 900, kind: "DIRECT" },
  { id: "eng2", name: "Engineer II", dailyRate: 1300, kind: "DIRECT" },
  { id: "spec", name: "Specialist", dailyRate: 1800, kind: "DIRECT" },
  {
    id: "out1",
    name: "Engineer II",
    dailyRate: 1300,
    kind: "DIRECT",
    outstationRate: {
      feeding: 180,
      localTransport: 100,
      outstationCharge: 400,
      misc: 50,
      transportPerTrip: 300,
    },
  },
];

describe("defaultIndirectDays", () => {
  it("Term Worker → 0", () => {
    assert.strictEqual(defaultIndirectDays("Term Worker", 10), 0);
  });
  it("Technician → 0", () => {
    assert.strictEqual(defaultIndirectDays("Technician", 10), 0);
  });
  it("Engineer I (5d × 0.25 = 1.25, ceil to 0.5) → 1.5", () => {
    near(defaultIndirectDays("Engineer I", 5), 1.5);
  });
  it("Engineer II (4d × 0.25 = 1.0, ceil to 0.5) → 1.0", () => {
    near(defaultIndirectDays("Engineer II", 4), 1.0);
  });
  it("Specialist (5d × 0.25 = 1.25, ceil to 0.25) → 1.25", () => {
    near(defaultIndirectDays("Specialist", 5), 1.25);
  });
  it("zero days → 0", () => {
    assert.strictEqual(defaultIndirectDays("Engineer II", 0), 0);
  });
});

describe("priceLabour", () => {
  it("rolls up direct + indirect days × daily rate", () => {
    const r = priceLabour(
      [
        { roleId: "tech", days: 3, indirectDays: 0 },
        { roleId: "eng2", days: 5, indirectDays: 1.5 },
      ],
      roles
    );
    // tech: 3 × 400 = 1200; eng2: (5 + 1.5) × 1300 = 8450; total = 9650
    near(r.landedCost, 9650);
    assert.strictEqual(r.rows.length, 2);
    assert.ok(r.specsMarkdown.includes("Engineer II"));
    assert.ok(r.specsMarkdown.includes("Total"));
  });
  it("ignores unknown roleIds", () => {
    const r = priceLabour([{ roleId: "ghost", days: 5, indirectDays: 0 }], roles);
    assert.strictEqual(r.landedCost, 0);
    assert.strictEqual(r.rows.length, 0);
  });
  it("empty entries → zero cost", () => {
    const r = priceLabour([], roles);
    assert.strictEqual(r.landedCost, 0);
  });
});

describe("priceOutstation", () => {
  it("per-diem × staff × days + trips × transport", () => {
    // roleDailyTotal = 180+100+400+50 = 730
    // 2 staff × 3 days × 730 = 4380
    // 2 trips × 300 = 600
    // total = 4980
    const r = priceOutstation(
      [{ roleId: "out1", staffCount: 2, days: 3, trips: 2 }],
      roles
    );
    near(r.landedCost, 4980);
    assert.strictEqual(r.rows.length, 1);
    assert.strictEqual(r.rows[0].roleDailyTotal, 730);
    assert.strictEqual(r.rows[0].perDiemSubtotal, 4380);
    assert.strictEqual(r.rows[0].transportSubtotal, 600);
  });
  it("skips roles without an outstation rate", () => {
    const r = priceOutstation(
      [{ roleId: "tech", staffCount: 1, days: 5, trips: 1 }],
      roles
    );
    assert.strictEqual(r.landedCost, 0);
    assert.strictEqual(r.rows.length, 0);
  });
  it("staffCount is clamped to at least 1", () => {
    const r = priceOutstation(
      [{ roleId: "out1", staffCount: 0, days: 1, trips: 0 }],
      roles
    );
    near(r.landedCost, 730);
  });
});
