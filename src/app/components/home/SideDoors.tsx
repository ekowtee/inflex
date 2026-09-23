/**
 * Beat 9 — the side doors. SCROLL_NARRATIVE.md §6 Beat 9, copy sheet rows 9.
 *
 * For the visitor who is not the buyer. They sit after the ask, not before
 * it: the buyer has been asked and answered, and the learner and the
 * candidate get their own doors without walking past them on the way to a
 * decision. Variant B copy of COPY_DECK.md, approved for these surfaces on
 * 22 September 2026.
 *
 * Two doors, not two cards. One band framed by a hairline above and below
 * and split by a single hairline between the halves; each half is one link
 * from edge to edge. No shadow, no accent border, no container inside a
 * container. The door answers the pointer as a surface: the half warms, the
 * link underlines and the arrow travels up and out.
 */
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const doors = [
  {
    label: "Inflexions Academy",
    title: "Develop Your Edge.",
    body: "The same engineers who build the systems teach them — AI, cybersecurity, cloud and digital strategy, for you or your whole team.",
    href: "/academy",
    link: "Explore programmes",
  },
  {
    label: "Careers",
    title: "Build the thing the country runs on.",
    body: "If you want your work to be a data centre, a national network, or the system a ministry depends on — this is the room.",
    href: "/careers",
    link: "Open roles",
  },
] as const;

export default function SideDoors() {
  return (
    <section
      id="side-doors"
      data-beat="9"
      data-register="ivory"
      className="band-ivory w-full py-20 md:py-28"
      aria-label="Academy and careers"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid border-y border-neutral-200 md:grid-cols-2 md:divide-x md:divide-neutral-200 max-md:divide-y max-md:divide-neutral-200">
          {doors.map((door) => (
            <Link
              key={door.href}
              href={door.href}
              // Equal inset on every side of both doors, so the text sits
              // the same distance from the frame, the divider and the hover
              // surface.
              className="group relative flex flex-col px-6 py-12 md:min-h-[21rem] transition-colors duration-[var(--motion-duration-ui)] ease-[var(--motion-ease-out)] hover:bg-[#F4F5F7] focus-visible:bg-[#F4F5F7] sm:px-10 md:py-16 lg:px-14"
            >
              <span className="type-telemetry text-neutral-500">{door.label}</span>
              <span className="type-h2 mt-6 block max-w-[18ch] text-neutral-900">
                {door.title}
              </span>
              <span className="type-body-l mt-6 block max-w-[46ch] text-neutral-600">
                {door.body}
              </span>
              <span className="mt-auto flex items-center justify-between gap-6 pt-12">
                <span className="type-body font-semibold text-neutral-900 underline decoration-transparent decoration-1 underline-offset-[6px] transition-[text-decoration-color] duration-[var(--motion-duration-ui)] group-hover:decoration-neutral-900">
                  {door.link}
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  strokeWidth={1.5}
                  className="h-7 w-7 shrink-0 text-neutral-900 transition-transform duration-[var(--motion-duration-ui)] ease-[var(--motion-ease-out)] group-hover:-translate-y-1 group-hover:translate-x-1"
                />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
