"use client";

/**
 * Beat 0 — the arrival. SCROLL_NARRATIVE.md Beat 0, HERO_SCENE_SPEC.md §9.
 *
 * The server renders the copy and the unlit poster: that is the first paint
 * and the LCP element, and neither waits for JavaScript. On Tier A and B the
 * environment chunk loads after the LCP candidate paints, the scene mounts
 * behind the poster at the unlit state, and when the readiness contract is
 * met the poster fades over 900 ms and the arrival light plays. Tier C, and
 * any failure, crossfades the unlit poster to the lit one instead, so every
 * visitor gets the beat.
 */
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useMotionTier } from "@/motion/useMotionTier";
import { afterLcpIdle } from "@/motion/loadMotion";
import Magnetic from "@/motion/Magnetic";
import { duration, ease } from "@/motion/tokens";
import { posters } from "@/three/core/posters";

const CoreCanvas = dynamic(() => import("@/three/core/CoreCanvas"), { ssr: false });

type Stage = "poster" | "loading" | "live" | "fallback";

export default function Arrival() {
  const tier = useMotionTier();
  const [stage, setStage] = useState<Stage>("poster");
  const [posterHidden, setPosterHidden] = useState(false);
  const [litVisible, setLitVisible] = useState(false);

  // Tier A/B: request the environment after the LCP candidate has painted.
  useEffect(() => {
    if (tier === "C" || stage !== "poster") return;
    let cancelled = false;
    afterLcpIdle(() => {
      if (!cancelled) setStage("loading");
    });
    return () => {
      cancelled = true;
    };
  }, [tier, stage]);

  // Tier C: the arrival light as a poster crossfade, once the page is calm.
  useEffect(() => {
    if (tier !== "C" && stage !== "fallback") return;
    const t = setTimeout(() => setLitVisible(true), 1200);
    return () => clearTimeout(t);
  }, [tier, stage]);

  const onLive = useCallback(() => {
    setStage("live");
    setPosterHidden(true);
  }, []);

  const onFail = useCallback(() => {
    setStage("fallback");
  }, []);

  const showScene = (tier === "A" || tier === "B") && (stage === "loading" || stage === "live");

  return (
    <section
      className="on-obsidian relative isolate min-h-[100svh] w-full overflow-hidden bg-obsidian-950"
      aria-label="Introduction"
    >
      {showScene && <CoreCanvas tier={tier === "A" ? "A" : "B"} onLive={onLive} onFail={onFail} />}

      {/* The poster pair. Unlit is the LCP element; lit is the Tier C arrival.
          Centred object-position is what keeps the poster registered with the
          live scene: the camera's vertical field of view is fixed, so both
          share the vertical extent and crop the horizontal about the centre. */}
      <div className="absolute inset-0 z-[1]" aria-hidden="true">
        <Image
          src={posters.desktop.unlit}
          alt=""
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          placeholder="blur"
          blurDataURL={posters.lqip}
          className="hidden object-cover md:block"
          style={{
            objectPosition: "50% 50%",
            opacity: posterHidden ? 0 : 1,
            transition: `opacity ${duration.scene}ms ${ease.out}`,
          }}
        />
        <Image
          src={posters.mobile.unlit}
          alt=""
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          placeholder="blur"
          blurDataURL={posters.lqip}
          className="object-cover md:hidden"
          style={{
            objectPosition: "50% 50%",
            opacity: posterHidden ? 0 : 1,
            transition: `opacity ${duration.scene}ms ${ease.out}`,
          }}
        />
        <Image
          src={posters.desktop.lit}
          alt=""
          fill
          sizes="100vw"
          className="hidden object-cover md:block"
          style={{
            objectPosition: "50% 50%",
            opacity: litVisible && !posterHidden ? 1 : 0,
            transition: `opacity 1800ms ${ease.out}`,
          }}
        />
        <Image
          src={posters.mobile.lit}
          alt=""
          fill
          sizes="100vw"
          className="object-cover md:hidden"
          style={{
            objectPosition: "50% 50%",
            opacity: litVisible && !posterHidden ? 1 : 0,
            transition: `opacity 1800ms ${ease.out}`,
          }}
        />
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
                className="inline-flex h-14 items-center rounded-[6px] bg-primary-500 px-8 font-semibold text-white transition-colors duration-[120ms] hover:bg-primary-600"
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
