import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { decimalToNumber, formatDate, formatMoney } from "@/lib/serialize";
import PageHeader from "../../_components/PageHeader";
import StatusBadge from "../../_components/StatusBadge";
import { LINE_ITEM_CATEGORY_LABELS, RECURRING_LABELS } from "@/lib/billing";
import InvoiceDetailClient from "./InvoiceDetailClient";

export const dynamic = "force-dynamic";

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await prisma.invoice.findUnique({
    where: { id },
    include: {
      customer: true,
      items: { orderBy: { sortOrder: "asc" } },
      payments: { orderBy: { paidAt: "desc" } },
      quote: { select: { id: true, number: true } },
    },
  });
  if (!row) notFound();

  const invoice = decimalToNumber(row);

  const [customersRows, settings] = await Promise.all([
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
    prisma.companySettings.findUnique({ where: { id: "singleton" } }),
  ]);
  const customers = decimalToNumber(customersRows);
  const defaultCurrency = settings?.currency ?? "GHS";

  const outstanding = Math.max(0, invoice.total - invoice.amountPaid);
  const categoryLabel = LINE_ITEM_CATEGORY_LABELS;
  const recurringLabel = RECURRING_LABELS;

  return (
    <>
      <Link
        href="/admin/invoices"
        className="inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-white mb-4"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to invoices
      </Link>

      <PageHeader
        eyebrow={`Invoice · issued ${formatDate(invoice.issueDate)}`}
        title={invoice.number}
        description={`For ${invoice.customer.name}${invoice.customer.legalName && invoice.customer.legalName !== invoice.customer.name ? ` · ${invoice.customer.legalName}` : ""}`}
      />

      <div className="flex items-center gap-3 mb-6">
        <StatusBadge status={invoice.status} />
        {invoice.quote && (
          <Link
            href={`/admin/quotes/${invoice.quote.id}`}
            className="text-xs text-white/60 hover:text-white"
          >
            From quote {invoice.quote.number} →
          </Link>
        )}
        <span className="text-xs text-white/40">
          Due: {formatDate(invoice.dueDate)}
        </span>
      </div>

      <InvoiceDetailClient
        invoice={{
          id: invoice.id,
          customerId: invoice.customerId,
          contactId: invoice.contactId,
          status: invoice.status,
          notes: invoice.notes,
          taxRate: invoice.taxRate,
          discount: invoice.discount,
          currency: invoice.currency,
          issueDate: invoice.issueDate as unknown as string | null,
          dueDate: invoice.dueDate as unknown as string | null,
          items: invoice.items.map((i) => ({
            description: i.description,
            category: i.category,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
            recurring: i.recurring,
            sortOrder: i.sortOrder,
          })),
          hasPayments: invoice.payments.length > 0,
          outstanding,
        }}
        customers={customers}
        defaultCurrency={defaultCurrency}
      />

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
            {invoice.items.map((item) => (
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
                  {formatMoney(item.unitPrice, invoice.currency)}
                </td>
                <td className="px-4 py-3 text-right text-white">
                  {formatMoney(item.quantity * item.unitPrice, invoice.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div className="flex justify-end mb-8">
        <div className="w-full max-w-sm rounded-xl border border-white/10 bg-white/[0.04] p-5 space-y-2 text-sm">
          <Row label="Subtotal" value={formatMoney(invoice.subtotal, invoice.currency)} />
          {invoice.discount > 0 && (
            <Row label="Discount" value={`− ${formatMoney(invoice.discount, invoice.currency)}`} />
          )}
          <Row
            label={`Tax (${Number(invoice.taxRate).toFixed(2)}%)`}
            value={formatMoney(invoice.taxAmount, invoice.currency)}
          />
          <div className="pt-2 border-t border-white/10">
            <Row label="Total" value={formatMoney(invoice.total, invoice.currency)} bold />
          </div>
          <Row
            label="Paid"
            value={formatMoney(invoice.amountPaid, invoice.currency)}
          />
          <Row
            label="Outstanding"
            value={formatMoney(outstanding, invoice.currency)}
            bold
          />
        </div>
      </div>

      {invoice.payments.length > 0 && (
        <section className="mb-8">
          <h3 className="text-sm font-semibold text-white mb-3">Payments</h3>
          <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-white/60 text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Date</th>
                  <th className="text-left px-4 py-3 font-medium">Method</th>
                  <th className="text-left px-4 py-3 font-medium">Reference</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-right px-4 py-3 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {invoice.payments.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-3 text-white/80 text-xs">{formatDate(p.paidAt)}</td>
                    <td className="px-4 py-3 text-white/80 text-xs">{p.method.replace("_", " ")}</td>
                    <td className="px-4 py-3 text-white/60 text-xs">{p.reference ?? "—"}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-4 py-3 text-right text-white">
                      {formatMoney(p.amount, invoice.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {invoice.notes && (
        <section className="mb-8 rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <h3 className="text-xs uppercase tracking-wide text-white/40 mb-2">Notes</h3>
          <p className="text-sm text-white/80 whitespace-pre-line">{invoice.notes}</p>
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
