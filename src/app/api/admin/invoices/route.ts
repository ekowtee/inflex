import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guard";
import { invoiceSchema } from "@/lib/validators";
import { nextInvoiceNumber, toDecimal } from "@/lib/billing";

export const dynamic = "force-dynamic";

function simpleInvoiceTotals(items: { quantity: number; unitPrice: number }[], taxRate: number, discount: number) {
  const subtotal = items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  const discounted = Math.max(0, subtotal - discount);
  const taxAmount = (discounted * taxRate) / 100;
  return {
    subtotal: round2(subtotal),
    taxAmount: round2(taxAmount),
    total: round2(discounted + taxAmount),
  };
}
function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
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
  const denied = await requireAdmin();
  if (denied) return denied;
  const body = await req.json();
  const parsed = invoiceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const data = parsed.data;
  const totals = simpleInvoiceTotals(data.items, data.taxRate, data.discount);
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
          kind: "PRODUCT",
          category: item.category,
          quantity: toDecimal(item.quantity),
          unitPrice: toDecimal(item.unitPrice),
          landedCostCurrency: data.currency,
          finalUnitPriceExclTax: toDecimal(item.unitPrice),
          finalLineTotalExclTax: toDecimal(item.quantity * item.unitPrice),
          recurring: item.recurring,
          sortOrder: idx,
        })),
      },
    },
  });
  return NextResponse.json(created, { status: 201 });
}
