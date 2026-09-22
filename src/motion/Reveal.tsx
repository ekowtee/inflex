"use client";

import { createElement, useEffect, useRef, useState, type ReactNode } from "react";
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
  /** Visibility ratio that triggers the entrance. Defaults to 0.2. */
  threshold?: number;
}

/**
 * The entrance primitive — CREATIVE_DIRECTION_3D.md §8.2.
 *
 * Fades and lifts 16 px over 480 ms with expo-out when 20% visible, once.
 * Replaces the seven hand-rolled useInView hooks that were scattered across
 * the marketing pages.
 *
 * Driven by CSS, not GSAP: the entrance must work before the motion chunk
 * arrives, the visual result is identical, and it keeps the most-used
 * primitive out of the JavaScript budget entirely. Durations and easings
 * come from --motion-* in globals.css, which mirrors tokens.ts.
 *
 * Reduced motion is handled globally in globals.css, which collapses the
 * transition to 0.01 ms so the content simply appears.
 *
 * Without JavaScript the content stays visible: the noscript style in the
 * root layout neutralises the hidden state.
 */
export default function Reveal({
  children,
  delay = 0,
  as = "div",
  className = "",
  threshold = 0.2,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (typeof IntersectionObserver !== "function") {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  const capped = Math.min(delay, stagger.max);

  return createElement(
    as,
    {
      ref,
      className: `motion-reveal${shown ? " motion-reveal-in" : ""}${
        className ? ` ${className}` : ""
      }`,
      style: capped ? { transitionDelay: `${capped}ms` } : undefined,
    },
    children
  );
}
