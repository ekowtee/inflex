import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guard";
import { contactSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const body = await req.json();
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const d = parsed.data;

  return prisma.$transaction(async (tx) => {
    // Ensure only one isPrimary per customer.
    if (d.isPrimary) {
      await tx.contact.updateMany({
        where: { customerId: d.customerId, isPrimary: true },
        data: { isPrimary: false },
      });
    }
    const created = await tx.contact.create({
      data: {
        customerId: d.customerId,
        name: d.name,
        role: d.role,
        roleLabel: d.roleLabel || null,
        email: d.email || null,
        phone: d.phone || null,
        isPrimary: d.isPrimary,
        notes: d.notes || null,
      },
    });
    return NextResponse.json(created, { status: 201 });
  });
}
