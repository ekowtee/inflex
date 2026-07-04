"use client";

import { useState } from "react";
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

export default function SwapGrid() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className="w-full space-y-4">
      {/* Network Infrastructure (Top) */}
      <Card
        index={0}
        hoveredIdx={hoveredIdx}
        setHoveredIdx={setHoveredIdx}
        heightClass="w-full h-[180px] sm:h-[220px] md:h-[250px]"
      />

      {/* Two cards in row (Middle) */}
      <div className="flex gap-3 sm:gap-4">
        <Card
          index={1}
          hoveredIdx={hoveredIdx}
          setHoveredIdx={setHoveredIdx}
          heightClass="h-[100px] sm:h-[120px] md:h-[130px]"
          className="flex-[2]"
        />
        <Card
          index={2}
          hoveredIdx={hoveredIdx}
          setHoveredIdx={setHoveredIdx}
          heightClass="h-[100px] sm:h-[120px] md:h-[130px]"
          className="flex-1"
        />
      </div>

      {/* Data-centric Solutions (Bottom) */}
      <Card
        index={3}
        hoveredIdx={hoveredIdx}
        setHoveredIdx={setHoveredIdx}
        heightClass="w-full h-[150px] sm:h-[180px] md:h-[200px]"
      />
    </div>
  );
}

function Card({
  index,
  hoveredIdx,
  setHoveredIdx,
  heightClass,
  className = "",
}: {
  index: number;
  hoveredIdx: number | null;
  setHoveredIdx: (idx: number | null) => void;
  heightClass: string;
  className?: string;
}) {
  const card = cards[index];
  const isAnyHovered = hoveredIdx !== null;
  const isSelfHovered = hoveredIdx === index;

  return (
    <Link
      href={card.href}
      className={`relative overflow-hidden group cursor-pointer block rounded-lg shadow-md border border-[#D0D0D0]/30 transition-all duration-500 ${heightClass} ${className} ${
        isAnyHovered && !isSelfHovered
          ? "opacity-60 scale-[0.98] blur-[0.5px]"
          : "opacity-100 scale-100"
      }`}
      onMouseEnter={() => setHoveredIdx(index)}
      onMouseLeave={() => setHoveredIdx(null)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={card.photo}
        alt={card.title}
        className="w-full h-full object-cover transform transition-transform duration-[800ms] group-hover:scale-105"
      />
      {/* Smooth gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/85 transition-opacity duration-500" />
      <div className="absolute inset-0 bg-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Card text and animation */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 z-10 text-white flex flex-col justify-end h-full">
        <span className="block text-sm sm:text-base md:text-xl font-semibold tracking-tight transform transition-transform duration-300 group-hover:-translate-y-1">
          {card.title}
        </span>
        <div
          className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isSelfHovered
              ? "max-h-[100px] opacity-100 mt-1 sm:mt-2"
              : "max-h-0 opacity-0"
          }`}
        >
          <span className="block text-xs sm:text-sm text-white/90 leading-relaxed font-light">
            {card.subtext}
          </span>
        </div>
      </div>
    </Link>
  );
}
