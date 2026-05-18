import { prisma } from "@/lib/prisma";
import { decimalToNumber } from "@/lib/serialize";
import PageHeader from "../_components/PageHeader";
import LeadsClient from "./LeadsClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Leads" };

export default async function LeadsPage() {
  const rows = await prisma.lead.findMany({
    include: {
      convertedCustomer: { select: { id: true, name: true, type: true } },
    },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });
  const leads = decimalToNumber(rows);
  return (
    <>
      <PageHeader
        eyebrow="Inbound"
        title="Leads"
        description="Inquiries from the website and other sources. Qualify them into customers."
      />
      <LeadsClient leads={leads} />
    </>
  );
}
