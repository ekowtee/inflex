import type { MetadataRoute } from "next";
import { caseStudies } from "./data";
import { domains, programmes } from "./academy/data";

const SITE_URL = "https://inflexions.tech";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/about",
    "/solutions",
    "/solutions/network-infrastructure",
    "/solutions/data-security",
    "/solutions/cloud-services",
    "/solutions/data-centric-solutions",
    "/services",
    "/services/professional",
    "/services/managed",
    "/services/support",
    "/academy",
    "/academy/for-organizations",
    "/careers",
    "/contact",
    "/case-study",
    "/resources",
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: (route === "" ? "weekly" : "monthly") as
      | "weekly"
      | "monthly",
    priority: route === "" ? 1.0 : 0.8,
  }));

  const caseStudyRoutes = caseStudies.map((study) => ({
    url: `${SITE_URL}/case-studies/${study.id}`,
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  const academyDomainRoutes = domains.map((domain) => ({
    url: `${SITE_URL}/academy/${domain.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const academyProgrammeRoutes = programmes.map((programme) => ({
    url: `${SITE_URL}/academy/${programme.domainSlug}/${programme.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...caseStudyRoutes,
    ...academyDomainRoutes,
    ...academyProgrammeRoutes,
  ];
}
