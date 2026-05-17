"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Field, Select, TextArea, TextInput } from "../_components/Field";
import { Button } from "../_components/Button";

const METHODS = [
  { value: "BANK_TRANSFER", label: "Bank transfer" },
  { value: "MOBILE_MONEY", label: "Mobile money" },
  { value: "CHEQUE", label: "Cheque" },
  { value: "CARD", label: "Card" },
  { value: "CASH", label: "Cash" },
  { value: "OTHER", label: "Other" },
];

const STATUSES = ["COMPLETED", "PENDING", "FAILED", "REFUNDED"];

interface InvoiceOption {
  id: string;
  number: string;
  outstanding: number;
  customerName: string;
  currency: string;
}

export interface PaymentFormValues {
  invoiceId?: string;
  amount?: number;
  currency?: string;
  method?: string;
  status?: string;
  reference?: string | null;
  notes?: string | null;
  paidAt?: string | null;
}

export default function PaymentForm({
  initial,
  invoices,
  onClose,
}: {
  initial?: PaymentFormValues;
  invoices?: InvoiceOption[];
  onClose: () => void;
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    invoiceId: initial?.invoiceId ?? invoices?.[0]?.id ?? "",
    amount: initial?.amount ?? 0,
    currency: initial?.currency ?? "GHS",
    method: initial?.method ?? "BANK_TRANSFER",
    status: initial?.status ?? "COMPLETED",
    reference: initial?.reference ?? "",
    notes: initial?.notes ?? "",
    paidAt: initial?.paidAt
      ? new Date(initial.paidAt).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10),
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!invoices) return;
    const selected = invoices.find((i) => i.id === form.invoiceId);
    if (selected) {
      setForm((f) => ({
        ...f,
        currency: selected.currency,
        amount: f.amount > 0 ? f.amount : selected.outstanding,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.invoiceId]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.invoiceId) {
      setError("Please select an invoice.");
      return;
    }
    if (!form.amount || form.amount <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }
    setSubmitting(true);
    const res = await fetch("/api/admin/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        invoiceId: form.invoiceId,
        amount: Number(form.amount),
        currency: form.currency,
        method: form.method,
        status: form.status,
        reference: form.reference || null,
        notes: form.notes || null,
        paidAt: form.paidAt || null,
      }),
    });
    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Could not record payment.");
      return;
    }
    router.refresh();
    onClose();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {invoices ? (
        <Field label="Invoice" required>
          <Select
            value={form.invoiceId}
            onChange={(e) => setForm({ ...form, invoiceId: e.target.value })}
            required
          >
            <option value="">— Select invoice —</option>
            {invoices.map((inv) => (
              <option key={inv.id} value={inv.id}>
                {inv.number} · {inv.customerName} · {inv.currency} {inv.outstanding.toFixed(2)} due
              </option>
            ))}
          </Select>
        </Field>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Amount" required>
          <TextInput
            type="number"
            min={0}
            step="0.01"
            value={String(form.amount)}
            onChange={(e) =>
              setForm({ ...form, amount: Number(e.target.value) || 0 })
            }
            required
          />
        </Field>
        <Field label="Currency">
          <TextInput
            value={form.currency}
            onChange={(e) =>
              setForm({ ...form, currency: e.target.value.toUpperCase() })
            }
            maxLength={3}
          />
        </Field>
        <Field label="Method">
          <Select
            value={form.method}
            onChange={(e) => setForm({ ...form, method: e.target.value })}
          >
            {METHODS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Status">
          <Select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Reference">
          <TextInput
            placeholder="Transaction ID, cheque number, etc."
            value={form.reference}
            onChange={(e) => setForm({ ...form, reference: e.target.value })}
          />
        </Field>
        <Field label="Date received">
          <TextInput
            type="date"
            value={form.paidAt}
            onChange={(e) => setForm({ ...form, paidAt: e.target.value })}
          />
        </Field>
      </div>

      <Field label="Notes">
        <TextArea
          rows={3}
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
      </Field>

      {error && (
        <div className="rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-200 text-sm px-3 py-2">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving…" : "Record payment"}
        </Button>
      </div>
    </form>
  );
}
