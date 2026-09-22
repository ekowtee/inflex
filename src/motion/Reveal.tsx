"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { stagger } from "./tokens";

type RevealTag =
  | "div"
  | "section"
  | "article"
  | "span"
  | "p"
  | "li"
  | "h1"
  | "h2"
  | "h3"
  | "h4";

export interface RevealProps {
  children: ReactNode;
  /** Delay in ms before the entrance runs. */
  delay?: number;
  /** Element to render. Defaults to div. */
  as?: RevealTag;
  className?: string;
}

/**
 * The entrance primitive — CREATIVE_DIRECTION_3D.md §8.2.
 *
 * Fades and lifts 16 px over 480 ms with expo-out when the element scrolls
 * into view, once. Replaces the seven hand-rolled useInView hooks that were
 * scattered across the marketing pages.
 *
 * Two decisions that matter for performance:
 *
 * 1. Content is visible in the server-rendered HTML. Only elements that are
 *    below the fold at mount are hidden, and hiding them happens off-screen
 *    where no one can see it. The obvious implementation — render at
 *    opacity 0 and reveal on hydration — delays First Contentful Paint until
 *    the JavaScript lands, which measured 5.2 s against 2.3 s on a throttled
 *    mobile profile. Above-the-fold copy therefore appears immediately and
 *    does not animate; the hero gets its entrance from SplitLines in Phase 1.
 *
 * 2. One IntersectionObserver is shared by every instance. One observer per
 *    instance cost measurable blocking time at 41 instances on the home page.
 *
 * Driven by CSS rather than GSAP so the entrance works before the motion
 * chunk arrives and stays out of the JavaScript budget. Durations and
 * easings come from --motion-* in globals.css, which mirrors tokens.ts.
 * Reduced motion is handled globally in globals.css, which collapses the
 * transition so content simply appears.
 */

type Callback = () => void;

let sharedObserver: IntersectionObserver | null = null;
const callbacks = new WeakMap<Element, Callback>();

function observe(element: Element, onEnter: Callback): () => void {
  if (typeof IntersectionObserver !== "function") {
    onEnter();
    return () => {};
  }

  sharedObserver ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        callbacks.get(entry.target)?.();
        callbacks.delete(entry.target);
        sharedObserver?.unobserve(entry.target);
      }
    },
    { threshold: 0.2 }
  );

  callbacks.set(element, onEnter);
  sharedObserver.observe(element);

  return () => {
    callbacks.delete(element);
    sharedObserver?.unobserve(element);
  };
}

export default function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  // `null` means "not yet decided": the server and the first client render
  // both show the content, so nothing above the fold waits for hydration.
  const [hidden, setHidden] = useState<boolean | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Decide on the next frame rather than synchronously in the effect body:
    // the measurement needs a laid-out element anyway, and it keeps the
    // state change out of the render that just committed.
    let cleanup: (() => void) | undefined;
    const frame = requestAnimationFrame(() => {
      const box = element.getBoundingClientRect();
      const belowFold = box.top > window.innerHeight * 0.9;
      if (!belowFold) {
        setHidden(false);
        return;
      }
      setHidden(true);
      cleanup = observe(element, () => setHidden(false));
    });

    return () => {
      cancelAnimationFrame(frame);
      cleanup?.();
    };
  }, []);

  const capped = Math.min(delay, stagger.max);
  const state =
    hidden === null ? "" : hidden ? " motion-reveal" : " motion-reveal motion-reveal-in";

  return (
    <Tag
      ref={ref as React.RefObject<never>}
      className={`${className}${state}`.trim()}
      style={capped && hidden !== null ? { transitionDelay: `${capped}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
