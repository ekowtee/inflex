import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Inflexions I.T. Services. Whether you need IT strategy advice or a full infrastructure overhaul, our Solutions Architects are ready.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Us",
    description:
      "Get in touch with Inflexions I.T. Services. Our Solutions Architects are ready to help.",
    url: "/contact",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
