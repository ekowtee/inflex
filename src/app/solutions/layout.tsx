import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "Enterprise technology solutions: network infrastructure, data security, cloud services, and data-centric solutions. Zero compromise.",
  alternates: { canonical: "/solutions" },
  openGraph: {
    title: "Solutions",
    description:
      "Enterprise technology solutions: network infrastructure, data security, cloud services, and data-centric solutions.",
    url: "/solutions",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
