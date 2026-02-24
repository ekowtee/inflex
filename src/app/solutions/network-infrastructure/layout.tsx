import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Network Infrastructure",
  description:
    "Enterprise network infrastructure solutions: SD-WAN, switching, wireless, and network security. Built for performance and resilience.",
  alternates: { canonical: "/solutions/network-infrastructure" },
  openGraph: {
    title: "Network Infrastructure",
    description:
      "Enterprise network infrastructure solutions: SD-WAN, switching, wireless, and network security.",
    url: "/solutions/network-infrastructure",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
