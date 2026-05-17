import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { decimalToNumber, formatDate, formatMoney } from "@/lib/serialize";
import PageHeader from "../../_components/PageHeader";
import StatusBadge from "../../_components/StatusBadge";
import { LINE_ITEM_CATEGORIES, RECURRING_INTERVALS } from "@/lib/billing";
import QuoteDetailClient from "./QuoteDetailClient";

export const dynamic = "force-dynamic";

export default async function QuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await prisma.quote.findUnique({
    where: { id },
    include: {
      customer: true,
      items: { orderBy: { sortOrder: "asc" } },
      invoice: { select: { id: true, number: true } },
    },
  });
  if (!row) notFound();

  const quote = decimalToNumber(row);

  const [customersRows, settings] = await Promise.all([
    prisma.customer.findMany({
      select: { id: true, name: true, company: true },
      orderBy: { name: "asc" },
    }),
    prisma.companySettings.findUnique({ where: { id: "singleton" } }),
  ]);
  const customers = decimalToNumber(customersRows);
  const defaultCurrency = settings?.currency ?? "GHS";

  const categoryLabel: Record<string, string> = Object.fromEntries(
    LINE_ITEM_CATEGORIES.map((c) => [c.value, c.label])
  );
  const recurringLabel: Record<string, string> = Object.fromEntries(
    RECURRING_INTERVALS.map((r) => [r.value, r.label])
  );

  return (
    <>
      <Link
        href="/admin/quotes"
        className="inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-white mb-4"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to quotes
      </Link>

      <PageHeader
        eyebrow={`Quote · ${formatDate(quote.createdAt)}`}
        title={quote.number}
        description={`For ${quote.customer.name}${quote.customer.company ? ` · ${quote.customer.company}` : ""}`}
      />

      <div className="flex items-center gap-3 mb-6">
        <StatusBadge status={quote.status} />
        {quote.invoice && (
          <Link
            href={`/admin/invoices/${quote.invoice.id}`}
            className="text-xs text-white/60 hover:text-white"
          >
            Converted to invoice {quote.invoice.number} →
          </Link>
        )}
      </div>

      <QuoteDetailClient
        quote={{
          id: quote.id,
          customerId: quote.customerId,
          status: quote.status,
          scopeOfWork: quote.scopeOfWork,
          notes: quote.notes,
          taxRate: quote.taxRate,
          discount: quote.discount,
          currency: quote.currency,
          validUntil: quote.validUntil as unknown as string | null,
          items: quote.items.map((i) => ({
            description: i.description,
            category: i.category,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
            recurring: i.recurring,
            sortOrder: i.sortOrder,
          })),
          hasInvoice: Boolean(quote.invoice),
          invoiceId: quote.invoice?.id,
        }}
        customers={customers}
        defaultCurrency={defaultCurrency}
      />

      {quote.scopeOfWork && (
        <section className="mb-8 rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <h3 className="text-xs uppercase tracking-wide text-white/40 mb-2">
            Scope of work
          </h3>
          <p className="text-sm text-white/80 whitespace-pre-line">
            {quote.scopeOfWork}
          </p>
        </section>
      )}

      <section className="mb-6 rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-white/60 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Description</th>
              <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Category</th>
              <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Billing</th>
              <th className="text-right px-4 py-3 font-medium">Qty</th>
              <th className="text-right px-4 py-3 font-medium">Unit price</th>
              <th className="text-right px-4 py-3 font-medium">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {quote.items.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-3 text-white">{item.description}</td>
                <td className="px-4 py-3 text-white/60 text-xs hidden md:table-cell">
                  {categoryLabel[item.category] ?? item.category}
                </td>
                <td className="px-4 py-3 text-white/60 text-xs hidden md:table-cell">
                  {recurringLabel[item.recurring] ?? item.recurring}
                </td>
                <td className="px-4 py-3 text-right text-white/80">{item.quantity}</td>
                <td className="px-4 py-3 text-right text-white/80">
                  {formatMoney(item.unitPrice, quote.currency)}
                </td>
                <td className="px-4 py-3 text-right text-white">
                  {formatMoney(item.quantity * item.unitPrice, quote.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div className="flex justify-end mb-8">
        <div className="w-full max-w-sm rounded-xl border border-white/10 bg-white/[0.04] p-5 space-y-2 text-sm">
          <Row label="Subtotal" value={formatMoney(quote.subtotal, quote.currency)} />
          {quote.discount > 0 && (
            <Row label="Discount" value={`− ${formatMoney(quote.discount, quote.currency)}`} />
          )}
          <Row
            label={`Tax (${Number(quote.taxRate).toFixed(2)}%)`}
            value={formatMoney(quote.taxAmount, quote.currency)}
          />
          <div className="pt-2 border-t border-white/10">
            <Row
              label="Total"
              value={formatMoney(quote.total, quote.currency)}
              bold
            />
          </div>
        </div>
      </div>

      {quote.notes && (
        <section className="mb-8 rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <h3 className="text-xs uppercase tracking-wide text-white/40 mb-2">
            Internal notes
          </h3>
          <p className="text-sm text-white/80 whitespace-pre-line">{quote.notes}</p>
        </section>
      )}
    </>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className={bold ? "text-white font-semibold" : "text-white/60"}>{label}</span>
      <span className={bold ? "text-white font-semibold" : "text-white/80"}>{value}</span>
    </div>
  );
}
