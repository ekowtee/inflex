/**
 * DB-bound billing helpers. Pure pricing math lives in src/lib/pricing.ts.
 * Anything here that touches Prisma stays here.
 */
import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";

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

// Labels surfaced in dropdowns / PDF rendering. Keys mirror the Prisma enums.
export const LINE_KIND_LABELS: Record<string, string> = {
  PRODUCT: "Product",
  LABOUR: "Labour",
  OUTSTATION: "Outstation",
  FINANCE_CHARGE: "Finance charge",
  OTHER: "Other",
};

export const RECURRING_LABELS: Record<string, string> = {
  NONE: "One-off",
  MONTHLY: "Monthly",
  QUARTERLY: "Quarterly",
  ANNUALLY: "Annually",
};

export const LINE_ITEM_CATEGORY_LABELS: Record<string, string> = {
  CONSULTING: "Consulting & Professional Services",
  MANAGED_SERVICES: "Managed Services",
  HARDWARE: "Hardware",
  SOFTWARE_LICENSING: "Software & Licensing",
  TRAINING: "Training",
  OTHER: "Other",
};
