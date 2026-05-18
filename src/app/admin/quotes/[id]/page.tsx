import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, History } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { decimalToNumber, formatDate, formatMoney } from "@/lib/serialize";
import { currentSession } from "@/lib/guard";
import PageHeader from "../../_components/PageHeader";
import StatusBadge from "../../_components/StatusBadge";
import QuoteDetailClient from "./QuoteDetailClient";
import { LINE_KIND_LABELS, RECURRING_LABELS } from "@/lib/billing";

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
      solutionArchitect: { select: { id: true, name: true } },
      whtCategory: true,
      items: {
        orderBy: { sortOrder: "asc" },
        include: {
          markupTier: { select: { id: true, name: true } },
          labourEntries: { orderBy: { sortOrder: "asc" } },
          outstationEntries: { orderBy: { sortOrder: "asc" } },
        },
      },
      invoice: { select: { id: true, number: true } },
      revisions: {
        orderBy: { changedAt: "desc" },
        include: { editor: { select: { name: true } } },
      },
    },
  });
  if (!row) notFound();

  const quote = decimalToNumber(row);
  const session = await currentSession();
  const canSeeInternal =
    session?.user?.role === "DIRECTOR" || session?.user?.role === "FINANCE";

  const customersRows = await prisma.customer.findMany({
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
  });
  const customers = decimalToNumber(customersRows);

  const vatBreakdown = quote.vatBreakdown as
    | {
        baseAmount: number;
        nhilAmount: number;
        getfundAmount: number;
        vatStandardAmount: number;
        vatAmount: number;
        effectivePct: number;
        rates?: { standardPct: number; nhilPct: number; getfundPct: number };
      }
    | null;

  return (
    <>
      <Link
        href="/admin/quotes"
        className="inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-white mb-4"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to quotes
      </Link>

      <PageHeader
        eyebrow={`Quote · issued ${formatDate(quote.createdAt)}`}
        title={quote.number}
        description={
          quote.projectTitle
            ? `${quote.projectTitle} · for ${quote.customer.name}`
            : `For ${quote.customer.name}${quote.customer.legalName && quote.customer.legalName !== quote.customer.name ? ` · ${quote.customer.legalName}` : ""}`
        }
      />

      <div className="flex flex-wrap items-center gap-3 mb-6 text-xs">
        <StatusBadge status={quote.status} />
        {quote.revision > 1 && (
          <span className="text-white/50">Revision {quote.revision}</span>
        )}
        {quote.solutionArchitect && (
          <span className="text-white/60">Architect: {quote.solutionArchitect.name}</span>
        )}
        {quote.attentionTo && (
          <span className="text-white/60">Attn: {quote.attentionTo}</span>
        )}
        {quote.invoice && (
          <Link
            href={`/admin/invoices/${quote.invoice.id}`}
            className="text-white/60 hover:text-white"
          >
            Converted to invoice {quote.invoice.number} →
          </Link>
        )}
        {quote.fxRate && (
          <span className="text-white/50">
            FX: 1 USD = {quote.fxRate} {quote.currency} ({quote.fxRateSource})
          </span>
        )}
      </div>

      <QuoteDetailClient
        quote={{
          id: quote.id,
          customerId: quote.customerId,
          contactId: quote.contactId,
          status: quote.status,
          projectTitle: quote.projectTitle,
          attentionTo: quote.attentionTo,
          solutionArchitectId: quote.solutionArchitectId,
          scopeOfWork: quote.scopeOfWork,
          notes: quote.notes,
          currency: quote.currency,
          validUntil: quote.validUntil as unknown as string | null,
          fxRate: quote.fxRate,
          fxRateSource: quote.fxRateSource,
          fxRateDate: quote.fxRateDate as unknown as string | null,
          annualInterestRatePct: quote.annualInterestRatePct,
          projectCycleWeeks: quote.projectCycleWeeks,
          advancePaymentPct: quote.advancePaymentPct,
          whtCategoryId: quote.whtCategoryId,
          whtCustomPct: quote.whtCustomPct,
          vatApplied: quote.vatApplied,
          nonVatTaxApplied: quote.nonVatTaxApplied,
          revision: quote.revision,
          isLocked: quote.status === "SENT" || quote.status === "ACCEPTED",
          items: quote.items.map((i) => ({
            description: i.description,
            kind: i.kind,
            category: i.category,
            partNumber: i.partNumber ?? "",
            specs: i.specs ?? "",
            quantity: i.quantity,
            landedCost: i.landedCost,
            landedCostCurrency: i.landedCostCurrency,
            markupTierId: i.markupTierId ?? "",
            markupPct: i.markupPct,
            surchargePct: i.surchargePct,
            discountPct: i.discountPct,
            recurring: i.recurring,
            labourEntries: i.labourEntries.map((e) => ({
              roleId: e.roleId,
              days: e.days,
              indirectDays: e.indirectDays,
            })),
            outstationEntries: i.outstationEntries.map((e) => ({
              roleId: e.roleId,
              staffCount: e.staffCount,
              days: e.days,
              trips: e.trips,
            })),
          })),
          hasInvoice: Boolean(quote.invoice),
          invoiceId: quote.invoice?.id,
        }}
        customers={customers}
      />

      {quote.scopeOfWork && (
        <section className="mb-8 rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <h3 className="text-xs uppercase tracking-wide text-white/40 mb-2">Scope of work</h3>
          <p className="text-sm text-white/80 whitespace-pre-line">{quote.scopeOfWork}</p>
        </section>
      )}

      {/* Customer-facing line table */}
      <section className="mb-6 rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-white/60 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Description</th>
              <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Kind</th>
              <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Billing</th>
              <th className="text-right px-4 py-3 font-medium">Qty</th>
              <th className="text-right px-4 py-3 font-medium">Unit price</th>
              <th className="text-right px-4 py-3 font-medium">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {quote.items.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-3">
                  <div className="text-white">{item.description}</div>
                  {item.partNumber && (
                    <div className="text-xs text-white/40">P/N {item.partNumber}</div>
                  )}
                  {item.specs && (
                    <div className="text-xs text-white/60 mt-1 whitespace-pre-line pl-3 border-l border-white/10">
                      {item.specs}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-white/60 hidden md:table-cell">
                  {LINE_KIND_LABELS[item.kind] ?? item.kind}
                </td>
                <td className="px-4 py-3 text-xs text-white/60 hidden lg:table-cell">
                  {RECURRING_LABELS[item.recurring] ?? item.recurring}
                </td>
                <td className="px-4 py-3 text-right text-white/80">{item.quantity}</td>
                <td className="px-4 py-3 text-right text-white/80">
                  {formatMoney(item.finalUnitPriceExclTax, quote.currency)}
                </td>
                <td className="px-4 py-3 text-right text-white">
                  {formatMoney(item.finalLineTotalExclTax, quote.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div className="flex justify-end mb-8">
        <div className="w-full max-w-sm rounded-xl border border-white/10 bg-white/[0.04] p-5 space-y-2 text-sm">
          <Row label="Subtotal" value={formatMoney(quote.subtotal, quote.currency)} />
          {vatBreakdown && (
            <>
              <Row
                label={`NHIL (${(vatBreakdown.rates?.nhilPct ?? 2.5).toFixed(2)}%)`}
                value={formatMoney(vatBreakdown.nhilAmount, quote.currency)}
              />
              <Row
                label={`GETFund (${(vatBreakdown.rates?.getfundPct ?? 2.5).toFixed(2)}%)`}
                value={formatMoney(vatBreakdown.getfundAmount, quote.currency)}
              />
              <Row
                label={`VAT (${(vatBreakdown.rates?.standardPct ?? 15).toFixed(2)}%)`}
                value={formatMoney(vatBreakdown.vatStandardAmount, quote.currency)}
              />
              <Row
                label={`Total tax (${vatBreakdown.effectivePct.toFixed(2)}%)`}
                value={formatMoney(vatBreakdown.vatAmount, quote.currency)}
              />
            </>
          )}
          {!quote.vatApplied && quote.nonVatTaxApplied && (quote.nonVatTaxAmount ?? 0) > 0 && (
            <Row
              label={`Sales Tax (${Number(quote.nonVatTaxPct ?? 0).toFixed(2)}%)`}
              value={formatMoney(quote.nonVatTaxAmount ?? 0, quote.currency)}
            />
          )}
          <div className="pt-2 border-t border-white/10">
            <Row
              label="Total"
              value={formatMoney(quote.total, quote.currency)}
              bold
            />
          </div>
        </div>
      </div>

      {/* Internal pricing pipeline — DIRECTOR/FINANCE only */}
      {canSeeInternal && (
        <section className="mb-8 rounded-xl border border-amber-500/30 bg-amber-500/[0.04] p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-amber-200">
              Internal pricing (not shown to customer)
            </h3>
            <span className="text-xs text-amber-200/60">
              Gross profit: {formatMoney(quote.totalGp, quote.currency)} (
              {Number(quote.totalGpMarginPct).toFixed(1)}%)
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="text-white/60">
                <tr>
                  <th className="text-left px-2 py-2 font-medium">Description</th>
                  <th className="text-right px-2 py-2 font-medium">Landed</th>
                  <th className="text-right px-2 py-2 font-medium" title="Finder's fee as a cost">Surcharge %</th>
                  <th className="text-right px-2 py-2 font-medium">Finance %</th>
                  <th className="text-right px-2 py-2 font-medium">Markup %</th>
                  <th className="text-right px-2 py-2 font-medium">Discount %</th>
                  <th className="text-right px-2 py-2 font-medium">Final/unit</th>
                  <th className="text-right px-2 py-2 font-medium" title="Landed + surcharge × qty">Cost total</th>
                  <th className="text-right px-2 py-2 font-medium">GP</th>
                  <th className="text-right px-2 py-2 font-medium">GP%</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {quote.items.map((item) => (
                  <tr key={item.id} className="text-white/80">
                    <td className="px-2 py-1.5 truncate max-w-[20ch]">{item.description}</td>
                    <td className="px-2 py-1.5 text-right">
                      {formatMoney(item.landedCost, quote.currency)}
                    </td>
                    <td className="px-2 py-1.5 text-right">{Number(item.surchargePct).toFixed(2)}%</td>
                    <td className="px-2 py-1.5 text-right">{Number(item.financeChargePct).toFixed(2)}%</td>
                    <td className="px-2 py-1.5 text-right">{Number(item.markupPct).toFixed(2)}%</td>
                    <td className="px-2 py-1.5 text-right">{Number(item.discountPct).toFixed(2)}%</td>
                    <td className="px-2 py-1.5 text-right">
                      {formatMoney(item.finalUnitPriceExclTax, quote.currency)}
                    </td>
                    <td className="px-2 py-1.5 text-right">
                      {formatMoney(item.costLineTotal, quote.currency)}
                    </td>
                    <td className="px-2 py-1.5 text-right text-emerald-200">
                      {formatMoney(item.lineGpAmount, quote.currency)}
                    </td>
                    <td className="px-2 py-1.5 text-right text-emerald-200">
                      {Number(item.lineGpMarginPct).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {quote.notes && (
        <section className="mb-8 rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <h3 className="text-xs uppercase tracking-wide text-white/40 mb-2">Internal notes</h3>
          <p className="text-sm text-white/80 whitespace-pre-line">{quote.notes}</p>
        </section>
      )}

      {canSeeInternal && quote.revisions.length > 0 && (
        <section className="mb-8 rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <h3 className="text-xs uppercase tracking-wide text-white/40 mb-3 inline-flex items-center gap-1.5">
            <History className="w-3.5 h-3.5" /> Revision history
          </h3>
          <ul className="space-y-2 text-sm">
            {quote.revisions.map((r) => (
              <li key={r.id} className="text-white/80 flex flex-wrap gap-x-3 gap-y-1">
                <span className="text-white">Rev {r.revision}</span>
                <span className="text-white/50">{formatDate(r.changedAt)}</span>
                <span className="text-white/60">{r.editor?.name ?? "Unknown"}</span>
                {r.reason && <span className="text-white/60 italic">— {r.reason}</span>}
              </li>
            ))}
          </ul>
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
