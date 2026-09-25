import SolutionPage from "../../components/SolutionPage";

/* Content only. The layout, the tokens and the alternating rule live in
   components/SolutionPage.tsx. */

const capabilities = [
  "Data Architecture & Governance",
  "Business Intelligence & Reporting",
  "Predictive Analytics & Machine Learning",
  "AI-Driven Process Automation",
  "Real-Time Data Pipelines",
  "Data Lake & Warehouse Design",
] as const;

const benefits = [
  {
    title: "AI-Powered Insights",
    description: "Machine learning models that surface opportunities and risks before your competitors see them.",
  },
  {
    title: "Single Source of Truth",
    description: "Unified data platforms that eliminate silos and give every stakeholder the same picture.",
  },
  {
    title: "Measurable ROI",
    description: "Every analytics initiative is tied to a business outcome \u2014 no dashboards for dashboard's sake.",
  },
] as const;

export default function DataCentricSolutionsPage() {
  return (
    <SolutionPage
      slug="data-centric-solutions"
      formation={4}
      title={"Data-centric Solutions"}
      lead={"Turn raw data into your most powerful strategic asset."}
      overviewHeading={"Intelligence That Drives Decisions"}
      overviewBody={"Data without insight is just noise. We build the infrastructure, pipelines, and analytical capabilities that transform your raw data into actionable intelligence \u2014 from predictive analytics dashboards to AI-driven automation that gives leadership the clarity to act with confidence."}
      overviewImage={"/assets/solutions/sol1.webp"}
      imageSide="left"
      capabilities={capabilities}
      cta={"Unlock Your Data Potential"}
      benefitsHeading={"Why Leading Enterprises Choose Us"}
      benefitsLead={"Data solutions that turn information into competitive advantage."}
      benefits={benefits}
    />
  );
}
