"use client";

import Banner from "../../components/Banner";
import SolutionPartners from "../../components/SolutionPartners";
import RelatedTraining from "../../components/RelatedTraining";
import Link from "next/link";
import { CheckCircle, Brain, Database, Cpu } from "lucide-react";

const capabilities = [
  "Data Architecture & Governance",
  "Business Intelligence & Reporting",
  "Predictive Analytics & Machine Learning",
  "AI-Driven Process Automation",
  "Real-Time Data Pipelines",
  "Data Lake & Warehouse Design",
];

const benefits = [
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description:
      "Machine learning models that surface opportunities and risks before your competitors see them.",
  },
  {
    icon: Database,
    title: "Single Source of Truth",
    description:
      "Unified data platforms that eliminate silos and give every stakeholder the same picture.",
  },
  {
    icon: Cpu,
    title: "Measurable ROI",
    description:
      "Every analytics initiative is tied to a business outcome — no dashboards for dashboard's sake.",
  },
];

export default function DataCentricSolutionsPage() {
  return (
    <div>
      {/* Hero */}
      <div className="relative w-full h-[500px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/solutions/sol6.jpeg"
          alt="Data-centric Solutions"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 flex items-end pb-10 md:pb-28 lg:pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="md:w-2/3 lg:w-1/2 text-white space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold">
                Data-centric Solutions
              </h1>
              <p className="text-lg text-white/90 max-w-xl">
                Turn raw data into your most powerful strategic asset.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Overview — image left, text right */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
            <div className="rounded-lg overflow-hidden order-2 lg:order-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/solutions/sol1.jpeg"
                alt="Data-centric solutions overview"
                className="w-full h-full object-cover rounded-lg"
                loading="lazy"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1B3764] mb-6">
                Intelligence That Drives Decisions
              </h2>
              <p className="text-[#41444B] text-lg leading-relaxed mb-8">
                Data without insight is just noise. We build the infrastructure,
                pipelines, and analytical capabilities that transform your raw
                data into actionable intelligence &mdash; from predictive analytics
                dashboards to AI-driven automation that gives leadership the
                clarity to act with confidence.
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
                Unlock Your Data Potential
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
              Data solutions that turn information into competitive advantage.
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
      <SolutionPartners solution="data-centric-solutions" />

      {/* Related Training */}
      <RelatedTraining solutionSlug="data-centric-solutions" />

      {/* CTA Banner */}
      <Banner />
    </div>
  );
}
