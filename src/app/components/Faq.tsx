"use client";

import { useState } from "react";
import { ChevronRight, Phone } from "lucide-react";

const FAQ_ITEMS = [
  {
    question: "What is your typical engagement timeline?",
    answer:
      "Most projects begin with a 2-week discovery phase. Implementation timelines range from 4\u201312 weeks depending on scope. We provide a detailed project plan with milestones before any work begins.",
  },
  {
    question: "Do you hold industry certifications?",
    answer:
      "Yes. Our team holds certifications across Cisco, Microsoft, AWS, and CompTIA. We maintain partnerships with leading OEMs to ensure access to the latest technology and priority support.",
  },
  {
    question: "How do you handle data security and compliance?",
    answer:
      "Security is embedded in every solution we deliver. We follow industry frameworks including ISO 27001 principles and conduct regular vulnerability assessments. All client data is handled under strict NDA and data-protection protocols.",
  },
  {
    question: "What does your Managed Services SLA look like?",
    answer:
      "Our Managed Services include guaranteed response times, 24/7 monitoring, monthly performance reports, and a dedicated account manager. SLA tiers are customized to your operational requirements and risk tolerance.",
  },
  {
    question: "Can you work alongside our existing IT team?",
    answer:
      "Absolutely. Many clients engage us as an extension of their internal team. We integrate seamlessly with your workflows, tools, and escalation procedures\u2014augmenting capacity without disrupting operations.",
  },
  {
    question: "What industries do you serve?",
    answer:
      "We serve clients across telecommunications, financial services, manufacturing, logistics, government, and professional services. Our solutions are industry-aware but technology-agnostic\u2014we recommend what works, not what pays us the highest margin.",
  },
  {
    question: "How do you ensure minimal disruption during migrations?",
    answer:
      "Every migration follows our proven 5-phase methodology: Assess, Plan, Test, Migrate, Validate. We run parallel environments and schedule cutovers during off-peak windows to eliminate business impact.",
  },
  {
    question: "What happens after deployment?",
    answer:
      "Post-deployment, you receive a 30-day hypercare period with priority support, followed by ongoing monitoring and optimization. We don\u2019t disappear after go-live\u2014that\u2019s when the real partnership begins.",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="bg-[#F6F6F6] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left: FAQ */}
        <div className="w-full md:w-[500px]">
          <span className="inline-block border-l-4 border-[#BD2E25] bg-white px-2 py-1 text-sm font-medium text-[#333333] mb-2">
            FAQ
          </span>
          <h2 className="text-3xl font-semibold text-[#171A20] mb-6">
            Frequently Asked <br /> Questions
          </h2>
          <ul className="space-y-4">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = idx === openIndex;
              return (
                <li key={idx} className="border-b border-[#D0D0D0] pb-4">
                  <button
                    onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                    aria-expanded={isOpen}
                    className="w-full flex justify-between items-center text-left text-[#262626]"
                  >
                    <span className="text-lg">{item.question}</span>
                    <ChevronRight
                      size={24}
                      className={`transform transition-transform duration-200 ${
                        isOpen ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                  {isOpen && item.answer && (
                    <p className="mt-2 text-[#41444B]">{item.answer}</p>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right: Hero image + consultation box */}
        <div className="relative w-full md:hidden lg:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/career/faq.png"
            alt="Consultation"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
          <div className="absolute top-[25%] left-0 right-0 lg:left-[-80px] flex md:justify-start justify-center items-center">
            <div className="bg-[#BD2E25] text-white p-8 max-w-sm shadow-lg transform scale-50 md:scale-100">
              <h3 className="text-xl font-semibold mb-4">
                You Need Any Help? Get Free Consultation
              </h3>
              <div className="flex items-center mb-6">
                <div className="bg-white/20 p-3 rounded-full mr-3">
                  <Phone className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-sm">Have Any Questions</p>
                  <p className="font-medium">(233) 208 889 270</p>
                </div>
              </div>
              <button className="bg-white text-[#BD2E25] px-6 py-2 font-medium hover:bg-[#F2F2F2] transition">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
