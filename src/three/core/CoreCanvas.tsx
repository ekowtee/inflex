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
  /** Capture only: a shapes.ts shape to put in slot 5 instead of the mark. */
  shape?: string;
}

async function generateInWorker(shape?: string): Promise<CoreWorkerResult> {
  if (typeof Worker === "undefined") {
    const { generateCore, fingerprint } = await import("./worker/formations");
    const data = generateCore(undefined, shape);
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
    worker.postMessage({ type: "generate", shape });
  });
}

export default function CoreCanvas({ tier: initialTier, onLive, onFail, capture = false, shape }: CoreCanvasProps) {
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
    generateInWorker(capture ? shape : undefined)
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
  }, [onFail, capture, shape]);

  const handleDemote = useCallback(
    (next: Tier) => {
      if (next === "C") onFail();
      else {
        // The rebuilt scene gets its own 8 s to become ready. Inheriting the
        // first mount's deadline meant a demotion after going live missed it
        // at once and fell straight through to posters.
        mountedAt.current = performance.now();
        setTier(next);
      }
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

  // Fixed to the viewport at z-index −1 in the root stacking context (the
  // hero deliberately does not isolate), so it paints beneath every in-flow
  // box on the page: the chapters, the footer, anything static. The
  // Obsidian chapters go transparent while the scene is live
  // (globals.css, `html[data-core-live]`) so the Core shows through them;
  // the Ivory chapters and the footer keep their backgrounds and cover it.
  // The spine sets the node opacity per beat and the scene skips drawing
  // while it is 0.
  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[-1]"
      style={{ pointerEvents: "none" }}
      aria-hidden="true"
      data-core-tier={tier}
    />
  );
}
