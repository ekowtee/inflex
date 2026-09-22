"use client";

import { useEffect, useState } from "react";
import { decideTier, readTierEnv, type Tier } from "./tier";

/**
 * The motion tier for this session.
 *
 * Returns "C" during server render and the first client paint, so nothing
 * heavier than the poster experience can ever be in the initial HTML. The
 * real tier lands in an effect, and is re-evaluated only when the
 * reduced-motion preference changes (HERO_SCENE_SPEC.md §9.2).
 */
export function useMotionTier(): Tier {
  const [tier, setTier] = useState<Tier>("C");

  useEffect(() => {
    const evaluate = () => setTier(decideTier(readTierEnv()));
    evaluate();

    const query = matchMedia("(prefers-reduced-motion: reduce)");
    query.addEventListener("change", evaluate);
    return () => query.removeEventListener("change", evaluate);
  }, []);

  return tier;
}
