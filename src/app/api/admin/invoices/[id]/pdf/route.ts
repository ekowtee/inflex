import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guard";
import { BillingDocument } from "@/lib/pdf/BillingDocument";
import { buildBillingCustomer } from "@/lib/pdf/billingCustomer";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  const [invoice, settings] = await Promise.all([
    prisma.invoice.findUnique({
      where: { id },
      include: {
        customer: true,
        contact: true,
        items: { orderBy: { sortOrder: "asc" } },
      },
    }),
    prisma.companySettings.upsert({
      where: { id: "singleton" },
      create: {},
      update: {},
    }),
  ]);

  if (!invoice) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const buffer = await renderToBuffer(
    BillingDocument({
      mode: "customer",
      kind: "INVOICE",
      number: invoice.number,
      status: invoice.status,
      issueDate: invoice.issueDate,
      dueDate: invoice.dueDate,
      currency: invoice.currency,
      subtotal: invoice.subtotal.toNumber(),
      vatAmount: invoice.taxAmount.toNumber(),
      total: invoice.total.toNumber(),
      amountPaid: invoice.amountPaid.toNumber(),
      notes: invoice.notes,
      customer: buildBillingCustomer(invoice.customer, invoice.contact),
      company: { ...settings, vatRegistered: settings.vatRegistered },
      items: invoice.items.map((i) => ({
        description: i.description,
        quantity: i.quantity.toNumber(),
        unitPrice: i.finalUnitPriceExclTax.toNumber() || i.unitPrice.toNumber(),
      })),
    })
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${invoice.number}.pdf"`,
    },
  });
}
