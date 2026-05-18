"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "../_components/Button";
import Modal from "../_components/Modal";
import StatusBadge from "../_components/StatusBadge";
import EmptyState from "../_components/EmptyState";
import { Select } from "../_components/Field";
import QuoteBuilder from "./QuoteBuilder";
import { formatDate, formatMoney } from "@/lib/serialize";

type Quote = {
  id: string;
  number: string;
  status: string;
  total: number;
  currency: string;
  createdAt: string;
  validUntil: string | null;
  customer: { id: string; name: string; company: string | null };
};

type Customer = { id: string; name: string; company: string | null };

const STATUSES = ["ALL", "DRAFT", "PENDING_APPROVAL", "SENT", "ACCEPTED", "DECLINED", "EXPIRED"];

export default function QuotesClient({
  quotes,
  customers,
}: {
  quotes: Quote[];
  customers: Customer[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("ALL");
  const [creating, setCreating] = useState(false);
  const preselectCustomerId = searchParams.get("customerId") ?? undefined;
  const shouldOpenNew = searchParams.get("new") === "1";

  useEffect(() => {
    if (shouldOpenNew) {
      setCreating(true);
      const params = new URLSearchParams(searchParams.toString());
      params.delete("new");
      router.replace(`/admin/quotes${params.toString() ? `?${params}` : ""}`);
    }
  }, [shouldOpenNew, router, searchParams]);

  const filtered = quotes.filter((q) => status === "ALL" || q.status === status);

  return (
    <>
      <div className="flex flex-col md:flex-row gap-3 mb-4">
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
        <div className="flex-1" />
        <Button onClick={() => setCreating(true)}>
          <Plus className="w-4 h-4" />
          New quote
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title={quotes.length === 0 ? "No quotes yet" : "No matches"}
          description={
            quotes.length === 0
              ? "Create your first quote to start tracking proposals."
              : "Try a different status filter."
          }
          action={
            quotes.length === 0 ? (
              <Button onClick={() => setCreating(true)}>
                <Plus className="w-4 h-4" />
                New quote
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-white/60 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Number</th>
                <th className="text-left px-4 py-3 font-medium">Customer</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-right px-4 py-3 font-medium">Total</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Valid until</th>
                <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((q) => (
                <tr key={q.id} className="hover:bg-white/[0.03] transition-colors">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/quotes/${q.id}`}
                      className="font-medium text-white hover:text-[#BD2E25]"
                    >
                      {q.number}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/customers/${q.customer.id}`}
                      className="text-white/80 hover:text-white"
                    >
                      {q.customer.name}
                    </Link>
                    {q.customer.company && (
                      <p className="text-xs text-white/40">{q.customer.company}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={q.status} />
                  </td>
                  <td className="px-4 py-3 text-right text-white/80">
                    {formatMoney(q.total, q.currency)}
                  </td>
                  <td className="px-4 py-3 text-white/60 text-xs hidden md:table-cell">
                    {formatDate(q.validUntil)}
                  </td>
                  <td className="px-4 py-3 text-white/60 text-xs hidden lg:table-cell">
                    {formatDate(q.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={creating}
        onClose={() => setCreating(false)}
        title="New quote"
        size="xl"
      >
        <QuoteBuilder
          customers={customers}
          initial={preselectCustomerId ? { customerId: preselectCustomerId } : undefined}
          onClose={() => setCreating(false)}
        />
      </Modal>
    </>
  );
}
