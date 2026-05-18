import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guard";
import { customerSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.trim();
  const status = searchParams.get("status");
  const type = searchParams.get("type");

  const customers = await prisma.customer.findMany({
    where: {
      mergedIntoCustomerId: null,
      ...(status ? { status: status as never } : {}),
      ...(type ? { type: type as never } : {}),
      ...(query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { legalName: { contains: query, mode: "insensitive" } },
              { email: { contains: query, mode: "insensitive" } },
              { taxId: { contains: query, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: {
      _count: {
        select: { contacts: true, quotes: true, invoices: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(customers);
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const body = await req.json();
  const parsed = customerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const d = parsed.data;
  const created = await prisma.customer.create({
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
  return NextResponse.json(created, { status: 201 });
}
