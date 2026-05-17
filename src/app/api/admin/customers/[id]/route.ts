import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guard";
import { customerSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      quotes: { orderBy: { createdAt: "desc" } },
      invoices: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!customer) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(customer);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  const body = await req.json();
  const parsed = customerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const data = parsed.data;
  const updated = await prisma.customer.update({
    where: { id },
    data: {
      name: data.name,
      company: data.company || null,
      email: data.email || null,
      phone: data.phone || null,
      leadStatus: data.leadStatus,
      leadSource: data.leadSource,
      tags: data.tags,
      notes: data.notes || null,
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  const counts = await prisma.customer.findUnique({
    where: { id },
    select: { _count: { select: { quotes: true, invoices: true } } },
  });
  if (!counts) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (counts._count.quotes > 0 || counts._count.invoices > 0) {
    return NextResponse.json(
      { error: "Cannot delete a customer with quotes or invoices." },
      { status: 409 }
    );
  }
  await prisma.customer.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
