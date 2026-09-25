import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

/**
 * Recent case studies on /resources — PHASE5_BRIEF.md §4 Task 6.
 *
 * Three grey cards with a radius and a shadow become three entries. Their
 * links all point at "#", which is left as it is and recorded in
 * PHASE5_REPORT.md: giving three placeholder articles real destinations is
 * a content decision, not this branch's.
 */

const blog = [
  {
    id: 1,
    image: "/assets/blog/blog1.png",
    title: "Responsive Redesign: Boosting User Engagement by 40%",
    description:
      "How a mobile-first overhaul drove a 40% increase in session duration and 20% uplift in conversions.",
    link: "#",
  },
  {
    id: 2,
    image: "/assets/blog/blog2.png",
    title: "Personalized Content Engine: Driving ROI with Tailored Experiences",
    description:
      "Leveraging edge-powered personalization to boost session duration by 25% and ad revenue by 12%.",
    link: "#",
  },
  {
    id: 3,
    image: "/assets/blog/blog3.png",
    title: "Strengthening Cybersecurity in Remote Work Environments",
    description:
      "Explore essential strategies and tools to secure your remote workforce, protect sensitive data, and maintain compliance in today\u2019s distributed workplace.",
    link: "#",
  },
] as const;

export default function Blog() {
  return (
    <section className="band-ivory w-full py-24 md:py-32" aria-label="Recent case studies">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="type-h2 border-t border-neutral-200 pt-12 text-neutral-900">
          Recent Case studies
        </h2>

        <div className="mt-16 grid gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {blog.map(({ id, image, title, description, link }) => (
            <article key={id} className="group relative flex flex-col">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="photo-grade object-cover"
                />
              </div>
              <h3 className="type-h3 mt-8 flex items-start justify-between gap-4 border-t border-neutral-200 pt-8 text-neutral-900">
                <Link
                  href={link}
                  className="underline decoration-transparent decoration-1 underline-offset-[6px] transition-[text-decoration-color] duration-[var(--motion-duration-ui)] after:absolute after:inset-0 after:content-[''] group-hover:decoration-neutral-900"
                >
                  {title}
                </Link>
                <ArrowUpRight
                  aria-hidden="true"
                  strokeWidth={1.5}
                  className="mt-1 h-5 w-5 shrink-0 text-neutral-500 transition-transform duration-[var(--motion-duration-ui)] ease-[var(--motion-ease-out)] group-hover:-translate-y-1 group-hover:translate-x-1"
                />
              </h3>
              <p className="type-body mt-4 text-neutral-600">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
