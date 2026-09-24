import SolutionPage from "../../components/SolutionPage";

/* Content only. The layout, the tokens and the alternating rule live in
   components/SolutionPage.tsx. */

const capabilities = [
  "Security Assessments & Penetration Testing",
  "Threat Detection & Response (MDR)",
  "Compliance & Governance Frameworks",
  "Identity & Access Management (IAM)",
  "Data Loss Prevention (DLP)",
  "Security Awareness Training",
] as const;

const benefits = [
  {
    title: "Proactive Defence",
    description: "AI-driven threat intelligence detects and neutralises attacks before they impact operations.",
  },
  {
    title: "Regulatory Compliance",
    description: "Pre-built frameworks for ISO 27001, GDPR, PCI-DSS, and industry-specific regulations.",
  },
  {
    title: "Rapid Response",
    description: "Average incident response time under 15 minutes with our dedicated security operations centre.",
  },
] as const;

export default function DataSecurityPage() {
  return (
    <SolutionPage
      slug="data-security"
      formation={2}
      title={"Data Security"}
      lead={"End-to-end protection for your most critical digital assets."}
      overviewHeading={"Comprehensive Threat Protection, Around the Clock"}
      overviewBody={"Cyber threats evolve daily. Your defences must evolve faster. We deliver comprehensive security assessments, continuous threat monitoring, rapid incident response, and compliance frameworks that protect your data, infrastructure, and reputation \u2014 24/7/365."}
      overviewImage={"/assets/solutions/sol3.webp"}
      imageSide="left"
      capabilities={capabilities}
      cta={"Strengthen Your Security Posture"}
      benefitsHeading={"Why Leading Enterprises Choose Us"}
      benefitsLead={"Enterprise-grade security solutions that protect what matters most."}
      benefits={benefits}
    />
  );
}
