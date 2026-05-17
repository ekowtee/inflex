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
import InvoiceForm from "./InvoiceForm";
import { formatDate, formatMoney } from "@/lib/serialize";

type Invoice = {
  id: string;
  number: string;
  status: string;
  total: number;
  amountPaid: number;
  currency: string;
  createdAt: string;
  dueDate: string | null;
  customer: { id: string; name: string; company: string | null };
};

type Customer = { id: string; name: string; company: string | null };

const STATUSES = [
  "ALL",
  "DRAFT",
  "SENT",
  "PARTIALLY_PAID",
  "PAID",
  "OVERDUE",
  "CANCELLED",
];

export default function InvoicesClient({
  invoices,
  customers,
  defaultCurrency,
}: {
  invoices: Invoice[];
  customers: Customer[];
  defaultCurrency: string;
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
      router.replace(`/admin/invoices${params.toString() ? `?${params}` : ""}`);
    }
  }, [shouldOpenNew, router, searchParams]);

  const filtered = invoices.filter(
    (i) => status === "ALL" || i.status === status
  );

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
              {s === "ALL" ? "All statuses" : s.replace("_", " ")}
            </option>
          ))}
        </Select>
        <div className="flex-1" />
        <Button onClick={() => setCreating(true)}>
          <Plus className="w-4 h-4" />
          New invoice
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title={invoices.length === 0 ? "No invoices yet" : "No matches"}
          description={
            invoices.length === 0
              ? "Convert an accepted quote, or create an invoice directly."
              : "Try a different status filter."
          }
          action={
            invoices.length === 0 ? (
              <Button onClick={() => setCreating(true)}>
                <Plus className="w-4 h-4" />
                New invoice
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
                <th className="text-right px-4 py-3 font-medium hidden md:table-cell">Paid</th>
                <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((inv) => (
                <tr key={inv.id} className="hover:bg-white/[0.03]">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/invoices/${inv.id}`}
                      className="font-medium text-white hover:text-[#BD2E25]"
                    >
                      {inv.number}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/customers/${inv.customer.id}`}
                      className="text-white/80 hover:text-white"
                    >
                      {inv.customer.name}
                    </Link>
                    {inv.customer.company && (
                      <p className="text-xs text-white/40">{inv.customer.company}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={inv.status} />
                  </td>
                  <td className="px-4 py-3 text-right text-white/80">
                    {formatMoney(inv.total, inv.currency)}
                  </td>
                  <td className="px-4 py-3 text-right text-white/60 hidden md:table-cell">
                    {formatMoney(inv.amountPaid, inv.currency)}
                  </td>
                  <td className="px-4 py-3 text-white/60 text-xs hidden lg:table-cell">
                    {formatDate(inv.dueDate)}
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
        title="New invoice"
        size="xl"
      >
        <InvoiceForm
          customers={customers}
          defaultCurrency={defaultCurrency}
          initial={preselectCustomerId ? { customerId: preselectCustomerId } : undefined}
          onClose={() => setCreating(false)}
        />
      </Modal>
    </>
  );
}
