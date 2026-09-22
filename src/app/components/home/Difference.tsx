/**
 * Beat 5 — the difference. SCROLL_NARRATIVE.md §6 Beat 5, copy sheet rows 5.
 *
 * The register turns Ivory here, and it is earned: the visitor has seen the
 * proof, so the page can stop pressing and start reasoning. The ledger
 * answers the comparison the buyer is actually running — against the
 * reseller tier and the generalists — by naming it and crossing it out.
 *
 * The old Intelligence chapter is folded in as one row (narrative §8.2). The
 * four terms are secondary links; the exit is the one below them.
 */
import Link from "next/link";
import Reveal from "@/motion/Reveal";
import SplitLines from "@/motion/SplitLines";
import ExitLink from "./ExitLink";
import Ledger from "./Ledger";

const terms = [
  "Predictive Analytics",
  "Process Automation",
  "Data Strategy & Architecture",
  "AI Integration",
] as const;

export default function Difference() {
  return (
    <section
      id="difference"
      data-beat="5"
      data-register="ivory"
      className="band-ivory w-full py-24 md:py-32"
      aria-label="Why Inflexions"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal as="p" className="type-eyebrow text-neutral-500">
          04 — Why Inflexions
        </Reveal>
        <SplitLines as="h2" className="type-h2 mt-6 max-w-[24ch] text-neutral-900" delay={80}>
          Not a reseller. Not a generalist. Not a lock-in.
        </SplitLines>

        <div className="mt-14 md:mt-16">
          <Ledger />
        </div>

        <Reveal className="mt-20 border-t border-neutral-200 pt-12 md:mt-24">
          <p className="type-eyebrow text-neutral-500">AI in every layer</p>
          <p className="type-h3 mt-4 max-w-[32ch] text-neutral-900">
            Intelligence is not a feature. It is the fabric.
          </p>
          <p className="type-body mt-5 text-neutral-600">
            {terms.map((term, i) => (
              <span key={term}>
                {i > 0 && " · "}
                <Link
                  href="/solutions/data-centric-solutions"
                  className="underline decoration-neutral-200 underline-offset-[3px] transition-colors duration-[var(--motion-duration-micro)] ease-[var(--motion-ease-out)] hover:decoration-primary-500"
                >
                  {term}
                </Link>
              </span>
            ))}
          </p>
        </Reveal>

        <div className="mt-12">
          <ExitLink href="/about" className="text-neutral-900">
            Why enterprises choose us
          </ExitLink>
        </div>
      </div>
    </section>
  );
}
