# Inflexions Quote Builder — Functional Specification

This document captures the design decisions for upgrading the existing Admin
quote builder (`/admin/quotes`) from a flat description × qty × unit-price form
into a margin-aware quote builder with the labour, outstation, and finance
calculators Inflexions actually needs to price work in Ghana.

It sits alongside [`CRM_SETUP.md`](./CRM_SETUP.md) (which covers admin auth,
deployment, DB migrations, and the quote → invoice workflow). Anything not
restated here remains as documented in `CRM_SETUP.md`.

`PRD.md` describes the public-facing marketing website and is not relevant to
this build. Do not import its taxonomy or page specs into the admin work.

## 1. Background & Source Material

The current `Quote` + `LineItem` model in `prisma/schema.prisma` represents a
quote as a list of flat lines, each contributing `quantity × unitPrice` to a
subtotal, with a single `taxRate` applied. This is sufficient for trivial
quotes but fails on the realities of Inflexions' margin model:

- Hardware is sold on top of a landed cost (list × vendor discount × freight
  × duty) that must be calculated, not typed.
- Working capital is expensive in Ghana — at the current ~22% annual lending
  rate, an eight-week project that's not paid upfront costs roughly 3.4% of
  capital just in financing. Quoting without pricing that in silently destroys
  margin.
- Services billing combines daily rates by role with per-diems for outstation
  work — neither of which the rep should be calculating by hand.
- Customer-facing PDFs must hide cost and margin while the internal review
  copy must show them.
- Withholding tax deducted by the customer must be grossed up into the price
  so the customer's deduction doesn't eat margin.

The reference workbook (`BluTel Desktops ComStor` / `BluTel Racks NetInf`)
encoded all of this across 73 columns of one sheet plus seven supporting
sheets. The features worth carrying over are listed below, restructured as
proper application primitives.

## 2. Scope of the First Wave

**In scope:**

- Schema and UI to capture cost, markup, surcharge, discount, finance charge,
  WHT gross-up, and final selling price per line item.
- Per-line and per-quote gross profit / gross margin calculation (visible to
  approvers, hidden from customers).
- A **Labour** calculator that produces labour lines from role × days, with
  direct and indirect cost allocation.
- An **Outstation** calculator that produces outstation lines from
  role × staff × days × trips, with feeding / transport / outstation charges
  by role.
- A **Finance charge** computation applied per line, driven by an annual
  interest rate, the project cycle in weeks, and an advance-payment percentage
  captured on the quote header.
- Ghana 2026-compliant **tax model**: structured VAT (15% standard + 2.5%
  NHIL + 2.5% GETFund cascaded to 20% effective) with a VAT-registered flag,
  a **non-VAT sales tax** (configurable, default 3% on goods) that applies
  even when Inflexions is below the VAT-registration threshold, and a
  structured WHT picker covering the current GRA categories. All tax rates
  and categories are **editable from the settings UI** — they are not
  hardcoded enums.
- Foreign-exchange handling per quote: the rep enters a USD/GHS spot rate
  from cedirates.com, the system locks it to the quote.
- **Two-view rendering**: a customer-facing PDF that hides all pricing
  internals and an internal review PDF that exposes the full margin build-up.
- **Revisions**: every change to an approved or sent quote increments a
  revision counter and is logged with the editor, timestamp, and a one-line
  reason.

**Explicitly out of first wave** (deferred to second wave):

- Product catalog with vendor-specific discount tables (Cisco, Meraki,
  Checkpoint, Systimax). For now, landed cost is typed manually per line.
- Distributor quote ingestion (ComStor, ChannelIT, Redington spreadsheets).
- Volumetric-vs-actual weight shipping calculation.
- DC sizing calculator (separate tool, not part of the quote builder).
- Fetching the cedirates.com USD/GHS rate over HTTP — rep types it for now.
- Email delivery of generated PDFs.

## 3. Decisions That Deviate From the Reference Workbook

These are the deliberate departures from the BluTel template:

1. **No line-level sectioning.** The workbook used "Section A.", "A-1", "A-2"
   headings to group rows. In the application, a single line item carries a
   short `description` (one line, customer-facing) and a long-form `specs`
   field (rich text / markdown) for everything that used to sit on the
   zero-priced component rows underneath. Grouping can be added later via
   an optional `group` string per line if a quote needs it.

2. **No 8-slot fixed markup table.** `Markup1..Markup8` becomes a proper
   `MarkupTier` table with named tiers (Standard, Systimax, Outstation,
   Labour, etc.) editable from settings.

3. **Single home currency, FX per quote.** The Naira (`ExchangeRate₦`) FX
   column from the workbook is dropped — Inflexions quotes in GHS or USD, FX
   between them is recorded per quote and locked.

4. **No in-sheet bid review log.** Use the `QuoteRevision` audit table and
   `Quote.notes` for internal commentary. The workbook's "Rev Control" sheet
   becomes a tab on the quote detail page.

5. **Tax updated to 2026 reality.** The workbook's `3% Sales Tax` and `5%
   WHT` are wrong for 2026. See section 7 below.

## 4. Data Model Changes

The following schema additions extend the existing `Quote`, `LineItem`,
`CompanySettings`, and `User` models. Existing fields stay as documented in
`prisma/schema.prisma`.

### 4.1 `Quote` — new fields

| Field | Type | Notes |
|---|---|---|
| `solutionArchitectId` | `String?` → `User` | Engineer credited as designer. Optional. |
| `attentionTo` | `String?` | Recipient's title + name on the PDF (e.g. "The Head, Procurement — Mr Sampson Nartey-Yoe"). |
| `projectTitle` | `String?` | Bold project title on the PDF (e.g. "BLU TELECOM CALL CENTER PCs"). Distinct from `scopeOfWork`. |
| `fxRate` | `Decimal(12,6)` | USD/GHS spot rate locked to this quote. Required if `currency` is USD or any line item has a USD landed cost. |
| `fxRateSource` | `String` (default `"cedirates.com"`) | Attribution shown on the PDF footer. |
| `fxRateDate` | `DateTime?` | When the rate was captured. |
| `annualInterestRatePct` | `Decimal(5,2)` | Locked at quote creation from `CompanySettings.defaultAnnualInterestRatePct`. |
| `projectCycleWeeks` | `Int` | Weeks from PO to delivery; drives finance charge. |
| `advancePaymentPct` | `Decimal(5,2)` | Portion of contract paid upfront; reduces the financed portion. 0 = nothing upfront, 100 = paid in full upfront (finance charge = 0). |
| `whtCategoryId` | `String?` → `WhtCategory` | FK to editable WHT category row (see section 4.3). Default seeded to "Services (resident) 7.5%". |
| `whtCustomPct` | `Decimal(5,2)?` | Override the category's rate for this one quote (treaty relief etc.); requires reason note. |
| `vatApplied` | `Boolean` | Captured at create-time from `CompanySettings.vatRegistered`. Quotes drafted while not VAT-registered keep `false` even if settings change later. |
| `vatBreakdown` | `Json?` | Computed breakdown stored at issue-time for the PDF: `{standard, nhil, getfund, effectivePct, baseAmount, vatAmount}`. |
| `nonVatTaxApplied` | `Boolean` | Captured at create-time from `CompanySettings.nonVatTaxApplied`. Used when below the VAT threshold but still required to charge a presumptive/sales tax (see section 7.3). |
| `nonVatTaxPct` | `Decimal(5,2)?` | Snapshot of the rate at create-time (so historical quotes don't drift if settings change). |
| `nonVatTaxAmount` | `Decimal(12,2)?` | Computed total. |
| `revision` | `Int` (default 1) | Increments each time an `ACCEPTED` or `SENT` quote is edited. |
| `lockedAt` | `DateTime?` | Set when the quote is sent for approval; further edits create a new revision. |

The existing `taxRate` / `taxAmount` fields on `Quote` are kept for backward
compatibility but become **derived from `vatBreakdown`** rather than typed by
the rep.

### 4.2 `LineItem` — new fields

| Field | Type | Notes |
|---|---|---|
| `kind` | `LineKind` enum | `PRODUCT \| LABOUR \| OUTSTATION \| FINANCE_CHARGE \| OTHER`. Controls how the line is rendered and which calculator owns it. |
| `partNumber` | `String?` | Customer-facing on internal view, hidden on customer view by default. |
| `specs` | `Text?` | Long-form spec sheet (markdown). Replaces the workbook's zero-priced bundle rows. Rendered as an indented block under the line on the PDF. |
| `landedCost` | `Decimal(12,2)` | Cost to Inflexions in the line's currency before any markup. |
| `landedCostCurrency` | `String` (default `"GHS"`) | If different from the quote currency, converted via `Quote.fxRate`. |
| `markupTierId` | `String?` → `MarkupTier` | Which named tier was applied. |
| `markupPct` | `Decimal(5,2)` | Locked from the tier at line creation; editable per line. |
| `surchargePct` | `Decimal(5,2)` (default 0) | Additional cost on top of landed (e.g. Cisco freight). |
| `discountPct` | `Decimal(5,2)` (default 0) | Discount given to customer. |
| `financeChargePct` | `Decimal(8,4)` | Computed: `annualRate × cycleWeeks / 52 × (1 − advancePct)`. Stored at line save-time so historical quotes don't drift. |
| `whtGrossUpAmount` | `Decimal(12,2)` | Computed gross-up per unit. See section 6. |
| `finalUnitPriceExclTax` | `Decimal(12,2)` | Computed end-of-pipeline unit price after markup, surcharge, discount, finance charge, WHT gross-up, and rounding. |
| `finalLineTotalExclTax` | `Decimal(12,2)` | `quantity × finalUnitPriceExclTax`. |
| `costLineTotal` | `Decimal(12,2)` | `quantity × landedCost` in quote currency. For margin calculation. |
| `lineGpAmount` | `Decimal(12,2)` | `finalLineTotalExclTax − costLineTotal − finance components`. Stored for fast aggregation. |
| `lineGpMarginPct` | `Decimal(6,3)` | `lineGpAmount / finalLineTotalExclTax`. |

The existing `unitPrice` field becomes **derived** from `finalUnitPriceExclTax`
(or equals `finalUnitPriceExclTax` for a `PRODUCT` line). The quote builder
writes both; the customer PDF reads `unitPrice`; the internal view reads the
full set.

### 4.3 New models

```prisma
// Editable named markup tiers (e.g. Standard 5%, Systimax 30%, Labour 100%)
model MarkupTier {
  id          String   @id @default(cuid())
  name        String   @unique
  pct         Decimal  @db.Decimal(5, 2)
  isDefault   Boolean  @default(false)
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  lineItems   LineItem[]
}

// Labour role with daily rate; seeded from the workbook
model LabourRole {
  id          String      @id @default(cuid())
  name        String      @unique // Term Worker, Technician, Sr Technician, Engineer I/II, Specialist, Consultant
  dailyRate   Decimal     @db.Decimal(12, 2)
  currency    String      @default("GHS")
  kind        LabourKind  @default(DIRECT)  // DIRECT | INDIRECT
  isActive    Boolean     @default(true)
  sortOrder   Int         @default(0)
  outstationRate OutstationRate?
  labourEntries  LabourEntry[]
  outstationEntries OutstationEntry[]
}

enum LabourKind { DIRECT INDIRECT }

// Per-role per-diem rates for outstation work
model OutstationRate {
  id                String   @id @default(cuid())
  roleId            String   @unique
  role              LabourRole @relation(fields: [roleId], references: [id])
  feeding           Decimal  @db.Decimal(12, 2) @default(0)
  localTransport    Decimal  @db.Decimal(12, 2) @default(0)
  outstationCharge  Decimal  @db.Decimal(12, 2) @default(0)
  misc              Decimal  @db.Decimal(12, 2) @default(0)
  currency          String   @default("GHS")
  updatedAt         DateTime @updatedAt
}

// Entries that roll up into a LABOUR line item
model LabourEntry {
  id            String     @id @default(cuid())
  lineItemId    String
  lineItem      LineItem   @relation(fields: [lineItemId], references: [id], onDelete: Cascade)
  roleId        String
  role          LabourRole @relation(fields: [roleId], references: [id])
  days          Decimal    @db.Decimal(8, 2)
  indirectDays  Decimal    @db.Decimal(8, 2) @default(0)  // auto-allocated, editable
  description   String?
}

// Entries that roll up into an OUTSTATION line item
model OutstationEntry {
  id            String     @id @default(cuid())
  lineItemId    String
  lineItem      LineItem   @relation(fields: [lineItemId], references: [id], onDelete: Cascade)
  roleId        String
  role          LabourRole @relation(fields: [roleId], references: [id])
  staffCount    Int        @default(1)
  days          Decimal    @db.Decimal(8, 2)
  trips         Int        @default(1)
  description   String?
}

// Append-only audit log of quote changes after first SENT/ACCEPTED
model QuoteRevision {
  id          String   @id @default(cuid())
  quoteId     String
  quote       Quote    @relation(fields: [quoteId], references: [id], onDelete: Cascade)
  revision    Int
  editorId    String
  editor      User     @relation(fields: [editorId], references: [id])
  changedAt   DateTime @default(now())
  reason      String?
  snapshot    Json     // Full quote + line item state at the time of edit
}

enum LineKind {
  PRODUCT
  LABOUR
  OUTSTATION
  FINANCE_CHARGE
  OTHER
}

// WHT categories live in the database, not in code, so finance can update
// rates when GRA does without a deploy. Seeded with the seven entries
// listed in section 7.2.
model WhtCategory {
  id          String   @id @default(cuid())
  code        String   @unique     // NONE, GOODS_3, WORKS_5, ... (stable code for code references)
  label       String               // human label shown in the picker
  rate        Decimal  @db.Decimal(5, 2)  // editable percentage
  description String?              // when to use this category
  isActive    Boolean  @default(true)
  isDefault   Boolean  @default(false)    // exactly one row defaults to true
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  quotes      Quote[]
}
```

### 4.4 `CompanySettings` — new fields

| Field | Type | Default | Notes |
|---|---|---|---|
| `vatRegistered` | `Boolean` | `false` | Inflexions is not yet VAT-registered (currently below the GHS 750k goods threshold). Flip on when crossing the threshold. |
| `vatRegisteredSince` | `DateTime?` | `null` | Audit field — when the flag was first turned on. |
| `vatStandardPct` | `Decimal(5,2)` | `15.00` | Standard VAT under Act 1151 (2025). |
| `nhilPct` | `Decimal(5,2)` | `2.50` | National Health Insurance Levy. |
| `getfundPct` | `Decimal(5,2)` | `2.50` | Ghana Education Trust Fund Levy. |
| `covidLevyPct` | `Decimal(5,2)` | `0.00` | Abolished from 1 Jan 2026; field kept for transitional invoices. |
| `nonVatTaxApplied` | `Boolean` | `true` | When `vatRegistered` is `false`, whether a non-VAT sales tax still applies (e.g. presumptive/turnover tax for SMEs below the threshold). |
| `nonVatTaxLabel` | `String` | `"Sales Tax"` | What to call the line on the PDF. |
| `nonVatTaxOnGoodsPct` | `Decimal(5,2)` | `3.00` | Default rate for goods-only or mixed quotes. Confirm with accountant — see section 12 open question. |
| `nonVatTaxOnServicesPct` | `Decimal(5,2)` | `0.00` | Default rate for services-only quotes; many small-business presumptive taxes apply to goods only. |
| `defaultAnnualInterestRatePct` | `Decimal(5,2)` | `22.00` | Current commercial lending rate. Locked onto each new quote. |
| `defaultProjectCycleWeeks` | `Int` | `8` | Typical fulfilment window. |
| `defaultAdvancePaymentPct` | `Decimal(5,2)` | `0.00` | Portion paid upfront — defaults to none. |
| `defaultFxUsdGhsRate` | `Decimal(12,6)?` | `null` | Seed value the rep can accept or overwrite per quote. |
| `defaultFxRateSource` | `String` | `"cedirates.com"` | Attribution shown on PDF footer. |
| `roundingThreshold` | `Decimal(12,2)` | `70.00` | Below this, round to `roundingIncrementBelow`; at/above, round to `roundingIncrementAbove`. |
| `roundingIncrementBelow` | `Decimal(12,4)` | `0.01` | Sub-threshold rounding step. |
| `roundingIncrementAbove` | `Decimal(12,4)` | `1.00` | Supra-threshold rounding step. |

### 4.5 Roles

Extend `UserRole` with `SALES` (so a non-director engineer can be assigned as
solution architect on a quote):

```prisma
enum UserRole {
  DIRECTOR
  FINANCE
  SALES   // can create + edit quotes, cannot approve
}
```

Approval is restricted to `DIRECTOR` (and `FINANCE` for tax-affecting fields).

## 5. The Pricing Pipeline

The per-line pipeline runs in this order. All amounts are in the quote's
currency; landed costs in another currency are converted via `Quote.fxRate`
first.

```
unitLanded            = landedCost                                          (input)
unitFinanceCharge     = unitLanded
                      × (annualInterestRatePct / 100 / 52)
                      × projectCycleWeeks
                      × (1 − advancePaymentPct / 100)
unitWithFinance       = unitLanded + unitFinanceCharge
unitWithMarkup        = unitWithFinance × (1 + markupPct / 100)
unitWithSurcharge     = unitWithMarkup × (1 + surchargePct / 100)
unitAfterDiscount     = unitWithSurcharge × (1 − discountPct / 100)
unitWhtGrossUp        = unitAfterDiscount × (whtPct / 100) / (1 − whtPct / 100)
unitBeforeRounding    = unitAfterDiscount + unitWhtGrossUp
unitFinal             = CEIL(
                          unitBeforeRounding,
                          unitBeforeRounding > roundingThreshold
                            ? roundingIncrementAbove
                            : roundingIncrementBelow
                        )

finalLineTotalExclTax = unitFinal × quantity
costLineTotal         = unitLanded × quantity
lineGpAmount          = finalLineTotalExclTax
                      − costLineTotal
                      − (unitFinanceCharge × quantity)   // optional: include finance in cost
lineGpMarginPct       = lineGpAmount / finalLineTotalExclTax
```

The pipeline must live in a single pure function (`src/lib/billing.ts`)
exercised by unit tests, not duplicated between server and client.

Quote-level aggregates:

- `subtotal` = sum of `finalLineTotalExclTax` across all lines
- `vatBaseAmount` = `subtotal` (if `vatApplied`)
- `vatAmount` = `vatBaseAmount × ((nhilPct + getfundPct + vatStandardPct + covidLevyPct + ...) / 100)` —
  see section 7.1 for the cascading formula
- `total` = `subtotal + vatAmount` (when VAT applied) or `subtotal` (when not)
- `totalGp` = sum of `lineGpAmount`
- `totalGpMarginPct` = `totalGp / subtotal`

## 6. Withholding Tax Gross-Up

The customer is required by law to withhold a percentage when paying for
goods or services and remit it to GRA. Without the gross-up, the customer
deducts the WHT from Inflexions' invoiced amount, and Inflexions takes the
hit. With the gross-up, the invoiced amount is inflated so that after the
customer's deduction, Inflexions still receives the intended price.

Formula:
```
grossedUpPrice = netPrice / (1 − whtPct / 100)
whtGrossUpAmount = grossedUpPrice − netPrice
                 = netPrice × (whtPct / 100) / (1 − whtPct / 100)
```

The customer invoice shows the **grossed-up price** as the line total. A
footer note on the customer PDF reads, e.g.:

> Withholding tax of GHS X (7.5%) is included in the unit prices above as
> required by the Ghana Revenue Authority. Deduct and remit this amount on
> our behalf.

This way the customer's accounts payable team sees the obligation, deducts
it, and Inflexions receives the original net amount.

## 7. Ghana Tax Model (2026)

### 7.1 VAT — under VAT Act 1151, effective 1 Jan 2026

The cascade is calculated in three steps, not as a flat 20%:

```
base    = subtotal
step1   = base × (nhilPct + getfundPct + covidLevyPct) / 100    // levies first
step2   = (base + step1) × vatStandardPct / 100                 // VAT on aggregated
vatAmount = step1 + step2
effectivePct = vatAmount / base × 100                            // ~20.00%
```

With the default 15 / 2.5 / 2.5 / 0 split:
- `step1` = `base × 5%`
- `step2` = `(base × 1.05) × 15%` = `base × 15.75%`
- `vatAmount` = `base × 20.75%` — note this is slightly **above** the often-quoted
  20%. The 20% figure assumes levies are not cascaded; verify against the GRA's
  Practice Note before launch and adjust the formula if their guidance differs.

The PDF must itemise the cascade so customers' AP can reconcile the line.

`Quote.vatApplied` defaults to `CompanySettings.vatRegistered` at create-time.
When Inflexions is not VAT-registered:
- New quotes are created with `vatApplied: false`.
- The standard VAT cascade is suppressed on the PDF.
- The non-VAT sales tax described in section 7.3 still applies unless the
  rep explicitly turns it off for that quote.

When the flag flips to `true`:
- Existing draft quotes are unaffected (each quote's `vatApplied` is set at
  create-time, not read live).
- New quotes default to `vatApplied: true`, and `nonVatTaxApplied: false`
  (you can't be subject to both at once).
- The rep can still toggle VAT off per quote for exempt customers
  (diplomats, zero-rated exports), with an audit reason captured.

### 7.2 Non-VAT sales tax (below the VAT threshold)

Being below the VAT-registration threshold does **not** exempt Inflexions
from charging some sales-side tax on goods (e.g. the small-business
turnover/presumptive tax obligation). This is captured separately from VAT:

```
nonVatTaxBase   = subtotal of lines whose kind is PRODUCT, by default
                  (rep can override per quote — e.g. apply to all lines
                  or only to specific lines)
nonVatTaxAmount = nonVatTaxBase × (nonVatTaxOnGoodsPct / 100)
                + (servicesSubtotal × nonVatTaxOnServicesPct / 100)
```

UI: a single toggle on the quote header (`nonVatTaxApplied`) plus a small
edit panel showing the rate and what it applies to. Default ON when
`!vatRegistered`, default OFF when `vatRegistered`.

The PDF shows this as a labelled line ("Sales Tax (3%)" by default, label
editable from settings) between subtotal and grand total. See section 12
open question 6 — confirm with the accountant exactly what this 3% is so
the label and basis are right.

### 7.3 WHT — categories (DB-backed, editable)

WHT categories live in the database (`WhtCategory` model, section 4.3) so
finance can update rates without a code deploy. Seed values for 2026:

| Code | Default rate | Default label | When to use |
|---|---|---|---|
| `NONE` | 0% | No withholding | Customer has a valid WHT exemption certificate. |
| `GOODS_3` | 3% | Goods (3%) | Supply of goods (hardware-only quote). |
| `WORKS_5` | 5% | Works / contracts (5%) | Works or construction-style contracts. |
| `SERVICES_RESIDENT_7_5` | 7.5% | Services — resident (7.5%) | Services to a resident person. Inflexions' default. |
| `MGMT_TECH_NONRESIDENT_25` | 25% | Mgmt/Technical — non-resident (25%) | Management or technical fees paid to a non-resident person. Up from 20% pre-2026. |
| `VAT_AGENT_7` | 7% | VAT agent withholding (7%) | Customer is a GRA-appointed VAT-registered withholding agent. |
| `CUSTOM` | 0% (rep overrides) | Custom rate | Treaty-relieved rates or special arrangements. Requires reason note. |

The `code` column is stable (used by the seed and any code references); the
`label` and `rate` are editable from `/admin/settings/tax-rates`. New rows
can be added; rows in use by existing quotes cannot be deleted (only
deactivated).

The WHT threshold is GHS 2,000 per supplier per annum. The system does not
track cumulative customer spend yet — the rep applies WHT on every quote
above this threshold; for one-off small jobs they can choose `NONE` with a
reason note.

## 8. Calculators

### 8.1 Labour calculator

UI: a tab on the quote form labelled **Labour**. The rep adds rows of
`(role, days, indirect days)`. The calculator:

- Defaults `indirectDays` to `CEIL(days × 0.25, 0.5)` for engineer-level roles
  (Engineer I, Engineer II), `CEIL(days × 0.25, 0.25)` for specialists, and
  `0` for term workers and technicians (matching the workbook's split between
  direct and indirect cost).
- Sums `days × dailyRate (DIRECT roles)` and `indirectDays × dailyRate
  (INDIRECT)` into a labour landed cost.
- Generates one `LineItem` of `kind: LABOUR` with description "Professional
  Services" (editable) and the per-role breakdown in `specs` (markdown
  table). The `markupTier` defaults to the tier named `Labour` (typically
  100%) and `discountPct` is editable from the line.

### 8.2 Outstation calculator

UI: a tab labelled **Outstation**. The rep adds rows of `(role, staff,
days, trips)`. For each row:

```
roleDailyTotal = feeding + localTransport + outstationCharge + misc
rowCost        = (staff × days × roleDailyTotal) + (trips × transportPerTrip)
```

The result rolls into a single `LineItem` of `kind: OUTSTATION` with the
per-role breakdown in `specs`. Outstation rates entered in USD are converted
to the quote currency via `Quote.fxRate`.

### 8.3 Finance charge

There is no separate UI tab — the finance charge is a **per-line computed
column** that flows through every PRODUCT line (and optionally LABOUR /
OUTSTATION lines, controlled by a per-tier flag on `MarkupTier`).

The three inputs (`annualInterestRatePct`, `projectCycleWeeks`,
`advancePaymentPct`) appear on the **quote header** with sensible defaults
from `CompanySettings`. Changing them recalculates every line's
`financeChargePct` in real time.

For deals where the rep wants to itemise the finance charge as a transparent
line (rare; most customers prefer it baked in), they can add a `kind:
FINANCE_CHARGE` line with quantity 1 and the computed amount. By default the
charge is absorbed into the unit prices and not separately disclosed.

## 9. Settings UI Extensions

Add the following pages under `/admin/settings`:

| Page | Purpose |
|---|---|
| `/admin/settings` (existing) | Company info, banking, defaults — extended with the new tax + pricing fields from section 4.4. |
| `/admin/settings/tax-rates` | CRUD on `WhtCategory` rows + edit the VAT components (standard / NHIL / GETFund / COVID levy) and non-VAT sales tax rates. One screen for every percentage GRA owns. |
| `/admin/settings/markup-tiers` | CRUD on `MarkupTier`. |
| `/admin/settings/labour-roles` | CRUD on `LabourRole` and its `OutstationRate`. |

The tax-rates page is the most important of the three: it's where the
director updates VAT components, NHIL / GETFund splits, the non-VAT sales
tax label and percentages, and the WHT category rates whenever GRA changes
them. Every field shows the "last edited by + when" so changes are
auditable.

A "Reset to 2026 defaults" button on the tax-rates page repopulates the
seed values, useful when an experiment goes wrong or as a one-click sanity
check.

## 10. Customer vs Internal Views

One quote → two renderings. The toggle is by URL flag and gated by role.

### Customer PDF (`?view=customer`, default for download from the customer-facing CTA)

Shown:
- Inflexions letterhead, customer block, quote ref, date, project title,
  attention person, solution architect.
- Line items: description (markdown rendered), specs (markdown rendered,
  indented), qty, unit price, line total.
- Optional: part number, depending on a per-quote toggle.
- Subtotal, VAT breakdown (if applied), Grand total.
- Editable T&Cs.
- Prepared-by / Approval / Date signature block.
- Footer: WHT obligation note (section 6), FX rate attribution, "Not VAT
  registered" notice if applicable.

Hidden:
- Landed cost, markup, discount, surcharge, finance charge, WHT gross-up
  internals, gross profit, gross margin, internal notes.

### Internal review PDF (`?view=internal`, accessible only to DIRECTOR / FINANCE)

Shows everything from the customer PDF plus the full pricing pipeline columns
for each line, the GP and GP% rollups by line and quote, all WHT gross-up
amounts, and the revision history log.

Use a single React component with a `mode: 'customer' | 'internal'` prop, not
two parallel templates. Cost and margin columns render conditionally.

## 11. Approval & Revisions

State machine on `Quote.status`:

```
DRAFT ──(submit for approval)──> PENDING_APPROVAL
PENDING_APPROVAL ──(director approves)──> SENT
PENDING_APPROVAL ──(rejected)──> DRAFT
SENT ──(customer accepts)──> ACCEPTED
SENT ──(customer declines)──> DECLINED
SENT / ACCEPTED ──(edit)──> creates new revision, status stays
```

Add `PENDING_APPROVAL` to the existing `QuoteStatus` enum.

Rules:
- A `SALES` user can move a quote `DRAFT → PENDING_APPROVAL` but cannot move
  it to `SENT`.
- A `DIRECTOR` (and only a DIRECTOR) can move `PENDING_APPROVAL → SENT`.
- Any edit to a quote in `SENT` or `ACCEPTED` status increments `revision`,
  writes a `QuoteRevision` snapshot, and requires a one-line reason.
- The internal PDF lists the full revision history at the bottom.

## 12. Open Questions

1. **Services VAT threshold.** GHS 750k is the goods threshold. Verify the
   services-specific threshold with the accountant before changing
   `vatRegistered`. The system itself doesn't care about the threshold value
   — it's a manual flip — but the warning copy in settings should cite the
   right number.

2. **VAT cascade vs flat 20%.** Section 7.1 cascades the levies, which gives
   ~20.75% effective. GRA marketing material rounds to 20%. Before launch,
   pull the GRA Practice Note or invoice from a known VAT-registered supplier
   and confirm the exact cascade order. If GRA computes a flat 20%, simplify
   the formula accordingly.

3. **Finance charge inclusion in COGS.** Section 5 includes `unitFinanceCharge`
   in `lineGpAmount` calculation. If you'd rather report GP before financing
   cost (so margin reads "operational margin" not "post-financing margin"),
   drop that line. The pipeline supports either — confirm preference before
   coding.

4. **Discount stacking.** The workbook had vendor-level discount (`Discount`
   in `OtherProducts`) and a quote-level `Discount` named range applied per
   line. First-wave model has only line-level `discountPct`. If quote-level
   "promo" discounts on top of vendor discounts are needed, add
   `Quote.promoDiscountPct` and apply it in the pipeline after surcharge but
   before finance charge.

5. **Multi-line FX.** First-wave model has one `Quote.fxRate`. If a single
   quote ever mixes lines priced in USD and EUR (rare but possible), we'd
   need per-line FX. Defer until requested.

6. **Exact name and basis of the non-VAT sales tax.** Section 7.2 assumes a
   3% rate on goods that applies even when below the VAT threshold. The old
   VAT Flat Rate Scheme (which used a 3% rate) was abolished on 1 Jan 2026
   under Act 1151, so this 3% is something else — most likely the
   small-business presumptive/turnover tax under the Income Tax Act, or an
   industry-specific levy. Confirm with the accountant before launch:
   - What is this tax called officially?
   - Is the basis turnover, sales of goods only, or all supplies?
   - Is the threshold the same as VAT (GHS 750k) or different?
   - Does it apply to services as well as goods?
   - Does it need to appear as a separate line on the invoice or is it
     embedded in the price and remitted internally?

   The data model already supports any of these answers via the
   `nonVatTaxOnGoodsPct`, `nonVatTaxOnServicesPct`, and `nonVatTaxLabel`
   fields — just adjust the seed defaults once confirmed.

## 13. Implementation Order

Suggested order for executing this spec (each step is a self-contained PR):

1. Schema changes (sections 4.1–4.5), migration, seed data for `LabourRole`,
   `OutstationRate`, `MarkupTier`, updated `CompanySettings` defaults.
2. Pricing pipeline as a pure function in `src/lib/billing.ts` with unit
   tests covering: zero advance + finance charge, full advance + zero
   finance, multi-currency conversion, WHT gross-up, all six WHT categories,
   currency-aware rounding.
3. Settings UI extensions (section 9) — markup tiers, labour roles,
   outstation rates pages.
4. Quote header form additions — solution architect picker, attention to,
   project title, FX rate trio, interest rate trio, WHT picker.
5. Line item editor v2 — kind picker, landed cost, markup tier, discount,
   surcharge, computed columns visible to DIRECTOR/FINANCE only.
6. Labour calculator tab — `LabourEntry` editor → generates LABOUR line.
7. Outstation calculator tab — `OutstationEntry` editor → generates
   OUTSTATION line.
8. PDF generator updates — split into customer and internal views.
9. Approval state machine + revision audit log.
10. Settings page polish, VAT-registered toggle UX, "Not VAT registered"
    footer.

A reasonable cut for an internal alpha (used by Directors only, no SALES
role yet) is steps 1, 2, 4, 5, 8. Calculators (6, 7) and approval flow (9)
can land in a second pass once the core pricing pipeline is trusted.
