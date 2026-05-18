"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Link as LinkIcon, GitMerge, Search } from "lucide-react";
import Modal from "../../_components/Modal";
import { Button } from "../../_components/Button";
import { Field, Select, TextArea, TextInput } from "../../_components/Field";
import { CUSTOMER_TYPES } from "@/lib/validators";

type LeadSummary = {
  id: string;
  name: string;
  email: string | null;
  status: string;
  companyName: string | null;
  isConverted: boolean;
  isMerged: boolean;
};

type CustomerOption = {
  id: string;
  name: string;
  type: string;
  contacts: { id: string; name: string; role: string }[];
};

type LeadOption = {
  id: string;
  name: string;
  email: string | null;
  createdAt: string;
};

export default function LeadActions({
  lead,
  customers,
  otherLeads,
}: {
  lead: LeadSummary;
  customers: CustomerOption[];
  otherLeads: LeadOption[];
}) {
  const router = useRouter();
  const [openModal, setOpenModal] = useState<null | "promote" | "link" | "merge">(null);
  const [busy, setBusy] = useState(false);

  if (lead.isMerged) {
    return (
      <section className="rounded-xl border border-amber-500/30 bg-amber-500/[0.05] p-5 text-sm text-amber-200/90">
        This lead was merged into another lead. No further actions are available.
      </section>
    );
  }

  if (lead.isConverted) {
    return (
      <section className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.05] p-5 text-sm text-emerald-200/90">
        This lead has been qualified and linked to a customer. No further actions are available.
      </section>
    );
  }

  async function setStatus(next: string) {
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error ?? "Failed to update status");
        return;
      }
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-white">Lead actions</h3>
          <p className="text-xs text-white/50 mt-0.5">
            Qualify by promoting to a new customer, link to an existing one, or merge a duplicate.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {lead.status === "NEW" && (
            <Button variant="secondary" size="sm" disabled={busy} onClick={() => setStatus("IN_PROGRESS")}>
              Mark in progress
            </Button>
          )}
          {(lead.status === "NEW" || lead.status === "IN_PROGRESS") && (
            <Button variant="ghost" size="sm" disabled={busy} onClick={() => setStatus("DISQUALIFIED")}>
              Disqualify
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <ActionCard
          icon={<UserPlus className="w-4 h-4" />}
          title="Promote to new customer"
          description="Create a fresh customer record from this lead and mark it qualified."
          onClick={() => setOpenModal("promote")}
        />
        <ActionCard
          icon={<LinkIcon className="w-4 h-4" />}
          title="Link to existing customer"
          description="Attach this lead to a customer already in the database."
          onClick={() => setOpenModal("link")}
        />
        <ActionCard
          icon={<GitMerge className="w-4 h-4" />}
          title="Merge into another lead"
          description="Mark this lead as a duplicate of another open lead."
          onClick={() => setOpenModal("merge")}
        />
      </div>

      <PromoteModal
        open={openModal === "promote"}
        onClose={() => setOpenModal(null)}
        lead={lead}
      />
      <LinkModal
        open={openModal === "link"}
        onClose={() => setOpenModal(null)}
        lead={lead}
        customers={customers}
      />
      <MergeModal
        open={openModal === "merge"}
        onClose={() => setOpenModal(null)}
        lead={lead}
        otherLeads={otherLeads}
      />
    </section>
  );
}

function ActionCard({
  icon,
  title,
  description,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left rounded-lg border border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04] p-4 transition-colors"
    >
      <div className="flex items-center gap-2 text-white mb-1">
        <span className="text-white/60">{icon}</span>
        <span className="text-sm font-medium">{title}</span>
      </div>
      <p className="text-xs text-white/50">{description}</p>
    </button>
  );
}

// ---------- Promote (CREATE) ----------

function PromoteModal({
  open,
  onClose,
  lead,
}: {
  open: boolean;
  onClose: () => void;
  lead: LeadSummary;
}) {
  const router = useRouter();
  const [type, setType] = useState<(typeof CUSTOMER_TYPES)[number]>(
    lead.companyName ? "COMPANY" : "INDIVIDUAL"
  );
  const [name, setName] = useState(lead.companyName?.trim() || lead.name);
  const [legalName, setLegalName] = useState("");
  const [taxId, setTaxId] = useState("");
  const [industry, setIndustry] = useState("");
  const [website, setWebsite] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("Ghana");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}/promote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "CREATE",
          customer: {
            type,
            name,
            legalName: legalName || null,
            taxId: taxId || null,
            industry: industry || null,
            website: website || null,
            addressLine1: addressLine1 || null,
            city: city || null,
            country: country || null,
            notes: notes || undefined,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to promote lead");
        return;
      }
      onClose();
      router.refresh();
      if (data.lead?.convertedCustomerId) {
        router.push(`/admin/customers/${data.lead.convertedCustomerId}`);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Promote to new customer" size="lg">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Type" required>
            <Select value={type} onChange={(e) => setType(e.target.value as typeof type)}>
              {CUSTOMER_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </Select>
          </Field>
          <Field label={type === "COMPANY" ? "Company name" : "Full name"} required>
            <TextInput value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
        </div>

        {type === "COMPANY" && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Legal name">
                <TextInput
                  value={legalName}
                  onChange={(e) => setLegalName(e.target.value)}
                  placeholder="e.g. Acme Holdings Ltd."
                />
              </Field>
              <Field label="Tax ID / TIN">
                <TextInput value={taxId} onChange={(e) => setTaxId(e.target.value)} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Industry">
                <TextInput value={industry} onChange={(e) => setIndustry(e.target.value)} />
              </Field>
              <Field label="Website">
                <TextInput
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://"
                />
              </Field>
            </div>
            <Field label="Address line 1">
              <TextInput
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="City">
                <TextInput value={city} onChange={(e) => setCity(e.target.value)} />
              </Field>
              <Field label="Country">
                <TextInput value={country} onChange={(e) => setCountry(e.target.value)} />
              </Field>
            </div>
          </>
        )}

        <Field label="Notes" hint="If left blank, the lead's subject and message are used as the seed notes.">
          <TextArea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </Field>

        {error && (
          <p className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/30 rounded-md px-3 py-2">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose} disabled={busy}>Cancel</Button>
          <Button onClick={submit} disabled={busy || !name.trim()}>
            {busy ? "Creating…" : "Create customer"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// ---------- Link (LINK) ----------

function LinkModal({
  open,
  onClose,
  lead,
  customers,
}: {
  open: boolean;
  onClose: () => void;
  lead: LeadSummary;
  customers: CustomerOption[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return customers.slice(0, 50);
    return customers
      .filter((c) => c.name.toLowerCase().includes(q))
      .slice(0, 50);
  }, [query, customers]);

  const selected = customers.find((c) => c.id === selectedCustomerId) ?? null;

  async function submit() {
    if (!selectedCustomerId) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}/promote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "LINK",
          targetCustomerId: selectedCustomerId,
          targetContactId: selectedContactId,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to link lead");
        return;
      }
      onClose();
      router.refresh();
      router.push(`/admin/customers/${selectedCustomerId}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Link to existing customer" size="lg">
      <div className="space-y-4">
        <Field label="Search customers">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <TextInput
              autoFocus
              className="pl-9"
              placeholder="Type to filter…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedCustomerId(null);
                setSelectedContactId(null);
              }}
            />
          </div>
        </Field>

        <div className="max-h-64 overflow-y-auto rounded-md border border-white/10 divide-y divide-white/5">
          {filtered.length === 0 ? (
            <p className="text-sm text-white/50 p-4 text-center">No customers match.</p>
          ) : (
            filtered.map((c) => {
              const active = c.id === selectedCustomerId;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setSelectedCustomerId(c.id);
                    setSelectedContactId(null);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                    active ? "bg-[#BD2E25]/15 text-white" : "text-white/80 hover:bg-white/5"
                  }`}
                >
                  <span className="font-medium">{c.name}</span>
                  <span className="text-white/40 text-xs ml-2">
                    {c.type} · {c.contacts.length} contact{c.contacts.length === 1 ? "" : "s"}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {selected && selected.contacts.length > 0 && (
          <Field label="Attach to contact (optional)">
            <Select
              value={selectedContactId ?? ""}
              onChange={(e) => setSelectedContactId(e.target.value || null)}
            >
              <option value="">— None —</option>
              {selected.contacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.role})
                </option>
              ))}
            </Select>
          </Field>
        )}

        {error && (
          <p className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/30 rounded-md px-3 py-2">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose} disabled={busy}>Cancel</Button>
          <Button onClick={submit} disabled={busy || !selectedCustomerId}>
            {busy ? "Linking…" : "Link lead"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// ---------- Merge ----------

function MergeModal({
  open,
  onClose,
  lead,
  otherLeads,
}: {
  open: boolean;
  onClose: () => void;
  lead: LeadSummary;
  otherLeads: LeadOption[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [targetLeadId, setTargetLeadId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return otherLeads;
    return otherLeads.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        (l.email && l.email.toLowerCase().includes(q))
    );
  }, [query, otherLeads]);

  async function submit() {
    if (!targetLeadId) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}/merge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetLeadId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to merge lead");
        return;
      }
      onClose();
      router.refresh();
      router.push(`/admin/leads/${targetLeadId}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Merge into another lead" size="lg">
      <div className="space-y-4">
        <p className="text-sm text-white/60">
          This lead will be marked <span className="text-amber-200">DUPLICATE</span> and its
          message, notes, and tags will be appended to the target. The source row is preserved for
          auditing.
        </p>

        <Field label="Search open leads">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <TextInput
              autoFocus
              className="pl-9"
              placeholder="Name or email…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setTargetLeadId(null);
              }}
            />
          </div>
        </Field>

        <div className="max-h-64 overflow-y-auto rounded-md border border-white/10 divide-y divide-white/5">
          {filtered.length === 0 ? (
            <p className="text-sm text-white/50 p-4 text-center">
              No other open leads available to merge into.
            </p>
          ) : (
            filtered.map((l) => {
              const active = l.id === targetLeadId;
              return (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setTargetLeadId(l.id)}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                    active ? "bg-[#BD2E25]/15 text-white" : "text-white/80 hover:bg-white/5"
                  }`}
                >
                  <span className="font-medium">{l.name}</span>
                  {l.email && (
                    <span className="text-white/50 text-xs ml-2">{l.email}</span>
                  )}
                </button>
              );
            })
          )}
        </div>

        {error && (
          <p className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/30 rounded-md px-3 py-2">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose} disabled={busy}>Cancel</Button>
          <Button variant="danger" onClick={submit} disabled={busy || !targetLeadId}>
            {busy ? "Merging…" : "Merge lead"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
