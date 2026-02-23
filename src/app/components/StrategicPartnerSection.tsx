"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

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

export default function StrategicPartnerSection() {
  const [secTitleRef, secTitleIn] = useInView();
  const [secParaRef, secParaIn] = useInView();
  const [secBtnRef, secBtnIn] = useInView();

  const [item1Ref, item1In] = useInView();
  const [item2Ref, item2In] = useInView();
  const [item3Ref, item3In] = useInView();
  const [item4Ref, item4In] = useInView();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-col lg:flex-row w-full lg:h-[554px]">
        <div className="flex-1 md:py-10 lg:py-14">
          <h2
            ref={secTitleRef as React.RefObject<HTMLHeadingElement>}
            className={`${base} ${
              secTitleIn
                ? "translate-y-0 opacity-100 delay-[0ms]"
                : "translate-y-[30px] opacity-0"
            } lg:w-[500px] lg:h-[144px] lg:text-[36px] md:text-[28px] text-[24px] lg:leading-tight font-semibold mb-2 py-2`}
          >
            From Legacy Burden to Competitive Edge
          </h2>
          <div className="w-full md:w-[600px] lg:w-[500px]">
            <span
              ref={secParaRef as React.RefObject<HTMLSpanElement>}
              className={`${base} ${
                secParaIn
                  ? "translate-y-0 opacity-100 delay-[200ms]"
                  : "translate-y-[30px] opacity-0"
              } text-[18px] w-[300px] leading-[30px]`}
            >
              Legacy infrastructure drains budget and blocks innovation.
              Inflexions replaces complexity with clarity&mdash;robust networks,
              secure cloud, and intelligent data platforms built to scale with
              your ambition. No vendor lock-in. No surprise costs.
            </span>
          </div>

          <div
            ref={secBtnRef as React.RefObject<HTMLDivElement>}
            className={`${base} ${
              secBtnIn
                ? "translate-y-0 opacity-100 delay-[300ms]"
                : "translate-y-[30px] opacity-0"
            } bg-[#BD2E25] w-[201.32px] h-[53px] mt-6 rounded-[6px] flex items-center justify-center`}
          >
            <Link href="/solutions" className="text-white font-medium">
              See Our Approach
            </Link>
          </div>
        </div>

        <div className="relative flex flex-1 items-center justify-center mt-2 md:mt-0 lg:mt-0">
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/bgsvg/Background.png"
              alt=""
              className="w-[419px] h-full object-contain"
              loading="lazy"
            />
            <div className="absolute top-[calc(12.5%-10px)] bottom-[calc(12.5%+15px+44px)] left-[calc(0.5%-1px)] right-[calc(0.5%-2px)] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/bgsvg/image.png"
                alt="Professional at work"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Floating badges */}
            <div
              ref={item1Ref as React.RefObject<HTMLDivElement>}
              className={`${base} ${
                item1In
                  ? "translate-x-0 opacity-100 delay-[400ms]"
                  : "translate-x-[50px] opacity-0"
              } absolute top-[107px] left-[-60px] flex gap-2 items-center justify-center w-[262px] py-[4px] border border-[#BD2E25] rounded-[49px] bg-white`}
            >
              <CheckCircle className="text-[#BD2E25]" />
              <span className="text-[16px] leading-[30px] text-[#1B3764]">
                Data Intelligence
              </span>
            </div>

            <div
              ref={item2Ref as React.RefObject<HTMLDivElement>}
              className={`${base} ${
                item2In
                  ? "translate-x-0 opacity-100 delay-[500ms]"
                  : "translate-x-[50px] opacity-0"
              } absolute top-[162px] md:top-[182px] lg:top-[182px] left-[-90px] flex gap-2 items-center justify-center w-[262px] py-[4px] border border-[#BD2E25] rounded-[49px] bg-white`}
            >
              <CheckCircle className="text-[#BD2E25]" />
              <span className="text-[16px] leading-[30px] text-[#1B3764]">
                Network Infrastructure
              </span>
            </div>

            <div
              ref={item3Ref as React.RefObject<HTMLDivElement>}
              className={`${base} ${
                item3In
                  ? "translate-x-0 opacity-100 delay-[600ms]"
                  : "translate-x-[50px] opacity-0"
              } absolute top-[222px] md:top-[257px] lg:top-[257px] left-[-60px] flex gap-2 items-center justify-center w-[262px] py-[4px] border border-[#BD2E25] rounded-[49px] bg-white`}
            >
              <CheckCircle className="text-[#BD2E25]" />
              <span className="text-[16px] leading-[30px] text-[#1B3764]">
                Cloud Services
              </span>
            </div>

            <div
              ref={item4Ref as React.RefObject<HTMLDivElement>}
              className={`${base} ${
                item4In
                  ? "translate-x-0 opacity-100 delay-[700ms]"
                  : "translate-x-[50px] opacity-0"
              } absolute top-[282px] md:top-[332px] lg:top-[332px] left-[-90px] flex gap-2 items-center justify-center w-[262px] py-[4px] border border-[#BD2E25] rounded-[49px] bg-white`}
            >
              <CheckCircle className="text-[#BD2E25]" />
              <span className="text-[16px] leading-[30px] text-[#1B3764]">
                Security &amp; Support
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
