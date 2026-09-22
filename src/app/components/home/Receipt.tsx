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
import Thread from "@/motion/Thread";
import Link from "next/link";
import EdgeDraw from "./EdgeDraw";
import ExitLink from "./ExitLink";

const cards = [
  {
    href: "/case-studies/2",
    eyebrow: "2014 · Delivered",
    title: "Blu Telecommunications",
    body: "A new broadband entrant needed a national 4G LTE core and a Tier III data centre, on startup timelines. We led it from scoping and vendor evaluation to a live commercial pilot — 50 Mbps per device, the national benchmark at launch.",
    footer: "Scoping · Vendor evaluation · Core build · NOC and BSS/OSS · Commercial pilot",
  },
  {
    href: "/case-studies/1",
    eyebrow: "2026 · In progress · Accra Digital Centre",
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
            02 — Proof
          </Reveal>
          <SplitLines as="h2" className="type-h2 mt-6 text-silver-100" delay={80}>
            We have done this at national scale. Twice.
          </SplitLines>
        </div>

        {/* Blu first, so the delivered engagement carries the in-progress one
            on phones as well as on desktop. */}
        <div className="order-2 mt-12 grid gap-6 md:grid-cols-2 md:gap-8">
          {cards.map((card) => (
            <EdgeDraw
              key={card.title}
              tone="ember"
              className="border border-white/8 bg-obsidian-800 p-6 transition-colors duration-[var(--motion-duration-micro)] ease-[var(--motion-ease-out)] hover:border-white/20 md:p-8"
            >
              <p className="type-eyebrow text-silver-500">{card.eyebrow}</p>
              <h3 className="type-h3 mt-4 text-silver-100">
                <Link
                  href={card.href}
                  className="after:absolute after:inset-0 after:content-['']"
                >
                  {card.title}
                </Link>
              </h3>
              <p className="type-body mt-4 text-silver-300">{card.body}</p>
              <p className="type-telemetry mt-6 text-silver-500">{card.footer}</p>
            </EdgeDraw>
          ))}
        </div>

        {/* The carry into Beat 4 drops from between the two cards. On phones
            the cards have stacked, so it sits after the counters instead. */}
        <div data-thread-slot="3" className="thread-slot order-4 mt-12 md:order-3">
          <Thread tone="ember" x="center" />
        </div>

        {/* Not a <dl>: the visual order puts the figure above its label,
            and a description list may not carry dd before dt. */}
        <div className="order-3 mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 md:order-4 lg:grid-cols-4 lg:gap-6">
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

        <div className="order-5 mt-12">
          <ExitLink href="/case-study" className="text-silver-100">
            Read both case studies
          </ExitLink>
        </div>
      </div>
    </section>
  );
}
