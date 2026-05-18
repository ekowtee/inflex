"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Edit2,
  FileDown,
  Send,
  CheckCircle2,
  XCircle,
  ArrowRightCircle,
  Trash2,
  ClipboardCheck,
} from "lucide-react";
import { Button } from "../../_components/Button";
import Modal from "../../_components/Modal";
import QuoteBuilder, { QuoteBuilderInitial } from "../QuoteBuilder";

interface QuoteAction {
  id: string;
  status: string;
  hasInvoice: boolean;
  invoiceId?: string;
}

export default function QuoteDetailClient({
  quote,
  customers,
}: {
  quote: QuoteBuilderInitial & QuoteAction;
  customers: { id: string; name: string; company: string | null }[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function changeStatus(newStatus: string, revisionReason?: string) {
    setError(null);
    setBusy(newStatus);
    const res = await fetch(`/api/admin/quotes/${quote.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...quoteToPayload(quote),
        status: newStatus,
        revisionReason: revisionReason ?? null,
      }),
    });
    setBusy(null);
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Could not update status.");
      return;
    }
    router.refresh();
  }

  async function convertToInvoice() {
    setError(null);
    setBusy("convert");
    const res = await fetch(`/api/admin/quotes/${quote.id}/convert`, { method: "POST" });
    setBusy(null);
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Could not convert to invoice.");
      return;
    }
    const invoice = await res.json();
    router.push(`/admin/invoices/${invoice.id}`);
  }

  async function onDelete() {
    if (!confirm("Delete quote? This cannot be undone.")) return;
    setBusy("delete");
    const res = await fetch(`/api/admin/quotes/${quote.id}`, { method: "DELETE" });
    setBusy(null);
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Could not delete quote.");
      return;
    }
    router.push("/admin/quotes");
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>
          <Edit2 className="w-3.5 h-3.5" /> Edit
        </Button>
        <PdfLink id={quote.id} view="customer" label="Customer PDF" />
        <PdfLink id={quote.id} view="internal" label="Internal PDF" />
        {quote.status === "DRAFT" && (
          <Button size="sm" disabled={busy === "PENDING_APPROVAL"} onClick={() => changeStatus("PENDING_APPROVAL")}>
            <ClipboardCheck className="w-3.5 h-3.5" /> Submit for approval
          </Button>
        )}
        {quote.status === "PENDING_APPROVAL" && (
          <Button size="sm" disabled={busy === "SENT"} onClick={() => changeStatus("SENT")}>
            <Send className="w-3.5 h-3.5" /> Approve & mark sent
          </Button>
        )}
        {quote.status === "SENT" && (
          <>
            <Button size="sm" disabled={busy === "ACCEPTED"} onClick={() => changeStatus("ACCEPTED")}>
              <CheckCircle2 className="w-3.5 h-3.5" /> Mark accepted
            </Button>
            <Button variant="secondary" size="sm" disabled={busy === "DECLINED"} onClick={() => changeStatus("DECLINED")}>
              <XCircle className="w-3.5 h-3.5" /> Mark declined
            </Button>
          </>
        )}
        {quote.status === "ACCEPTED" && !quote.hasInvoice && (
          <Button size="sm" disabled={busy === "convert"} onClick={convertToInvoice}>
            <ArrowRightCircle className="w-3.5 h-3.5" /> Convert to invoice
          </Button>
        )}
        {!quote.hasInvoice && (
          <Button variant="danger" size="sm" disabled={busy === "delete"} onClick={onDelete}>
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </Button>
        )}
      </div>

      {error && (
        <div className="rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-200 text-sm px-3 py-2 mb-4">
          {error}
        </div>
      )}

      <Modal open={editing} onClose={() => setEditing(false)} title="Edit quote" size="xl">
        <QuoteBuilder initial={quote} customers={customers} onClose={() => setEditing(false)} />
      </Modal>
    </>
  );
}

function PdfLink({ id, view, label }: { id: string; view: "customer" | "internal"; label: string }) {
  return (
    <a
      href={`/api/admin/quotes/${id}/pdf?view=${view}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition-colors bg-white/10 hover:bg-white/15 text-white border border-white/15 px-2.5 py-1.5 text-xs"
    >
      <FileDown className="w-3.5 h-3.5" /> {label}
    </a>
  );
}

function quoteToPayload(q: QuoteBuilderInitial): Record<string, unknown> {
  return {
    customerId: q.customerId,
    status: q.status,
    projectTitle: q.projectTitle ?? null,
    attentionTo: q.attentionTo ?? null,
    solutionArchitectId: q.solutionArchitectId ?? null,
    scopeOfWork: q.scopeOfWork ?? null,
    notes: q.notes ?? null,
    currency: q.currency ?? "GHS",
    validUntil: q.validUntil ?? null,
    fxRate: q.fxRate ?? null,
    fxRateSource: q.fxRateSource ?? null,
    fxRateDate: q.fxRateDate ?? null,
    annualInterestRatePct: q.annualInterestRatePct ?? 0,
    projectCycleWeeks: q.projectCycleWeeks ?? 0,
    advancePaymentPct: q.advancePaymentPct ?? 0,
    whtCategoryId: q.whtCategoryId ?? null,
    whtCustomPct: q.whtCustomPct ?? null,
    vatApplied: q.vatApplied ?? false,
    nonVatTaxApplied: q.nonVatTaxApplied ?? false,
    items: (q.items ?? []).map((i, idx) => ({
      description: i.description,
      kind: i.kind,
      category: i.category,
      partNumber: i.partNumber || null,
      specs: i.specs || null,
      quantity: Number(i.quantity),
      landedCost: Number(i.landedCost),
      landedCostCurrency: i.landedCostCurrency || (q.currency ?? "GHS"),
      markupTierId: i.markupTierId || null,
      markupPct: Number(i.markupPct),
      surchargePct: Number(i.surchargePct),
      discountPct: Number(i.discountPct),
      recurring: i.recurring,
      sortOrder: idx,
      labourEntries: i.kind === "LABOUR" ? i.labourEntries ?? [] : [],
      outstationEntries: i.kind === "OUTSTATION" ? i.outstationEntries ?? [] : [],
    })),
  };
}
