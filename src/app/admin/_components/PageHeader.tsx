export default function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
      <div>
        {eyebrow && (
          <p className="text-xs uppercase tracking-wider text-white/40 mb-1.5">
            {eyebrow}
          </p>
        )}
        <h1 className="text-2xl font-semibold text-white">{title}</h1>
        {description && (
          <p className="text-sm text-white/60 mt-1.5 max-w-2xl">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
