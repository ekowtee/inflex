import { notFound } from "next/navigation";
import Link from "next/link";
import { Mail, Phone, Building2, Tag, ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { decimalToNumber, formatDate, formatMoney } from "@/lib/serialize";
import PageHeader from "../../_components/PageHeader";
import StatusBadge from "../../_components/StatusBadge";
import { ButtonLink } from "../../_components/Button";

export const dynamic = "force-dynamic";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await prisma.customer.findUnique({
    where: { id },
    include: {
      quotes: { orderBy: { createdAt: "desc" } },
      invoices: { orderBy: { createdAt: "desc" }, include: { payments: true } },
    },
  });
  if (!row) notFound();

  const customer = decimalToNumber(row);

  const totalInvoiced = customer.invoices.reduce(
    (sum, inv) => sum + inv.total,
    0
  );
  const totalPaid = customer.invoices.reduce(
    (sum, inv) => sum + inv.amountPaid,
    0
  );
  const outstanding = totalInvoiced - totalPaid;
  const pipeline = customer.quotes
    .filter((q) => q.status === "DRAFT" || q.status === "SENT")
    .reduce((sum, q) => sum + q.total, 0);
  const currency = customer.invoices[0]?.currency ?? customer.quotes[0]?.currency ?? "GHS";

  return (
    <>
      <Link
        href="/admin/customers"
        className="inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-white mb-4"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to customers
      </Link>

      <PageHeader
        eyebrow="Customer"
        title={customer.name}
        description={customer.company ?? undefined}
        actions={
          <>
            <ButtonLink
              href={`/admin/quotes?customerId=${customer.id}&new=1`}
              variant="secondary"
            >
              New quote
            </ButtonLink>
            <ButtonLink
              href={`/admin/invoices?customerId=${customer.id}&new=1`}
            >
              New invoice
            </ButtonLink>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1 rounded-xl border border-white/10 bg-white/[0.02] p-5 space-y-4">
          <div className="flex items-center gap-3">
            <StatusBadge status={customer.leadStatus} />
            <span className="text-xs text-white/40">Source: {customer.leadSource}</span>
          </div>
          {customer.email && (
            <div className="flex items-center gap-2 text-sm text-white/80">
              <Mail className="w-4 h-4 text-white/40" />
              <a href={`mailto:${customer.email}`} className="hover:text-white">
                {customer.email}
              </a>
            </div>
          )}
          {customer.phone && (
            <div className="flex items-center gap-2 text-sm text-white/80">
              <Phone className="w-4 h-4 text-white/40" />
              <a href={`tel:${customer.phone}`} className="hover:text-white">
                {customer.phone}
              </a>
            </div>
          )}
          {customer.company && (
            <div className="flex items-center gap-2 text-sm text-white/80">
              <Building2 className="w-4 h-4 text-white/40" />
              {customer.company}
            </div>
          )}
          {customer.tags.length > 0 && (
            <div className="flex items-start gap-2 flex-wrap">
              <Tag className="w-4 h-4 text-white/40 mt-0.5" />
              {customer.tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/10 text-xs text-white/80"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
          {customer.notes && (
            <div className="pt-4 border-t border-white/10">
              <p className="text-xs uppercase tracking-wide text-white/40 mb-2">
                Notes
              </p>
              <p className="text-sm text-white/80 whitespace-pre-line">
                {customer.notes}
              </p>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard label="Pipeline" value={formatMoney(pipeline, currency)} />
          <MetricCard label="Outstanding" value={formatMoney(outstanding, currency)} />
          <MetricCard label="Total paid" value={formatMoney(totalPaid, currency)} />
        </div>
      </div>

      <Section title="Quotes" emptyText="No quotes yet.">
        {customer.quotes.length > 0 && (
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-white/60 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Number</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-right px-4 py-3 font-medium">Total</th>
                <th className="text-left px-4 py-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {customer.quotes.map((q) => (
                <tr key={q.id} className="hover:bg-white/[0.03]">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/quotes/${q.id}`}
                      className="font-medium text-white hover:text-[#BD2E25]"
                    >
                      {q.number}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={q.status} />
                  </td>
                  <td className="px-4 py-3 text-right text-white/80">
                    {formatMoney(q.total, q.currency)}
                  </td>
                  <td className="px-4 py-3 text-white/60 text-xs">
                    {formatDate(q.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Section>

      <Section title="Invoices" emptyText="No invoices yet.">
        {customer.invoices.length > 0 && (
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-white/60 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Number</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-right px-4 py-3 font-medium">Total</th>
                <th className="text-right px-4 py-3 font-medium">Paid</th>
                <th className="text-left px-4 py-3 font-medium">Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {customer.invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-white/[0.03]">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/invoices/${inv.id}`}
                      className="font-medium text-white hover:text-[#BD2E25]"
                    >
                      {inv.number}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={inv.status} />
                  </td>
                  <td className="px-4 py-3 text-right text-white/80">
                    {formatMoney(inv.total, inv.currency)}
                  </td>
                  <td className="px-4 py-3 text-right text-white/60">
                    {formatMoney(inv.amountPaid, inv.currency)}
                  </td>
                  <td className="px-4 py-3 text-white/60 text-xs">
                    {formatDate(inv.dueDate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Section>
    </>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
      <p className="text-xs uppercase tracking-wide text-white/40 mb-2">{label}</p>
      <p className="text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

function Section({
  title,
  emptyText,
  children,
}: {
  title: string;
  emptyText: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8">
      <h2 className="text-sm font-semibold text-white mb-3">{title}</h2>
      <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
        {children || (
          <p className="text-sm text-white/40 px-4 py-6 text-center">{emptyText}</p>
        )}
      </div>
    </section>
  );
}
