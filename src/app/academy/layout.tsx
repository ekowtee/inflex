import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Inflexions Academy",
    template: "%s | Inflexions Academy",
  },
  description:
    "Expert-led training in AI, cybersecurity, cloud, and digital strategy. Inflexions Academy delivers practitioner-grounded programmes for individuals and organisations.",
};

export default function AcademyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
