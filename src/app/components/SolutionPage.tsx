import Image from "next/image";
import Link from "next/link";
import Reveal from "@/motion/Reveal";
import Magnetic from "@/motion/Magnetic";
import AskBand from "./AskBand";
import PageHero from "./PageHero";
import RelatedTraining from "./RelatedTraining";
import SolutionPartners from "./SolutionPartners";
import type { Formation } from "./PageHero";

/**
 * The shared shape of the four pillar pages — PHASE5_BRIEF.md §4 Task 3.
 *
 * The four pages were four copies of one layout that had drifted apart in
 * the details: the same capability list with a red tick beside every line,
 * the same three benefit cards with a red icon tile, the same red button.
 * They are one layout now, so the tokens can only be right or wrong once.
 *
 * The content stays with each page. So does the alternating rule from
 * CLAUDE.md — Network and Cloud put their text left, Security and
 * Data-centric put it right — which is what `imageSide` carries.
 *
 * Capabilities lost their ticks. A list of six things we do is a list, and
 * a red tick beside each one is the reseller tier's way of making six
 * ordinary items look like a feature comparison.
 */

export interface SolutionPageProps {
  slug: string;
  formation: Formation;
  title: string;
  lead: string;
  overviewHeading: string;
  overviewBody: string;
  overviewImage: string;
  /** CLAUDE.md: Network and Cloud image-right, Security and Data-centric image-left. */
  imageSide: "left" | "right";
  capabilities: readonly string[];
  cta: string;
  benefitsHeading: string;
  benefitsLead: string;
  benefits: readonly { title: string; description: string }[];
}

export default function SolutionPage({
  slug,
  formation,
  title,
  lead,
  overviewHeading,
  overviewBody,
  overviewImage,
  imageSide,
  capabilities,
  cta,
  benefitsHeading,
  benefitsLead,
  benefits,
}: SolutionPageProps) {
  return (
    <div>
      <PageHero title={title} lead={lead} formation={formation} />

      <section className="band-ivory w-full py-24 md:py-32" aria-label="Overview">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div className={imageSide === "left" ? "lg:order-2" : undefined}>
              <Reveal as="h2" className="type-h2 max-w-[20ch] text-neutral-900">
                {overviewHeading}
              </Reveal>
              <Reveal as="p" className="type-body-l mt-6 max-w-[60ch] text-neutral-600" delay={80}>
                {overviewBody}
              </Reveal>

              <ul className="mt-10 border-t border-neutral-200">
                {capabilities.map((item) => (
                  <li
                    key={item}
                    className="type-body border-b border-neutral-200 py-4 text-neutral-900"
                  >
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-10">
                <Magnetic>
                  <Link
                    href="/contact"
                    className="inline-flex h-14 items-center rounded-[6px] bg-primary-500 px-8 font-semibold text-white transition-colors duration-[var(--motion-duration-micro)] hover:bg-primary-600"
                  >
                    {cta}
                  </Link>
                </Magnetic>
              </div>
            </div>

            <div
              className={`relative aspect-[4/3] overflow-hidden ${
                imageSide === "left" ? "lg:order-1" : ""
              }`}
            >
              <Image
                src={overviewImage}
                alt=""
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="photo-grade object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Three entries on Obsidian, so the argument for the pillar sits in
          the register the object lives in rather than in three white cards. */}
      <section
        data-register="obsidian"
        data-header-dark=""
        className="band-obsidian on-obsidian w-full py-24 md:py-32"
        aria-label="Why enterprises choose us"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal as="h2" className="type-h2 max-w-[20ch] text-silver-100">
            {benefitsHeading}
          </Reveal>
          <Reveal as="p" className="type-body-l mt-6 max-w-[56ch] text-silver-300" delay={80}>
            {benefitsLead}
          </Reveal>

          <div className="mt-16 grid gap-x-12 gap-y-10 md:grid-cols-3">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="border-t border-white/15 pt-8">
                <h3 className="type-h3 text-silver-100">{benefit.title}</h3>
                <p className="type-body mt-4 text-silver-300">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SolutionPartners solution={slug} />
      <RelatedTraining solutionSlug={slug} />
      <AskBand />
    </div>
  );
}
