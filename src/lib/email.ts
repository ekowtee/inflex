/**
 * SMTP wrapper around Nodemailer. Default config targets Google Workspace via
 * an App Password on smtp.gmail.com. Lazy-initialised so the build doesn't try
 * to connect, and degrades gracefully when env vars aren't set (logs +
 * returns ok:false instead of throwing — useful in dev).
 *
 * Env vars (see CRM_SETUP.md):
 *   SMTP_HOST       default smtp.gmail.com
 *   SMTP_PORT       default 465
 *   SMTP_SECURE     default true (TLS); set to "false" for 587/STARTTLS
 *   SMTP_USER       authenticating mailbox e.g. sales@inflexions.tech
 *   SMTP_PASS       Google App Password (16 chars, no spaces)
 *   MAIL_FROM       display "From" header e.g. `"Inflexions" <sales@inflexions.tech>`
 *                   (Gmail rewrites mismatched senders, so use the SMTP_USER address)
 *   MAIL_TO_SALES   where lead notifications go; defaults to SMTP_USER
 */
import nodemailer, { type Transporter } from "nodemailer";

let cached: Transporter | null = null;

function getTransport(): Transporter | null {
  if (cached) return cached;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) return null;
  const host = process.env.SMTP_HOST ?? "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT ?? 465);
  const secure = (process.env.SMTP_SECURE ?? "true").toLowerCase() !== "false";
  cached = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
  return cached;
}

export interface SendMailInput {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}

export interface SendMailResult {
  ok: boolean;
  error?: string;
  skipped?: boolean;
}

export async function sendMail(input: SendMailInput): Promise<SendMailResult> {
  const t = getTransport();
  if (!t) {
    console.warn(
      "[email] SMTP not configured — skipping",
      JSON.stringify({ to: input.to, subject: input.subject })
    );
    return { ok: false, skipped: true, error: "smtp-not-configured" };
  }
  const from = process.env.MAIL_FROM ?? process.env.SMTP_USER ?? "";
  try {
    await t.sendMail({
      from,
      to: input.to,
      subject: input.subject,
      text: input.text,
      html: input.html,
      replyTo: input.replyTo,
    });
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "send failed";
    console.error("[email] send failed:", msg);
    return { ok: false, error: msg };
  }
}

export function salesNotificationAddress(): string {
  return process.env.MAIL_TO_SALES ?? process.env.SMTP_USER ?? "sales@inflexions.tech";
}

/**
 * Tiny helper to make HTML email bodies — wraps content in a minimal,
 * email-client-safe shell. No external CSS, inline styles only.
 */
export function wrapHtml(opts: { title?: string; bodyHtml: string }): string {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(opts.title ?? "Inflexions")}</title>
  </head>
  <body style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;color:#171a20;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f4f4f4;">
      <tr>
        <td align="center" style="padding:24px 16px;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;background:#ffffff;border:1px solid #e6e6e6;border-radius:8px;overflow:hidden;">
            <tr>
              <td style="background:#BD2E25;padding:18px 24px;color:#ffffff;font-weight:600;font-size:14px;letter-spacing:0.5px;">
                INFLEXIONS I.T. SERVICES
              </td>
            </tr>
            <tr>
              <td style="padding:24px;font-size:14px;line-height:1.6;color:#171a20;">
                ${opts.bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:14px 24px;background:#f7f8fa;color:#5c6280;font-size:12px;border-top:1px solid #e6e6e6;">
                Inflexions I.T. Services Ltd. &middot; Accra, Ghana &middot;
                <a href="https://inflexions.tech" style="color:#BD2E25;text-decoration:none;">inflexions.tech</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[c]!
  );
}
