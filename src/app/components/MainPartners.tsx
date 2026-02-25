"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

const partners = [
  { src: "/assets/partners/microsoft.svg", alt: "Microsoft" },
  { src: "/assets/partners/cisco.svg", alt: "Cisco" },
  { src: "/assets/partners/hp.svg", alt: "HP" },
  { src: "/assets/partners/dell.svg", alt: "Dell" },
  { src: "/assets/partners/lenovo.svg", alt: "Lenovo" },
  { src: "/assets/partners/huawei.svg", alt: "Huawei" },
  { src: "/assets/partners/sophos.svg", alt: "Sophos" },
  { src: "/assets/partners/cloudflare.svg", alt: "Cloudflare" },
  { src: "/assets/partners/eset.svg", alt: "ESET" },
  { src: "/assets/partners/schneider.svg", alt: "APC / Schneider Electric" },
  { src: "/assets/partners/google.svg", alt: "Google" },
  { src: "/assets/partners/amazon.svg", alt: "Amazon" },
  { src: "/assets/partners/digitalocean.svg", alt: "DigitalOcean" },
  { src: "/assets/partners/redhat.svg", alt: "Red Hat" },
  { src: "/assets/partners/anthropic.svg", alt: "Anthropic" },
  { src: "/assets/partners/avaya.svg", alt: "Avaya" },
  { src: "/assets/partners/hikvision.svg", alt: "Hikvision" },
];

const PAGE_SIZE = 9;
const totalPages = Math.ceil(partners.length / PAGE_SIZE);

export default function MainPartners() {
  const [activePage, setActivePage] = useState(0);
  const [fading, setFading] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const goToPage = (page: number) => {
    setFading(true);
    setTimeout(() => {
      setActivePage(page);
      setFading(false);
    }, 300);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      goToPage((activePage + 1) % totalPages);
    }, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activePage]);

  const currentBatch = partners.slice(
    activePage * PAGE_SIZE,
    activePage * PAGE_SIZE + PAGE_SIZE
  );

  return (
    <section>
      <div className="flex flex-col md:flex-col lg:flex-row w-full">
        <div className="flex-1 flex flex-col justify-center pt-0 lg:pt-20 md:pt-0">
          <div className="max-w-[440px] mb-4 md:mb-0 lg:mb-0">
            <h3 className="font-semibold text-[24px] sm:text-[28px] md:text-[32px] leading-tight tracking-[1.04px] mb-4">
              Proven Expertise,
              <br />
              Tangible Results
            </h3>
            <span className="block text-[#41444B] text-[16px] leading-[26px] mb-6">
              We don&apos;t just recommend technology&mdash;we stand behind it. Our certified engineers hold advanced accreditations across the platforms that power modern enterprise, ensuring every solution we deliver meets the highest standards of performance, security, and reliability.
            </span>

            <div className="flex gap-4 sm:gap-6 md:gap-8 mb-8">
              <div>
                <span className="block text-[#BD2E25] text-[22px] sm:text-[28px] font-bold leading-tight">50+</span>
                <span className="block text-[#41444B] text-[12px] sm:text-[14px] mt-1">Enterprise Clients</span>
              </div>
              <div>
                <span className="block text-[#BD2E25] text-[22px] sm:text-[28px] font-bold leading-tight">80+</span>
                <span className="block text-[#41444B] text-[12px] sm:text-[14px] mt-1">Years Combined Experience</span>
              </div>
              <div>
                <span className="block text-[#BD2E25] text-[22px] sm:text-[28px] font-bold leading-tight">99.9%</span>
                <span className="block text-[#41444B] text-[12px] sm:text-[14px] mt-1">Uptime Delivered</span>
              </div>
            </div>

            <div className="w-full max-w-[285px] h-[50px] bg-[#BD2E25] rounded-[6px] flex items-center justify-center">
              <Link href="/case-study" className="text-white font-semibold">
                View our Case studies
              </Link>
            </div>
          </div>
        </div>
        <div className="flex-1 pt-0 lg:pt-10 md:pt-0">
          <div
            className="relative w-full bg-cover bg-center"
            style={{ backgroundImage: `url(/assets/hero/map.png)` }}
          >
            <div className="relative z-10 lg:p-8 p-0">
              <span className="block text-black mt-2 font-normal text-[20px] leading-normal">
                Our Technology Partners
              </span>
              <div
                className={`grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 transition-opacity duration-300 ${
                  fading ? "opacity-0" : "opacity-100"
                }`}
              >
                {currentBatch.map((logo, i) => (
                  <div
                    key={logo.alt}
                    className="relative group bg-white h-[100px] sm:h-[120px] lg:h-[144px] flex items-center justify-center rounded-[10px] shadow-md cursor-pointer transition-all duration-500"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logo.src}
                      alt={logo.alt}
                      className="w-[180px] h-[72px] object-contain"
                      loading="lazy"
                    />
                    <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#BD2E25] text-white text-xs font-medium px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-[#BD2E25]">
                      {logo.alt}
                    </span>
                  </div>
                ))}
              </div>
              {/* Page indicators */}
              <div className="flex mt-4 space-x-2 justify-center">
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToPage(idx)}
                    className={`rounded-full transition-all duration-300 ${
                      activePage === idx
                        ? "bg-[#BD2E25] w-5 h-5 relative -top-0.5"
                        : "bg-[#F9C4C1] w-3 h-3"
                    }`}
                    aria-label={`Show partners page ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
