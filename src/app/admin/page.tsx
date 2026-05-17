import Link from "next/link";
import { Users, FileText, Receipt, Wallet, TrendingUp, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { decimalToNumber, formatDate, formatMoney } from "@/lib/serialize";
import PageHeader from "./_components/PageHeader";
import StatusBadge from "./_components/StatusBadge";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard" };

export default async function AdminDashboard() {
  const [
    customerCount,
    quoteAggregate,
    invoiceAggregate,
    paymentAggregate,
    overdueCount,
    recentQuotesRows,
    recentInvoicesRows,
    settings,
  ] = await Promise.all([
    prisma.customer.count(),
    prisma.quote.aggregate({
      _count: true,
      _sum: { total: true },
      where: { status: { in: ["DRAFT", "SENT"] } },
    }),
    prisma.invoice.aggregate({
      _count: true,
      _sum: { total: true, amountPaid: true },
      where: { status: { notIn: ["CANCELLED"] } },
    }),
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: {
        status: "COMPLETED",
        paidAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
    }),
    prisma.invoice.count({
      where: {
        status: { in: ["SENT", "PARTIALLY_PAID", "OVERDUE"] },
        dueDate: { lt: new Date() },
      },
    }),
    prisma.quote.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { customer: { select: { name: true } } },
    }),
    prisma.invoice.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { customer: { select: { name: true } } },
    }),
    prisma.companySettings.findUnique({ where: { id: "singleton" } }),
  ]);

  const currency = settings?.currency ?? "GHS";
  const pipeline = decimalToNumber(quoteAggregate)._sum.total ?? 0;
  const invoiced = decimalToNumber(invoiceAggregate)._sum.total ?? 0;
  const paidThisMonth = decimalToNumber(paymentAggregate)._sum.amount ?? 0;
  const totalPaid = decimalToNumber(invoiceAggregate)._sum.amountPaid ?? 0;
  const outstanding = invoiced - totalPaid;

  const recentQuotes = decimalToNumber(recentQuotesRows);
  const recentInvoices = decimalToNumber(recentInvoicesRows);

  return (
    <>
      <PageHeader
        eyebrow="Overview"
        title="Dashboard"
        description="A snapshot of your pipeline, billing, and recent activity."
      />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <MetricCard
          label="Customers"
          value={String(customerCount)}
          icon={Users}
          href="/admin/customers"
        />
        <MetricCard
          label="Open pipeline"
          value={formatMoney(Number(pipeline), currency)}
          icon={FileText}
          href="/admin/quotes"
        />
        <MetricCard
          label="Outstanding"
          value={formatMoney(Number(outstanding), currency)}
          icon={Receipt}
          href="/admin/invoices"
        />
        <MetricCard
          label="Paid (30d)"
          value={formatMoney(Number(paidThisMonth), currency)}
          icon={Wallet}
          href="/admin/payments"
        />
        <MetricCard
          label="Overdue"
          value={String(overdueCount)}
          icon={Clock}
          href="/admin/invoices"
          tone={overdueCount > 0 ? "warning" : "default"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section
          title="Recent quotes"
          href="/admin/quotes"
          empty={recentQuotes.length === 0 ? "No quotes yet." : null}
        >
          <ul className="divide-y divide-white/5">
            {recentQuotes.map((q) => (
              <li key={q.id} className="flex items-center justify-between py-3">
                <div className="min-w-0">
                  <Link
                    href={`/admin/quotes/${q.id}`}
                    className="text-sm text-white hover:text-[#BD2E25] font-medium"
                  >
                    {q.number}
                  </Link>
                  <p className="text-xs text-white/50 truncate">{q.customer.name}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-sm text-white/80">
                    {formatMoney(Number(q.total), q.currency)}
                  </span>
                  <StatusBadge status={q.status} />
                </div>
              </li>
            ))}
          </ul>
        </Section>

        <Section
          title="Recent invoices"
          href="/admin/invoices"
          empty={recentInvoices.length === 0 ? "No invoices yet." : null}
        >
          <ul className="divide-y divide-white/5">
            {recentInvoices.map((inv) => (
              <li key={inv.id} className="flex items-center justify-between py-3">
                <div className="min-w-0">
                  <Link
                    href={`/admin/invoices/${inv.id}`}
                    className="text-sm text-white hover:text-[#BD2E25] font-medium"
                  >
                    {inv.number}
                  </Link>
                  <p className="text-xs text-white/50 truncate">
                    {inv.customer.name} · due {formatDate(inv.dueDate)}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-sm text-white/80">
                    {formatMoney(Number(inv.total), inv.currency)}
                  </span>
                  <StatusBadge status={inv.status} />
                </div>
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </>
  );
}

function MetricCard({
  label,
  value,
  icon: Icon,
  href,
  tone = "default",
}: {
  label: string;
  value: string;
  icon: typeof TrendingUp;
  href: string;
  tone?: "default" | "warning";
}) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-white/10 bg-white/[0.02] p-5 hover:bg-white/[0.04] transition-colors"
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs uppercase tracking-wide text-white/40">{label}</p>
        <Icon
          className={`w-4 h-4 ${tone === "warning" ? "text-rose-300" : "text-white/30"}`}
        />
      </div>
      <p className="text-2xl font-semibold text-white">{value}</p>
    </Link>
  );
}

function Section({
  title,
  href,
  empty,
  children,
}: {
  title: string;
  href: string;
  empty: string | null;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <Link
          href={href}
          className="text-xs text-white/50 hover:text-white"
        >
          View all →
        </Link>
      </div>
      {empty ? (
        <p className="text-sm text-white/40 py-6 text-center">{empty}</p>
      ) : (
        children
      )}
    </section>
  );
}
