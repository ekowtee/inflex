import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "80+ years of collective IT mastery. Meet the Inflexions team delivering enterprise-grade IT solutions across Africa.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Us",
    description:
      "80+ years of collective IT mastery. Meet the Inflexions team delivering enterprise-grade IT solutions across Africa.",
    url: "/about",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
