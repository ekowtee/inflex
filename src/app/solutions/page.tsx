/**
 * /solutions — PHASE5_BRIEF.md §4 Task 3.
 *
 * The index of what we build. Every list on the page was a grid of cards
 * with an accent bar, a red icon tile or a drop shadow; all of them are now
 * entries separated by hairlines, which is how the home page lists things
 * and the only treatment the redesign allows.
 *
 * The hero carries a still of the resting sheet, the structure the four
 * pillars are made from (owner, 23 September 2026), not a live Core.
 *
 * Copy is the page's existing copy, verbatim. The only line that moved is
 * the heading: the hero's line was an h2 above an h1 further down the page,
 * so the hero's line is now the h1 and the other keeps its place as an h2.
 */
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/motion/Reveal";
import AskBand from "../components/AskBand";
import PageHero from "../components/PageHero";
import PartnerColumns from "../components/PartnerColumns";

const domains = [
  {
    title: "Data-centric Solutions",
    href: "/solutions/data-centric-solutions",
    image: "/assets/solutions/sol6.webp",
    lead: "Turn Raw Data into Strategic Advantage",
    body: "Unlock the full value of your data with advanced analytics, business intelligence, AI-driven insights, and data governance. From predictive modelling and machine learning pipelines to real-time dashboards and automated reporting, we build the data infrastructure that turns information into your most powerful strategic asset.",
  },
  {
    title: "Network Infrastructure",
    href: "/solutions/network-infrastructure",
    image: "/assets/solutions/sol5.webp",
    lead: "Building Your High-Performance Digital Backbone",
    body: "Secure, reliable, and scalable network infrastructure is non-negotiable. We design, implement, and manage LAN, WAN, SD-WAN, and wireless solutions that ensure seamless connectivity, optimal performance, and robust security for your critical operations.",
  },
  {
    title: "Cloud Services",
    href: "/solutions/cloud-services",
    image: "/assets/solutions/sol7.webp",
    lead: "Harnessing the Power and Agility of the Cloud",
    body: "Navigate your cloud journey with confidence. We offer cloud strategy consulting, migration services (AWS, Azure, Google Cloud), hybrid cloud integration, and cloud management, enabling scalability, cost-efficiency, and innovation.",
  },
  {
    title: "Data Security",
    href: "/solutions/data-security",
    image: "/assets/solutions/sol8.webp",
    lead: "End-to-End Protection for Your Most Critical Assets",
    body: "Cyber threats don't wait, and neither should your defences. We deliver comprehensive security assessments, threat monitoring, incident response, and compliance frameworks that protect your data, infrastructure, and reputation around the clock.",
  },
] as const;

const accelerators = [
  {
    title: "Process Automation",
    body: "Eliminate manual bottlenecks with RPA, workflow orchestration, and intelligent process automation. We identify high-impact automation opportunities and deploy solutions that reduce errors, cut costs, and free your team for strategic work.",
  },
  {
    title: "AI & Intelligent Operations",
    body: "Deploy AIOps for predictive infrastructure monitoring, machine learning models for anomaly detection, and AI-driven analytics that surface insights before problems surface. Transform reactive IT into a proactive competitive advantage.",
  },
  {
    title: "Digital Workplace",
    body: "Modernise how your teams collaborate, communicate, and create. From unified communications and cloud productivity suites to secure remote access and digital employee experience platforms—we build workplaces that attract and retain top talent.",
  },
] as const;

export default function SolutionsPage() {
  return (
    <div>
      <PageHero
        title="Solutions Engineered for Uptime"
        lead="Accelerate your digital transformation with integrated infrastructure, cloud, security, and AI-powered data solutions."
        formation={0}
      />

      {/* The opening statement, and the three photographs that used to sit
          in a 2 x 2 collage beside a solid red block of text. */}
      <section className="band-ivory w-full py-24 md:py-32" aria-label="Overview">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <Reveal as="h2" className="type-h2 max-w-[18ch] text-neutral-900">
              Enterprise Technology, Zero Compromise
            </Reveal>
            <Reveal as="p" className="type-body-l max-w-[60ch] text-neutral-600" delay={80}>
              Digital transformation isn&apos;t a buzzword&mdash;it&apos;s the difference between
              leading your market and losing it. Inflexions architects integrated solutions
              across infrastructure, cloud, security, and data intelligence&mdash;powered by
              automation and AI to deliver measurable business outcomes, not generic templates.
            </Reveal>
          </div>

          <div className="mt-16 grid gap-4 sm:grid-cols-3">
            {[
              { src: "/assets/solutions/sol2.webp", alt: "Team collaborating" },
              { src: "/assets/solutions/sol1.webp", alt: "Professional working" },
              { src: "/assets/solutions/sol3.webp", alt: "Data visualisation" },
            ].map((photo) => (
              <div key={photo.src} className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="photo-grade object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The four domains, as entries. */}
      <section className="band-ivory w-full pb-24 md:pb-32" aria-label="The four domains">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal as="h2" className="type-h2 max-w-[16ch] text-neutral-900">
            Four Domains. One Integrated Stack.
          </Reveal>

          <div className="mt-14 grid gap-x-16 gap-y-12 md:grid-cols-2">
            {domains.map((domain) => (
              <article key={domain.title} className="group relative">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={domain.image}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="photo-grade object-cover"
                  />
                </div>
                <h3 className="type-h3 mt-8 border-t border-neutral-200 pt-8 text-neutral-900">
                  <Link
                    href={domain.href}
                    className="underline decoration-transparent decoration-1 underline-offset-[6px] transition-[text-decoration-color] duration-[var(--motion-duration-ui)] after:absolute after:inset-0 after:content-[''] group-hover:decoration-neutral-900"
                  >
                    {domain.title}
                  </Link>
                </h3>
                <p className="type-body-l mt-3 text-neutral-900">{domain.lead}</p>
                <p className="type-body mt-4 max-w-[62ch] text-neutral-600">{domain.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* The accelerator, on Obsidian. Three entries, no icon tiles. */}
      <section
        data-register="obsidian"
        data-header-dark=""
        className="band-obsidian on-obsidian w-full py-24 md:py-32"
        aria-label="Digital transformation"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal as="p" className="type-eyebrow text-silver-500">
            Digital transformation
          </Reveal>
          <Reveal as="h2" className="type-h2 mt-6 max-w-[20ch] text-silver-100" delay={80}>
            Technology That Thinks, Adapts, and Scales
          </Reveal>
          <Reveal as="p" className="type-body-l mt-6 max-w-[60ch] text-silver-300" delay={160}>
            Our solutions don&apos;t just digitise existing processes&mdash;they reimagine them.
            We embed intelligence at every layer so your infrastructure learns, your operations
            automate, and your decisions accelerate.
          </Reveal>

          <div className="mt-16 grid gap-x-12 gap-y-10 md:grid-cols-3">
            {accelerators.map((item) => (
              <div key={item.title} className="border-t border-white/15 pt-8">
                <h3 className="type-h3 text-silver-100">{item.title}</h3>
                <p className="type-body mt-4 text-silver-300">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Frontier AI, then the full wall. */}
      <section className="band-ivory w-full py-24 md:py-32" aria-label="Partners">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal as="p" className="type-eyebrow text-neutral-500">
            Frontier AI
          </Reveal>
          <Reveal as="h2" className="type-h2 mt-6 max-w-[22ch] text-neutral-900" delay={80}>
            Powered by the World&apos;s Leading AI Labs
          </Reveal>
          <Reveal as="p" className="type-body-l mt-6 max-w-[60ch] text-neutral-600" delay={160}>
            We integrate models and platforms from the frontier labs driving the AI
            revolution&mdash;giving your business access to the most advanced intelligence
            available.
          </Reveal>
        </div>

        <div className="mt-20 border-t border-neutral-200 pt-20">
          <PartnerColumns />
        </div>
      </section>

      <AskBand />
    </div>
  );
}
