import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { formatDate, formatMoney } from "../serialize";

const brand = "#BD2E25";
const navy = "#1B3764";
const ink = "#171A20";
const muted = "#5C6280";
const line = "#E6E6E6";
const internalBg = "#FFF7E6";

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
    marginBottom: 24,
    borderBottomWidth: 2,
    borderBottomColor: brand,
    paddingBottom: 16,
  },
  companyName: { fontSize: 14, fontFamily: "Helvetica-Bold", color: navy },
  companyMeta: { fontSize: 9, color: muted, marginTop: 2 },
  docTitle: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: brand,
    textTransform: "uppercase",
    letterSpacing: 1,
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
    marginBottom: 12,
    textTransform: "uppercase",
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
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
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

  customer: BillingCustomer;
  company: BillingCompany;
  items: BillingLine[];
}

export function BillingDocument(props: BillingDocumentProps) {
  const mode: BillingMode = props.mode ?? "customer";
  const isQuote = props.kind === "QUOTE";
  const isInternal = mode === "internal";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {isInternal && (
          <Text style={styles.internalBanner}>
            Internal copy — not for the customer
          </Text>
        )}

        <View style={styles.header} fixed>
          <View>
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
            {props.company.email && (
              <Text style={styles.companyMeta}>{props.company.email}</Text>
            )}
            {props.company.phone && (
              <Text style={styles.companyMeta}>{props.company.phone}</Text>
            )}
            {props.company.taxId && (
              <Text style={styles.companyMeta}>Tax ID: {props.company.taxId}</Text>
            )}
          </View>
          <View>
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
          </View>
        </View>

        {props.projectTitle && (
          <Text style={styles.projectTitle}>{props.projectTitle}</Text>
        )}

        <View style={styles.twoCol}>
          <View style={styles.block}>
            <Text style={styles.blockLabel}>
              {props.attentionTo ? "Attention" : "Bill to"}
            </Text>
            {props.attentionTo && (
              <Text style={[styles.blockText, { fontFamily: "Helvetica-Bold" }]}>
                {props.attentionTo}
              </Text>
            )}
            <Text
              style={
                props.attentionTo
                  ? styles.blockText
                  : [styles.blockText, { fontFamily: "Helvetica-Bold" }]
              }
            >
              {props.customer.name}
            </Text>
            {props.customer.company && (
              <Text style={styles.blockText}>{props.customer.company}</Text>
            )}
            {props.customer.email && (
              <Text style={styles.blockText}>{props.customer.email}</Text>
            )}
            {props.customer.phone && (
              <Text style={styles.blockText}>{props.customer.phone}</Text>
            )}
          </View>
          {props.solutionArchitectName && (
            <View style={styles.block}>
              <Text style={styles.blockLabel}>Solution architect</Text>
              <Text style={styles.blockText}>{props.solutionArchitectName}</Text>
            </View>
          )}
        </View>

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
                {formatMoney(item.unitPrice, props.currency)}
              </Text>
              <Text style={[styles.td, { flex: 1.5, textAlign: "right" }]}>
                {formatMoney(item.quantity * item.unitPrice, props.currency)}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsBox}>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>Subtotal</Text>
            <Text style={styles.totalsValue}>
              {formatMoney(props.subtotal, props.currency)}
            </Text>
          </View>
          {props.vatBreakdown && (
            <>
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>
                  NHIL ({(props.vatBreakdown.rates?.nhilPct ?? 2.5).toFixed(2)}%)
                </Text>
                <Text style={styles.totalsValue}>
                  {formatMoney(props.vatBreakdown.nhilAmount, props.currency)}
                </Text>
              </View>
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>
                  GETFund ({(props.vatBreakdown.rates?.getfundPct ?? 2.5).toFixed(2)}%)
                </Text>
                <Text style={styles.totalsValue}>
                  {formatMoney(props.vatBreakdown.getfundAmount, props.currency)}
                </Text>
              </View>
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>
                  VAT ({(props.vatBreakdown.rates?.standardPct ?? 15).toFixed(2)}%)
                </Text>
                <Text style={styles.totalsValue}>
                  {formatMoney(props.vatBreakdown.vatStandardAmount, props.currency)}
                </Text>
              </View>
              <View style={styles.totalsRow}>
                <Text style={[styles.totalsLabel, { fontFamily: "Helvetica-Bold" }]}>
                  Total tax ({props.vatBreakdown.effectivePct.toFixed(2)}%)
                </Text>
                <Text style={[styles.totalsValue, { fontFamily: "Helvetica-Bold" }]}>
                  {formatMoney(props.vatBreakdown.vatAmount, props.currency)}
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
                {formatMoney(props.nonVatTaxAmount, props.currency)}
              </Text>
            </View>
          )}
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>Total</Text>
            <Text style={styles.grandTotalValue}>
              {formatMoney(props.total, props.currency)}
            </Text>
          </View>
          {!isQuote && props.amountPaid !== undefined && props.amountPaid > 0 && (
            <>
              <View style={[styles.totalsRow, { marginTop: 6 }]}>
                <Text style={styles.totalsLabel}>Paid</Text>
                <Text style={styles.totalsValue}>
                  {formatMoney(props.amountPaid, props.currency)}
                </Text>
              </View>
              <View style={styles.totalsRow}>
                <Text style={[styles.totalsLabel, { fontFamily: "Helvetica-Bold" }]}>
                  Outstanding
                </Text>
                <Text style={[styles.totalsValue, { fontFamily: "Helvetica-Bold" }]}>
                  {formatMoney(Math.max(0, props.total - props.amountPaid), props.currency)}
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Internal-only pricing pipeline */}
        {isInternal && (
          <View style={styles.internalSection}>
            <Text style={styles.internalLabel}>
              Internal pricing pipeline — gross profit {formatMoney(props.totalGp ?? 0, props.currency)}
              {props.totalGpMarginPct !== undefined && ` (${props.totalGpMarginPct.toFixed(1)}%)`}
            </Text>
            <View style={styles.tableHeader}>
              <Text style={[styles.th, { flex: 3 }]}>Description</Text>
              <Text style={[styles.th, { flex: 1.5, textAlign: "right" }]}>Landed</Text>
              <Text style={[styles.th, { flex: 1, textAlign: "right" }]}>Fin %</Text>
              <Text style={[styles.th, { flex: 1, textAlign: "right" }]}>Markup %</Text>
              <Text style={[styles.th, { flex: 1.5, textAlign: "right" }]}>Cost total</Text>
              <Text style={[styles.th, { flex: 1.5, textAlign: "right" }]}>GP</Text>
              <Text style={[styles.th, { flex: 1, textAlign: "right" }]}>GP%</Text>
            </View>
            {props.items.map((item, idx) => (
              <View key={idx} style={styles.tableRow} wrap={false}>
                <Text style={[styles.td, { flex: 3 }]}>{item.description}</Text>
                <Text style={[styles.td, { flex: 1.5, textAlign: "right" }]}>
                  {formatMoney(item.landedCost ?? 0, props.currency)}
                </Text>
                <Text style={[styles.td, { flex: 1, textAlign: "right" }]}>
                  {(item.financeChargePct ?? 0).toFixed(2)}%
                </Text>
                <Text style={[styles.td, { flex: 1, textAlign: "right" }]}>
                  {(item.markupPct ?? 0).toFixed(2)}%
                </Text>
                <Text style={[styles.td, { flex: 1.5, textAlign: "right" }]}>
                  {formatMoney(item.costLineTotal ?? 0, props.currency)}
                </Text>
                <Text style={[styles.td, { flex: 1.5, textAlign: "right" }]}>
                  {formatMoney(item.lineGpAmount ?? 0, props.currency)}
                </Text>
                <Text style={[styles.td, { flex: 1, textAlign: "right" }]}>
                  {(item.lineGpMarginPct ?? 0).toFixed(1)}%
                </Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.footer}>
          {!isQuote && props.company.paymentTerms && (
            <>
              <Text style={styles.footerSectionTitle}>Payment terms</Text>
              <Text style={styles.footerText}>{props.company.paymentTerms}</Text>
            </>
          )}
          {!isQuote && (props.company.bankName || props.company.momoProvider) && (
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
          {props.whtPct && props.whtPct > 0 && (
            <Text style={styles.footerText}>
              Withholding tax of {props.whtPct.toFixed(2)}%
              {props.whtCategoryLabel ? ` (${props.whtCategoryLabel})` : ""} is
              included in the unit prices above as required by the Ghana Revenue
              Authority. Deduct and remit this amount on our behalf when paying.
            </Text>
          )}
          {props.company.vatRegistered === false && (
            <Text style={[styles.footerText, { fontSize: 8, color: muted }]}>
              {props.company.companyName} is currently not VAT-registered.
            </Text>
          )}
          {props.fxRate && (
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
