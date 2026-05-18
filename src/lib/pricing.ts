/**
 * Quote pricing pipeline — pure, side-effect-free functions per
 * QUOTE_BUILDER_SPEC §5 / §7. Every quote calculation MUST go through here so
 * server, client, and PDF agree. Anything Prisma-aware lives in billing.ts.
 *
 * Tested with node:test in src/lib/__tests__/pricing.test.ts.
 */

export const LINE_KINDS = ["PRODUCT", "LABOUR", "OUTSTATION", "FINANCE_CHARGE", "OTHER"] as const;
export type LineKind = (typeof LINE_KINDS)[number];

// ---------- per-line pipeline ----------

export interface PriceLineInput {
  kind: LineKind;
  quantity: number;
  landedCost: number;            // in landedCostCurrency
  landedCostCurrency: string;    // e.g. "GHS" or "USD"
  markupPct: number;             // 0–∞ (typed by user; values >100 OK for labour)
  surchargePct: number;          // 0–∞
  discountPct: number;           // 0–100
  carriesFinanceCharge: boolean; // from MarkupTier
}

export interface PriceLineContext {
  quoteCurrency: string;
  // FX rate expressed as quoteCurrency per 1 unit of foreign currency.
  // Required if any line has landedCostCurrency != quoteCurrency.
  fxRate: number | null;
  annualInterestRatePct: number;
  projectCycleWeeks: number;
  advancePaymentPct: number; // 0..100
  whtPct: number;            // 0..<100
  rounding: {
    threshold: number;        // unit price boundary
    incrementBelow: number;   // round-up step when below threshold (e.g. 0.01)
    incrementAbove: number;   // round-up step when at/above threshold (e.g. 1.00)
  };
}

export interface PriceLineResult {
  unitLanded: number;            // in quote currency
  unitFinanceCharge: number;
  financeChargePct: number;      // for storage (decimal pct, e.g. 3.3846)
  unitWithFinance: number;
  unitWithMarkup: number;
  unitWithSurcharge: number;
  unitAfterDiscount: number;
  unitWhtGrossUp: number;
  unitBeforeRounding: number;
  finalUnitPriceExclTax: number;
  finalLineTotalExclTax: number;
  costLineTotal: number;
  lineGpAmount: number;
  lineGpMarginPct: number;
}

export function priceLine(
  input: PriceLineInput,
  ctx: PriceLineContext
): PriceLineResult {
  // 1. FX-convert landed cost into quote currency
  const unitLanded = convertCurrency(
    input.landedCost,
    input.landedCostCurrency,
    ctx.quoteCurrency,
    ctx.fxRate
  );

  // 2. Finance charge (per-unit, baked in unless the tier opts out)
  const financeChargePct = input.carriesFinanceCharge
    ? computeFinanceChargePct(
        ctx.annualInterestRatePct,
        ctx.projectCycleWeeks,
        ctx.advancePaymentPct
      )
    : 0;
  const unitFinanceCharge = unitLanded * (financeChargePct / 100);

  // 3. Pipeline (spec §5)
  const unitWithFinance = unitLanded + unitFinanceCharge;
  const unitWithMarkup = unitWithFinance * (1 + safePct(input.markupPct) / 100);
  const unitWithSurcharge = unitWithMarkup * (1 + safePct(input.surchargePct) / 100);
  const unitAfterDiscount = unitWithSurcharge * (1 - clamp(input.discountPct, 0, 100) / 100);

  // 4. WHT gross-up
  const wht = clamp(ctx.whtPct, 0, 99.99);
  const unitWhtGrossUp = wht > 0
    ? unitAfterDiscount * (wht / 100) / (1 - wht / 100)
    : 0;
  const unitBeforeRounding = unitAfterDiscount + unitWhtGrossUp;

  // 5. Threshold-aware rounding (always round up — favour the seller)
  const increment = unitBeforeRounding > ctx.rounding.threshold
    ? ctx.rounding.incrementAbove
    : ctx.rounding.incrementBelow;
  const finalUnitPriceExclTax = ceilToIncrement(unitBeforeRounding, increment);

  // 6. Line aggregates
  const quantity = input.quantity;
  const finalLineTotalExclTax = round2(finalUnitPriceExclTax * quantity);
  const costLineTotal = round2(unitLanded * quantity);

  // Spec §5: GP includes finance charge in cost (open question #3 — default per spec).
  const lineFinanceCharge = unitFinanceCharge * quantity;
  const lineGpAmount = round2(finalLineTotalExclTax - costLineTotal - lineFinanceCharge);
  const lineGpMarginPct = finalLineTotalExclTax > 0
    ? round3(lineGpAmount / finalLineTotalExclTax * 100)
    : 0;

  return {
    unitLanded: round2(unitLanded),
    unitFinanceCharge: round2(unitFinanceCharge),
    financeChargePct: round4(financeChargePct),
    unitWithFinance: round2(unitWithFinance),
    unitWithMarkup: round2(unitWithMarkup),
    unitWithSurcharge: round2(unitWithSurcharge),
    unitAfterDiscount: round2(unitAfterDiscount),
    unitWhtGrossUp: round2(unitWhtGrossUp),
    unitBeforeRounding: round2(unitBeforeRounding),
    finalUnitPriceExclTax: round2(finalUnitPriceExclTax),
    finalLineTotalExclTax,
    costLineTotal,
    lineGpAmount,
    lineGpMarginPct,
  };
}

// ---------- quote-level aggregation (spec §7) ----------

export interface PricedLineSummary {
  kind: LineKind;
  finalLineTotalExclTax: number;
  lineGpAmount: number;
}

export interface VatRates {
  standardPct: number;
  nhilPct: number;
  getfundPct: number;
}

export interface VatBreakdown {
  baseAmount: number;
  rates: VatRates;
  // Ghana 2026: each of NHIL, GETFund, and VAT is computed against the
  // subtotal and summed. No cascading.
  nhilAmount: number;        // base × NHIL / 100
  getfundAmount: number;     // base × GETFund / 100
  vatStandardAmount: number; // base × VATstandard / 100
  vatAmount: number;         // nhil + getfund + vat
  effectivePct: number;      // vatAmount / base × 100 (defaults: 20.00)
}

export interface QuoteTotalsInput {
  lines: PricedLineSummary[];
  vatApplied: boolean;
  vatRates: VatRates;
  nonVatTaxApplied: boolean;
  nonVatTaxOnGoodsPct: number;
  nonVatTaxOnServicesPct: number;
}

export interface QuoteTotalsResult {
  subtotal: number;
  vatBreakdown: VatBreakdown | null;
  vatAmount: number;
  goodsSubtotal: number;
  servicesSubtotal: number;
  nonVatTaxAmount: number;
  total: number;
  totalGp: number;
  totalGpMarginPct: number;
}

export function calculateQuoteTotals(input: QuoteTotalsInput): QuoteTotalsResult {
  const subtotal = round2(
    input.lines.reduce((sum, l) => sum + l.finalLineTotalExclTax, 0)
  );

  const goodsSubtotal = round2(
    input.lines
      .filter((l) => l.kind === "PRODUCT" || l.kind === "OTHER")
      .reduce((sum, l) => sum + l.finalLineTotalExclTax, 0)
  );
  const servicesSubtotal = round2(subtotal - goodsSubtotal);

  let vatBreakdown: VatBreakdown | null = null;
  let vatAmount = 0;
  if (input.vatApplied) {
    vatBreakdown = computeVatBreakdown(subtotal, input.vatRates);
    vatAmount = vatBreakdown.vatAmount;
  }

  let nonVatTaxAmount = 0;
  if (input.nonVatTaxApplied && !input.vatApplied) {
    const onGoods = goodsSubtotal * (clamp(input.nonVatTaxOnGoodsPct, 0, 100) / 100);
    const onServices = servicesSubtotal * (clamp(input.nonVatTaxOnServicesPct, 0, 100) / 100);
    nonVatTaxAmount = round2(onGoods + onServices);
  }

  const totalGp = round2(input.lines.reduce((sum, l) => sum + l.lineGpAmount, 0));
  const totalGpMarginPct = subtotal > 0
    ? round3(totalGp / subtotal * 100)
    : 0;

  return {
    subtotal,
    vatBreakdown,
    vatAmount,
    goodsSubtotal,
    servicesSubtotal,
    nonVatTaxAmount,
    total: round2(subtotal + vatAmount + nonVatTaxAmount),
    totalGp,
    totalGpMarginPct,
  };
}

// ---------- formulas ----------

/**
 * Per spec §5:
 *   pct = annualRate × cycleWeeks / 52 × (1 − advancePct)
 * Expressed as a percentage, not a fraction.
 */
export function computeFinanceChargePct(
  annualInterestRatePct: number,
  projectCycleWeeks: number,
  advancePaymentPct: number
): number {
  const annual = Math.max(0, annualInterestRatePct);
  const weeks = Math.max(0, projectCycleWeeks);
  const advance = clamp(advancePaymentPct, 0, 100);
  return (annual * weeks / 52) * (1 - advance / 100);
}

/**
 * Ghana 2026 VAT + levies. Each is computed against the same subtotal,
 * with no cascading. Defaults (15 + 2.5 + 2.5) sum to 20%.
 *   nhil    = base × NHIL / 100
 *   getfund = base × GETFund / 100
 *   vat     = base × VATstd / 100
 *   total   = nhil + getfund + vat
 */
export function computeVatBreakdown(base: number, rates: VatRates): VatBreakdown {
  const nhilAmount = round2(base * rates.nhilPct / 100);
  const getfundAmount = round2(base * rates.getfundPct / 100);
  const vatStandardAmount = round2(base * rates.standardPct / 100);
  const vatAmount = round2(nhilAmount + getfundAmount + vatStandardAmount);
  return {
    baseAmount: round2(base),
    rates,
    nhilAmount,
    getfundAmount,
    vatStandardAmount,
    vatAmount,
    effectivePct: base > 0 ? round3(vatAmount / base * 100) : 0,
  };
}

export function ceilToIncrement(value: number, increment: number): number {
  if (!Number.isFinite(value)) return value;
  if (!Number.isFinite(increment) || increment <= 0) return value;
  // Multiply through to avoid floating-point fuzz on round-trip
  const scale = 1 / increment;
  return Math.ceil(value * scale) / scale;
}

export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  fxRate: number | null
): number {
  if (fromCurrency === toCurrency) return amount;
  if (fxRate == null || fxRate <= 0) {
    throw new Error(
      `Missing FX rate for ${fromCurrency} → ${toCurrency}. Set Quote.fxRate.`
    );
  }
  // Convention: fxRate is `toCurrency per 1 fromCurrency`.
  return amount * fxRate;
}

function clamp(n: number, min: number, max: number): number {
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
}

function safePct(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, n);
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function round3(n: number): number {
  return Math.round(n * 1000) / 1000;
}

function round4(n: number): number {
  return Math.round(n * 10000) / 10000;
}
