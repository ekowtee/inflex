import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Managed Services",
  description:
    "Proactive IT management with AIOps-driven monitoring, automated remediation, and dedicated account management. Predictable costs, near-zero downtime.",
  alternates: { canonical: "/services/managed" },
  openGraph: {
    title: "Managed Services",
    description:
      "Proactive IT management with AIOps-driven monitoring, automated remediation, and dedicated account management.",
    url: "/services/managed",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
