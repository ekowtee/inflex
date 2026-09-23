/**
 * Beat 5½ — intelligence. The approved "AI in every layer" row, given its own
 * short Obsidian band between the ledger and the partner wall (owner,
 * 23 September 2026).
 *
 * Two reasons it left the ledger. The line is one of the few on the page
 * with real conviction and it was set as a 24 px row under a comparison;
 * and the reader crossed about two screens of unbroken Ivory from the end of
 * the pillars to the ask. Here the Core comes back behind it for this band
 * only (timeline.ts), so the claim that intelligence is the fabric is shown
 * by the woven structure itself rather than asserted in a caption.
 *
 * Copy is unchanged from the sheet: eyebrow, the line, the four terms, all
 * four linking to the data-centric pillar. The terms are an index rather
 * than a sentence of links: one per cell, a hairline above each, an arrow
 * that moves on hover.
 */
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Reveal from "@/motion/Reveal";
import SplitLines from "@/motion/SplitLines";

const terms = [
  "Predictive Analytics",
  "Process Automation",
  "Data Strategy & Architecture",
  "AI Integration",
] as const;

export default function Intelligence() {
  return (
    <section
      id="intelligence"
      data-beat="5.5"
      data-register="obsidian"
      data-header-dark=""
      className="band-obsidian on-obsidian relative w-full overflow-hidden"
      aria-label="AI in every layer"
    >
      <div className="mx-auto flex min-h-[80svh] max-w-7xl flex-col justify-center px-4 py-24 sm:px-6 md:py-32 lg:px-8">
        <div className="lg:max-w-[52%]">
          <Reveal as="p" className="type-eyebrow text-silver-500">
            AI in every layer
          </Reveal>
          <SplitLines as="h2" className="type-display-l mt-8 max-w-[16ch] text-silver-100" delay={80}>
            Intelligence is not a feature. It is the fabric.
          </SplitLines>
        </div>

        {/* Left column only, two by two: the Core's ember line runs down
            the right half and would strike through a full-width row. */}
        <Reveal delay={240} className="mt-16 md:mt-20 lg:max-w-[52%]">
          <ul className="grid gap-x-10 sm:grid-cols-2">
            {terms.map((term) => (
              <li key={term}>
                <Link
                  href="/solutions/data-centric-solutions"
                  className="group flex items-start justify-between gap-4 border-t border-white/15 py-5 text-silver-100 transition-colors duration-[var(--motion-duration-ui)] ease-[var(--motion-ease-out)] hover:border-silver-100"
                >
                  <span className="type-body-l">{term}</span>
                  <ArrowUpRight
                    aria-hidden="true"
                    strokeWidth={1.5}
                    className="mt-1 h-5 w-5 shrink-0 text-silver-500 transition-[transform,color] duration-[var(--motion-duration-ui)] ease-[var(--motion-ease-out)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-silver-100"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
