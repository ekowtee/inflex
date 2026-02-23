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

export default function CallToAction() {
  const [dtitleRef, dtitleIn] = useInView();
  const [dparaRef, dparaIn] = useInView();
  const [dheroBtnRef, dheroBtnIn] = useInView();

  return (
    <section className="relative w-full h-[300px] md:h-[400px] overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/hero/ban1.png"
        alt=""
        loading="lazy"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-[#1B3764]/80" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center px-4 max-w-2xl">
          <h2
            ref={dtitleRef as React.RefObject<HTMLHeadingElement>}
            className={`${base} ${
              dtitleIn
                ? "translate-y-0 opacity-100 delay-[0ms]"
                : "translate-y-[30px] opacity-0"
            } text-2xl md:text-4xl font-bold text-white mb-4`}
          >
            Stop Patching. Start Performing.
          </h2>

          <p
            ref={dparaRef as React.RefObject<HTMLParagraphElement>}
            className={`${base} ${
              dparaIn
                ? "translate-y-0 opacity-100 delay-[100ms]"
                : "translate-y-[30px] opacity-0"
            } text-white/90 text-lg mb-8`}
          >
            Book a 30-minute strategy session with our Solutions
            Architect. No pitch&mdash;just answers.
          </p>

          <div
            ref={dheroBtnRef as React.RefObject<HTMLDivElement>}
            className={`${base} ${
              dheroBtnIn
                ? "translate-y-0 opacity-100 delay-[200ms]"
                : "translate-y-[30px] opacity-0"
            }`}
          >
            <Link
              href="/contact"
              className="inline-block bg-[#BD2E25] hover:bg-[#A02923] text-white font-semibold px-8 py-3 rounded-[6px] transition-colors duration-300"
            >
              Book Your Session
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
