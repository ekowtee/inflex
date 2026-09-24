import ServicePage from "../../components/ServicePage";

/* Content only. The layout and the tokens live in
   components/ServicePage.tsx. */

const included = [
  "IT Assessments & Technology Audits",
  "AI Strategy Workshops & Automation Roadmaps",
  "Solution Architecture & Design",
  "Cloud Migration Planning & Execution",
  "Digital Transformation Consulting",
  "Infrastructure Implementation & Upgrades",
] as const;

const steps = [
  {
    title: "Discover",
    description: "We conduct a thorough assessment of your current environment, business goals, and pain points to define a clear scope of work.",
  },
  {
    title: "Design",
    description: "Our architects create a tailored solution blueprint with timelines, milestones, risk mitigation, and measurable success criteria.",
  },
  {
    title: "Deliver",
    description: "We execute with precision, provide knowledge transfer to your team, and ensure a smooth handoff with 30-day post-deployment support.",
  },
] as const;

export default function ProfessionalServicesPage() {
  return (
    <ServicePage
      title={"Professional Services"}
      lead={"Expert guidance for high-stakes IT initiatives and digital transformation."}
      overviewHeading={"Strategic Consulting. Flawless Execution."}
      overviewBody={"Leverage our deep technical expertise for specific projects and strategic consulting. From AI strategy workshops and automation opportunity assessments to complex cloud migrations and infrastructure overhauls \u2014 our Professional Services team delivers on time, on budget, and on point."}
      included={included}
      idealFor={"Businesses needing expert help with digital transformation strategy, AI adoption, automation implementation, technology migrations, or strategic IT planning."}
      cta={"Start a Conversation"}
      image={"/assets/services/Services1.webp"}
      stepsHeading={"How It Works"}
      steps={steps}
    />
  );
}
