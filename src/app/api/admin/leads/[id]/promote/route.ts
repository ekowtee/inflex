import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, currentSession } from "@/lib/guard";
import { promoteLeadToCustomerSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

/**
 * Qualify a lead — either by creating a fresh Customer record from it
 * (mode: CREATE) or by linking it to an existing Customer (mode: LINK).
 * Either way the lead's status moves to QUALIFIED and the link fields are
 * set so the trail is auditable.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id: leadId } = await params;
  const body = await req.json();
  const parsed = promoteLeadToCustomerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const { mode, customer: customerOverride, targetCustomerId, targetContactId } = parsed.data;

  const session = await currentSession();
  const userId = session?.user?.id ?? null;
  // env-var admin (id="env:admin") doesn't exist in the User table — skip
  // the FK rather than blow up.
  const auditUserId = userId && !userId.startsWith("env:") ? userId : null;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const lead = await tx.lead.findUnique({ where: { id: leadId } });
      if (!lead) throw new Error("Lead not found");
      if (lead.status === "QUALIFIED") {
        throw new Error("Lead has already been qualified");
      }

      let customerId: string;
      let contactId: string | null = null;

      if (mode === "LINK") {
        if (!targetCustomerId) throw new Error("targetCustomerId is required for LINK mode");
        const target = await tx.customer.findUnique({ where: { id: targetCustomerId } });
        if (!target) throw new Error("Target customer not found");
        customerId = target.id;
        contactId = targetContactId ?? null;

        // Append the lead's message to the customer's notes for context.
        const stamp = new Date().toISOString().slice(0, 16).replace("T", " ") + " UTC";
        const block = [
          `[${stamp}] Lead linked: "${lead.name}" (${lead.email ?? "no email"})`,
          lead.subject ? `Subject: ${lead.subject}` : null,
          lead.message ?? null,
        ]
          .filter(Boolean)
          .join("\n");
        await tx.customer.update({
          where: { id: target.id },
          data: {
            notes: target.notes ? `${target.notes}\n\n${block}` : block,
          },
        });
      } else {
        // CREATE — build a new Customer from the lead, optionally with rep overrides.
        const data = customerOverride ?? {};
        const created = await tx.customer.create({
          data: {
            type: data.type ?? "COMPANY",
            name: data.name ?? (lead.companyName?.trim() || lead.name),
            email: (data.email || lead.email) ?? null,
            phone: (data.phone || lead.phone) ?? null,
            status: data.status ?? "PROSPECT",
            tags: data.tags ?? lead.tags,
            notes: data.notes ?? buildSeedNotes(lead),
            legalName: data.legalName ?? null,
            industry: data.industry ?? null,
            website: data.website ?? null,
            taxId: data.taxId ?? null,
            addressLine1: data.addressLine1 ?? null,
            addressLine2: data.addressLine2 ?? null,
            city: data.city ?? null,
            region: data.region ?? null,
            postalCode: data.postalCode ?? null,
            country: data.country ?? null,
          },
        });
        customerId = created.id;
      }

      const updatedLead = await tx.lead.update({
        where: { id: leadId },
        data: {
          status: "QUALIFIED",
          convertedCustomerId: customerId,
          convertedContactId: contactId,
          convertedAt: new Date(),
          ...(auditUserId ? { convertedById: auditUserId } : {}),
        },
        include: {
          convertedCustomer: { select: { id: true, name: true, type: true } },
          convertedContact: { select: { id: true, name: true, role: true } },
        },
      });

      return updatedLead;
    });

    return NextResponse.json({ ok: true, lead: result });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Promotion failed";
    console.error("Lead promote error:", e);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

function buildSeedNotes(lead: { name: string; subject: string | null; message: string | null; notes: string | null }) {
  const lines: string[] = [];
  if (lead.subject) lines.push(`Initial subject: ${lead.subject}`);
  if (lead.message) lines.push(`Initial message:\n${lead.message}`);
  if (lead.notes) lines.push(lead.notes);
  return lines.length > 0 ? lines.join("\n\n") : null;
}
