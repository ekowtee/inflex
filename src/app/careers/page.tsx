import Image from "next/image";
import Link from "next/link";
import Magnetic from "@/motion/Magnetic";
import Reveal from "@/motion/Reveal";
import FeaturedJobs from "../components/FeaturedJobs";
import PageHero from "../components/PageHero";

/**
 * /careers — PHASE5_BRIEF.md §4 Task 6.
 *
 * The hero, section heading and body are the Variant B copy approved by the
 * owner on 25 September 2026 (PHASE5_COPY.md). Two things were removed and
 * both are recorded in
 * PHASE5_REPORT.md: the "Search Job" field, which had no state, no handler
 * and no form around it and searched nothing; and the navy wash over a
 * photograph at the foot, which was the retired Banner's composition. Its
 * copy and both its links are kept, on Obsidian.
 *
 * The three links go to /jobs and /internships, built on the owner's
 * decision of 24 September 2026.
 */
export default function CareersPage() {
  return (
    <div>
      <PageHero
        title="Build the thing the country runs on."
        lead="If you want your work to be a data centre, a national network, or the system a ministry depends on — this is the room."
        formation="staircase"
      />

      <section className="band-ivory w-full py-24 md:py-32" aria-label="What the work is">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src="/assets/career/career1.webp"
                alt="Team reviewing job roles"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="photo-grade object-cover"
              />
            </div>

            <div>
              <Reveal as="h2" className="type-h2 max-w-[18ch] text-neutral-900">
                What the work is
              </Reveal>
              <Reveal as="p" className="type-body-l mt-6 max-w-[56ch] text-neutral-600" delay={80}>
                The systems you would work on are load-bearing. When they are
                down, a bank is down, or a network is, or a ministry is.
              </Reveal>
              <Reveal as="p" className="type-body-l mt-6 max-w-[56ch] text-neutral-600" delay={160}>
                We hire for mastery and curiosity, and we are small enough that
                you will not be three layers from the decision.
              </Reveal>

              <Reveal className="mt-10" delay={240}>
                <Link
                  href="/jobs"
                  className="inline-flex h-14 items-center rounded-[6px] border border-neutral-300 px-8 font-semibold text-neutral-900 transition-colors duration-[var(--motion-duration-micro)] hover:bg-neutral-50"
                >
                  View Jobs
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <FeaturedJobs />

      <section
        data-register="obsidian"
        data-header-dark=""
        className="band-obsidian on-obsidian w-full py-24 md:py-32"
        aria-label="Join us"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="type-h2 text-silver-100">Join Us</h2>
          <p className="type-body-l mt-6 max-w-[52ch] text-silver-300">
            Shape the technology backbone of Africa&apos;s leading enterprises.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Magnetic>
              <Link
                href="/internships"
                className="inline-flex h-14 items-center rounded-[6px] bg-primary-500 px-8 font-semibold text-white transition-colors duration-[var(--motion-duration-micro)] hover:bg-primary-600"
              >
                View Internships
              </Link>
            </Magnetic>
            <Link href="/jobs" className="btn-secondary-obsidian text-silver-100">
              View Jobs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
