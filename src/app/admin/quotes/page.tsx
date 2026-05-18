import { prisma } from "@/lib/prisma";
import { decimalToNumber } from "@/lib/serialize";
import PageHeader from "../_components/PageHeader";
import QuotesClient from "./QuotesClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Quotes" };

export default async function QuotesPage() {
  const [quotesRows, customersRows] = await Promise.all([
    prisma.quote.findMany({
      include: { customer: { select: { id: true, name: true, legalName: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.customer.findMany({
      where: { mergedIntoCustomerId: null },
      select: {
        id: true,
        name: true,
        legalName: true,
        type: true,
        contacts: {
          select: { id: true, name: true, role: true, isPrimary: true },
          orderBy: [{ isPrimary: "desc" }, { name: "asc" }],
        },
      },
      orderBy: { name: "asc" },
    }),
  ]);
  const quotes = decimalToNumber(quotesRows);
  const customers = decimalToNumber(customersRows);

  return (
    <>
      <PageHeader
        eyebrow="Sales"
        title="Quotes"
        description="Draft, send, and track proposals from first touch to signature."
      />
      <QuotesClient quotes={quotes} customers={customers} />
    </>
  );
}
