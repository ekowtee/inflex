"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Briefcase, Plane } from "lucide-react";
import { Field, Select, TextArea, TextInput } from "../_components/Field";
import { Button } from "../_components/Button";
import { formatMoney } from "@/lib/serialize";
import {
  priceLine,
  calculateQuoteTotals,
  type LineKind,
  type PriceLineContext,
} from "@/lib/pricing";
import {
  defaultIndirectDays,
  priceLabour,
  priceOutstation,
  type LabourRoleRef,
} from "@/lib/calculators";

interface CustomerOpt {
  id: string;
  name: string;
  company: string | null;
}
interface TierOpt {
  id: string;
  name: string;
  pct: number;
  carriesFinanceCharge: boolean;
}
interface WhtOpt {
  id: string;
  code: string;
  label: string;
  rate: number;
  isDefault: boolean;
}
interface UserOpt {
  id: string;
  name: string;
  role: string;
}
interface ReferenceSettings {
  currency: string;
  vatRegistered: boolean;
  nonVatTaxApplied: boolean;
  nonVatTaxLabel: string;
  defaultAnnualInterestRatePct: number;
  defaultProjectCycleWeeks: number;
  defaultAdvancePaymentPct: number;
  defaultFxUsdGhsRate: number | null;
  defaultFxRateSource: string;
}
interface QuoteReference {
  markupTiers: TierOpt[];
  whtCategories: WhtOpt[];
  architects: UserOpt[];
  labourRoles: LabourRoleRef[];
  settings: ReferenceSettings;
}

interface LabourEntryDraft {
  roleId: string;
  days: number;
  indirectDays: number;
}

interface OutstationEntryDraft {
  roleId: string;
  staffCount: number;
  days: number;
  trips: number;
}

interface LineDraft {
  description: string;
  kind: LineKind;
  category: string;
  partNumber: string;
  specs: string;
  quantity: number;
  landedCost: number;
  landedCostCurrency: string;
  markupTierId: string;
  markupPct: number;
  surchargePct: number;
  discountPct: number;
  recurring: string;
  labourEntries: LabourEntryDraft[];
  outstationEntries: OutstationEntryDraft[];
}

export interface QuoteBuilderInitial {
  id?: string;
  customerId?: string;
  status?: string;
  projectTitle?: string | null;
  attentionTo?: string | null;
  solutionArchitectId?: string | null;
  scopeOfWork?: string | null;
  notes?: string | null;
  currency?: string;
  validUntil?: string | null;
  fxRate?: number | null;
  fxRateSource?: string | null;
  fxRateDate?: string | null;
  annualInterestRatePct?: number;
  projectCycleWeeks?: number;
  advancePaymentPct?: number;
  whtCategoryId?: string | null;
  whtCustomPct?: number | null;
  vatApplied?: boolean;
  nonVatTaxApplied?: boolean;
  revision?: number;
  isLocked?: boolean;
  items?: LineDraft[];
}

const KIND_OPTIONS: { value: LineKind; label: string }[] = [
  { value: "PRODUCT", label: "Product" },
  { value: "LABOUR", label: "Labour" },
  { value: "OUTSTATION", label: "Outstation" },
  { value: "FINANCE_CHARGE", label: "Finance charge (explicit)" },
  { value: "OTHER", label: "Other" },
];

const CATEGORY_OPTIONS = [
  { value: "HARDWARE", label: "Hardware" },
  { value: "SOFTWARE_LICENSING", label: "Software & Licensing" },
  { value: "CONSULTING", label: "Consulting" },
  { value: "MANAGED_SERVICES", label: "Managed Services" },
  { value: "TRAINING", label: "Training" },
  { value: "OTHER", label: "Other" },
];

const RECURRING_OPTIONS = [
  { value: "NONE", label: "One-off" },
  { value: "MONTHLY", label: "Monthly" },
  { value: "QUARTERLY", label: "Quarterly" },
  { value: "ANNUALLY", label: "Annually" },
];

const STATUS_OPTIONS = ["DRAFT", "PENDING_APPROVAL", "SENT", "ACCEPTED", "DECLINED", "EXPIRED"];

function newLine(defaults?: Partial<LineDraft>): LineDraft {
  return {
    description: "",
    kind: "PRODUCT",
    category: "HARDWARE",
    partNumber: "",
    specs: "",
    quantity: 1,
    landedCost: 0,
    landedCostCurrency: "GHS",
    markupTierId: "",
    markupPct: 0,
    surchargePct: 0,
    discountPct: 0,
    recurring: "NONE",
    labourEntries: [],
    outstationEntries: [],
    ...defaults,
  };
}

function newLabourLine(opts: { description: string; markupTierId: string; markupPct: number }) {
  return newLine({
    kind: "LABOUR",
    category: "CONSULTING",
    description: opts.description,
    markupTierId: opts.markupTierId,
    markupPct: opts.markupPct,
    labourEntries: [],
  });
}

function newOutstationLine(opts: { description: string; markupTierId: string; markupPct: number }) {
  return newLine({
    kind: "OUTSTATION",
    category: "CONSULTING",
    description: opts.description,
    markupTierId: opts.markupTierId,
    markupPct: opts.markupPct,
    outstationEntries: [],
  });
}

export default function QuoteBuilder({
  initial,
  customers,
  onClose,
}: {
  initial?: QuoteBuilderInitial;
  customers: CustomerOpt[];
  onClose: () => void;
}) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);

  const [reference, setReference] = useState<QuoteReference | null>(null);
  const [referenceError, setReferenceError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/quotes/reference")
      .then((r) => r.json())
      .then((data) => setReference(data))
      .catch(() => setReferenceError("Could not load markup tiers / WHT categories."));
  }, []);

  const defaultWht = reference?.whtCategories.find((c) => c.isDefault);
  const [header, setHeader] = useState({
    customerId: initial?.customerId ?? "",
    status: initial?.status ?? "DRAFT",
    projectTitle: initial?.projectTitle ?? "",
    attentionTo: initial?.attentionTo ?? "",
    solutionArchitectId: initial?.solutionArchitectId ?? "",
    scopeOfWork: initial?.scopeOfWork ?? "",
    notes: initial?.notes ?? "",
    currency: initial?.currency ?? "GHS",
    validUntil: initial?.validUntil
      ? new Date(initial.validUntil).toISOString().slice(0, 10)
      : "",
    fxRate: initial?.fxRate ?? null,
    fxRateSource: initial?.fxRateSource ?? "cedirates.com",
    fxRateDate: initial?.fxRateDate
      ? new Date(initial.fxRateDate).toISOString().slice(0, 10)
      : "",
    annualInterestRatePct: initial?.annualInterestRatePct ?? 22,
    projectCycleWeeks: initial?.projectCycleWeeks ?? 8,
    advancePaymentPct: initial?.advancePaymentPct ?? 0,
    whtCategoryId: initial?.whtCategoryId ?? "",
    whtCustomPct: initial?.whtCustomPct ?? null,
    vatApplied: initial?.vatApplied ?? false,
    nonVatTaxApplied: initial?.nonVatTaxApplied ?? true,
    revisionReason: "",
  });

  const [items, setItems] = useState<LineDraft[]>(
    initial?.items?.length ? initial.items : [newLine()]
  );

  // When reference data arrives, fill in sensible defaults that initial didn't already cover.
  useEffect(() => {
    if (!reference) return;
    setHeader((h) => ({
      ...h,
      customerId: h.customerId || customers[0]?.id || "",
      currency: h.currency || reference.settings.currency,
      annualInterestRatePct:
        initial?.annualInterestRatePct ?? Number(reference.settings.defaultAnnualInterestRatePct),
      projectCycleWeeks:
        initial?.projectCycleWeeks ?? Number(reference.settings.defaultProjectCycleWeeks),
      advancePaymentPct:
        initial?.advancePaymentPct ?? Number(reference.settings.defaultAdvancePaymentPct),
      fxRate:
        h.fxRate ?? (reference.settings.defaultFxUsdGhsRate != null
          ? Number(reference.settings.defaultFxUsdGhsRate)
          : null),
      fxRateSource: h.fxRateSource || reference.settings.defaultFxRateSource,
      whtCategoryId: h.whtCategoryId || (defaultWht?.id ?? ""),
      vatApplied: initial?.vatApplied ?? reference.settings.vatRegistered,
      nonVatTaxApplied:
        initial?.nonVatTaxApplied ?? !reference.settings.vatRegistered,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reference]);

  function updateHeader<K extends keyof typeof header>(k: K, v: (typeof header)[K]) {
    setHeader((h) => ({ ...h, [k]: v }));
  }

  function updateItem(idx: number, patch: Partial<LineDraft>) {
    setItems((arr) =>
      arr.map((it, i) => (i === idx ? recomputeIfCalculated({ ...it, ...patch }) : it))
    );
  }

  function addItem(kind: LineKind = "PRODUCT") {
    setItems((arr) => [...arr, newLine({ kind })]);
  }

  function addLabourLine() {
    if (!reference) return;
    const tier = reference.markupTiers.find((t) => t.name === "Labour");
    setItems((arr) => [
      ...arr,
      newLabourLine({
        description: "Professional Services",
        markupTierId: tier?.id ?? "",
        markupPct: tier ? Number(tier.pct) : 100,
      }),
    ]);
  }

  function addOutstationLine() {
    if (!reference) return;
    const tier = reference.markupTiers.find((t) => t.name === "Outstation");
    setItems((arr) => [
      ...arr,
      newOutstationLine({
        description: "Outstation expenses",
        markupTierId: tier?.id ?? "",
        markupPct: tier ? Number(tier.pct) : 25,
      }),
    ]);
  }

  function removeItem(idx: number) {
    setItems((arr) => arr.filter((_, i) => i !== idx));
  }

  /**
   * For LABOUR / OUTSTATION lines that have entries, recompute landedCost +
   * specs from the entries so the line stays in sync with the calculator.
   */
  function recomputeIfCalculated(line: LineDraft): LineDraft {
    if (!reference) return line;
    if (line.kind === "LABOUR" && line.labourEntries.length > 0) {
      const r = priceLabour(line.labourEntries, reference.labourRoles);
      return {
        ...line,
        landedCost: r.landedCost,
        landedCostCurrency: header.currency,
        specs: r.specsMarkdown,
      };
    }
    if (line.kind === "OUTSTATION" && line.outstationEntries.length > 0) {
      const r = priceOutstation(line.outstationEntries, reference.labourRoles);
      return {
        ...line,
        landedCost: r.landedCost,
        landedCostCurrency: header.currency,
        specs: r.specsMarkdown,
      };
    }
    return line;
  }

  // Live preview totals
  type Preview =
    | { ok: true; priced: ReturnType<typeof priceLine>[]; aggregate: ReturnType<typeof calculateQuoteTotals> }
    | { ok: false; error: string };

  const livePreview: Preview | null = useMemo(() => {
    if (!reference) return null;
    const ctx: PriceLineContext = {
      quoteCurrency: header.currency,
      fxRate: header.fxRate ?? null,
      annualInterestRatePct: Number(header.annualInterestRatePct) || 0,
      projectCycleWeeks: Number(header.projectCycleWeeks) || 0,
      advancePaymentPct: Number(header.advancePaymentPct) || 0,
      whtPct:
        header.whtCustomPct != null
          ? Number(header.whtCustomPct)
          : Number(
              reference.whtCategories.find((c) => c.id === header.whtCategoryId)?.rate ?? 0
            ),
      rounding: { threshold: 70, incrementBelow: 0.01, incrementAbove: 1 },
    };
    const tierMap = new Map(reference.markupTiers.map((t) => [t.id, t]));
    try {
      const priced = items.map((item) => {
        const tier = item.markupTierId ? tierMap.get(item.markupTierId) : undefined;
        const carriesFinanceCharge =
          item.kind === "FINANCE_CHARGE"
            ? false
            : tier
            ? tier.carriesFinanceCharge
            : item.kind === "PRODUCT";
        const r = priceLine(
          {
            kind: item.kind,
            quantity: Number(item.quantity) || 0,
            landedCost: Number(item.landedCost) || 0,
            landedCostCurrency: item.landedCostCurrency || header.currency,
            markupPct: Number(item.markupPct) || 0,
            surchargePct: Number(item.surchargePct) || 0,
            discountPct: Number(item.discountPct) || 0,
            carriesFinanceCharge,
          },
          ctx
        );
        return r;
      });
      const aggregate = calculateQuoteTotals({
        lines: priced.map((p, i) => ({
          kind: items[i].kind,
          finalLineTotalExclTax: p.finalLineTotalExclTax,
          lineGpAmount: p.lineGpAmount,
        })),
        vatApplied: header.vatApplied,
        vatRates: { standardPct: 15, nhilPct: 2.5, getfundPct: 2.5 },
        nonVatTaxApplied: header.nonVatTaxApplied,
        nonVatTaxOnGoodsPct: 3,
        nonVatTaxOnServicesPct: 0,
      });
      return { ok: true, priced, aggregate };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : "Pricing error" };
    }
  }, [items, header, reference]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!header.customerId) {
      setError("Select a customer.");
      return;
    }
    if (items.length === 0 || items.every((i) => !i.description.trim())) {
      setError("Add at least one line item with a description.");
      return;
    }
    if (initial?.isLocked && !header.revisionReason.trim()) {
      setError("This quote has been sent or accepted — please give a reason for the edit.");
      return;
    }

    setSubmitting(true);
    const payload = {
      customerId: header.customerId,
      status: header.status,
      projectTitle: header.projectTitle || null,
      attentionTo: header.attentionTo || null,
      solutionArchitectId: header.solutionArchitectId || null,
      scopeOfWork: header.scopeOfWork || null,
      notes: header.notes || null,
      currency: header.currency,
      validUntil: header.validUntil || null,
      fxRate: header.fxRate,
      fxRateSource: header.fxRateSource || null,
      fxRateDate: header.fxRateDate || null,
      annualInterestRatePct: Number(header.annualInterestRatePct) || 0,
      projectCycleWeeks: Number(header.projectCycleWeeks) || 0,
      advancePaymentPct: Number(header.advancePaymentPct) || 0,
      whtCategoryId: header.whtCategoryId || null,
      whtCustomPct: header.whtCustomPct,
      vatApplied: header.vatApplied,
      nonVatTaxApplied: header.nonVatTaxApplied,
      revisionReason: header.revisionReason || null,
      items: items
        .filter((i) => i.description.trim())
        .map((i, idx) => ({
          description: i.description,
          kind: i.kind,
          category: i.category,
          partNumber: i.partNumber || null,
          specs: i.specs || null,
          quantity: Number(i.quantity) || 0,
          landedCost: Number(i.landedCost) || 0,
          landedCostCurrency: i.landedCostCurrency || header.currency,
          markupTierId: i.markupTierId || null,
          markupPct: Number(i.markupPct) || 0,
          surchargePct: Number(i.surchargePct) || 0,
          discountPct: Number(i.discountPct) || 0,
          recurring: i.recurring,
          sortOrder: idx,
          labourEntries: i.kind === "LABOUR" ? i.labourEntries : [],
          outstationEntries: i.kind === "OUTSTATION" ? i.outstationEntries : [],
        })),
    };
    const url = isEdit ? `/api/admin/quotes/${initial!.id}` : "/api/admin/quotes";
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

  if (referenceError) {
    return (
      <div className="rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-200 text-sm px-3 py-2">
        {referenceError}
      </div>
    );
  }
  if (!reference) {
    return <div className="text-white/60 text-sm p-6">Loading quote builder…</div>;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* ---------- Header ---------- */}
      <Section title="Customer & project">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Customer" required>
            <Select
              value={header.customerId}
              onChange={(e) => updateHeader("customerId", e.target.value)}
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
          <Field label="Status">
            <Select value={header.status} onChange={(e) => updateHeader("status", e.target.value)}>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s.replace(/_/g, " ")}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Project title" hint="Bold heading on the PDF">
            <TextInput
              value={header.projectTitle}
              onChange={(e) => updateHeader("projectTitle", e.target.value)}
              placeholder="BLU TELECOM CALL CENTER PCs"
            />
          </Field>
          <Field label="Attention to" hint='e.g. "The Head, Procurement — Mr Sampson Nartey-Yoe"'>
            <TextInput
              value={header.attentionTo}
              onChange={(e) => updateHeader("attentionTo", e.target.value)}
            />
          </Field>
          <Field label="Solution architect">
            <Select
              value={header.solutionArchitectId}
              onChange={(e) => updateHeader("solutionArchitectId", e.target.value)}
            >
              <option value="">— None —</option>
              {reference.architects.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.role})
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Valid until">
            <TextInput
              type="date"
              value={header.validUntil}
              onChange={(e) => updateHeader("validUntil", e.target.value)}
            />
          </Field>
        </div>
        <Field label="Scope of work">
          <TextArea
            rows={3}
            value={header.scopeOfWork}
            onChange={(e) => updateHeader("scopeOfWork", e.target.value)}
          />
        </Field>
      </Section>

      <Section title="Pricing controls">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Currency">
            <TextInput
              value={header.currency}
              onChange={(e) => updateHeader("currency", e.target.value.toUpperCase())}
              maxLength={3}
            />
          </Field>
          <Field label="FX rate (USD → GHS)" hint={`Source: ${header.fxRateSource ?? "cedirates.com"}`}>
            <TextInput
              type="number"
              step="0.0001"
              value={header.fxRate != null ? String(header.fxRate) : ""}
              onChange={(e) =>
                updateHeader("fxRate", e.target.value === "" ? null : Number(e.target.value))
              }
            />
          </Field>
          <Field label="FX rate date">
            <TextInput
              type="date"
              value={header.fxRateDate}
              onChange={(e) => updateHeader("fxRateDate", e.target.value)}
            />
          </Field>
          <Field label="Annual interest rate (%)" hint="Working-capital cost">
            <TextInput
              type="number" min={0} step="0.01"
              value={String(header.annualInterestRatePct)}
              onChange={(e) =>
                updateHeader("annualInterestRatePct", Number(e.target.value) || 0)
              }
            />
          </Field>
          <Field label="Project cycle (weeks)">
            <TextInput
              type="number" min={0} step="1"
              value={String(header.projectCycleWeeks)}
              onChange={(e) =>
                updateHeader("projectCycleWeeks", Number(e.target.value) || 0)
              }
            />
          </Field>
          <Field label="Advance payment (%)" hint="100 = no finance charge">
            <TextInput
              type="number" min={0} max={100} step="0.01"
              value={String(header.advancePaymentPct)}
              onChange={(e) =>
                updateHeader("advancePaymentPct", Number(e.target.value) || 0)
              }
            />
          </Field>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Withholding tax">
            <Select
              value={header.whtCategoryId}
              onChange={(e) => {
                updateHeader("whtCategoryId", e.target.value);
                updateHeader("whtCustomPct", null);
              }}
            >
              <option value="">— None —</option>
              {reference.whtCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="WHT custom rate (%)" hint="Overrides the category rate">
            <TextInput
              type="number" min={0} max={99} step="0.01"
              value={header.whtCustomPct != null ? String(header.whtCustomPct) : ""}
              onChange={(e) =>
                updateHeader(
                  "whtCustomPct",
                  e.target.value === "" ? null : Number(e.target.value)
                )
              }
            />
          </Field>
          <div className="space-y-2 pt-6">
            <label className="inline-flex items-center gap-2 text-sm text-white/80">
              <input
                type="checkbox"
                checked={header.vatApplied}
                onChange={(e) => updateHeader("vatApplied", e.target.checked)}
                className="rounded border-white/20 bg-white/5 text-[#BD2E25] focus:ring-[#BD2E25]"
              />
              Apply VAT (Inflexions is VAT-registered)
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-white/80">
              <input
                type="checkbox"
                checked={header.nonVatTaxApplied}
                disabled={header.vatApplied}
                onChange={(e) => updateHeader("nonVatTaxApplied", e.target.checked)}
                className="rounded border-white/20 bg-white/5 text-[#BD2E25] focus:ring-[#BD2E25]"
              />
              Apply non-VAT sales tax
            </label>
          </div>
        </div>
      </Section>

      {/* ---------- Line items ---------- */}
      <Section title="Line items">
        <div className="space-y-3">
          {items.map((item, idx) => {
            const preview = livePreview?.ok ? livePreview.priced[idx] : null;
            return (
              <LineRow
                key={idx}
                idx={idx}
                item={item}
                preview={preview}
                tiers={reference.markupTiers}
                labourRoles={reference.labourRoles}
                currency={header.currency}
                onChange={(patch) => updateItem(idx, patch)}
                onRemove={() => removeItem(idx)}
              />
            );
          })}
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="secondary" size="sm" onClick={() => addItem("PRODUCT")}>
            <Plus className="w-3.5 h-3.5" /> Product line
          </Button>
          <Button type="button" variant="secondary" size="sm" onClick={addLabourLine}>
            <Briefcase className="w-3.5 h-3.5" /> Labour calculator
          </Button>
          <Button type="button" variant="secondary" size="sm" onClick={addOutstationLine}>
            <Plane className="w-3.5 h-3.5" /> Outstation calculator
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => addItem("OTHER")}>
            <Plus className="w-3.5 h-3.5" /> Other
          </Button>
        </div>
      </Section>

      {/* ---------- Live totals ---------- */}
      {livePreview?.ok && (
        <Section title="Live preview">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <Tile label="Subtotal" value={formatMoney(livePreview.aggregate.subtotal, header.currency)} />
            {header.vatApplied && livePreview.aggregate.vatBreakdown && (
              <Tile
                label={`VAT (${livePreview.aggregate.vatBreakdown.effectivePct.toFixed(2)}%)`}
                value={formatMoney(livePreview.aggregate.vatAmount, header.currency)}
              />
            )}
            {!header.vatApplied && header.nonVatTaxApplied && (
              <Tile
                label={reference.settings.nonVatTaxLabel}
                value={formatMoney(livePreview.aggregate.nonVatTaxAmount, header.currency)}
              />
            )}
            <Tile
              label="Total"
              value={formatMoney(livePreview.aggregate.total, header.currency)}
              emphasis
            />
            <Tile
              label={`GP (${livePreview.aggregate.totalGpMarginPct.toFixed(1)}%)`}
              value={formatMoney(livePreview.aggregate.totalGp, header.currency)}
              tone="margin"
            />
          </div>
        </Section>
      )}
      {livePreview && !livePreview.ok && (
        <div className="rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-200 text-sm px-3 py-2">
          {livePreview.error}
        </div>
      )}

      {/* ---------- Notes + revision reason ---------- */}
      <Section title="Internal notes">
        <Field label="Notes">
          <TextArea
            rows={3}
            value={header.notes}
            onChange={(e) => updateHeader("notes", e.target.value)}
          />
        </Field>
        {initial?.isLocked && (
          <Field
            label="Revision reason"
            hint={`This quote is at revision ${initial.revision}. Editing increments the counter.`}
            required
          >
            <TextInput
              value={header.revisionReason}
              onChange={(e) => updateHeader("revisionReason", e.target.value)}
              placeholder="e.g. Updated USD rate to today's, swapped Cisco SKU"
            />
          </Field>
        )}
      </Section>

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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.02] p-5 space-y-4">
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      {children}
    </section>
  );
}

function Tile({
  label,
  value,
  emphasis,
  tone,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
  tone?: "margin";
}) {
  return (
    <div
      className={`rounded-lg border p-3 ${
        tone === "margin"
          ? "border-emerald-500/30 bg-emerald-500/10"
          : emphasis
          ? "border-[#BD2E25]/40 bg-[#BD2E25]/10"
          : "border-white/10 bg-white/[0.04]"
      }`}
    >
      <p className="text-xs text-white/60 uppercase tracking-wide">{label}</p>
      <p
        className={`mt-1 font-semibold ${
          tone === "margin" ? "text-emerald-200" : emphasis ? "text-white" : "text-white/90"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function LineRow({
  idx,
  item,
  preview,
  tiers,
  labourRoles,
  currency,
  onChange,
  onRemove,
}: {
  idx: number;
  item: LineDraft;
  preview: ReturnType<typeof priceLine> | null;
  tiers: TierOpt[];
  labourRoles: LabourRoleRef[];
  currency: string;
  onChange: (patch: Partial<LineDraft>) => void;
  onRemove: () => void;
}) {
  const isCalculated =
    (item.kind === "LABOUR" && item.labourEntries.length > 0) ||
    (item.kind === "OUTSTATION" && item.outstationEntries.length > 0);
  const isCalcKind = item.kind === "LABOUR" || item.kind === "OUTSTATION";
  // Open by default when the line is a calculator with no entries yet — pushes
  // the rep to fill them in.
  const [expanded, setExpanded] = useState(isCalcKind && !isCalculated);

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start">
        <Select
          value={item.kind}
          onChange={(e) => onChange({ kind: e.target.value as LineKind })}
          className="md:col-span-2"
        >
          {KIND_OPTIONS.map((k) => (
            <option key={k.value} value={k.value}>
              {k.label}
            </option>
          ))}
        </Select>
        <TextInput
          placeholder={`Line ${idx + 1} description`}
          value={item.description}
          onChange={(e) => onChange({ description: e.target.value })}
          className="md:col-span-5"
        />
        <TextInput
          type="number" min={0} step="0.01"
          placeholder="Qty"
          value={String(item.quantity)}
          onChange={(e) => onChange({ quantity: Number(e.target.value) || 0 })}
          className="md:col-span-1 text-right"
        />
        <TextInput
          type="number" min={0} step="0.01"
          placeholder="Landed cost"
          value={String(item.landedCost)}
          onChange={(e) => onChange({ landedCost: Number(e.target.value) || 0 })}
          className="md:col-span-2 text-right"
          disabled={isCalculated}
          title={isCalculated ? "Computed from calculator entries below" : undefined}
        />
        <div className="md:col-span-2 flex items-center justify-end gap-2">
          {preview && (
            <span className="text-sm text-white/80 whitespace-nowrap">
              {formatMoney(preview.finalLineTotalExclTax, currency)}
            </span>
          )}
          <button
            type="button"
            onClick={onRemove}
            className="text-white/40 hover:text-rose-400"
            aria-label="Remove"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="text-xs text-white/50 hover:text-white"
      >
        {expanded
          ? "▾ Hide details"
          : isCalcKind
          ? `▸ ${item.kind === "LABOUR" ? "Labour" : "Outstation"} calculator, markup, specs`
          : "▸ Details, markup, specs"}
      </button>

      {expanded && (
        <div className="space-y-3 pt-2 border-t border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Field label="Category">
              <Select value={item.category} onChange={(e) => onChange({ category: e.target.value })}>
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Part number">
              <TextInput
                value={item.partNumber}
                onChange={(e) => onChange({ partNumber: e.target.value })}
              />
            </Field>
            <Field label="Cost currency">
              <TextInput
                value={item.landedCostCurrency}
                onChange={(e) => onChange({ landedCostCurrency: e.target.value.toUpperCase() })}
                maxLength={3}
              />
            </Field>
            <Field label="Recurring">
              <Select
                value={item.recurring}
                onChange={(e) => onChange({ recurring: e.target.value })}
              >
                {RECURRING_OPTIONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Field label="Markup tier">
              <Select
                value={item.markupTierId}
                onChange={(e) => {
                  const tier = tiers.find((t) => t.id === e.target.value);
                  onChange({
                    markupTierId: e.target.value,
                    markupPct: tier ? Number(tier.pct) : item.markupPct,
                  });
                }}
              >
                <option value="">— Custom —</option>
                {tiers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({Number(t.pct).toFixed(2)}%)
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Markup (%)">
              <TextInput
                type="number" min={0} step="0.01"
                value={String(item.markupPct)}
                onChange={(e) => onChange({ markupPct: Number(e.target.value) || 0 })}
              />
            </Field>
            <Field label="Surcharge (%)">
              <TextInput
                type="number" min={0} step="0.01"
                value={String(item.surchargePct)}
                onChange={(e) => onChange({ surchargePct: Number(e.target.value) || 0 })}
              />
            </Field>
            <Field label="Discount (%)">
              <TextInput
                type="number" min={0} max={100} step="0.01"
                value={String(item.discountPct)}
                onChange={(e) => onChange({ discountPct: Number(e.target.value) || 0 })}
              />
            </Field>
          </div>
          {item.kind === "LABOUR" && (
            <LabourCalcEditor
              entries={item.labourEntries}
              roles={labourRoles}
              currency={currency}
              onChange={(labourEntries) => onChange({ labourEntries })}
            />
          )}
          {item.kind === "OUTSTATION" && (
            <OutstationCalcEditor
              entries={item.outstationEntries}
              roles={labourRoles}
              currency={currency}
              onChange={(outstationEntries) => onChange({ outstationEntries })}
            />
          )}
          {!isCalcKind && (
            <Field label="Specs (markdown)" hint="Indented spec block under the line on the PDF">
              <TextArea
                rows={3}
                value={item.specs}
                onChange={(e) => onChange({ specs: e.target.value })}
                placeholder="• Intel i7-14700, 32GB DDR5, 1TB NVMe&#10;• 27&quot; QHD monitor"
              />
            </Field>
          )}
          {isCalcKind && item.specs && (
            <details className="text-xs text-white/50">
              <summary className="cursor-pointer hover:text-white/80">
                ▸ Generated breakdown (auto from entries above)
              </summary>
              <pre className="mt-2 whitespace-pre-wrap text-white/60 bg-[#0f1621] border border-white/10 p-3 rounded text-[11px]">
                {item.specs}
              </pre>
            </details>
          )}
          {preview && (
            <div className="rounded-md bg-[#0f1621] border border-white/10 p-3 text-xs text-white/70 grid grid-cols-2 md:grid-cols-6 gap-3">
              <Metric label="Landed/unit" value={formatMoney(preview.unitLanded, currency)} />
              <Metric label="Finance/unit" value={formatMoney(preview.unitFinanceCharge, currency)} />
              <Metric label="WHT g/up" value={formatMoney(preview.unitWhtGrossUp, currency)} />
              <Metric label="Final/unit" value={formatMoney(preview.finalUnitPriceExclTax, currency)} />
              <Metric label="Cost total" value={formatMoney(preview.costLineTotal, currency)} />
              <Metric
                label="GP"
                value={`${formatMoney(preview.lineGpAmount, currency)} (${preview.lineGpMarginPct.toFixed(1)}%)`}
                tone="margin"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Metric({ label, value, tone }: { label: string; value: string; tone?: "margin" }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide text-white/40">{label}</p>
      <p className={`mt-0.5 ${tone === "margin" ? "text-emerald-200 font-semibold" : "text-white/90"}`}>
        {value}
      </p>
    </div>
  );
}

// ============================================================================
// Calculator editors — spec §8.1 (Labour) and §8.2 (Outstation).
// ============================================================================

function LabourCalcEditor({
  entries,
  roles,
  currency,
  onChange,
}: {
  entries: LabourEntryDraft[];
  roles: LabourRoleRef[];
  currency: string;
  onChange: (entries: LabourEntryDraft[]) => void;
}) {
  const roleMap = useMemo(() => new Map(roles.map((r) => [r.id, r])), [roles]);
  const totals = useMemo(() => priceLabour(entries, roles), [entries, roles]);

  function update(idx: number, patch: Partial<LabourEntryDraft>) {
    onChange(entries.map((e, i) => (i === idx ? { ...e, ...patch } : e)));
  }
  function remove(idx: number) {
    onChange(entries.filter((_, i) => i !== idx));
  }
  function addRow() {
    const defaultRole = roles[0];
    if (!defaultRole) return;
    onChange([...entries, { roleId: defaultRole.id, days: 1, indirectDays: 0 }]);
  }

  if (roles.length === 0) {
    return (
      <div className="rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs px-3 py-2">
        No labour roles configured. Seed the database or add roles via Prisma Studio.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wide text-white/60">
          Labour entries
        </p>
        <p className="text-xs text-white/50">
          Landed cost (computed):{" "}
          <span className="text-white font-medium">
            {formatMoney(totals.landedCost, currency)}
          </span>
        </p>
      </div>
      <div className="rounded-md bg-[#0f1621] border border-white/10 overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-white/5 text-white/50">
            <tr>
              <th className="text-left px-2 py-1.5 font-medium">Role</th>
              <th className="text-right px-2 py-1.5 font-medium w-20">Days</th>
              <th className="text-right px-2 py-1.5 font-medium w-24">Indirect</th>
              <th className="text-right px-2 py-1.5 font-medium hidden md:table-cell">Daily rate</th>
              <th className="text-right px-2 py-1.5 font-medium">Row total</th>
              <th className="w-8" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {entries.map((entry, idx) => {
              const role = roleMap.get(entry.roleId);
              const rowTotal = role
                ? (entry.days + entry.indirectDays) * role.dailyRate
                : 0;
              return (
                <tr key={idx}>
                  <td className="px-2 py-1.5">
                    <Select
                      value={entry.roleId}
                      onChange={(e) => {
                        const newRole = roleMap.get(e.target.value);
                        update(idx, {
                          roleId: e.target.value,
                          indirectDays: newRole
                            ? defaultIndirectDays(newRole.name, entry.days)
                            : entry.indirectDays,
                        });
                      }}
                    >
                      {roles.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))}
                    </Select>
                  </td>
                  <td className="px-2 py-1.5">
                    <TextInput
                      type="number" min={0} step="0.25"
                      className="text-right"
                      value={String(entry.days)}
                      onChange={(e) => {
                        const days = Number(e.target.value) || 0;
                        update(idx, {
                          days,
                          // Re-apply the indirect default whenever days changes
                          // unless the rep has typed a non-default value.
                          indirectDays: role
                            ? defaultIndirectDays(role.name, days)
                            : entry.indirectDays,
                        });
                      }}
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <TextInput
                      type="number" min={0} step="0.25"
                      className="text-right"
                      value={String(entry.indirectDays)}
                      onChange={(e) =>
                        update(idx, { indirectDays: Number(e.target.value) || 0 })
                      }
                    />
                  </td>
                  <td className="px-2 py-1.5 text-right text-white/70 hidden md:table-cell">
                    {role ? formatMoney(role.dailyRate, currency) : "—"}
                  </td>
                  <td className="px-2 py-1.5 text-right text-white/90">
                    {formatMoney(rowTotal, currency)}
                  </td>
                  <td className="px-2 py-1.5">
                    <button
                      type="button"
                      onClick={() => remove(idx)}
                      className="text-white/40 hover:text-rose-400"
                      aria-label="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        onClick={addRow}
        className="inline-flex items-center gap-1.5 text-xs text-[#BD2E25] hover:text-[#E85C53]"
      >
        <Plus className="w-3.5 h-3.5" /> Add role
      </button>
    </div>
  );
}

function OutstationCalcEditor({
  entries,
  roles,
  currency,
  onChange,
}: {
  entries: OutstationEntryDraft[];
  roles: LabourRoleRef[];
  currency: string;
  onChange: (entries: OutstationEntryDraft[]) => void;
}) {
  const rolesWithRates = useMemo(
    () => roles.filter((r) => r.outstationRate),
    [roles]
  );
  const roleMap = useMemo(
    () => new Map(rolesWithRates.map((r) => [r.id, r])),
    [rolesWithRates]
  );
  const totals = useMemo(
    () => priceOutstation(entries, rolesWithRates),
    [entries, rolesWithRates]
  );

  function update(idx: number, patch: Partial<OutstationEntryDraft>) {
    onChange(entries.map((e, i) => (i === idx ? { ...e, ...patch } : e)));
  }
  function remove(idx: number) {
    onChange(entries.filter((_, i) => i !== idx));
  }
  function addRow() {
    const defaultRole = rolesWithRates[0];
    if (!defaultRole) return;
    onChange([
      ...entries,
      { roleId: defaultRole.id, staffCount: 1, days: 1, trips: 1 },
    ]);
  }

  if (rolesWithRates.length === 0) {
    return (
      <div className="rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs px-3 py-2">
        No labour roles have outstation per-diems configured. Add them via Prisma Studio first.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wide text-white/60">
          Outstation entries
        </p>
        <p className="text-xs text-white/50">
          Landed cost (computed):{" "}
          <span className="text-white font-medium">
            {formatMoney(totals.landedCost, currency)}
          </span>
        </p>
      </div>
      <div className="rounded-md bg-[#0f1621] border border-white/10 overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-white/5 text-white/50">
            <tr>
              <th className="text-left px-2 py-1.5 font-medium">Role</th>
              <th className="text-right px-2 py-1.5 font-medium w-16">Staff</th>
              <th className="text-right px-2 py-1.5 font-medium w-20">Days</th>
              <th className="text-right px-2 py-1.5 font-medium w-16">Trips</th>
              <th className="text-right px-2 py-1.5 font-medium hidden md:table-cell">Per-diem/day</th>
              <th className="text-right px-2 py-1.5 font-medium">Row total</th>
              <th className="w-8" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {entries.map((entry, idx) => {
              const role = roleMap.get(entry.roleId);
              const perDiem = role?.outstationRate
                ? role.outstationRate.feeding +
                  role.outstationRate.localTransport +
                  role.outstationRate.outstationCharge +
                  role.outstationRate.misc
                : 0;
              const transportPerTrip = role?.outstationRate?.transportPerTrip ?? 0;
              const rowTotal =
                entry.staffCount * entry.days * perDiem +
                entry.trips * transportPerTrip;
              return (
                <tr key={idx}>
                  <td className="px-2 py-1.5">
                    <Select
                      value={entry.roleId}
                      onChange={(e) => update(idx, { roleId: e.target.value })}
                    >
                      {rolesWithRates.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))}
                    </Select>
                  </td>
                  <td className="px-2 py-1.5">
                    <TextInput
                      type="number" min={1} step="1"
                      className="text-right"
                      value={String(entry.staffCount)}
                      onChange={(e) =>
                        update(idx, { staffCount: Number(e.target.value) || 1 })
                      }
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <TextInput
                      type="number" min={0} step="0.5"
                      className="text-right"
                      value={String(entry.days)}
                      onChange={(e) =>
                        update(idx, { days: Number(e.target.value) || 0 })
                      }
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <TextInput
                      type="number" min={0} step="1"
                      className="text-right"
                      value={String(entry.trips)}
                      onChange={(e) =>
                        update(idx, { trips: Number(e.target.value) || 0 })
                      }
                    />
                  </td>
                  <td className="px-2 py-1.5 text-right text-white/70 hidden md:table-cell">
                    {formatMoney(perDiem, currency)}
                  </td>
                  <td className="px-2 py-1.5 text-right text-white/90">
                    {formatMoney(rowTotal, currency)}
                  </td>
                  <td className="px-2 py-1.5">
                    <button
                      type="button"
                      onClick={() => remove(idx)}
                      className="text-white/40 hover:text-rose-400"
                      aria-label="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        onClick={addRow}
        className="inline-flex items-center gap-1.5 text-xs text-[#BD2E25] hover:text-[#E85C53]"
      >
        <Plus className="w-3.5 h-3.5" /> Add role
      </button>
    </div>
  );
}
