"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

/**
 * The questions on /contact — PHASE5_BRIEF.md §4 Task 7.
 *
 * Rows on hairlines with the answer opening on the 0fr to 1fr grid that
 * Pillars.tsx uses, so there is no measured height and the closed panel
 * stays in the page rather than being removed from and returned to it.
 *
 * What went with the cards: a red accent-bar pill reading "FAQ", and a
 * photograph carrying a floating red box offering a "Free Consultation"
 * with a phone icon in a circle. Free is the one word the pricing frame
 * must never contain (COPY_DECK.md §8.3), the box duplicated the page's
 * own contact details, and its button was a <button> that did nothing.
 */

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
    <section className="band-ivory w-full pb-24 md:pb-32" aria-label="Frequently asked questions">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border-t border-neutral-200 pt-12">
          <p className="type-eyebrow text-neutral-500">FAQ</p>
          <h2 className="type-h2 mt-6 text-neutral-900">Frequently Asked Questions</h2>
        </div>

        <ul className="mt-12 max-w-[80ch] border-t border-neutral-200">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = idx === openIndex;
            return (
              <li key={idx} className="border-b border-neutral-200">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  aria-expanded={isOpen}
                  className="flex w-full items-start justify-between gap-6 py-6 text-left"
                >
                  <span className="type-h3 text-neutral-900">{item.question}</span>
                  <Plus
                    aria-hidden="true"
                    strokeWidth={1.5}
                    className={`mt-1 h-6 w-6 shrink-0 text-neutral-500 transition-transform duration-[var(--motion-duration-ui)] ease-[var(--motion-ease-out)] ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  />
                </button>

                <div
                  className={`grid transition-[grid-template-rows] duration-[var(--motion-duration-reveal)] ease-[var(--motion-ease-out)] ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="type-body-l max-w-[70ch] pb-8 text-neutral-600">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
