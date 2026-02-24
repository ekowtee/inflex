import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cloud Services",
  description:
    "Strategic cloud solutions: migration, hybrid and multi-cloud integration, FinOps cost optimisation, and cloud-native development.",
  alternates: { canonical: "/solutions/cloud-services" },
  openGraph: {
    title: "Cloud Services",
    description:
      "Strategic cloud solutions: migration, hybrid and multi-cloud integration, FinOps, and cloud-native development.",
    url: "/solutions/cloud-services",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
