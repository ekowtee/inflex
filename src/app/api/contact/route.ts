import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { publicContactSchema } from "@/lib/validators";
import {
  escapeHtml,
  salesNotificationAddress,
  sendMail,
  wrapHtml,
} from "@/lib/email";

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

    let customerId: string;
    if (existing) {
      const mergedNotes = existing.notes
        ? `${existing.notes}\n\n${noteEntry}`
        : noteEntry;
      const mergedTags = Array.from(
        new Set([...(existing.tags ?? []), d.subject])
      );
      const updated = await prisma.customer.update({
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
      customerId = updated.id;
    } else {
      const created = await prisma.customer.create({
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
      customerId = created.id;
    }

    // Fire notification + acknowledgement. Promise.allSettled so one failed
    // email doesn't block the other, and neither failure fails the request —
    // the lead is already saved.
    await Promise.allSettled([
      sendSalesNotification({
        customerId,
        name: d.name.trim(),
        email,
        phone: d.phone?.trim() ?? null,
        company: d.company?.trim() ?? null,
        subject: d.subject,
        message: d.message?.trim() ?? null,
        isExisting: Boolean(existing),
      }),
      sendCustomerConfirmation({
        name: d.name.trim(),
        email,
        subject: d.subject,
        message: d.message?.trim() ?? null,
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Contact form error:", e);
    return NextResponse.json(
      { error: "Could not save your message. Please email us directly at sales@inflexions.tech." },
      { status: 500 }
    );
  }
}

async function sendSalesNotification(lead: {
  customerId: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  subject: string;
  message: string | null;
  isExisting: boolean;
}) {
  const siteUrl =
    process.env.NEXTAUTH_URL?.replace(/\/$/, "") ?? "https://inflexions.tech";
  const adminLink = `${siteUrl}/admin/customers/${lead.customerId}`;
  const label = lead.isExisting ? "Returning lead" : "New lead";

  const lines = [
    `${label} via the website contact form.`,
    "",
    `Name:     ${lead.name}`,
    `Email:    ${lead.email}`,
    lead.phone ? `Phone:    ${lead.phone}` : null,
    lead.company ? `Company:  ${lead.company}` : null,
    `Subject:  ${lead.subject}`,
    "",
    "Message:",
    lead.message || "(no message)",
    "",
    "View / follow up:",
    adminLink,
  ].filter((l): l is string => l !== null);

  const html = wrapHtml({
    title: `${label} — ${lead.subject}`,
    bodyHtml: `
      <h2 style="margin:0 0 16px;font-size:18px;color:#1B3764;">${escapeHtml(
        label
      )} — ${escapeHtml(lead.subject)}</h2>
      <table cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;margin-bottom:16px;">
        ${row("Name", lead.name)}
        ${row("Email", `<a href="mailto:${escapeHtml(lead.email)}" style="color:#BD2E25;text-decoration:none;">${escapeHtml(lead.email)}</a>`, true)}
        ${lead.phone ? row("Phone", escapeHtml(lead.phone), true) : ""}
        ${lead.company ? row("Company", escapeHtml(lead.company)) : ""}
        ${row("Subject", escapeHtml(lead.subject))}
      </table>
      <p style="margin:0 0 6px;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;color:#5c6280;">Message</p>
      <div style="background:#f7f8fa;border-left:3px solid #BD2E25;padding:12px 14px;white-space:pre-wrap;border-radius:4px;">
        ${escapeHtml(lead.message ?? "(no message)")}
      </div>
      <p style="margin:20px 0 0;">
        <a href="${escapeHtml(adminLink)}" style="display:inline-block;background:#BD2E25;color:#ffffff;padding:10px 16px;text-decoration:none;border-radius:6px;font-weight:600;">
          Open in admin →
        </a>
      </p>
    `,
  });

  return sendMail({
    to: salesNotificationAddress(),
    subject: `[Inflexions] ${label}: ${lead.subject} — ${lead.name}`,
    text: lines.join("\n"),
    html,
    // Replying to the notification = replying to the customer.
    replyTo: lead.email,
  });
}

async function sendCustomerConfirmation(opts: {
  name: string;
  email: string;
  subject: string;
  message: string | null;
}) {
  const text = [
    `Hi ${opts.name.split(/\s+/)[0]},`,
    "",
    `Thanks for reaching out to Inflexions. We've received your enquiry (${opts.subject}) and a member of our team will be in touch within two working days.`,
    "",
    "If your question is urgent, you can reach us at sales@inflexions.tech or +233 20 888 9270.",
    "",
    "For your records, here's what you sent:",
    "",
    opts.message ? opts.message : "(no message)",
    "",
    "— The Inflexions team",
    "Inflexions I.T. Services Ltd.",
    "Accra, Ghana",
  ].join("\n");

  const html = wrapHtml({
    title: "We've received your message",
    bodyHtml: `
      <p style="margin:0 0 14px;">Hi ${escapeHtml(opts.name.split(/\s+/)[0])},</p>
      <p style="margin:0 0 14px;">
        Thanks for reaching out to Inflexions. We've received your enquiry
        (<strong>${escapeHtml(opts.subject)}</strong>) and a member of our team
        will be in touch within two working days.
      </p>
      <p style="margin:0 0 14px;">
        If your question is urgent, reach us at
        <a href="mailto:sales@inflexions.tech" style="color:#BD2E25;text-decoration:none;">sales@inflexions.tech</a>
        or <a href="tel:+233208889270" style="color:#BD2E25;text-decoration:none;">+233 20 888 9270</a>.
      </p>
      ${
        opts.message
          ? `
        <p style="margin:18px 0 6px;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;color:#5c6280;">For your records</p>
        <div style="background:#f7f8fa;border-left:3px solid #BD2E25;padding:12px 14px;white-space:pre-wrap;border-radius:4px;color:#41444b;">
          ${escapeHtml(opts.message)}
        </div>
      `
          : ""
      }
      <p style="margin:22px 0 0;color:#5c6280;">
        — The Inflexions team
      </p>
    `,
  });

  return sendMail({
    to: opts.email,
    subject: "We've received your message — Inflexions IT Services",
    text,
    html,
    replyTo: salesNotificationAddress(),
  });
}

function row(label: string, value: string, isHtml = false): string {
  return `<tr>
    <td style="padding:6px 8px;color:#5c6280;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;width:90px;vertical-align:top;">${escapeHtml(
      label
    )}</td>
    <td style="padding:6px 8px;color:#171a20;">${isHtml ? value : escapeHtml(value)}</td>
  </tr>`;
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
