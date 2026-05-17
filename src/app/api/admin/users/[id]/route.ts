import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireRole, currentSession } from "@/lib/guard";
import { userUpdateSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireRole(["DIRECTOR"]);
  if (denied) return denied;
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
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
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(user);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireRole(["DIRECTOR"]);
  if (denied) return denied;
  const { id } = await params;
  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const body = await req.json();
  const parsed = userUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const data = parsed.data;

  // Email uniqueness check (excluding self).
  const dup = await prisma.user.findFirst({
    where: {
      email: { equals: data.email, mode: "insensitive" },
      NOT: { id },
    },
  });
  if (dup) {
    return NextResponse.json(
      { error: "A user with that email already exists." },
      { status: 409 }
    );
  }

  // Prevent a director from demoting themselves if they are the only director.
  const session = await currentSession();
  if (
    session?.user?.id === id &&
    existing.role === "DIRECTOR" &&
    data.role !== "DIRECTOR"
  ) {
    const directorCount = await prisma.user.count({
      where: { role: "DIRECTOR", isActive: true },
    });
    if (directorCount <= 1) {
      return NextResponse.json(
        { error: "You are the only active director. Promote another user first." },
        { status: 409 }
      );
    }
  }

  const updateData: {
    name: string;
    email: string;
    role: "DIRECTOR" | "FINANCE";
    isActive: boolean;
    passwordHash?: string;
  } = {
    name: data.name,
    email: data.email.toLowerCase(),
    role: data.role,
    isActive: data.isActive,
  };
  if (data.password && data.password.length > 0) {
    updateData.passwordHash = await bcrypt.hash(data.password, 10);
  }
  const updated = await prisma.user.update({
    where: { id },
    data: updateData,
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
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireRole(["DIRECTOR"]);
  if (denied) return denied;
  const { id } = await params;
  const session = await currentSession();
  if (session?.user?.id === id) {
    return NextResponse.json(
      { error: "You cannot delete your own account." },
      { status: 409 }
    );
  }
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Prevent removing the last active director.
  if (user.role === "DIRECTOR" && user.isActive) {
    const directorCount = await prisma.user.count({
      where: { role: "DIRECTOR", isActive: true },
    });
    if (directorCount <= 1) {
      return NextResponse.json(
        { error: "Cannot delete the only active director." },
        { status: 409 }
      );
    }
  }
  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
