import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentSession, requireAdmin } from "@/lib/guard";
import { quoteSchema } from "@/lib/validators";
import {
  priceQuote,
  quoteToPrismaData,
  lineToPrismaData,
  type QuoteInput,
} from "@/lib/quoteBuilder";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  const quote = await prisma.quote.findUnique({
    where: { id },
    include: {
      customer: true,
      solutionArchitect: { select: { id: true, name: true } },
      whtCategory: true,
      items: {
        orderBy: { sortOrder: "asc" },
        include: {
          markupTier: { select: { id: true, name: true } },
          labourEntries: { orderBy: { sortOrder: "asc" } },
          outstationEntries: { orderBy: { sortOrder: "asc" } },
        },
      },
      invoice: { select: { id: true, number: true } },
      revisions: { orderBy: { changedAt: "desc" }, include: { editor: { select: { name: true } } } },
    },
  });
  if (!quote) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(quote);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  const existing = await prisma.quote.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const parsed = quoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const d = parsed.data;

  // Revision rule (spec §11): SENT or ACCEPTED quotes get audit-logged on edit.
  const wasLocked = existing.status === "SENT" || existing.status === "ACCEPTED";
  if (wasLocked && !d.revisionReason?.trim()) {
    return NextResponse.json(
      { error: "A revision reason is required when editing a sent or accepted quote." },
      { status: 400 }
    );
  }

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

  const session = await currentSession();
  const editorId = session?.user?.id;
  const priceData = quoteToPrismaData(priced);

  const transitionedToSent =
    existing.status !== "SENT" && d.status === "SENT" && !existing.sentAt;
  const transitionedToAccepted =
    existing.status !== "ACCEPTED" && d.status === "ACCEPTED";
  const transitionedToDeclined =
    existing.status !== "DECLINED" && d.status === "DECLINED";

  const updated = await prisma.$transaction(async (tx) => {
    // Snapshot the previous state into QuoteRevision *before* writing changes.
    if (wasLocked && editorId && !editorId.startsWith("env:")) {
      const exists = await tx.user.findUnique({ where: { id: editorId } });
      if (exists) {
        await tx.quoteRevision.create({
          data: {
            quoteId: id,
            revision: existing.revision,
            editorId,
            reason: d.revisionReason || null,
            snapshot: JSON.parse(JSON.stringify(existing)),
          },
        });
      }
    }

    await tx.lineItem.deleteMany({ where: { quoteId: id } });
    return tx.quote.update({
      where: { id },
      data: {
        customerId: d.customerId,
        status: d.status,
        projectTitle: d.projectTitle || null,
        attentionTo: d.attentionTo || null,
        solutionArchitectId: d.solutionArchitectId || null,
        scopeOfWork: d.scopeOfWork || null,
        notes: d.notes || null,
        currency: d.currency,
        validUntil: d.validUntil ? new Date(d.validUntil) : null,
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
        ...(transitionedToSent && { sentAt: new Date(), lockedAt: new Date() }),
        ...(transitionedToAccepted && { acceptedAt: new Date() }),
        ...(transitionedToDeclined && { declinedAt: new Date() }),
        ...(wasLocked && { revision: existing.revision + 1 }),
        items: {
          create: priced.items.map((item, idx) =>
            lineToPrismaData({ ...item, sortOrder: idx })
          ),
        },
      },
      include: { items: true, customer: true },
    });
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  const quote = await prisma.quote.findUnique({
    where: { id },
    include: { invoice: true },
  });
  if (!quote) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (quote.invoice) {
    return NextResponse.json(
      { error: "Cannot delete a quote that has been converted to an invoice." },
      { status: 409 }
    );
  }
  await prisma.quote.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
