import SolutionPage from "../../components/SolutionPage";

/* Content only. The layout, the tokens and the alternating rule live in
   components/SolutionPage.tsx. */

const capabilities = [
  "LAN & WAN Architecture Design",
  "SD-WAN Deployment & Optimisation",
  "Enterprise Wireless Solutions",
  "Network Security & Segmentation",
  "Performance Monitoring & Analytics",
  "24/7 Network Operations Centre (NOC)",
] as const;

const benefits = [
  {
    title: "99.9% Uptime",
    description: "Redundant architectures and proactive monitoring ensure your network never becomes the bottleneck.",
  },
  {
    title: "Scalable by Design",
    description: "Infrastructure that grows with your business \u2014 from a single office to a global enterprise.",
  },
  {
    title: "Zero Trust Security",
    description: "Micro-segmentation and identity-based access controls embedded at the network layer.",
  },
] as const;

export default function NetworkInfrastructurePage() {
  return (
    <SolutionPage
      slug="network-infrastructure"
      formation={1}
      title={"Network Infrastructure"}
      lead={"Secure, high-performance connectivity engineered for enterprise scale."}
      overviewHeading={"Building Your High-Performance Digital Backbone"}
      overviewBody={"Your network is the foundation of every digital initiative. We design, implement, and manage LAN, WAN, SD-WAN, and wireless solutions that deliver seamless connectivity, optimal performance, and robust security across every site, every device, and every user."}
      overviewImage={"/assets/solutions/sol2.webp"}
      imageSide="right"
      capabilities={capabilities}
      cta={"Discuss Your Network Strategy"}
      benefitsHeading={"Why Leading Enterprises Choose Us"}
      benefitsLead={"Purpose-built network solutions that deliver measurable business outcomes."}
      benefits={benefits}
    />
  );
}
