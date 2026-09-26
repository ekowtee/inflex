/**
 * The open roles, shared by Featured Jobs on /careers and the list on /jobs
 * so the two cannot drift. Descriptions are the approved copy, verbatim.
 */

/**
 * Where applications go. The application form on /jobs and /internships
 * posts to /api/careers/apply, which emails the CV here (overridable with
 * MAIL_TO_CAREERS) and names it as the fallback if the form fails.
 */
export const APPLY_EMAIL = "info@inflexions.tech";

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
    // Analysts at a security operations wall (also the Support services
    // image). career4.png, a circuit board, read as a network card; it is
    // now in archive/public-assets/career/.
    image: "/assets/services/Services3.webp",
    description:
      "Protect enterprise infrastructure with proactive threat monitoring, incident response, and compliance frameworks. Join our Security Operations Centre and defend what matters most.",
  },
] as const;

export type RoleId = (typeof roles)[number]["id"];

/** What an application can be for: an open role, an internship, or neither. */
export type ApplicationRoleId = RoleId | "internship" | "open-application";

export const applicationRoles: ReadonlyArray<{ id: ApplicationRoleId; label: string }> = [
  ...roles.map((r) => ({ id: r.id, label: r.title })),
  { id: "internship", label: "Internship" },
  { id: "open-application", label: "Open application" },
];

export const APPLICATION_ROLE_IDS = applicationRoles.map((r) => r.id) as [
  ApplicationRoleId,
  ...ApplicationRoleId[],
];

export function applicationRoleLabel(id: string): string {
  return applicationRoles.find((r) => r.id === id)?.label ?? id;
}
