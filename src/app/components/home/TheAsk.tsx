/**
 * Beat 8 — the ask. SCROLL_NARRATIVE.md §6 Beat 8, copy sheet rows 8.
 *
 * The destination. "Stop Patching. Start Performing." is the same line the
 * old page put on a stock photograph with nothing above it; here it arrives
 * after the proof, the pillars and the ledger, and is earned.
 *
 * The thread draws first, above the eyebrow — the one beat where the carry
 * opens rather than closes, because this chapter is where the page stops.
 *
 * The pricing frame answers the three questions a buyer has before a call,
 * in their order: is it fixed, is it predictable, can I leave
 * (COPY_DECK.md §8). The word the frame must never contain is "free"; the
 * friction line says "no cost" once, quietly.
 *
 * Right half stays empty: the Core completes its morph into the mark there
 * in Phase 4.
 */
import Link from "next/link";
import Magnetic from "@/motion/Magnetic";
import Reveal from "@/motion/Reveal";
import SplitLines from "@/motion/SplitLines";

const pricing = [
  {
    lead: "Fixed-scope projects.",
    rest: "Two-week discovery, then a milestone plan and a price before any work begins. Typical delivery 4 to 12 weeks.",
  },
  {
    lead: "SLA-backed managed retainers.",
    rest: "Tiers set to your risk tolerance. 24/7 monitoring, monthly reporting, a named account manager.",
  },
  {
    lead: "No lock-in.",
    rest: "Vendor-neutral by policy. Thirty-day hypercare after every go-live, and the documentation to leave if you ever want to.",
  },
] as const;

/*
 * On desktop the chapter is one and a half screens: the copy sits at the
 * top and the lower half is the object's. The warmth that spread through
 * the sheet in the intelligence band gathers back into the ember line over
 * that scroll (formationTrack.ts), the Core's last motion on the page, with
 * the offer still in view. Phones keep one screen; the copy is long there.
 */
export default function TheAsk() {
  return (
    <section
      id="the-ask"
      data-beat="8"
      data-register="obsidian"
      data-header-dark=""
      className="band-obsidian on-obsidian relative w-full overflow-hidden"
      aria-label="Book the review"
    >
      <div className="mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-4 py-24 sm:px-6 lg:min-h-[150svh] lg:justify-start lg:px-8 lg:pt-36">
        <div className="lg:max-w-[50%]">
          <Reveal as="p" className="type-eyebrow text-silver-500">
            Every engagement is an inflection point.
          </Reveal>

          <SplitLines as="h2" className="type-display-xl mt-8 text-silver-100" delay={80}>
            Stop Patching. Start Performing.
          </SplitLines>

          <Reveal as="p" className="type-body-l mt-6 max-w-[56ch] text-silver-100" delay={200}>
            Book a 30-minute architecture review. With a Solutions Architect,
            not a salesperson. No pitch. You leave with a written view of what
            to fix first.
          </Reveal>

          <Reveal className="mt-10 border-y border-white/8 py-6" delay={260}>
            <ul className="space-y-3">
              {pricing.map((line) => (
                <li key={line.lead} className="type-body max-w-[60ch] text-silver-300">
                  <strong className="font-semibold text-silver-100">{line.lead}</strong>{" "}
                  {line.rest}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal as="p" className="type-eyebrow mt-8 text-silver-500" delay={300}>
            No cost. No obligation. One conversation.
          </Reveal>

          <Reveal className="mt-8" delay={320}>
            <Magnetic>
              <Link
                href="/contact"
                className="inline-flex h-14 items-center rounded-[6px] bg-primary-500 px-8 font-semibold text-white transition-colors duration-[var(--motion-duration-micro)] hover:bg-primary-600"
              >
                Book the review
              </Link>
            </Magnetic>
          </Reveal>

          <p className="type-telemetry mt-10 text-silver-500">
            Accra, Ghana ·{" "}
            <a
              href="tel:+233208889270"
              className="hover:underline hover:underline-offset-[3px]"
            >
              +233 20 888 9270
            </a>{" "}
            ·{" "}
            <a
              href="mailto:info@inflexions.tech"
              className="hover:underline hover:underline-offset-[3px]"
            >
              info@inflexions.tech
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
