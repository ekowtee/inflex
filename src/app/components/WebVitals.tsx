"use client";

import { useEffect } from "react";
import type { Metric } from "web-vitals";
import { useMotionTier } from "@/motion/useMotionTier";

declare global {
  interface Window {
    gtag?: (
      command: "event",
      name: string,
      params: Record<string, string | number>
    ) => void;
  }
}

/**
 * Report Core Web Vitals to GA4 — PERFORMANCE_PLAN.md §9.2.
 *
 * Every event carries the motion tier and the connection class, so the field
 * numbers can be read per tier: the whole tier ladder is a guess until real
 * sessions say otherwise.
 *
 * Sends nothing until gtag exists, which is after the GA4 tag has loaded on
 * lazyOnload. Without a measurement ID it logs in development and is silent
 * in production.
 *
 * The web-vitals library is imported dynamically so it stays out of the route
 * shell: measurement must never compete with the page it is measuring.
 */
export default function WebVitals() {
  const tier = useMotionTier();

  useEffect(() => {
    const connection = (
      navigator as Navigator & { connection?: { effectiveType?: string } }
    ).connection;

    const report = (metric: Metric) => {
      const params = {
        value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
        metric_rating: metric.rating,
        metric_id: metric.id,
        tier,
        effective_type: connection?.effectiveType ?? "unknown",
        page_path: location.pathname,
      };

      if (typeof window.gtag === "function") {
        window.gtag("event", metric.name, params);
      } else if (process.env.NODE_ENV !== "production") {
        console.info("[web-vitals]", metric.name, params);
      }
    };

    let cancelled = false;
    void import("web-vitals").then(({ onCLS, onINP, onLCP, onTTFB }) => {
      if (cancelled) return;
      onLCP(report);
      onINP(report);
      onCLS(report);
      onTTFB(report);
    });

    return () => {
      cancelled = true;
    };
  }, [tier]);

  return null;
}
