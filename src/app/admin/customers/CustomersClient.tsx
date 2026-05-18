"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { Button } from "../_components/Button";
import Modal from "../_components/Modal";
import StatusBadge from "../_components/StatusBadge";
import EmptyState from "../_components/EmptyState";
import { TextInput, Select } from "../_components/Field";
import CustomerForm, { CustomerFormValues } from "./CustomerForm";
import { formatDate } from "@/lib/serialize";

type Customer = {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  leadStatus: string;
  leadSource: string;
  tags: string[];
  notes: string | null;
  createdAt: string;
};

/**
 * Pulls the most recent message text out of the notes field. Our website
 * lead-capture writes each submission as a block headed by
 * "[YYYY-MM-DD HH:MM UTC] Website contact — <subject>" and ends with the
 * message; we grab the last such block and strip the meta lines.
 */
function latestNoteSnippet(notes: string | null): string | null {
  if (!notes) return null;
  // Most recent block is at the end. Split on the double-newline separator
  // we use between entries; if none, treat the whole thing as one block.
  const blocks = notes.split(/\n\n+/);
  const lastBlock = blocks[blocks.length - 1]?.trim();
  if (!lastBlock) return null;
  const lines = lastBlock.split("\n");
  // Drop the header (first line, e.g. "[…] Website contact — Quote request")
  // and any "Phone: …" line. Whatever remains is the message body.
  const body = lines
    .slice(1)
    .filter((l) => !/^Phone:\s/i.test(l.trim()))
    .join(" ")
    .trim();
  if (!body || body === "(no message)") return null;
  return body.length > 140 ? body.slice(0, 137) + "…" : body;
}

const LEAD_STATUSES = ["ALL", "LEAD", "QUALIFIED", "ACTIVE", "DORMANT", "CHURNED"];

export default function CustomersClient({ customers }: { customers: Customer[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<CustomerFormValues | null>(null);

  const filtered = customers.filter((c) => {
    const matchesQuery =
      !query.trim() ||
      [c.name, c.company, c.email, c.phone]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(query.toLowerCase()));
    const matchesStatus = status === "ALL" || c.leadStatus === status;
    return matchesQuery && matchesStatus;
  });

  return (
    <>
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <TextInput
            placeholder="Search by name, company, email, phone…"
            className="pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="md:w-48"
        >
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s === "ALL" ? "All statuses" : s}
            </option>
          ))}
        </Select>
        <Button onClick={() => setCreating(true)}>
          <Plus className="w-4 h-4" />
          New customer
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title={customers.length === 0 ? "No customers yet" : "No matches"}
          description={
            customers.length === 0
              ? "Create your first customer to start tracking leads, quotes, and invoices."
              : "Try adjusting your search or status filter."
          }
          action={
            customers.length === 0 ? (
              <Button onClick={() => setCreating(true)}>
                <Plus className="w-4 h-4" />
                New customer
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-white/60 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Company</th>
                <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Contact</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Source</th>
                <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Created</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((c) => {
                const snippet = latestNoteSnippet(c.notes);
                return (
                <tr key={c.id} className="hover:bg-white/[0.03] transition-colors">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/customers/${c.id}`}
                      className="font-medium text-white hover:text-[#BD2E25]"
                    >
                      {c.name}
                    </Link>
                    {snippet && (
                      <p
                        className="text-xs text-white/50 mt-1 truncate max-w-[40ch]"
                        title={snippet}
                      >
                        &ldquo;{snippet}&rdquo;
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-white/70 hidden md:table-cell">
                    {c.company ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-white/70 hidden lg:table-cell">
                    {c.email ?? c.phone ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={c.leadStatus} />
                  </td>
                  <td className="px-4 py-3 text-white/60 text-xs hidden md:table-cell">
                    {c.leadSource}
                  </td>
                  <td className="px-4 py-3 text-white/60 text-xs hidden lg:table-cell">
                    {formatDate(c.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() =>
                        setEditing({
                          id: c.id,
                          name: c.name,
                          company: c.company,
                          email: c.email,
                          phone: c.phone,
                          leadStatus: c.leadStatus,
                          leadSource: c.leadSource,
                          tags: c.tags,
                        })
                      }
                      className="text-xs text-white/60 hover:text-white"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={creating}
        onClose={() => setCreating(false)}
        title="New customer"
        size="lg"
      >
        <CustomerForm onClose={() => setCreating(false)} />
      </Modal>

      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title="Edit customer"
        size="lg"
      >
        {editing && (
          <CustomerForm initial={editing} onClose={() => setEditing(null)} />
        )}
      </Modal>
    </>
  );
}
