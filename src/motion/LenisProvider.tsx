"use client";

import { useEffect } from "react";
import { loadMotion, prefersReducedMotion, scheduleMotion } from "./loadMotion";

/**
 * Smooth scroll and the ScrollTrigger bridge — CREATIVE_DIRECTION_3D.md §8.3.
 *
 * Mounted once, inside MarketingChrome. Renders nothing. Lenis only starts
 * after the motion chunk has loaded, which is after the LCP candidate has
 * painted, so scrolling is native until then and never blocked.
 *
 * Reduced motion: no Lenis, no ScrollTrigger ticker. Native scrolling only.
 */
export default function LenisProvider() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    scheduleMotion();

    void loadMotion().then(({ gsap, ScrollTrigger, Lenis }) => {
      if (disposed) return;

      const lenis = new Lenis({
        lerp: 0.09,
        wheelMultiplier: 1,
        // Native scrolling on touch: Lenis smoothing fights momentum
        // scrolling on iOS and costs frames on mid-range Android.
        syncTouch: false,
      });

      const onScroll = () => ScrollTrigger.update();
      lenis.on("scroll", onScroll);

      const raf = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      // Anchor links must go through Lenis or they jump while it animates.
      const onClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement | null;
        const anchor = target?.closest?.('a[href^="#"]');
        if (!anchor) return;
        const id = anchor.getAttribute("href");
        if (!id || id === "#") return;
        const element = document.querySelector(id);
        if (!element) return;
        event.preventDefault();
        lenis.scrollTo(element as HTMLElement, { offset: -80 });
      };
      document.addEventListener("click", onClick);

      cleanup = () => {
        document.removeEventListener("click", onClick);
        lenis.off("scroll", onScroll);
        gsap.ticker.remove(raf);
        lenis.destroy();
      };
    });

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  return null;
}
