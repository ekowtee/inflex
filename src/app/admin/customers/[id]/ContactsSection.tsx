"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Star, Mail, Phone } from "lucide-react";
import { Button } from "../../_components/Button";
import Modal from "../../_components/Modal";
import { Field, Select, TextArea, TextInput } from "../../_components/Field";
import { CONTACT_ROLES } from "@/lib/validators";

type Contact = {
  id: string;
  name: string;
  role: string;
  roleLabel: string | null;
  email: string | null;
  phone: string | null;
  isPrimary: boolean;
  notes: string | null;
};

export default function ContactsSection({
  customerId,
  contacts,
}: {
  customerId: string;
  contacts: Contact[];
}) {
  const [editing, setEditing] = useState<Contact | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-white">Contacts</h2>
        <Button size="sm" onClick={() => setCreating(true)}>
          <Plus className="w-3.5 h-3.5" />
          Add contact
        </Button>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
        {contacts.length === 0 ? (
          <p className="text-sm text-white/40 px-4 py-6 text-center">
            No contacts yet. Add the CEO, finance lead, procurement lead, etc.
          </p>
        ) : (
          <ul className="divide-y divide-white/5">
            {contacts.map((c) => (
              <ContactRow
                key={c.id}
                contact={c}
                onEdit={() => setEditing(c)}
              />
            ))}
          </ul>
        )}
      </div>

      <Modal open={creating} onClose={() => setCreating(false)} title="Add contact" size="md">
        <ContactForm
          customerId={customerId}
          onClose={() => setCreating(false)}
        />
      </Modal>

      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title="Edit contact" size="md">
        {editing && (
          <ContactForm
            customerId={customerId}
            initial={editing}
            onClose={() => setEditing(null)}
          />
        )}
      </Modal>
    </section>
  );
}

function ContactRow({ contact, onEdit }: { contact: Contact; onEdit: () => void }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onDelete() {
    if (!confirm(`Delete contact "${contact.name}"?`)) return;
    setBusy(true);
    const res = await fetch(`/api/admin/contacts/${contact.id}`, { method: "DELETE" });
    setBusy(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error ?? "Failed to delete contact");
      return;
    }
    router.refresh();
  }

  const roleLabel = contact.roleLabel || formatRole(contact.role);

  return (
    <li className="flex items-start justify-between gap-3 px-4 py-3 hover:bg-white/[0.03]">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-white truncate">{contact.name}</p>
          {contact.isPrimary && (
            <span className="inline-flex items-center gap-1 text-xs text-amber-200">
              <Star className="w-3 h-3 fill-current" />
              Primary
            </span>
          )}
        </div>
        <p className="text-xs text-white/50">{roleLabel}</p>
        <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-white/60">
          {contact.email && (
            <span className="inline-flex items-center gap-1">
              <Mail className="w-3 h-3 text-white/40" />
              <a href={`mailto:${contact.email}`} className="hover:text-white">{contact.email}</a>
            </span>
          )}
          {contact.phone && (
            <span className="inline-flex items-center gap-1">
              <Phone className="w-3 h-3 text-white/40" />
              <a href={`tel:${contact.phone}`} className="hover:text-white">{contact.phone}</a>
            </span>
          )}
        </div>
        {contact.notes && (
          <p className="text-xs text-white/50 mt-1.5 whitespace-pre-line">{contact.notes}</p>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onEdit}
          className="text-white/50 hover:text-white text-xs inline-flex items-center gap-1"
          aria-label="Edit contact"
        >
          <Pencil className="w-3.5 h-3.5" />
          Edit
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={busy}
          className="text-white/50 hover:text-rose-300 text-xs inline-flex items-center gap-1 disabled:opacity-50"
          aria-label="Delete contact"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </button>
      </div>
    </li>
  );
}

function ContactForm({
  customerId,
  initial,
  onClose,
}: {
  customerId: string;
  initial?: Contact;
  onClose: () => void;
}) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    role: initial?.role ?? "OTHER",
    roleLabel: initial?.roleLabel ?? "",
    email: initial?.email ?? "",
    phone: initial?.phone ?? "",
    isPrimary: initial?.isPrimary ?? false,
    notes: initial?.notes ?? "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const payload = {
      customerId,
      name: form.name.trim(),
      role: form.role,
      roleLabel: form.roleLabel.trim() || null,
      email: form.email.trim() || null,
      phone: form.phone.trim() || null,
      isPrimary: form.isPrimary,
      notes: form.notes.trim() || null,
    };
    const url = isEdit ? `/api/admin/contacts/${initial?.id}` : "/api/admin/contacts";
    const method = isEdit ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Could not save contact.");
      return;
    }
    router.refresh();
    onClose();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label="Name" required>
        <TextInput
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Role">
          <Select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            {CONTACT_ROLES.map((r) => (
              <option key={r} value={r}>{formatRole(r)}</option>
            ))}
          </Select>
        </Field>
        <Field label="Custom title" hint="Optional — overrides the role label on PDFs.">
          <TextInput
            placeholder="e.g. Head of IT"
            value={form.roleLabel}
            onChange={(e) => setForm({ ...form, roleLabel: e.target.value })}
          />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
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
      </div>
      <label className="inline-flex items-center gap-2 text-sm text-white/80">
        <input
          type="checkbox"
          checked={form.isPrimary}
          onChange={(e) => setForm({ ...form, isPrimary: e.target.checked })}
        />
        Primary contact for this customer
      </label>
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
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
        <Button type="submit" disabled={submitting || !form.name.trim()}>
          {submitting ? "Saving…" : isEdit ? "Save changes" : "Add contact"}
        </Button>
      </div>
    </form>
  );
}

function formatRole(role: string) {
  switch (role) {
    case "CEO": return "CEO";
    case "FINANCE": return "Finance";
    case "PROCUREMENT": return "Procurement";
    case "BUSINESS_LEAD": return "Business lead";
    case "TECHNICAL": return "Technical";
    default: return "Other";
  }
}
