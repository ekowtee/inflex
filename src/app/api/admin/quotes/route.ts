import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { quoteSchema } from "@/lib/validators";
import { calculateTotals, nextQuoteNumber, toDecimal } from "@/lib/billing";

export const dynamic = "force-dynamic";

export async function GET() {
  const quotes = await prisma.quote.findMany({
    include: { customer: { select: { id: true, name: true, company: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(quotes);
}

export async function POST(req: NextRequest) {
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
  const number = await nextQuoteNumber();
  const created = await prisma.quote.create({
    data: {
      number,
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
      sentAt: data.status === "SENT" ? new Date() : null,
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
  return NextResponse.json(created, { status: 201 });
}
