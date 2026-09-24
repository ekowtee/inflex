import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Reveal from "@/motion/Reveal";
import ExitLink from "./home/ExitLink";
import { entryGrid } from "./entryGrid";
import { programmes, getDomain } from "../academy/data";

/**
 * The cross-link from a pillar page into the Academy — CLAUDE.md, Academy
 * data; re-set for PHASE5_BRIEF.md §4 Task 3.
 *
 * It used to be a card inside a card inside a section: a grey panel with a
 * border and a radius, holding three white bordered cards, with a red icon
 * tile on the heading. Now it is a band with three entries on hairlines,
 * like every other list on the site.
 *
 * The programmes are read from academy/data.ts, which is untouched.
 */

const solutionToDomain: Record<string, string> = {
  "cloud-services": "infrastructure-cloud",
  "network-infrastructure": "infrastructure-cloud",
  "data-security": "cybersecurity-compliance",
  "data-centric-solutions": "ai-intelligent-systems",
};

export default function RelatedTraining({
  solutionSlug,
}: {
  solutionSlug: string;
}) {
  const domainSlug = solutionToDomain[solutionSlug];
  if (!domainSlug) return null;

  const domain = getDomain(domainSlug);
  if (!domain) return null;

  const related = programmes.filter((p) => p.domainSlug === domainSlug).slice(0, 3);
  if (related.length === 0) return null;

  return (
    <section className="band-ivory w-full pb-24 md:pb-32" aria-label="Related training">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border-t border-neutral-200 pt-12">
          <Reveal as="p" className="type-eyebrow text-neutral-500">
            Inflexions Academy
          </Reveal>
          <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="type-h2 text-neutral-900">
                Train your team in {domain.shortTitle}
              </h2>
              <p className="type-body-l mt-4 max-w-[52ch] text-neutral-600">
                The same practitioners who deploy these solutions teach these
                programmes.
              </p>
            </div>
            <ExitLink href={`/academy/${domain.slug}`} className="text-neutral-900">
              View all programmes
            </ExitLink>
          </div>

          <ul className={`mt-12 grid gap-x-12 gap-y-8 ${entryGrid(related.length)}`}>
            {related.map((programme) => (
              <li key={programme.slug} className="group relative border-t border-neutral-200 pt-6">
                <p className="type-telemetry text-neutral-500">
                  {programme.level} · {programme.duration}
                </p>
                <h3 className="type-h3 mt-4 flex items-start justify-between gap-4 text-neutral-900">
                  <Link
                    href={`/academy/${programme.domainSlug}/${programme.slug}`}
                    className="underline decoration-transparent decoration-1 underline-offset-[6px] transition-[text-decoration-color] duration-[var(--motion-duration-ui)] after:absolute after:inset-0 after:content-[''] group-hover:decoration-neutral-900"
                  >
                    {programme.title}
                  </Link>
                  <ArrowUpRight
                    aria-hidden="true"
                    strokeWidth={1.5}
                    className="mt-1 h-5 w-5 shrink-0 text-neutral-500 transition-transform duration-[var(--motion-duration-ui)] ease-[var(--motion-ease-out)] group-hover:-translate-y-1 group-hover:translate-x-1"
                  />
                </h3>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
