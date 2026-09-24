import Image from "next/image";
import Link from "next/link";
import Magnetic from "@/motion/Magnetic";
import Reveal from "@/motion/Reveal";
import AskBand from "./AskBand";
import PageHero from "./PageHero";

/**
 * The shared shape of the three service pages — PHASE5_BRIEF.md §4 Task 4.
 *
 * Like the pillar pages, these were three copies of one layout that had
 * drifted apart. They are one layout with three sets of content now.
 *
 * "How It Works" is a sequence, so its steps keep their numbers, set large
 * and tabular the way Receipt.tsx sets a year rather than in a solid red
 * square. Everything else — the included list, the ideal-for note — becomes
 * entries on hairlines.
 *
 * Services take no formation still. The four formations belong to the four
 * things we build; how we engage is not one of them.
 */

export interface ServicePageProps {
  title: string;
  lead: string;
  overviewHeading: string;
  overviewBody: string;
  included: readonly string[];
  idealFor: string;
  cta: string;
  image: string;
  stepsHeading: string;
  steps: readonly { title: string; description: string }[];
}

export default function ServicePage({
  title,
  lead,
  overviewHeading,
  overviewBody,
  included,
  idealFor,
  cta,
  image,
  stepsHeading,
  steps,
}: ServicePageProps) {
  return (
    <div>
      <PageHero title={title} lead={lead} formation="none" />

      <section className="band-ivory w-full py-24 md:py-32" aria-label="Overview">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <Reveal as="h2" className="type-h2 max-w-[20ch] text-neutral-900">
                {overviewHeading}
              </Reveal>
              <Reveal as="p" className="type-body-l mt-6 max-w-[60ch] text-neutral-600" delay={80}>
                {overviewBody}
              </Reveal>

              <h3 className="type-h3 mt-14 text-neutral-900">What&apos;s Included</h3>
              <ul className="mt-6 border-t border-neutral-200">
                {included.map((item) => (
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

            <div>
              <div className="border-t border-neutral-200 pt-8">
                <h3 className="type-telemetry text-neutral-500">Ideal For</h3>
                <p className="type-body-l mt-5 max-w-[46ch] text-neutral-900">{idealFor}</p>
              </div>

              <div className="relative mt-12 aspect-[4/3] overflow-hidden">
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="photo-grade object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        data-register="obsidian"
        data-header-dark=""
        className="band-obsidian on-obsidian w-full py-24 md:py-32"
        aria-label={stepsHeading}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal as="h2" className="type-h2 text-silver-100">
            {stepsHeading}
          </Reveal>

          <ol className="mt-16 grid gap-x-12 gap-y-10 md:grid-cols-3">
            {steps.map((step, i) => (
              <li key={step.title} className="border-t border-white/15 pt-8">
                <p className="type-h2 tabular-nums text-silver-500">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="type-h3 mt-6 text-silver-100">{step.title}</h3>
                <p className="type-body mt-4 text-silver-300">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <AskBand />
    </div>
  );
}
