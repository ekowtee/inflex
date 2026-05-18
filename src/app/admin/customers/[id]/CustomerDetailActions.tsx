"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, GitMerge, Search } from "lucide-react";
import Modal from "../../_components/Modal";
import { Button } from "../../_components/Button";
import { Field, TextInput } from "../../_components/Field";
import CustomerForm, { CustomerFormValues } from "../CustomerForm";

type MergeCandidate = {
  id: string;
  name: string;
  type: string;
  status: string;
};

export default function CustomerDetailActions({
  customer,
  mergeCandidates,
}: {
  customer: Omit<CustomerFormValues, "id" | "name"> & {
    id: string;
    name: string;
    quoteCount: number;
    invoiceCount: number;
  };
  mergeCandidates: MergeCandidate[];
}) {
  const [editing, setEditing] = useState(false);
  const [merging, setMerging] = useState(false);

  return (
    <section className="mb-8 rounded-xl border border-white/10 bg-white/[0.02] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-white">Customer actions</h3>
          <p className="text-xs text-white/50 mt-0.5">
            Edit the company record or merge this customer into another to consolidate duplicates.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setMerging(true)}>
            <GitMerge className="w-3.5 h-3.5" />
            Merge into another
          </Button>
        </div>
      </div>

      <Modal open={editing} onClose={() => setEditing(false)} title="Edit customer" size="lg">
        <CustomerForm initial={customer} onClose={() => setEditing(false)} />
      </Modal>

      <MergeModal
        open={merging}
        onClose={() => setMerging(false)}
        sourceId={customer.id}
        sourceName={customer.name}
        quoteCount={customer.quoteCount}
        invoiceCount={customer.invoiceCount}
        candidates={mergeCandidates}
      />
    </section>
  );
}

function MergeModal({
  open,
  onClose,
  sourceId,
  sourceName,
  quoteCount,
  invoiceCount,
  candidates,
}: {
  open: boolean;
  onClose: () => void;
  sourceId: string;
  sourceName: string;
  quoteCount: number;
  invoiceCount: number;
  candidates: MergeCandidate[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [targetId, setTargetId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return candidates.slice(0, 50);
    return candidates
      .filter((c) => c.name.toLowerCase().includes(q))
      .slice(0, 50);
  }, [query, candidates]);

  async function submit() {
    if (!targetId) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/customers/${sourceId}/merge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetCustomerId: targetId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to merge customer");
        return;
      }
      onClose();
      router.refresh();
      router.push(`/admin/customers/${targetId}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={`Merge "${sourceName}" into another customer`} size="lg">
      <div className="space-y-4">
        <div className="rounded-md border border-amber-500/30 bg-amber-500/[0.05] p-3 text-sm text-amber-200/90">
          <p>This will move all data from <span className="font-medium">{sourceName}</span> to the target customer:</p>
          <ul className="list-disc list-inside text-xs mt-1.5 text-amber-200/70">
            <li>{quoteCount} quote{quoteCount === 1 ? "" : "s"}, {invoiceCount} invoice{invoiceCount === 1 ? "" : "s"}, all payments, contacts, and origin leads are reassigned.</li>
            <li>Notes and tags are merged. Missing fields on the target are filled from the source.</li>
            <li>The source record is preserved and marked CHURNED for audit.</li>
          </ul>
        </div>

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
                setTargetId(null);
              }}
            />
          </div>
        </Field>

        <div className="max-h-64 overflow-y-auto rounded-md border border-white/10 divide-y divide-white/5">
          {filtered.length === 0 ? (
            <p className="text-sm text-white/50 p-4 text-center">No customers match.</p>
          ) : (
            filtered.map((c) => {
              const active = c.id === targetId;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setTargetId(c.id)}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                    active ? "bg-[#BD2E25]/15 text-white" : "text-white/80 hover:bg-white/5"
                  }`}
                >
                  <span className="font-medium">{c.name}</span>
                  <span className="text-white/40 text-xs ml-2">
                    {c.type} · {c.status}
                  </span>
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
          <Button variant="danger" onClick={submit} disabled={busy || !targetId}>
            {busy ? "Merging…" : "Merge customer"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
