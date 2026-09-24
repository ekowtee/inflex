"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import AskBand from "../../components/AskBand";
import PageHero from "../../components/PageHero";
import ExitLink from "../../components/home/ExitLink";
import { entryGrid } from "../../components/entryGrid";
import { caseStudies } from "../../data";

/**
 * /case-studies/[id] — PHASE5_BRIEF.md §4 Task 6.
 *
 * A compact hero, because the reader arrived here to read. Below it the
 * page is a document: facts on hairlines, then the story, set as prose.
 *
 * What went: a red pill over the hero photograph, a red "back" button
 * styled as a primary action, a green-or-amber status pill from a palette
 * that exists nowhere else on the site, a red circle holding an arrow
 * beside every highlight, and a red wash that faded over related studies
 * on hover.
 *
 * The status still comes from data.ts. The old comparison tested for a
 * lower-case "completed" that the data never contained, so every study
 * rendered amber, including the delivered one.
 */

/** data.ts stores DD/MM/YY. */
const yearOf = (date: string) => `20${date.slice(-2)}`;

export default function CaseStudyDetailPage() {
  const params = useParams();
  const currentId = params.id as string;
  const study = caseStudies.find((cs) => cs.id === currentId);

  // Deterministic: this page is prerendered, and a random order during
  // render made the server and the client disagree on which cards to show.
  // No memo: filtering a handful of studies is cheaper than remembering it.
  const related = caseStudies.filter((cs) => cs.id !== currentId).slice(0, 3);

  if (!study) {
    return (
      <div className="band-ivory">
        <div className="mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
          <h1 className="type-display-l text-neutral-900">Case study not found</h1>
          <div className="mt-10">
            <ExitLink href="/case-study" className="text-neutral-900">
              Back to all case studies
            </ExitLink>
          </div>
        </div>
      </div>
    );
  }

  const paragraphs = study.details.split("\n\n");
  const live = study.status.toLowerCase().includes("progress");

  const facts = [
    "client" in study ? { label: "Client", value: study.client } : null,
    { label: "Category", value: study.category },
    "location" in study ? { label: "Location", value: study.location } : null,
    { label: "Status", value: study.status },
  ].filter((f): f is { label: string; value: string } => f !== null);

  return (
    <div>
      <PageHero
        eyebrow={study.category}
        title={study.title}
        formation="none"
        size="compact"
      />

      <section className="band-ivory w-full py-24 md:py-32" aria-label="Project details">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="type-telemetry mb-12 text-neutral-500">
            <Link
              href="/case-study"
              className="underline decoration-neutral-300 underline-offset-[4px] transition-colors duration-[var(--motion-duration-micro)] hover:decoration-neutral-900"
            >
              Case studies
            </Link>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">{study.title}</span>
          </div>

          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={study.innerImage1}
                alt=""
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="photo-grade object-cover"
              />
            </div>

            <div>
              <div className="flex items-baseline gap-5">
                <p className="type-h2 tabular-nums text-neutral-900">{yearOf(study.date)}</p>
                <p className="type-telemetry flex items-center gap-2 text-neutral-500">
                  {live && (
                    <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                  )}
                  {study.status}
                </p>
              </div>

              <h2 className="type-h2 mt-8 text-neutral-900">Project Details</h2>
              <dl className="mt-8 border-t border-neutral-200">
                {facts.map((fact) => (
                  <div key={fact.label} className="border-b border-neutral-200 py-5">
                    <dt className="type-telemetry text-neutral-500">{fact.label}</dt>
                    <dd className="type-body mt-3 text-neutral-900">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="mt-20 border-t border-neutral-200 pt-16">
            <p className="type-body-l max-w-[70ch] text-neutral-900">{study.summary}</p>

            {"highlights" in study && study.highlights && (
              <ul className="mt-12 max-w-[70ch] border-t border-neutral-200">
                {study.highlights.map((text: string, i: number) => (
                  <li
                    key={i}
                    className="type-body border-b border-neutral-200 py-4 text-neutral-600"
                  >
                    {text}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      <section className="band-ivory w-full pb-24 md:pb-32" aria-label="The full story">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border-t border-neutral-200 pt-16">
            <h2 className="type-h2 text-neutral-900">The Full Story</h2>

            <div className="mt-10 max-w-[72ch]">
              {paragraphs.map((p, i) => {
                const isSubheading =
                  (/^Phase \d/.test(p) ||
                    /^(Executive Summary|The (Challenge|Solution|Results)[:\s])/.test(p)) &&
                  p.length < 120;
                const isBullet = p.startsWith("• ");

                if (isSubheading) {
                  return (
                    <h3 key={i} className="type-h3 mt-12 text-neutral-900 first:mt-0">
                      {p}
                    </h3>
                  );
                }

                if (isBullet) {
                  const text = p.slice(2);
                  const colonIdx = text.indexOf(":");
                  return (
                    <p key={i} className="type-body-l mt-5 text-neutral-600">
                      {colonIdx > 0 && colonIdx < 40 ? (
                        <>
                          <strong className="font-semibold text-neutral-900">
                            {text.slice(0, colonIdx)}:
                          </strong>
                          {text.slice(colonIdx + 1)}
                        </>
                      ) : (
                        text
                      )}
                    </p>
                  );
                }

                return (
                  <p key={i} className="type-body-l mt-5 text-neutral-600 first:mt-0">
                    {p}
                  </p>
                );
              })}
            </div>

            <div className="relative mt-16 aspect-[16/9] w-full overflow-hidden">
              <Image
                src={study.storyImage ?? study.image}
                alt=""
                fill
                sizes="100vw"
                className="photo-grade object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="band-ivory w-full pb-24 md:pb-32" aria-label="Related case studies">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="border-t border-neutral-200 pt-16">
              <h2 className="type-h2 text-neutral-900">Related Case Studies</h2>

              <div className={`mt-12 grid gap-x-12 gap-y-16 ${entryGrid(related.length)}`}>
                {related.map((item) => (
                  <article key={item.id} className="group relative">
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="photo-grade object-cover"
                      />
                    </div>
                    <h3 className="type-h3 mt-8 flex items-start justify-between gap-4 border-t border-neutral-200 pt-8 text-neutral-900">
                      <Link
                        href={`/case-studies/${item.id}`}
                        className="underline decoration-transparent decoration-1 underline-offset-[6px] transition-[text-decoration-color] duration-[var(--motion-duration-ui)] after:absolute after:inset-0 after:content-[''] group-hover:decoration-neutral-900"
                      >
                        {item.title}
                      </Link>
                      <ArrowUpRight
                        aria-hidden="true"
                        strokeWidth={1.5}
                        className="mt-1 h-5 w-5 shrink-0 text-neutral-500 transition-transform duration-[var(--motion-duration-ui)] ease-[var(--motion-ease-out)] group-hover:-translate-y-1 group-hover:translate-x-1"
                      />
                    </h3>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <AskBand />
    </div>
  );
}
