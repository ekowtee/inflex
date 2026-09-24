import type { Metadata } from "next";
import Link from "next/link";
import Magnetic from "@/motion/Magnetic";
import Reveal from "@/motion/Reveal";
import PageHero from "../components/PageHero";
import { APPLY_EMAIL, applyHref } from "../careers/roles";

/**
 * /internships — built on the owner's decision of 24 September 2026, so the
 * "View Internships" link on /careers lands somewhere.
 *
 * Deliberately short. There is no published programme, intake date,
 * duration or stipend, so the page names none: it says how to apply and
 * which disciplines the work is in (the three open roles' fields), and
 * nothing it would have to invent. All of its copy is new and awaits the
 * owner's sign-off (PHASE5_REPORT.md).
 */

export const metadata: Metadata = {
  title: "Internships",
  description:
    "Internships at Inflexions I.T. in network engineering, cloud and cybersecurity. How to apply.",
  alternates: { canonical: "/internships" },
  openGraph: {
    title: "Internships",
    description: "Internships at Inflexions I.T. in network engineering, cloud and cybersecurity.",
    url: "/internships",
  },
};

const disciplines = ["Network engineering", "Cloud", "Cybersecurity"] as const;

export default function InternshipsPage() {
  return (
    <div>
      <PageHero
        title="Internships"
        lead="Early in your career and want to work on enterprise infrastructure? Tell us who you are and what you want to learn."
        size="compact"
      />

      <section className="band-ivory w-full py-24 md:py-32" aria-label="How to apply">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
          <div>
            <Reveal as="h2" className="type-h2 max-w-[18ch] text-neutral-900">
              How to apply
            </Reveal>
            <Reveal as="p" className="type-body-l mt-6 max-w-[56ch] text-neutral-600" delay={80}>
              Email your CV to {APPLY_EMAIL}{" "}
              with &ldquo;Internship&rdquo; in the
              subject line. Add a short note on what you are studying, the
              area you want to work in and when you are available.
            </Reveal>
            <Reveal className="mt-10" delay={160}>
              <Magnetic>
                <a
                  href={applyHref("Internship application")}
                  className="inline-flex h-14 items-center rounded-[6px] bg-primary-500 px-8 font-semibold text-white transition-colors duration-[var(--motion-duration-micro)] hover:bg-primary-600"
                >
                  Email your application
                </a>
              </Magnetic>
            </Reveal>
          </div>

          <div>
            <p className="type-eyebrow text-neutral-500">The work is in</p>
            <ul className="mt-6">
              {disciplines.map((d) => (
                <li key={d} className="type-h3 border-t border-neutral-200 py-6 text-neutral-900">
                  {d}
                </li>
              ))}
            </ul>
            <p className="type-body mt-6 text-neutral-600">
              Qualified already?{" "}
              <Link
                href="/jobs"
                className="font-semibold text-neutral-900 underline decoration-neutral-300 underline-offset-[6px] transition-[text-decoration-color] duration-[var(--motion-duration-ui)] hover:decoration-neutral-900"
              >
                See the open roles
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
