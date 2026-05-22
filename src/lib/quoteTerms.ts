// Boilerplate Terms & Conditions for quote PDFs. The director can override
// these in Settings (one term per line). Per-quote terms — validity, payment
// schedule, delivery lead time, and the FX clause — are generated from each
// quote and printed ahead of these.
export const DEFAULT_QUOTE_TERMS = [
  "Prices are exclusive of any taxes or levies not itemized above.",
  "Goods and services are supplied subject to availability at the time of order confirmation.",
  "All equipment supplied and installed remains the property of Inflexions I.T. Services Ltd. until full payment is received.",
].join("\n");

/** Split a free-text terms blob into trimmed, non-empty lines. */
export function splitTerms(text: string | null | undefined): string[] {
  return (text ?? "")
    .split(/\r?\n/)
    .map((t) => t.trim())
    .filter(Boolean);
}
