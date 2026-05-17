import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { paymentSchema } from "@/lib/validators";
import { toDecimal } from "@/lib/billing";

export const dynamic = "force-dynamic";

export async function GET() {
  const payments = await prisma.payment.findMany({
    include: {
      customer: { select: { id: true, name: true } },
      invoice: { select: { id: true, number: true } },
    },
    orderBy: { paidAt: "desc" },
  });
  return NextResponse.json(payments);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = paymentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const data = parsed.data;
  const invoice = await prisma.invoice.findUnique({
    where: { id: data.invoiceId },
  });
  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  const payment = await prisma.$transaction(async (tx) => {
    const created = await tx.payment.create({
      data: {
        invoiceId: data.invoiceId,
        customerId: invoice.customerId,
        amount: toDecimal(data.amount),
        currency: data.currency,
        method: data.method,
        status: data.status,
        reference: data.reference || null,
        notes: data.notes || null,
        paidAt: data.paidAt ? new Date(data.paidAt) : new Date(),
      },
    });
    if (data.status === "COMPLETED") {
      await recomputeInvoiceTotals(tx, data.invoiceId);
    }
    return created;
  });

  return NextResponse.json(payment, { status: 201 });
}

async function recomputeInvoiceTotals(
  tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0],
  invoiceId: string
) {
  const sum = await tx.payment.aggregate({
    where: { invoiceId, status: "COMPLETED" },
    _sum: { amount: true },
  });
  const paid = sum._sum.amount?.toNumber() ?? 0;
  const invoice = await tx.invoice.findUnique({ where: { id: invoiceId } });
  if (!invoice) return;
  const total = invoice.total.toNumber();
  let status = invoice.status;
  if (paid >= total - 0.001) status = "PAID";
  else if (paid > 0) status = "PARTIALLY_PAID";
  await tx.invoice.update({
    where: { id: invoiceId },
    data: {
      amountPaid: toDecimal(paid),
      status,
      ...(status === "PAID" && !invoice.paidAt && { paidAt: new Date() }),
    },
  });
}
