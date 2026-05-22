import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
  Image,
  Svg,
  Path,
} from "@react-pdf/renderer";
import { formatDate, formatMoney } from "../serialize";
import { DEFAULT_QUOTE_TERMS, splitTerms } from "../quoteTerms";

const brand = "#BD2E25";
const navy = "#1B3764";
const ink = "#171A20";
const muted = "#5C6280";
const line = "#E6E6E6";
const internalBg = "#FFF7E6";

// PDF money formatter — forces the ISO code ("GHS") instead of the cedi
// symbol, which the embedded Helvetica font can't render (shows as "μ").
function fmtMoney(amount: number, currency: string): string {
  return formatMoney(amount, currency, { display: "code" });
}

// Embed the logo from disk as a data URI so the PDF never depends on a
// network fetch (a failed Image fetch can throw and abort the whole render).
// Read once and cache; if the file can't be found we just skip the logo.
let logoDataUri: string | null | undefined;
function getLogo(): string | null {
  if (logoDataUri !== undefined) return logoDataUri;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require("node:fs") as typeof import("node:fs");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require("node:path") as typeof import("node:path");
    const file = path.join(process.cwd(), "public", "inflexlogo.png");
    logoDataUri = `data:image/png;base64,${fs.readFileSync(file).toString("base64")}`;
  } catch {
    logoDataUri = null;
  }
  return logoDataUri;
}

// Hide a legal name in the bill-to block when it's just the trading name with
// a company-type suffix (Ltd / PLC / etc.) — avoids "ARB APEX Bank" sitting
// right above "ARB APEX Bank PLC".
function isRedundantLegalName(name: string, legalName: string): boolean {
  const norm = (s: string) =>
    s
      .toLowerCase()
      .replace(/[.,]/g, "")
      .replace(/\b(ltd|limited|plc|llc|inc|co|company|gh|ghana)\b/g, "")
      .replace(/\s+/g, " ")
      .trim();
  const a = norm(name);
  const b = norm(legalName);
  return a === b || a.includes(b) || b.includes(a);
}

// Tiny line icons for the bill-to contact rows. Drawn as SVG so they don't
// depend on any font glyphs.
function ContactIcon({ kind }: { kind: "pin" | "mail" | "phone" }) {
  return (
    <Svg width={9} height={9} viewBox="0 0 24 24" style={{ marginTop: 1, marginRight: 4 }}>
      {kind === "pin" && (
        <Path
          d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"
          fill={muted}
        />
      )}
      {kind === "mail" && (
        <Path
          d="M2 5h20v14H2V5zm10 7L3.5 6.5h17L12 12zm0 2.2L3 8.5V18h18V8.5l-9 5.7z"
          fill={muted}
        />
      )}
      {kind === "phone" && (
        <Path
          d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .7-.2 1l-2.3 2.2z"
          fill={muted}
        />
      )}
    </Svg>
  );
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: ink,
    lineHeight: 1.4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
    borderBottomWidth: 2,
    borderBottomColor: brand,
    paddingBottom: 16,
  },
  logo: { width: 170, height: 38, objectFit: "contain" },
  companyBlock: { alignItems: "flex-end" },
  companyName: { fontSize: 12, fontFamily: "Helvetica-Bold", color: navy, textAlign: "right" },
  companyMeta: { fontSize: 8, color: muted, marginTop: 2, textAlign: "right" },
  contactRow: { flexDirection: "row", alignItems: "flex-start", marginTop: 2 },
  docTitle: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: brand,
    textTransform: "uppercase",
    letterSpacing: 1,
    textAlign: "right",
  },
  docMeta: { fontSize: 9, color: muted, marginTop: 4, textAlign: "right" },
  internalBanner: {
    backgroundColor: internalBg,
    padding: 6,
    marginBottom: 12,
    borderRadius: 3,
    fontSize: 9,
    color: "#8B5A00",
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    textAlign: "center",
  },
  projectTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: navy,
    marginTop: 4,
    marginBottom: 12,
    textTransform: "uppercase",
    textAlign: "center",
  },
  twoCol: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  block: { width: "48%" },
  blockLabel: {
    fontSize: 8,
    color: muted,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  blockText: { fontSize: 10, color: ink },
  scopeBlock: {
    backgroundColor: "#F7F8FA",
    padding: 10,
    borderRadius: 4,
    marginBottom: 16,
  },
  table: { borderTopWidth: 1, borderTopColor: line, marginBottom: 16 },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F7F8FA",
    borderBottomWidth: 1,
    borderBottomColor: line,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  th: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: muted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  // Internal pricing pipeline — two-row card per line item.
  internalItem: {
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#EADFC2",
  },
  internalItemTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 3,
  },
  internalItemDesc: { fontSize: 9, color: ink, flex: 1, paddingRight: 12 },
  internalItemGp: { fontSize: 9, fontFamily: "Helvetica-Bold", color: navy, textAlign: "right" },
  internalMetrics: { flexDirection: "row", flexWrap: "wrap" },
  internalMetric: { fontSize: 8, color: muted, marginRight: 16, marginTop: 1 },
  internalMetricVal: { color: ink, fontFamily: "Helvetica-Bold" },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: line,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  td: { fontSize: 9, color: ink },
  specsBlock: {
    marginTop: 4,
    paddingLeft: 8,
    borderLeftWidth: 1,
    borderLeftColor: line,
    fontSize: 8,
    color: muted,
  },
  totalsBox: {
    width: "45%",
    marginLeft: "auto",
    marginTop: 8,
    padding: 12,
    backgroundColor: "#F7F8FA",
    borderRadius: 4,
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  totalsLabel: { fontSize: 9, color: muted },
  totalsValue: { fontSize: 9, color: ink },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: line,
  },
  grandTotalLabel: { fontSize: 11, fontFamily: "Helvetica-Bold", color: navy },
  grandTotalValue: { fontSize: 11, fontFamily: "Helvetica-Bold", color: navy },
  internalSection: {
    backgroundColor: internalBg,
    padding: 10,
    borderRadius: 4,
    marginTop: 12,
    marginBottom: 12,
  },
  internalLabel: {
    fontSize: 8,
    color: "#8B5A00",
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  footer: { marginTop: 24 },
  footerSectionTitle: {
    fontSize: 8,
    color: muted,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  footerText: { fontSize: 9, color: ink, marginBottom: 8 },
  termsBlock: { marginBottom: 12 },
  termRow: { flexDirection: "row", marginBottom: 3 },
  termNum: { fontSize: 9, color: muted, width: 16 },
  termText: { fontSize: 9, color: ink, flex: 1, lineHeight: 1.35 },
  signatureBlock: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 28,
  },
  signatureCol: { width: "30%", alignItems: "center" },
  signatureName: { fontSize: 10, fontFamily: "Helvetica-Bold", color: ink, marginBottom: 2 },
  signatureLine: {
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#9AA0AE",
    marginBottom: 4,
  },
  signatureLabel: {
    fontSize: 8,
    color: muted,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  pageNumber: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: muted,
  },
});

export type BillingMode = "customer" | "internal";

export interface BillingLine {
  description: string;
  partNumber?: string | null;
  specs?: string | null;
  kind?: string;
  quantity: number;
  unitPrice: number;          // grossed-up unit price (what customer sees)
  // Internal-only:
  landedCost?: number;
  financeChargePct?: number;
  markupPct?: number;
  surchargePct?: number;
  discountPct?: number;
  whtGrossUpAmount?: number;
  costLineTotal?: number;
  lineGpAmount?: number;
  lineGpMarginPct?: number;
}

export interface BillingCustomer {
  // The display name on the PDF (company commercial name or individual's name).
  name: string;
  // For COMPANY customers, the registered legal name (when different from `name`).
  legalName?: string | null;
  // Tax identification number, surfaced as "TIN: …" beneath the company block.
  taxId?: string | null;
  // Multiline billing address (line 1, line 2, "city, region, postal", country).
  addressLines?: string[];
  // Customer-level email / phone (fallback when no specific contact is set).
  email: string | null;
  phone: string | null;
  // Named contact attached to this document — when present, rendered as the
  // primary addressee (overrides attentionTo if not set).
  contact?: {
    name: string;
    role: string | null;
    email: string | null;
    phone: string | null;
  } | null;
}

export interface BillingCompany {
  companyName: string;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  country: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  taxId: string | null;
  paymentTerms: string | null;
  bankName: string | null;
  bankAccountName: string | null;
  bankAccountNo: string | null;
  bankBranch: string | null;
  bankSwift: string | null;
  momoProvider: string | null;
  momoNumber: string | null;
  momoAccountName: string | null;
  vatRegistered?: boolean;
}

export interface VatBreakdownPdf {
  nhilAmount: number;
  getfundAmount: number;
  vatStandardAmount: number;
  vatAmount: number;
  effectivePct: number;
  rates?: { standardPct: number; nhilPct: number; getfundPct: number };
}

export interface BillingDocumentProps {
  mode?: BillingMode;
  kind: "QUOTE" | "INVOICE";
  number: string;
  status: string;
  revision?: number;
  issueDate: string | Date | null;
  validUntil?: string | Date | null;
  dueDate?: string | Date | null;
  currency: string;
  subtotal: number;
  vatBreakdown?: VatBreakdownPdf | null;
  vatAmount?: number;
  nonVatTaxApplied?: boolean;
  nonVatTaxLabel?: string;
  nonVatTaxPct?: number;
  nonVatTaxAmount?: number;
  total: number;
  amountPaid?: number;

  // Internal-only aggregates
  totalGp?: number;
  totalGpMarginPct?: number;

  // FX (customer-facing footer attribution)
  fxRate?: number | null;
  fxRateSource?: string | null;
  fxRateDate?: string | Date | null;

  // WHT
  whtPct?: number;
  whtCategoryLabel?: string;

  // Customer-facing meta
  projectTitle?: string | null;
  attentionTo?: string | null;
  solutionArchitectName?: string | null;
  scopeOfWork?: string | null;
  notes?: string | null;

  // Footer / terms / signature (quotes)
  documentDate?: string | Date | null;
  preparedByName?: string | null;
  approvedByName?: string | null;
  advancePaymentPct?: number;
  projectCycleWeeks?: number;
  quoteTerms?: string | null;

  customer: BillingCustomer;
  company: BillingCompany;
  items: BillingLine[];
}

export function BillingDocument(props: BillingDocumentProps) {
  const mode: BillingMode = props.mode ?? "customer";
  const isQuote = props.kind === "QUOTE";
  const isInternal = mode === "internal";
  const logo = getLogo();

  // Assemble the quote Terms & Conditions: per-quote auto terms first, then
  // the director's editable boilerplate from Settings (or the default).
  const autoTerms: string[] = [];
  if (isQuote && props.validUntil) {
    autoTerms.push(`This quotation is valid until ${formatDate(props.validUntil)}.`);
  }
  if (isQuote && props.advancePaymentPct && props.advancePaymentPct > 0) {
    autoTerms.push(
      `${props.advancePaymentPct.toFixed(0)}% advance payment is required to confirm the order; the balance is due on delivery and acceptance.`
    );
  }
  if (isQuote && props.projectCycleWeeks && props.projectCycleWeeks > 0) {
    autoTerms.push(
      `Delivery is within ${props.projectCycleWeeks} week${props.projectCycleWeeks === 1 ? "" : "s"} of order confirmation.`
    );
  }
  const terms = isQuote
    ? [...autoTerms, ...splitTerms(props.quoteTerms || DEFAULT_QUOTE_TERMS)]
    : [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {isInternal && (
          <Text style={styles.internalBanner}>
            Internal copy — not for the customer
          </Text>
        )}

        <View style={styles.header} fixed>
          {logo ? (
            <Image src={logo} style={styles.logo} />
          ) : (
            <Text style={styles.companyName}>{props.company.companyName}</Text>
          )}
          <View style={styles.companyBlock}>
            <Text style={styles.companyName}>{props.company.companyName}</Text>
            {props.company.addressLine1 && (
              <Text style={styles.companyMeta}>{props.company.addressLine1}</Text>
            )}
            {props.company.addressLine2 && (
              <Text style={styles.companyMeta}>{props.company.addressLine2}</Text>
            )}
            {(props.company.city || props.company.country) && (
              <Text style={styles.companyMeta}>
                {[props.company.city, props.company.country].filter(Boolean).join(", ")}
              </Text>
            )}
            {props.company.phone && (
              <Text style={styles.companyMeta}>{props.company.phone}</Text>
            )}
            {props.company.email && (
              <Text style={styles.companyMeta}>{props.company.email}</Text>
            )}
            {props.company.taxId && (
              <Text style={styles.companyMeta}>TIN: {props.company.taxId}</Text>
            )}
          </View>
        </View>

        <View style={styles.twoCol}>
          <View style={styles.block}>
            <Text style={styles.blockLabel}>
              {props.attentionTo || props.customer.contact ? "Attention" : "Bill to"}
            </Text>
            {props.attentionTo && (
              <Text style={[styles.blockText, { fontFamily: "Helvetica-Bold" }]}>
                {props.attentionTo}
              </Text>
            )}
            {!props.attentionTo && props.customer.contact && (
              <Text style={[styles.blockText, { fontFamily: "Helvetica-Bold" }]}>
                {props.customer.contact.name}
                {props.customer.contact.role ? ` — ${props.customer.contact.role}` : ""}
              </Text>
            )}
            <Text
              style={
                props.attentionTo || props.customer.contact
                  ? styles.blockText
                  : [styles.blockText, { fontFamily: "Helvetica-Bold" }]
              }
            >
              {props.customer.name}
            </Text>
            {props.customer.legalName &&
              !isRedundantLegalName(props.customer.name, props.customer.legalName) && (
                <Text style={styles.blockText}>{props.customer.legalName}</Text>
              )}
            {props.customer.addressLines && props.customer.addressLines.length > 0 && (
              <View style={styles.contactRow}>
                <ContactIcon kind="pin" />
                <View style={{ flex: 1 }}>
                  {props.customer.addressLines.map((addr, i) => (
                    <Text key={`addr-${i}`} style={styles.blockText}>{addr}</Text>
                  ))}
                </View>
              </View>
            )}
            {props.customer.taxId && (
              <Text style={[styles.blockText, { marginTop: 2 }]}>TIN: {props.customer.taxId}</Text>
            )}
            {(props.customer.contact?.email || props.customer.email) && (
              <View style={styles.contactRow}>
                <ContactIcon kind="mail" />
                <Text style={[styles.blockText, { flex: 1 }]}>
                  {props.customer.contact?.email ?? props.customer.email}
                </Text>
              </View>
            )}
            {(props.customer.contact?.phone || props.customer.phone) && (
              <View style={styles.contactRow}>
                <ContactIcon kind="phone" />
                <Text style={[styles.blockText, { flex: 1 }]}>
                  {props.customer.contact?.phone ?? props.customer.phone}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.block}>
            <Text style={styles.docTitle}>{isQuote ? "Quote" : "Invoice"}</Text>
            <Text style={styles.docMeta}># {props.number}</Text>
            {props.revision && props.revision > 1 && (
              <Text style={styles.docMeta}>Revision {props.revision}</Text>
            )}
            <Text style={styles.docMeta}>Issued {formatDate(props.issueDate)}</Text>
            {isQuote && props.validUntil && (
              <Text style={styles.docMeta}>Valid until {formatDate(props.validUntil)}</Text>
            )}
            {!isQuote && props.dueDate && (
              <Text style={styles.docMeta}>Due {formatDate(props.dueDate)}</Text>
            )}
            <Text style={styles.docMeta}>{props.status.replace(/_/g, " ")}</Text>
            {props.solutionArchitectName && (
              <Text style={[styles.docMeta, { marginTop: 6 }]}>
                Solution architect: {props.solutionArchitectName}
              </Text>
            )}
          </View>
        </View>

        {props.projectTitle && (
          <Text style={styles.projectTitle}>{props.projectTitle}</Text>
        )}

        {props.scopeOfWork && (
          <View style={styles.scopeBlock}>
            <Text style={styles.blockLabel}>Scope of work</Text>
            <Text style={styles.blockText}>{props.scopeOfWork}</Text>
          </View>
        )}

        {/* Customer-facing line table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.th, { flex: 4 }]}>Description</Text>
            <Text style={[styles.th, { flex: 1, textAlign: "right" }]}>Qty</Text>
            <Text style={[styles.th, { flex: 1.5, textAlign: "right" }]}>Unit</Text>
            <Text style={[styles.th, { flex: 1.5, textAlign: "right" }]}>Amount</Text>
          </View>
          {props.items.map((item, idx) => (
            <View key={idx} style={styles.tableRow} wrap={false}>
              <View style={{ flex: 4 }}>
                <Text style={styles.td}>{item.description}</Text>
                {isInternal && item.partNumber && (
                  <Text style={[styles.td, { color: muted, fontSize: 8 }]}>
                    P/N {item.partNumber}
                  </Text>
                )}
                {item.specs && (
                  <Text style={styles.specsBlock}>{item.specs}</Text>
                )}
                {item.kind && item.kind !== "PRODUCT" && (
                  <Text style={[styles.td, { color: muted, fontSize: 8 }]}>
                    {item.kind.replace(/_/g, " ")}
                  </Text>
                )}
              </View>
              <Text style={[styles.td, { flex: 1, textAlign: "right" }]}>
                {item.quantity}
              </Text>
              <Text style={[styles.td, { flex: 1.5, textAlign: "right" }]}>
                {fmtMoney(item.unitPrice, props.currency)}
              </Text>
              <Text style={[styles.td, { flex: 1.5, textAlign: "right" }]}>
                {fmtMoney(item.quantity * item.unitPrice, props.currency)}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsBox}>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>Subtotal</Text>
            <Text style={styles.totalsValue}>
              {fmtMoney(props.subtotal, props.currency)}
            </Text>
          </View>
          {props.vatBreakdown && (
            <>
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>
                  NHIL ({(props.vatBreakdown.rates?.nhilPct ?? 2.5).toFixed(2)}%)
                </Text>
                <Text style={styles.totalsValue}>
                  {fmtMoney(props.vatBreakdown.nhilAmount, props.currency)}
                </Text>
              </View>
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>
                  GETFund ({(props.vatBreakdown.rates?.getfundPct ?? 2.5).toFixed(2)}%)
                </Text>
                <Text style={styles.totalsValue}>
                  {fmtMoney(props.vatBreakdown.getfundAmount, props.currency)}
                </Text>
              </View>
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>
                  VAT ({(props.vatBreakdown.rates?.standardPct ?? 15).toFixed(2)}%)
                </Text>
                <Text style={styles.totalsValue}>
                  {fmtMoney(props.vatBreakdown.vatStandardAmount, props.currency)}
                </Text>
              </View>
              <View style={styles.totalsRow}>
                <Text style={[styles.totalsLabel, { fontFamily: "Helvetica-Bold" }]}>
                  Total tax ({props.vatBreakdown.effectivePct.toFixed(2)}%)
                </Text>
                <Text style={[styles.totalsValue, { fontFamily: "Helvetica-Bold" }]}>
                  {fmtMoney(props.vatBreakdown.vatAmount, props.currency)}
                </Text>
              </View>
            </>
          )}
          {!props.vatBreakdown && props.nonVatTaxApplied && props.nonVatTaxAmount && props.nonVatTaxAmount > 0 && (
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>
                {props.nonVatTaxLabel ?? "Sales Tax"} ({(props.nonVatTaxPct ?? 0).toFixed(2)}%)
              </Text>
              <Text style={styles.totalsValue}>
                {fmtMoney(props.nonVatTaxAmount, props.currency)}
              </Text>
            </View>
          )}
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>Total</Text>
            <Text style={styles.grandTotalValue}>
              {fmtMoney(props.total, props.currency)}
            </Text>
          </View>
          {!isQuote && props.amountPaid !== undefined && props.amountPaid > 0 && (
            <>
              <View style={[styles.totalsRow, { marginTop: 6 }]}>
                <Text style={styles.totalsLabel}>Paid</Text>
                <Text style={styles.totalsValue}>
                  {fmtMoney(props.amountPaid, props.currency)}
                </Text>
              </View>
              <View style={styles.totalsRow}>
                <Text style={[styles.totalsLabel, { fontFamily: "Helvetica-Bold" }]}>
                  Outstanding
                </Text>
                <Text style={[styles.totalsValue, { fontFamily: "Helvetica-Bold" }]}>
                  {fmtMoney(Math.max(0, props.total - props.amountPaid), props.currency)}
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Internal-only pricing pipeline. Each line gets two rows — a
            description + GP headline, then the cost breakdown — so the figures
            are legible instead of crammed into one wide row. Kept together
            (wrap=false) so it never orphans across a page break. */}
        {isInternal && (
          <View style={styles.internalSection} wrap={false}>
            <Text style={styles.internalLabel}>
              Internal pricing pipeline — gross profit {fmtMoney(props.totalGp ?? 0, props.currency)}
              {props.totalGpMarginPct !== undefined && ` (${props.totalGpMarginPct.toFixed(1)}%)`}
            </Text>
            {props.items.map((item, idx) => (
              <View key={idx} style={styles.internalItem} wrap={false}>
                <View style={styles.internalItemTop}>
                  <Text style={styles.internalItemDesc}>{item.description}</Text>
                  <Text style={styles.internalItemGp}>
                    GP {fmtMoney(item.lineGpAmount ?? 0, props.currency)} ·{" "}
                    {(item.lineGpMarginPct ?? 0).toFixed(1)}%
                  </Text>
                </View>
                <View style={styles.internalMetrics}>
                  <Text style={styles.internalMetric}>
                    Landed{" "}
                    <Text style={styles.internalMetricVal}>
                      {fmtMoney(item.landedCost ?? 0, props.currency)}
                    </Text>
                  </Text>
                  <Text style={styles.internalMetric}>
                    Surcharge{" "}
                    <Text style={styles.internalMetricVal}>
                      {(item.surchargePct ?? 0).toFixed(2)}%
                    </Text>
                  </Text>
                  <Text style={styles.internalMetric}>
                    Finance{" "}
                    <Text style={styles.internalMetricVal}>
                      {(item.financeChargePct ?? 0).toFixed(2)}%
                    </Text>
                  </Text>
                  <Text style={styles.internalMetric}>
                    Markup{" "}
                    <Text style={styles.internalMetricVal}>
                      {(item.markupPct ?? 0).toFixed(2)}%
                    </Text>
                  </Text>
                  <Text style={styles.internalMetric}>
                    Cost{" "}
                    <Text style={styles.internalMetricVal}>
                      {fmtMoney(item.costLineTotal ?? 0, props.currency)}
                    </Text>
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.footer}>
          {/* Quote terms (auto + editable boilerplate) as a numbered list */}
          {isQuote && terms.length > 0 && (
            <View style={styles.termsBlock} wrap={false}>
              <Text style={styles.footerSectionTitle}>Terms &amp; conditions</Text>
              {terms.map((term, i) => (
                <View key={i} style={styles.termRow}>
                  <Text style={styles.termNum}>{i + 1}.</Text>
                  <Text style={styles.termText}>{term}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Invoice payment terms */}
          {!isQuote && props.company.paymentTerms && (
            <>
              <Text style={styles.footerSectionTitle}>Payment terms</Text>
              <Text style={styles.footerText}>{props.company.paymentTerms}</Text>
            </>
          )}

          {/* Payment details — shown on quotes and invoices */}
          {(props.company.bankName || props.company.momoProvider) && (
            <>
              <Text style={styles.footerSectionTitle}>Payment details</Text>
              {props.company.bankName && (
                <Text style={styles.footerText}>
                  Bank: {props.company.bankName}
                  {props.company.bankBranch ? ` (${props.company.bankBranch})` : ""}
                  {"\n"}Account name: {props.company.bankAccountName ?? "—"}
                  {"\n"}Account number: {props.company.bankAccountNo ?? "—"}
                  {props.company.bankSwift ? `\nSWIFT/BIC: ${props.company.bankSwift}` : ""}
                </Text>
              )}
              {props.company.momoProvider && (
                <Text style={styles.footerText}>
                  Mobile money ({props.company.momoProvider}): {props.company.momoNumber} ·{" "}
                  {props.company.momoAccountName}
                </Text>
              )}
            </>
          )}

          {props.fxRate && props.currency !== "USD" && (
            <Text style={[styles.footerText, { fontSize: 8, color: muted }]}>
              FX rate: 1 USD = {props.fxRate} {props.currency}
              {props.fxRateSource ? ` (source: ${props.fxRateSource})` : ""}
              {props.fxRateDate ? ` on ${formatDate(props.fxRateDate)}` : ""}
            </Text>
          )}
          {props.notes && isInternal && (
            <>
              <Text style={styles.footerSectionTitle}>Internal notes</Text>
              <Text style={styles.footerText}>{props.notes}</Text>
            </>
          )}

          {/* Signature block (quotes) */}
          {isQuote && (
            <View style={styles.signatureBlock} wrap={false}>
              <View style={styles.signatureCol}>
                <Text style={styles.signatureName}>{props.preparedByName ?? " "}</Text>
                <View style={styles.signatureLine} />
                <Text style={styles.signatureLabel}>Prepared by</Text>
              </View>
              <View style={styles.signatureCol}>
                <Text style={styles.signatureName}>{props.approvedByName ?? " "}</Text>
                <View style={styles.signatureLine} />
                <Text style={styles.signatureLabel}>Approved by</Text>
              </View>
              <View style={styles.signatureCol}>
                <Text style={styles.signatureName}>
                  {props.documentDate ? formatDate(props.documentDate) : " "}
                </Text>
                <View style={styles.signatureLine} />
                <Text style={styles.signatureLabel}>Date</Text>
              </View>
            </View>
          )}
        </View>

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `Page ${pageNumber} of ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
}
