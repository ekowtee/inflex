import type { Formation } from "../components/PageHero";

/**
 * The hero still for each Academy domain, and so for its programmes: an
 * object of the domain's own subject, none shared with a solution page
 * (owner, 25 September 2026).
 */
const DOMAIN_FORMATION: Record<string, Formation> = {
  "ai-intelligent-systems": "neural-net",
  "infrastructure-cloud": "rack",
  "cybersecurity-compliance": "padlock",
  "digital-strategy": "pawn",
};

export const domainFormation = (slug: string): Formation => DOMAIN_FORMATION[slug] ?? "open-book";
