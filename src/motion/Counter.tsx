"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "./loadMotion";

export interface CounterProps {
  /** The number to count to. */
  value: number;
  prefix?: string;
  suffix?: string;
  /** Count duration in ms. Defaults to 1200. */
  duration?: number;
  className?: string;
  /** Decimal places. Defaults to 0. */
  decimals?: number;
}

/** expo-out, the curve behind ease.out and gsapEase.out. */
function expoOut(t: number): number {
  return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

/**
 * Counts up once when it comes into view — CREATIVE_DIRECTION_3D.md §8.2.
 *
 * Tabular numerals so the digits do not jitter. Reduced motion prints the
 * final value without counting. Runs on rAF rather than GSAP so a counter
 * above the fold never waits for the motion chunk.
 */
export default function Counter({
  value,
  prefix = "",
  suffix = "",
  duration = 1200,
  className = "",
  decimals = 0,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let frame = 0;

    // Reduced motion, or no IntersectionObserver: show the final value on the
    // next frame. Setting state synchronously inside the effect body would
    // cascade a render off the one that just committed.
    if (prefersReducedMotion() || typeof IntersectionObserver !== "function") {
      frame = requestAnimationFrame(() => setDisplay(value));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting) || started.current) {
          return;
        }
        started.current = true;
        observer.disconnect();

        const start = performance.now();
        const step = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          setDisplay(value * expoOut(progress));
          if (progress < 1) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
      },
      { threshold: 0.4 }
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`.trim()}>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}
