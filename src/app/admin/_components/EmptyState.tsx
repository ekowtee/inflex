import { Inbox } from "lucide-react";

export default function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center">
      <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
        <Inbox className="w-5 h-5 text-white/40" />
      </div>
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      {description && (
        <p className="text-sm text-white/50 mt-1.5 max-w-md mx-auto">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
