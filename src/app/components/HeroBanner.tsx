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
    <div className="relative w-full h-[300px] md:h-[500px] overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/hero/herobanner2.png"
        alt=""
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/30" />

      <div className="absolute inset-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="absolute bottom-10 md:bottom-28 lg:bottom-24 w-full md:w-[800px] flex flex-col justify-center items-start">
            <h1
              ref={titleRef as React.RefObject<HTMLHeadingElement>}
              className={`${base} ${
                titleIn
                  ? "translate-y-0 opacity-100 delay-[0ms]"
                  : "translate-y-[30px] opacity-0"
              } text-2xl md:text-[32px] lg:text-4xl font-bold text-white leading-[1.2] mb-4`}
            >
              IT Infrastructure That Never Sleeps
            </h1>

            <p
              ref={paraRef as React.RefObject<HTMLParagraphElement>}
              className={`${base} ${
                paraIn
                  ? "translate-y-0 opacity-100 delay-[100ms]"
                  : "translate-y-[30px] opacity-0"
              } text-sm md:text-base text-white/90 leading-relaxed mb-6`}
            >
              We design, deploy, and manage enterprise-grade networks, cloud,
              and security&mdash;so downtime never costs you another dollar.
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
                Get Your Free IT Assessment
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
