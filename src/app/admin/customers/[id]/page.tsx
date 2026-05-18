import { notFound } from "next/navigation";
import Link from "next/link";
import { Mail, Phone, Globe, Tag, ArrowLeft, MapPin, Building2, User } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { decimalToNumber, formatDate, formatMoney } from "@/lib/serialize";
import PageHeader from "../../_components/PageHeader";
import StatusBadge from "../../_components/StatusBadge";
import { ButtonLink } from "../../_components/Button";
import CustomerDetailActions from "./CustomerDetailActions";
import ContactsSection from "./ContactsSection";

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
      contacts: { orderBy: [{ isPrimary: "desc" }, { name: "asc" }] },
      quotes: { orderBy: { createdAt: "desc" } },
      invoices: { orderBy: { createdAt: "desc" }, include: { payments: true } },
      convertedLeads: {
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, email: true, subject: true, createdAt: true },
      },
      mergedIntoCustomer: { select: { id: true, name: true } },
      mergeChildren: { select: { id: true, name: true, createdAt: true } },
    },
  });
  if (!row) notFound();
  const customer = decimalToNumber(row);

  // Candidate targets for the merge picker (everything else still active).
  const mergeCandidates = await prisma.customer.findMany({
    where: { id: { not: customer.id }, mergedIntoCustomerId: null },
    select: { id: true, name: true, type: true, status: true },
    orderBy: { name: "asc" },
  });

  const totalInvoiced = customer.invoices.reduce((sum, inv) => sum + inv.total, 0);
  const totalPaid = customer.invoices.reduce((sum, inv) => sum + inv.amountPaid, 0);
  const outstanding = totalInvoiced - totalPaid;
  const pipeline = customer.quotes
    .filter((q) => q.status === "DRAFT" || q.status === "SENT" || q.status === "PENDING_APPROVAL")
    .reduce((sum, q) => sum + q.total, 0);
  const currency = customer.invoices[0]?.currency ?? customer.quotes[0]?.currency ?? "GHS";

  const isMerged = Boolean(customer.mergedIntoCustomerId);
  const isCompany = customer.type === "COMPANY";
  const addressLines = [
    customer.addressLine1,
    customer.addressLine2,
    [customer.city, customer.region, customer.postalCode].filter(Boolean).join(", "),
    customer.country,
  ].filter(Boolean) as string[];

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
        eyebrow={isCompany ? "Company customer" : "Individual customer"}
        title={customer.name}
        description={customer.legalName && customer.legalName !== customer.name ? customer.legalName : undefined}
        actions={
          !isMerged ? (
            <>
              <ButtonLink href={`/admin/quotes?customerId=${customer.id}&new=1`} variant="secondary">
                New quote
              </ButtonLink>
              <ButtonLink href={`/admin/invoices?customerId=${customer.id}&new=1`}>
                New invoice
              </ButtonLink>
            </>
          ) : null
        }
      />

      <div className="flex flex-wrap items-center gap-3 mb-6 text-xs">
        <StatusBadge status={customer.status} />
        <span className="inline-flex items-center gap-1.5 text-white/60">
          {isCompany ? (
            <Building2 className="w-3.5 h-3.5" />
          ) : (
            <User className="w-3.5 h-3.5" />
          )}
          {customer.type}
        </span>
        {customer.industry && (
          <span className="text-white/50">Industry: {customer.industry}</span>
        )}
        {customer.taxId && (
          <span className="text-white/50">TIN: {customer.taxId}</span>
        )}
        {customer.mergedIntoCustomer && (
          <Link
            href={`/admin/customers/${customer.mergedIntoCustomer.id}`}
            className="text-amber-200 hover:text-amber-100"
          >
            Merged into {customer.mergedIntoCustomer.name} →
          </Link>
        )}
      </div>

      {isMerged && (
        <section className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/[0.05] p-4 text-sm text-amber-200/90">
          This customer has been merged into another record. It is kept for audit purposes only.
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1 rounded-xl border border-white/10 bg-white/[0.02] p-5 space-y-4">
          <h3 className="text-xs uppercase tracking-wide text-white/40">Contact & address</h3>
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
          {customer.website && (
            <div className="flex items-center gap-2 text-sm text-white/80">
              <Globe className="w-4 h-4 text-white/40" />
              <a
                href={customer.website.startsWith("http") ? customer.website : `https://${customer.website}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white truncate"
              >
                {customer.website}
              </a>
            </div>
          )}
          {addressLines.length > 0 && (
            <div className="flex items-start gap-2 text-sm text-white/80">
              <MapPin className="w-4 h-4 text-white/40 mt-0.5" />
              <div className="whitespace-pre-line">{addressLines.join("\n")}</div>
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
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard label="Pipeline" value={formatMoney(pipeline, currency)} />
          <MetricCard label="Outstanding" value={formatMoney(outstanding, currency)} />
          <MetricCard label="Total paid" value={formatMoney(totalPaid, currency)} />
        </div>
      </div>

      {!isMerged && isCompany && (
        <ContactsSection customerId={customer.id} contacts={customer.contacts} />
      )}

      {!isMerged && (
        <CustomerDetailActions
          customer={{
            id: customer.id,
            type: customer.type,
            name: customer.name,
            legalName: customer.legalName,
            taxId: customer.taxId,
            industry: customer.industry,
            website: customer.website,
            email: customer.email,
            phone: customer.phone,
            status: customer.status,
            tags: customer.tags,
            notes: customer.notes,
            addressLine1: customer.addressLine1,
            addressLine2: customer.addressLine2,
            city: customer.city,
            region: customer.region,
            postalCode: customer.postalCode,
            country: customer.country,
            quoteCount: customer.quotes.length,
            invoiceCount: customer.invoices.length,
          }}
          mergeCandidates={mergeCandidates}
        />
      )}

      {customer.convertedLeads.length > 0 && (
        <Section title="Origin leads" emptyText="">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-white/60 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Lead</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Email</th>
                <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Subject</th>
                <th className="text-left px-4 py-3 font-medium">Received</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {customer.convertedLeads.map((l) => (
                <tr key={l.id} className="hover:bg-white/[0.03]">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/leads/${l.id}`}
                      className="font-medium text-white hover:text-[#BD2E25]"
                    >
                      {l.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-white/70 text-xs hidden md:table-cell">
                    {l.email ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-white/70 text-xs hidden lg:table-cell">
                    {l.subject ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-white/60 text-xs">
                    {formatDate(l.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      )}

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

      {customer.notes && (
        <section className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <h3 className="text-xs uppercase tracking-wide text-white/40 mb-2">Notes</h3>
          <p className="text-sm text-white/80 whitespace-pre-line">{customer.notes}</p>
        </section>
      )}
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
