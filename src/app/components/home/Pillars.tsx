/**
 * Beat 4 — four pillars, zero gaps. SCROLL_NARRATIVE.md §6 Beat 4.
 *
 * The pinned chapter, and the only beat allowed four exits, because the rows
 * are four destinations rather than four ways of saying the same thing.
 *
 * Division of labour with the scroll spine (PHASE2_BRIEF.md §5.5): this file
 * owns the layout and the row states, the spine owns the pin and writes
 * data-active on [data-pin]. Everything below is driven from that one
 * attribute in CSS, so an unpinned page — no spine, reduced motion, Tier C —
 * still renders a correct chapter with the first row open.
 *
 * Why the row-state classes are spelled out per index rather than built from
 * a template string: Tailwind scans source text for class names, so
 * `[[data-active='${i}']_&]` would never be generated. The four literals in
 * ROW_STATE are the price of keeping the states in CSS instead of in JS.
 *
 * Below lg there is no pin and no active row: every row is open, the
 * attribute is ignored, and each is preceded by its formation poster. The
 * posters are captured from the real scene, one per formation.
 */
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/motion/Reveal";
import Thread from "@/motion/Thread";

const pillars = [
  {
    name: "Network Infrastructure",
    href: "/solutions/network-infrastructure",
    lead: "The layer everything else assumes.",
    value:
      "Secure, high-performance LAN, WAN, SD-WAN, and wireless solutions engineered for reliability at enterprise scale.",
    partners: "Cisco · Huawei · HP · Dell · Lenovo",
  },
  {
    name: "Data Security",
    href: "/solutions/data-security",
    lead: "Monitored, not just installed.",
    value:
      "End-to-end threat protection, compliance frameworks, and 24/7 monitoring that safeguard your most critical assets.",
    partners: "Sophos · ESET · Cloudflare · Cisco · Microsoft",
  },
  {
    name: "Cloud Services",
    href: "/solutions/cloud-services",
    lead: "Migrated without a cutover you notice.",
    value:
      "Strategic cloud migration, hybrid integration, and managed services across AWS, Azure, and Google Cloud.",
    partners: "Microsoft · Google · Amazon · DigitalOcean · Red Hat",
  },
  {
    name: "Data-centric Solutions",
    href: "/solutions/data-centric-solutions",
    lead: "Data that informs a decision, or it is noise.",
    value:
      "Advanced analytics, AI-driven insights, and data governance that turn raw information into strategic advantage.",
    partners: "Google · Anthropic · OpenAI · xAI · Microsoft · Amazon",
  },
] as const;

/** Dimmed at lg unless [data-pin] names this row. */
const ROW_STATE = [
  "lg:opacity-[0.55] lg:[[data-active='0']_&]:opacity-100",
  "lg:opacity-[0.55] lg:[[data-active='1']_&]:opacity-100",
  "lg:opacity-[0.55] lg:[[data-active='2']_&]:opacity-100",
  "lg:opacity-[0.55] lg:[[data-active='3']_&]:opacity-100",
] as const;

/** Ember only on the active row; graphite on the rest. */
const DOT_STATE = [
  "lg:bg-graphite lg:[[data-active='0']_&]:bg-ember",
  "lg:bg-graphite lg:[[data-active='1']_&]:bg-ember",
  "lg:bg-graphite lg:[[data-active='2']_&]:bg-ember",
  "lg:bg-graphite lg:[[data-active='3']_&]:bg-ember",
] as const;

/** 0fr → 1fr, so the collapse needs no measured height and no JavaScript. */
const DETAIL_STATE = [
  "lg:grid-rows-[0fr] lg:[[data-active='0']_&]:grid-rows-[1fr]",
  "lg:grid-rows-[0fr] lg:[[data-active='1']_&]:grid-rows-[1fr]",
  "lg:grid-rows-[0fr] lg:[[data-active='2']_&]:grid-rows-[1fr]",
  "lg:grid-rows-[0fr] lg:[[data-active='3']_&]:grid-rows-[1fr]",
] as const;

export default function Pillars() {
  return (
    <section
      id="pillars"
      data-beat="4"
      data-register="obsidian"
      data-header-dark=""
      className="band-obsidian on-obsidian w-full"
      aria-label="Four pillars"
    >
      {/* The spine pins this container. It is the section's only child and it
          holds the whole chapter, so nothing is left outside the pin. */}
      <div data-pin data-active="0" className="lg:min-h-[100svh]">
        <div className="mx-auto flex max-w-7xl flex-col justify-center px-4 py-24 sm:px-6 lg:min-h-[100svh] lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16">
            {/* Left column. The right is the Core's. */}
            <div>
              <Reveal as="p" className="type-eyebrow text-silver-500">
                Four Pillars. Zero Gaps.
              </Reveal>

              <div className="mt-10 lg:mt-12">
                {pillars.map((pillar, i) => (
                  <div
                    key={pillar.name}
                    data-pillar-row={i}
                    className={`border-t border-white/8 py-8 first:border-t-0 first:pt-0 lg:py-6 ${ROW_STATE[i]} transition-opacity duration-[var(--motion-duration-ui)] ease-[var(--motion-ease-out)]`}
                  >
                    {/* Mobile only: the formation poster above the row copy.
                        Captured from the real scene, one per formation
                        (lattice, shield, nebula, plane). */}
                    <div
                      data-pillar-poster
                      className="relative mb-6 h-[56vw] w-full overflow-hidden lg:hidden [html[data-core-live]_&]:hidden"
                    >
                      <Image
                        src={`/three/posters/f${i + 1}-lit-mobile.webp`}
                        alt=""
                        fill
                        sizes="100vw"
                        className="object-cover"
                      />
                    </div>

                    <div className="flex items-center gap-4">
                      <span
                        aria-hidden="true"
                        className={`h-2 w-2 shrink-0 rounded-full bg-graphite ${DOT_STATE[i]} transition-colors duration-[var(--motion-duration-ui)] ease-[var(--motion-ease-out)]`}
                      />
                      <h3 className="type-h3 text-silver-100">
                        <Link
                          href={pillar.href}
                          data-pillar-link={i}
                          aria-current={i === 0 ? "true" : undefined}
                          className="transition-colors duration-[var(--motion-duration-micro)] ease-[var(--motion-ease-out)] hover:text-white"
                        >
                          {pillar.name}
                        </Link>
                      </h3>
                    </div>

                    <div
                      className={`grid grid-rows-[1fr] ${DETAIL_STATE[i]} transition-[grid-template-rows] duration-[var(--motion-duration-reveal)] ease-[var(--motion-ease-out)]`}
                    >
                      <div className="overflow-hidden">
                        <p className="type-body-l mt-4 pl-6 text-silver-100">
                          {pillar.lead}
                        </p>
                        <p className="type-body mt-3 max-w-[52ch] pl-6 text-silver-300">
                          {pillar.value}
                        </p>
                        <p className="type-telemetry mt-4 pl-6 text-silver-500">
                          {pillar.partners}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* The carry: on the last formation the tallest column's ember cap
              detaches at the lower right and the spine writes --thread-x. */}
          <div data-thread-slot="4" className="thread-slot mt-12">
            <Thread tone="ember" x="right" />
          </div>
        </div>
      </div>
    </section>
  );
}
