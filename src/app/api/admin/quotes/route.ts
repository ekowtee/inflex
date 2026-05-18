import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guard";
import { quoteSchema } from "@/lib/validators";
import { nextQuoteNumber } from "@/lib/billing";
import {
  priceQuote,
  quoteToPrismaData,
  lineToPrismaData,
  type QuoteInput,
} from "@/lib/quoteBuilder";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const quotes = await prisma.quote.findMany({
    include: {
      customer: { select: { id: true, name: true, company: true } },
      solutionArchitect: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(quotes);
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const body = await req.json();
  const parsed = quoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const d = parsed.data;

  let priced;
  try {
    const input: QuoteInput = {
      currency: d.currency,
      fxRate: d.fxRate ?? null,
      annualInterestRatePct: d.annualInterestRatePct,
      projectCycleWeeks: d.projectCycleWeeks,
      advancePaymentPct: d.advancePaymentPct,
      whtCategoryId: d.whtCategoryId ?? null,
      whtCustomPct: d.whtCustomPct ?? null,
      vatApplied: d.vatApplied,
      nonVatTaxApplied: d.nonVatTaxApplied,
      items: d.items.map((i) => ({ ...i, sortOrder: i.sortOrder ?? 0 })),
    };
    priced = await priceQuote(input);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Pricing failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const number = await nextQuoteNumber();
  const priceData = quoteToPrismaData(priced);

  const created = await prisma.quote.create({
    data: {
      number,
      customerId: d.customerId,
      status: d.status,
      projectTitle: d.projectTitle || null,
      attentionTo: d.attentionTo || null,
      solutionArchitectId: d.solutionArchitectId || null,
      scopeOfWork: d.scopeOfWork || null,
      notes: d.notes || null,
      currency: d.currency,
      validUntil: d.validUntil ? new Date(d.validUntil) : null,
      sentAt: d.status === "SENT" ? new Date() : null,
      fxRate: d.fxRate != null ? d.fxRate : null,
      fxRateSource: d.fxRateSource || null,
      fxRateDate: d.fxRateDate ? new Date(d.fxRateDate) : null,
      annualInterestRatePct: d.annualInterestRatePct,
      projectCycleWeeks: d.projectCycleWeeks,
      advancePaymentPct: d.advancePaymentPct,
      whtCategoryId: d.whtCategoryId || null,
      whtCustomPct: d.whtCustomPct != null ? d.whtCustomPct : null,
      vatApplied: d.vatApplied,
      nonVatTaxApplied: d.nonVatTaxApplied,
      ...priceData,
      items: {
        create: priced.items.map((item, idx) =>
          lineToPrismaData({ ...item, sortOrder: idx })
        ),
      },
    },
    include: { items: true, customer: true },
  });
  return NextResponse.json(created, { status: 201 });
}
