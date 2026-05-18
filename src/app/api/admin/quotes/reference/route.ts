import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guard";

export const dynamic = "force-dynamic";

/**
 * Single endpoint that returns everything the quote builder needs to render:
 * markup tiers, WHT categories, candidate solution architects, and the
 * relevant settings defaults. Saves the form from doing 4 round-trips.
 */
export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const [tiers, whtCategories, architects, settings] = await Promise.all([
    prisma.markupTier.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.whtCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.user.findMany({
      where: { isActive: true },
      select: { id: true, name: true, role: true },
      orderBy: { name: "asc" },
    }),
    prisma.companySettings.upsert({
      where: { id: "singleton" },
      create: {},
      update: {},
    }),
  ]);

  return NextResponse.json({
    markupTiers: tiers,
    whtCategories,
    architects,
    settings: {
      currency: settings.currency,
      vatRegistered: settings.vatRegistered,
      nonVatTaxApplied: settings.nonVatTaxApplied,
      nonVatTaxLabel: settings.nonVatTaxLabel,
      defaultAnnualInterestRatePct: settings.defaultAnnualInterestRatePct,
      defaultProjectCycleWeeks: settings.defaultProjectCycleWeeks,
      defaultAdvancePaymentPct: settings.defaultAdvancePaymentPct,
      defaultFxUsdGhsRate: settings.defaultFxUsdGhsRate,
      defaultFxRateSource: settings.defaultFxRateSource,
    },
  });
}
