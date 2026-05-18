"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Field, Select, TextArea, TextInput } from "../_components/Field";
import { Button } from "../_components/Button";
import { CUSTOMER_STATUSES, CUSTOMER_TYPES } from "@/lib/validators";

export interface CustomerFormValues {
  id?: string;
  type?: "COMPANY" | "INDIVIDUAL";
  name?: string;
  legalName?: string | null;
  taxId?: string | null;
  industry?: string | null;
  website?: string | null;
  email?: string | null;
  phone?: string | null;
  status?: string;
  tags?: string[];
  notes?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  region?: string | null;
  postalCode?: string | null;
  country?: string | null;
}

export default function CustomerForm({
  initial,
  onClose,
  onSaved,
}: {
  initial?: CustomerFormValues;
  onClose: () => void;
  onSaved?: () => void;
}) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);
  const [form, setForm] = useState({
    type: initial?.type ?? "COMPANY",
    name: initial?.name ?? "",
    legalName: initial?.legalName ?? "",
    taxId: initial?.taxId ?? "",
    industry: initial?.industry ?? "",
    website: initial?.website ?? "",
    email: initial?.email ?? "",
    phone: initial?.phone ?? "",
    status: initial?.status ?? "PROSPECT",
    tagsInput: (initial?.tags ?? []).join(", "),
    notes: initial?.notes ?? "",
    addressLine1: initial?.addressLine1 ?? "",
    addressLine2: initial?.addressLine2 ?? "",
    city: initial?.city ?? "",
    region: initial?.region ?? "",
    postalCode: initial?.postalCode ?? "",
    country: initial?.country ?? "Ghana",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isCompany = form.type === "COMPANY";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const payload = {
      type: form.type,
      name: form.name.trim(),
      email: form.email.trim() || null,
      phone: form.phone.trim() || null,
      status: form.status,
      tags: form.tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
      notes: form.notes.trim() || null,
      legalName: isCompany ? form.legalName.trim() || null : null,
      taxId: isCompany ? form.taxId.trim() || null : null,
      industry: isCompany ? form.industry.trim() || null : null,
      website: isCompany ? form.website.trim() || null : null,
      addressLine1: form.addressLine1.trim() || null,
      addressLine2: form.addressLine2.trim() || null,
      city: form.city.trim() || null,
      region: form.region.trim() || null,
      postalCode: form.postalCode.trim() || null,
      country: form.country.trim() || null,
    };
    const url = isEdit ? `/api/admin/customers/${initial?.id}` : "/api/admin/customers";
    const method = isEdit ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Could not save customer.");
      return;
    }
    onSaved?.();
    router.refresh();
    onClose();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Type" required>
          <Select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as typeof form.type })}
          >
            {CUSTOMER_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </Select>
        </Field>
        <Field label={isCompany ? "Company name" : "Full name"} required>
          <TextInput
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </Field>

        {isCompany && (
          <>
            <Field label="Legal name" hint="As registered (e.g. Acme Holdings Ltd.)">
              <TextInput
                value={form.legalName}
                onChange={(e) => setForm({ ...form, legalName: e.target.value })}
              />
            </Field>
            <Field label="Tax ID / TIN">
              <TextInput
                value={form.taxId}
                onChange={(e) => setForm({ ...form, taxId: e.target.value })}
              />
            </Field>
            <Field label="Industry">
              <TextInput
                value={form.industry}
                onChange={(e) => setForm({ ...form, industry: e.target.value })}
              />
            </Field>
            <Field label="Website">
              <TextInput
                placeholder="https://"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
              />
            </Field>
          </>
        )}

        <Field label="Email">
          <TextInput
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </Field>
        <Field label="Phone">
          <TextInput
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </Field>

        <Field label="Status">
          <Select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            {CUSTOMER_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
        </Field>
        <Field label="Tags" hint="Comma-separated">
          <TextInput
            placeholder="enterprise, government"
            value={form.tagsInput}
            onChange={(e) => setForm({ ...form, tagsInput: e.target.value })}
          />
        </Field>
      </div>

      <fieldset className="space-y-3 border-t border-white/10 pt-4">
        <legend className="text-xs uppercase tracking-wide text-white/40 mb-2">
          Address
        </legend>
        <Field label="Address line 1">
          <TextInput
            value={form.addressLine1}
            onChange={(e) => setForm({ ...form, addressLine1: e.target.value })}
          />
        </Field>
        <Field label="Address line 2">
          <TextInput
            value={form.addressLine2}
            onChange={(e) => setForm({ ...form, addressLine2: e.target.value })}
          />
        </Field>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Field label="City">
            <TextInput
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
          </Field>
          <Field label="Region">
            <TextInput
              value={form.region}
              onChange={(e) => setForm({ ...form, region: e.target.value })}
            />
          </Field>
          <Field label="Postal code">
            <TextInput
              value={form.postalCode}
              onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
            />
          </Field>
          <Field label="Country">
            <TextInput
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
            />
          </Field>
        </div>
      </fieldset>

      <Field label="Notes">
        <TextArea
          rows={4}
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
      </Field>

      {error && (
        <div className="rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-200 text-sm px-3 py-2">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
        <Button type="submit" disabled={submitting || !form.name.trim()}>
          {submitting ? "Saving…" : isEdit ? "Save changes" : "Create customer"}
        </Button>
      </div>
    </form>
  );
}
