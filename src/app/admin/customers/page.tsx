import { prisma } from "@/lib/prisma";
import { decimalToNumber } from "@/lib/serialize";
import PageHeader from "../_components/PageHeader";
import CustomersClient from "./CustomersClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Customers" };

export default async function CustomersPage() {
  const rows = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
  });
  const customers = decimalToNumber(rows);

  return (
    <>
      <PageHeader
        eyebrow="CRM"
        title="Customers"
        description="Track leads, qualify prospects, and manage every account in one place."
      />
      <CustomersClient customers={customers} />
    </>
  );
}
