import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/guard";
import { userCreateSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await requireRole(["DIRECTOR"]);
  if (denied) return denied;
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      lastLoginAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const denied = await requireRole(["DIRECTOR"]);
  if (denied) return denied;
  const body = await req.json();
  const parsed = userCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const data = parsed.data;
  const existing = await prisma.user.findFirst({
    where: { email: { equals: data.email, mode: "insensitive" } },
  });
  if (existing) {
    return NextResponse.json(
      { error: "A user with that email already exists." },
      { status: 409 }
    );
  }
  const passwordHash = await bcrypt.hash(data.password, 10);
  const created = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email.toLowerCase(),
      role: data.role,
      isActive: data.isActive,
      passwordHash,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      lastLoginAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return NextResponse.json(created, { status: 201 });
}
