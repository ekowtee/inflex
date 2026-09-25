import Reveal from "@/motion/Reveal";
import AskBand from "../components/AskBand";
import AudienceSwitcher from "../components/AudienceSwitcher";
import DomainCard from "../components/DomainCard";
import PageHero from "../components/PageHero";
import ProgrammeCard from "../components/ProgrammeCard";
import ExitLink from "../components/home/ExitLink";
import { domains, getFeaturedProgrammes, getDomain } from "./data";

/**
 * /academy — PHASE5_BRIEF.md §4 Task 5.
 *
 * The Academy's own landing page. Copy is unchanged: the Variant B rewrite
 * is drafted in PHASE5_COPY.md for the owner and ships only once signed off.
 *
 * Its closing band is the academy variant of AskBand, because the next step
 * from here is training, not an architecture review.
 */

const differentiators = [
  {
    title: "Practitioner-Led Instruction",
    description:
      "Every programme is delivered by consultants actively working on enterprise engagements — not career trainers.",
  },
  {
    title: "Enterprise-Grade Curriculum",
    description:
      "Content is drawn from live projects across banking, telecoms, government, and healthcare — tested against real constraints.",
  },
  {
    title: "Flexible Delivery",
    description:
      "Virtual, in-person, or on-site at your offices. We adapt to how your organisation actually works.",
  },
  {
    title: "Certification Pathways",
    description:
      "Programmes align with ISO 27001, CISA, CISM, AWS, Azure, and other internationally recognised credentials.",
  },
] as const;

export default function AcademyLandingPage() {
  const featured = getFeaturedProgrammes();

  return (
    <div>
      <PageHero
        eyebrow="Inflexions Academy"
        title="Develop the capabilities that shape the next decade."
        lead="Expert-led training in AI, cybersecurity, cloud, and digital strategy — for individuals advancing their careers and organisations building competitive teams."
        formation={3}
      />

      <AudienceSwitcher />

      <section id="domains" className="band-ivory w-full pb-24 md:pb-32" aria-label="Competency domains">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal as="p" className="type-eyebrow text-neutral-500">
            Four competency domains
          </Reveal>
          <Reveal as="h2" className="type-h2 mt-6 max-w-[24ch] text-neutral-900" delay={80}>
            Structured learning, built around how enterprises actually work.
          </Reveal>
          <Reveal as="p" className="type-body-l mt-6 max-w-[62ch] text-neutral-600" delay={160}>
            Our catalogue spans four domains covering the disciplines that define
            modern technology organisations. Explore the areas most relevant to
            your career or team strategy.
          </Reveal>

          <div className="mt-16 grid gap-x-12 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
            {domains.map((domain) => (
              <DomainCard key={domain.slug} domain={domain} />
            ))}
          </div>
        </div>
      </section>

      <section className="band-ivory w-full pb-24 md:pb-32" aria-label="Featured programmes">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 border-t border-neutral-200 pt-12 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="type-h2 text-neutral-900">Featured Programmes</h2>
              <p className="type-body-l mt-4 max-w-[52ch] text-neutral-600">
                A starting point across our most-in-demand programmes. Explore a
                domain to see the full catalogue.
              </p>
            </div>
            <ExitLink href="#domains" className="text-neutral-900">
              Browse all domains
            </ExitLink>
          </div>

          <div className="mt-16 grid gap-x-12 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((programme) => {
              const domain = getDomain(programme.domainSlug);
              return (
                <ProgrammeCard
                  key={programme.slug}
                  programme={programme}
                  showDomainTag
                  domainTitle={domain?.shortTitle}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* On Obsidian, because this is the Academy's argument for itself and
          it should not read as four more items in the catalogue. */}
      <section
        data-register="obsidian"
        data-header-dark=""
        className="band-obsidian on-obsidian w-full py-24 md:py-32"
        aria-label="Why Inflexions Academy"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal as="h2" className="type-h2 text-silver-100">
            Why Inflexions Academy
          </Reveal>
          <Reveal as="p" className="type-body-l mt-6 max-w-[56ch] text-silver-300" delay={80}>
            Four reasons enterprises and individuals choose us over generic
            training providers.
          </Reveal>

          <div className="mt-16 grid gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
            {differentiators.map((item) => (
              <div key={item.title} className="border-t border-white/15 pt-8">
                <h3 className="type-h3 text-silver-100">{item.title}</h3>
                <p className="type-body mt-4 text-silver-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AskBand
        variant="academy"
        line="Custom team training and enterprise programmes designed around your strategic priorities."
        label="Train Your Team"
        href="/academy/for-organizations"
      />
    </div>
  );
}
