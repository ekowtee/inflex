import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Real results from real engagements. See how Inflexions has delivered transformative IT solutions across finance, pharma, energy, logistics, and mining.",
  alternates: { canonical: "/case-study" },
  openGraph: {
    title: "Case Studies",
    description:
      "Real results from real engagements. See how Inflexions delivers transformative IT solutions.",
    url: "/case-study",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
