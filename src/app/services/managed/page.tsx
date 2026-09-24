import ServicePage from "../../components/ServicePage";

/* Content only. The layout and the tokens live in
   components/ServicePage.tsx. */

const included = [
  "AIOps-Driven 24/7 Monitoring & Alerting",
  "Automated Remediation & Patch Management",
  "Security Oversight & Threat Response",
  "Helpdesk & End-User Support",
  "Monthly Performance Reports & SLA Reviews",
  "Dedicated Account Manager",
] as const;

const steps = [
  {
    title: "Onboard",
    description: "We audit your environment, define SLA tiers, integrate monitoring tools, and assign your dedicated team within the first two weeks.",
  },
  {
    title: "Operate",
    description: "Our NOC and SOC teams proactively manage your infrastructure with AIOps-driven monitoring, automated remediation, and 24/7 support.",
  },
  {
    title: "Optimise",
    description: "Monthly reviews identify performance improvements, cost savings, and technology upgrade opportunities to keep your stack evolving.",
  },
] as const;

export default function ManagedServicesPage() {
  return (
    <ServicePage
      title={"Managed Services"}
      lead={"Proactive management. Predictable costs. Peace of mind."}
      overviewHeading={"Your IT Operations, Our Obsession."}
      overviewBody={"Outsource the day-to-day management of your IT infrastructure to Inflexions. Our Managed Services combine AIOps-driven monitoring, automated remediation, intelligent alerting, and dedicated account management \u2014 so you get predictable costs, near-zero downtime, and the freedom to focus on what matters."}
      included={included}
      idealFor={"Organisations that want to offload IT management complexity, reduce operational risk, and guarantee SLA-backed uptime without expanding internal headcount."}
      cta={"Get Your Custom Quote"}
      image={"/assets/services/Services2.webp"}
      stepsHeading={"How It Works"}
      steps={steps}
    />
  );
}
