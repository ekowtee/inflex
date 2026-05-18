import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guard";
import { leadSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const leads = await prisma.lead.findMany({
    include: {
      convertedCustomer: { select: { id: true, name: true, type: true } },
    },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(leads);
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const body = await req.json();
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const d = parsed.data;
  const created = await prisma.lead.create({
    data: {
      name: d.name,
      email: d.email || null,
      phone: d.phone || null,
      companyName: d.companyName || null,
      subject: d.subject || null,
      message: d.message || null,
      source: d.source,
      status: d.status,
      tags: d.tags,
      notes: d.notes || null,
    },
  });
  return NextResponse.json(created, { status: 201 });
}
