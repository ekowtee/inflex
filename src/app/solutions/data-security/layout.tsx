import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Security",
  description:
    "Comprehensive data security solutions: endpoint protection, SIEM, identity management, data loss prevention, and compliance.",
  alternates: { canonical: "/solutions/data-security" },
  openGraph: {
    title: "Data Security",
    description:
      "Comprehensive data security solutions: endpoint protection, SIEM, identity management, and compliance.",
    url: "/solutions/data-security",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
