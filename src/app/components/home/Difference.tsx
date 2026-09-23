/**
 * Beat 5 — the difference. SCROLL_NARRATIVE.md §6 Beat 5, copy sheet rows 5.
 *
 * The register turns Ivory here, and it is earned: the visitor has seen the
 * proof, so the page can stop pressing and start reasoning. The ledger
 * answers the comparison the buyer is actually running — against the
 * reseller tier and the generalists — by naming it and crossing it out.
 *
 * The intelligence row the narrative folded in here (§8.2) has its own
 * Obsidian band now, Intelligence.tsx, straight after this one.
 */
import Reveal from "@/motion/Reveal";
import SplitLines from "@/motion/SplitLines";
import ExitLink from "./ExitLink";
import Ledger from "./Ledger";

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
          Why Inflexions
        </Reveal>
        <SplitLines as="h2" className="type-display-l mt-8 max-w-[18ch] text-neutral-900" delay={80}>
          Not a reseller. Not a generalist. Not a lock-in.
        </SplitLines>

        <div className="mt-14 md:mt-16">
          <Ledger />
        </div>

        <div className="mt-16">
          <ExitLink href="/about" className="text-neutral-900">
            Why enterprises choose us
          </ExitLink>
        </div>
      </div>
    </section>
  );
}
