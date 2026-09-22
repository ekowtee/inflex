import { Suspense } from "react";
import { notFound } from "next/navigation";
import CaptureStage from "./CaptureStage";

/**
 * Poster capture stage — HERO_SCENE_SPEC.md §9.1.
 *
 * Renders the Core full-screen at a fixed camera key and light state so
 * scripts/capture-posters.mjs can screenshot it. Exists only when the build
 * is told to expose it; in production it is a 404 and it is never in the
 * sitemap.
 */
export const dynamic = "force-static";

export default function CoreCapturePage() {
  if (process.env.NEXT_PUBLIC_CORE_CAPTURE !== "1") notFound();
  return (
    <Suspense fallback={null}>
      <CaptureStage />
    </Suspense>
  );
}
