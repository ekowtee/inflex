import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireRole } from "@/lib/guard";
import { settingsSchema } from "@/lib/validators";
import { toDecimal } from "@/lib/billing";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const settings = await prisma.companySettings.upsert({
    where: { id: "singleton" },
    create: {},
    update: {},
  });
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  const denied = await requireRole(["DIRECTOR"]);
  if (denied) return denied;
  const body = await req.json();
  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const d = parsed.data;

  // Track VAT-registration flip date.
  const existing = await prisma.companySettings.findUnique({
    where: { id: "singleton" },
  });
  const vatRegisteredSince = d.vatRegistered
    ? existing?.vatRegisteredSince ?? new Date()
    : null;

  const updated = await prisma.companySettings.upsert({
    where: { id: "singleton" },
    create: {
      ...d,
      email: d.email || null,
      vatRegisteredSince,
      vatStandardPct: toDecimal(d.vatStandardPct),
      nhilPct: toDecimal(d.nhilPct),
      getfundPct: toDecimal(d.getfundPct),
      nonVatTaxOnGoodsPct: toDecimal(d.nonVatTaxOnGoodsPct),
      nonVatTaxOnServicesPct: toDecimal(d.nonVatTaxOnServicesPct),
      defaultAnnualInterestRatePct: toDecimal(d.defaultAnnualInterestRatePct),
      defaultAdvancePaymentPct: toDecimal(d.defaultAdvancePaymentPct),
      defaultFxUsdGhsRate:
        d.defaultFxUsdGhsRate != null ? toDecimal(d.defaultFxUsdGhsRate) : null,
      roundingThreshold: toDecimal(d.roundingThreshold),
      roundingIncrementBelow: toDecimal(d.roundingIncrementBelow),
      roundingIncrementAbove: toDecimal(d.roundingIncrementAbove),
    },
    update: {
      ...d,
      email: d.email || null,
      vatRegisteredSince,
      vatStandardPct: toDecimal(d.vatStandardPct),
      nhilPct: toDecimal(d.nhilPct),
      getfundPct: toDecimal(d.getfundPct),
      nonVatTaxOnGoodsPct: toDecimal(d.nonVatTaxOnGoodsPct),
      nonVatTaxOnServicesPct: toDecimal(d.nonVatTaxOnServicesPct),
      defaultAnnualInterestRatePct: toDecimal(d.defaultAnnualInterestRatePct),
      defaultAdvancePaymentPct: toDecimal(d.defaultAdvancePaymentPct),
      defaultFxUsdGhsRate:
        d.defaultFxUsdGhsRate != null ? toDecimal(d.defaultFxUsdGhsRate) : null,
      roundingThreshold: toDecimal(d.roundingThreshold),
      roundingIncrementBelow: toDecimal(d.roundingIncrementBelow),
      roundingIncrementAbove: toDecimal(d.roundingIncrementAbove),
    },
  });
  return NextResponse.json(updated);
}
