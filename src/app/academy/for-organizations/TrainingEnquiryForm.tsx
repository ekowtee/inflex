"use client";

import { useRef, useState } from "react";
import Script from "next/script";

/**
 * The corporate training enquiry — owner, 24 September 2026.
 *
 * Posts to /api/contact like the contact form, instead of the old
 * `mailto:` action, which opened the visitor's mail client with the fields
 * flattened to text and worked badly or not at all on most machines. The
 * enquiry lands as a Lead in the admin with the subject "Academy / training"
 * and the training details composed into the message, so the Academy team
 * sees it where every other enquiry arrives.
 *
 * Same fields, names and labels as before; honeypot and Turnstile as on the
 * contact form.
 */

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

const SUCCESS =
  "Received. Our Academy team will be in touch within two working days to design your engagement.";

const field =
  "w-full rounded-[6px] border border-neutral-300 bg-white px-4 py-3 type-body text-neutral-900 transition-colors duration-[var(--motion-duration-micro)] placeholder:text-neutral-400 hover:border-neutral-500";
const labelClass = "type-telemetry block text-neutral-500";

export default function TrainingEnquiryForm({ domains }: { domains: ReadonlyArray<{ slug: string; title: string }> }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setMessage(null);

    const data = new FormData(e.currentTarget);
    const turnstileToken = String(data.get("cf-turnstile-response") ?? "");
    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setSending(false);
      setMessage({
        type: "error",
        text: "The verification check above has not completed. Wait a moment for it to finish, then send again.",
      });
      return;
    }

    const chosen = data
      .getAll("domains")
      .map((slug) => domains.find((d) => d.slug === slug)?.title ?? String(slug));
    const notes = String(data.get("notes") ?? "").trim();
    const details = [
      "Corporate training enquiry",
      `Team size: ${data.get("teamSize")}`,
      `Domains of interest: ${chosen.length ? chosen.join(", ") : "not specified"}`,
      `Preferred format: ${data.get("format")}`,
      `Timeline: ${data.get("timeline")}`,
      notes ? `\n${notes}` : "",
    ].join("\n");

    const payload = {
      name: String(data.get("contactName") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      company: String(data.get("company") ?? "").trim() || null,
      phone: null,
      subject: "Academy / training",
      message: details.trim(),
      hp: String(data.get("hp") ?? ""),
      turnstileToken: turnstileToken || null,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error ?? `Failed (${res.status})`);
      }
      setMessage({ type: "success", text: SUCCESS });
      formRef.current?.reset();
      const turnstile = (window as unknown as { turnstile?: { reset: () => void } }).turnstile;
      turnstile?.reset();
    } catch (err) {
      const detail = err instanceof Error ? err.message : "The request did not reach us.";
      setMessage({
        type: "error",
        text: `${detail} Nothing was sent. Try again, or email sales@inflexions.tech and we will pick it up from there.`,
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {TURNSTILE_SITE_KEY && (
        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" async defer />
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="mt-12 space-y-6">
        <input
          type="text"
          name="hp"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] h-px w-px opacity-0"
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="company" className={labelClass}>
              Organisation
            </label>
            <input id="company" name="company" type="text" required autoComplete="organization" className={`${field} mt-3`} />
          </div>
          <div>
            <label htmlFor="contact-name" className={labelClass}>
              Your name
            </label>
            <input id="contact-name" name="contactName" type="text" required autoComplete="name" className={`${field} mt-3`} />
          </div>
          <div>
            <label htmlFor="email" className={labelClass}>
              Work email
            </label>
            <input id="email" name="email" type="email" required autoComplete="email" className={`${field} mt-3`} />
          </div>
          <div>
            <label htmlFor="team-size" className={labelClass}>
              Team size
            </label>
            <select id="team-size" name="teamSize" className={`${field} mt-3`}>
              <option>1–10</option>
              <option>11–25</option>
              <option>26–50</option>
              <option>51–100</option>
              <option>100+</option>
            </select>
          </div>
        </div>

        <fieldset>
          <legend className={labelClass}>Domains of interest</legend>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2">
            {domains.map((domain) => (
              <label
                key={domain.slug}
                className="type-body flex items-center gap-3 border-b border-neutral-200 py-3 text-neutral-900"
              >
                <input
                  type="checkbox"
                  name="domains"
                  value={domain.slug}
                  className="h-4 w-4 rounded-[2px] border-neutral-300 accent-primary-500"
                />
                {domain.title}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="format" className={labelClass}>
              Preferred format
            </label>
            <select id="format" name="format" className={`${field} mt-3`}>
              <option>On-site</option>
              <option>Virtual</option>
              <option>Hybrid</option>
              <option>Not sure yet</option>
            </select>
          </div>
          <div>
            <label htmlFor="timeline" className={labelClass}>
              Timeline
            </label>
            <select id="timeline" name="timeline" className={`${field} mt-3`}>
              <option>Within 1 month</option>
              <option>1–3 months</option>
              <option>3–6 months</option>
              <option>Exploring only</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="notes" className={labelClass}>
            Anything else we should know?
          </label>
          <textarea id="notes" name="notes" rows={5} className={`${field} mt-3 resize-y`} />
        </div>

        {TURNSTILE_SITE_KEY && <div className="cf-turnstile" data-sitekey={TURNSTILE_SITE_KEY} />}

        {message && (
          <p
            role="status"
            aria-live="polite"
            className={`type-body max-w-[60ch] ${message.type === "success" ? "text-neutral-900" : "text-primary-600"}`}
          >
            {message.text}
          </p>
        )}

        <button
          type="submit"
          disabled={sending}
          className="inline-flex h-14 items-center rounded-[6px] bg-primary-500 px-8 font-semibold text-white transition-colors duration-[var(--motion-duration-micro)] hover:bg-primary-600 disabled:opacity-50"
        >
          {sending ? "Sending…" : "Request Training Proposal"}
        </button>
      </form>
    </>
  );
}
