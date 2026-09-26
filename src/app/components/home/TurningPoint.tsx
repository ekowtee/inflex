/**
 * Beat 2 — the turning point. SCROLL_NARRATIVE.md §6 Beat 2, copy sheet.
 *
 * The positioning beat: "Most vendors add products. We integrate." Two
 * sentences, seven words, and the reason the rest of the page is allowed to
 * make claims.
 *
 * The right half is deliberately empty on desktop. The Core resolves from
 * noise to the clean inflection sheet there and the spine places it; nothing
 * in this file may fill that space.
 *
 * Below lg the Core is a faint texture behind full-width copy, so the curve
 * itself cannot be read there; the beat carries its still instead, as the
 * pillars do (owner, 25 September 2026: the curve was too faint).
 *
 * Choreography, CREATIVE_DIRECTION_3D.md §8.4: heading lines × 60 ms + 80 ms
 * to the body, +120 ms to the exit. 320 ms end to end, inside the 600 ms cap.
 */
import Image from "next/image";
import Reveal from "@/motion/Reveal";
import SplitLines from "@/motion/SplitLines";
import Thread from "@/motion/Thread";
import ExitLink from "./ExitLink";

export default function TurningPoint() {
  return (
    <section
      id="turning-point"
      data-beat="2"
      data-register="obsidian"
      data-header-dark=""
      className="band-obsidian on-obsidian relative w-full overflow-hidden"
      aria-label="The inflection point"
    >
      <div className="mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-4 py-24 sm:px-6 lg:px-8">
        <div className="md:max-w-[52%] lg:max-w-[50%]">
          <Reveal as="p" className="type-eyebrow text-silver-500">
            The inflection point
          </Reveal>

          <SplitLines as="h2" className="type-display-l mt-8 max-w-[16ch] text-silver-100" delay={80}>
            We engineer the inflection point.
          </SplitLines>

          <Reveal as="p" className="type-body-l mt-6 max-w-[56ch] text-silver-300" delay={200}>
            Legacy systems drain budget. Threats escalate. Data exists everywhere
            and informs nothing. Most vendors add products.{" "}
            <strong className="font-semibold text-silver-100">We integrate</strong>{" "}
            — so network, cloud, security and data work as one intelligent system.
          </Reveal>

          <Reveal className="mt-10" delay={320}>
            <ExitLink href="/about" className="text-silver-100">
              How we integrate
            </ExitLink>
          </Reveal>
        </div>

        {/* Phones and tablets: the y = x³ curve as a still, captured from the
            real scene (f0-bend), tall enough for the whole S. */}
        <div aria-hidden="true" className="relative mt-12 h-[72vw] w-full overflow-hidden lg:hidden [mask-image:radial-gradient(ellipse_at_center,black_55%,transparent_100%)]">
          <Image
            src="/three/posters/f0-bend-lit-mobile-centred.webp"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>

        {/* The carry. In Beat 2 the thread is born from the Core: the ember
            line finishes its run, a node detaches, and the spine writes
            --thread-x here so the line drops from where it actually left. */}
        <div data-thread-slot="2" className="thread-slot mt-16">
          <Thread tone="ember" x="right" />
        </div>
      </div>
    </section>
  );
}
