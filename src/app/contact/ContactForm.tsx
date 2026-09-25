"use client";

import { useRef, useState } from "react";
import Script from "next/script";

/**
 * The contact form — PHASE5_BRIEF.md §4 Task 8.
 *
 * Fields, names, honeypot, Turnstile and the POST to /api/contact are
 * unchanged; only the surface is re-set. What did change is that the labels
 * are now labels. Every field used to carry its question as a placeholder,
 * which disappears the moment anyone types into it, so the one question the
 * offer actually asks — what are you running, and what worries you — was
 * gone by the time it was being answered.
 *
 * Errors name the problem and the way out of it, because a form that fails
 * silently at the end of a page asking for thirty minutes of someone's time
 * is where the offer is broken.
 */

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

const SUBJECT_OPTIONS = [
  "General enquiry",
  "Quote request",
  "Solutions",
  "Services",
  "Academy / training",
  "Partnership",
  "Careers",
  "Other",
];

const SUCCESS =
  "Received. A Solutions Architect will reply within one working day to fix a time. If it is urgent, call +233 20 888 9270.";

const field =
  "w-full rounded-[6px] border border-neutral-300 bg-white px-4 py-3 type-body text-neutral-900 transition-colors duration-[var(--motion-duration-micro)] placeholder:text-neutral-400 hover:border-neutral-500";
const labelClass = "type-telemetry block text-neutral-500";

export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setMessage(null);

    const form = e.currentTarget as HTMLFormElement;
    const data = new FormData(form);
    // Turnstile injects a hidden input named `cf-turnstile-response`.
    const turnstileToken = String(data.get("cf-turnstile-response") ?? "");

    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setSending(false);
      setMessage({
        type: "error",
        text: "The verification check above has not completed. Wait a moment for it to finish, then send again.",
      });
      return;
    }

    const payload = {
      name: String(data.get("user_name") ?? "").trim(),
      email: String(data.get("user_email") ?? "").trim(),
      phone: String(data.get("user_phone") ?? "").trim() || null,
      company: String(data.get("user_company") ?? "").trim() || null,
      subject: String(data.get("subject") ?? "General enquiry"),
      message: String(data.get("message") ?? "").trim() || null,
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
      // Reset the Turnstile widget so a second submission gets a fresh token.
      const turnstile = (window as unknown as { turnstile?: { reset: () => void } }).turnstile;
      turnstile?.reset();
    } catch (e) {
      const detail = e instanceof Error ? e.message : "The request did not reach us.";
      setMessage({
        type: "error",
        text: `${detail} Nothing was sent. Try again, or email info@inflexions.tech and we will pick it up from there.`,
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {TURNSTILE_SITE_KEY && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="afterInteractive"
          async
          defer
        />
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        {/* Honeypot — visually hidden, no aria, no autofill hint. */}
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
            <label htmlFor="user_name" className={labelClass}>
              Your name
            </label>
            <input
              id="user_name"
              type="text"
              name="user_name"
              required
              autoComplete="name"
              className={`${field} mt-3`}
            />
          </div>
          <div>
            <label htmlFor="user_company" className={labelClass}>
              Company or organisation
            </label>
            <input
              id="user_company"
              type="text"
              name="user_company"
              autoComplete="organization"
              className={`${field} mt-3`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="user_email" className={labelClass}>
              Work email
            </label>
            <input
              id="user_email"
              type="email"
              name="user_email"
              required
              autoComplete="email"
              className={`${field} mt-3`}
            />
          </div>
          <div>
            <label htmlFor="user_phone" className={labelClass}>
              Phone number
            </label>
            <input
              id="user_phone"
              type="tel"
              name="user_phone"
              autoComplete="tel"
              className={`${field} mt-3`}
            />
          </div>
        </div>

        <div>
          <label htmlFor="subject" className={labelClass}>
            What can we help with?
          </label>
          <select
            id="subject"
            name="subject"
            defaultValue="General enquiry"
            className={`${field} mt-3 appearance-none`}
          >
            {SUBJECT_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="message" className={labelClass}>
            What are you running, and what worries you?
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            className={`${field} mt-3 resize-y`}
          />
        </div>

        {/* Cloudflare Turnstile — invisible challenge most of the time. */}
        {TURNSTILE_SITE_KEY && (
          <div className="cf-turnstile" data-sitekey={TURNSTILE_SITE_KEY} />
        )}

        {message && (
          <p
            role="status"
            aria-live="polite"
            className={`type-body max-w-[60ch] ${
              message.type === "success" ? "text-neutral-900" : "text-primary-600"
            }`}
          >
            {message.text}
          </p>
        )}

        <button
          type="submit"
          disabled={sending}
          className="inline-flex h-14 items-center rounded-[6px] bg-primary-500 px-8 font-semibold text-white transition-colors duration-[var(--motion-duration-micro)] hover:bg-primary-600 disabled:opacity-50"
        >
          {sending ? "Sending…" : "Request the review"}
        </button>
      </form>
    </>
  );
}
