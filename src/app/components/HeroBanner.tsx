"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

const base = "transform transition-all duration-[450ms] ease-out";

export default function HeroBanner() {
  const [titleRef, titleIn] = useInView();
  const [paraRef, paraIn] = useInView();
  const [heroBtnRef, heroBtnIn] = useInView();

  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/hero/herobanner2.png"
        alt=""
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/30" />

      <div className="absolute inset-0 flex items-end pb-10 md:pb-28 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="md:w-[800px] flex flex-col justify-center items-start">
            <h1
              ref={titleRef as React.RefObject<HTMLHeadingElement>}
              className={`${base} ${
                titleIn
                  ? "translate-y-0 opacity-100 delay-[0ms]"
                  : "translate-y-[30px] opacity-0"
              } text-2xl md:text-[32px] lg:text-4xl font-bold text-white leading-[1.2] mb-4`}
            >
              Engineered for the enterprises that can&apos;t afford to guess.
            </h1>

            <p
              ref={paraRef as React.RefObject<HTMLParagraphElement>}
              className={`${base} ${
                paraIn
                  ? "translate-y-0 opacity-100 delay-[100ms]"
                  : "translate-y-[30px] opacity-0"
              } text-sm md:text-base text-white/90 leading-relaxed mb-6`}
            >
              Network, cloud, security and data&mdash;engineered as one
              system, run by the team that built a national LTE core and two
              Tier III data centres.
            </p>

            <p className="text-sm text-white/80 leading-relaxed mb-6">
              Book a 30-minute architecture review. With a Solutions
              Architect, not a salesperson. No pitch.
            </p>

            <div
              ref={heroBtnRef as React.RefObject<HTMLDivElement>}
              className={`${base} ${
                heroBtnIn
                  ? "translate-y-0 opacity-100 delay-[300ms]"
                  : "translate-y-[30px] opacity-0"
              } w-full md:w-[254px] h-[60px] bg-[#BD2E25] rounded-[6px] flex items-center justify-center`}
            >
              <Link href="/contact" className="text-white font-semibold">
                Book the review
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
