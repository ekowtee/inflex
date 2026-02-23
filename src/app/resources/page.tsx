"use client";

import { useEffect, useState, useRef } from "react";
import Blog from "../components/Blog";
import Banner from "../components/Banner";

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

const base = "transform transition-all duration-[600ms] ease-out";

const whitepapers = [
  {
    id: 1,
    title: "Architecting a Secure Hybrid Cloud Environment",
    description:
      "In-depth whitepaper covering security foundations and deployment models for hybrid clouds.",
    coverUrl: "/assets/blog/cloud-computing.jpg",
    downloadLink: "/resources/whitepapers/hybrid-cloud",
  },
  {
    id: 2,
    title: "Maximizing ROI with IT Service Management",
    description:
      "Explore frameworks and metrics to measure and improve ROI on ITSM initiatives. In-depth work around to clock to deliver.",
    coverUrl: "/assets/blog/webinar3.png",
    downloadLink: "/resources/whitepapers/itsm-roi",
  },
];

const webinars = [
  {
    id: 1,
    title: "The Future of Network Infrastructure - SD-WAN Explained",
    description:
      "On-demand webinar diving into the capabilities and benefits of SD-WAN for modern networks.",
    date: "April 28, 2025",
    imageUrl: "/assets/blog/webinar1.png",
    recordingLink: "/webinars/sd-wan-explained",
  },
  {
    id: 2,
    title: "Cybersecurity in the Age of Remote Work",
    description:
      "Live session on best practices to secure remote workforces in 2025 and beyond.",
    date: "May 15, 2025",
    imageUrl: "/assets/blog/webinar2.png",
    registerLink: "/contact",
  },
];

export default function ResourcesPage() {
  const [insightsTitleRef, insightsTitleIn] = useInView();
  const [insightsParaRef, insightsParaIn] = useInView();

  return (
    <div>
      {/* Hero */}
      <div className="relative w-full h-[300px] md:h-[500px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/career/careerbg.png"
          alt="Resources"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-end pb-10 md:pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="w-full text-white space-y-4">
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-snug md:leading-[76px]">
                Insights That Sharpen Your Edge
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <header className="mb-12">
          <div className="flex flex-col md:flex-row items-center py-8">
            <div className="flex-shrink-0 mb-6 md:mb-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/blog/blogger.png"
                alt="Insights & Resources"
                className="w-full h-full lg:w-[400px] md:h-[300px] rounded-lg object-cover"
              />
            </div>
            <div className="md:ml-8 text-left">
              <h1
                ref={insightsTitleRef as React.RefObject<HTMLHeadingElement>}
                className={`${base} ${
                  insightsTitleIn
                    ? "translate-y-0 opacity-100 delay-[0ms]"
                    : "translate-y-[30px] opacity-0"
                } text-4xl font-bold mb-4 text-black`}
              >
                Expert Intelligence for IT Leaders
              </h1>
              <p
                ref={insightsParaRef as React.RefObject<HTMLParagraphElement>}
                className={`${base} ${
                  insightsParaIn
                    ? "translate-y-0 opacity-100 delay-[100ms]"
                    : "translate-y-[30px] opacity-0"
                } text-lg text-[#262626] max-w-2xl`}
              >
                Deep dives into the trends, frameworks, and strategies that matter most to technology leaders. Cut through the noise with insights built on real-world implementation experience.
              </p>
            </div>
          </div>
        </header>

        {/* Whitepapers */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-6">
            In-Depth Guides &amp; Reports
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whitepapers.map((item) => (
              <a
                key={item.id}
                href={item.downloadLink}
                className="block border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.coverUrl}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-[#41444B] mb-4">{item.description}</p>
                  <span className="text-[#BD2E25] font-medium">
                    Download &rarr;
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Webinars */}
        <section>
          <h2 className="text-3xl font-semibold mb-6">
            Learn from Our Experts
          </h2>
          <div className="space-y-6">
            {webinars.map((event) => (
              <div
                key={event.id}
                className="border rounded-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-lg transition-shadow"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full md:w-48 h-32 object-cover rounded mb-4 md:mb-0 md:mr-6"
                />
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold mb-2">{event.title}</h3>
                  <p className="text-[#41444B] mb-2">{event.description}</p>
                  <p className="text-[#5C6280] text-sm">{event.date}</p>
                </div>
                <div className="mt-4 md:mt-0">
                  {event.recordingLink ? (
                    <a
                      href={event.recordingLink}
                      className="inline-block bg-[#BD2E25] text-white px-5 py-2 rounded-full hover:bg-[#A02923] transition-colors"
                    >
                      Watch Recording
                    </a>
                  ) : (
                    <a
                      href={event.registerLink}
                      className="inline-block bg-[#BD2E25] text-white px-5 py-2 rounded-full hover:bg-[#A02923] transition-colors"
                    >
                      Register Now
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Blog />
      <Banner />
    </div>
  );
}
