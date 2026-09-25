import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { applicationSchema } from "@/lib/validators";
import { CV_MAX_BYTES, checkCv, safeCvFilename } from "@/lib/cv";
import { escapeHtml, sendMail, wrapHtml, type SendMailResult } from "@/lib/email";
import { createRateLimiter, getClientIp } from "@/lib/rateLimit";
import { verifyTurnstile } from "@/lib/turnstile";
import { APPLY_EMAIL, applicationRoleLabel, roles } from "@/app/careers/roles";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Careers applications from /jobs and /internships — owner, 25 September 2026.
 *
 * Replaces the mailto apply links, which opened a mail client on the
 * visitor's machine. multipart/form-data: name, email, phone?, role, link?,
 * note?, cv (PDF/DOC/DOCX, 5 MB), hp (honeypot), turnstileToken.
 *
 * The application becomes a Lead (subject "Careers") so it sits with every
 * other enquiry in the admin, and the CV travels as an attachment on the
 * notification email to MAIL_TO_CAREERS (default info@inflexions.tech). The
 * file itself is never stored. If the database is down the email still
 * goes; the request only fails when neither the lead nor the email landed.
 *
 * Responses: 200 {ok:true} · 400/403/413/415/429/500 {error}.
 */

// Same limit as /api/contact: 5 per IP per 10 minutes, counted separately.
const rateLimit = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });

// The CV plus a few KB of text fields and multipart framing.
const MAX_BODY_BYTES = CV_MAX_BYTES + 256 * 1024;

const FALLBACK = `Nothing was sent. Try again, or email your CV to ${APPLY_EMAIL}.`;

function fail(error: string, status: number, headers?: Record<string, string>) {
  return NextResponse.json({ error }, { status, headers });
}

export async function POST(req: NextRequest) {
  try {
    return await handle(req);
  } catch (e) {
    console.error("Careers application error:", e);
    return fail(`Something went wrong on our side. ${FALLBACK}`, 500);
  }
}

async function handle(req: NextRequest) {
  const ip = getClientIp(req);
  const limited = rateLimit(ip);
  if (!limited.ok) {
    return fail(
      `Too many applications from this connection. Please try again after ${limited.retryAfter} seconds.`,
      429,
      { "Retry-After": String(limited.retryAfter) }
    );
  }

  if (!(req.headers.get("content-type") ?? "").toLowerCase().startsWith("multipart/form-data")) {
    return fail("Send the application as a form with your CV attached.", 415);
  }
  const declaredLength = Number(req.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return fail("Your CV is larger than 5 MB. Save a smaller copy and try again.", 413);
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return fail("We could not read the form. Please try again.", 400);
  }

  const text = (key: string) => {
    const v = form.get(key);
    return typeof v === "string" ? v : undefined;
  };

  // Honeypot — bots fill `hp`, people never see it. Pretend success.
  if ((text("hp") ?? "").length > 0) {
    return NextResponse.json({ ok: true });
  }

  const parsed = applicationSchema.safeParse({
    name: text("name"),
    email: text("email"),
    phone: text("phone"),
    role: text("role"),
    link: text("link"),
    note: text("note"),
    turnstileToken: text("turnstileToken") ?? text("cf-turnstile-response"),
  });
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message ?? "Check the form and try again.";
    return fail(first, 400);
  }
  const d = parsed.data;

  const cv = form.get("cv");
  if (!cv || typeof cv === "string" || cv.size === 0) {
    return fail("Attach your CV as a PDF or Word file.", 400);
  }
  const bytes = Buffer.from(await cv.arrayBuffer());
  const check = checkCv(cv.name, bytes);
  if (!check.ok) return fail(check.error, 400);
  const cvFilename = safeCvFilename(cv.name, check.ext);

  // Cloudflare Turnstile (only enforced when the secret is configured).
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret) {
    if (!d.turnstileToken) {
      return fail("Please complete the verification challenge and try again.", 400);
    }
    if (!(await verifyTurnstile(d.turnstileToken, turnstileSecret, ip))) {
      return fail("Verification failed. Please reload the page and try again.", 403);
    }
  }

  const app: Application = {
    name: d.name,
    email: d.email.toLowerCase(),
    phone: d.phone ?? null,
    roleId: d.role,
    roleLabel: applicationRoleLabel(d.role),
    link: d.link ?? null,
    note: d.note ?? null,
    cvFilename,
    cvSize: bytes.byteLength,
  };
  const stamp = new Date().toISOString().slice(0, 16).replace("T", " ") + " UTC";

  let leadId: string | null = null;
  try {
    const lead = await prisma.lead.create({
      data: {
        name: app.name,
        email: app.email,
        phone: app.phone,
        subject: "Careers",
        message: composeMessage(app),
        source: "WEBSITE",
        status: "NEW",
        tags: ["Careers", app.roleLabel],
        notes: formatNoteEntry(stamp, app),
      },
    });
    leadId = lead.id;
  } catch (e) {
    console.error("Careers application: could not save the lead:", e);
  }

  const attachment = { filename: cvFilename, content: bytes, contentType: check.contentType };

  let notified: SendMailResult;
  if (leadId) {
    const [n] = await Promise.allSettled([
      sendNotification(app, leadId, attachment),
      sendConfirmation(app),
    ]);
    notified = n.status === "fulfilled" ? n.value : { ok: false, error: String(n.reason) };
    if (!notified.ok && !notified.skipped) {
      // The CV exists nowhere else, so say so on the lead.
      await prisma.lead
        .update({
          where: { id: leadId },
          data: {
            notes: `${formatNoteEntry(stamp, app)}\n[!] The notification email failed (${notified.error ?? "unknown error"}), so the CV was not delivered. Ask the applicant to resend it.`,
          },
        })
        .catch((e) => console.error("Careers application: could not flag the lead:", e));
    }
    return NextResponse.json({ ok: true });
  }

  // No lead: the email is the only record, so it has to land before we
  // tell the applicant it worked.
  notified = await sendNotification(app, null, attachment).catch(
    (e): SendMailResult => ({ ok: false, error: String(e) })
  );
  if (!notified.ok) {
    return fail(`We could not submit your application. ${FALLBACK}`, 500);
  }
  await sendConfirmation(app).catch(() => undefined);
  return NextResponse.json({ ok: true });
}

interface Application {
  name: string;
  email: string;
  phone: string | null;
  roleId: string;
  roleLabel: string;
  link: string | null;
  note: string | null;
  cvFilename: string;
  cvSize: number;
}

const kb = (n: number) => `${Math.max(1, Math.round(n / 1024))} KB`;

function composeMessage(a: Application): string {
  return [
    `Application: ${a.roleLabel}`,
    a.phone ? `Phone: ${a.phone}` : null,
    a.link ? `Link: ${a.link}` : null,
    `CV: ${a.cvFilename} (${kb(a.cvSize)})`,
    a.note ? `\n${a.note}` : null,
  ]
    .filter((l): l is string => l !== null)
    .join("\n");
}

/** Same shape as the contact route's formatNoteEntry. */
function formatNoteEntry(stamp: string, a: Application): string {
  return [
    `[${stamp}] Careers application — ${a.roleLabel}`,
    a.phone ? `Phone: ${a.phone}` : null,
    a.link ? `Link: ${a.link}` : null,
    `CV: ${a.cvFilename} (${kb(a.cvSize)}), attached to the notification email, not stored`,
    a.note ?? "(no note)",
  ]
    .filter((l): l is string => l !== null)
    .join("\n");
}

/** "the Network Engineer role", "an internship", "a role at Inflexions". */
function applyingFor(a: Application): string {
  if (a.roleId === "internship") return "an internship";
  if (a.roleId === "open-application") return "a role at Inflexions";
  return roles.some((r) => r.id === a.roleId) ? `the ${a.roleLabel} role` : a.roleLabel;
}

function careersAddress(): string {
  return process.env.MAIL_TO_CAREERS ?? APPLY_EMAIL;
}

function sendNotification(
  a: Application,
  leadId: string | null,
  attachment: { filename: string; content: Buffer; contentType: string }
) {
  const siteUrl = process.env.NEXTAUTH_URL?.replace(/\/$/, "") ?? "https://inflexions.tech";
  const adminLink = leadId ? `${siteUrl}/admin/leads/${leadId}` : null;

  const lines = [
    `New application via the website: ${a.roleLabel}.`,
    "",
    `Name:     ${a.name}`,
    `Email:    ${a.email}`,
    a.phone ? `Phone:    ${a.phone}` : null,
    `Role:     ${a.roleLabel}`,
    a.link ? `Link:     ${a.link}` : null,
    `CV:       ${a.cvFilename} (attached)`,
    "",
    "Note:",
    a.note || "(no note)",
    "",
    adminLink ? "View / follow up:" : "The lead could not be saved; this email is the only record.",
    adminLink,
  ].filter((l): l is string => l !== null);

  const html = wrapHtml({
    title: `Application — ${a.roleLabel}`,
    bodyHtml: `
      <h2 style="margin:0 0 16px;font-size:18px;color:#1B3764;">New application — ${escapeHtml(a.roleLabel)}</h2>
      <table cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;margin-bottom:16px;">
        ${row("Name", escapeHtml(a.name))}
        ${row("Email", `<a href="mailto:${escapeHtml(a.email)}" style="color:#BD2E25;text-decoration:none;">${escapeHtml(a.email)}</a>`)}
        ${a.phone ? row("Phone", escapeHtml(a.phone)) : ""}
        ${row("Role", escapeHtml(a.roleLabel))}
        ${a.link ? row("Link", `<a href="${escapeHtml(a.link)}" style="color:#BD2E25;text-decoration:none;">${escapeHtml(a.link)}</a>`) : ""}
        ${row("CV", `${escapeHtml(a.cvFilename)} (attached)`)}
      </table>
      <p style="margin:0 0 6px;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;color:#5c6280;">Note</p>
      <div style="background:#f7f8fa;border-left:3px solid #BD2E25;padding:12px 14px;white-space:pre-wrap;border-radius:4px;">
        ${escapeHtml(a.note ?? "(no note)")}
      </div>
      ${
        adminLink
          ? `<p style="margin:20px 0 0;">
        <a href="${escapeHtml(adminLink)}" style="display:inline-block;background:#BD2E25;color:#ffffff;padding:10px 16px;text-decoration:none;border-radius:6px;font-weight:600;">
          Open in admin →
        </a>
      </p>`
          : `<p style="margin:20px 0 0;color:#5c6280;">The lead could not be saved; this email is the only record.</p>`
      }
    `,
  });

  return sendMail({
    to: careersAddress(),
    subject: `[Inflexions] Application: ${a.roleLabel} — ${a.name}`,
    text: lines.join("\n"),
    html,
    replyTo: a.email,
    attachments: [attachment],
  });
}

function sendConfirmation(a: Application) {
  const first = a.name.split(/\s+/)[0];
  const forWhat = applyingFor(a);
  const text = [
    `Hi ${first},`,
    "",
    `We've received your application for ${forWhat}. If your background fits, we'll be in touch.`,
    "",
    "— The Inflexions team",
    "Inflexions I.T. Services Ltd.",
    "Accra, Ghana",
  ].join("\n");

  const html = wrapHtml({
    title: "We've received your application",
    bodyHtml: `
      <p style="margin:0 0 14px;">Hi ${escapeHtml(first)},</p>
      <p style="margin:0 0 14px;">
        We've received your application for ${escapeHtml(forWhat)}.
        If your background fits, we'll be in touch.
      </p>
      <p style="margin:22px 0 0;color:#5c6280;">— The Inflexions team</p>
    `,
  });

  return sendMail({
    to: a.email,
    subject: "We've received your application — Inflexions IT Services",
    text,
    html,
    replyTo: careersAddress(),
  });
}

function row(label: string, valueHtml: string): string {
  return `<tr>
    <td style="padding:6px 8px;color:#5c6280;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;width:90px;vertical-align:top;">${escapeHtml(label)}</td>
    <td style="padding:6px 8px;color:#171a20;">${valueHtml}</td>
  </tr>`;
}
