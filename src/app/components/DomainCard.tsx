import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { AcademyDomain } from "../academy/data";
import { getProgrammesByDomain } from "../academy/data";

export default function DomainCard({ domain }: { domain: AcademyDomain }) {
  const Icon = domain.icon;
  const count = getProgrammesByDomain(domain.slug).length;

  return (
    <Link
      href={`/academy/${domain.slug}`}
      className="group relative flex flex-col h-full bg-white border border-[#D0D0D0] rounded-lg p-8 hover:shadow-lg hover:border-[#BD2E25] transition-all duration-300"
    >
      <div className="w-12 h-12 bg-[#BD2E25] rounded-[6px] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-[#171A20] mb-2">
        {domain.title}
      </h3>
      <p className="text-sm text-[#41444B] leading-relaxed mb-6 flex-grow">
        {domain.description}
      </p>
      <div className="flex items-center justify-between pt-4 border-t border-[#E6E6E6]">
        <span className="text-sm text-[#5C6280]">
          {count} {count === 1 ? "programme" : "programmes"}
        </span>
        <span className="inline-flex items-center text-sm font-medium text-[#BD2E25] group-hover:gap-2 transition-all">
          Explore
          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </Link>
  );
}
