/**
 * Beat 3 — the receipt. SCROLL_NARRATIVE.md §6 Beat 3, copy sheet rows 3.
 *
 * Trust is won here, which is why the register stays Obsidian: the visitor
 * is not released into the reading room until the proof has landed. Two
 * engagements at national scale, then the counters, then one exit.
 *
 * The in-progress rule (narrative §6 Beat 3) is load-bearing on Card B: the
 * eyebrow carries "In progress" and the body never says delivered, completed
 * or built. On completion the eyebrow becomes "2026 · Delivered" and the last
 * clause changes. Nothing else in this file moves.
 *
 * Each card is one link with the title carrying the focus ring, rather than
 * a card-sized outline: the stretched pseudo-element takes the pointer, the
 * anchor takes the keyboard.
 */
import Counter from "@/motion/Counter";
import Reveal from "@/motion/Reveal";
import SplitLines from "@/motion/SplitLines";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import ExitLink from "./ExitLink";

const cards = [
  {
    href: "/case-studies/2",
    year: "2014",
    status: "Delivered",
    live: false,
    title: "Blu Telecommunications",
    body: "A new broadband entrant needed a national 4G LTE core and a Tier III data centre, on startup timelines. We led it from scoping and vendor evaluation to a live commercial pilot — 50 Mbps per device, the national benchmark at launch.",
    footer: "Scoping · Vendor evaluation · Core build · NOC and BSS/OSS · Commercial pilot",
  },
  {
    href: "/case-studies/1",
    year: "2026",
    status: "In progress · Accra Digital Centre",
    live: true,
    title: "MTN Ghana, Project UBIA",
    body: "Lead independent ICT consultant for a Tier III data centre and Industry 5.0 innovation hub, for the Ministry of Communication, Digital Technology and Innovation. Architecture, data centre design and delivery oversight — under way on site today.",
    footer: "Architecture · Tier III design · Delivery oversight",
  },
] as const;

export default function Receipt() {
  return (
    <section
      id="receipt"
      data-beat="3"
      data-register="obsidian"
      data-header-dark=""
      className="band-obsidian on-obsidian relative w-full overflow-hidden"
      aria-label="Proof"
    >
      <div className="mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-4 py-24 sm:px-6 lg:px-8">
        <div className="order-1 md:max-w-[52%] lg:max-w-[50%]">
          <Reveal as="p" className="type-eyebrow text-silver-500">
            Proof
          </Reveal>
          <SplitLines as="h2" className="type-h2 mt-6 text-silver-100" delay={80}>
            We have done this at national scale. Twice.
          </SplitLines>
        </div>

        {/* Blu first, so the delivered engagement carries the in-progress one
            on phones as well as on desktop.

            Two entries, not two cards: a hairline above each, the year set
            large as the anchor the eye lands on, then the status, the name
            and the account. The in-progress entry carries a steady ember dot
            beside its status, the one place ember marks something live. The
            whole entry is the link; the name takes the focus ring. */}
        <div className="order-2 mt-14 grid gap-12 md:grid-cols-2 md:gap-10 lg:gap-16">
          {cards.map((card) => (
            <article key={card.title} className="group relative border-t border-white/15 pt-8">
              <div className="flex items-baseline gap-5">
                <p className="type-display-l tabular-nums text-silver-100">{card.year}</p>
                <p className="type-telemetry flex items-center gap-2 text-silver-500">
                  {card.live && (
                    <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-ember" />
                  )}
                  {card.status}
                </p>
              </div>
              <h3 className="type-h3 mt-6 flex items-start justify-between gap-6 text-silver-100">
                <Link
                  href={card.href}
                  className="underline decoration-transparent decoration-1 underline-offset-[6px] transition-[text-decoration-color] duration-[var(--motion-duration-ui)] after:absolute after:inset-0 after:content-[''] group-hover:decoration-silver-100"
                >
                  {card.title}
                </Link>
                <ArrowUpRight
                  aria-hidden="true"
                  strokeWidth={1.5}
                  className="mt-1 h-6 w-6 shrink-0 text-silver-300 transition-transform duration-[var(--motion-duration-ui)] ease-[var(--motion-ease-out)] group-hover:-translate-y-1 group-hover:translate-x-1"
                />
              </h3>
              <p className="type-body mt-4 max-w-[60ch] text-silver-300">{card.body}</p>
              <p className="type-telemetry mt-6 text-silver-500">{card.footer}</p>
            </article>
          ))}
        </div>

        {/* Not a <dl>: the visual order puts the figure above its label,
            and a description list may not carry dd before dt. */}
        <div className="order-3 mt-20 grid grid-cols-1 gap-8 border-t border-white/10 pt-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          <div>
            <p className="type-h2 tabular-nums text-silver-100">2012</p>
            <p className="type-telemetry mt-3 text-silver-500">Founded, Accra</p>
            <p className="type-body mt-2 text-silver-500">
              Founded in Accra. Headquartered here still.
            </p>
          </div>
          <div>
            <p className="type-h2 text-silver-100">
              <Counter value={80} suffix="+" />
            </p>
            <p className="type-telemetry mt-3 text-silver-500">
              Years combined experience
            </p>
            <p className="type-body mt-2 text-silver-500">
              Combined years in systems integration, not in sales.
            </p>
          </div>
          <div>
            <p className="type-h2 text-silver-100">
              <Counter value={50} suffix="+" />
            </p>
            <p className="type-telemetry mt-3 text-silver-500">Enterprise clients</p>
            <p className="type-body mt-2 text-silver-500">
              Enterprise engagements since 2012.
            </p>
          </div>
          {/* No number to count, so no Counter and no H2: four vendor names at
              display size would wrap into a paragraph. */}
          <div>
            <p className="type-h3 text-silver-100">Cisco · Microsoft · AWS · CompTIA</p>
            <p className="type-telemetry mt-3 text-silver-500">Certified</p>
            <p className="type-body mt-2 text-silver-500">
              Certified across Cisco, Microsoft, AWS and CompTIA. ISO 27001
              principles in every delivery.
            </p>
          </div>
        </div>

        <div className="order-5 mt-14">
          <ExitLink href="/case-study" className="text-silver-100">
            Read both case studies
          </ExitLink>
        </div>
      </div>
    </section>
  );
}
