"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { prefersReducedMotion } from "@/motion/loadMotion";

export interface EdgeDrawProps {
  children: ReactNode;
  /** Ember on the Obsidian register (Beat 3), brand red on Ivory (Beat 9). */
  tone?: "ember" | "red";
  className?: string;
}

/**
 * The 2 px left border that draws top to bottom as a card enters —
 * SCROLL_NARRATIVE.md §6 Beat 3 and Beat 9.
 *
 * This is the Ivory register's version of the thread: in a band with no Core
 * behind it, the drawn border is what stops a chapter simply ending. Beat 3
 * uses the same gesture on Obsidian so the two case cards read as a pair.
 *
 * The card's own content stays on the server. Only the wrapper is a client
 * component, so nothing but the observer and one boolean crosses into the
 * bundle; the copy inside arrives as already-rendered children.
 *
 * Reduced motion draws it at mount rather than waiting for the observer:
 * "drawn, without the drawing".
 */
export default function EdgeDraw({
  children,
  tone = "ember",
  className = "",
}: EdgeDrawProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let frame = 0;

    if (prefersReducedMotion() || typeof IntersectionObserver !== "function") {
      frame = requestAnimationFrame(() => setDrawn(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setDrawn(true);
        observer.disconnect();
      },
      { threshold: 0.2 }
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`.trim()}>
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-[2px] origin-top"
        style={{
          background:
            tone === "ember" ? "var(--color-ember)" : "var(--color-primary-500)",
          transform: drawn ? "scaleY(1)" : "scaleY(0)",
          transition:
            "transform var(--motion-duration-reveal) var(--motion-ease-out)",
        }}
      />
      {children}
    </div>
  );
}
