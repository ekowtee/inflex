"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Field, Select, TextArea, TextInput } from "../_components/Field";
import { Button } from "../_components/Button";
import LineItemEditor, { LineItemDraft } from "../_components/LineItemEditor";
import { formatMoney } from "@/lib/serialize";

function calculateTotals(opts: {
  items: { quantity: number; unitPrice: number }[];
  taxRate: number;
  discount: number;
}) {
  const subtotal = opts.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  const discounted = Math.max(0, subtotal - opts.discount);
  const taxAmount = (discounted * opts.taxRate) / 100;
  return {
    subtotal: round2(subtotal),
    taxAmount: round2(taxAmount),
    total: round2(discounted + taxAmount),
  };
}
function round2(n: number) {
  return Math.round(n * 100) / 100;
}

interface CustomerOption {
  id: string;
  name: string;
  legalName: string | null;
  type: "COMPANY" | "INDIVIDUAL";
  contacts: { id: string; name: string; role: string; isPrimary: boolean }[];
}

interface InvoiceFormItem extends LineItemDraft {
  sortOrder?: number;
}

export interface InvoiceFormValues {
  id?: string;
  customerId?: string;
  contactId?: string | null;
  status?: string;
  notes?: string | null;
  taxRate?: number;
  discount?: number;
  currency?: string;
  issueDate?: string | null;
  dueDate?: string | null;
  items?: InvoiceFormItem[];
}

const STATUSES = [
  "DRAFT",
  "SENT",
  "PARTIALLY_PAID",
  "PAID",
  "OVERDUE",
  "CANCELLED",
];

export default function InvoiceForm({
  initial,
  customers,
  defaultCurrency = "GHS",
  onClose,
}: {
  initial?: InvoiceFormValues;
  customers: CustomerOption[];
  defaultCurrency?: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);
  const [form, setForm] = useState({
    customerId: initial?.customerId ?? customers[0]?.id ?? "",
    contactId: initial?.contactId ?? "",
    status: initial?.status ?? "DRAFT",
    notes: initial?.notes ?? "",
    taxRate: initial?.taxRate ?? 0,
    discount: initial?.discount ?? 0,
    currency: initial?.currency ?? defaultCurrency,
    issueDate: initial?.issueDate
      ? new Date(initial.issueDate).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10),
    dueDate: initial?.dueDate
      ? new Date(initial.dueDate).toISOString().slice(0, 10)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
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
      contactId: form.contactId || null,
      status: form.status,
      notes: form.notes || null,
      taxRate: Number(form.taxRate) || 0,
      discount: Number(form.discount) || 0,
      currency: form.currency,
      issueDate: form.issueDate || null,
      dueDate: form.dueDate || null,
      items: items
        .filter((i) => i.description.trim())
        .map((i, idx) => ({ ...i, sortOrder: idx })),
    };
    const url = isEdit ? `/api/admin/invoices/${initial?.id}` : "/api/admin/invoices";
    const method = isEdit ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Could not save invoice.");
      return;
    }
    router.refresh();
    onClose();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Customer" required>
          <Select
            value={form.customerId}
            onChange={(e) =>
              setForm({ ...form, customerId: e.target.value, contactId: "" })
            }
            required
          >
            <option value="">— Select customer —</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
                {c.legalName && c.legalName !== c.name ? ` · ${c.legalName}` : ""}
              </option>
            ))}
          </Select>
        </Field>
        {(() => {
          const selected = customers.find((c) => c.id === form.customerId);
          if (!selected || selected.type !== "COMPANY") return null;
          return (
            <Field
              label="Contact"
              hint={
                selected.contacts.length === 0
                  ? "No contacts on file — add one from the customer page."
                  : "Named addressee on the PDF (optional)."
              }
            >
              <Select
                value={form.contactId}
                onChange={(e) => setForm({ ...form, contactId: e.target.value })}
                disabled={selected.contacts.length === 0}
              >
                <option value="">— None —</option>
                {selected.contacts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.role}){c.isPrimary ? " · primary" : ""}
                  </option>
                ))}
              </Select>
            </Field>
          );
        })()}
        <Field label="Status">
          <Select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replace("_", " ")}
              </option>
            ))}
          </Select>
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
        <div className="grid grid-cols-2 gap-3">
          <Field label="Issue date">
            <TextInput
              type="date"
              value={form.issueDate}
              onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
            />
          </Field>
          <Field label="Due date">
            <TextInput
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            />
          </Field>
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-wide text-white/60 mb-2">
          Line items
        </p>
        <LineItemEditor items={items} onChange={setItems} currency={form.currency} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/10">
        <Field label="Tax rate (%)">
          <TextInput
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
        <Field label="Discount">
          <TextInput
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
          {submitting ? "Saving…" : isEdit ? "Save invoice" : "Create invoice"}
        </Button>
      </div>
    </form>
  );
}
