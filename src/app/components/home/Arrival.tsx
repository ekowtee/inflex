"use client";

/**
 * Beat 0 — the arrival. SCROLL_NARRATIVE.md Beat 0, HERO_SCENE_SPEC.md §9.
 *
 * The server renders the copy and the unlit poster. On Tier A and B the
 * environment chunk loads after the LCP candidate paints, the scene mounts
 * behind the poster at the unlit state, and when the readiness contract is
 * met the poster fades over 900 ms and the arrival light plays. Tier C, and
 * any failure, crossfades the unlit poster to the lit one instead, so every
 * visitor gets the beat.
 *
 * Two things learned from Chrome, recorded in PERFORMANCE_PLAN.md §9.4:
 * an image that covers the whole viewport is never an LCP candidate, so the
 * headline is the LCP element and its font path is what the metric measures;
 * and the poster is a plain <picture> rather than next/image, because two
 * next/image elements with `priority` preloaded both the desktop and the
 * mobile poster on every device.
 */
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useMotionTier } from "@/motion/useMotionTier";
import { afterLcpIdle, prefersReducedMotion } from "@/motion/loadMotion";
import Magnetic from "@/motion/Magnetic";
import { duration, ease } from "@/motion/tokens";
import { posters } from "@/three/core/posters";
import { CoreCanvas } from "@/three/core/loadCore";
import { attachTimeline } from "@/three/core/timeline";

type Stage = "poster" | "loading" | "live" | "fallback";

/** Tier B waits past the page's quiet window before asking for the scene. */
const TIER_B_HOLD_MS = 3000;

const posterStyle = (visible: boolean, ms: number, lqip: boolean): React.CSSProperties => ({
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  // Centred: the camera's vertical field of view is fixed, so the poster and
  // the live scene share the vertical extent and crop the horizontal about
  // the centre. Any other position breaks the crossfade registration.
  objectPosition: "50% 50%",
  opacity: visible ? 1 : 0,
  transition: `opacity ${ms}ms ${ease.out}`,
  // The placeholder lives on the image itself, never on the wrapper: the
  // wrapper sits above the live canvas and does not fade, so anything
  // painted on it would hide the scene once the poster has gone.
  ...(lqip
    ? { backgroundImage: `url(${posters.lqip})`, backgroundSize: "cover", backgroundPosition: "50% 50%" }
    : {}),
});

function Poster({
  lit,
  visible,
  ms,
  eager,
  onLoad,
}: {
  lit: boolean;
  visible: boolean;
  ms: number;
  eager: boolean;
  onLoad?: () => void;
}) {
  const d = lit ? posters.desktop.lit : posters.desktop.unlit;
  const m = lit ? posters.mobile.lit : posters.mobile.unlit;
  return (
    <picture>
      <source media="(min-width: 768px)" type="image/avif" srcSet={d.avif} />
      <source media="(min-width: 768px)" type="image/webp" srcSet={d.webp} />
      <source type="image/avif" srcSet={m.avif} />
      {/* A plain img: media-specific sources with different aspect ratios,
          which next/image cannot express, and which preloaded both variants
          on every device. */}
      <img
        src={m.webp}
        alt=""
        width={posters.mobile.width}
        height={posters.mobile.height}
        fetchPriority={eager ? "high" : "auto"}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        draggable={false}
        onLoad={onLoad}
        style={posterStyle(visible, ms, !lit)}
      />
    </picture>
  );
}

export default function Arrival() {
  const tier = useMotionTier();
  const [stage, setStage] = useState<Stage>("poster");
  const [posterHidden, setPosterHidden] = useState(false);
  const [wantLit, setWantLit] = useState(false);
  const [litLoaded, setLitLoaded] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Tier A/B: request the environment after the LCP candidate has painted.
  // Tier B holds a further three seconds so the parse and compile land after
  // the page's quiet window rather than inside its blocking-time budget.
  useEffect(() => {
    if (tier === "C" || stage !== "poster") return;
    let cancelled = false;
    let timer = 0;
    afterLcpIdle(() => {
      if (cancelled) return;
      timer = window.setTimeout(
        () => {
          if (!cancelled) setStage("loading");
        },
        tier === "B" ? TIER_B_HOLD_MS : 0
      );
    });
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [tier, stage]);

  // Tier C, or any failure: the arrival light as a poster crossfade once the
  // page is calm. The lit poster is only requested at this point.
  useEffect(() => {
    if (tier !== "C" && stage !== "fallback") return;
    const t = window.setTimeout(() => setWantLit(true), 1200);
    return () => window.clearTimeout(t);
  }, [tier, stage]);

  useEffect(() => {
    const onScroll = () => setScrolled(true);
    window.addEventListener("scroll", onScroll, { passive: true, once: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The spine: maps scroll to the narrative timeline for every tier and
  // drives the pinned chapter's active row and the trust strip's slide.
  useEffect(() => attachTimeline({ reducedMotion: prefersReducedMotion() }), []);

  // While the scene is live the Obsidian chapters go transparent so the
  // fixed canvas shows through them (globals.css).
  useEffect(() => {
    if (stage !== "live") return;
    document.documentElement.setAttribute("data-core-live", "");
    return () => document.documentElement.removeAttribute("data-core-live");
  }, [stage]);

  const onLive = useCallback(() => {
    setStage("live");
    setPosterHidden(true);
  }, []);

  // A failure or a demotion to Tier C, possibly after the scene was live:
  // bring the poster back so the crossfade to the lit poster has a ground.
  const onFail = useCallback(() => {
    setStage("fallback");
    setPosterHidden(false);
  }, []);
  const onLitLoad = useCallback(() => setLitLoaded(true), []);

  const showScene = (tier === "A" || tier === "B") && (stage === "loading" || stage === "live");

  return (
    <section
      id="arrival"
      data-beat="0"
      data-register="obsidian"
      // No `isolate`: the canvas inside must belong to the root stacking
      // context so it can sit beneath the rest of the page (CoreCanvas).
      className="on-obsidian relative min-h-[100svh] w-full overflow-hidden bg-obsidian-950"
      aria-label="Introduction"
      data-scrolled={scrolled ? "" : undefined}
      data-header-dark=""
    >
      {showScene && <CoreCanvas tier={tier === "A" ? "A" : "B"} onLive={onLive} onFail={onFail} />}

      {/* The poster pair. Unlit paints first, over its inline placeholder;
          lit is the Tier C arrival and is requested only when needed. The
          wrapper itself must stay transparent: it is above the canvas. */}
      <div className="absolute inset-0 z-[1]" aria-hidden="true">
        <Poster lit={false} visible={!posterHidden} ms={duration.scene} eager />
        {wantLit && (
          // The scene token, which tokens.ts names for poster crossfades. It
          // was 1800 ms to echo the live arrival light (HERO_SCENE_SPEC §9),
          // but §10.2 allows no DOM motion over 1 s outside the pinned chapter.
          <Poster lit visible={litLoaded && !posterHidden} ms={duration.scene} eager={false} onLoad={onLitLoad} />
        )}
      </div>

      {/* Copy. Approved Variant A, SCROLL_NARRATIVE.md §7. */}
      <div className="relative z-[2] mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-4 pb-16 pt-24 sm:px-6 md:justify-center md:pb-24 lg:px-8">
        <div className="max-w-2xl md:max-w-[52%] lg:max-w-[50%]">
          <p className="type-eyebrow mb-6 text-silver-500">
            Enterprise IT integration
            <br className="md:hidden" />
            <span className="hidden md:inline"> · </span>
            Accra · Since 2012
          </p>
          <h1 className="type-display-xl text-silver-100">
            Engineered for the enterprises that can&apos;t afford to guess.
          </h1>
          <p className="type-body-l mt-6 max-w-[60ch] text-silver-300">
            Network, cloud, security and data — engineered as one system, run by
            the team that built a national LTE core and two Tier III data centres.
          </p>
          <p className="type-body mt-5 max-w-[60ch] text-silver-500">
            Book a 30-minute architecture review. With a Solutions Architect, not
            a salesperson. No pitch.
          </p>
          <div className="mt-8">
            <Magnetic>
              <Link
                href="/contact"
                className="inline-flex h-14 items-center rounded-[6px] bg-primary-500 px-8 font-semibold text-white transition-colors duration-[var(--motion-duration-micro)] hover:bg-primary-600"
              >
                Book the review
              </Link>
            </Magnetic>
          </div>
        </div>

        <a
          href="#trusted-by"
          className="type-eyebrow mt-16 inline-flex items-center gap-3 self-start text-silver-500 md:absolute md:bottom-10 md:left-1/2 md:mt-0 md:-translate-x-1/2"
        >
          <span>See the work</span>
          <span className="motion-scroll-cue" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
