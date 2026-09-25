import Image from "next/image";

/**
 * The seven approved clients — extracted from home/TrustedBy.tsx so that
 * /about and /contact show the same roster (PHASE5_BRIEF.md §4 Task 6).
 *
 * It replaces Partners.tsx, which was an absolutely positioned CSS marquee:
 * seven images animating their `left` property, which runs a layout on every
 * frame for as long as the page is open, and never stops.
 *
 * The source files are not a matched set (five are dark marks on opaque
 * white plates), so each has a single-colour silhouette in
 * public/logos/silver/ with the alpha taken from inverted luminance: plates
 * and counters drop out, the mark stays. The files are black artwork.
 * On Obsidian they are lifted to silver with one filter; on Ivory they are
 * used as they are, which is what `register` selects.
 */

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

export interface ClientRosterProps {
  register?: "obsidian" | "ivory";
  /** The home page's beat gives its row to the scroll spine to slide. */
  slideRow?: boolean;
  className?: string;
}

export default function ClientRoster({
  register = "obsidian",
  slideRow = false,
  className = "",
}: ClientRosterProps) {
  return (
    <div
      {...(slideRow ? { "data-slide-row": "", style: { willChange: "transform" } } : {})}
      className={`grid grid-cols-12 items-center gap-x-4 gap-y-8 md:flex md:justify-between md:gap-6 ${className}`.trim()}
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
            className={`h-auto max-h-full w-auto max-w-full object-contain ${
              register === "obsidian" ? "[filter:invert(0.8)]" : "opacity-70"
            }`}
          />
        </div>
      ))}
    </div>
  );
}
