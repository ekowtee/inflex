"use client";

import { useState } from "react";
import { Mail, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "../_components/Button";

interface TestResponse {
  ok: boolean;
  error?: string;
  delivered?: string;
  note?: string;
  config?: {
    host: string;
    port: string | number;
    secure: string | boolean;
    user: string;
    passSet: boolean;
    from: string;
    to: string;
  };
}

export default function EmailTestPanel() {
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<TestResponse | null>(null);

  async function sendTest() {
    setSending(true);
    setResult(null);
    try {
      const res = await fetch("/api/admin/email/test", { method: "POST" });
      const data: TestResponse = await res.json().catch(() => ({
        ok: false,
        error: `HTTP ${res.status}`,
      }));
      setResult(data);
    } catch (e) {
      setResult({
        ok: false,
        error: e instanceof Error ? e.message : "Request failed",
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.02] p-6 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-white inline-flex items-center gap-2">
            <Mail className="w-4 h-4 text-white/60" />
            Email notifications
          </h2>
          <p className="text-xs text-white/50 mt-1 max-w-2xl">
            New leads from the website contact form trigger an email to your
            sales address. Click below to verify the SMTP configuration is
            wired up correctly.
          </p>
        </div>
        <Button type="button" onClick={sendTest} disabled={sending}>
          {sending ? "Sending…" : "Send test email"}
        </Button>
      </div>

      {result && result.ok && (
        <div className="rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-sm px-3 py-2 flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Sent.</p>
            {result.note && (
              <p className="text-emerald-200/80 mt-0.5">{result.note}</p>
            )}
          </div>
        </div>
      )}

      {result && !result.ok && (
        <div className="rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-200 text-sm px-3 py-2 space-y-2">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Send failed.</p>
              <p className="text-rose-200/90 break-words">{result.error}</p>
            </div>
          </div>
          {result.error?.toLowerCase().includes("invalid login") && (
            <p className="text-rose-200/70 text-xs pl-6">
              Gmail is rejecting the App Password. Double-check that
              2-Step Verification is on for the SMTP_USER mailbox and that
              the App Password is the 16 characters with no spaces.
            </p>
          )}
        </div>
      )}

      {result?.config && (
        <details className="text-xs text-white/50">
          <summary className="cursor-pointer hover:text-white/80">
            ▸ Configuration in use
          </summary>
          <pre className="mt-2 rounded-md bg-[#0f1621] border border-white/10 p-3 text-[11px] overflow-x-auto">
{`Host         ${result.config.host}
Port         ${result.config.port}
Secure       ${result.config.secure}
Auth user    ${result.config.user}
Password set ${result.config.passSet ? "yes" : "NO"}
From header  ${result.config.from}
Sends to     ${result.config.to}`}
          </pre>
        </details>
      )}
    </section>
  );
}
