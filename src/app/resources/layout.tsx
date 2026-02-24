import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Insights, guides, and thought leadership on enterprise IT, cloud, cybersecurity, and AI-driven technology solutions from Inflexions I.T. Services.",
  alternates: { canonical: "/resources" },
  openGraph: {
    title: "Resources",
    description:
      "Insights, guides, and thought leadership on enterprise IT, cloud, cybersecurity, and AI-driven technology solutions.",
    url: "/resources",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
