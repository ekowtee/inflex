import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { currentSession } from "@/lib/guard";
import { decimalToNumber } from "@/lib/serialize";
import PageHeader from "../_components/PageHeader";
import UsersClient from "./UsersClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Users" };

export default async function UsersPage() {
  const session = await currentSession();
  if (session?.user?.role !== "DIRECTOR") {
    redirect("/admin");
  }

  const rows = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      lastLoginAt: true,
      createdAt: true,
    },
  });
  const users = decimalToNumber(rows);

  return (
    <>
      <PageHeader
        eyebrow="Access control"
        title="Users"
        description="Manage who can sign in. Directors have full access; finance users handle quotes, invoices, and payments."
      />
      <UsersClient users={users} currentUserId={session?.user?.id ?? null} />
    </>
  );
}
