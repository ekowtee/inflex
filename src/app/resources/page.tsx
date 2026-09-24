import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Reveal from "@/motion/Reveal";
import AskBand from "../components/AskBand";
import Blog from "../components/Blog";
import PageHero from "../components/PageHero";
import { entryGrid } from "../components/entryGrid";

/**
 * /resources — PHASE5_BRIEF.md §4 Task 6.
 *
 * The page carried two headings for one thought: "Insights That Sharpen
 * Your Edge" as an h2 over the photograph and "Expert Intelligence for IT
 * Leaders" as the h1 below it. The first is the hero's line now and the
 * second keeps its place as the section heading; both kept verbatim.
 *
 * Whitepaper and webinar cards become entries. The red pill buttons on the
 * webinars become exit links: a resource is somewhere to go, not an action
 * to take, and the page's one primary action is the closing band's.
 */

const whitepapers = [
  {
    id: 1,
    title: "Architecting a Secure Hybrid Cloud Environment",
    description:
      "In-depth whitepaper covering security foundations and deployment models for hybrid clouds.",
    coverUrl: "/assets/blog/cloud-computing.webp",
    downloadLink: "/resources/whitepapers/hybrid-cloud",
  },
  {
    id: 2,
    title: "Maximizing ROI with IT Service Management",
    description:
      "Explore frameworks and metrics to measure and improve ROI on ITSM initiatives. In-depth work around to clock to deliver.",
    coverUrl: "/assets/blog/webinar3.webp",
    downloadLink: "/resources/whitepapers/itsm-roi",
  },
] as const;

const webinars = [
  {
    id: 1,
    title: "The Future of Network Infrastructure - SD-WAN Explained",
    description:
      "On-demand webinar diving into the capabilities and benefits of SD-WAN for modern networks.",
    date: "April 28, 2025",
    imageUrl: "/assets/blog/webinar1.webp",
    href: "/webinars/sd-wan-explained",
    label: "Watch Recording",
  },
  {
    id: 2,
    title: "Cybersecurity in the Age of Remote Work",
    description:
      "Live session on best practices to secure remote workforces in 2025 and beyond.",
    date: "May 15, 2025",
    imageUrl: "/assets/blog/webinar2.webp",
    href: "/contact",
    label: "Register Now",
  },
] as const;

export default function ResourcesPage() {
  return (
    <div>
      <PageHero title="Insights That Sharpen Your Edge" formation="none" />

      <section className="band-ivory w-full py-24 md:py-32" aria-label="Insights and resources">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src="/assets/blog/blogger.webp"
                alt=""
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="photo-grade object-cover"
              />
            </div>
            <div>
              <Reveal as="h2" className="type-h2 max-w-[18ch] text-neutral-900">
                Expert Intelligence for IT Leaders
              </Reveal>
              <Reveal as="p" className="type-body-l mt-6 max-w-[58ch] text-neutral-600" delay={80}>
                Deep dives into the trends, frameworks, and strategies that
                matter most to technology leaders. Cut through the noise with
                insights built on real-world implementation experience.
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="band-ivory w-full pb-24 md:pb-32" aria-label="Guides and reports">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="type-h2 border-t border-neutral-200 pt-12 text-neutral-900">
            In-Depth Guides &amp; Reports
          </h2>

          <div className={`mt-16 grid gap-x-12 gap-y-16 ${entryGrid(whitepapers.length)}`}>
            {whitepapers.map((item) => (
              <article key={item.id} className="group relative flex flex-col">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={item.coverUrl}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="photo-grade object-cover"
                  />
                </div>
                <h3 className="type-h3 mt-8 flex items-start justify-between gap-4 border-t border-neutral-200 pt-8 text-neutral-900">
                  <Link
                    href={item.downloadLink}
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
                <p className="type-body mt-4 text-neutral-600">{item.description}</p>
                <p className="type-telemetry mt-6 text-neutral-500">Download</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="band-ivory w-full pb-24 md:pb-32" aria-label="Webinars">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="type-h2 border-t border-neutral-200 pt-12 text-neutral-900">
            Learn from Our Experts
          </h2>

          <ul className="mt-16">
            {webinars.map((event) => (
              <li
                key={event.id}
                className="group relative grid gap-8 border-t border-neutral-200 py-10 md:grid-cols-[16rem_minmax(0,1fr)] md:gap-12"
              >
                <div className="relative aspect-[16/10] overflow-hidden md:aspect-[4/3]">
                  <Image
                    src={event.imageUrl}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 256px, 100vw"
                    className="photo-grade object-cover"
                  />
                </div>
                <div>
                  <p className="type-telemetry text-neutral-500">{event.date}</p>
                  <h3 className="type-h3 mt-4 flex items-start justify-between gap-6 text-neutral-900">
                    <Link
                      href={event.href}
                      className="underline decoration-transparent decoration-1 underline-offset-[6px] transition-[text-decoration-color] duration-[var(--motion-duration-ui)] after:absolute after:inset-0 after:content-[''] group-hover:decoration-neutral-900"
                    >
                      {event.title}
                    </Link>
                    <ArrowUpRight
                      aria-hidden="true"
                      strokeWidth={1.5}
                      className="mt-1 h-6 w-6 shrink-0 text-neutral-500 transition-transform duration-[var(--motion-duration-ui)] ease-[var(--motion-ease-out)] group-hover:-translate-y-1 group-hover:translate-x-1"
                    />
                  </h3>
                  <p className="type-body mt-4 max-w-[62ch] text-neutral-600">
                    {event.description}
                  </p>
                  <p className="type-telemetry mt-6 text-neutral-500">{event.label}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Blog />
      <AskBand />
    </div>
  );
}
