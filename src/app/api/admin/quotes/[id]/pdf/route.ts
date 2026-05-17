import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { prisma } from "@/lib/prisma";
import { BillingDocument } from "@/lib/pdf/BillingDocument";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const [quote, settings] = await Promise.all([
    prisma.quote.findUnique({
      where: { id },
      include: {
        customer: true,
        items: { orderBy: { sortOrder: "asc" } },
      },
    }),
    prisma.companySettings.upsert({
      where: { id: "singleton" },
      create: {},
      update: {},
    }),
  ]);

  if (!quote) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const buffer = await renderToBuffer(
    BillingDocument({
      kind: "QUOTE",
      number: quote.number,
      status: quote.status,
      issueDate: quote.createdAt,
      validUntil: quote.validUntil,
      currency: quote.currency,
      subtotal: quote.subtotal.toNumber(),
      taxRate: quote.taxRate.toNumber(),
      taxAmount: quote.taxAmount.toNumber(),
      discount: quote.discount.toNumber(),
      total: quote.total.toNumber(),
      scopeOfWork: quote.scopeOfWork,
      notes: quote.notes,
      customer: {
        name: quote.customer.name,
        company: quote.customer.company,
        email: quote.customer.email,
        phone: quote.customer.phone,
      },
      company: settings,
      items: quote.items.map((i) => ({
        description: i.description,
        category: i.category,
        quantity: i.quantity.toNumber(),
        unitPrice: i.unitPrice.toNumber(),
        recurring: i.recurring,
      })),
    })
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${quote.number}.pdf"`,
    },
  });
}
