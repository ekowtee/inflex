/**
 * Server-side helpers that compose Prisma data with the pure pricing pipeline.
 * Called from the quote API routes.
 */
import { prisma } from "./prisma";
import { toDecimal } from "./billing";
import {
  priceLine,
  calculateQuoteTotals,
  type PriceLineContext,
  type PriceLineInput,
  type LineKind,
} from "./pricing";

export interface QuoteInputLine {
  description: string;
  kind: LineKind;
  category: string;
  partNumber?: string | null;
  specs?: string | null;
  quantity: number;
  landedCost: number;
  landedCostCurrency: string;
  markupTierId?: string | null;
  markupPct: number;
  surchargePct: number;
  discountPct: number;
  recurring: string;
  sortOrder: number;
}

export interface QuoteInput {
  currency: string;
  fxRate: number | null;
  annualInterestRatePct: number;
  projectCycleWeeks: number;
  advancePaymentPct: number;
  whtCategoryId?: string | null;
  whtCustomPct?: number | null;
  vatApplied: boolean;
  nonVatTaxApplied: boolean;
  items: QuoteInputLine[];
}

export interface PricedQuote {
  items: Array<QuoteInputLine & ReturnType<typeof priceLine>>;
  subtotal: number;
  vatBreakdown: ReturnType<typeof calculateQuoteTotals>["vatBreakdown"];
  vatAmount: number;
  goodsSubtotal: number;
  servicesSubtotal: number;
  nonVatTaxAmount: number;
  nonVatTaxPct: number; // single representative pct stored on Quote (goods, since most quotes are goods-heavy)
  total: number;
  totalGp: number;
  totalGpMarginPct: number;
  whtPct: number;
}

/**
 * Resolves all settings + WHT + tier carriesFinanceCharge flags, then runs
 * every line through the pure pricing pipeline and aggregates totals.
 */
export async function priceQuote(input: QuoteInput): Promise<PricedQuote> {
  const settings = await prisma.companySettings.upsert({
    where: { id: "singleton" },
    create: {},
    update: {},
  });

  // Resolve WHT pct (custom override > category rate > 0).
  let whtPct = 0;
  if (input.whtCustomPct != null) {
    whtPct = Number(input.whtCustomPct);
  } else if (input.whtCategoryId) {
    const cat = await prisma.whtCategory.findUnique({
      where: { id: input.whtCategoryId },
    });
    whtPct = cat ? Number(cat.rate) : 0;
  }

  // Resolve carriesFinanceCharge per markupTier (default true if no tier).
  const tierIds = Array.from(
    new Set(
      input.items
        .map((i) => i.markupTierId)
        .filter((id): id is string => Boolean(id))
    )
  );
  const tiers = tierIds.length
    ? await prisma.markupTier.findMany({ where: { id: { in: tierIds } } })
    : [];
  const tierMap = new Map(tiers.map((t) => [t.id, t]));

  const ctx: PriceLineContext = {
    quoteCurrency: input.currency,
    fxRate: input.fxRate ?? null,
    annualInterestRatePct: input.annualInterestRatePct,
    projectCycleWeeks: input.projectCycleWeeks,
    advancePaymentPct: input.advancePaymentPct,
    whtPct,
    rounding: {
      threshold: Number(settings.roundingThreshold),
      incrementBelow: Number(settings.roundingIncrementBelow),
      incrementAbove: Number(settings.roundingIncrementAbove),
    },
  };

  const pricedItems = input.items.map((item) => {
    const tier = item.markupTierId ? tierMap.get(item.markupTierId) : undefined;
    // PRODUCT lines always carry finance charge; other kinds follow tier setting
    // (default true if no tier). FINANCE_CHARGE lines themselves never recurse.
    const carriesFinanceCharge =
      item.kind === "FINANCE_CHARGE"
        ? false
        : tier
        ? tier.carriesFinanceCharge
        : item.kind === "PRODUCT";

    const lineInput: PriceLineInput = {
      kind: item.kind,
      quantity: item.quantity,
      landedCost: item.landedCost,
      landedCostCurrency: item.landedCostCurrency || input.currency,
      markupPct: item.markupPct,
      surchargePct: item.surchargePct,
      discountPct: item.discountPct,
      carriesFinanceCharge,
    };
    const priced = priceLine(lineInput, ctx);
    return { ...item, ...priced };
  });

  const totals = calculateQuoteTotals({
    lines: pricedItems.map((i) => ({
      kind: i.kind,
      finalLineTotalExclTax: i.finalLineTotalExclTax,
      lineGpAmount: i.lineGpAmount,
    })),
    vatApplied: input.vatApplied,
    vatRates: {
      standardPct: Number(settings.vatStandardPct),
      nhilPct: Number(settings.nhilPct),
      getfundPct: Number(settings.getfundPct),
      covidLevyPct: Number(settings.covidLevyPct),
    },
    nonVatTaxApplied: input.nonVatTaxApplied,
    nonVatTaxOnGoodsPct: Number(settings.nonVatTaxOnGoodsPct),
    nonVatTaxOnServicesPct: Number(settings.nonVatTaxOnServicesPct),
  });

  return {
    items: pricedItems,
    subtotal: totals.subtotal,
    vatBreakdown: totals.vatBreakdown,
    vatAmount: totals.vatAmount,
    goodsSubtotal: totals.goodsSubtotal,
    servicesSubtotal: totals.servicesSubtotal,
    nonVatTaxAmount: totals.nonVatTaxAmount,
    nonVatTaxPct: Number(settings.nonVatTaxOnGoodsPct),
    total: totals.total,
    totalGp: totals.totalGp,
    totalGpMarginPct: totals.totalGpMarginPct,
    whtPct,
  };
}

/**
 * Maps a PricedQuote into a Prisma `quote.create`/`update` `data` payload.
 * Caller adds the relation FKs (customerId etc.) and timestamps.
 */
export function quoteToPrismaData(priced: PricedQuote) {
  return {
    subtotal: toDecimal(priced.subtotal),
    total: toDecimal(priced.total),
    totalGp: toDecimal(priced.totalGp),
    totalGpMarginPct: toDecimal(priced.totalGpMarginPct),
    taxRate: toDecimal(priced.vatBreakdown?.effectivePct ?? 0),
    taxAmount: toDecimal(priced.vatAmount),
    vatBreakdown: priced.vatBreakdown
      ? (priced.vatBreakdown as unknown as object)
      : undefined,
    nonVatTaxAmount:
      priced.nonVatTaxAmount > 0 ? toDecimal(priced.nonVatTaxAmount) : null,
    nonVatTaxPct:
      priced.nonVatTaxAmount > 0 ? toDecimal(priced.nonVatTaxPct) : null,
  };
}

export function lineToPrismaData(item: PricedQuote["items"][number]) {
  return {
    description: item.description,
    kind: item.kind,
    category: item.category as
      | "CONSULTING"
      | "MANAGED_SERVICES"
      | "HARDWARE"
      | "SOFTWARE_LICENSING"
      | "TRAINING"
      | "OTHER",
    partNumber: item.partNumber || null,
    specs: item.specs || null,
    quantity: toDecimal(item.quantity),
    landedCost: toDecimal(item.landedCost),
    landedCostCurrency: item.landedCostCurrency || "GHS",
    markupTierId: item.markupTierId || null,
    markupPct: toDecimal(item.markupPct),
    surchargePct: toDecimal(item.surchargePct),
    discountPct: toDecimal(item.discountPct),
    financeChargePct: toDecimal(item.financeChargePct),
    whtGrossUpAmount: toDecimal(item.unitWhtGrossUp),
    finalUnitPriceExclTax: toDecimal(item.finalUnitPriceExclTax),
    finalLineTotalExclTax: toDecimal(item.finalLineTotalExclTax),
    costLineTotal: toDecimal(item.costLineTotal),
    lineGpAmount: toDecimal(item.lineGpAmount),
    lineGpMarginPct: toDecimal(item.lineGpMarginPct),
    // back-compat: keep unitPrice in sync as a derived alias
    unitPrice: toDecimal(item.finalUnitPriceExclTax),
    recurring: item.recurring as "NONE" | "MONTHLY" | "QUARTERLY" | "ANNUALLY",
    sortOrder: item.sortOrder,
  };
}
