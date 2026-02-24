"use client";

import { useRef, useState } from "react";
import { Mail, Phone, Clock } from "lucide-react";
import Partners from "../components/Partners";
import Faq from "../components/Faq";

export default function ContactPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setMessage(null);

    // Placeholder for emailjs or server action
    try {
      // Simulate send
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMessage({ type: "success", text: "Message sent successfully!" });
      formRef.current?.reset();
    } catch {
      setMessage({ type: "error", text: "Failed to send, please try again." });
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
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
            <input
              type="text"
              name="user_name"
              placeholder="Your name*"
              required
              aria-label="Your name"
              className="w-full border border-white bg-transparent text-white placeholder-white p-3 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="tel"
                name="user_phone"
                placeholder="Phone Number*"
                required
                aria-label="Phone number"
                className="w-full border border-white bg-transparent text-white placeholder-white p-3 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <input
                type="email"
                name="user_email"
                placeholder="Email*"
                required
                aria-label="Email address"
                className="w-full border border-white bg-transparent text-white placeholder-white p-3 focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
            <textarea
              name="message"
              placeholder="Your Message"
              aria-label="Your message"
              className="w-full h-40 border border-white bg-transparent text-white placeholder-white p-3 focus:outline-none focus:ring-2 focus:ring-white"
            />
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
