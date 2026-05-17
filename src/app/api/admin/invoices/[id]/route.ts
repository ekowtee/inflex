import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { invoiceSchema } from "@/lib/validators";
import { calculateTotals, toDecimal } from "@/lib/billing";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      customer: true,
      items: { orderBy: { sortOrder: "asc" } },
      payments: { orderBy: { paidAt: "desc" } },
      quote: { select: { id: true, number: true } },
    },
  });
  if (!invoice) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(invoice);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const existing = await prisma.invoice.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const body = await req.json();
  const parsed = invoiceSchema.safeParse(body);
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
  const transitionedToPaid =
    existing.status !== "PAID" && data.status === "PAID";

  const updated = await prisma.$transaction(async (tx) => {
    await tx.lineItem.deleteMany({ where: { invoiceId: id } });
    return tx.invoice.update({
      where: { id },
      data: {
        customerId: data.customerId,
        status: data.status,
        notes: data.notes || null,
        taxRate: toDecimal(data.taxRate),
        discount: toDecimal(data.discount),
        subtotal: toDecimal(totals.subtotal),
        taxAmount: toDecimal(totals.taxAmount),
        total: toDecimal(totals.total),
        currency: data.currency,
        issueDate: data.issueDate ? new Date(data.issueDate) : existing.issueDate,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        ...(transitionedToSent && { sentAt: new Date() }),
        ...(transitionedToPaid && { paidAt: new Date() }),
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
    });
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const inv = await prisma.invoice.findUnique({
    where: { id },
    select: { _count: { select: { payments: true } } },
  });
  if (!inv) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (inv._count.payments > 0) {
    return NextResponse.json(
      { error: "Cannot delete an invoice with payments recorded against it." },
      { status: 409 }
    );
  }
  await prisma.invoice.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
