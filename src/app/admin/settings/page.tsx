import { prisma } from "@/lib/prisma";
import { currentSession } from "@/lib/guard";
import { decimalToNumber } from "@/lib/serialize";
import PageHeader from "../_components/PageHeader";
import SettingsForm from "./SettingsForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const session = await currentSession();
  const readOnly = session?.user?.role !== "DIRECTOR";
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
      {readOnly && (
        <div className="mb-6 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-200 text-sm px-3 py-2">
          You can view these settings but only a director can edit them.
        </div>
      )}
      <SettingsForm initial={settings} readOnly={readOnly} />
    </>
  );
}
