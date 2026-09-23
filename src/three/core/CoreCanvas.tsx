"use client";

/**
 * The environment boundary — HERO_SCENE_SPEC.md §9.
 *
 * Decides the tier, generates the Core in a worker, and mounts the scene.
 * Tier C never reaches this component: Arrival only renders it for A and B,
 * and it is loaded with next/dynamic so three.js is never in the route
 * shell. Everything the poster contract needs is reported through onLive
 * and onFail; the canvas sits behind the hero copy and takes no input.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import type { Tier } from "@/motion/tier";
import type { CoreWorkerResult } from "./worker/formations.worker";
import { CoreScene } from "./CoreScene";
import { dprFor } from "./rig";
import { resetStore } from "./store";

export interface CoreCanvasProps {
  tier: "A" | "B";
  onLive: () => void;
  onFail: () => void;
  /** Poster capture mode: no probe, no deadline. */
  capture?: boolean;
}

async function generateInWorker(): Promise<CoreWorkerResult> {
  if (typeof Worker === "undefined") {
    const { generateCore, fingerprint } = await import("./worker/formations");
    const data = generateCore();
    return { type: "core", ...data, fingerprint: fingerprint(data), generateMs: 0 };
  }
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL("./worker/formations.worker.ts", import.meta.url));
    worker.onmessage = (event: MessageEvent<CoreWorkerResult>) => {
      if (event.data?.type !== "core") return;
      resolve(event.data);
      worker.terminate();
    };
    worker.onerror = (error) => {
      reject(error);
      worker.terminate();
    };
    worker.postMessage({ type: "generate" });
  });
}

export default function CoreCanvas({ tier: initialTier, onLive, onFail, capture = false }: CoreCanvasProps) {
  const [tier, setTier] = useState<"A" | "B">(initialTier);
  const [data, setData] = useState<CoreWorkerResult | null>(null);
  // Client-only component (loaded with ssr: false), so the window is safe to
  // read in lazy initialisers; the compiler rules forbid doing it in render.
  const [dpr] = useState(() => dprFor(window.innerWidth, window.innerHeight, window.devicePixelRatio || 1));
  const mountedAt = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    resetStore();
    mountedAt.current = performance.now();

    let cancelled = false;
    generateInWorker()
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch(() => {
        if (!cancelled) onFail();
      });

    // Scroll position, opacity and the beat come from the spine
    // (timeline.ts), attached by the arrival for every tier.
    return () => {
      cancelled = true;
    };
  }, [onFail]);

  const handleDemote = useCallback(
    (next: Tier) => {
      if (next === "C") onFail();
      else setTier(next);
    },
    [onFail]
  );

  // Mount the vanilla scene into the container once data is ready; rebuild
  // on a tier change.
  useEffect(() => {
    const container = containerRef.current;
    if (!data || !container) return;
    const scene = new CoreScene({
      container,
      data,
      tier,
      dpr,
      onLive,
      onDemote: handleDemote,
      mountedAt: mountedAt.current,
      capture,
    });
    return () => scene.dispose();
  }, [data, tier, dpr, onLive, handleDemote, capture]);

  if (!data) return null;

  // Fixed to the viewport, inside the hero's stacking context: later
  // sections paint over it, and the Obsidian chapters go transparent while
  // the scene is live (globals.css, `html[data-core-live]`) so the Core
  // shows through them and the Ivory chapters cover it. The spine sets the
  // node opacity per beat and the scene skips drawing while it is 0.
  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0"
      style={{ pointerEvents: "none" }}
      aria-hidden="true"
      data-core-tier={tier}
    />
  );
}
