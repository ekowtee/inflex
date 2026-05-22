"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Field, TextArea, TextInput } from "../_components/Field";
import { Button } from "../_components/Button";
import { computeVatBreakdown } from "@/lib/pricing";
import { DEFAULT_QUOTE_TERMS } from "@/lib/quoteTerms";

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
  quoteTerms?: string | null;

  // VAT
  vatRegistered?: boolean;
  vatStandardPct?: number;
  nhilPct?: number;
  getfundPct?: number;

  // Non-VAT sales tax
  nonVatTaxApplied?: boolean;
  nonVatTaxLabel?: string;
  nonVatTaxOnGoodsPct?: number;
  nonVatTaxOnServicesPct?: number;

  // Finance defaults
  defaultAnnualInterestRatePct?: number;
  defaultProjectCycleWeeks?: number;
  defaultAdvancePaymentPct?: number;

  // FX defaults
  defaultFxUsdGhsRate?: number | null;
  defaultFxRateSource?: string;

  // Rounding
  roundingThreshold?: number;
  roundingIncrementBelow?: number;
  roundingIncrementAbove?: number;
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
    vatRegistered: initial.vatRegistered ?? false,
    nonVatTaxApplied: initial.nonVatTaxApplied ?? true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function update<K extends keyof SettingsValues>(key: K, value: SettingsValues[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const vatPreview = useMemo(() => {
    return computeVatBreakdown(1000, {
      standardPct: Number(form.vatStandardPct ?? 0),
      nhilPct: Number(form.nhilPct ?? 0),
      getfundPct: Number(form.getfundPct ?? 0),
    });
  }, [form.vatStandardPct, form.nhilPct, form.getfundPct]);

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

        <Section title="VAT (Ghana 2026 — Act 1151)">
          <label className="inline-flex items-center gap-2 text-sm text-white/80 mb-3">
            <input
              type="checkbox"
              checked={form.vatRegistered ?? false}
              onChange={(e) => update("vatRegistered", e.target.checked)}
              className="rounded border-white/20 bg-white/5 text-[#BD2E25] focus:ring-[#BD2E25]"
            />
            We are VAT-registered
          </label>
          <p className="text-xs text-white/40 mb-3">
            Threshold: GHS 750k turnover (goods). When unchecked, new quotes
            default to the non-VAT sales tax below.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Standard VAT (%)">
              <TextInput
                type="number" min={0} max={100} step="0.01"
                value={String(form.vatStandardPct ?? 15)}
                onChange={(e) => update("vatStandardPct", Number(e.target.value) || 0)}
              />
            </Field>
            <Field label="NHIL (%)">
              <TextInput
                type="number" min={0} max={100} step="0.01"
                value={String(form.nhilPct ?? 2.5)}
                onChange={(e) => update("nhilPct", Number(e.target.value) || 0)}
              />
            </Field>
            <Field label="GETFund (%)">
              <TextInput
                type="number" min={0} max={100} step="0.01"
                value={String(form.getfundPct ?? 2.5)}
                onChange={(e) => update("getfundPct", Number(e.target.value) || 0)}
              />
            </Field>
          </div>
          <div className="rounded-lg bg-white/[0.04] border border-white/10 p-4 text-xs text-white/70">
            Breakdown on a GHS 1,000 subtotal:
            <ul className="mt-1 space-y-0.5">
              <li>NHIL: <span className="text-white">GHS {vatPreview.nhilAmount.toFixed(2)}</span></li>
              <li>GETFund: <span className="text-white">GHS {vatPreview.getfundAmount.toFixed(2)}</span></li>
              <li>VAT: <span className="text-white">GHS {vatPreview.vatStandardAmount.toFixed(2)}</span></li>
              <li>Total tax: <span className="text-white font-semibold">GHS {vatPreview.vatAmount.toFixed(2)} ({vatPreview.effectivePct.toFixed(2)}%)</span></li>
            </ul>
            <p className="mt-2 text-white/40">
              Each rate is computed against the subtotal independently and summed. No cascading.
            </p>
          </div>
        </Section>

        <Section title="Non-VAT sales tax (below threshold)">
          <label className="inline-flex items-center gap-2 text-sm text-white/80 mb-2">
            <input
              type="checkbox"
              checked={form.nonVatTaxApplied ?? true}
              onChange={(e) => update("nonVatTaxApplied", e.target.checked)}
              className="rounded border-white/20 bg-white/5 text-[#BD2E25] focus:ring-[#BD2E25]"
            />
            Charge a presumptive / sales tax on quotes when not VAT-registered
          </label>
          <p className="text-xs text-amber-200/80 mb-3 bg-amber-500/10 border border-amber-500/30 rounded-md px-3 py-2">
            Confirm with your accountant what this tax is officially called, its basis (goods only vs all supplies), and whether it appears as a separate line or is embedded. Defaults below assume 3% on goods only.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Line label on PDF">
              <TextInput
                value={form.nonVatTaxLabel ?? "Sales Tax"}
                onChange={(e) => update("nonVatTaxLabel", e.target.value)}
                maxLength={50}
              />
            </Field>
            <Field label="Rate on goods (%)">
              <TextInput
                type="number" min={0} max={100} step="0.01"
                value={String(form.nonVatTaxOnGoodsPct ?? 3)}
                onChange={(e) => update("nonVatTaxOnGoodsPct", Number(e.target.value) || 0)}
              />
            </Field>
            <Field label="Rate on services (%)">
              <TextInput
                type="number" min={0} max={100} step="0.01"
                value={String(form.nonVatTaxOnServicesPct ?? 0)}
                onChange={(e) => update("nonVatTaxOnServicesPct", Number(e.target.value) || 0)}
              />
            </Field>
          </div>
        </Section>

        <Section title="Finance charge defaults">
          <p className="text-xs text-white/40 mb-3">
            Working-capital cost baked into product line prices. Quote-level
            values can override these on each quote.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Annual interest rate (%)" hint="Commercial lending rate">
              <TextInput
                type="number" min={0} max={100} step="0.01"
                value={String(form.defaultAnnualInterestRatePct ?? 22)}
                onChange={(e) => update("defaultAnnualInterestRatePct", Number(e.target.value) || 0)}
              />
            </Field>
            <Field label="Project cycle (weeks)">
              <TextInput
                type="number" min={0} step="1"
                value={String(form.defaultProjectCycleWeeks ?? 8)}
                onChange={(e) => update("defaultProjectCycleWeeks", Number(e.target.value) || 0)}
              />
            </Field>
            <Field label="Advance payment default (%)">
              <TextInput
                type="number" min={0} max={100} step="0.01"
                value={String(form.defaultAdvancePaymentPct ?? 0)}
                onChange={(e) => update("defaultAdvancePaymentPct", Number(e.target.value) || 0)}
              />
            </Field>
          </div>
        </Section>

        <Section title="Foreign exchange">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Default USD → GHS rate" hint="Reps can override per quote">
              <TextInput
                type="number" min={0} step="0.000001"
                value={form.defaultFxUsdGhsRate != null ? String(form.defaultFxUsdGhsRate) : ""}
                onChange={(e) =>
                  update(
                    "defaultFxUsdGhsRate",
                    e.target.value === "" ? null : Number(e.target.value)
                  )
                }
              />
            </Field>
            <Field label="Rate source" hint="Shown in PDF footer">
              <TextInput
                value={form.defaultFxRateSource ?? "cedirates.com"}
                onChange={(e) => update("defaultFxRateSource", e.target.value)}
              />
            </Field>
          </div>
        </Section>

        <Section title="Price rounding">
          <p className="text-xs text-white/40 mb-3">
            Unit prices are rounded up to the nearest increment. Different rules
            for cheap vs expensive items keep small prices precise and big
            prices clean.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Threshold (currency units)">
              <TextInput
                type="number" min={0} step="0.01"
                value={String(form.roundingThreshold ?? 70)}
                onChange={(e) => update("roundingThreshold", Number(e.target.value) || 0)}
              />
            </Field>
            <Field label="Increment below threshold">
              <TextInput
                type="number" min={0} step="0.0001"
                value={String(form.roundingIncrementBelow ?? 0.01)}
                onChange={(e) => update("roundingIncrementBelow", Number(e.target.value) || 0)}
              />
            </Field>
            <Field label="Increment at/above threshold">
              <TextInput
                type="number" min={0} step="0.0001"
                value={String(form.roundingIncrementAbove ?? 1)}
                onChange={(e) => update("roundingIncrementAbove", Number(e.target.value) || 0)}
              />
            </Field>
          </div>
        </Section>

        <Section title="Number formats & payment terms">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <Section title="Quote terms & conditions">
          <p className="text-xs text-white/40 mb-2">
            One term per line — printed as a numbered list on quote PDFs. Validity,
            payment schedule, delivery lead time, and the exchange-rate clause are
            generated automatically from each quote and printed ahead of these.
          </p>
          <Field label="Terms & conditions">
            <TextArea
              rows={6}
              value={form.quoteTerms ?? ""}
              onChange={(e) => update("quoteTerms", e.target.value)}
              placeholder={DEFAULT_QUOTE_TERMS}
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
