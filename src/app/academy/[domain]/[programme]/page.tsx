import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import AskBand from "../../../components/AskBand";
import CurriculumAccordion from "../../../components/CurriculumAccordion";
import JsonLd from "../../../components/JsonLd";
import PageHero from "../../../components/PageHero";
import { domainFormation } from "../../heroFormation";
import ProgrammeCard from "../../../components/ProgrammeCard";
import ProgrammeDetailsSidebar from "../../../components/ProgrammeDetailsSidebar";
import { entryGrid } from "../../../components/entryGrid";
import {
  programmes,
  getDomain,
  getProgramme,
  getProgrammesByDomain,
} from "../../data";

/**
 * /academy/[domain]/[programme] — PHASE5_BRIEF.md §4 Task 5.
 *
 * A compact hero, because a programme page is a document and its reader has
 * already decided to read it. generateStaticParams and the route are
 * untouched, and so is academy/data.ts.
 *
 * The programme stays person-independent: the practitioner band speaks for
 * the group, and there is no profile, portrait or name anywhere on it.
 */

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

      <PageHero
        eyebrow={programme.level}
        title={programme.title}
        lead={programme.subtitle}
        formation={domainFormation(programme.domainSlug)}
        size="compact"
      />

      <section className="band-ivory w-full py-24 md:py-32" aria-label="Programme">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="type-telemetry mb-12 text-neutral-500">
            <Link
              href="/academy"
              className="underline decoration-neutral-300 underline-offset-[4px] transition-colors duration-[var(--motion-duration-micro)] hover:decoration-neutral-900"
            >
              Academy
            </Link>
            <span aria-hidden="true"> / </span>
            <Link
              href={`/academy/${domain.slug}`}
              className="underline decoration-neutral-300 underline-offset-[4px] transition-colors duration-[var(--motion-duration-micro)] hover:decoration-neutral-900"
            >
              {domain.shortTitle}
            </Link>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">{programme.title}</span>
          </nav>

          <div className="grid gap-16 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-20">
            <div>
              <h2 className="type-h2 text-neutral-900">Programme Overview</h2>
              <p className="type-body-l mt-6 max-w-[68ch] text-neutral-600">
                {programme.description}
              </p>

              <h3 className="type-h3 mt-16 text-neutral-900">What You&apos;ll Learn</h3>
              <ul className="mt-6 border-t border-neutral-200">
                {programme.learningObjectives.map((obj) => (
                  <li
                    key={obj}
                    className="type-body border-b border-neutral-200 py-4 text-neutral-900"
                  >
                    {obj}
                  </li>
                ))}
              </ul>

              <div className="mt-16 grid gap-12 md:grid-cols-2">
                <div>
                  <h3 className="type-h3 text-neutral-900">Who It&apos;s For</h3>
                  <ul className="mt-6 border-t border-neutral-200">
                    {programme.targetAudience.map((audience) => (
                      <li
                        key={audience}
                        className="type-body border-b border-neutral-200 py-4 text-neutral-600"
                      >
                        {audience}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="type-h3 text-neutral-900">Prerequisites</h3>
                  <ul className="mt-6 border-t border-neutral-200">
                    {programme.prerequisites.map((prereq) => (
                      <li
                        key={prereq}
                        className="type-body border-b border-neutral-200 py-4 text-neutral-600"
                      >
                        {prereq}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <h3 className="type-h3 mt-16 text-neutral-900">Curriculum</h3>
              <div className="mt-6">
                <CurriculumAccordion modules={programme.curriculum} />
              </div>
            </div>

            <ProgrammeDetailsSidebar programme={programme} />
          </div>
        </div>
      </section>

      <section
        data-register="obsidian"
        data-header-dark=""
        className="band-obsidian on-obsidian w-full py-20"
        aria-label="Who delivers this"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="type-h3 text-silver-100">Delivered by certified practitioners</h2>
          <p className="type-body mt-4 max-w-[70ch] text-silver-300">
            Every programme is taught by a practitioner who is currently
            delivering the work it covers, and who holds the certifications it
            prepares you for.
          </p>
        </div>
      </section>

      {related.length > 0 && (
        <section className="band-ivory w-full py-24 md:py-32" aria-label="Related programmes">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="type-h2 text-neutral-900">
              Related Programmes in {domain.shortTitle}
            </h2>
            <div className={`mt-16 grid gap-x-12 gap-y-16 ${entryGrid(related.length)}`}>
              {related.map((rel) => (
                <ProgrammeCard key={rel.slug} programme={rel} />
              ))}
            </div>
          </div>
        </section>
      )}

      <AskBand
        variant="academy"
        line="Custom team training and enterprise programmes designed around your strategic priorities."
        label="Train Your Team"
        href="/academy/for-organizations"
      />
    </div>
  );
}
