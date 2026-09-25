import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import Reveal from "@/motion/Reveal";
import Magnetic from "@/motion/Magnetic";
import Link from "next/link";
import AskBand from "../../components/AskBand";
import PageHero from "../../components/PageHero";
import ProgrammeCard from "../../components/ProgrammeCard";
import { entryGrid } from "../../components/entryGrid";
import ExitLink from "../../components/home/ExitLink";
import { domains, getDomain, getProgrammesByDomain } from "../data";
import { domainFormation } from "../heroFormation";

/**
 * /academy/[domain] — PHASE5_BRIEF.md §4 Task 5.
 *
 * generateStaticParams and the route are untouched; academy/data.ts is the
 * only source of content and it is untouched too. What changed is the
 * surface: the red-ticked benefit list is a list, and the navy panel of
 * white pill links at the foot is a band of entries.
 */

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
      <PageHero eyebrow="Academy domain" title={domain.title} lead={domain.tagline} formation={domainFormation(domain.slug)} />

      <section className="band-ivory w-full py-24 md:py-32" aria-label="Overview">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="type-telemetry mb-12 text-neutral-500">
            <Link
              href="/academy"
              className="underline decoration-neutral-300 underline-offset-[4px] transition-colors duration-[var(--motion-duration-micro)] hover:decoration-neutral-900"
            >
              Academy
            </Link>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">{domain.shortTitle}</span>
          </nav>

          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <Reveal as="h2" className="type-h2 max-w-[20ch] text-neutral-900">
                {domain.tagline}
              </Reveal>
              <Reveal as="p" className="type-body-l mt-6 max-w-[60ch] text-neutral-600" delay={80}>
                {domain.overview}
              </Reveal>

              <ul className="mt-10 border-t border-neutral-200">
                {domain.benefits.map((benefit) => (
                  <li key={benefit.title} className="border-b border-neutral-200 py-5">
                    <p className="type-body text-neutral-600">
                      <strong className="font-semibold text-neutral-900">
                        {benefit.title}:
                      </strong>{" "}
                      {benefit.description}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="mt-10">
                <Magnetic>
                  <Link
                    href="/academy/for-organizations"
                    className="inline-flex h-14 items-center rounded-[6px] bg-primary-500 px-8 font-semibold text-white transition-colors duration-[var(--motion-duration-micro)] hover:bg-primary-600"
                  >
                    Train Your Team
                  </Link>
                </Magnetic>
              </div>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={domain.overviewImage}
                alt=""
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="photo-grade object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="band-ivory w-full pb-24 md:pb-32" aria-label="Programmes">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border-t border-neutral-200 pt-12">
            <h2 className="type-h2 text-neutral-900">Programmes in {domain.shortTitle}</h2>
            <p className="type-body-l mt-4 max-w-[56ch] text-neutral-600">
              Explore our full catalogue in this domain. Each programme is
              delivered by practitioners with deep enterprise experience.
            </p>
          </div>

          <div className={`mt-16 grid gap-x-12 gap-y-16 ${entryGrid(domainProgrammes.length)}`}>
            {domainProgrammes.map((programme) => (
              <ProgrammeCard key={programme.slug} programme={programme} />
            ))}
          </div>
        </div>
      </section>

      {domain.relatedSolutions.length > 0 && (
        <section
          data-register="obsidian"
          data-header-dark=""
          className="band-obsidian on-obsidian w-full py-24 md:py-32"
          aria-label="Related solutions"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal as="h2" className="type-h2 max-w-[24ch] text-silver-100">
              See how our expertise powers enterprise solutions
            </Reveal>
            <Reveal as="p" className="type-body-l mt-6 max-w-[62ch] text-silver-300" delay={80}>
              The same practitioners who teach these programmes architect and
              deploy solutions for leading organisations. Explore the related
              solution areas to see our engineering work in action.
            </Reveal>

            <ul className="mt-12 border-t border-white/15">
              {domain.relatedSolutions.map((solutionSlug) => {
                const meta = solutionMeta[solutionSlug];
                if (!meta) return null;
                return (
                  <li key={solutionSlug} className="border-b border-white/15 py-6">
                    <ExitLink href={meta.href} className="text-silver-100">
                      {meta.title}
                    </ExitLink>
                  </li>
                );
              })}
            </ul>
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
