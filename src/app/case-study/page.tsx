"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { caseStudies } from "../data";
import Banner from "../components/Banner";

export default function CaseStudyPage() {
  const topImages = ["/assets/solutions/sol2.png", "/assets/solutions/sol1.png", "/assets/solutions/sol1.png"];
  const bottomImages = ["/assets/case/case3.png", "/assets/case/case3.png"];

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
          <div className="bg-[#BD2E25] text-white p-8 flex flex-col text-justify items-center justify-center h-auto md:h-full">
            <p className="mb-2">
              Don&apos;t just take our word for it. Explore how Inflexions has
              partnered with organizations like yours to solve complex
              challenges, implement transformative solutions, and achieve
              significant business results.
            </p>
          </div>
          <div className="space-y-1 h-auto md:h-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 h-auto md:h-1/2">
              {topImages.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={src} alt={`Case study ${i + 1}`} className="w-full h-auto md:h-full object-cover rounded-lg shadow-lg" />
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 h-auto md:h-1/2">
              {bottomImages.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={src} alt={`Case study ${i + 4}`} className="w-full h-auto md:h-full object-cover rounded-lg shadow-lg" />
              ))}
            </div>
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
              className="relative group block overflow-hidden shadow-lg"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-[220px] bg-[#BD2E25]/0 group-hover:bg-[#BD2E25]/70 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                  <ArrowUpRight size={48} className="text-white" />
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
