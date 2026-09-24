import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Reveal from "@/motion/Reveal";
import AskBand from "../components/AskBand";
import PageHero from "../components/PageHero";
import { caseStudies } from "../data";

/**
 * /case-study — PHASE5_BRIEF.md §4 Task 6.
 *
 * The entries are set the way Receipt.tsx sets them on the home page: the
 * year large and tabular as the thing the eye lands on, then the status,
 * the name and the account, over a hairline. The in-progress entry carries
 * the ember dot, which is the one place on the site ember marks something
 * live, and its status is read from data.ts rather than written here, so
 * the in-progress rule cannot drift between this page and the home page.
 *
 * What went: a photograph per entry under a black gradient with the title
 * inside it, and a red circle holding an arrow that faded in on hover.
 * The photographs stay, above the entry, graded.
 */

/** data.ts stores DD/MM/YY. */
const yearOf = (date: string) => `20${date.slice(-2)}`;

export default function CaseStudyPage() {
  return (
    <div>
      <PageHero
        title="Proof Over Promises"
        lead="Real results from real engagements across industries."
        formation="none"
      />

      <section className="band-ivory w-full py-24 md:py-32" aria-label="Overview">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <Reveal as="h2" className="type-h2 max-w-[18ch] text-neutral-900">
                Delivering Tangible Value Through Technology
              </Reveal>
              <Reveal as="p" className="type-body-l mt-6 max-w-[58ch] text-neutral-600" delay={80}>
                Don&apos;t just take our word for it. Explore how Inflexions has
                partnered with organisations like yours to solve complex
                challenges, implement transformative solutions, and achieve
                significant business results.
              </Reveal>
            </div>
            <div className="relative aspect-[16/9] overflow-hidden">
              <Image
                src="/assets/case/ImageC.webp"
                alt="ICT consultants reviewing network architecture and data centre floor plans"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="photo-grade object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="band-ivory w-full pb-24 md:pb-32" aria-label="Case studies">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-x-16 gap-y-16 md:grid-cols-2">
            {caseStudies.map((item) => {
              const live = item.status.toLowerCase().includes("progress");
              return (
                <article key={item.id} className="group relative">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="photo-grade object-cover"
                    />
                  </div>

                  <div className="mt-8 flex items-baseline gap-5 border-t border-neutral-200 pt-8">
                    <p className="type-h2 tabular-nums text-neutral-900">
                      {yearOf(item.date)}
                    </p>
                    <p className="type-telemetry flex items-center gap-2 text-neutral-500">
                      {live && (
                        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                      )}
                      {item.status} · {item.category}
                    </p>
                  </div>

                  <h3 className="type-h3 mt-6 flex items-start justify-between gap-6 text-neutral-900">
                    <Link
                      href={`/case-studies/${item.id}`}
                      className="underline decoration-transparent decoration-1 underline-offset-[6px] transition-[text-decoration-color] duration-[var(--motion-duration-ui)] after:absolute after:inset-0 after:content-[''] group-hover:decoration-neutral-900"
                    >
                      {item.title}
                    </Link>
                    <ArrowUpRight
                      aria-hidden="true"
                      strokeWidth={1.5}
                      className="mt-1 h-6 w-6 shrink-0 text-neutral-500 transition-transform duration-[var(--motion-duration-ui)] ease-[var(--motion-ease-out)] group-hover:-translate-y-1 group-hover:translate-x-1"
                    />
                  </h3>

                  <p className="type-body mt-4 max-w-[62ch] text-neutral-600">{item.summary}</p>
                  <p className="type-telemetry mt-6 text-neutral-500">{item.client}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <AskBand />
    </div>
  );
}
