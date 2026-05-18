import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { publicContactSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Public lead capture. Anyone can POST. Creates a Customer with leadStatus
 * LEAD and leadSource WEBSITE, or updates an existing customer (matched by
 * email) by appending the new message to their notes.
 */
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = publicContactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const d = parsed.data;

  // Honeypot — bots fill `hp`, real humans don't see it. Pretend success so
  // we don't tip them off, but write nothing.
  if (d.hp && d.hp.length > 0) {
    return NextResponse.json({ ok: true });
  }

  // Cloudflare Turnstile verification. Only enforced when the secret is set
  // (so local dev without env vars still works).
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret) {
    if (!d.turnstileToken) {
      return NextResponse.json(
        { error: "Please complete the verification challenge and try again." },
        { status: 400 }
      );
    }
    const ok = await verifyTurnstile(d.turnstileToken, turnstileSecret, req);
    if (!ok) {
      return NextResponse.json(
        { error: "Verification failed. Please reload and try again." },
        { status: 403 }
      );
    }
  }

  const email = d.email.trim().toLowerCase();
  const noteEntry = formatNoteEntry({
    subject: d.subject,
    message: d.message ?? null,
    phone: d.phone ?? null,
  });

  try {
    const existing = await prisma.customer.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
    });

    if (existing) {
      const mergedNotes = existing.notes
        ? `${existing.notes}\n\n${noteEntry}`
        : noteEntry;
      const mergedTags = Array.from(
        new Set([...(existing.tags ?? []), d.subject])
      );
      await prisma.customer.update({
        where: { id: existing.id },
        data: {
          // Don't overwrite a higher status (e.g. ACTIVE) with LEAD.
          ...(existing.leadStatus === "LEAD" && { leadStatus: "LEAD" }),
          notes: mergedNotes,
          tags: mergedTags,
          // Fill in any missing contact fields the new submission supplies.
          ...(d.name && !existing.name ? { name: d.name } : {}),
          ...(d.phone && !existing.phone ? { phone: d.phone.trim() } : {}),
          ...(d.company && !existing.company ? { company: d.company.trim() } : {}),
        },
      });
    } else {
      await prisma.customer.create({
        data: {
          name: d.name.trim(),
          email,
          phone: d.phone?.trim() || null,
          company: d.company?.trim() || null,
          leadStatus: "LEAD",
          leadSource: "WEBSITE",
          tags: [d.subject],
          notes: noteEntry,
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Contact form error:", e);
    return NextResponse.json(
      { error: "Could not save your message. Please email us directly at sales@inflexions.tech." },
      { status: 500 }
    );
  }
}

async function verifyTurnstile(
  token: string,
  secret: string,
  req: NextRequest
): Promise<boolean> {
  try {
    const body = new URLSearchParams();
    body.set("secret", secret);
    body.set("response", token);
    const remoteIp =
      req.headers.get("cf-connecting-ip") ||
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "";
    if (remoteIp) body.set("remoteip", remoteIp);

    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body }
    );
    if (!res.ok) {
      console.error("Turnstile siteverify HTTP error", res.status);
      return false;
    }
    const data = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
    if (!data.success) {
      console.warn("Turnstile rejection", data["error-codes"]);
    }
    return Boolean(data.success);
  } catch (e) {
    console.error("Turnstile verification error:", e);
    return false;
  }
}

function formatNoteEntry(opts: {
  subject: string;
  message: string | null;
  phone: string | null;
}): string {
  const stamp = new Date().toISOString().slice(0, 16).replace("T", " ") + " UTC";
  const lines = [
    `[${stamp}] Website contact — ${opts.subject}`,
    opts.phone ? `Phone: ${opts.phone}` : null,
    opts.message?.trim() ? opts.message.trim() : "(no message)",
  ].filter(Boolean);
  return lines.join("\n");
}
