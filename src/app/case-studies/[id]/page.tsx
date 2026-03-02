"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
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

  const paragraphs = study.details.split("\n\n");

  return (
    <>
      {/* Hero */}
      <div className="relative w-full h-[300px] md:h-[500px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={study.heroImage ?? study.image} alt={study.title} className="w-full h-full object-cover" loading="eager" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-end pb-10 md:pb-28 lg:pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="md:w-2/3 text-white space-y-3">
              <span className="inline-block bg-[#BD2E25] text-white text-xs font-medium px-3 py-1 rounded-full uppercase tracking-wide">
                {study.category}
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                {study.title}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Back link + Project Details */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/case-study"
          className="inline-block bg-[#BD2E25] hover:bg-[#A02923] text-white font-medium py-2 px-6 rounded-[6px] shadow-md transition-colors duration-200 mb-8"
        >
          &larr; Back to case studies
        </Link>

        <div className="flex flex-col md:flex-row items-start gap-8">
          <div className="w-full md:w-1/2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={study.innerImage1} alt="Project overview" className="w-full h-auto object-cover shadow-lg rounded-lg" />
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl font-semibold text-[#171A20] mb-6">Project Details</h2>
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-4 text-base">
              {"client" in study && (
                <>
                  <dt className="text-[#5C6280] font-medium">Client</dt>
                  <dd className="text-[#171A20]">{study.client}</dd>
                </>
              )}
              <dt className="text-[#5C6280] font-medium">Category</dt>
              <dd className="text-[#171A20]">{study.category}</dd>
              {"location" in study && (
                <>
                  <dt className="text-[#5C6280] font-medium">Location</dt>
                  <dd className="text-[#171A20]">{study.location}</dd>
                </>
              )}
              <dt className="text-[#5C6280] font-medium">Status</dt>
              <dd className="text-[#171A20]">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                  study.status === "completed"
                    ? "bg-green-50 text-green-700"
                    : "bg-amber-50 text-amber-700"
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    study.status === "completed" ? "bg-green-500" : "bg-amber-500"
                  }`} />
                  {study.status === "completed" ? "Completed" : study.status}
                </span>
              </dd>
            </dl>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-semibold text-[#171A20] mb-6">{study.title}</h2>
        <p className="text-[#41444B] text-lg leading-relaxed">{study.summary}</p>

        {/* Highlights */}
        {"highlights" in study && study.highlights && (
          <ul className="mt-8 space-y-4">
            {study.highlights.map((text: string, i: number) => (
              <li key={i} className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1 bg-[#BD2E25] p-1 rounded-full">
                  <ArrowRight size={14} className="text-white" />
                </div>
                <span className="text-[#41444B]">{text}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* The Full Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-semibold text-[#171A20] mb-6">The Full Story</h2>
        <div className="space-y-6">
          {paragraphs.map((p, i) => {
            const isSubheading =
              (/^Phase \d/.test(p) ||
                /^(Executive Summary|The (Challenge|Solution|Results)[:\s])/.test(p)) &&
              p.length < 120;
            const isBullet = p.startsWith("\u2022 ");
            if (isSubheading) {
              return (
                <h3 key={i} className="text-xl font-semibold text-[#171A20] mt-4">
                  {p}
                </h3>
              );
            }
            if (isBullet) {
              const text = p.slice(2);
              const colonIdx = text.indexOf(":");
              if (colonIdx > 0 && colonIdx < 40) {
                return (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1.5 w-2 h-2 rounded-full bg-[#BD2E25]" />
                    <p className="text-[#41444B] leading-relaxed">
                      <strong className="text-[#171A20]">{text.slice(0, colonIdx)}:</strong>
                      {text.slice(colonIdx + 1)}
                    </p>
                  </div>
                );
              }
              return (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1.5 w-2 h-2 rounded-full bg-[#BD2E25]" />
                  <p className="text-[#41444B] leading-relaxed">{text}</p>
                </div>
              );
            }
            return (
              <p key={i} className="text-[#41444B] leading-relaxed">
                {p}
              </p>
            );
          })}
        </div>

        <div className="relative w-full overflow-hidden rounded-lg shadow-lg mt-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={study.storyImage ?? study.image} alt={study.title} className="w-full lg:h-[500px] object-cover" />
        </div>
      </section>

      {/* Related Case Studies */}
      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#171A20] mb-6">Related Case Studies</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {related.map((item) => (
              <Link
                key={item.id}
                href={`/case-studies/${item.id}`}
                className="relative group block overflow-hidden shadow-lg rounded-lg"
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
      )}

      <Banner />
    </>
  );
}
