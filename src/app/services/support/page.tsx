import ServicePage from "../../components/ServicePage";

/* Content only. The layout and the tokens live in
   components/ServicePage.tsx. */

const included = [
  "Multi-Tier Support (L1, L2, L3)",
  "AI-Powered Ticketing & Automated Diagnostics",
  "Self-Service Portal & Knowledge Base",
  "On-Site & Remote Break/Fix Support",
  "Hardware & Software Troubleshooting",
  "Escalation Management & SLA Tracking",
] as const;

const steps = [
  {
    title: "Report",
    description: "Submit issues via phone, email, self-service portal, or automated alerting. AI-powered triage routes tickets to the right team instantly.",
  },
  {
    title: "Resolve",
    description: "Our technicians diagnose and fix issues with speed and precision \u2014 remotely or on-site \u2014 with real-time status updates throughout.",
  },
  {
    title: "Review",
    description: "Post-resolution analysis identifies root causes and prevention measures. Monthly reporting tracks SLA performance and recurring trends.",
  },
] as const;

export default function SupportServicesPage() {
  return (
    <ServicePage
      title={"Support Services"}
      lead={"Fast, reliable technical support when it matters most."}
      overviewHeading={"Responsive Support. Minimal Disruption."}
      overviewBody={"Ensure business continuity with intelligent, responsive technical support. Our Support Services leverage AI-powered ticketing, automated diagnostics, and self-service portals alongside experienced technicians who resolve issues fast \u2014 so your teams stay productive and your operations keep running."}
      included={included}
      idealFor={"Businesses that need reliable, SLA-backed technical support to complement their internal IT team \u2014 without the overhead of building a full support operation."}
      cta={"View Support Tiers"}
      image={"/assets/services/Services3.webp"}
      stepsHeading={"How It Works"}
      steps={steps}
    />
  );
}
