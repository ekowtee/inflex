import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data-centric Solutions",
  description:
    "Turn raw data into strategic advantage with business intelligence, predictive analytics, AI automation, and real-time data pipelines.",
  alternates: { canonical: "/solutions/data-centric-solutions" },
  openGraph: {
    title: "Data-centric Solutions",
    description:
      "Turn raw data into strategic advantage with BI, predictive analytics, AI automation, and real-time data pipelines.",
    url: "/solutions/data-centric-solutions",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
