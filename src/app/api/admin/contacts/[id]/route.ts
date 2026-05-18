import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guard";
import { contactSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
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
    if (d.isPrimary) {
      await tx.contact.updateMany({
        where: { customerId: d.customerId, isPrimary: true, NOT: { id } },
        data: { isPrimary: false },
      });
    }
    const updated = await tx.contact.update({
      where: { id },
      data: {
        name: d.name,
        role: d.role,
        roleLabel: d.roleLabel || null,
        email: d.email || null,
        phone: d.phone || null,
        isPrimary: d.isPrimary,
        notes: d.notes || null,
      },
    });
    return NextResponse.json(updated);
  });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  await prisma.contact.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
