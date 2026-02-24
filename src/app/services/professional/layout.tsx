import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Professional Services",
  description:
    "Expert IT consulting for digital transformation, AI strategy, cloud migration, and infrastructure overhauls. On time, on budget, on point.",
  alternates: { canonical: "/services/professional" },
  openGraph: {
    title: "Professional Services",
    description:
      "Expert IT consulting for digital transformation, AI strategy, cloud migration, and infrastructure overhauls.",
    url: "/services/professional",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
