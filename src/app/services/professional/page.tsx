"use client";

import Banner from "../../components/Banner";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function ProfessionalServicesPage() {
  return (
    <div>
      {/* Hero */}
      <div className="relative w-full h-[500px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/services/Services2.jpeg"
          alt="Professional Services"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 flex items-end pb-10 md:pb-28 lg:pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="md:w-2/3 text-white space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                Professional Services
              </h1>
              <p className="text-lg lg:text-xl text-white/90 leading-relaxed max-w-2xl">
                Expert guidance for high-stakes IT initiatives and digital transformation.
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
                Strategic Consulting. Flawless Execution.
              </h2>
              <p className="text-[#41444B] text-[16px] leading-[180%] tracking-tight mb-8">
                Leverage our deep technical expertise for specific projects and strategic
                consulting. From AI strategy workshops and automation opportunity assessments
                to complex cloud migrations and infrastructure overhauls — our Professional
                Services team delivers on time, on budget, and on point.
              </p>

              <h3 className="text-lg font-semibold text-[#171A20] mb-4">
                What&apos;s Included
              </h3>
              <ul className="space-y-3 mb-8">
                {[
                  "IT Assessments & Technology Audits",
                  "AI Strategy Workshops & Automation Roadmaps",
                  "Solution Architecture & Design",
                  "Cloud Migration Planning & Execution",
                  "Digital Transformation Consulting",
                  "Infrastructure Implementation & Upgrades",
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
                Start a Conversation
              </Link>
            </div>

            {/* Right — Ideal For Callout + Image */}
            <div className="w-full lg:w-1/2 space-y-6">
              <div className="bg-[#F8F8F8] border border-[#D0D0D0] rounded-lg p-8 w-full">
                <h3 className="text-lg font-semibold text-[#1B3764] mb-3">
                  Ideal For
                </h3>
                <p className="text-[#5C6280] text-[16px] leading-[180%] tracking-tight">
                  Businesses needing expert help with digital transformation strategy, AI
                  adoption, automation implementation, technology migrations, or strategic IT
                  planning.
                </p>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/services/Services1.jpeg"
                alt="Strategic consulting and technology planning"
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
              <h3 className="text-xl font-semibold text-[#171A20] mb-3">Discover</h3>
              <p className="text-[#5C6280] text-[16px] leading-[180%] tracking-tight">
                We conduct a thorough assessment of your current environment, business goals,
                and pain points to define a clear scope of work.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-start">
              <div className="bg-[#BD2E25] text-white font-bold text-[28px] w-12 h-14 flex items-center justify-center mb-6">
                02
              </div>
              <h3 className="text-xl font-semibold text-[#171A20] mb-3">Design</h3>
              <p className="text-[#5C6280] text-[16px] leading-[180%] tracking-tight">
                Our architects create a tailored solution blueprint with timelines, milestones,
                risk mitigation, and measurable success criteria.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-start">
              <div className="bg-[#BD2E25] text-white font-bold text-[28px] w-12 h-14 flex items-center justify-center mb-6">
                03
              </div>
              <h3 className="text-xl font-semibold text-[#171A20] mb-3">Deliver</h3>
              <p className="text-[#5C6280] text-[16px] leading-[180%] tracking-tight">
                We execute with precision, provide knowledge transfer to your team, and ensure
                a smooth handoff with 30-day post-deployment support.
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
