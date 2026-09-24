/**
 * /contact — PHASE5_BRIEF.md §4 Task 8.
 *
 * The page where the offer is either kept or broken, so its copy is the
 * approved copy (SCROLL_NARRATIVE.md §7) and its form asks the one question
 * the offer promises to come prepared for.
 *
 * What went: a stock photograph behind the H1, a solid red block holding the
 * form with white-outlined inputs on red, and three red circles carrying an
 * icon each. The telemetry they held is worth more as plain lines beside the
 * form than as badges above it.
 *
 * A server component. Only the form is a client component, because only the
 * form needs to be.
 */
import { Mail, Phone, Clock } from "lucide-react";
import Partners from "../components/Partners";
import Faq from "../components/Faq";
import JsonLd from "../components/JsonLd";
import PageHero from "../components/PageHero";
import ContactForm from "./ContactForm";

const telemetry = [
  { Icon: Mail, label: "Email", value: "info@inflexions.tech", href: "mailto:info@inflexions.tech" },
  { Icon: Phone, label: "Phone", value: "+233 20 888 9270", href: "tel:+233208889270" },
  { Icon: Clock, label: "Hours", value: "Monday to Saturday, 9.00 to 18.00. Sunday closed.", href: null },
] as const;

export default function ContactPage() {
  return (
    <div>
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
      <PageHero
        title="Book your architecture review."
        lead="Thirty minutes, a Solutions Architect, no pitch. Tell us what you are running and what worries you, and we will come prepared."
        formation="none"
      />

      <section className="band-ivory w-full py-24 md:py-32" aria-label="Contact form">
        <div className="mx-auto grid max-w-7xl gap-16 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-20 lg:px-8">
          <ContactForm />

          {/* Not badges: three lines, each on its own hairline, which is how
              the rest of the site lists things. */}
          <div className="lg:pt-2">
            <p className="type-eyebrow text-neutral-500">Or reach us directly</p>
            <ul className="mt-8">
              {telemetry.map(({ Icon, label, value, href }) => (
                <li key={label} className="border-t border-neutral-200 py-5 first:border-t-0 first:pt-0">
                  <p className="type-telemetry flex items-center gap-2 text-neutral-500">
                    <Icon aria-hidden="true" strokeWidth={1.5} className="h-4 w-4" />
                    {label}
                  </p>
                  <p className="type-body mt-3 text-neutral-900">
                    {href ? (
                      <a
                        href={href}
                        className="underline decoration-neutral-300 underline-offset-[4px] transition-colors duration-[var(--motion-duration-micro)] hover:decoration-neutral-900"
                      >
                        {value}
                      </a>
                    ) : (
                      value
                    )}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Partners />

      <Faq />
    </div>
  );
}
