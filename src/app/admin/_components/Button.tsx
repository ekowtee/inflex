import Link from "next/link";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

const variants: Record<Variant, string> = {
  primary: "bg-[#BD2E25] hover:bg-[#A02923] text-white",
  secondary: "bg-white/10 hover:bg-white/15 text-white border border-white/15",
  ghost: "text-white/70 hover:text-white hover:bg-white/5",
  danger: "bg-rose-600 hover:bg-rose-700 text-white",
};

const sizes: Record<Size, string> = {
  sm: "px-2.5 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
};

function classes(variant: Variant, size: Size, extra?: string) {
  return `inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${extra ?? ""}`;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
}) {
  return <button {...props} className={classes(variant, size, className)} />;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  href,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  size?: Size;
  href: string;
}) {
  return <Link href={href} {...props} className={classes(variant, size, className)} />;
}
