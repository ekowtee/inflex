import { z } from "zod";

export const userCreateSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Valid email required").max(200),
  role: z.enum(["DIRECTOR", "FINANCE", "SALES"]),
  password: z.string().min(8, "Password must be at least 8 characters").max(200),
  isActive: z.boolean().default(true),
});

export const userUpdateSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(200),
  role: z.enum(["DIRECTOR", "FINANCE", "SALES"]),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(200)
    .optional()
    .or(z.literal("")),
  isActive: z.boolean(),
});

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

// ---------- Quote builder v2 ----------

export const labourEntrySchema = z.object({
  roleId: z.string().min(1, "Role is required"),
  days: z.coerce.number().min(0).default(0),
  indirectDays: z.coerce.number().min(0).default(0),
  description: z.string().optional().nullable(),
  sortOrder: z.coerce.number().int().default(0),
});

export const outstationEntrySchema = z.object({
  roleId: z.string().min(1, "Role is required"),
  staffCount: z.coerce.number().int().min(1).default(1),
  days: z.coerce.number().min(0).default(0),
  trips: z.coerce.number().int().min(0).default(1),
  description: z.string().optional().nullable(),
  sortOrder: z.coerce.number().int().default(0),
});

export const lineItemSchema = z.object({
  description: z.string().min(1, "Description is required").max(500),
  kind: z
    .enum(["PRODUCT", "LABOUR", "OUTSTATION", "FINANCE_CHARGE", "OTHER"])
    .default("PRODUCT"),
  category: z
    .enum(["CONSULTING", "MANAGED_SERVICES", "HARDWARE", "SOFTWARE_LICENSING", "TRAINING", "OTHER"])
    .default("OTHER"),
  partNumber: z.string().max(200).optional().nullable(),
  specs: z.string().optional().nullable(),
  quantity: z.coerce.number().min(0),
  landedCost: z.coerce.number().min(0).default(0),
  landedCostCurrency: z.string().default("GHS"),
  markupTierId: z.string().optional().nullable(),
  markupPct: z.coerce.number().min(0).default(0),
  surchargePct: z.coerce.number().min(0).default(0),
  discountPct: z.coerce.number().min(0).max(100).default(0),
  recurring: z
    .enum(["NONE", "MONTHLY", "QUARTERLY", "ANNUALLY"])
    .default("NONE"),
  sortOrder: z.coerce.number().int().default(0),
  // Calculator entries — only meaningful for LABOUR / OUTSTATION kinds.
  // When present, the server uses them as the source of truth for landedCost
  // and the entries are persisted (LabourEntry / OutstationEntry rows).
  labourEntries: z.array(labourEntrySchema).default([]),
  outstationEntries: z.array(outstationEntrySchema).default([]),
});

export const quoteSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  status: z
    .enum(["DRAFT", "PENDING_APPROVAL", "SENT", "ACCEPTED", "DECLINED", "EXPIRED"])
    .default("DRAFT"),
  projectTitle: z.string().max(300).optional().nullable(),
  attentionTo: z.string().max(300).optional().nullable(),
  solutionArchitectId: z.string().optional().nullable(),
  scopeOfWork: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  currency: z.string().min(3).max(3).default("GHS"),
  validUntil: z.string().optional().nullable(),

  // FX
  fxRate: z.coerce.number().positive().optional().nullable(),
  fxRateSource: z.string().optional().nullable(),
  fxRateDate: z.string().optional().nullable(),

  // Finance trio
  annualInterestRatePct: z.coerce.number().min(0).max(100).default(0),
  projectCycleWeeks: z.coerce.number().int().min(0).default(0),
  advancePaymentPct: z.coerce.number().min(0).max(100).default(0),

  // WHT
  whtCategoryId: z.string().optional().nullable(),
  whtCustomPct: z.coerce.number().min(0).max(99.99).optional().nullable(),

  // Tax flags (captured at create-time; defaults flow from settings)
  vatApplied: z.boolean(),
  nonVatTaxApplied: z.boolean(),

  items: z.array(lineItemSchema).min(1, "Add at least one line item"),

  // Revision reason — required when editing a quote that has already been SENT/ACCEPTED
  revisionReason: z.string().optional().nullable(),
});

export const invoiceLineItemSchema = z.object({
  description: z.string().min(1, "Description is required").max(500),
  category: z
    .enum(["CONSULTING", "MANAGED_SERVICES", "HARDWARE", "SOFTWARE_LICENSING", "TRAINING", "OTHER"])
    .default("OTHER"),
  quantity: z.coerce.number().min(0),
  unitPrice: z.coerce.number().min(0),
  recurring: z
    .enum(["NONE", "MONTHLY", "QUARTERLY", "ANNUALLY"])
    .default("NONE"),
  sortOrder: z.number().int().default(0),
});

export const invoiceSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  quoteId: z.string().optional().nullable(),
  status: z
    .enum(["DRAFT", "SENT", "PARTIALLY_PAID", "PAID", "OVERDUE", "CANCELLED"])
    .default("DRAFT"),
  notes: z.string().optional().nullable(),
  taxRate: z.coerce.number().min(0).max(100).default(0),
  discount: z.coerce.number().min(0).default(0),
  currency: z.string().default("GHS"),
  issueDate: z.string().optional().nullable(),
  dueDate: z.string().optional().nullable(),
  items: z.array(invoiceLineItemSchema).min(1, "Add at least one line item"),
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

  // VAT (Ghana 2026, Act 1151)
  vatRegistered: z.boolean(),
  vatStandardPct: z.coerce.number().min(0).max(100).default(15),
  nhilPct: z.coerce.number().min(0).max(100).default(2.5),
  getfundPct: z.coerce.number().min(0).max(100).default(2.5),
  covidLevyPct: z.coerce.number().min(0).max(100).default(0),

  // Non-VAT sales tax
  nonVatTaxApplied: z.boolean(),
  nonVatTaxLabel: z.string().min(1).max(50).default("Sales Tax"),
  nonVatTaxOnGoodsPct: z.coerce.number().min(0).max(100).default(3),
  nonVatTaxOnServicesPct: z.coerce.number().min(0).max(100).default(0),

  // Finance defaults
  defaultAnnualInterestRatePct: z.coerce.number().min(0).max(100).default(22),
  defaultProjectCycleWeeks: z.coerce.number().int().min(0).default(8),
  defaultAdvancePaymentPct: z.coerce.number().min(0).max(100).default(0),

  // FX defaults
  defaultFxUsdGhsRate: z.coerce.number().positive().optional().nullable(),
  defaultFxRateSource: z.string().default("cedirates.com"),

  // Rounding
  roundingThreshold: z.coerce.number().min(0).default(70),
  roundingIncrementBelow: z.coerce.number().positive().default(0.01),
  roundingIncrementAbove: z.coerce.number().positive().default(1),
});
