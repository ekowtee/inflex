import { z } from "zod";

export const customerSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  company: z.string().max(200).optional().nullable(),
  email: z.string().email("Invalid email").optional().nullable().or(z.literal("")),
  phone: z.string().max(50).optional().nullable(),
  leadStatus: z.enum(["LEAD", "QUALIFIED", "ACTIVE", "DORMANT", "CHURNED"]),
  leadSource: z.enum(["REFERRAL", "WEBSITE", "EVENT", "OUTBOUND", "PARTNER", "OTHER"]),
  tags: z.array(z.string()).default([]),
  notes: z.string().optional().nullable(),
});

export const lineItemSchema = z.object({
  description: z.string().min(1, "Description is required").max(500),
  category: z.enum([
    "CONSULTING",
    "MANAGED_SERVICES",
    "HARDWARE",
    "SOFTWARE_LICENSING",
    "TRAINING",
    "OTHER",
  ]),
  quantity: z.coerce.number().min(0),
  unitPrice: z.coerce.number().min(0),
  recurring: z.enum(["NONE", "MONTHLY", "QUARTERLY", "ANNUALLY"]).default("NONE"),
  sortOrder: z.number().int().default(0),
});

export const quoteSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  status: z.enum(["DRAFT", "SENT", "ACCEPTED", "DECLINED", "EXPIRED"]).default("DRAFT"),
  scopeOfWork: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  taxRate: z.coerce.number().min(0).max(100).default(0),
  discount: z.coerce.number().min(0).default(0),
  currency: z.string().default("GHS"),
  validUntil: z.string().optional().nullable(),
  items: z.array(lineItemSchema).min(1, "Add at least one line item"),
});

export const invoiceSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  quoteId: z.string().optional().nullable(),
  status: z.enum([
    "DRAFT",
    "SENT",
    "PARTIALLY_PAID",
    "PAID",
    "OVERDUE",
    "CANCELLED",
  ]).default("DRAFT"),
  notes: z.string().optional().nullable(),
  taxRate: z.coerce.number().min(0).max(100).default(0),
  discount: z.coerce.number().min(0).default(0),
  currency: z.string().default("GHS"),
  issueDate: z.string().optional().nullable(),
  dueDate: z.string().optional().nullable(),
  items: z.array(lineItemSchema).min(1, "Add at least one line item"),
});

export const paymentSchema = z.object({
  invoiceId: z.string().min(1, "Invoice is required"),
  amount: z.coerce.number().min(0.01, "Amount must be greater than zero"),
  currency: z.string().default("GHS"),
  method: z.enum(["BANK_TRANSFER", "MOBILE_MONEY", "CHEQUE", "CARD", "CASH", "OTHER"]),
  status: z.enum(["PENDING", "COMPLETED", "FAILED", "REFUNDED"]).default("COMPLETED"),
  reference: z.string().max(200).optional().nullable(),
  notes: z.string().optional().nullable(),
  paidAt: z.string().optional().nullable(),
});

export const settingsSchema = z.object({
  companyName: z.string().min(1).max(200),
  addressLine1: z.string().optional().nullable(),
  addressLine2: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  email: z.string().email().optional().nullable().or(z.literal("")),
  phone: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  taxId: z.string().optional().nullable(),
  defaultTaxRate: z.coerce.number().min(0).max(100).default(0),
  paymentTerms: z.string().optional().nullable(),
  bankName: z.string().optional().nullable(),
  bankAccountName: z.string().optional().nullable(),
  bankAccountNo: z.string().optional().nullable(),
  bankBranch: z.string().optional().nullable(),
  bankSwift: z.string().optional().nullable(),
  momoProvider: z.string().optional().nullable(),
  momoNumber: z.string().optional().nullable(),
  momoAccountName: z.string().optional().nullable(),
  currency: z.string().default("GHS"),
  quotePrefix: z.string().min(1).max(10).default("Q"),
  invoicePrefix: z.string().min(1).max(10).default("INV"),
});
