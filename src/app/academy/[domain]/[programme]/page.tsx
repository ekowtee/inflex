import { notFound } from "next/navigation";
import { CheckCircle, Award } from "lucide-react";
import type { Metadata } from "next";
import AcademyHero from "../../../components/AcademyHero";
import CurriculumAccordion from "../../../components/CurriculumAccordion";
import ProgrammeDetailsSidebar from "../../../components/ProgrammeDetailsSidebar";
import ProgrammeCard from "../../../components/ProgrammeCard";
import Banner from "../../../components/Banner";
import JsonLd from "../../../components/JsonLd";
import {
  programmes,
  getDomain,
  getProgramme,
  getProgrammesByDomain,
} from "../../data";

export function generateStaticParams() {
  return programmes.map((p) => ({
    domain: p.domainSlug,
    programme: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domain: string; programme: string }>;
}): Promise<Metadata> {
  const { domain, programme: programmeSlug } = await params;
  const programme = getProgramme(domain, programmeSlug);
  if (!programme) return {};
  return {
    title: programme.title,
    description: programme.subtitle,
  };
}

export default async function ProgrammeDetailPage({
  params,
}: {
  params: Promise<{ domain: string; programme: string }>;
}) {
  const { domain: domainSlug, programme: programmeSlug } = await params;
  const domain = getDomain(domainSlug);
  const programme = getProgramme(domainSlug, programmeSlug);
  if (!domain || !programme) notFound();

  const related = getProgrammesByDomain(domainSlug)
    .filter((p) => p.slug !== programme.slug)
    .slice(0, 3);

  return (
    <div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Course",
          name: programme.title,
          description: programme.description,
          provider: {
            "@type": "Organization",
            name: "Inflexions Academy",
            sameAs: "https://inflexions.tech/academy",
          },
          educationalLevel: programme.level,
          timeRequired: programme.duration,
          hasCourseInstance: programme.formats.map((format) => ({
            "@type": "CourseInstance",
            courseMode: format === "Virtual" ? "online" : "onsite",
          })),
        }}
      />

      <AcademyHero
        eyebrow={programme.level}
        title={programme.title}
        subtitle={programme.subtitle}
        backgroundImage={programme.heroImage}
        breadcrumbs={[
          { label: "Academy", href: "/academy" },
          { label: domain.shortTitle, href: `/academy/${domain.slug}` },
          { label: programme.title },
        ]}
      />

      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#1B3764] mb-4">
                  Programme Overview
                </h2>
                <p className="text-[#41444B] text-lg leading-relaxed">
                  {programme.description}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#171A20] mb-4">
                  What You&apos;ll Learn
                </h3>
                <ul className="space-y-3">
                  {programme.learningObjectives.map((obj) => (
                    <li key={obj} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#BD2E25] mt-0.5 flex-shrink-0" />
                      <span className="text-[#41444B]">{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#F7F8FA] border border-[#D0D0D0] rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-[#171A20] mb-3">
                    Who It&apos;s For
                  </h3>
                  <ul className="space-y-2">
                    {programme.targetAudience.map((audience) => (
                      <li
                        key={audience}
                        className="flex items-start gap-2 text-sm text-[#41444B]"
                      >
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#BD2E25] flex-shrink-0" />
                        <span>{audience}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-[#F7F8FA] border border-[#D0D0D0] rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-[#171A20] mb-3">
                    Prerequisites
                  </h3>
                  <ul className="space-y-2">
                    {programme.prerequisites.map((prereq) => (
                      <li
                        key={prereq}
                        className="flex items-start gap-2 text-sm text-[#41444B]"
                      >
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#BD2E25] flex-shrink-0" />
                        <span>{prereq}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#171A20] mb-4">
                  Curriculum
                </h3>
                <CurriculumAccordion modules={programme.curriculum} />
              </div>
            </div>

            <div className="lg:col-span-1">
              <ProgrammeDetailsSidebar programme={programme} />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-[#1B3764]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-6 text-white">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">
                Delivered by certified practitioners
              </h3>
              <p className="text-white/80 text-sm">
                Our instructors hold relevant industry certifications and bring
                an average of 10+ years of enterprise delivery experience across
                banking, telecommunications, government, and technology
                organisations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-16 lg:py-20 bg-[#F7F8FA]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#171A20] mb-8">
              Related Programmes in {domain.shortTitle}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((rel) => (
                <ProgrammeCard key={rel.slug} programme={rel} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Banner />
    </div>
  );
}
