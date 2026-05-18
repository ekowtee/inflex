import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, Building2, Calendar } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { decimalToNumber, formatDate } from "@/lib/serialize";
import PageHeader from "../../_components/PageHeader";
import StatusBadge from "../../_components/StatusBadge";
import LeadActions from "./LeadActions";

export const dynamic = "force-dynamic";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await prisma.lead.findUnique({
    where: { id },
    include: {
      convertedCustomer: { select: { id: true, name: true, type: true, status: true } },
      convertedContact: { select: { id: true, name: true, role: true } },
      convertedBy: { select: { id: true, name: true } },
      mergedIntoLead: { select: { id: true, name: true, email: true } },
      mergeChildren: { select: { id: true, name: true, email: true, createdAt: true } },
    },
  });
  if (!row) notFound();
  const lead = decimalToNumber(row);

  // Surface email-based duplicate / customer matches.
  const matches = lead.email
    ? await findEmailMatches(lead.id, lead.email)
    : { leads: [], customers: [], contacts: [] };

  // Candidate customers for the "Link to existing customer" picker.
  const customers = await prisma.customer.findMany({
    where: { mergedIntoCustomerId: null },
    select: {
      id: true, name: true, type: true,
      contacts: { select: { id: true, name: true, role: true } },
    },
    orderBy: { name: "asc" },
  });

  // Candidate leads for the "Merge into another lead" picker.
  const otherLeads = await prisma.lead.findMany({
    where: {
      id: { not: lead.id },
      status: { in: ["NEW", "IN_PROGRESS"] },
    },
    select: { id: true, name: true, email: true, createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <>
      <Link
        href="/admin/leads"
        className="inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-white mb-4"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to leads
      </Link>

      <PageHeader
        eyebrow={`Lead · received ${formatDate(lead.createdAt)}`}
        title={lead.name}
        description={lead.subject ?? undefined}
      />

      <div className="flex flex-wrap items-center gap-3 mb-6 text-xs">
        <StatusBadge status={lead.status} />
        <span className="text-white/50">Source: {lead.source}</span>
        {lead.convertedCustomer && (
          <Link
            href={`/admin/customers/${lead.convertedCustomer.id}`}
            className="text-emerald-300 hover:text-emerald-200"
          >
            → {lead.convertedCustomer.name} ({lead.convertedCustomer.type})
            {lead.convertedContact ? ` · ${lead.convertedContact.name}` : ""}
          </Link>
        )}
        {lead.mergedIntoLead && (
          <Link
            href={`/admin/leads/${lead.mergedIntoLead.id}`}
            className="text-amber-200 hover:text-amber-100"
          >
            Merged into {lead.mergedIntoLead.name} →
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1 rounded-xl border border-white/10 bg-white/[0.02] p-5 space-y-4">
          <h3 className="text-xs uppercase tracking-wide text-white/40">Contact info</h3>
          {lead.email && (
            <div className="flex items-center gap-2 text-sm text-white/80">
              <Mail className="w-4 h-4 text-white/40" />
              <a href={`mailto:${lead.email}`} className="hover:text-white">{lead.email}</a>
            </div>
          )}
          {lead.phone && (
            <div className="flex items-center gap-2 text-sm text-white/80">
              <Phone className="w-4 h-4 text-white/40" />
              <a href={`tel:${lead.phone}`} className="hover:text-white">{lead.phone}</a>
            </div>
          )}
          {lead.companyName && (
            <div className="flex items-center gap-2 text-sm text-white/80">
              <Building2 className="w-4 h-4 text-white/40" />
              {lead.companyName}
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-white/60">
            <Calendar className="w-4 h-4 text-white/40" />
            {formatDate(lead.createdAt)}
          </div>
        </div>

        <div className="lg:col-span-2 rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <h3 className="text-xs uppercase tracking-wide text-white/40 mb-2">Message</h3>
          <p className="text-sm text-white/80 whitespace-pre-line">
            {lead.message ?? "(no message)"}
          </p>
        </div>
      </div>

      {(matches.leads.length > 0 || matches.customers.length > 0 || matches.contacts.length > 0) && (
        <section className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/[0.05] p-5">
          <h3 className="text-sm font-semibold text-amber-200 mb-3">
            Possible duplicates (matched on email)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            {matches.leads.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-wide text-amber-200/60 mb-2">Other leads</p>
                <ul className="space-y-1">
                  {matches.leads.map((m) => (
                    <li key={m.id}>
                      <Link href={`/admin/leads/${m.id}`} className="text-white hover:text-amber-200">
                        {m.name}
                      </Link>
                      <span className="text-white/50 text-xs ml-2">
                        {m.status} · {formatDate(m.createdAt)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {matches.customers.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-wide text-amber-200/60 mb-2">Customers</p>
                <ul className="space-y-1">
                  {matches.customers.map((c) => (
                    <li key={c.id}>
                      <Link href={`/admin/customers/${c.id}`} className="text-white hover:text-amber-200">
                        {c.name}
                      </Link>
                      <span className="text-white/50 text-xs ml-2">{c.type} · {c.status}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {matches.contacts.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-wide text-amber-200/60 mb-2">Contacts</p>
                <ul className="space-y-1">
                  {matches.contacts.map((c) => (
                    <li key={c.id}>
                      <span className="text-white">{c.name}</span>
                      <span className="text-white/50 text-xs ml-2">
                        {c.role} ·{" "}
                        <Link
                          href={`/admin/customers/${c.customer.id}`}
                          className="hover:text-amber-200"
                        >
                          {c.customer.name}
                        </Link>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      <LeadActions
        lead={{
          id: lead.id,
          name: lead.name,
          email: lead.email,
          status: lead.status,
          companyName: lead.companyName,
          isConverted: Boolean(lead.convertedCustomerId),
          isMerged: Boolean(lead.mergedIntoLeadId),
        }}
        customers={customers}
        otherLeads={otherLeads.map((l) => ({
          ...l,
          createdAt: l.createdAt.toISOString(),
        }))}
      />


      {lead.notes && (
        <section className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <h3 className="text-xs uppercase tracking-wide text-white/40 mb-2">Internal notes</h3>
          <p className="text-sm text-white/80 whitespace-pre-line">{lead.notes}</p>
        </section>
      )}
    </>
  );
}

async function findEmailMatches(selfId: string, email: string) {
  const [leads, customers, contacts] = await Promise.all([
    prisma.lead.findMany({
      where: {
        id: { not: selfId },
        email: { equals: email, mode: "insensitive" },
      },
      select: { id: true, name: true, status: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.customer.findMany({
      where: { email: { equals: email, mode: "insensitive" } },
      select: { id: true, name: true, type: true, status: true },
      take: 5,
    }),
    prisma.contact.findMany({
      where: { email: { equals: email, mode: "insensitive" } },
      select: {
        id: true,
        name: true,
        role: true,
        customer: { select: { id: true, name: true } },
      },
      take: 5,
    }),
  ]);
  return { leads, customers, contacts };
}
