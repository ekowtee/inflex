"use client";

import { useState, useRef } from "react";
import Link from "next/link";

const cards = [
  {
    title: "Network Infrastructure",
    photo: "/assets/hero/swap1.jpg",
    href: "/solutions/network-infrastructure",
    subtext:
      "Secure, high-performance LAN, WAN, SD-WAN, and wireless solutions engineered for reliability at enterprise scale.",
  },
  {
    title: "Data Security",
    photo: "/assets/hero/swap2.webp",
    href: "/solutions/data-security",
    subtext:
      "End-to-end threat protection, compliance frameworks, and 24/7 monitoring that safeguard your most critical assets.",
  },
  {
    title: "Cloud Services",
    photo: "/assets/hero/swap3.jpg",
    href: "/solutions/cloud-services",
    subtext:
      "Strategic cloud migration, hybrid integration, and managed services across AWS, Azure, and Google Cloud.",
  },
  {
    title: "Data-centric Solutions",
    photo: "/assets/hero/swap4.jpg",
    href: "/solutions/data-centric-solutions",
    subtext:
      "Advanced analytics, AI-driven insights, and data governance that turn raw information into strategic advantage.",
  },
];

function Box({
  dataIdx,
  isTop,
  className,
  onEnter,
  onLeave,
}: {
  dataIdx: number;
  isTop?: boolean;
  className?: string;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const card = cards[dataIdx];

  return (
    <Link
      href={card.href}
      className={`relative overflow-hidden group cursor-pointer block ${className}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={card.photo}
        alt={card.title}
        className="w-full h-full object-cover"
      />
      {isTop ? (
        <>
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-[#52110D]/20 to-[#52110D]/90" />
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 z-10">
            <span className="block text-white text-base sm:text-xl font-semibold">
              {card.title}
            </span>
            <span className="block text-white text-xs sm:text-sm mt-1 sm:mt-2 leading-relaxed">
              {card.subtext}
            </span>
          </div>
        </>
      ) : (
        <>
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#BD2E25]/70 via-transparent to-[#52110D]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
            <span className="text-white text-xl">{card.title}</span>
          </div>
        </>
      )}
    </Link>
  );
}

export default function SwapGrid() {
  const [order, setOrder] = useState([0, 1, 2, 3]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const swapToTop = (pos: number) => {
    setOrder((prev) => {
      const copy = [...prev];
      [copy[0], copy[pos]] = [copy[pos], copy[0]];
      return copy;
    });
  };

  const scheduleSwap = (pos: number) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (pos !== 0) {
      timerRef.current = setTimeout(() => {
        swapToTop(pos);
        timerRef.current = null;
      }, 1000);
    }
  };

  const cancelSwap = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <div className="w-full space-y-4">
      <Box dataIdx={order[0]} isTop className="w-full h-[180px] sm:h-[220px] md:h-[250px] rounded-lg" onEnter={() => scheduleSwap(0)} onLeave={cancelSwap} />
      <div className="flex gap-3 sm:gap-4">
        <Box dataIdx={order[1]} className="h-[100px] sm:h-[120px] md:h-[130px] flex-[2] rounded-lg" onEnter={() => scheduleSwap(1)} onLeave={cancelSwap} />
        <Box dataIdx={order[2]} className="h-[100px] sm:h-[120px] md:h-[130px] flex-1 rounded-lg" onEnter={() => scheduleSwap(2)} onLeave={cancelSwap} />
      </div>
      <Box dataIdx={order[3]} className="w-full h-[150px] sm:h-[180px] md:h-[200px] rounded-lg" onEnter={() => scheduleSwap(3)} onLeave={cancelSwap} />
    </div>
  );
}
