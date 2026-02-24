import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support Services",
  description:
    "Fast, reliable technical support: multi-tier (L1–L3), AI-powered ticketing, automated diagnostics, and SLA-backed response times.",
  alternates: { canonical: "/services/support" },
  openGraph: {
    title: "Support Services",
    description:
      "Fast, reliable technical support: multi-tier (L1–L3), AI-powered ticketing, and SLA-backed response times.",
    url: "/services/support",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
