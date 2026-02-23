"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Play } from "lucide-react";
import { caseStudies } from "../../data";
import Banner from "../../components/Banner";

export default function CaseStudyDetailPage() {
  const params = useParams();
  const currentId = params.id as string;
  const study = caseStudies.find((cs) => cs.id === currentId);

  const related = useMemo(() => {
    const others = caseStudies.filter((cs) => cs.id !== currentId);
    return others.sort(() => Math.random() - 0.5).slice(0, 3);
  }, [currentId]);

  if (!study) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold mb-4">Case study not found</h2>
        <Link href="/case-study" className="text-[#BD2E25] underline">
          &larr; Back to all case studies
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <div className="relative w-full h-[300px] md:h-[500px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={study.image} alt="Case study background" className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-end pb-10 md:pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-snug">
              {study.title}
            </h2>
          </div>
        </div>
      </div>

      {/* Detail content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/case-study"
          className="inline-block bg-[#BD2E25] hover:bg-[#A02923] text-white font-medium py-2 px-6 rounded-lg shadow-md transition-colors duration-200"
        >
          &larr; Back to case studies
        </Link>

        <section className="bg-white pt-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className="w-full md:w-1/2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={study.innerImage1} alt="Project overview" className="w-full h-auto object-cover shadow-lg" />
            </div>
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl font-semibold text-[#171A20] mb-6">Project Details</h2>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-base">
                <dt className="text-[#333333]">Customer:</dt>
                <dd className="text-[#171A20]">{study.title}</dd>
                <dt className="text-[#333333]">Category:</dt>
                <dd className="text-[#171A20]">{study.category}</dd>
                <dt className="text-[#333333]">Date:</dt>
                <dd className="text-[#171A20]">{study.date}</dd>
                <dt className="text-[#333333]">Status:</dt>
                <dd className="text-[#171A20]">{study.status}</dd>
              </dl>
            </div>
          </div>
        </section>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-semibold text-black mb-6">{study.title}</h2>
        <p className="text-[#5C6280] leading-relaxed">{study.summary}</p>
        <ul className="mt-8 space-y-4">
          {[
            "Comprehensive discovery audit of existing infrastructure and pain points",
            "Custom solution architecture designed around specific business outcomes",
            "Phased implementation with zero-downtime migration strategy",
            "Knowledge transfer and training for in-house IT teams",
            "Ongoing monitoring, optimisation, and 24/7 support SLA",
          ].map((text, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className="flex-shrink-0 bg-white p-1 rounded-full">
                <ArrowRight size={20} className="text-black" />
              </div>
              <span className="text-black">{text}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-semibold text-[#1B3764] mb-4">The Full Story</h2>
        <p className="text-[#5C6280] leading-relaxed mb-8">
          {study.details}
        </p>
        <div className="relative w-full overflow-hidden rounded-lg shadow-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={study.image} alt="Project overview" className="w-full lg:h-[651px] object-cover" />
          <button aria-label="Play video" className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md">
              <Play size={32} className="text-black" />
            </div>
          </button>
        </div>
      </section>

      {/* Related */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl md:text-3xl font-semibold text-[#1B3764] mb-6">Related Case Studies</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {related.map((item) => (
            <Link
              key={item.id}
              href={`/case-studies/${item.id}`}
              className="relative group block overflow-hidden shadow-lg"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt={item.title} className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105" />
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
    </>
  );
}
