import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guard";
import { nextInvoiceNumber } from "@/lib/billing";

export const dynamic = "force-dynamic";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  const quote = await prisma.quote.findUnique({
    where: { id },
    include: { items: { orderBy: { sortOrder: "asc" } }, invoice: true },
  });
  if (!quote) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (quote.invoice) {
    return NextResponse.json(
      { error: "This quote has already been converted.", invoiceId: quote.invoice.id },
      { status: 409 }
    );
  }
  if (quote.status !== "ACCEPTED") {
    return NextResponse.json(
      { error: "Only accepted quotes can be converted to invoices." },
      { status: 400 }
    );
  }

  const number = await nextInvoiceNumber();
  const invoice = await prisma.invoice.create({
    data: {
      number,
      customerId: quote.customerId,
      quoteId: quote.id,
      status: "DRAFT",
      notes: quote.notes,
      subtotal: quote.subtotal,
      taxRate: quote.taxRate,
      taxAmount: quote.taxAmount,
      discount: quote.discount,
      total: quote.total,
      currency: quote.currency,
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      items: {
        create: quote.items.map((item) => ({
          description: item.description,
          category: item.category,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          recurring: item.recurring,
          sortOrder: item.sortOrder,
        })),
      },
    },
  });

  return NextResponse.json(invoice, { status: 201 });
}
