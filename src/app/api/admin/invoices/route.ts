import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { invoiceSchema } from "@/lib/validators";
import { calculateTotals, nextInvoiceNumber, toDecimal } from "@/lib/billing";

export const dynamic = "force-dynamic";

export async function GET() {
  const invoices = await prisma.invoice.findMany({
    include: {
      customer: { select: { id: true, name: true, company: true } },
      payments: { select: { amount: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(invoices);
}

export async function POST(req: NextRequest) {
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
  const number = await nextInvoiceNumber();
  const created = await prisma.invoice.create({
    data: {
      number,
      customerId: data.customerId,
      quoteId: data.quoteId || null,
      status: data.status,
      notes: data.notes || null,
      taxRate: toDecimal(data.taxRate),
      discount: toDecimal(data.discount),
      subtotal: toDecimal(totals.subtotal),
      taxAmount: toDecimal(totals.taxAmount),
      total: toDecimal(totals.total),
      currency: data.currency,
      issueDate: data.issueDate ? new Date(data.issueDate) : new Date(),
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
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
  });
  return NextResponse.json(created, { status: 201 });
}
