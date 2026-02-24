import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case Study",
  description:
    "See how Inflexions I.T. Services delivers measurable results — real-world case studies in network infrastructure, cloud migration, cybersecurity, and data solutions.",
  alternates: { canonical: "/case-studies" },
  openGraph: {
    title: "Case Study",
    description:
      "Real-world case studies showcasing enterprise IT solutions by Inflexions I.T. Services.",
    url: "/case-studies",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
