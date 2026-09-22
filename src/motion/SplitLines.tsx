"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { distance, duration, gsapEase, stagger } from "./tokens";
import { loadMotion, prefersReducedMotion } from "./loadMotion";
import Reveal from "./Reveal";

type HeadingTag = "h1" | "h2" | "h3" | "p" | "div";

export interface SplitLinesProps {
  children: ReactNode;
  as?: HeadingTag;
  className?: string;
  /** Delay in ms before the first line reveals. */
  delay?: number;
}

/**
 * Line-by-line heading entrance — CREATIVE_DIRECTION_3D.md §8.2.
 *
 * Splits into lines with GSAP SplitText, masks each line, and lifts them
 * 12 px with a 60 ms stagger. Never per letter.
 *
 * Waits for document.fonts.ready before splitting: measuring lines against
 * the fallback metrics and re-splitting when the webfont lands is visible
 * (PERFORMANCE_PLAN.md §5.2). Until then, and whenever SplitText or the
 * motion chunk is unavailable, it falls back to a plain Reveal, which is why
 * a heading above the fold never waits for JavaScript to become legible.
 */
export default function SplitLines({
  children,
  as = "h2",
  className = "",
  delay = 0,
}: SplitLinesProps) {
  const ref = useRef<HTMLElement>(null);
  const [splitDone, setSplitDone] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const element = ref.current;
    if (!element) return;

    let cancelled = false;
    let revert: (() => void) | undefined;

    const run = async () => {
      const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
      if (fonts?.ready) await fonts.ready;
      if (cancelled) return;

      const { gsap, SplitText, ScrollTrigger } = await loadMotion();
      if (cancelled || !SplitText || !ref.current) return;

      const split = new SplitText(ref.current, {
        type: "lines",
        linesClass: "motion-split-line",
        mask: "lines",
      });
      setSplitDone(true);

      const tween = gsap.from(split.lines, {
        yPercent: 110,
        opacity: 0,
        duration: duration.reveal / 1000,
        ease: gsapEase.out,
        stagger: stagger.lines / 1000,
        delay: delay / 1000,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 80%",
          once: true,
        },
      });

      revert = () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        split.revert();
        ScrollTrigger.refresh();
      };
    };

    void run();

    return () => {
      cancelled = true;
      revert?.();
    };
  }, [delay]);

  // Before the split lands, the heading behaves as an ordinary Reveal so it
  // is legible and animated without the motion chunk. Once SplitText has
  // run, the wrapper stops hiding it and GSAP owns the lines.
  const Tag = as;
  if (splitDone) {
    return (
      <Tag
        ref={ref as React.RefObject<HTMLHeadingElement>}
        className={className}
        style={{ ["--motion-distance-reveal" as string]: `${distance.line}px` }}
      >
        {children}
      </Tag>
    );
  }

  return (
    <Reveal as={as} className={className} delay={delay}>
      <span ref={ref as React.RefObject<HTMLSpanElement>} className="block">
        {children}
      </span>
    </Reveal>
  );
}
