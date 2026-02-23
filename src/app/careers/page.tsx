"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import FeaturedJobs from "../components/FeaturedJobs";

export default function CareersPage() {
  return (
    <div>
      {/* Hero */}
      <div className="relative w-full h-[300px] md:h-[500px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/career/careerbg.png" alt="Careers" className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-end pb-10 md:pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="w-full text-white space-y-4">
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-snug md:leading-snug">
                Build What Matters. With People Who Do.
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <section className="bg-[#F4F4F4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/career/career1.png" alt="Team reviewing job roles" className="w-full h-auto object-cover rounded-lg shadow-lg" />
            </div>
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl font-semibold text-[#1B3764] mb-6">Search Job</h2>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8C8C]" size={20} />
                <input
                  type="text"
                  placeholder="Search by role or keyword"
                  aria-label="Search jobs"
                  className="w-full border border-[#A6A6A6] rounded-md py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#BD2E25] transition"
                />
              </div>
              <p className="text-[#5C6280] leading-relaxed">
                If you thrive on solving problems that matter&mdash;for enterprises that depend on you&mdash;Inflexions is where your expertise becomes impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Working with us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-[#333333] leading-relaxed max-w-xl">
            We hire for mastery and curiosity. If you&apos;re ready to work on high-stakes projects with a team that values precision over politics, explore what&apos;s open.
          </p>
          <div className="text-center md:text-right space-y-4">
            <h3 className="text-[24px] font-semibold leading-[28px] text-[#171A20]">Working with us</h3>
            <Link
              href="/jobs"
              className="inline-block border-2 border-black text-black font-medium py-2 px-12 rounded-md hover:bg-black hover:text-white transition-colors duration-200"
            >
              View Jobs
            </Link>
          </div>
        </div>
      </section>

      <FeaturedJobs />

      {/* Join Us */}
      <section className="relative w-full h-[300px] md:h-[400px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/about/vidmin.png" alt="Join Us Hero" className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-[#1B3764]/80" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4 max-w-2xl">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">Join Us</h2>
            <p className="text-white/90 text-lg mb-8">
              Shape the technology backbone of Africa&apos;s leading enterprises.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/jobs"
                className="inline-block border-2 border-white text-white font-semibold px-8 py-3 rounded-[6px] hover:bg-white hover:text-[#1B3764] transition-colors duration-300"
              >
                View Jobs
              </Link>
              <Link
                href="/internships"
                className="inline-block bg-[#BD2E25] hover:bg-[#A02923] text-white font-semibold px-8 py-3 rounded-[6px] transition-colors duration-300"
              >
                View Internships
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
