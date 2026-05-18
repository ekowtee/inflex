/**
 * Pricing pipeline tests — pure functions only, no Prisma, no DB.
 * Run: npm test
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  ceilToIncrement,
  computeFinanceChargePct,
  computeVatBreakdown,
  convertCurrency,
  priceLine,
  calculateQuoteTotals,
  type PriceLineInput,
  type PriceLineContext,
} from "../pricing";

function near(actual: number, expected: number, tolerance = 0.01) {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `Expected ${actual} to be within ${tolerance} of ${expected}`
  );
}

// ---------- helpers / context ----------

const defaultCtx: PriceLineContext = {
  quoteCurrency: "GHS",
  fxRate: null,
  annualInterestRatePct: 22,
  projectCycleWeeks: 8,
  advancePaymentPct: 0,
  whtPct: 0,
  rounding: { threshold: 70, incrementBelow: 0.01, incrementAbove: 1 },
};

const baseLine: PriceLineInput = {
  kind: "PRODUCT",
  quantity: 1,
  landedCost: 100,
  landedCostCurrency: "GHS",
  markupPct: 0,
  surchargePct: 0,
  discountPct: 0,
  carriesFinanceCharge: true,
};

// ---------- helpers ----------

describe("ceilToIncrement", () => {
  it("rounds up to a 1-unit increment", () => {
    assert.strictEqual(ceilToIncrement(100.01, 1), 101);
    assert.strictEqual(ceilToIncrement(100, 1), 100);
  });
  it("rounds up to a 0.01 increment", () => {
    assert.strictEqual(ceilToIncrement(12.341, 0.01), 12.35);
    assert.strictEqual(ceilToIncrement(12.34, 0.01), 12.34);
  });
  it("handles zero/negative increment by passing through", () => {
    assert.strictEqual(ceilToIncrement(99.99, 0), 99.99);
    assert.strictEqual(ceilToIncrement(99.99, -1), 99.99);
  });
});

describe("computeFinanceChargePct", () => {
  it("matches spec example: 22% annual × 8 weeks × no advance ≈ 3.385%", () => {
    near(computeFinanceChargePct(22, 8, 0), 3.3846, 0.001);
  });
  it("scales linearly with cycle weeks", () => {
    near(computeFinanceChargePct(22, 16, 0), 6.7692, 0.001);
  });
  it("zeroes out when fully prepaid", () => {
    assert.strictEqual(computeFinanceChargePct(22, 8, 100), 0);
  });
  it("halves with 50% advance", () => {
    near(computeFinanceChargePct(22, 8, 50), 1.6923, 0.001);
  });
});

describe("computeVatBreakdown", () => {
  it("default 15/2.5/2.5 → 20% flat on subtotal (no cascade)", () => {
    const r = computeVatBreakdown(1000, {
      standardPct: 15,
      nhilPct: 2.5,
      getfundPct: 2.5,
    });
    near(r.nhilAmount, 25);              // 1000 × 2.5%
    near(r.getfundAmount, 25);           // 1000 × 2.5%
    near(r.vatStandardAmount, 150);      // 1000 × 15%
    near(r.vatAmount, 200);              // sum
    near(r.effectivePct, 20);
  });
  it("each rate hits the same base independently", () => {
    const r = computeVatBreakdown(2000, {
      standardPct: 15,
      nhilPct: 3,
      getfundPct: 2.5,
    });
    near(r.nhilAmount, 60);     // 2000 × 3%
    near(r.getfundAmount, 50);  // 2000 × 2.5%
    near(r.vatStandardAmount, 300); // 2000 × 15%
    near(r.vatAmount, 410);
    near(r.effectivePct, 20.5);
  });
  it("zero base → zero vat", () => {
    const r = computeVatBreakdown(0, { standardPct: 15, nhilPct: 2.5, getfundPct: 2.5 });
    assert.strictEqual(r.vatAmount, 0);
    assert.strictEqual(r.effectivePct, 0);
  });
});

describe("convertCurrency", () => {
  it("passes through same-currency", () => {
    assert.strictEqual(convertCurrency(100, "GHS", "GHS", null), 100);
  });
  it("multiplies by fxRate when crossing currencies", () => {
    near(convertCurrency(100, "USD", "GHS", 15.5), 1550);
  });
  it("throws when fxRate is missing", () => {
    assert.throws(() => convertCurrency(100, "USD", "GHS", null));
    assert.throws(() => convertCurrency(100, "USD", "GHS", 0));
  });
});

// ---------- priceLine — the full pipeline ----------

describe("priceLine — zero advance + finance charge baked in", () => {
  it("computes a clean PRODUCT line", () => {
    const r = priceLine(
      { ...baseLine, landedCost: 1000, markupPct: 15 },
      { ...defaultCtx, annualInterestRatePct: 22, projectCycleWeeks: 8 }
    );
    // finance: 22% × 8/52 = 3.3846%, applied to 1000 = 33.85 (rounded)
    near(r.unitFinanceCharge, 33.85, 0.05);
    // unit with finance: 1033.85; ×1.15 = 1188.92
    near(r.unitWithMarkup, 1188.92, 0.05);
    // No surcharge / discount / WHT — final = 1188.92, ceiling to 1.00 = 1189
    near(r.finalUnitPriceExclTax, 1189, 0.01);
    near(r.finalLineTotalExclTax, 1189);
    near(r.costLineTotal, 1000);
    near(r.lineGpAmount, 155.15, 0.05);  // 1189 - 1000 - 33.85
  });
});

describe("priceLine — full advance suppresses finance charge", () => {
  it("financeCharge=0 when advance=100", () => {
    const r = priceLine(
      { ...baseLine, landedCost: 1000, markupPct: 15 },
      { ...defaultCtx, advancePaymentPct: 100 }
    );
    assert.strictEqual(r.unitFinanceCharge, 0);
    assert.strictEqual(r.financeChargePct, 0);
    near(r.finalUnitPriceExclTax, 1150);
  });
});

describe("priceLine — tier without finance charge", () => {
  it("carriesFinanceCharge=false suppresses finance even with interest set", () => {
    const r = priceLine(
      { ...baseLine, landedCost: 1000, markupPct: 100, carriesFinanceCharge: false },
      { ...defaultCtx, annualInterestRatePct: 22, projectCycleWeeks: 8 }
    );
    assert.strictEqual(r.unitFinanceCharge, 0);
    near(r.finalUnitPriceExclTax, 2000);
  });
});

describe("priceLine — multi-currency FX conversion", () => {
  it("converts USD landed cost to GHS via fxRate", () => {
    const r = priceLine(
      { ...baseLine, landedCost: 100, landedCostCurrency: "USD", markupPct: 0 },
      { ...defaultCtx, fxRate: 15.5, annualInterestRatePct: 0 }
    );
    near(r.unitLanded, 1550);
    near(r.finalUnitPriceExclTax, 1550);
  });
  it("throws when fxRate missing on multi-currency line", () => {
    assert.throws(() =>
      priceLine(
        { ...baseLine, landedCostCurrency: "USD" },
        { ...defaultCtx, fxRate: null }
      )
    );
  });
});

describe("priceLine — WHT gross-up by category", () => {
  // Spec §6: grossUp = net × pct / (1 − pct)
  // With net = 100, expected grossUp matrix:
  const cases = [
    { label: "NONE 0%",                  whtPct: 0,    expectedGross: 0 },
    { label: "GOODS_3 3%",               whtPct: 3,    expectedGross: 3.09 },     // 100 × 3 / 97
    { label: "WORKS_5 5%",               whtPct: 5,    expectedGross: 5.26 },     // 100 × 5 / 95
    { label: "SERVICES_RESIDENT_7_5",    whtPct: 7.5,  expectedGross: 8.11 },     // 100 × 7.5 / 92.5
    { label: "VAT_AGENT_7 7%",           whtPct: 7,    expectedGross: 7.53 },     // 100 × 7 / 93
    { label: "MGMT_TECH_NONRES 25%",     whtPct: 25,   expectedGross: 33.33 },    // 100 × 25 / 75
  ];

  for (const c of cases) {
    it(c.label, () => {
      const r = priceLine(
        { ...baseLine, landedCost: 100, markupPct: 0, carriesFinanceCharge: false },
        { ...defaultCtx, annualInterestRatePct: 0, whtPct: c.whtPct }
      );
      near(r.unitWhtGrossUp, c.expectedGross, 0.05);
    });
  }
});

describe("priceLine — discount + surcharge interaction", () => {
  it("applies surcharge before discount", () => {
    const r = priceLine(
      {
        ...baseLine,
        landedCost: 1000,
        markupPct: 0,
        surchargePct: 10,
        discountPct: 5,
        carriesFinanceCharge: false,
      },
      { ...defaultCtx, annualInterestRatePct: 0 }
    );
    // 1000 × 1.10 × 0.95 = 1045
    near(r.finalUnitPriceExclTax, 1045);
  });
});

describe("priceLine — rounding thresholds", () => {
  it("rounds up to 0.01 for prices ≤ 70", () => {
    const r = priceLine(
      { ...baseLine, landedCost: 50, markupPct: 0, carriesFinanceCharge: false },
      { ...defaultCtx, annualInterestRatePct: 0 }
    );
    near(r.finalUnitPriceExclTax, 50);
  });
  it("rounds up to 1.00 for prices > 70", () => {
    const r = priceLine(
      { ...baseLine, landedCost: 100.01, markupPct: 0, carriesFinanceCharge: false },
      { ...defaultCtx, annualInterestRatePct: 0 }
    );
    assert.strictEqual(r.finalUnitPriceExclTax, 101);
  });
});

describe("priceLine — quantity > 1 line totals", () => {
  it("multiplies quantity into final + cost + GP", () => {
    const r = priceLine(
      { ...baseLine, quantity: 10, landedCost: 100, markupPct: 0, carriesFinanceCharge: false },
      { ...defaultCtx, annualInterestRatePct: 0 }
    );
    near(r.finalLineTotalExclTax, 1000);
    near(r.costLineTotal, 1000);
    near(r.lineGpAmount, 0);
    near(r.lineGpMarginPct, 0);
  });
  it("GP scales with quantity", () => {
    const r = priceLine(
      { ...baseLine, quantity: 10, landedCost: 100, markupPct: 25, carriesFinanceCharge: false },
      { ...defaultCtx, annualInterestRatePct: 0 }
    );
    near(r.finalLineTotalExclTax, 1250);
    near(r.lineGpAmount, 250);
    near(r.lineGpMarginPct, 20);
  });
});

// ---------- calculateQuoteTotals ----------

describe("calculateQuoteTotals — VAT applied", () => {
  it("subtotal + flat-sum VAT = total when VAT registered (defaults sum to 20%)", () => {
    const r = calculateQuoteTotals({
      lines: [
        { kind: "PRODUCT", finalLineTotalExclTax: 1000, lineGpAmount: 200 },
      ],
      vatApplied: true,
      vatRates: { standardPct: 15, nhilPct: 2.5, getfundPct: 2.5 },
      nonVatTaxApplied: false,
      nonVatTaxOnGoodsPct: 0,
      nonVatTaxOnServicesPct: 0,
    });
    near(r.subtotal, 1000);
    assert.ok(r.vatBreakdown);
    near(r.vatAmount, 200);   // 25 + 25 + 150 = 200
    near(r.total, 1200);
    near(r.totalGpMarginPct, 20);
    assert.strictEqual(r.nonVatTaxAmount, 0);
  });
});

describe("calculateQuoteTotals — non-VAT sales tax (below threshold)", () => {
  it("applies 3% to PRODUCT subtotal only, 0% to services", () => {
    const r = calculateQuoteTotals({
      lines: [
        { kind: "PRODUCT", finalLineTotalExclTax: 1000, lineGpAmount: 200 },
        { kind: "LABOUR", finalLineTotalExclTax: 500, lineGpAmount: 250 },
      ],
      vatApplied: false,
      vatRates: { standardPct: 15, nhilPct: 2.5, getfundPct: 2.5 },
      nonVatTaxApplied: true,
      nonVatTaxOnGoodsPct: 3,
      nonVatTaxOnServicesPct: 0,
    });
    near(r.subtotal, 1500);
    near(r.goodsSubtotal, 1000);
    near(r.servicesSubtotal, 500);
    assert.strictEqual(r.vatBreakdown, null);
    assert.strictEqual(r.vatAmount, 0);
    near(r.nonVatTaxAmount, 30); // 1000 × 3%
    near(r.total, 1530);
  });
});

describe("calculateQuoteTotals — VAT trumps non-VAT", () => {
  it("when both flags true, only VAT is applied", () => {
    const r = calculateQuoteTotals({
      lines: [{ kind: "PRODUCT", finalLineTotalExclTax: 1000, lineGpAmount: 0 }],
      vatApplied: true,
      vatRates: { standardPct: 15, nhilPct: 2.5, getfundPct: 2.5 },
      nonVatTaxApplied: true,
      nonVatTaxOnGoodsPct: 3,
      nonVatTaxOnServicesPct: 0,
    });
    assert.ok(r.vatBreakdown);
    assert.strictEqual(r.nonVatTaxAmount, 0);
  });
});

describe("calculateQuoteTotals — empty quote", () => {
  it("returns all zeros", () => {
    const r = calculateQuoteTotals({
      lines: [],
      vatApplied: true,
      vatRates: { standardPct: 15, nhilPct: 2.5, getfundPct: 2.5 },
      nonVatTaxApplied: false,
      nonVatTaxOnGoodsPct: 0,
      nonVatTaxOnServicesPct: 0,
    });
    assert.strictEqual(r.subtotal, 0);
    assert.strictEqual(r.vatAmount, 0);
    assert.strictEqual(r.total, 0);
    assert.strictEqual(r.totalGpMarginPct, 0);
  });
});
