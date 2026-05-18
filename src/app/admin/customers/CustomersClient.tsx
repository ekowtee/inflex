"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Building2, User } from "lucide-react";
import { Button } from "../_components/Button";
import Modal from "../_components/Modal";
import StatusBadge from "../_components/StatusBadge";
import EmptyState from "../_components/EmptyState";
import { TextInput, Select } from "../_components/Field";
import CustomerForm from "./CustomerForm";
import { formatDate } from "@/lib/serialize";

type Customer = {
  id: string;
  type: "COMPANY" | "INDIVIDUAL";
  name: string;
  legalName: string | null;
  email: string | null;
  phone: string | null;
  status: string;
  tags: string[];
  city: string | null;
  country: string | null;
  industry: string | null;
  createdAt: string;
  _count: { contacts: number; quotes: number; invoices: number };
};

const STATUSES = ["ALL", "PROSPECT", "ACTIVE", "DORMANT", "CHURNED"];
const TYPES = ["ALL", "COMPANY", "INDIVIDUAL"];

export default function CustomersClient({ customers }: { customers: Customer[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");
  const [type, setType] = useState("ALL");
  const [creating, setCreating] = useState(false);

  const filtered = customers.filter((c) => {
    const matchesQuery =
      !query.trim() ||
      [c.name, c.legalName, c.email, c.phone, c.industry]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(query.toLowerCase()));
    const matchesStatus = status === "ALL" || c.status === status;
    const matchesType = type === "ALL" || c.type === type;
    return matchesQuery && matchesStatus && matchesType;
  });

  return (
    <>
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <TextInput
            placeholder="Search by name, legal name, email, industry…"
            className="pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Select value={type} onChange={(e) => setType(e.target.value)} className="md:w-40">
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {t === "ALL" ? "All types" : t}
            </option>
          ))}
        </Select>
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="md:w-44">
          {STATUSES.map((s) => (
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
              ? "Qualify a lead or create a customer directly to start tracking quotes and invoices."
              : "Try adjusting your search or filters."
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
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Type</th>
                <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Location</th>
                <th className="text-right px-4 py-3 font-medium hidden md:table-cell">Contacts</th>
                <th className="text-right px-4 py-3 font-medium hidden lg:table-cell">Quotes / Invoices</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-white/[0.03] transition-colors">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/customers/${c.id}`}
                      className="font-medium text-white hover:text-[#BD2E25]"
                    >
                      {c.name}
                    </Link>
                    {c.legalName && c.legalName !== c.name && (
                      <p className="text-xs text-white/40">{c.legalName}</p>
                    )}
                    {(c.email || c.phone) && (
                      <p className="text-xs text-white/50 mt-0.5">
                        {c.email ?? c.phone}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-white/70 hidden md:table-cell">
                    <span className="inline-flex items-center gap-1.5">
                      {c.type === "COMPANY" ? (
                        <Building2 className="w-3.5 h-3.5 text-white/40" />
                      ) : (
                        <User className="w-3.5 h-3.5 text-white/40" />
                      )}
                      {c.type === "COMPANY" ? "Company" : "Individual"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white/60 text-xs hidden lg:table-cell">
                    {[c.city, c.country].filter(Boolean).join(", ") || "—"}
                  </td>
                  <td className="px-4 py-3 text-right text-white/60 text-xs hidden md:table-cell">
                    {c._count.contacts}
                  </td>
                  <td className="px-4 py-3 text-right text-white/60 text-xs hidden lg:table-cell">
                    {c._count.quotes} / {c._count.invoices}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="px-4 py-3 text-white/60 text-xs hidden lg:table-cell">
                    {formatDate(c.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={creating} onClose={() => setCreating(false)} title="New customer" size="lg">
        <CustomerForm onClose={() => setCreating(false)} />
      </Modal>
    </>
  );
}
