/**
 * Beat 1 — trusted by. SCROLL_NARRATIVE.md §6 Beat 1, copy sheet row 1.
 *
 * The shortest beat on the page: an eyebrow, one caption, and the seven
 * approved client logos. No copy beyond the caption — the logos are the copy.
 *
 * Reading the roster on Obsidian. The source files are not a matched set
 * (five are dark marks on opaque white plates), so each has a single-colour
 * silhouette in public/logos/silver/ with the alpha taken from inverted
 * luminance: plates and counters drop out, the mark stays. They render
 * black and are lifted to silver with one filter, over whatever is behind,
 * the live Core included. No blend modes, so no backdrop boxes.
 *
 * Server-rendered. The slide is the spine's (§5.2): without it the row sits
 * at 0 and is fully visible, which is also what Tier C and reduced motion get.
 */
import Image from "next/image";
import Reveal from "@/motion/Reveal";

const logos = [
  { src: "/logos/silver/ba.png", alt: "British Airways", width: 259, height: 40 },
  { src: "/logos/silver/CEIBS.png", alt: "CEIBS", width: 261, height: 68 },
  { src: "/logos/silver/atc.png", alt: "ATC", width: 240, height: 120 },
  { src: "/logos/silver/blu.png", alt: "Blu Telecommunications", width: 135, height: 96 },
  { src: "/logos/silver/innovaddb.png", alt: "Innovaddb", width: 700, height: 239 },
  { src: "/logos/silver/ninani.png", alt: "Ninani", width: 135, height: 63 },
  { src: "/logos/silver/lifeforms1.png", alt: "Lifeforms", width: 252, height: 42 },
] as const;

/* Four then three below md. A twelve-column grid is the only way to get
   that split centred without a spacer element: the first four span three
   columns each, the last three span four. From md the row is a single flex
   line and the spans are inert. */
const span = (i: number) => (i < 4 ? "col-span-3" : "col-span-4");

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
        <Reveal as="p" className="type-eyebrow text-silver-500">
          Trusted by
        </Reveal>
        <Reveal as="p" className="type-body mt-4 max-w-[52ch] text-silver-300" delay={80}>
          Enterprises across telecoms, aviation, education, finance and infrastructure.
        </Reveal>

        <div
          data-slide-row
          className="mt-10 grid grid-cols-12 items-center gap-x-4 gap-y-8 md:mt-12 md:flex md:justify-between md:gap-6"
          style={{ willChange: "transform" }}
        >
          {logos.map((logo, i) => (
            <div
              key={logo.alt}
              className={`${span(i)} flex h-10 items-center justify-center md:h-12 md:min-w-0 md:flex-1`}
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                sizes="(min-width: 768px) 150px, 30vw"
                className="h-auto max-h-full w-auto max-w-full object-contain [filter:invert(0.8)]"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
