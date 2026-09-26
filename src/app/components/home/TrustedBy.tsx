/**
 * Beat 1 — trusted by. SCROLL_NARRATIVE.md §6 Beat 1, copy sheet row 1.
 *
 * The shortest beat on the page: an eyebrow, one caption, and the seven
 * approved client logos. No copy beyond the caption — the logos are the copy.
 *
 * The roster itself moved to components/ClientRoster.tsx in Phase 5 so that
 * /about and /contact could show the same seven in place of a CSS marquee;
 * the section, its band and its data-beat stay here, and so does the slide,
 * which is the spine's (§5.2). Without the spine the row sits at 0 and is
 * fully visible, which is also what Tier C and reduced motion get.
 */
import Reveal from "@/motion/Reveal";
import ClientRoster from "../ClientRoster";

export default function TrustedBy() {
  return (
    <section
      id="trusted-by"
      data-beat="1"
      data-register="obsidian"
      data-header-dark=""
      className="band-obsidian on-obsidian w-full overflow-hidden py-16 lg:py-20"
      aria-label="Clients"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* The chapter's heading, set as an eyebrow. */}
        <Reveal as="h2" className="type-eyebrow text-silver-500">
          Trusted by
        </Reveal>
        <Reveal as="p" className="type-body mt-4 max-w-[52ch] text-silver-300" delay={80}>
          Enterprises across telecoms, aviation, education, finance and infrastructure.
        </Reveal>

        <ClientRoster register="obsidian" slideRow className="mt-10 md:mt-12" />
      </div>
    </section>
  );
}
