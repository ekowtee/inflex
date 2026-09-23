"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "@/motion/Reveal";

/** 400 ms to draw the strike, then 120 ms before its answer — §8.4. */
const STRIKE_MS = 400;
const AFTER_STRIKE_MS = 120;

const rows = [
  {
    was: "A reseller putting logos on boxes.",
    isLead: "Engineering-led.",
    is: "80+ years of combined integration experience, and the architects do the work.",
  },
  {
    was: "A generalist that outsources the real work.",
    isLead: "Vendor-neutral.",
    is: "The architecture serves your business, not a vendor's quota.",
  },
  {
    was: "A vendor that locks you in and layers on cost.",
    isLead: "Privately owned.",
    is: "Zero bureaucracy. Personal accountability. Faster than firms five times our size.",
  },
] as const;

/**
 * The Beat 5 ledger — SCROLL_NARRATIVE.md §6 Beat 5 and §8.4.
 *
 * Three things Inflexions is not, crossed out in front of the reader, each
 * answered by what it is instead. Saying it and striking it is the most
 * confident move on the page, and it is the direct answer to the reseller
 * tier the buyer is comparing against.
 *
 * One observer for the whole block, not one per line: the three strikes are
 * a single gesture, and staggering them by visibility would make the second
 * and third fire at the reader's scroll speed instead of the page's tempo.
 *
 * The 400 ms draw itself lives in .strike / .strike[data-struck] in
 * globals.css, where reduced motion can show it already drawn. This file
 * only decides when the attribute lands.
 *
 * DOM order is was, is, was, is, was, is, which is the phone reading order.
 * At md the two-column grid turns the same order into two columns without a
 * second markup path.
 *
 * The struck lines are set a tier below their answers. Partly because a
 * ledger's left side is subordinate, and partly because the strike is one
 * rule across the middle of the element: a line that wrapped would be struck
 * through the gap between its two lines rather than through its words, and
 * Body keeps all three on one line down to the reference phone width.
 */
export default function Ledger() {
  const ref = useRef<HTMLDivElement>(null);
  const [struck, setStruck] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (typeof IntersectionObserver !== "function") {
      const frame = requestAnimationFrame(() => setStruck(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setStruck(true);
        observer.disconnect();
      },
      { threshold: 0.3 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="grid gap-x-12 gap-y-8 md:grid-cols-2 md:gap-y-10"
    >
      {rows.map((row) => (
        <div key={row.isLead} className="contents">
          {/* self-start matters: a grid item stretches to its row, and the
              row is as tall as the two-line answer beside it. Stretched, the
              strike's top:50% lands under the text instead of through it. */}
          <p
            className="strike type-body w-fit self-start text-neutral-500"
            data-struck={struck ? "" : undefined}
          >
            {row.was}
          </p>
          <Reveal
            as="p"
            className="type-body-l text-neutral-900"
            delay={STRIKE_MS + AFTER_STRIKE_MS}
          >
            <strong className="font-semibold">{row.isLead}</strong> {row.is}
          </Reveal>
        </div>
      ))}

    </div>
  );
}
