/**
 * The open roles, shared by Featured Jobs on /careers and the list on /jobs
 * so the two cannot drift. Descriptions are the approved copy, verbatim.
 */

/** Where applications go. A mailto, not the contact form, so a CV can travel with it. */
export const APPLY_EMAIL = "info@inflexions.tech";

export const applyHref = (subject: string) =>
  `mailto:${APPLY_EMAIL}?subject=${encodeURIComponent(subject)}`;

export const roles = [
  {
    id: "network-engineer",
    title: "Network Engineer",
    image: "/assets/career/career2.png",
    description:
      "Design, deploy, and manage enterprise LAN, WAN, and SD-WAN solutions for clients across Ghana. Work with Cisco, Huawei, and next-gen wireless platforms at scale.",
  },
  {
    id: "cloud-solutions-architect",
    title: "Cloud Solutions Architect",
    image: "/assets/career/career3.png",
    description:
      "Architect hybrid and multi-cloud environments across AWS, Azure, and Google Cloud. Lead migration strategies that deliver scalability, security, and measurable cost savings.",
  },
  {
    id: "cybersecurity-analyst",
    title: "Cybersecurity Analyst",
    image: "/assets/career/career4.png",
    description:
      "Protect enterprise infrastructure with proactive threat monitoring, incident response, and compliance frameworks. Join our Security Operations Centre and defend what matters most.",
  },
] as const;
