import Link from "next/link";
import { Award, Users, Layers, GraduationCap } from "lucide-react";
import AcademyHero from "../components/AcademyHero";
import AudienceSwitcher from "../components/AudienceSwitcher";
import DomainCard from "../components/DomainCard";
import ProgrammeCard from "../components/ProgrammeCard";
import Banner from "../components/Banner";
import {
  domains,
  getFeaturedProgrammes,
  getDomain,
} from "./data";

const differentiators = [
  {
    icon: Users,
    title: "Practitioner-Led Instruction",
    description:
      "Every programme is delivered by consultants actively working on enterprise engagements — not career trainers.",
  },
  {
    icon: Layers,
    title: "Enterprise-Grade Curriculum",
    description:
      "Content is drawn from live projects across banking, telecoms, government, and healthcare — tested against real constraints.",
  },
  {
    icon: GraduationCap,
    title: "Flexible Delivery",
    description:
      "Virtual, in-person, or on-site at your offices. We adapt to how your organisation actually works.",
  },
  {
    icon: Award,
    title: "Certification Pathways",
    description:
      "Programmes align with ISO 27001, CISA, CISM, AWS, Azure, and other internationally recognised credentials.",
  },
];

export default function AcademyLandingPage() {
  const featured = getFeaturedProgrammes();

  return (
    <div>
      <AcademyHero
        eyebrow="Inflexions Academy"
        title="Develop the capabilities that shape the next decade."
        subtitle="Expert-led training in AI, cybersecurity, cloud, and digital strategy — for individuals advancing their careers and organisations building competitive teams."
        backgroundImage="/assets/solutions/sol6.jpeg"
      />

      <AudienceSwitcher />

      <section id="domains" className="py-16 lg:py-20 bg-[#F7F8FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="inline-block border-l-4 border-[#BD2E25] bg-white px-2 py-1 text-sm font-medium text-[#333333] mb-4">
              Four Competency Domains
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1B3764] mb-4">
              Structured learning, built around how enterprises actually work.
            </h2>
            <p className="text-[#41444B] text-lg leading-relaxed">
              Our catalogue spans four domains covering the disciplines that
              define modern technology organisations. Explore the areas most
              relevant to your career or team strategy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {domains.map((domain) => (
              <DomainCard key={domain.slug} domain={domain} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#171A20] mb-4">
                Featured Programmes
              </h2>
              <p className="text-[#5C6280] text-lg max-w-2xl">
                A starting point across our most-in-demand programmes. Explore a
                domain to see the full catalogue.
              </p>
            </div>
            <Link
              href="#domains"
              className="text-sm font-medium text-[#BD2E25] hover:text-[#A02923] whitespace-nowrap"
            >
              Browse all domains →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      <section className="py-16 lg:py-20 bg-[#F7F8FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#171A20] mb-4">
              Why Inflexions Academy
            </h2>
            <p className="text-[#5C6280] text-lg max-w-2xl mx-auto">
              Four reasons enterprises and individuals choose us over generic
              training providers.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {differentiators.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="bg-white border border-[#D0D0D0] rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 bg-[#BD2E25] rounded-[6px] flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#171A20] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#41444B] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Banner />
    </div>
  );
}
