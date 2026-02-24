import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join Inflexions I.T. — build what matters with people who do. Explore open roles in network engineering, cloud architecture, and cybersecurity.",
  alternates: { canonical: "/careers" },
  openGraph: {
    title: "Careers",
    description:
      "Join Inflexions I.T. — build what matters with people who do. Explore open roles in IT.",
    url: "/careers",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
