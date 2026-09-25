"use client";

/**
 * The motion chunk — PERFORMANCE_PLAN.md §2.2 and §7 step 7.
 *
 * GSAP, SplitText and Lenis are imported dynamically so they
 * land in their own chunk and never sit on the path to the Largest
 * Contentful Paint. The import is scheduled after the LCP candidate has
 * painted, inside an idle callback, with a 2 s hard fallback.
 *
 * Deviation from PHASE0_BRIEF.md Task 4, reported in PHASE0_REPORT.md: the
 * brief says to wait for `onLCP` from web-vitals. That callback does not
 * fire until the page is hidden or the visitor interacts, because only then
 * is the LCP final, so it would delay motion indefinitely on a page nobody
 * touches. A PerformanceObserver on the largest-contentful-paint entry
 * fires as soon as a candidate paints, which is what "after LCP" means here.
 *
 * No ScrollTrigger (Phase 6, 25 September 2026). Its only user was
 * SplitLines, as a start trigger, and its refresh — measuring every trigger
 * on load, on resize and on the window's load event — was a long task on the
 * home page. The scroll spine never used it (timeline.ts); SplitLines starts
 * on an IntersectionObserver instead.
 */

import type Lenis from "lenis";
import type { gsap as GsapNamespace } from "gsap";

export interface MotionApi {
  gsap: typeof GsapNamespace;
  SplitText: typeof import("gsap/SplitText").SplitText | null;
  Lenis: typeof Lenis;
}

let motionPromise: Promise<MotionApi> | null = null;
let ready = false;

/** True once the motion chunk has finished loading. */
export function isMotionReady(): boolean {
  return ready;
}

export function prefersReducedMotion(): boolean {
  return (
    typeof matchMedia === "function" &&
    matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Import the motion chunk. Safe to call many times; the import happens once.
 * Resolves with the loaded modules.
 */
export function loadMotion(): Promise<MotionApi> {
  if (motionPromise) return motionPromise;

  motionPromise = (async () => {
    const [gsapModule, lenisModule] = await Promise.all([import("gsap"), import("lenis")]);

    // SplitText ships with GSAP 3.13+. Tolerate its absence so a GSAP
    // upgrade that moves it cannot break the whole chunk.
    let SplitText: MotionApi["SplitText"] = null;
    try {
      SplitText = (await import("gsap/SplitText")).SplitText;
    } catch {
      SplitText = null;
    }

    const gsap = gsapModule.gsap;
    if (SplitText) gsap.registerPlugin(SplitText);

    ready = true;
    return {
      gsap,
      SplitText,
      Lenis: lenisModule.default as typeof Lenis,
    };
  })();

  return motionPromise;
}

function onIdle(callback: () => void, timeout = 1500): void {
  const ric = (
    window as Window & {
      requestIdleCallback?: (
        cb: IdleRequestCallback,
        opts?: { timeout: number }
      ) => number;
    }
  ).requestIdleCallback;

  if (typeof ric === "function") ric(() => callback(), { timeout });
  else setTimeout(callback, 200);
}

/**
 * Run `callback` once the LCP candidate has painted and the main thread is
 * idle. Falls back to a 2 s timer where PerformanceObserver is unavailable
 * or no LCP entry ever arrives.
 */
export function afterLcpIdle(callback: () => void): void {
  if (typeof window === "undefined") return;

  let fired = false;
  const run = () => {
    if (fired) return;
    fired = true;
    onIdle(callback);
  };

  const fallback = setTimeout(run, 2000);

  try {
    const observer = new PerformanceObserver((list) => {
      if (list.getEntries().length > 0) {
        clearTimeout(fallback);
        observer.disconnect();
        run();
      }
    });
    observer.observe({ type: "largest-contentful-paint", buffered: true });
  } catch {
    // PerformanceObserver or the LCP entry type is unavailable; the timer
    // above is the whole mechanism.
  }
}

/** Schedule the motion chunk at the right moment. Idempotent. */
export function scheduleMotion(): void {
  if (typeof window === "undefined") return;
  if (prefersReducedMotion()) return;
  afterLcpIdle(() => {
    void loadMotion();
  });
}
