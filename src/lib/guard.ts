import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, type SessionRole } from "./auth";

export const ADMIN_ROLES: SessionRole[] = ["DIRECTOR", "FINANCE"];

/**
 * Allow any authenticated admin user (DIRECTOR or FINANCE). Returns null on
 * success, or a 401 NextResponse to short-circuit the route. Use at the top of
 * every /api/admin/* handler as defence-in-depth alongside the middleware.
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role || !ADMIN_ROLES.includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

/**
 * Require one of a specific set of roles (e.g. ["DIRECTOR"] for user-mgmt or
 * settings edits). Returns null on success, or a 401/403 NextResponse.
 */
export async function requireRole(
  allowed: SessionRole[]
): Promise<NextResponse | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!allowed.includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}

export async function currentSession() {
  return getServerSession(authOptions);
}
