import Link from "next/link";
import { GraduationCap, ArrowRight } from "lucide-react";
import { programmes, getDomain } from "../academy/data";

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

  const related = programmes
    .filter((p) => p.domainSlug === domainSlug)
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F7F8FA] border border-[#D0D0D0] rounded-lg p-8 lg:p-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#BD2E25] rounded-[6px] flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="inline-block text-xs font-semibold uppercase tracking-wide text-[#BD2E25] mb-1">
                  Inflexions Academy
                </span>
                <h3 className="text-2xl font-bold text-[#171A20] mb-1">
                  Train your team in {domain.shortTitle}
                </h3>
                <p className="text-[#5C6280]">
                  The same practitioners who deploy these solutions teach these
                  programmes.
                </p>
              </div>
            </div>
            <Link
              href={`/academy/${domain.slug}`}
              className="inline-flex items-center text-sm font-medium text-[#BD2E25] hover:text-[#A02923] whitespace-nowrap"
            >
              View all programmes
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {related.map((programme) => (
              <Link
                key={programme.slug}
                href={`/academy/${programme.domainSlug}/${programme.slug}`}
                className="group bg-white border border-[#D0D0D0] rounded-lg p-5 hover:shadow-md hover:border-[#BD2E25] transition-all"
              >
                <h4 className="text-base font-semibold text-[#171A20] mb-2 group-hover:text-[#BD2E25] transition-colors">
                  {programme.title}
                </h4>
                <p className="text-xs text-[#5C6280] mb-3">
                  {programme.level} · {programme.duration}
                </p>
                <span className="inline-flex items-center text-sm text-[#BD2E25] font-medium">
                  View programme
                  <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
