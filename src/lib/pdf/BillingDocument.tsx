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
  totalsBox: {
    width: "40%",
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
  footer: { marginTop: 32 },
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

export interface BillingLine {
  description: string;
  category: string;
  quantity: number;
  unitPrice: number;
  recurring: string;
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
}

export interface BillingDocumentProps {
  kind: "QUOTE" | "INVOICE";
  number: string;
  status: string;
  issueDate: string | Date | null;
  validUntil?: string | Date | null;
  dueDate?: string | Date | null;
  currency: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  total: number;
  amountPaid?: number;
  scopeOfWork?: string | null;
  notes?: string | null;
  customer: BillingCustomer;
  company: BillingCompany;
  items: BillingLine[];
}

export function BillingDocument(props: BillingDocumentProps) {
  const isQuote = props.kind === "QUOTE";
  return (
    <Document>
      <Page size="A4" style={styles.page}>
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
            <Text style={styles.docMeta}>
              Issued {formatDate(props.issueDate)}
            </Text>
            {isQuote && props.validUntil && (
              <Text style={styles.docMeta}>
                Valid until {formatDate(props.validUntil)}
              </Text>
            )}
            {!isQuote && props.dueDate && (
              <Text style={styles.docMeta}>Due {formatDate(props.dueDate)}</Text>
            )}
            <Text style={styles.docMeta}>{props.status}</Text>
          </View>
        </View>

        <View style={styles.twoCol}>
          <View style={styles.block}>
            <Text style={styles.blockLabel}>Bill to</Text>
            <Text style={[styles.blockText, { fontFamily: "Helvetica-Bold" }]}>
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
        </View>

        {props.scopeOfWork && (
          <View style={styles.scopeBlock}>
            <Text style={styles.blockLabel}>Scope of work</Text>
            <Text style={styles.blockText}>{props.scopeOfWork}</Text>
          </View>
        )}

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
                {(item.category || item.recurring !== "NONE") && (
                  <Text style={[styles.td, { color: muted, fontSize: 8 }]}>
                    {item.category.replace(/_/g, " ")}
                    {item.recurring !== "NONE" && ` · ${item.recurring.toLowerCase()}`}
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

        <View style={styles.totalsBox}>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>Subtotal</Text>
            <Text style={styles.totalsValue}>
              {formatMoney(props.subtotal, props.currency)}
            </Text>
          </View>
          {props.discount > 0 && (
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Discount</Text>
              <Text style={styles.totalsValue}>
                − {formatMoney(props.discount, props.currency)}
              </Text>
            </View>
          )}
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>
              Tax ({props.taxRate.toFixed(2)}%)
            </Text>
            <Text style={styles.totalsValue}>
              {formatMoney(props.taxAmount, props.currency)}
            </Text>
          </View>
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
                  {formatMoney(
                    Math.max(0, props.total - props.amountPaid),
                    props.currency
                  )}
                </Text>
              </View>
            </>
          )}
        </View>

        <View style={styles.footer}>
          {!isQuote && props.company.paymentTerms && (
            <>
              <Text style={styles.footerSectionTitle}>Payment terms</Text>
              <Text style={styles.footerText}>{props.company.paymentTerms}</Text>
            </>
          )}
          {!isQuote &&
            (props.company.bankName || props.company.momoProvider) && (
              <>
                <Text style={styles.footerSectionTitle}>Payment details</Text>
                {props.company.bankName && (
                  <Text style={styles.footerText}>
                    Bank: {props.company.bankName}
                    {props.company.bankBranch ? ` (${props.company.bankBranch})` : ""}
                    {"\n"}Account name: {props.company.bankAccountName ?? "—"}
                    {"\n"}Account number: {props.company.bankAccountNo ?? "—"}
                    {props.company.bankSwift
                      ? `\nSWIFT/BIC: ${props.company.bankSwift}`
                      : ""}
                  </Text>
                )}
                {props.company.momoProvider && (
                  <Text style={styles.footerText}>
                    Mobile money ({props.company.momoProvider}):{" "}
                    {props.company.momoNumber} · {props.company.momoAccountName}
                  </Text>
                )}
              </>
            )}
          {props.notes && (
            <>
              <Text style={styles.footerSectionTitle}>Notes</Text>
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
