"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Field, Select, TextArea, TextInput } from "../_components/Field";
import { Button } from "../_components/Button";
import LineItemEditor, { LineItemDraft } from "../_components/LineItemEditor";
import { calculateTotals } from "@/lib/billing";
import { formatMoney } from "@/lib/serialize";

interface CustomerOption {
  id: string;
  name: string;
  company: string | null;
}

interface QuoteFormItem extends LineItemDraft {
  sortOrder?: number;
}

export interface QuoteFormValues {
  id?: string;
  customerId?: string;
  status?: string;
  scopeOfWork?: string | null;
  notes?: string | null;
  taxRate?: number;
  discount?: number;
  currency?: string;
  validUntil?: string | null;
  items?: QuoteFormItem[];
}

const STATUSES = ["DRAFT", "SENT", "ACCEPTED", "DECLINED", "EXPIRED"];

export default function QuoteForm({
  initial,
  customers,
  defaultCurrency = "GHS",
  onClose,
}: {
  initial?: QuoteFormValues;
  customers: CustomerOption[];
  defaultCurrency?: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);
  const [form, setForm] = useState({
    customerId: initial?.customerId ?? customers[0]?.id ?? "",
    status: initial?.status ?? "DRAFT",
    scopeOfWork: initial?.scopeOfWork ?? "",
    notes: initial?.notes ?? "",
    taxRate: initial?.taxRate ?? 0,
    discount: initial?.discount ?? 0,
    currency: initial?.currency ?? defaultCurrency,
    validUntil: initial?.validUntil
      ? new Date(initial.validUntil).toISOString().slice(0, 10)
      : "",
  });
  const [items, setItems] = useState<LineItemDraft[]>(
    initial?.items?.length
      ? initial.items.map((i) => ({
          description: i.description,
          category: i.category,
          quantity: Number(i.quantity),
          unitPrice: Number(i.unitPrice),
          recurring: i.recurring,
        }))
      : [
          {
            description: "",
            category: "CONSULTING",
            quantity: 1,
            unitPrice: 0,
            recurring: "NONE",
          },
        ]
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totals = useMemo(
    () =>
      calculateTotals({
        items,
        taxRate: Number(form.taxRate) || 0,
        discount: Number(form.discount) || 0,
      }),
    [items, form.taxRate, form.discount]
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.customerId) {
      setError("Please select a customer.");
      return;
    }
    if (items.length === 0 || items.every((i) => !i.description.trim())) {
      setError("Add at least one line item.");
      return;
    }
    setSubmitting(true);
    const payload = {
      customerId: form.customerId,
      status: form.status,
      scopeOfWork: form.scopeOfWork || null,
      notes: form.notes || null,
      taxRate: Number(form.taxRate) || 0,
      discount: Number(form.discount) || 0,
      currency: form.currency,
      validUntil: form.validUntil || null,
      items: items
        .filter((i) => i.description.trim())
        .map((i, idx) => ({ ...i, sortOrder: idx })),
    };
    const url = isEdit ? `/api/admin/quotes/${initial?.id}` : "/api/admin/quotes";
    const method = isEdit ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Could not save quote.");
      return;
    }
    router.refresh();
    onClose();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Customer" required htmlFor="q-customer">
          <Select
            id="q-customer"
            value={form.customerId}
            onChange={(e) => setForm({ ...form, customerId: e.target.value })}
            required
          >
            <option value="">— Select customer —</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
                {c.company ? ` · ${c.company}` : ""}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Status" htmlFor="q-status">
          <Select
            id="q-status"
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
        <Field label="Currency" htmlFor="q-currency">
          <TextInput
            id="q-currency"
            value={form.currency}
            onChange={(e) =>
              setForm({ ...form, currency: e.target.value.toUpperCase() })
            }
            maxLength={3}
          />
        </Field>
        <Field label="Valid until" htmlFor="q-valid">
          <TextInput
            id="q-valid"
            type="date"
            value={form.validUntil}
            onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
          />
        </Field>
      </div>

      <Field label="Scope of work" htmlFor="q-scope">
        <TextArea
          id="q-scope"
          rows={3}
          placeholder="A short summary of what's being delivered…"
          value={form.scopeOfWork}
          onChange={(e) => setForm({ ...form, scopeOfWork: e.target.value })}
        />
      </Field>

      <div>
        <p className="text-xs uppercase tracking-wide text-white/60 mb-2">
          Line items
        </p>
        <LineItemEditor items={items} onChange={setItems} currency={form.currency} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/10">
        <Field label="Tax rate (%)" htmlFor="q-tax">
          <TextInput
            id="q-tax"
            type="number"
            min={0}
            max={100}
            step="0.01"
            value={String(form.taxRate)}
            onChange={(e) =>
              setForm({ ...form, taxRate: Number(e.target.value) || 0 })
            }
          />
        </Field>
        <Field label="Discount" htmlFor="q-discount">
          <TextInput
            id="q-discount"
            type="number"
            min={0}
            step="0.01"
            value={String(form.discount)}
            onChange={(e) =>
              setForm({ ...form, discount: Number(e.target.value) || 0 })
            }
          />
        </Field>
        <div className="rounded-lg bg-white/[0.04] border border-white/10 p-4 space-y-1.5">
          <div className="flex justify-between text-xs text-white/60">
            <span>Subtotal</span>
            <span>{formatMoney(totals.subtotal, form.currency)}</span>
          </div>
          <div className="flex justify-between text-xs text-white/60">
            <span>Tax</span>
            <span>{formatMoney(totals.taxAmount, form.currency)}</span>
          </div>
          <div className="flex justify-between text-sm font-semibold text-white pt-1.5 border-t border-white/10">
            <span>Total</span>
            <span>{formatMoney(totals.total, form.currency)}</span>
          </div>
        </div>
      </div>

      <Field label="Internal notes" htmlFor="q-notes">
        <TextArea
          id="q-notes"
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
          {submitting ? "Saving…" : isEdit ? "Save quote" : "Create quote"}
        </Button>
      </div>
    </form>
  );
}
