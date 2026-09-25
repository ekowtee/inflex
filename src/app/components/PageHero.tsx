import Link from "next/link";
import Magnetic from "@/motion/Magnetic";
import type { ReactNode } from "react";

/**
 * The Obsidian arrival band every interior page opens on — PHASE5_BRIEF.md §4.
 *
 * The home page earns a live Core. The interior pages carry a still of one
 * formation instead: the same object, the same light, no engine. Which
 * formation is not decoration — it is the page's subject, so the four pillar
 * pages each open on their own shape and About opens on the mark (the full
 * map is on the Formation type below).
 *
 * A server component with no client JavaScript of its own. The button is the
 * one exception and brings its own (Magnetic, the primary CTA only).
 *
 * The poster is a plain <picture>, not next/image, for the reason
 * Arrival.tsx records: the desktop and mobile stills have different aspect
 * ratios, which next/image cannot express as media sources, and two
 * priority images preloaded both variants on every device. It is never
 * `priority` here either — the H1 is the LCP candidate on these pages, and
 * a full-bleed background image is never one.
 *
 * The object sits centre-right in every still and the left 45 % of the frame
 * is black (max luminance 7 of 255, measured across all five), so the copy
 * column needs no scrim over it on desktop — which is as well, since a wash
 * across the band would dim the one thing the band is there to show. On
 * phones the object crosses the copy, so there the still is dimmed instead.
 */

/**
 * The stills captured by scripts/capture-posters.mjs. 0 is the resting
 * sheet, the one structure the four pillars are made from; "curve" is the
 * sheet as Beat 2's y = x³ turning point.
 *
 * Which page carries which (owner, 25 September 2026): Solutions 0, the four
 * pillars 1 to 4, About 5; Services "curve" (we engineer the inflection
 * point); Academy 3, its domains the shape of their subject (AI 3,
 * Infrastructure & Cloud 1, Cybersecurity 2, Digital Strategy "curve");
 * Case studies 4 (measured outcomes); Careers and Resources 0; Contact 5
 * (the home page's ask ends on the mark).
 */
export type Formation = 0 | 1 | 2 | 3 | 4 | 5 | "curve" | "none";

/* The intrinsic size of the mobile still, which is the <img> the sources
   fall back to; the desktop stills are 1920 x 1080. */
const MOBILE = { width: 780, height: 1688 };

export interface PageHeroProps {
  title: string;
  eyebrow?: string;
  lead?: string;
  cta?: { label: string; href: string };
  formation?: Formation;
  /** Programme and case-study detail pages open shorter. */
  size?: "default" | "compact";
  /** Page-specific content under the lead, above the call to action. */
  children?: ReactNode;
}

function FormationStill({ formation }: { formation: Exclude<Formation, "none"> }) {
  const base = formation === "curve" ? "/three/posters/f0-bend-lit" : `/three/posters/f${formation}-lit`;
  // The sheet's and the mark's phone stills are framed for the home page,
  // with the object off to one side; interior heroes use centred captures.
  const mobileSuffix = formation === 1 || formation === 2 || formation === 3 || formation === 4 ? "" : "-centred";
  return (
    <div
      aria-hidden="true"
      // Starts below the fixed header (h-14, lg:h-16) so the object is
      // never partly behind the bar.
      className="pointer-events-none absolute inset-x-0 bottom-0 top-14 opacity-35 md:opacity-100 lg:top-16"
    >
      <picture>
        <source media="(min-width: 768px)" type="image/avif" srcSet={`${base}-desktop.avif`} />
        <source media="(min-width: 768px)" type="image/webp" srcSet={`${base}-desktop.webp`} />
        <source type="image/avif" srcSet={`${base}-mobile${mobileSuffix}.avif`} />
        <img
          src={`${base}-mobile${mobileSuffix}.webp`}
          alt=""
          width={MOBILE.width}
          height={MOBILE.height}
          loading="eager"
          decoding="async"
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover [object-position:50%_50%]"
        />
      </picture>
    </div>
  );
}

export default function PageHero({
  title,
  eyebrow,
  lead,
  cta,
  formation = "none",
  size = "default",
  children,
}: PageHeroProps) {
  const height = size === "compact" ? "min-h-[56svh]" : "min-h-[80svh]";

  return (
    <section
      data-register="obsidian"
      data-header-dark=""
      className={`band-obsidian on-obsidian relative w-full overflow-hidden ${height}`}
    >
      {formation !== "none" && <FormationStill formation={formation} />}

      <div
        className={`relative z-[1] mx-auto flex ${height} max-w-7xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6 md:justify-center md:pb-20 lg:px-8`}
      >
        <div className="max-w-2xl lg:max-w-[52%]">
          {eyebrow && <p className="type-eyebrow mb-6 text-silver-500">{eyebrow}</p>}
          <h1 className="type-display-l text-silver-100">{title}</h1>
          {lead && (
            <p className="type-body-l mt-6 max-w-[58ch] text-silver-300">{lead}</p>
          )}
          {children}
          {cta && (
            <div className="mt-10">
              <Magnetic>
                <Link
                  href={cta.href}
                  className="inline-flex h-14 items-center rounded-[6px] bg-primary-500 px-8 font-semibold text-white transition-colors duration-[var(--motion-duration-micro)] hover:bg-primary-600"
                >
                  {cta.label}
                </Link>
              </Magnetic>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
