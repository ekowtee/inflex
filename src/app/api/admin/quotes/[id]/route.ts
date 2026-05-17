import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { quoteSchema } from "@/lib/validators";
import { calculateTotals, toDecimal } from "@/lib/billing";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const quote = await prisma.quote.findUnique({
    where: { id },
    include: {
      customer: true,
      items: { orderBy: { sortOrder: "asc" } },
      invoice: { select: { id: true, number: true } },
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
  const { id } = await params;
  const existing = await prisma.quote.findUnique({ where: { id } });
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
  const data = parsed.data;
  const totals = calculateTotals({
    items: data.items,
    taxRate: data.taxRate,
    discount: data.discount,
  });

  const transitionedToSent =
    existing.status !== "SENT" && data.status === "SENT" && !existing.sentAt;
  const transitionedToAccepted =
    existing.status !== "ACCEPTED" && data.status === "ACCEPTED";
  const transitionedToDeclined =
    existing.status !== "DECLINED" && data.status === "DECLINED";

  const updated = await prisma.$transaction(async (tx) => {
    await tx.lineItem.deleteMany({ where: { quoteId: id } });
    return tx.quote.update({
      where: { id },
      data: {
        customerId: data.customerId,
        status: data.status,
        scopeOfWork: data.scopeOfWork || null,
        notes: data.notes || null,
        taxRate: toDecimal(data.taxRate),
        discount: toDecimal(data.discount),
        subtotal: toDecimal(totals.subtotal),
        taxAmount: toDecimal(totals.taxAmount),
        total: toDecimal(totals.total),
        currency: data.currency,
        validUntil: data.validUntil ? new Date(data.validUntil) : null,
        ...(transitionedToSent && { sentAt: new Date() }),
        ...(transitionedToAccepted && { acceptedAt: new Date() }),
        ...(transitionedToDeclined && { declinedAt: new Date() }),
        items: {
          create: data.items.map((item, idx) => ({
            description: item.description,
            category: item.category,
            quantity: toDecimal(item.quantity),
            unitPrice: toDecimal(item.unitPrice),
            recurring: item.recurring,
            sortOrder: idx,
          })),
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
