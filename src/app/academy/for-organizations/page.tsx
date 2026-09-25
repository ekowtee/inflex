import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/motion/Reveal";
import AskBand from "../../components/AskBand";
import DomainCard from "../../components/DomainCard";
import PageHero from "../../components/PageHero";
import TrainingEnquiryForm from "./TrainingEnquiryForm";
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
 * The form (TrainingEnquiryForm) keeps its fields and names, and posts
 * through the contact system at /api/contact rather than a mailto action.
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

export default function ForOrganizationsPage() {
  return (
    <div>
      <PageHero
        eyebrow="For Organisations"
        title="Your team already knows the gap. We close it."
        lead="We build the curriculum around your stack and your objectives, deliver it where your team already is, and measure it against something your CFO recognises."
        formation="tower"
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
            Training your CFO will fund twice.
          </Reveal>
          <Reveal as="p" className="type-body-l mt-6 max-w-[58ch] text-neutral-600" delay={160}>
            Three reasons L&amp;D leaders and CIOs bring us in rather than a
            training provider.
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
            Four steps, and you see the measurement at the end of them
          </Reveal>
          <Reveal as="p" className="type-body-l mt-6 max-w-[56ch] text-silver-300" delay={80}>
            Built for the organisations that have to show what the training
            changed.
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
              Share a few details. We will come back within two working days with
              a shape for the engagement, not a brochure.
            </p>
          </div>

          <TrainingEnquiryForm domains={domains.map((d) => ({ slug: d.slug, title: d.title }))} />
        </div>
      </section>

      <AskBand
        variant="academy"
        line="Share a few details. We will come back within two working days with a shape for the engagement, not a brochure."
        label="Tell us about your team"
        href="#enquire"
      />
    </div>
  );
}
