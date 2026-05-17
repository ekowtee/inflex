"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "../_components/Button";
import Modal from "../_components/Modal";
import StatusBadge from "../_components/StatusBadge";
import EmptyState from "../_components/EmptyState";
import PaymentForm from "./PaymentForm";
import { formatDate, formatMoney } from "@/lib/serialize";

type Payment = {
  id: string;
  amount: number;
  currency: string;
  method: string;
  status: string;
  reference: string | null;
  paidAt: string;
  customer: { id: string; name: string };
  invoice: { id: string; number: string };
};

type InvoiceOption = {
  id: string;
  number: string;
  outstanding: number;
  customerName: string;
  currency: string;
};

export default function PaymentsClient({
  payments,
  invoices,
}: {
  payments: Payment[];
  invoices: InvoiceOption[];
}) {
  const [recording, setRecording] = useState(false);

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setRecording(true)} disabled={invoices.length === 0}>
          <Plus className="w-4 h-4" />
          Record payment
        </Button>
      </div>

      {invoices.length === 0 && payments.length === 0 && (
        <EmptyState
          title="No invoices yet"
          description="Create and send an invoice before recording payments."
        />
      )}

      {payments.length > 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-white/60 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Date</th>
                <th className="text-left px-4 py-3 font-medium">Invoice</th>
                <th className="text-left px-4 py-3 font-medium">Customer</th>
                <th className="text-left px-4 py-3 font-medium">Method</th>
                <th className="text-left px-4 py-3 font-medium">Reference</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-right px-4 py-3 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.03]">
                  <td className="px-4 py-3 text-white/80 text-xs">{formatDate(p.paidAt)}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/invoices/${p.invoice.id}`}
                      className="text-white hover:text-[#BD2E25] font-medium"
                    >
                      {p.invoice.number}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/customers/${p.customer.id}`}
                      className="text-white/80 hover:text-white"
                    >
                      {p.customer.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-white/80 text-xs">{p.method.replace("_", " ")}</td>
                  <td className="px-4 py-3 text-white/60 text-xs">{p.reference ?? "—"}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-4 py-3 text-right text-white">
                    {formatMoney(p.amount, p.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : invoices.length > 0 ? (
        <EmptyState
          title="No payments recorded"
          description="Record your first payment to start tracking inflows."
          action={
            <Button onClick={() => setRecording(true)}>
              <Plus className="w-4 h-4" /> Record payment
            </Button>
          }
        />
      ) : null}

      <Modal open={recording} onClose={() => setRecording(false)} title="Record payment">
        <PaymentForm invoices={invoices} onClose={() => setRecording(false)} />
      </Modal>
    </>
  );
}
