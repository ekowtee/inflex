import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guard";
import { leadSchema, LEAD_STATUSES } from "@/lib/validators";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      convertedCustomer: { select: { id: true, name: true, type: true, status: true } },
      convertedContact: { select: { id: true, name: true, role: true } },
      convertedBy: { select: { id: true, name: true } },
      mergedIntoLead: { select: { id: true, name: true, email: true } },
      mergeChildren: { select: { id: true, name: true, email: true, createdAt: true } },
    },
  });
  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Surface potential duplicate matches at view time.
  const matches = lead.email
    ? await findEmailMatches(lead.id, lead.email)
    : { leads: [], customers: [], contacts: [] };

  return NextResponse.json({ ...lead, matches });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  const body = await req.json();
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const d = parsed.data;
  const updated = await prisma.lead.update({
    where: { id },
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
  return NextResponse.json(updated);
}

const leadPatchSchema = z.object({
  status: z.enum(LEAD_STATUSES).optional(),
  notes: z.string().nullable().optional(),
  tags: z.array(z.string()).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  const body = await req.json();
  const parsed = leadPatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const updated = await prisma.lead.update({
    where: { id },
    data: parsed.data,
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
  await prisma.lead.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

async function findEmailMatches(selfId: string, email: string) {
  const [leads, customers, contacts] = await Promise.all([
    prisma.lead.findMany({
      where: {
        id: { not: selfId },
        email: { equals: email, mode: "insensitive" },
      },
      select: { id: true, name: true, email: true, status: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.customer.findMany({
      where: { email: { equals: email, mode: "insensitive" } },
      select: { id: true, name: true, type: true, status: true },
      take: 5,
    }),
    prisma.contact.findMany({
      where: { email: { equals: email, mode: "insensitive" } },
      select: {
        id: true,
        name: true,
        role: true,
        customer: { select: { id: true, name: true } },
      },
      take: 5,
    }),
  ]);
  return { leads, customers, contacts };
}
