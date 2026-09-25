import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Build the thing the country runs on. Open roles at Inflexions I.T. in network engineering, cloud architecture and cybersecurity.",
  alternates: { canonical: "/careers" },
  openGraph: {
    title: "Careers",
    description:
      "Build the thing the country runs on. Open roles at Inflexions I.T.",
    url: "/careers",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
