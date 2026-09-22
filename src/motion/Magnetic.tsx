"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { duration, ease } from "./tokens";
import { prefersReducedMotion } from "./loadMotion";

export interface MagneticProps {
  children: ReactNode;
  /** Maximum offset in px. Capped at 6 per the animation system. */
  strength?: number;
  className?: string;
}

const MAX_OFFSET = 6;

/**
 * Primary CTA magnetism — CREATIVE_DIRECTION_3D.md §8.2 and §8.5.
 *
 * Translates up to 6 px toward the pointer and springs back. Used on the
 * primary call to action and nowhere else. Off on touch and under reduced
 * motion. Transform only, so it never costs layout.
 */
export default function Magnetic({
  children,
  strength = MAX_OFFSET,
  className = "",
}: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (prefersReducedMotion()) return;
    if (matchMedia("(pointer: coarse)").matches) return;

    const cap = Math.min(strength, MAX_OFFSET);
    element.style.transition = `transform ${duration.ui}ms ${ease.out}`;
    element.style.willChange = "transform";

    const onMove = (event: PointerEvent) => {
      const box = element.getBoundingClientRect();
      const dx = (event.clientX - (box.left + box.width / 2)) / (box.width / 2);
      const dy = (event.clientY - (box.top + box.height / 2)) / (box.height / 2);
      const clamp = (n: number) => Math.max(-1, Math.min(1, n));
      element.style.transform = `translate3d(${clamp(dx) * cap}px, ${
        clamp(dy) * cap
      }px, 0)`;
    };

    const onLeave = () => {
      element.style.transform = "translate3d(0, 0, 0)";
    };

    element.addEventListener("pointermove", onMove);
    element.addEventListener("pointerleave", onLeave);
    return () => {
      element.removeEventListener("pointermove", onMove);
      element.removeEventListener("pointerleave", onLeave);
      element.style.willChange = "";
    };
  }, [strength]);

  return (
    <span ref={ref} className={`inline-block ${className}`.trim()}>
      {children}
    </span>
  );
}
