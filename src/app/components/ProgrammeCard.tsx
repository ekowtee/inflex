import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import type { Programme } from "../academy/data";
import LevelBadge from "./LevelBadge";

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
    <Link
      href={`/academy/${programme.domainSlug}/${programme.slug}`}
      className="group flex flex-col h-full bg-white border border-[#D0D0D0] rounded-lg overflow-hidden hover:shadow-lg hover:border-[#BD2E25] transition-all duration-300"
    >
      <div className="relative w-full h-48 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={programme.heroImage}
          alt=""
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <LevelBadge level={programme.level} />
        </div>
      </div>
      <div className="flex flex-col flex-grow p-6">
        {showDomainTag && domainTitle && (
          <span className="text-xs font-medium text-[#5C6280] uppercase tracking-wide mb-2">
            {domainTitle}
          </span>
        )}
        <h3 className="text-lg font-semibold text-[#171A20] mb-2 group-hover:text-[#BD2E25] transition-colors">
          {programme.title}
        </h3>
        <p className="text-sm text-[#41444B] leading-relaxed mb-4 flex-grow line-clamp-3">
          {programme.subtitle}
        </p>
        <div className="flex flex-wrap items-center gap-3 text-xs text-[#5C6280] mb-4">
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {programme.duration}
          </span>
          <span>·</span>
          <span>{programme.formats.join(" / ")}</span>
        </div>
        <span className="inline-flex items-center text-sm font-medium text-[#BD2E25] mt-auto">
          View programme
          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </Link>
  );
}
