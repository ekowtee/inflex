"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { caseStudies } from "../data";
import Banner from "../components/Banner";

export default function CaseStudyPage() {
  return (
    <div>
      {/* Hero */}
      <div className="relative w-full h-[300px] md:h-[500px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/case/casebg.jpeg" alt="Case Studies" className="w-full h-full object-cover" loading="eager" />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-end pb-10 md:pb-28 lg:pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="md:w-2/3 text-white space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                Proof Over Promises
              </h1>
              <p className="text-lg lg:text-xl text-white/90 leading-relaxed max-w-2xl">
                Real results from real engagements across industries.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tangible Value */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-semibold mb-8">
          Delivering Tangible Value Through Technology
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-auto md:h-[412px]">
          <div className="bg-[#BD2E25] text-white p-8 flex flex-col text-justify items-center justify-center h-auto md:h-full rounded-lg">
            <p className="mb-2">
              Don&apos;t just take our word for it. Explore how Inflexions has
              partnered with organisations like yours to solve complex
              challenges, implement transformative solutions, and achieve
              significant business results.
            </p>
          </div>
          <div className="h-auto md:h-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/case/casestudy7.jpeg"
              alt="MTN Project UBIA — Data centre construction"
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Case Study Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {caseStudies.map((item) => (
            <Link
              key={item.id}
              href={`/case-studies/${item.id}`}
              className="relative group block overflow-hidden shadow-lg rounded-lg"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <span className="text-xs font-medium uppercase tracking-wide text-white/80">
                  {item.category}
                </span>
                <h3 className="text-lg font-semibold mt-1">{item.title}</h3>
                <p className="text-sm text-white/80 mt-1 line-clamp-2">{item.summary}</p>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-[#BD2E25]/80 rounded-full p-4">
                  <ArrowUpRight size={28} className="text-white" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Banner />
    </div>
  );
}
