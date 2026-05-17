"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Field, Select, TextArea, TextInput } from "../_components/Field";
import { Button } from "../_components/Button";

const LEAD_STATUSES = ["LEAD", "QUALIFIED", "ACTIVE", "DORMANT", "CHURNED"];
const LEAD_SOURCES = ["REFERRAL", "WEBSITE", "EVENT", "OUTBOUND", "PARTNER", "OTHER"];

export interface CustomerFormValues {
  id?: string;
  name?: string;
  company?: string | null;
  email?: string | null;
  phone?: string | null;
  leadStatus?: string;
  leadSource?: string;
  tags?: string[];
  notes?: string | null;
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
    name: initial?.name ?? "",
    company: initial?.company ?? "",
    email: initial?.email ?? "",
    phone: initial?.phone ?? "",
    leadStatus: initial?.leadStatus ?? "LEAD",
    leadSource: initial?.leadSource ?? "WEBSITE",
    tagsInput: (initial?.tags ?? []).join(", "),
    notes: initial?.notes ?? "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const payload = {
      name: form.name.trim(),
      company: form.company.trim() || null,
      email: form.email.trim() || null,
      phone: form.phone.trim() || null,
      leadStatus: form.leadStatus,
      leadSource: form.leadSource,
      tags: form.tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      notes: form.notes.trim() || null,
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
        <Field label="Name" required htmlFor="cust-name">
          <TextInput
            id="cust-name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </Field>
        <Field label="Company" htmlFor="cust-company">
          <TextInput
            id="cust-company"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
          />
        </Field>
        <Field label="Email" htmlFor="cust-email">
          <TextInput
            id="cust-email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </Field>
        <Field label="Phone" htmlFor="cust-phone">
          <TextInput
            id="cust-phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </Field>
        <Field label="Lead status" htmlFor="cust-status">
          <Select
            id="cust-status"
            value={form.leadStatus}
            onChange={(e) => setForm({ ...form, leadStatus: e.target.value })}
          >
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Lead source" htmlFor="cust-source">
          <Select
            id="cust-source"
            value={form.leadSource}
            onChange={(e) => setForm({ ...form, leadSource: e.target.value })}
          >
            {LEAD_SOURCES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <Field label="Tags" htmlFor="cust-tags" hint="Comma-separated">
        <TextInput
          id="cust-tags"
          placeholder="enterprise, government"
          value={form.tagsInput}
          onChange={(e) => setForm({ ...form, tagsInput: e.target.value })}
        />
      </Field>
      <Field label="Notes" htmlFor="cust-notes">
        <TextArea
          id="cust-notes"
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
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving…" : isEdit ? "Save changes" : "Create customer"}
        </Button>
      </div>
    </form>
  );
}
