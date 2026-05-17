import { prisma } from "@/lib/prisma";
import { decimalToNumber } from "@/lib/serialize";
import PageHeader from "../_components/PageHeader";
import PaymentsClient from "./PaymentsClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Payments" };

export default async function PaymentsPage() {
  const [paymentsRows, invoicesRows] = await Promise.all([
    prisma.payment.findMany({
      include: {
        customer: { select: { id: true, name: true } },
        invoice: { select: { id: true, number: true } },
      },
      orderBy: { paidAt: "desc" },
    }),
    prisma.invoice.findMany({
      where: { status: { notIn: ["PAID", "CANCELLED"] } },
      include: { customer: { select: { name: true } } },
      orderBy: { dueDate: "asc" },
    }),
  ]);

  const payments = decimalToNumber(paymentsRows);
  const invoices = decimalToNumber(invoicesRows)
    .map((i) => ({
      id: i.id,
      number: i.number,
      currency: i.currency,
      customerName: i.customer.name,
      outstanding: Math.max(0, i.total - i.amountPaid),
    }))
    .filter((i) => i.outstanding > 0);

  return (
    <>
      <PageHeader
        eyebrow="Cash flow"
        title="Payments"
        description="Record every payment received against your outstanding invoices."
      />
      <PaymentsClient payments={payments} invoices={invoices} />
    </>
  );
}
