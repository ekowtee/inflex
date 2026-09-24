import Reveal from "@/motion/Reveal";
import ExitLink from "./home/ExitLink";

/**
 * The two ways into the Academy — PHASE5_BRIEF.md §4 Task 5.
 *
 * Two cards, one grey with a red icon tile and one navy with a white one,
 * each holding a red-ticked list. Navy is not in the redesign's palette and
 * the two halves were the same offer wearing different clothes.
 *
 * They are two doors now, in the shape SideDoors.tsx uses on the home page:
 * one band, one hairline between the halves, each half its own surface. The
 * copy is unchanged.
 */

const audiences = [
  {
    label: "For Individuals",
    body: "Advance your skills with open-enrolment programmes across AI, cybersecurity, cloud, and digital strategy.",
    points: [
      "Advance your career with internationally recognised programmes",
      "Learn from active industry practitioners, not career trainers",
      "Flexible scheduling with virtual and in-person options",
    ],
    href: "#domains",
    link: "Browse Programmes",
  },
  {
    label: "For Organisations",
    body: "Custom team training and enterprise programmes designed around your strategic priorities.",
    points: [
      "Custom curricula built around your team's objectives",
      "On-site delivery at your offices, anywhere in the region",
      "Measurable ROI with post-programme evaluation reporting",
    ],
    href: "/academy/for-organizations",
    link: "Enterprise Training",
  },
] as const;

export default function AudienceSwitcher() {
  return (
    <section className="band-ivory w-full py-24 md:py-32" aria-label="Who the Academy is for">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal as="h2" className="type-h2 max-w-[22ch] text-neutral-900">
          Training That Meets You Where You Are
        </Reveal>
        <Reveal as="p" className="type-body-l mt-6 max-w-[62ch] text-neutral-600" delay={80}>
          Whether you&apos;re advancing your own career or upskilling a team,
          Inflexions Academy delivers rigorous, practitioner-led programmes built
          around your goals.
        </Reveal>

        <div className="mt-16 grid border-t border-neutral-200 md:grid-cols-2 md:divide-x md:divide-neutral-200 max-md:divide-y max-md:divide-neutral-200">
          {audiences.map((audience) => (
            <div key={audience.label} className="flex flex-col py-12 md:px-10 md:first:pl-0 md:last:pr-0">
              <h3 className="type-h3 text-neutral-900">{audience.label}</h3>
              <p className="type-body-l mt-4 max-w-[46ch] text-neutral-600">{audience.body}</p>

              <ul className="mt-8 flex-grow">
                {audience.points.map((point) => (
                  <li
                    key={point}
                    className="type-body border-t border-neutral-200 py-4 text-neutral-900"
                  >
                    {point}
                  </li>
                ))}
              </ul>

              <div className="mt-10">
                <ExitLink href={audience.href} className="text-neutral-900">
                  {audience.link}
                </ExitLink>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
