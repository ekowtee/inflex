import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description:
    "IT services built for enterprise: professional consulting, managed operations, and responsive support. Your operations, our obsession.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services",
    description:
      "IT services built for enterprise: professional consulting, managed operations, and responsive support.",
    url: "/services",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
