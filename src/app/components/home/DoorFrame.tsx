"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { prefersReducedMotion } from "@/motion/loadMotion";

/**
 * The side doors' frame, drawn — owner, 24 September 2026.
 *
 * The doors open as the section comes into view: the centre divider draws
 * out from its middle, then the top and bottom hairlines extend outward from
 * its ends to the full width, and the doors' content follows a beat later.
 * On phones, where the doors stack, the hairlines draw out from the centre.
 *
 * Like Reveal, the frame is drawn in the server HTML and is only collapsed
 * at mount when it is below the fold, so nothing depends on JavaScript to be
 * visible, and reduced motion leaves it drawn.
 */
type Phase = "drawn" | "armed" | "drawing";

const EASE = "var(--motion-ease-out)";

export default function DoorFrame({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("drawn");

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || typeof IntersectionObserver !== "function") return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    const frame = requestAnimationFrame(() => setPhase("armed"));
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        setPhase("drawing");
        observer.disconnect();
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  const open = phase !== "armed";
  const t = (ms: number, delay: number) =>
    phase === "drawing" ? `transform ${ms}ms ${EASE} ${delay}ms, opacity ${ms}ms ${EASE} ${delay}ms` : "none";

  const line = "pointer-events-none absolute bg-neutral-200";
  return (
    <div ref={ref} className="relative">
      {/* Top and bottom hairlines, from the centre outward. */}
      <span
        aria-hidden="true"
        className={`${line} inset-x-0 top-0 h-px`}
        style={{ transform: open ? "scaleX(1)" : "scaleX(0)", transformOrigin: "50% 50%", transition: t(700, 280) }}
      />
      <span
        aria-hidden="true"
        className={`${line} inset-x-0 bottom-0 h-px`}
        style={{ transform: open ? "scaleX(1)" : "scaleX(0)", transformOrigin: "50% 50%", transition: t(700, 280) }}
      />
      {/* The divider between the doors, from its middle. On phones the
          doors stack and the grid's own static divider sits between them. */}
      <span
        aria-hidden="true"
        className={`${line} left-1/2 top-0 hidden h-full w-px md:block`}
        style={{ transform: open ? "scaleY(1)" : "scaleY(0)", transformOrigin: "50% 50%", transition: t(420, 0) }}
      />
      <div
        style={{
          opacity: open ? 1 : 0,
          transform: open ? "none" : "translateY(12px)",
          transition: t(480, 620),
        }}
      >
        {children}
      </div>
    </div>
  );
}
