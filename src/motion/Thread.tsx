"use client";

import { useEffect, useRef, useState } from "react";

export interface ThreadProps {
  /** Which register the thread sits in. */
  tone?: "ember" | "red";
  /** Horizontal placement inside the parent. */
  x?: "left" | "center" | "right";
  /** Height in px. Defaults to 48. */
  height?: number;
  className?: string;
}

/**
 * The carry motif — SCROLL_NARRATIVE.md §8.3.
 *
 * A 1 px vertical hairline that draws downward at the end of a beat and
 * points into the next one, so a chapter never simply stops. Ember on the
 * Obsidian register, brand red on Ivory.
 *
 * Decorative: hidden from assistive technology.
 */
export default function Thread({
  tone = "ember",
  x = "left",
  height = 48,
  className = "",
}: ThreadProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (typeof IntersectionObserver !== "function") {
      setDrawn(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setDrawn(true);
          observer.disconnect();
        }
      },
      { threshold: 0.9 }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const align =
    x === "center" ? "mx-auto" : x === "right" ? "ml-auto" : "mr-auto";

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`motion-thread ${align} ${
        drawn ? "motion-thread-drawn" : ""
      } ${className}`.trim()}
      style={{
        height: `${height}px`,
        background: tone === "ember" ? "var(--color-ember)" : "var(--color-primary-500)",
      }}
    />
  );
}
