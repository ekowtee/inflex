import SolutionPage from "../../components/SolutionPage";

/* Content only. The layout, the tokens and the alternating rule live in
   components/SolutionPage.tsx. */

const capabilities = [
  "Cloud Strategy & Roadmapping",
  "Migration Services (Lift & Shift, Re-platform, Re-architect)",
  "Hybrid & Multi-Cloud Integration",
  "Cloud Cost Optimisation (FinOps)",
  "Cloud-Native Application Development",
  "Managed Cloud Operations",
] as const;

const benefits = [
  {
    title: "40% Average Cost Reduction",
    description: "FinOps practices and right-sizing ensure you only pay for what you use.",
  },
  {
    title: "Vendor Agnostic",
    description: "We recommend what works for your business, not what pays us the highest margin.",
  },
  {
    title: "Zero-Downtime Migration",
    description: "Proven methodologies ensure seamless transitions with no business disruption.",
  },
] as const;

export default function CloudServicesPage() {
  return (
    <SolutionPage
      slug="cloud-services"
      formation={3}
      title={"Cloud Services"}
      lead={"Strategic cloud solutions that accelerate innovation and reduce complexity."}
      overviewHeading={"Harnessing the Power and Agility of the Cloud"}
      overviewBody={"Navigate your cloud journey with confidence. Whether you're migrating legacy workloads, building cloud-native applications, or optimising multi-cloud spend, we architect solutions across AWS, Azure, and Google Cloud that deliver scalability, cost-efficiency, and competitive speed."}
      overviewImage={"/assets/solutions/sol7.webp"}
      imageSide="right"
      capabilities={capabilities}
      cta={"Plan Your Cloud Journey"}
      benefitsHeading={"Why Leading Enterprises Choose Us"}
      benefitsLead={"Cloud solutions architected for performance, cost-efficiency, and business agility."}
      benefits={benefits}
    />
  );
}
