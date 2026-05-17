import { prisma } from "@/lib/prisma";
import { decimalToNumber } from "@/lib/serialize";
import PageHeader from "../_components/PageHeader";
import InvoicesClient from "./InvoicesClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Invoices" };

export default async function InvoicesPage() {
  const [invoicesRows, customersRows, settings] = await Promise.all([
    prisma.invoice.findMany({
      include: {
        customer: { select: { id: true, name: true, company: true } },
        payments: { select: { amount: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.customer.findMany({
      select: { id: true, name: true, company: true },
      orderBy: { name: "asc" },
    }),
    prisma.companySettings.findUnique({ where: { id: "singleton" } }),
  ]);

  const invoices = decimalToNumber(invoicesRows);
  const customers = decimalToNumber(customersRows);
  const defaultCurrency = settings?.currency ?? "GHS";

  return (
    <>
      <PageHeader
        eyebrow="Billing"
        title="Invoices"
        description="Issue invoices, track payment status, and follow up on what's outstanding."
      />
      <InvoicesClient
        invoices={invoices}
        customers={customers}
        defaultCurrency={defaultCurrency}
      />
    </>
  );
}
