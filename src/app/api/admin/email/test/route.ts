import { NextResponse } from "next/server";
import { requireAdmin, currentSession } from "@/lib/guard";
import { sendMail, salesNotificationAddress, wrapHtml, escapeHtml } from "@/lib/email";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Fires a test email so an admin can verify SMTP is wired up properly.
 * Surfaces the raw SMTP error in the response when something is misconfigured.
 */
export async function POST() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const session = await currentSession();
  const triggeredBy = session?.user?.name ?? session?.user?.email ?? "an admin";

  // Surface the config that's actually in use so misconfiguration is obvious.
  const config = {
    host: process.env.SMTP_HOST ?? "(unset → default smtp.gmail.com)",
    port: process.env.SMTP_PORT ?? "(unset → default 465)",
    secure: process.env.SMTP_SECURE ?? "(unset → default true)",
    user: process.env.SMTP_USER ?? "(unset)",
    passSet: Boolean(process.env.SMTP_PASS),
    from: process.env.MAIL_FROM ?? process.env.SMTP_USER ?? "(unset)",
    to: salesNotificationAddress(),
  };

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "SMTP_USER and SMTP_PASS are not set. Add them in Vercel (or .env.local for dev) and redeploy.",
        config,
      },
      { status: 400 }
    );
  }

  const when = new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC";
  const result = await sendMail({
    to: salesNotificationAddress(),
    subject: "[Inflexions] SMTP test — config OK",
    text: [
      `This is a test email from the Inflexions admin.`,
      ``,
      `Triggered by: ${triggeredBy}`,
      `Time:         ${when}`,
      `Host:         ${config.host}`,
      `Port:         ${config.port}`,
      `Secure:       ${config.secure}`,
      `Auth user:    ${config.user}`,
      `From header:  ${config.from}`,
      `Delivered to: ${config.to}`,
      ``,
      `If you received this, the lead-capture pipeline (/contact → email) is good to go.`,
    ].join("\n"),
    html: wrapHtml({
      title: "SMTP test — config OK",
      bodyHtml: `
        <h2 style="margin:0 0 16px;font-size:18px;color:#1B3764;">SMTP test — config OK</h2>
        <p style="margin:0 0 14px;">
          This is a test email from the Inflexions admin. If you can see this,
          /contact submissions will email you when new leads come in.
        </p>
        <p style="margin:0 0 6px;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;color:#5c6280;">Config in use</p>
        <pre style="background:#f7f8fa;border-left:3px solid #BD2E25;padding:12px 14px;white-space:pre-wrap;border-radius:4px;color:#41444b;font-family:Menlo,Consolas,monospace;font-size:12px;">Triggered by: ${escapeHtml(triggeredBy)}
Time:         ${escapeHtml(when)}
Host:         ${escapeHtml(config.host)}
Port:         ${escapeHtml(String(config.port))}
Secure:       ${escapeHtml(String(config.secure))}
Auth user:    ${escapeHtml(config.user)}
From header:  ${escapeHtml(config.from)}
Delivered to: ${escapeHtml(config.to)}</pre>
      `,
    }),
  });

  if (!result.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: result.error ?? "Unknown SMTP error",
        skipped: result.skipped ?? false,
        config,
      },
      { status: 502 }
    );
  }

  return NextResponse.json({
    ok: true,
    delivered: config.to,
    config,
    note: `Test email sent to ${config.to}. Check the inbox (and spam) within a minute or two.`,
  });
}
