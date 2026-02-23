"use client";

import Banner from "../../components/Banner";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function SupportServicesPage() {
  return (
    <div>
      {/* Hero */}
      <div className="relative w-full h-[500px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/services/service4.jpg"
          alt="Support Services"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 flex items-end pb-10 md:pb-28 lg:pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="md:w-2/3 text-white space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                Support Services
              </h1>
              <p className="text-lg lg:text-xl text-white/90 leading-relaxed max-w-2xl">
                Fast, reliable technical support when it matters most.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Section */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            {/* Left Text Block */}
            <div className="w-full lg:w-1/2">
              <h2 className="text-2xl md:text-[32px] font-semibold text-[#1B3764] leading-[120%] tracking-tight mb-6">
                Responsive Support. Minimal Disruption.
              </h2>
              <p className="text-[#41444B] text-[16px] leading-[180%] tracking-tight mb-8">
                Ensure business continuity with intelligent, responsive technical support. Our
                Support Services leverage AI-powered ticketing, automated diagnostics, and
                self-service portals alongside experienced technicians who resolve issues
                fast — so your teams stay productive and your operations keep running.
              </p>

              <h3 className="text-lg font-semibold text-[#171A20] mb-4">
                What&apos;s Included
              </h3>
              <ul className="space-y-3 mb-8">
                {[
                  "Multi-Tier Support (L1, L2, L3)",
                  "AI-Powered Ticketing & Automated Diagnostics",
                  "Self-Service Portal & Knowledge Base",
                  "On-Site & Remote Break/Fix Support",
                  "Hardware & Software Troubleshooting",
                  "Escalation Management & SLA Tracking",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#BD2E25] mt-0.5 flex-shrink-0" />
                    <span className="text-[#41444B] text-[16px] leading-normal">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/contact"
                className="bg-[#BD2E25] hover:bg-[#A02923] text-white font-medium py-3 px-8 rounded-[6px] transition inline-block"
              >
                View Support Tiers
              </Link>
            </div>

            {/* Right — Ideal For Callout + Image */}
            <div className="w-full lg:w-1/2 space-y-6">
              <div className="bg-[#F8F8F8] border border-[#D0D0D0] rounded-lg p-8 w-full">
                <h3 className="text-lg font-semibold text-[#1B3764] mb-3">
                  Ideal For
                </h3>
                <p className="text-[#5C6280] text-[16px] leading-[180%] tracking-tight">
                  Businesses that need reliable, SLA-backed technical support to complement
                  their internal IT team — without the overhead of building a full support
                  operation.
                </p>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/services/service3.jpg"
                alt="Technical support operations"
                className="w-full h-[280px] lg:h-[320px] object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-[#F9FAFB] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-[32px] font-semibold text-[#1B3764] leading-[120%] tracking-tight mb-12 text-center">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Step 1 */}
            <div className="flex flex-col items-start">
              <div className="bg-[#BD2E25] text-white font-bold text-[28px] w-12 h-14 flex items-center justify-center mb-6">
                01
              </div>
              <h3 className="text-xl font-semibold text-[#171A20] mb-3">Report</h3>
              <p className="text-[#5C6280] text-[16px] leading-[180%] tracking-tight">
                Submit issues via phone, email, self-service portal, or automated alerting.
                AI-powered triage routes tickets to the right team instantly.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-start">
              <div className="bg-[#BD2E25] text-white font-bold text-[28px] w-12 h-14 flex items-center justify-center mb-6">
                02
              </div>
              <h3 className="text-xl font-semibold text-[#171A20] mb-3">Resolve</h3>
              <p className="text-[#5C6280] text-[16px] leading-[180%] tracking-tight">
                Our technicians diagnose and fix issues with speed and precision — remotely or
                on-site — with real-time status updates throughout.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-start">
              <div className="bg-[#BD2E25] text-white font-bold text-[28px] w-12 h-14 flex items-center justify-center mb-6">
                03
              </div>
              <h3 className="text-xl font-semibold text-[#171A20] mb-3">Review</h3>
              <p className="text-[#5C6280] text-[16px] leading-[180%] tracking-tight">
                Post-resolution analysis identifies root causes and prevention measures.
                Monthly reporting tracks SLA performance and recurring trends.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <Banner />
    </div>
  );
}
