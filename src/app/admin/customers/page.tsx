import { prisma } from "@/lib/prisma";
import { decimalToNumber } from "@/lib/serialize";
import PageHeader from "../_components/PageHeader";
import CustomersClient from "./CustomersClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Customers" };

export default async function CustomersPage() {
  const rows = await prisma.customer.findMany({
    where: { mergedIntoCustomerId: null },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { contacts: true, quotes: true, invoices: true } },
    },
  });
  const customers = decimalToNumber(rows);

  return (
    <>
      <PageHeader
        eyebrow="CRM"
        title="Customers"
        description="Companies and individuals you serve. Each can hold multiple contacts and a full billing address."
      />
      <CustomersClient customers={customers} />
    </>
  );
}
