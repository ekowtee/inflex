import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { customerSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.trim();
  const status = searchParams.get("status");

  const customers = await prisma.customer.findMany({
    where: {
      ...(status ? { leadStatus: status as never } : {}),
      ...(query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { company: { contains: query, mode: "insensitive" } },
              { email: { contains: query, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(customers);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = customerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const data = parsed.data;
  const created = await prisma.customer.create({
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
  return NextResponse.json(created, { status: 201 });
}
