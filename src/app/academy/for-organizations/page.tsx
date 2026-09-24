import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/motion/Reveal";
import AskBand from "../../components/AskBand";
import DomainCard from "../../components/DomainCard";
import PageHero from "../../components/PageHero";
import { domains } from "../data";

/**
 * /academy/for-organizations — PHASE5_BRIEF.md §4 Task 5.
 *
 * The Academy's enterprise enquiry page, and the one page whose closing
 * band points at itself: its form is the next step, so AskBand sends the
 * reader down to #enquire rather than off to /contact.
 *
 * The four-step engagement is the one place on the site where a number may
 * lead a block, because the sequence is the point. Set as a large tabular
 * numeral the way Receipt.tsx sets a year, rather than as a watermark
 * behind a card with a navy icon tile on it.
 *
 * The form keeps its fields, its names and its mailto action; only the
 * surface is re-set.
 */

export const metadata: Metadata = {
  title: "Corporate & Enterprise Training",
  description:
    "Custom training programmes for corporate teams and institutions. On-site delivery, measurable ROI, and curricula tailored to your strategic priorities.",
};

const valueProps = [
  {
    title: "Custom Curricula",
    description:
      "Programmes adapted to your technology stack, team maturity, and commercial objectives — not off-the-shelf content.",
  },
  {
    title: "On-Site Delivery",
    description:
      "We come to your offices, in Ghana and across the region. Minimise disruption, maximise team cohesion.",
  },
  {
    title: "Measurable ROI",
    description:
      "Pre- and post-programme assessments, competency mapping, and outcome reporting you can take to your CFO.",
  },
] as const;

const process = [
  {
    number: "01",
    title: "Assess",
    description:
      "We start by understanding your team, your current capability, and the commercial outcomes the training needs to drive.",
  },
  {
    number: "02",
    title: "Design",
    description:
      "We tailor the curriculum to your context — selecting modules, adjusting depth, and incorporating your real-world scenarios.",
  },
  {
    number: "03",
    title: "Deliver",
    description:
      "Practitioner-led delivery on-site, virtually, or hybrid. Hands-on where it matters, with flexibility for team schedules.",
  },
  {
    number: "04",
    title: "Measure",
    description:
      "Post-programme assessment, capability reporting, and a follow-up plan to embed learning into day-to-day work.",
  },
] as const;

const field =
  "w-full rounded-[6px] border border-neutral-300 bg-white px-4 py-3 type-body text-neutral-900 transition-colors duration-[var(--motion-duration-micro)] hover:border-neutral-500";
const labelClass = "type-telemetry block text-neutral-500";

export default function ForOrganizationsPage() {
  return (
    <div>
      <PageHero
        eyebrow="For Organisations"
        title="Transform your workforce. Transform your business."
        lead="Custom training programmes built around your strategic priorities. Delivered on-site, virtually, or hybrid — measured against the outcomes that matter to your leadership team."
        formation="none"
      />

      <section className="band-ivory w-full py-24 md:py-32" aria-label="Why corporates choose us">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="type-telemetry mb-12 text-neutral-500">
            <Link
              href="/academy"
              className="underline decoration-neutral-300 underline-offset-[4px] transition-colors duration-[var(--motion-duration-micro)] hover:decoration-neutral-900"
            >
              Academy
            </Link>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">For Organisations</span>
          </nav>

          <Reveal as="p" className="type-eyebrow text-neutral-500">
            Why corporates choose us
          </Reveal>
          <Reveal as="h2" className="type-h2 mt-6 max-w-[22ch] text-neutral-900" delay={80}>
            Training that moves commercial outcomes.
          </Reveal>
          <Reveal as="p" className="type-body-l mt-6 max-w-[58ch] text-neutral-600" delay={160}>
            Three reasons L&amp;D leaders and CIOs partner with Inflexions Academy
            over generic training providers.
          </Reveal>

          <div className="mt-16 grid gap-x-12 gap-y-10 md:grid-cols-3">
            {valueProps.map((item) => (
              <div key={item.title} className="border-t border-neutral-200 pt-8">
                <h3 className="type-h3 text-neutral-900">{item.title}</h3>
                <p className="type-body mt-4 text-neutral-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The engagement, on Obsidian: four steps that read as one sequence. */}
      <section
        data-register="obsidian"
        data-header-dark=""
        className="band-obsidian on-obsidian w-full py-24 md:py-32"
        aria-label="How the engagement runs"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal as="h2" className="type-h2 max-w-[20ch] text-silver-100">
            A proven four-step engagement
          </Reveal>
          <Reveal as="p" className="type-body-l mt-6 max-w-[56ch] text-silver-300" delay={80}>
            Our engagement model is built for organisations that need outcomes,
            not just attendance sheets.
          </Reveal>

          <ol className="mt-16 grid gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
            {process.map((step) => (
              <li key={step.number} className="border-t border-white/15 pt-8">
                <p className="type-h2 tabular-nums text-silver-500">{step.number}</p>
                <h3 className="type-h3 mt-6 text-silver-100">{step.title}</h3>
                <p className="type-body mt-4 text-silver-300">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="band-ivory w-full py-24 md:py-32" aria-label="Domains">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="type-h2 text-neutral-900">Four domains. One partner.</h2>
          <p className="type-body-l mt-4 max-w-[56ch] text-neutral-600">
            Explore the domains most relevant to your team. Programmes can be
            combined into multi-track learning journeys.
          </p>

          <div className="mt-16 grid gap-x-12 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
            {domains.map((domain) => (
              <DomainCard key={domain.slug} domain={domain} />
            ))}
          </div>
        </div>
      </section>

      <section id="enquire" className="band-ivory w-full pb-24 md:pb-32" aria-label="Enquiry">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="border-t border-neutral-200 pt-12">
            <h2 className="type-h2 text-neutral-900">Tell us about your team</h2>
            <p className="type-body-l mt-4 text-neutral-600">
              Share a few details and our Academy team will be in touch within two
              working days to design your engagement.
            </p>
          </div>

          <form
            action="mailto:sales@inflexions.tech"
            method="post"
            encType="text/plain"
            className="mt-12 space-y-6"
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="company" className={labelClass}>
                  Organisation
                </label>
                <input id="company" name="company" type="text" required className={`${field} mt-3`} />
              </div>
              <div>
                <label htmlFor="contact-name" className={labelClass}>
                  Your name
                </label>
                <input
                  id="contact-name"
                  name="contactName"
                  type="text"
                  required
                  className={`${field} mt-3`}
                />
              </div>
              <div>
                <label htmlFor="email" className={labelClass}>
                  Work email
                </label>
                <input id="email" name="email" type="email" required className={`${field} mt-3`} />
              </div>
              <div>
                <label htmlFor="team-size" className={labelClass}>
                  Team size
                </label>
                <select id="team-size" name="teamSize" className={`${field} mt-3`}>
                  <option>1–10</option>
                  <option>11–25</option>
                  <option>26–50</option>
                  <option>51–100</option>
                  <option>100+</option>
                </select>
              </div>
            </div>

            <fieldset>
              <legend className={labelClass}>Domains of interest</legend>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2">
                {domains.map((domain) => (
                  <label
                    key={domain.slug}
                    className="type-body flex items-center gap-3 border-b border-neutral-200 py-3 text-neutral-900"
                  >
                    <input
                      type="checkbox"
                      name="domains"
                      value={domain.slug}
                      className="h-4 w-4 rounded-[2px] border-neutral-300 accent-primary-500"
                    />
                    {domain.title}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="format" className={labelClass}>
                  Preferred format
                </label>
                <select id="format" name="format" className={`${field} mt-3`}>
                  <option>On-site</option>
                  <option>Virtual</option>
                  <option>Hybrid</option>
                  <option>Not sure yet</option>
                </select>
              </div>
              <div>
                <label htmlFor="timeline" className={labelClass}>
                  Timeline
                </label>
                <select id="timeline" name="timeline" className={`${field} mt-3`}>
                  <option>Within 1 month</option>
                  <option>1–3 months</option>
                  <option>3–6 months</option>
                  <option>Exploring only</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="notes" className={labelClass}>
                Anything else we should know?
              </label>
              <textarea id="notes" name="notes" rows={5} className={`${field} mt-3 resize-y`} />
            </div>

            <button
              type="submit"
              className="inline-flex h-14 items-center rounded-[6px] bg-primary-500 px-8 font-semibold text-white transition-colors duration-[var(--motion-duration-micro)] hover:bg-primary-600"
            >
              Request Training Proposal
            </button>
          </form>
        </div>
      </section>

      <AskBand
        variant="academy"
        line="Share a few details and our Academy team will be in touch within two working days to design your engagement."
        label="Tell us about your team"
        href="#enquire"
      />
    </div>
  );
}
