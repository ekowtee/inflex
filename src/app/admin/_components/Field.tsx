import { ReactNode } from "react";

const inputClass =
  "w-full rounded-md bg-[#0f1621] border border-white/10 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#BD2E25] focus:border-transparent disabled:opacity-60";

export function Field({
  label,
  htmlFor,
  hint,
  required,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block text-xs uppercase tracking-wide text-white/60 mb-1.5"
      >
        {label}
        {required && <span className="text-rose-400 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-white/40 mt-1">{hint}</p>}
    </div>
  );
}

export function TextInput(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  return <input {...props} className={`${inputClass} ${props.className ?? ""}`} />;
}

export function TextArea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  return (
    <textarea
      {...props}
      className={`${inputClass} resize-none ${props.className ?? ""}`}
    />
  );
}

export function Select(
  props: React.SelectHTMLAttributes<HTMLSelectElement>
) {
  return (
    <select
      {...props}
      className={`${inputClass} bg-[#0f1621] ${props.className ?? ""}`}
    />
  );
}
