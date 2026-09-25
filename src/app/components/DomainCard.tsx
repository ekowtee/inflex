import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { AcademyDomain } from "../academy/data";
import { getProgrammesByDomain } from "../academy/data";

/**
 * One of the four competency domains — PHASE5_BRIEF.md §4 Task 5.
 *
 * Was a bordered, rounded white card with a red icon tile that grew on
 * hover and a drop shadow. It is an entry now: a hairline, the count, the
 * name, the description. The domain's own icon stays, drawn rather than
 * boxed, because it is the only thing distinguishing four otherwise
 * identical entries at a glance.
 */
export default function DomainCard({ domain }: { domain: AcademyDomain }) {
  const Icon = domain.icon;
  const count = getProgrammesByDomain(domain.slug).length;

  return (
    <article className="group relative flex h-full flex-col border-t border-neutral-200 pt-8">
      <div className="flex items-center justify-between gap-4">
        <Icon aria-hidden="true" strokeWidth={1.5} className="h-6 w-6 text-neutral-900" />
        <span className="type-telemetry text-neutral-500">
          {count} {count === 1 ? "programme" : "programmes"}
        </span>
      </div>

      <h3 className="type-h3 mt-6 flex items-start justify-between gap-4 text-neutral-900">
        <Link
          href={`/academy/${domain.slug}`}
          className="underline decoration-transparent decoration-1 underline-offset-[6px] transition-[text-decoration-color] duration-[var(--motion-duration-ui)] after:absolute after:inset-0 after:content-[''] group-hover:decoration-neutral-900"
        >
          {domain.title}
        </Link>
        <ArrowUpRight
          aria-hidden="true"
          strokeWidth={1.5}
          className="mt-1 h-5 w-5 shrink-0 text-neutral-500 transition-transform duration-[var(--motion-duration-ui)] ease-[var(--motion-ease-out)] group-hover:-translate-y-1 group-hover:translate-x-1"
        />
      </h3>

      <p className="type-body mt-4 text-neutral-600">{domain.description}</p>
    </article>
  );
}
