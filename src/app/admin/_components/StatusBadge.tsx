const STATUS_STYLES: Record<string, string> = {
  // Quote
  DRAFT: "bg-white/10 text-white/70 border-white/20",
  SENT: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  ACCEPTED: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  DECLINED: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  EXPIRED: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  // Invoice extras
  PAID: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  PARTIALLY_PAID: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  OVERDUE: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  CANCELLED: "bg-white/5 text-white/40 border-white/10",
  // Payment
  PENDING: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  COMPLETED: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  FAILED: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  REFUNDED: "bg-white/10 text-white/70 border-white/20",
  // Lead status
  LEAD: "bg-white/10 text-white/70 border-white/20",
  QUALIFIED: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  ACTIVE: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  DORMANT: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  CHURNED: "bg-rose-500/15 text-rose-300 border-rose-500/30",
};

export default function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.DRAFT;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-medium uppercase tracking-wide ${style}`}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}
