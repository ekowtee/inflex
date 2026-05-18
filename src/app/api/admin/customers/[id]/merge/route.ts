import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guard";
import { mergeCustomerIntoCustomerSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

/**
 * Merge this customer INTO another customer (atomic).
 *   - Moves all quotes, invoices, payments, contacts, and lead-conversions
 *     from source to target
 *   - Fills target fields from source where target is empty
 *   - Merges notes (timestamped block) and tags
 *   - Sets source.mergedIntoCustomerId so the back-link is auditable
 *   - Does NOT delete the source record (kept for history)
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id: sourceId } = await params;
  const body = await req.json();
  const parsed = mergeCustomerIntoCustomerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const { targetCustomerId } = parsed.data;
  if (sourceId === targetCustomerId) {
    return NextResponse.json(
      { error: "Cannot merge a customer into itself." },
      { status: 400 }
    );
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const [source, target] = await Promise.all([
        tx.customer.findUnique({ where: { id: sourceId } }),
        tx.customer.findUnique({ where: { id: targetCustomerId } }),
      ]);
      if (!source) throw new Error("Source customer not found");
      if (!target) throw new Error("Target customer not found");
      if (source.mergedIntoCustomerId) {
        throw new Error("Source has already been merged into another customer");
      }

      // 1. Reassign related rows
      await tx.quote.updateMany({ where: { customerId: sourceId }, data: { customerId: targetCustomerId } });
      await tx.invoice.updateMany({ where: { customerId: sourceId }, data: { customerId: targetCustomerId } });
      await tx.payment.updateMany({ where: { customerId: sourceId }, data: { customerId: targetCustomerId } });
      await tx.contact.updateMany({ where: { customerId: sourceId }, data: { customerId: targetCustomerId } });
      await tx.lead.updateMany({
        where: { convertedCustomerId: sourceId },
        data: { convertedCustomerId: targetCustomerId },
      });

      // 2. Compose merged notes + tags
      const stamp = new Date().toISOString().slice(0, 16).replace("T", " ") + " UTC";
      const sourceBlock = [
        `[${stamp}] Merged from customer "${source.name}" (${source.type})`,
        source.email ? `Email: ${source.email}` : null,
        source.phone ? `Phone: ${source.phone}` : null,
        source.taxId ? `Tax ID: ${source.taxId}` : null,
        source.notes ? `\n--- notes ---\n${source.notes}` : null,
      ]
        .filter(Boolean)
        .join("\n");
      const mergedNotes = target.notes ? `${target.notes}\n\n${sourceBlock}` : sourceBlock;
      const mergedTags = Array.from(new Set([...(target.tags ?? []), ...(source.tags ?? [])]));

      // 3. Fill missing fields on target from source (target wins where set)
      const fillIfEmpty = <K extends keyof typeof source>(key: K) =>
        (target[key] == null || target[key] === "") && source[key] != null
          ? ({ [key]: source[key] } as Record<string, unknown>)
          : {};

      const updatedTarget = await tx.customer.update({
        where: { id: target.id },
        data: {
          notes: mergedNotes,
          tags: mergedTags,
          ...fillIfEmpty("email"),
          ...fillIfEmpty("phone"),
          ...fillIfEmpty("legalName"),
          ...fillIfEmpty("industry"),
          ...fillIfEmpty("website"),
          ...fillIfEmpty("taxId"),
          ...fillIfEmpty("addressLine1"),
          ...fillIfEmpty("addressLine2"),
          ...fillIfEmpty("city"),
          ...fillIfEmpty("region"),
          ...fillIfEmpty("postalCode"),
          ...fillIfEmpty("country"),
        },
      });

      // 4. Tomb-stone the source
      const updatedSource = await tx.customer.update({
        where: { id: source.id },
        data: {
          mergedIntoCustomerId: target.id,
          // Status doesn't have a "merged" value — using CHURNED to signal
          // it's no longer in active use.
          status: "CHURNED",
        },
      });

      return { target: updatedTarget, source: updatedSource };
    });

    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Merge failed";
    console.error("Customer merge error:", e);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
