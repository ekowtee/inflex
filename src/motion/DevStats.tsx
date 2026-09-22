"use client";

import { useEffect, useState } from "react";
import { useMotionTier } from "./useMotionTier";
import { isMotionReady } from "./loadMotion";

/**
 * Frame-time overlay for development only.
 *
 * Reports the p50 and p99 of the last 120 frames, plus the motion tier, so
 * the frame budgets in PERFORMANCE_PLAN.md §8 can be read off the screen
 * while scrolling. Never rendered in production.
 */
export default function DevStats() {
  const tier = useMotionTier();
  const [stats, setStats] = useState({ p50: 0, p99: 0, fps: 0 });

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;

    const samples: number[] = [];
    let last = performance.now();
    let frame = 0;
    let lastPaint = 0;

    const tick = (now: number) => {
      samples.push(now - last);
      last = now;
      if (samples.length > 120) samples.shift();

      if (now - lastPaint > 500 && samples.length > 10) {
        lastPaint = now;
        const sorted = [...samples].sort((a, b) => a - b);
        const at = (q: number) =>
          sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * q))];
        const p50 = at(0.5);
        setStats({ p50, p99: at(0.99), fps: p50 > 0 ? 1000 / p50 : 0 });
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  if (process.env.NODE_ENV === "production") return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        bottom: 8,
        right: 8,
        zIndex: 9999,
        padding: "6px 8px",
        borderRadius: 4,
        background: "rgba(10,12,16,0.85)",
        color: "#C9CBD1",
        font: "500 11px/1.4 ui-monospace, monospace",
        letterSpacing: "0.04em",
        pointerEvents: "none",
      }}
    >
      tier {tier} · {stats.fps.toFixed(0)} fps · p50 {stats.p50.toFixed(1)}ms ·
      p99 {stats.p99.toFixed(1)}ms · motion {isMotionReady() ? "on" : "off"}
    </div>
  );
}
