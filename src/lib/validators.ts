import { z } from "zod";

export const CONTACT_SUBJECTS = [
  "General enquiry",
  "Quote request",
  "Solutions",
  "Services",
  "Academy / training",
  "Partnership",
  "Careers",
  "Other",
] as const;

// Public contact form (NOT gated by auth). Used by /contact and the academy
// for-organizations enquiry form to register inbound leads.
export const publicContactSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Valid email required").max(200),
  phone: z.string().max(50).optional().nullable(),
  company: z.string().max(200).optional().nullable(),
  subject: z.enum(CONTACT_SUBJECTS).default("General enquiry"),
  message: z.string().max(5000).optional().nullable(),
  // Honeypot — bots fill it; humans never see it. Must be empty.
  hp: z.string().max(0).optional(),
  // Cloudflare Turnstile token; verified server-side. Optional at the schema
  // level so the form keeps working in dev when Turnstile env vars aren't
  // configured. The route enforces it whenever TURNSTILE_SECRET_KEY is set.
  turnstileToken: z.string().max(2000).optional().nullable(),
});

export const USER_KINDS = ["INTERNAL", "EXTERNAL"] as const;

// INTERNAL users get a login and need a password. EXTERNAL users are
// kept as records only and skip the password rule.
const userBase = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Valid email required").max(200),
  role: z.enum(["DIRECTOR", "FINANCE", "SALES"]),
  kind: z.enum(USER_KINDS).default("INTERNAL"),
  isActive: z.boolean().default(true),
});

export const userCreateSchema = userBase
  .extend({
    password: z.string().max(200).optional().or(z.literal("")),
  })
  .refine(
    (d) =>
      d.kind === "EXTERNAL" || (typeof d.password === "string" && d.password.length >= 8),
    {
      message: "Password must be at least 8 characters for internal users",
      path: ["password"],
    }
  );

export const userUpdateSchema = userBase.extend({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(200)
    .optional()
    .or(z.literal("")),
});

// ---------- Leads ----------

export const LEAD_STATUSES = [
  "NEW",
  "IN_PROGRESS",
  "QUALIFIED",
  "DISQUALIFIED",
  "DUPLICATE",
] as const;

export const LEAD_SOURCES = [
  "WEBSITE",
  "REFERRAL",
  "EVENT",
  "OUTBOUND",
  "PARTNER",
  "OTHER",
] as const;

export const leadSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email().max(200).optional().nullable().or(z.literal("")),
  phone: z.string().max(50).optional().nullable(),
  companyName: z.string().max(200).optional().nullable(),
  subject: z.string().max(200).optional().nullable(),
  message: z.string().max(5000).optional().nullable(),
  source: z.enum(LEAD_SOURCES).default("WEBSITE"),
  status: z.enum(LEAD_STATUSES).default("NEW"),
  tags: z.array(z.string()).default([]),
  notes: z.string().optional().nullable(),
});

// ---------- Customers ----------

export const CUSTOMER_TYPES = ["COMPANY", "INDIVIDUAL"] as const;
export const CUSTOMER_STATUSES = ["PROSPECT", "ACTIVE", "DORMANT", "CHURNED"] as const;

const customerShape = z.object({
  type: z.enum(CUSTOMER_TYPES).default("COMPANY"),
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Invalid email").optional().nullable().or(z.literal("")),
  phone: z.string().max(50).optional().nullable(),
  status: z.enum(CUSTOMER_STATUSES).default("PROSPECT"),
  tags: z.array(z.string()).default([]),
  notes: z.string().optional().nullable(),

  // Company-only fields (ignored for INDIVIDUAL but accepted to keep the
  // form simple).
  legalName: z.string().max(200).optional().nullable(),
  industry: z.string().max(100).optional().nullable(),
  website: z.string().max(300).optional().nullable(),
  taxId: z.string().max(50).optional().nullable(),
  addressLine1: z.string().max(200).optional().nullable(),
  addressLine2: z.string().max(200).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  region: z.string().max(100).optional().nullable(),
  postalCode: z.string().max(30).optional().nullable(),
  country: z.string().max(100).optional().nullable(),
});

export const customerSchema = customerShape.refine(
  (d) => d.type === "INDIVIDUAL" || (d.name && d.name.length > 0),
  { message: "Company name is required", path: ["name"] }
);

// ---------- Contacts ----------

export const CONTACT_ROLES = [
  "CEO",
  "FINANCE",
  "PROCUREMENT",
  "BUSINESS_LEAD",
  "TECHNICAL",
  "OTHER",
] as const;

export const contactSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  name: z.string().min(1, "Name is required").max(200),
  role: z.enum(CONTACT_ROLES).default("OTHER"),
  roleLabel: z.string().max(100).optional().nullable(),
  email: z.string().email().optional().nullable().or(z.literal("")),
  phone: z.string().max(50).optional().nullable(),
  isPrimary: z.boolean().default(false),
  notes: z.string().optional().nullable(),
});

// ---------- Merge actions ----------

export const mergeLeadIntoLeadSchema = z.object({
  targetLeadId: z.string().min(1, "Target lead is required"),
});

export const promoteLeadToCustomerSchema = z.object({
  // Either create a new customer from the lead, or link to an existing one.
  mode: z.enum(["CREATE", "LINK"]),
  // CREATE mode: optional override of the customer that gets created
  customer: customerShape.partial().optional(),
  // LINK mode: target customer to link to (and optional contact)
  targetCustomerId: z.string().optional().nullable(),
  targetContactId: z.string().optional().nullable(),
});

export const mergeCustomerIntoCustomerSchema = z.object({
  targetCustomerId: z.string().min(1, "Target customer is required"),
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
  contactId: z.string().optional().nullable(),
  status: z
    .enum(["DRAFT", "PENDING_APPROVAL", "SENT", "ACCEPTED", "DECLINED", "EXPIRED"])
    .default("DRAFT"),
  projectTitle: z.string().max(300).optional().nullable(),
  attentionTo: z.string().max(300).optional().nullable(),
  solutionArchitectId: z.string().optional().nullable(),
  preparedById: z.string().optional().nullable(),
  approvedById: z.string().optional().nullable(),
  documentDate: z.string().optional().nullable(),
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
  contactId: z.string().optional().nullable(),
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
  quoteTerms: z.string().max(5000).optional().nullable(),

  // VAT (Ghana 2026). NHIL/GETFund/VAT each apply to subtotal independently
  // and sum to 20% with defaults — no cascading.
  vatRegistered: z.boolean(),
  vatStandardPct: z.coerce.number().min(0).max(100).default(15),
  nhilPct: z.coerce.number().min(0).max(100).default(2.5),
  getfundPct: z.coerce.number().min(0).max(100).default(2.5),

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
