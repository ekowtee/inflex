import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";

export const LINE_ITEM_CATEGORIES = [
  { value: "CONSULTING", label: "Consulting & Professional Services" },
  { value: "MANAGED_SERVICES", label: "Managed Services" },
  { value: "HARDWARE", label: "Hardware" },
  { value: "SOFTWARE_LICENSING", label: "Software & Licensing" },
  { value: "TRAINING", label: "Training" },
  { value: "OTHER", label: "Other" },
] as const;

export const RECURRING_INTERVALS = [
  { value: "NONE", label: "One-off" },
  { value: "MONTHLY", label: "Monthly" },
  { value: "QUARTERLY", label: "Quarterly" },
  { value: "ANNUALLY", label: "Annually" },
] as const;

export interface BillingItemInput {
  description: string;
  category: string;
  quantity: number;
  unitPrice: number;
  recurring: string;
  sortOrder?: number;
}

export function calculateTotals(opts: {
  items: BillingItemInput[];
  taxRate: number;
  discount: number;
}) {
  const subtotal = opts.items.reduce(
    (sum, item) => sum + Number(item.quantity) * Number(item.unitPrice),
    0
  );
  const discounted = Math.max(0, subtotal - opts.discount);
  const taxAmount = (discounted * opts.taxRate) / 100;
  const total = discounted + taxAmount;
  return {
    subtotal: round2(subtotal),
    taxAmount: round2(taxAmount),
    total: round2(total),
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export async function nextQuoteNumber(): Promise<string> {
  return prisma.$transaction(async (tx) => {
    const settings = await tx.companySettings.upsert({
      where: { id: "singleton" },
      create: {},
      update: {},
    });
    const seq = settings.nextQuoteNumber;
    await tx.companySettings.update({
      where: { id: "singleton" },
      data: { nextQuoteNumber: seq + 1 },
    });
    return formatNumber(settings.quotePrefix, seq);
  });
}

export async function nextInvoiceNumber(): Promise<string> {
  return prisma.$transaction(async (tx) => {
    const settings = await tx.companySettings.upsert({
      where: { id: "singleton" },
      create: {},
      update: {},
    });
    const seq = settings.nextInvoiceNumber;
    await tx.companySettings.update({
      where: { id: "singleton" },
      data: { nextInvoiceNumber: seq + 1 },
    });
    return formatNumber(settings.invoicePrefix, seq);
  });
}

function formatNumber(prefix: string, seq: number): string {
  const year = new Date().getFullYear();
  return `${prefix}-${year}-${String(seq).padStart(4, "0")}`;
}

export function toDecimal(n: number): Prisma.Decimal {
  return new Prisma.Decimal(n);
}
