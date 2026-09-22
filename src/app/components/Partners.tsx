"use client";

import "./partners.css";
import Image from "next/image";

// Real client roster. Logo files live in /public/logos. MTN Ghana is
// deliberately not included until written permission is confirmed.
const logos = [
  { src: "/logos/ba.png", alt: "British Airways" },
  { src: "/logos/CEIBS.png", alt: "CEIBS" },
  { src: "/logos/atc.webp", alt: "ATC (American Tower Corporation)" },
  { src: "/logos/blu.png", alt: "Blu Telecommunications" },
  { src: "/logos/innovaddb.png", alt: "Innova DDB" },
  { src: "/logos/ninani.png", alt: "The Ninani Group" },
  { src: "/logos/lifeforms1.png", alt: "Lifeforms" },
];

export default function Partners() {
  return (
    <div className="overflow-hidden w-full py-6 md:py-10 px-0">
      <div className="flex items-center justify-center mb-4">
        <h1 className="text-[24px] sm:text-[28px] md:text-[32px] font-semibold leading-[30px] sm:leading-[38px]">Our Clients</h1>
      </div>
      <div className="py-5">
        <div className="partners-wrapper">
          {logos.map((logo, i) => (
            <Image
              src={logo.src}
              key={logo.alt}
              alt={logo.alt}
              width={120}
              height={40}
              className={`partners-item partners-item${i + 1}`}
              unoptimized
            />
          ))}
        </div>
      </div>
    </div>
  );
}
