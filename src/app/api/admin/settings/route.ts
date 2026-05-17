import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireRole } from "@/lib/guard";
import { settingsSchema } from "@/lib/validators";
import { toDecimal } from "@/lib/billing";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const settings = await prisma.companySettings.upsert({
    where: { id: "singleton" },
    create: {},
    update: {},
  });
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  const denied = await requireRole(["DIRECTOR"]);
  if (denied) return denied;
  const body = await req.json();
  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const data = parsed.data;
  const updated = await prisma.companySettings.upsert({
    where: { id: "singleton" },
    create: {
      ...data,
      defaultTaxRate: toDecimal(data.defaultTaxRate),
      email: data.email || null,
    },
    update: {
      ...data,
      defaultTaxRate: toDecimal(data.defaultTaxRate),
      email: data.email || null,
    },
  });
  return NextResponse.json(updated);
}
