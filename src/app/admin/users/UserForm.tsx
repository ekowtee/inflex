"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Field, Select, TextInput } from "../_components/Field";
import { Button } from "../_components/Button";

const ROLES = [
  { value: "DIRECTOR", label: "Director" },
  { value: "FINANCE", label: "Finance" },
  { value: "SALES", label: "Sales" },
];

const KINDS = [
  { value: "INTERNAL", label: "Internal (platform user)" },
  { value: "EXTERNAL", label: "External (record only — no login)" },
];

export interface UserFormValues {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  kind?: string;
  isActive?: boolean;
}

export default function UserForm({
  initial,
  onClose,
}: {
  initial?: UserFormValues;
  onClose: () => void;
}) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    email: initial?.email ?? "",
    role: initial?.role ?? "FINANCE",
    kind: initial?.kind ?? "INTERNAL",
    isActive: initial?.isActive ?? true,
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isInternal = form.kind === "INTERNAL";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!isEdit && isInternal && form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setSubmitting(true);
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role,
      kind: form.kind,
      isActive: form.isActive,
      ...(form.password ? { password: form.password } : {}),
    };
    const url = isEdit ? `/api/admin/users/${initial?.id}` : "/api/admin/users";
    const method = isEdit ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Could not save user.");
      return;
    }
    router.refresh();
    onClose();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Full name" required>
          <TextInput
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </Field>
        <Field label="Email" required>
          <TextInput
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </Field>
        <Field label="User type" required>
          <Select
            value={form.kind}
            onChange={(e) => setForm({ ...form, kind: e.target.value })}
          >
            {KINDS.map((k) => (
              <option key={k.value} value={k.value}>
                {k.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Role" required>
          <Select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </Select>
        </Field>
        {isInternal && (
          <Field
            label={isEdit ? "New password (leave blank to keep current)" : "Password"}
            required={!isEdit}
            hint="Minimum 8 characters"
          >
            <TextInput
              type="password"
              autoComplete="new-password"
              required={!isEdit}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </Field>
        )}
      </div>

      {isInternal && (
        <label className="inline-flex items-center gap-2 text-sm text-white/80">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            className="rounded border-white/20 bg-white/5 text-[#BD2E25] focus:ring-[#BD2E25]"
          />
          Account is active
        </label>
      )}

      <p className="text-xs text-white/40 leading-relaxed">
        <strong className="text-white/60">Internal</strong> users log in and operate
        the platform (Director / Finance / Sales).{" "}
        <strong className="text-white/60">External</strong> users are kept as
        records — they don't get a password and don't appear in pickers like
        the solution architect dropdown.
      </p>

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
          {submitting ? "Saving…" : isEdit ? "Save changes" : "Create user"}
        </Button>
      </div>
    </form>
  );
}
