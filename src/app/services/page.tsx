import Image from "next/image";
import Link from "next/link";
import Magnetic from "@/motion/Magnetic";
import Reveal from "@/motion/Reveal";
import AskBand from "../components/AskBand";
import PageHero from "../components/PageHero";

/**
 * /services — PHASE5_BRIEF.md §4 Task 4.
 *
 * The four delivery models. This is the one place the brief allows a number
 * to lead a block, because the sequence carries meaning, so each model's
 * number is set large and tabular the way Receipt.tsx sets a year — rather
 * than as a solid red square with a dashed line trailing out of it.
 *
 * Copy is unchanged, including each model's own call to action. Each model's
 * button opens its own page (owner, 24 September 2026); Digital
 * Transformation Advisory has none yet, so its button stays on /contact. Two things
 * were dropped and both are in the report: the company logo in a bordered,
 * shadowed white box beside the opening copy, and the four red number
 * squares those numerals replace.
 */

const models = [
  {
    number: "01",
    title: "Professional Services:",
    subtitle: "Expert Guidance for High-Stakes IT Initiatives",
    body: "Leverage our deep technical expertise for specific projects and strategic consulting. Our Professional Services team provides IT assessments, technology roadmapping, AI strategy workshops, automation opportunity assessments, solution design, complex implementations, cloud migrations, and digital transformation planning.",
    idealFor:
      "Businesses needing expert help with digital transformation strategy, AI adoption, automation implementation, technology migrations, or strategic IT planning.",
    image: "/assets/services/Services2.webp",
    cta: "Explore This Model",
    href: "/services/professional",
  },
  {
    number: "02",
    title: "Managed Services:",
    subtitle: "Proactive Management. Predictable Costs. Peace of Mind.",
    body: "Outsource the day-to-day management of your IT infrastructure to Inflexions. Our Managed Services combine AIOps-driven monitoring, automated remediation, intelligent alerting, patch management, security oversight, and helpdesk support. Benefit from predictable costs, near-zero downtime, and the freedom for your internal team to focus on innovation and digital transformation.",
    idealFor: null,
    image: "/assets/services/Services3.webp",
    cta: "Get Your Custom Quote",
    href: "/services/managed",
  },
  {
    number: "03",
    title: "Support Services:",
    subtitle: "Fast, Reliable Technical Support When It Matters Most",
    body: "Ensure business continuity with intelligent, responsive technical support. Our Support Services leverage AI-powered ticketing, automated diagnostics, and self-service portals alongside experienced technicians who resolve issues fast. From break/fix support to comprehensive helpdesk services—we minimise disruption so your teams stay productive.",
    idealFor: null,
    image: "/assets/services/Services4.webp",
    cta: "View Support Tiers",
    href: "/services/support",
  },
  {
    number: "04",
    title: "Digital Transformation Advisory:",
    subtitle: "From Vision to Execution—AI, Automation, and Beyond",
    body: "Technology alone doesn't transform businesses—strategy does. Our Digital Transformation Advisory practice helps you define your AI and automation roadmap, prioritise high-impact initiatives, manage organisational change, and build internal capabilities. We bridge the gap between executive vision and technical execution so your transformation delivers ROI, not just slides.",
    idealFor: null,
    image: "/assets/services/Services1.webp",
    cta: "Start Your Transformation",
    href: "/contact",
  },
] as const;

export default function ServicesPage() {
  return (
    <div>
      <PageHero title="Your Operations. Our Obsession." formation="curve" />

      <section className="band-ivory w-full py-24 md:py-32" aria-label="Service models">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <Reveal as="h2" className="type-h2 max-w-[20ch] text-neutral-900">
                Four Service Models. One Standard: Excellence.
              </Reveal>
              <Reveal as="p" className="type-body-l mt-6 max-w-[58ch] text-neutral-600" delay={80}>
                Every business has a different appetite for IT ownership. Whether
                you&apos;re automating operations, adopting AI, or modernising
                legacy systems&mdash;choose the model that matches your
                transformation goals, then scale as your ambitions evolve.
              </Reveal>
              <Reveal className="mt-10" delay={160}>
                <Magnetic>
                  <Link
                    href="/contact"
                    className="inline-flex h-14 items-center rounded-[6px] bg-primary-500 px-8 font-semibold text-white transition-colors duration-[var(--motion-duration-micro)] hover:bg-primary-600"
                  >
                    Start a Conversation
                  </Link>
                </Magnetic>
              </Reveal>
            </div>

            <div className="relative aspect-[16/9] overflow-hidden">
              <Image
                src="/assets/services/Services1.webp"
                alt="Service banner"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="photo-grade object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="band-ivory w-full pb-24 md:pb-32" aria-label="The four models">
        <ol className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {models.map((model, i) => (
            <li
              key={model.number}
              className="grid items-center gap-10 border-t border-neutral-200 py-16 lg:grid-cols-2 lg:gap-20"
            >
              {/* Alternating, so four long entries do not read as a column. */}
              <div className={i % 2 === 1 ? "lg:order-2" : undefined}>
                <p className="type-h2 tabular-nums text-neutral-300">{model.number}</p>
                <h3 className="type-h3 mt-6 text-neutral-900">
                  {model.title}
                  <span className="type-body-l mt-3 block font-normal text-neutral-600">
                    {model.subtitle}
                  </span>
                </h3>
                <p className="type-body mt-6 max-w-[62ch] text-neutral-600">{model.body}</p>
                {model.idealFor && (
                  <p className="type-body mt-4 max-w-[62ch] text-neutral-600">
                    <strong className="font-semibold text-neutral-900">Ideal For</strong>:{" "}
                    {model.idealFor}
                  </p>
                )}
                <div className="mt-8">
                  <Link
                    href={model.href}
                    className="inline-flex h-14 items-center rounded-[6px] border border-neutral-300 px-8 font-semibold text-neutral-900 transition-colors duration-[var(--motion-duration-micro)] hover:bg-neutral-50"
                  >
                    {model.cta}
                  </Link>
                </div>
              </div>

              <div
                className={`relative aspect-[4/3] overflow-hidden ${
                  i % 2 === 1 ? "lg:order-1" : ""
                }`}
              >
                <Image
                  src={model.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="photo-grade object-cover"
                />
              </div>
            </li>
          ))}
        </ol>
      </section>

      <AskBand />
    </div>
  );
}
