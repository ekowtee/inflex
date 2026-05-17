import { Prisma } from "@prisma/client";

export type Serialized<T> = T extends Prisma.Decimal
  ? number
  : T extends Date
  ? string
  : T extends null
  ? null
  : T extends undefined
  ? undefined
  : T extends Array<infer U>
  ? Serialized<U>[]
  : T extends object
  ? { [K in keyof T]: Serialized<T[K]> }
  : T;

function transform(value: unknown): unknown {
  if (value === null || value === undefined) return value;
  if (value instanceof Prisma.Decimal) return value.toNumber();
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map(transform);
  if (typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = transform(v);
    }
    return out;
  }
  return value;
}

export function decimalToNumber<T>(value: T): Serialized<T> {
  return transform(value) as Serialized<T>;
}

export function formatMoney(amount: number, currency = "GHS"): string {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
