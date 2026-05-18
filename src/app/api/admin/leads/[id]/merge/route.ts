import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guard";
import { mergeLeadIntoLeadSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

/**
 * Merge this lead INTO another lead (atomic).
 *   - Appends source notes, message, and tags onto the target
 *   - Fills any missing target fields from the source
 *   - Marks source DUPLICATE with mergedIntoLeadId pointing at target
 *   - Does NOT delete the source (we keep the back-link for auditing)
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id: sourceId } = await params;
  const body = await req.json();
  const parsed = mergeLeadIntoLeadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const { targetLeadId } = parsed.data;
  if (sourceId === targetLeadId) {
    return NextResponse.json(
      { error: "Cannot merge a lead into itself." },
      { status: 400 }
    );
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const [source, target] = await Promise.all([
        tx.lead.findUnique({ where: { id: sourceId } }),
        tx.lead.findUnique({ where: { id: targetLeadId } }),
      ]);
      if (!source) throw new Error("Source lead not found");
      if (!target) throw new Error("Target lead not found");
      if (source.status === "DUPLICATE") {
        throw new Error("Source lead has already been merged");
      }

      const stamp = new Date().toISOString().slice(0, 16).replace("T", " ") + " UTC";
      const sourceBlock = [
        `[${stamp}] Merged from lead "${source.name}" (${source.email ?? "no email"})`,
        source.subject ? `Subject: ${source.subject}` : null,
        source.message ?? null,
        source.notes ? `\n--- notes ---\n${source.notes}` : null,
      ]
        .filter(Boolean)
        .join("\n");

      const mergedNotes = target.notes ? `${target.notes}\n\n${sourceBlock}` : sourceBlock;
      const mergedTags = Array.from(new Set([...(target.tags ?? []), ...(source.tags ?? [])]));

      // Fill missing target fields from source (target wins where set)
      const fillIfEmpty = <K extends keyof typeof source>(
        key: K
      ): { [P in K]?: (typeof source)[K] } => {
        return (target[key] == null || target[key] === "") && source[key] != null
          ? ({ [key]: source[key] } as { [P in K]?: (typeof source)[K] })
          : ({} as { [P in K]?: (typeof source)[K] });
      };

      const updatedTarget = await tx.lead.update({
        where: { id: target.id },
        data: {
          notes: mergedNotes,
          tags: mergedTags,
          ...fillIfEmpty("phone"),
          ...fillIfEmpty("companyName"),
          ...fillIfEmpty("subject"),
          ...fillIfEmpty("message"),
        },
      });

      const updatedSource = await tx.lead.update({
        where: { id: source.id },
        data: {
          status: "DUPLICATE",
          mergedIntoLeadId: target.id,
        },
      });

      return { target: updatedTarget, source: updatedSource };
    });

    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Merge failed";
    console.error("Lead merge error:", e);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
