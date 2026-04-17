import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import AcademyHero from "../../components/AcademyHero";
import ProgrammeCard from "../../components/ProgrammeCard";
import Banner from "../../components/Banner";
import {
  domains,
  getDomain,
  getProgrammesByDomain,
} from "../data";

const solutionMeta: Record<string, { title: string; href: string }> = {
  "data-centric-solutions": {
    title: "Data-centric Solutions",
    href: "/solutions/data-centric-solutions",
  },
  "cloud-services": {
    title: "Cloud Services",
    href: "/solutions/cloud-services",
  },
  "data-security": {
    title: "Data Security",
    href: "/solutions/data-security",
  },
  "network-infrastructure": {
    title: "Network Infrastructure",
    href: "/solutions/network-infrastructure",
  },
};

export function generateStaticParams() {
  return domains.map((d) => ({ domain: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domain: string }>;
}): Promise<Metadata> {
  const { domain: domainSlug } = await params;
  const domain = getDomain(domainSlug);
  if (!domain) return {};
  return {
    title: domain.title,
    description: domain.description,
  };
}

export default async function DomainPage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain: domainSlug } = await params;
  const domain = getDomain(domainSlug);
  if (!domain) notFound();

  const domainProgrammes = getProgrammesByDomain(domainSlug);

  return (
    <div>
      <AcademyHero
        eyebrow="Academy Domain"
        title={domain.title}
        subtitle={domain.tagline}
        backgroundImage={domain.heroImage}
        breadcrumbs={[
          { label: "Academy", href: "/academy" },
          { label: domain.shortTitle },
        ]}
      />

      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1B3764] mb-6">
                {domain.tagline}
              </h2>
              <p className="text-[#41444B] text-lg leading-relaxed mb-8">
                {domain.overview}
              </p>
              <ul className="space-y-3 mb-8">
                {domain.benefits.map((benefit) => (
                  <li key={benefit.title} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#BD2E25] mt-0.5 flex-shrink-0" />
                    <span className="text-[#41444B]">
                      <strong className="text-[#171A20]">
                        {benefit.title}:
                      </strong>{" "}
                      {benefit.description}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href="/academy/for-organizations"
                className="inline-flex items-center bg-[#BD2E25] hover:bg-[#A02923] text-white font-semibold px-8 py-3 rounded-[6px] transition-colors group"
              >
                Train Your Team
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
            <div className="rounded-lg overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={domain.overviewImage}
                alt=""
                className="w-full h-full object-cover rounded-lg"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-[#F7F8FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#171A20] mb-4">
              Programmes in {domain.shortTitle}
            </h2>
            <p className="text-[#5C6280] text-lg max-w-2xl">
              Explore our full catalogue in this domain. Each programme is
              delivered by practitioners with deep enterprise experience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {domainProgrammes.map((programme) => (
              <ProgrammeCard key={programme.slug} programme={programme} />
            ))}
          </div>
        </div>
      </section>

      {domain.relatedSolutions.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#1B3764] rounded-lg p-8 lg:p-12">
              <div className="max-w-3xl">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  See how our expertise powers enterprise solutions
                </h3>
                <p className="text-white/80 mb-6">
                  The same practitioners who teach these programmes architect
                  and deploy solutions for leading organisations. Explore the
                  related solution areas to see our engineering work in action.
                </p>
                <div className="flex flex-wrap gap-3">
                  {domain.relatedSolutions.map((solutionSlug) => {
                    const meta = solutionMeta[solutionSlug];
                    if (!meta) return null;
                    return (
                      <Link
                        key={solutionSlug}
                        href={meta.href}
                        className="inline-flex items-center bg-white hover:bg-[#F7F8FA] text-[#1B3764] font-medium px-5 py-2.5 rounded-[6px] transition-colors"
                      >
                        {meta.title}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <Banner />
    </div>
  );
}
