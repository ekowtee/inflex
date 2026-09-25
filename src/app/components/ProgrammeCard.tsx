import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Programme } from "../academy/data";
import LevelBadge from "./LevelBadge";

/**
 * One programme — PHASE5_BRIEF.md §4 Task 5.
 *
 * The image stays, because a catalogue of twenty programmes is hard to scan
 * without one; the card around it does not. The photograph sits above a
 * hairline with the entry below it, graded into the palette like every other
 * photograph on the site, and it no longer grows on hover.
 */
export default function ProgrammeCard({
  programme,
  showDomainTag,
  domainTitle,
}: {
  programme: Programme;
  showDomainTag?: boolean;
  domainTitle?: string;
}) {
  return (
    <article className="group relative flex h-full flex-col">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={programme.heroImage}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="photo-grade object-cover"
        />
      </div>

      <div className="mt-6 flex items-center justify-between gap-4 border-t border-neutral-200 pt-6 text-neutral-500">
        <LevelBadge level={programme.level} />
        {showDomainTag && domainTitle && (
          <span className="type-telemetry text-right">{domainTitle}</span>
        )}
      </div>

      <h3 className="type-h3 mt-5 flex items-start justify-between gap-4 text-neutral-900">
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

      <p className="type-body mt-4 flex-grow text-neutral-600">{programme.subtitle}</p>

      <p className="type-telemetry mt-6 text-neutral-500">
        {programme.duration} · {programme.formats.join(" / ")}
      </p>
    </article>
  );
}
