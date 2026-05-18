"use client";

import { useRef, useState } from "react";
import Script from "next/script";
import { Mail, Phone, Clock } from "lucide-react";
import Partners from "../components/Partners";
import Faq from "../components/Faq";
import JsonLd from "../components/JsonLd";

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

export default function ContactPage() {
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
        text: "Please complete the verification check above before sending.",
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
      setMessage({
        type: "success",
        text: "Thanks — we've received your message and will be in touch within two working days.",
      });
      formRef.current?.reset();
      // Reset the Turnstile widget so a second submission gets a fresh token.
      const turnstile = (window as unknown as { turnstile?: { reset: () => void } }).turnstile;
      turnstile?.reset();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to send.";
      setMessage({ type: "error", text: msg });
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      {TURNSTILE_SITE_KEY && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="afterInteractive"
          async
          defer
        />
      )}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Inflexions I.T. Services",
          url: "https://inflexions.tech",
          logo: "https://inflexions.tech/assets/logo.png",
          email: "info@inflexions.tech",
          telephone: "+233208889270",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Accra",
            addressCountry: "GH",
          },
          openingHoursSpecification: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ],
            opens: "09:00",
            closes: "18:00",
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "What is your typical engagement timeline?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Most projects begin with a 2-week discovery phase. Implementation timelines range from 4–12 weeks depending on scope.",
              },
            },
            {
              "@type": "Question",
              name: "Do you hold industry certifications?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. Our team holds certifications across Cisco, Microsoft, AWS, and CompTIA.",
              },
            },
            {
              "@type": "Question",
              name: "How do you handle data security and compliance?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Security is embedded in every solution. We follow industry frameworks including ISO 27001 principles and conduct regular vulnerability assessments.",
              },
            },
            {
              "@type": "Question",
              name: "What does your Managed Services SLA look like?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Our Managed Services include guaranteed response times, 24/7 monitoring, monthly performance reports, and a dedicated account manager.",
              },
            },
            {
              "@type": "Question",
              name: "Can you work alongside our existing IT team?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Absolutely. Many clients engage us as an extension of their internal team.",
              },
            },
            {
              "@type": "Question",
              name: "What industries do you serve?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "We serve clients across telecommunications, financial services, manufacturing, logistics, government, and professional services.",
              },
            },
            {
              "@type": "Question",
              name: "How do you ensure minimal disruption during migrations?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Every migration follows our proven 5-phase methodology: Assess, Plan, Test, Migrate, Validate.",
              },
            },
          ],
        }}
      />

      {/* Hero */}
      <div className="relative w-full h-[300px] md:h-[500px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/contactbg.jpeg" alt="Contact" className="w-full h-full object-cover" loading="eager" />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-end pb-10 md:pb-28 lg:pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="md:w-2/3 text-white space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                Let&apos;s Build Something That Lasts
              </h1>
              <p className="text-lg lg:text-xl text-white/90 leading-relaxed max-w-2xl">
                Get in touch and let&apos;s start the conversation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <section className="bg-[#F4F4F4] py-12">
        <div className="bg-[#BD2E25] max-w-[854px] mx-auto px-4 lg:px-[150px] py-10">
          <h2 className="text-3xl font-semibold text-white text-center mb-4">
            Start the Conversation
          </h2>
          <p className="text-white text-center mb-12">
            Whether you need a second opinion on your IT strategy or a full infrastructure overhaul, our Solutions Architects are ready. No obligation. No jargon. Just clarity.
          </p>

          <div className="flex flex-row items-center justify-center gap-12 mb-16">
            <div className="flex flex-col items-center">
              <div className="bg-[#A02923] p-4 rounded-full mb-2">
                <Mail className="text-white" size={24} />
              </div>
              <span className="text-white text-sm">info@inflexions.tech</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-[#A02923] p-4 rounded-full mb-2">
                <Phone className="text-white" size={24} />
              </div>
              <span className="text-white text-sm">(0) 208 889 270</span>
            </div>
            <div className="hidden md:flex flex-col items-center text-center">
              <div className="bg-[#A02923] p-4 rounded-full mb-2">
                <Clock className="text-white" size={24} />
              </div>
              <span className="text-white text-sm">
                Mon &ndash; Sat 9.00 &ndash; 18.00
                <br />
                Sunday Closed
              </span>
            </div>
          </div>

          {message && (
            <div className={`text-center mb-4 p-3 ${message.type === "success" ? "bg-[#E8F5E9] text-[#2E7D32]" : "bg-[#FFEBEE] text-[#C62828]"} rounded`}>
              {message.text}
            </div>
          )}

          <form ref={formRef} onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
            {/* Honeypot — visually hidden, no aria, no autofill hint. */}
            <input
              type="text"
              name="hp"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute -left-[9999px] w-px h-px opacity-0"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="user_name"
                placeholder="Your name*"
                required
                aria-label="Your name"
                className="w-full border border-white bg-transparent text-white placeholder-white p-3 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <input
                type="text"
                name="user_company"
                placeholder="Company / organisation"
                aria-label="Company or organisation"
                className="w-full border border-white bg-transparent text-white placeholder-white p-3 focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="email"
                name="user_email"
                placeholder="Work email*"
                required
                aria-label="Email address"
                className="w-full border border-white bg-transparent text-white placeholder-white p-3 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <input
                type="tel"
                name="user_phone"
                placeholder="Phone number"
                aria-label="Phone number"
                className="w-full border border-white bg-transparent text-white placeholder-white p-3 focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
            <select
              name="subject"
              defaultValue="General enquiry"
              aria-label="What can we help with?"
              className="w-full border border-white bg-[#BD2E25] text-white p-3 focus:outline-none focus:ring-2 focus:ring-white appearance-none"
            >
              {SUBJECT_OPTIONS.map((s) => (
                <option key={s} value={s} className="bg-white text-[#BD2E25]">
                  {s}
                </option>
              ))}
            </select>
            <textarea
              name="message"
              placeholder="Tell us a bit about what you need — scope, timeline, budget if you have one."
              aria-label="Your message"
              className="w-full h-40 border border-white bg-transparent text-white placeholder-white p-3 focus:outline-none focus:ring-2 focus:ring-white"
            />

            {/* Cloudflare Turnstile — invisible challenge most of the time. */}
            {TURNSTILE_SITE_KEY && (
              <div className="flex justify-center">
                <div
                  className="cf-turnstile"
                  data-sitekey={TURNSTILE_SITE_KEY}
                  data-theme="dark"
                />
              </div>
            )}

            <div className="text-center">
              <button
                type="submit"
                disabled={sending}
                className="bg-white text-[#BD2E25] font-medium py-2 px-6 hover:bg-[#F2F2F2] transition-colors duration-200 disabled:opacity-50"
              >
                {sending ? "Sending..." : "Send Your Message"}
              </button>
            </div>
          </form>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Partners />
      </div>

      <Faq />
    </div>
  );
}
