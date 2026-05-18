"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit2, FileDown, Send, CheckCircle2, Trash2, Plus } from "lucide-react";
import { Button } from "../../_components/Button";
import Modal from "../../_components/Modal";
import InvoiceForm, { InvoiceFormValues } from "../InvoiceForm";
import PaymentForm from "../../payments/PaymentForm";

interface InvoiceMeta {
  id: string;
  status: string;
  hasPayments: boolean;
  currency: string;
  outstanding: number;
}

export default function InvoiceDetailClient({
  invoice,
  customers,
  defaultCurrency,
}: {
  invoice: InvoiceFormValues & InvoiceMeta;
  customers: {
    id: string;
    name: string;
    legalName: string | null;
    type: "COMPANY" | "INDIVIDUAL";
    contacts: { id: string; name: string; role: string; isPrimary: boolean }[];
  }[];
  defaultCurrency: string;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [recordingPayment, setRecordingPayment] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function changeStatus(newStatus: string) {
    setError(null);
    setBusy(newStatus);
    const res = await fetch(`/api/admin/invoices/${invoice.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...invoiceToPayload(invoice), status: newStatus }),
    });
    setBusy(null);
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Could not update status.");
      return;
    }
    router.refresh();
  }

  async function onDelete() {
    if (!confirm("Delete invoice? This cannot be undone.")) return;
    setBusy("delete");
    const res = await fetch(`/api/admin/invoices/${invoice.id}`, { method: "DELETE" });
    setBusy(null);
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Could not delete invoice.");
      return;
    }
    router.push("/admin/invoices");
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>
          <Edit2 className="w-3.5 h-3.5" /> Edit
        </Button>
        <a
          href={`/api/admin/invoices/${invoice.id}/pdf`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition-colors bg-white/10 hover:bg-white/15 text-white border border-white/15 px-2.5 py-1.5 text-xs"
        >
          <FileDown className="w-3.5 h-3.5" /> Download PDF
        </a>
        {invoice.status === "DRAFT" && (
          <Button size="sm" disabled={busy === "SENT"} onClick={() => changeStatus("SENT")}>
            <Send className="w-3.5 h-3.5" /> Mark as sent
          </Button>
        )}
        {invoice.outstanding > 0 && invoice.status !== "CANCELLED" && (
          <Button size="sm" onClick={() => setRecordingPayment(true)}>
            <Plus className="w-3.5 h-3.5" /> Record payment
          </Button>
        )}
        {invoice.status !== "PAID" && invoice.outstanding <= 0.001 && invoice.outstanding >= -0.001 && (
          <Button size="sm" disabled={busy === "PAID"} onClick={() => changeStatus("PAID")}>
            <CheckCircle2 className="w-3.5 h-3.5" /> Mark paid
          </Button>
        )}
        {!invoice.hasPayments && (
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

      <Modal open={editing} onClose={() => setEditing(false)} title="Edit invoice" size="xl">
        <InvoiceForm
          initial={invoice}
          customers={customers}
          defaultCurrency={defaultCurrency}
          onClose={() => setEditing(false)}
        />
      </Modal>

      <Modal
        open={recordingPayment}
        onClose={() => setRecordingPayment(false)}
        title="Record payment"
      >
        <PaymentForm
          initial={{
            invoiceId: invoice.id,
            amount: invoice.outstanding,
            currency: invoice.currency,
          }}
          onClose={() => setRecordingPayment(false)}
        />
      </Modal>
    </>
  );
}

function invoiceToPayload(inv: InvoiceFormValues): Record<string, unknown> {
  return {
    customerId: inv.customerId,
    status: inv.status,
    notes: inv.notes,
    taxRate: inv.taxRate ?? 0,
    discount: inv.discount ?? 0,
    currency: inv.currency ?? "GHS",
    issueDate: inv.issueDate ?? null,
    dueDate: inv.dueDate ?? null,
    items: (inv.items ?? []).map((i, idx) => ({
      description: i.description,
      category: i.category,
      quantity: Number(i.quantity),
      unitPrice: Number(i.unitPrice),
      recurring: i.recurring,
      sortOrder: idx,
    })),
  };
}
