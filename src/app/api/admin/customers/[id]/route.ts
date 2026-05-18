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
      contacts: { orderBy: [{ isPrimary: "desc" }, { name: "asc" }] },
      quotes: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true, number: true, status: true, total: true,
          currency: true, createdAt: true, contact: { select: { id: true, name: true } },
        },
      },
      invoices: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true, number: true, status: true, total: true, amountPaid: true,
          currency: true, dueDate: true, createdAt: true,
        },
      },
      convertedLeads: {
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, email: true, subject: true, createdAt: true },
      },
      mergedIntoCustomer: { select: { id: true, name: true } },
      mergeChildren: { select: { id: true, name: true, createdAt: true } },
    },
  });
  if (!customer) return NextResponse.json({ error: "Not found" }, { status: 404 });
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
  const d = parsed.data;
  const updated = await prisma.customer.update({
    where: { id },
    data: {
      type: d.type,
      name: d.name,
      email: d.email || null,
      phone: d.phone || null,
      status: d.status,
      tags: d.tags,
      notes: d.notes || null,
      legalName: d.legalName || null,
      industry: d.industry || null,
      website: d.website || null,
      taxId: d.taxId || null,
      addressLine1: d.addressLine1 || null,
      addressLine2: d.addressLine2 || null,
      city: d.city || null,
      region: d.region || null,
      postalCode: d.postalCode || null,
      country: d.country || null,
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
  if (!counts) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (counts._count.quotes > 0 || counts._count.invoices > 0) {
    return NextResponse.json(
      { error: "Cannot delete a customer with quotes or invoices. Merge into another customer instead." },
      { status: 409 }
    );
  }
  await prisma.customer.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
