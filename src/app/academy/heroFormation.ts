import type { Formation } from "../components/PageHero";

/**
 * The hero still for each Academy domain, and so for its programmes: the
 * shape of the domain's subject (PageHero's Formation map).
 */
const DOMAIN_FORMATION: Record<string, Formation> = {
  "ai-intelligent-systems": 3,
  "infrastructure-cloud": 1,
  "cybersecurity-compliance": 2,
  "digital-strategy": "curve",
};

export const domainFormation = (slug: string): Formation => DOMAIN_FORMATION[slug] ?? 3;
