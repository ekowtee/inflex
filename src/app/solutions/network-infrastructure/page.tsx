"use client";

import Banner from "../../components/Banner";
import SolutionPartners from "../../components/SolutionPartners";
import Link from "next/link";
import { CheckCircle, Network, Server, Shield } from "lucide-react";

const capabilities = [
  "LAN & WAN Architecture Design",
  "SD-WAN Deployment & Optimisation",
  "Enterprise Wireless Solutions",
  "Network Security & Segmentation",
  "Performance Monitoring & Analytics",
  "24/7 Network Operations Centre (NOC)",
];

const benefits = [
  {
    icon: Server,
    title: "99.9% Uptime",
    description:
      "Redundant architectures and proactive monitoring ensure your network never becomes the bottleneck.",
  },
  {
    icon: Network,
    title: "Scalable by Design",
    description:
      "Infrastructure that grows with your business — from a single office to a global enterprise.",
  },
  {
    icon: Shield,
    title: "Zero Trust Security",
    description:
      "Micro-segmentation and identity-based access controls embedded at the network layer.",
  },
];

export default function NetworkInfrastructurePage() {
  return (
    <div>
      {/* Hero */}
      <div className="relative w-full h-[500px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/solutions/sol5.jpeg"
          alt="Network Infrastructure"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 flex items-end pb-10 md:pb-28 lg:pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="md:w-2/3 lg:w-1/2 text-white space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold">
                Network Infrastructure
              </h1>
              <p className="text-lg text-white/90 max-w-xl">
                Secure, high-performance connectivity engineered for enterprise
                scale.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Overview */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1B3764] mb-6">
                Building Your High-Performance Digital Backbone
              </h2>
              <p className="text-[#41444B] text-lg leading-relaxed mb-8">
                Your network is the foundation of every digital initiative. We
                design, implement, and manage LAN, WAN, SD-WAN, and wireless
                solutions that deliver seamless connectivity, optimal
                performance, and robust security across every site, every device,
                and every user.
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
                Discuss Your Network Strategy
              </Link>
            </div>
            <div className="rounded-lg overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/solutions/sol2.png"
                alt="Network infrastructure overview"
                className="w-full h-[400px] object-cover rounded-lg"
                loading="lazy"
              />
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
              Purpose-built network solutions that deliver measurable business
              outcomes.
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
      <SolutionPartners solution="network-infrastructure" />

      {/* CTA Banner */}
      <Banner />
    </div>
  );
}
