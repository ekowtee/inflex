"use client";

import Banner from "../../components/Banner";
import SolutionPartners from "../../components/SolutionPartners";
import Link from "next/link";
import { CheckCircle, Shield, Lock, Zap } from "lucide-react";

const capabilities = [
  "Security Assessments & Penetration Testing",
  "Threat Detection & Response (MDR)",
  "Compliance & Governance Frameworks",
  "Identity & Access Management (IAM)",
  "Data Loss Prevention (DLP)",
  "Security Awareness Training",
];

const benefits = [
  {
    icon: Shield,
    title: "Proactive Defence",
    description:
      "AI-driven threat intelligence detects and neutralises attacks before they impact operations.",
  },
  {
    icon: Lock,
    title: "Regulatory Compliance",
    description:
      "Pre-built frameworks for ISO 27001, GDPR, PCI-DSS, and industry-specific regulations.",
  },
  {
    icon: Zap,
    title: "Rapid Response",
    description:
      "Average incident response time under 15 minutes with our dedicated security operations centre.",
  },
];

export default function DataSecurityPage() {
  return (
    <div>
      {/* Hero */}
      <div className="relative w-full h-[500px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/solutions/sol8.png"
          alt="Data Security"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="md:w-2/3 lg:w-1/2 text-white space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold">Data Security</h1>
              <p className="text-lg text-white/90 max-w-xl">
                End-to-end protection for your most critical digital assets.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Overview — image left, text right */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="rounded-lg overflow-hidden order-2 lg:order-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/solutions/sol3.png"
                alt="Data security overview"
                className="w-full h-[400px] object-cover rounded-lg"
                loading="lazy"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1B3764] mb-6">
                Comprehensive Threat Protection, Around the Clock
              </h2>
              <p className="text-[#41444B] text-lg leading-relaxed mb-8">
                Cyber threats evolve daily. Your defences must evolve faster. We
                deliver comprehensive security assessments, continuous threat
                monitoring, rapid incident response, and compliance frameworks
                that protect your data, infrastructure, and reputation &mdash;
                24/7/365.
              </p>
              <ul className="space-y-4 mb-8">
                {capabilities.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#BD2E25] mt-0.5 flex-shrink-0" />
                    <span className="text-[#41444B]">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className="inline-block bg-[#BD2E25] hover:bg-[#A02923] text-white font-semibold px-8 py-3 rounded-[6px] transition-colors duration-300"
              >
                Strengthen Your Security Posture
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 lg:py-24 bg-[#F7F8FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#171A20] mb-4">
              Why Leading Enterprises Choose Us
            </h2>
            <p className="text-[#5C6280] text-lg max-w-2xl mx-auto">
              Enterprise-grade security solutions that protect what matters
              most.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.title}
                  className="bg-white border border-[#D0D0D0] rounded-lg p-8 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="w-12 h-12 bg-[#BD2E25] rounded-[6px] flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#171A20] mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-[#41444B] leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technology Partners */}
      <SolutionPartners solution="data-security" />

      {/* CTA Banner */}
      <Banner />
    </div>
  );
}
