import { prisma } from "@/lib/prisma";
import { decimalToNumber } from "@/lib/serialize";
import PageHeader from "../_components/PageHeader";
import SettingsForm from "./SettingsForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const row = await prisma.companySettings.upsert({
    where: { id: "singleton" },
    create: {},
    update: {},
  });
  const settings = decimalToNumber(row);

  return (
    <>
      <PageHeader
        eyebrow="Configuration"
        title="Company settings"
        description="Branding, billing defaults, and payment details that appear on every quote and invoice."
      />
      <SettingsForm initial={settings} />
    </>
  );
}
