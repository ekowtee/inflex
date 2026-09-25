import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Magnetic from "@/motion/Magnetic";
import PageHero from "../components/PageHero";
import { APPLY_EMAIL, applyHref, roles } from "../careers/roles";

/**
 * /jobs — built on the owner's decision of 24 September 2026, so the two
 * "View Jobs" links on /careers land somewhere.
 *
 * The same three roles as Featured Jobs, from careers/roles.ts, laid out as
 * the services list is: one entry per row on a hairline, the photograph
 * alternating sides. Each row carries its own anchor so Featured Jobs can
 * open it directly, and its own apply link, a mailto with the role in the
 * subject, because an application needs a CV and the contact form takes no
 * attachments.
 *
 * The hero lead, the open-application line and the button labels are new
 * copy, awaiting the owner's sign-off (PHASE5_REPORT.md). The role
 * descriptions are the approved ones.
 */

export const metadata: Metadata = {
  title: "Open Roles",
  description:
    "Open roles at Inflexions I.T.: Network Engineer, Cloud Solutions Architect and Cybersecurity Analyst.",
  alternates: { canonical: "/jobs" },
  openGraph: {
    title: "Open Roles",
    description: "Open roles at Inflexions I.T. in network engineering, cloud architecture and cybersecurity.",
    url: "/jobs",
  },
};

export default function JobsPage() {
  return (
    <div>
      <PageHero
        title="Open Roles"
        lead="Apply by email with your CV. The role is already in the subject line, so it reaches the right team."
        size="compact"
        formation={0}
      />

      <section className="band-ivory w-full py-24 md:py-32" aria-label="Open roles">
        <ol className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {roles.map((role, i) => (
            <li
              key={role.id}
              id={role.id}
              className="grid scroll-mt-24 items-center gap-10 border-t border-neutral-200 py-16 first:border-t-0 first:pt-0 lg:grid-cols-2 lg:gap-20"
            >
              <div className={i % 2 === 1 ? "lg:order-2" : undefined}>
                <h2 className="type-h2 text-neutral-900">{role.title}</h2>
                <p className="type-body-l mt-6 max-w-[56ch] text-neutral-600">{role.description}</p>
                <div className="mt-10">
                  <a
                    href={applyHref(`Application: ${role.title}`)}
                    className="inline-flex h-14 items-center rounded-[6px] border border-neutral-300 px-8 font-semibold text-neutral-900 transition-colors duration-[var(--motion-duration-micro)] hover:bg-neutral-50"
                  >
                    Apply for this role
                  </a>
                </div>
              </div>

              <div
                className={`relative aspect-[16/10] overflow-hidden ${i % 2 === 1 ? "lg:order-1" : ""}`}
              >
                <Image
                  src={role.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="photo-grade object-cover"
                  priority={i === 0}
                />
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section
        data-register="obsidian"
        data-header-dark=""
        className="band-obsidian on-obsidian w-full py-24 md:py-32"
        aria-label="Open application"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="type-body-l max-w-[52ch] text-silver-100">
            Not your role? Send your CV to {APPLY_EMAIL} and tell us the work you want to do.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Magnetic>
              <a
                href={applyHref("Open application")}
                className="inline-flex h-14 items-center rounded-[6px] bg-primary-500 px-8 font-semibold text-white transition-colors duration-[var(--motion-duration-micro)] hover:bg-primary-600"
              >
                Send an open application
              </a>
            </Magnetic>
            <Link href="/internships" className="btn-secondary-obsidian text-silver-100">
              View Internships
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
