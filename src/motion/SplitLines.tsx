"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { duration, gsapEase, stagger } from "./tokens";
import { loadMotion, prefersReducedMotion } from "./loadMotion";

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
 * Splits into lines with GSAP SplitText, masks each line, and lifts them in
 * with a 60 ms stagger. Never per letter.
 *
 * One element, always. The heading renders as plain text, legible without
 * JavaScript and under reduced motion. When it comes within half a viewport
 * of the screen, SplitText splits it in place (after document.fonts.ready,
 * so lines are measured against the real face) and the lines are parked
 * below their masks; as its top crosses 80 % of the viewport they play in.
 * Both steps are IntersectionObservers, so nothing is split or measured at
 * load.
 *
 * Phase 6, 25 September 2026: the earlier version swapped from a Reveal
 * wrapper to a plain heading once the split landed, which made React replace
 * the element SplitText had just split, so the lines never showed; and it
 * split every heading on the page at load, each with its own ScrollTrigger.
 */
export default function SplitLines({
  children,
  as = "h2",
  className = "",
  delay = 0,
}: SplitLinesProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const element = ref.current;
    if (!element || typeof IntersectionObserver !== "function") return;

    let cancelled = false;
    let revert: (() => void) | undefined;
    let play: IntersectionObserver | null = null;

    const prepare = async () => {
      const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
      if (fonts?.ready) await fonts.ready;
      if (cancelled) return;

      const { gsap, SplitText } = await loadMotion();
      if (cancelled || !SplitText) return;

      const split = new SplitText(element, {
        type: "lines",
        linesClass: "motion-split-line",
        mask: "lines",
      });
      // from() renders its start state at once: the lines wait under their
      // masks until the play observer fires.
      const tween = gsap.from(split.lines, {
        yPercent: 110,
        opacity: 0,
        duration: duration.reveal / 1000,
        ease: gsapEase.out,
        stagger: stagger.lines / 1000,
        delay: delay / 1000,
        paused: true,
      });

      // Play as the heading's top crosses 80 % of the viewport, or at once if
      // the reader is already past it.
      play = new IntersectionObserver(
        (entries) => {
          if (!entries.some((e) => e.isIntersecting || e.boundingClientRect.top < 0)) return;
          play?.disconnect();
          play = null;
          tween.play();
        },
        { rootMargin: "0px 0px -20% 0px" }
      );
      play.observe(element);

      revert = () => {
        play?.disconnect();
        tween.kill();
        split.revert();
      };
    };

    const near = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        near.disconnect();
        void prepare();
      },
      { rootMargin: "0px 0px 50% 0px" }
    );
    near.observe(element);

    return () => {
      cancelled = true;
      near.disconnect();
      play?.disconnect();
      revert?.();
    };
  }, [delay]);

  const Tag = as;
  return (
    <Tag ref={ref as React.RefObject<HTMLHeadingElement>} className={className}>
      {children}
    </Tag>
  );
}
