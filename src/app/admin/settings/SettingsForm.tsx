"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Field, TextArea, TextInput } from "../_components/Field";
import { Button } from "../_components/Button";

export interface SettingsValues {
  companyName?: string;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  country?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  taxId?: string | null;
  defaultTaxRate?: number;
  paymentTerms?: string | null;
  bankName?: string | null;
  bankAccountName?: string | null;
  bankAccountNo?: string | null;
  bankBranch?: string | null;
  bankSwift?: string | null;
  momoProvider?: string | null;
  momoNumber?: string | null;
  momoAccountName?: string | null;
  currency?: string;
  quotePrefix?: string;
  invoicePrefix?: string;
}

export default function SettingsForm({
  initial,
  readOnly = false,
}: {
  initial: SettingsValues;
  readOnly?: boolean;
}) {
  const router = useRouter();
  const [form, setForm] = useState<SettingsValues>({
    ...initial,
    defaultTaxRate: initial.defaultTaxRate ?? 0,
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function update<K extends keyof SettingsValues>(key: K, value: SettingsValues[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setMessage({ type: "error", text: data?.error ?? "Could not save settings." });
      return;
    }
    setMessage({ type: "success", text: "Settings saved." });
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <fieldset disabled={readOnly} className="space-y-8 disabled:opacity-70">
      <Section title="Company">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Company name" required>
            <TextInput
              value={form.companyName ?? ""}
              onChange={(e) => update("companyName", e.target.value)}
              required
            />
          </Field>
          <Field label="Tax ID / VAT number">
            <TextInput
              value={form.taxId ?? ""}
              onChange={(e) => update("taxId", e.target.value)}
            />
          </Field>
          <Field label="Address line 1">
            <TextInput
              value={form.addressLine1 ?? ""}
              onChange={(e) => update("addressLine1", e.target.value)}
            />
          </Field>
          <Field label="Address line 2">
            <TextInput
              value={form.addressLine2 ?? ""}
              onChange={(e) => update("addressLine2", e.target.value)}
            />
          </Field>
          <Field label="City">
            <TextInput
              value={form.city ?? ""}
              onChange={(e) => update("city", e.target.value)}
            />
          </Field>
          <Field label="Country">
            <TextInput
              value={form.country ?? ""}
              onChange={(e) => update("country", e.target.value)}
            />
          </Field>
          <Field label="Email">
            <TextInput
              type="email"
              value={form.email ?? ""}
              onChange={(e) => update("email", e.target.value)}
            />
          </Field>
          <Field label="Phone">
            <TextInput
              value={form.phone ?? ""}
              onChange={(e) => update("phone", e.target.value)}
            />
          </Field>
          <Field label="Website">
            <TextInput
              value={form.website ?? ""}
              onChange={(e) => update("website", e.target.value)}
            />
          </Field>
          <Field label="Default currency">
            <TextInput
              value={form.currency ?? "GHS"}
              onChange={(e) => update("currency", e.target.value.toUpperCase())}
              maxLength={3}
            />
          </Field>
        </div>
      </Section>

      <Section title="Billing defaults">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Default tax rate (%)">
            <TextInput
              type="number"
              min={0}
              max={100}
              step="0.01"
              value={String(form.defaultTaxRate ?? 0)}
              onChange={(e) => update("defaultTaxRate", Number(e.target.value) || 0)}
            />
          </Field>
          <Field label="Quote number prefix">
            <TextInput
              value={form.quotePrefix ?? "Q"}
              onChange={(e) => update("quotePrefix", e.target.value)}
              maxLength={10}
            />
          </Field>
          <Field label="Invoice number prefix">
            <TextInput
              value={form.invoicePrefix ?? "INV"}
              onChange={(e) => update("invoicePrefix", e.target.value)}
              maxLength={10}
            />
          </Field>
        </div>
        <Field label="Default payment terms">
          <TextArea
            rows={3}
            value={form.paymentTerms ?? ""}
            onChange={(e) => update("paymentTerms", e.target.value)}
          />
        </Field>
      </Section>

      <Section title="Bank account">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Bank name">
            <TextInput
              value={form.bankName ?? ""}
              onChange={(e) => update("bankName", e.target.value)}
            />
          </Field>
          <Field label="Account name">
            <TextInput
              value={form.bankAccountName ?? ""}
              onChange={(e) => update("bankAccountName", e.target.value)}
            />
          </Field>
          <Field label="Account number">
            <TextInput
              value={form.bankAccountNo ?? ""}
              onChange={(e) => update("bankAccountNo", e.target.value)}
            />
          </Field>
          <Field label="Branch">
            <TextInput
              value={form.bankBranch ?? ""}
              onChange={(e) => update("bankBranch", e.target.value)}
            />
          </Field>
          <Field label="SWIFT / BIC">
            <TextInput
              value={form.bankSwift ?? ""}
              onChange={(e) => update("bankSwift", e.target.value)}
            />
          </Field>
        </div>
      </Section>

      <Section title="Mobile money">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Provider">
            <TextInput
              placeholder="MTN / Telecel / AirtelTigo"
              value={form.momoProvider ?? ""}
              onChange={(e) => update("momoProvider", e.target.value)}
            />
          </Field>
          <Field label="Number">
            <TextInput
              value={form.momoNumber ?? ""}
              onChange={(e) => update("momoNumber", e.target.value)}
            />
          </Field>
          <Field label="Account name">
            <TextInput
              value={form.momoAccountName ?? ""}
              onChange={(e) => update("momoAccountName", e.target.value)}
            />
          </Field>
        </div>
      </Section>

      {message && (
        <div
          className={`rounded-md text-sm px-3 py-2 border ${
            message.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-200"
              : "bg-rose-500/10 border-rose-500/30 text-rose-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {!readOnly && (
        <div className="flex justify-end">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Saving…" : "Save settings"}
          </Button>
        </div>
      )}
      </fieldset>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.02] p-6 space-y-4">
      <h2 className="text-sm font-semibold text-white">{title}</h2>
      {children}
    </section>
  );
}
