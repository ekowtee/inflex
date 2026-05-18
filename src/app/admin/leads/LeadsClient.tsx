"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Link as LinkIcon } from "lucide-react";
import StatusBadge from "../_components/StatusBadge";
import EmptyState from "../_components/EmptyState";
import { Select, TextInput } from "../_components/Field";
import { formatDate } from "@/lib/serialize";

type Lead = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  companyName: string | null;
  subject: string | null;
  message: string | null;
  source: string;
  status: string;
  notes: string | null;
  createdAt: string;
  convertedCustomer: { id: string; name: string; type: string } | null;
};

const STATUSES = ["ALL", "NEW", "IN_PROGRESS", "QUALIFIED", "DISQUALIFIED", "DUPLICATE"];

export default function LeadsClient({ leads }: { leads: Lead[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");

  const filtered = leads.filter((l) => {
    const matchesQuery =
      !query.trim() ||
      [l.name, l.email, l.companyName, l.subject]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(query.toLowerCase()));
    const matchesStatus = status === "ALL" || l.status === status;
    return matchesQuery && matchesStatus;
  });

  return (
    <>
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <TextInput
            placeholder="Search by name, email, company, subject…"
            className="pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="md:w-56"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s === "ALL" ? "All statuses" : s.replace(/_/g, " ")}
            </option>
          ))}
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title={leads.length === 0 ? "No leads yet" : "No matches"}
          description={
            leads.length === 0
              ? "Inbound inquiries from /contact and other channels will land here."
              : "Try a different search or status filter."
          }
        />
      ) : (
        <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-white/60 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Subject</th>
                <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Email</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Source</th>
                <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Received</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((l) => (
                <tr key={l.id} className="hover:bg-white/[0.03]">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/leads/${l.id}`}
                      className="font-medium text-white hover:text-[#BD2E25]"
                    >
                      {l.name}
                    </Link>
                    {l.companyName && (
                      <p className="text-xs text-white/40">{l.companyName}</p>
                    )}
                    {l.message && (
                      <p
                        className="text-xs text-white/50 mt-1 truncate max-w-[40ch]"
                        title={l.message}
                      >
                        &ldquo;{l.message.length > 80 ? l.message.slice(0, 77) + "…" : l.message}&rdquo;
                      </p>
                    )}
                    {l.convertedCustomer && (
                      <p className="text-xs text-emerald-300 mt-1 inline-flex items-center gap-1">
                        <LinkIcon className="w-3 h-3" />
                        <Link
                          href={`/admin/customers/${l.convertedCustomer.id}`}
                          className="hover:underline"
                        >
                          {l.convertedCustomer.name}
                        </Link>
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-white/70 hidden md:table-cell">
                    {l.subject ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-white/70 text-xs hidden lg:table-cell">
                    {l.email ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={l.status} />
                  </td>
                  <td className="px-4 py-3 text-white/60 text-xs hidden md:table-cell">
                    {l.source}
                  </td>
                  <td className="px-4 py-3 text-white/60 text-xs hidden lg:table-cell">
                    {formatDate(l.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
