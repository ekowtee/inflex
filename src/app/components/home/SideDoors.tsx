/**
 * Beat 9 — the side doors. SCROLL_NARRATIVE.md §6 Beat 9, copy sheet rows 9.
 *
 * For the visitor who is not the buyer. They sit after the ask, not before
 * it: the buyer has been asked and answered, and the learner and the
 * candidate get their own doors without the buyer having to walk past them
 * on the way to a decision.
 *
 * These two panels are the one place on the home page that uses Variant B of
 * COPY_DECK.md, which the owner approved for the Academy and Careers
 * surfaces on 22 September 2026.
 *
 * One link per panel, and the same drawn border as Beat 3's cards in red
 * rather than ember — the Ivory register's version of the thread.
 */
import EdgeDraw from "./EdgeDraw";
import ExitLink from "./ExitLink";

const panels = [
  {
    eyebrow: "Inflexions Academy",
    title: "Develop Your Edge.",
    body: "The same engineers who build the systems teach them — AI, cybersecurity, cloud and digital strategy, for you or your whole team.",
    href: "/academy",
    link: "Explore programmes",
  },
  {
    eyebrow: "Careers",
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
      className="band-ivory-soft w-full py-24 md:py-32"
      aria-label="Academy and careers"
    >
      <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-2 md:gap-8 lg:px-8">
        {panels.map((panel) => (
          <EdgeDraw
            key={panel.eyebrow}
            tone="red"
            className="shadow-ivory flex flex-col bg-white p-8 md:p-10"
          >
            <p className="type-eyebrow text-neutral-500">{panel.eyebrow}</p>
            <h2 className="type-display-l mt-6 text-neutral-900">{panel.title}</h2>
            <p className="type-body-l mt-6 max-w-[42ch] grow text-neutral-600">
              {panel.body}
            </p>
            <div className="mt-8">
              <ExitLink href={panel.href} className="text-neutral-900">
                {panel.link}
              </ExitLink>
            </div>
          </EdgeDraw>
        ))}
      </div>
    </section>
  );
}
