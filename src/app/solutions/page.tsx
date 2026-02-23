"use client";

import { useEffect, useState, useRef } from "react";
import MainPartners from "../components/MainPartners";
import TestimonialSlider from "../components/TestimonialSlider";
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

export default function SolutionsPage() {
  const [headlineRef, headlineIn] = useInView();
  const [card1Ref, card1In] = useInView();
  const [card2Ref, card2In] = useInView();
  const [card3Ref, card3In] = useInView();
  const [card4Ref, card4In] = useInView();

  return (
    <div>
      {/* Hero */}
      <div className="relative w-full h-[500px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/about/aboutsect.png"
          alt="Solutions"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="md:w-1/2 text-white space-y-4">
              <h2 className="text-4xl lg:text-5xl font-bold">
                Solutions Engineered for Uptime
              </h2>
              <p className="text-lg text-white/90 mt-4 max-w-xl">
                Accelerate your digital transformation with integrated infrastructure, cloud, security, and AI-powered data solutions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Intro grid */}
      <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8">Enterprise Technology, Zero Compromise</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#BD2E25] p-8 text-white flex items-center">
            <p className="text-lg leading-relaxed text-left">
              Digital transformation isn&apos;t a buzzword&mdash;it&apos;s the difference between leading your market and losing it. Inflexions architects integrated solutions across infrastructure, cloud, security, and data intelligence&mdash;powered by automation and AI to deliver measurable business outcomes, not generic templates.
            </p>
          </div>
          <div className="grid grid-cols-2 grid-rows-2 gap-4">
            <div className="rounded-lg overflow-hidden transform transition-transform duration-500 ease-out hover:scale-105">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/solutions/sol2.png" alt="Team collaborating" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-lg overflow-hidden transform transition-transform duration-500 ease-out hover:scale-105">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/solutions/sol1.png" alt="Professional working" className="w-full h-full object-cover" />
            </div>
            <div className="col-span-2 rounded-lg overflow-hidden transform transition-transform duration-500 ease-out hover:scale-105">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/solutions/sol3.png" alt="Data visualization" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>

      {/* Integrated Solutions */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="flex items-center justify-center">
            <h2
              ref={headlineRef as React.RefObject<HTMLHeadingElement>}
              className={`${base} ${
                headlineIn
                  ? "translate-y-0 opacity-100 delay-[0ms]"
                  : "translate-y-[30px] opacity-0"
              } text-3xl md:text-4xl font-semibold text-[#171A20] leading-snug text-center md:text-left`}
            >
              Four Domains.
              <br />
              One Integrated
              <br />
              Stack.
            </h2>
          </div>
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div
              ref={card1Ref as React.RefObject<HTMLDivElement>}
              className={`${base} ${
                card1In
                  ? "translate-y-0 opacity-100 delay-[100ms]"
                  : "translate-y-[30px] opacity-0"
              } border-l-2 border-[#BD2E25] pl-6`}
            >
              <h3 className="text-xl font-semibold text-[#171A20]">Data-centric Solutions</h3>
              <p className="mt-1 text-lg font-medium text-[#262626]">Turn Raw Data into Strategic Advantage</p>
              <p className="mt-2 text-sm text-[#41444B] leading-relaxed">
                Unlock the full value of your data with advanced analytics, business intelligence, AI-driven insights, and data governance. From predictive modelling and machine learning pipelines to real-time dashboards and automated reporting, we build the data infrastructure that turns information into your most powerful strategic asset.
              </p>
            </div>
            <div
              ref={card2Ref as React.RefObject<HTMLDivElement>}
              className={`${base} ${
                card2In
                  ? "translate-y-0 opacity-100 delay-[200ms]"
                  : "translate-y-[30px] opacity-0"
              } border-l-2 border-[#D0D0D0] pl-6`}
            >
              <h3 className="text-xl font-semibold text-[#171A20]">Network Infrastructure</h3>
              <p className="mt-1 text-lg font-medium text-[#262626]">Building Your High-Performance Digital Backbone</p>
              <p className="mt-2 text-sm text-[#41444B] leading-relaxed">
                Secure, reliable, and scalable network infrastructure is non-negotiable. We design, implement, and manage LAN, WAN, SD-WAN, and wireless solutions that ensure seamless connectivity, optimal performance, and robust security for your critical operations.
              </p>
            </div>
            <div
              ref={card3Ref as React.RefObject<HTMLDivElement>}
              className={`${base} ${
                card3In
                  ? "translate-y-0 opacity-100 delay-[300ms]"
                  : "translate-y-[30px] opacity-0"
              } border-l-2 border-[#D0D0D0] pl-6`}
            >
              <h3 className="text-xl font-semibold text-[#171A20]">Cloud Services</h3>
              <p className="mt-1 text-lg font-medium text-[#262626]">Harnessing the Power and Agility of the Cloud</p>
              <p className="mt-2 text-sm text-[#41444B] leading-relaxed">
                Navigate your cloud journey with confidence. We offer cloud strategy consulting, migration services (AWS, Azure, Google Cloud), hybrid cloud integration, and cloud management, enabling scalability, cost-efficiency, and innovation.
              </p>
            </div>
            <div
              ref={card4Ref as React.RefObject<HTMLDivElement>}
              className={`${base} ${
                card4In
                  ? "translate-y-0 opacity-100 delay-[300ms]"
                  : "translate-y-[30px] opacity-0"
              } border-l-2 border-[#D0D0D0] pl-6`}
            >
              <h3 className="text-xl font-semibold text-[#171A20]">Data Security</h3>
              <p className="mt-1 text-lg font-medium text-[#262626]">End-to-End Protection for Your Most Critical Assets</p>
              <p className="mt-2 text-sm text-[#41444B] leading-relaxed">
                Cyber threats don&apos;t wait, and neither should your defences. We deliver comprehensive security assessments, threat monitoring, incident response, and compliance frameworks that protect your data, infrastructure, and reputation around the clock.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Digital Transformation Accelerator */}
      <section className="bg-[#171A20] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block border-l-4 border-[#BD2E25] bg-white/10 px-3 py-1 text-sm font-medium text-white mb-4">
              DIGITAL TRANSFORMATION
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
              Technology That Thinks, Adapts, and Scales
            </h2>
            <p className="text-[#A6A6A6] max-w-2xl mx-auto text-lg leading-relaxed">
              Our solutions don&apos;t just digitise existing processes&mdash;they reimagine them. We embed intelligence at every layer so your infrastructure learns, your operations automate, and your decisions accelerate.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-[#333333] rounded-lg p-8 hover:border-[#BD2E25] transition-colors duration-300">
              <div className="w-12 h-12 bg-[#BD2E25] rounded-[6px] flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/></svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Process Automation</h3>
              <p className="text-[#A6A6A6] leading-relaxed">
                Eliminate manual bottlenecks with RPA, workflow orchestration, and intelligent process automation. We identify high-impact automation opportunities and deploy solutions that reduce errors, cut costs, and free your team for strategic work.
              </p>
            </div>
            <div className="border border-[#333333] rounded-lg p-8 hover:border-[#BD2E25] transition-colors duration-300">
              <div className="w-12 h-12 bg-[#BD2E25] rounded-[6px] flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">AI &amp; Intelligent Operations</h3>
              <p className="text-[#A6A6A6] leading-relaxed">
                Deploy AIOps for predictive infrastructure monitoring, machine learning models for anomaly detection, and AI-driven analytics that surface insights before problems surface. Transform reactive IT into a proactive competitive advantage.
              </p>
            </div>
            <div className="border border-[#333333] rounded-lg p-8 hover:border-[#BD2E25] transition-colors duration-300">
              <div className="w-12 h-12 bg-[#BD2E25] rounded-[6px] flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Digital Workplace</h3>
              <p className="text-[#A6A6A6] leading-relaxed">
                Modernise how your teams collaborate, communicate, and create. From unified communications and cloud productivity suites to secure remote access and digital employee experience platforms&mdash;we build workplaces that attract and retain top talent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Frontier AI Labs */}
      <section className="py-16 bg-[#F7F8FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="inline-block border-l-4 border-[#BD2E25] bg-[#BD2E25]/10 px-3 py-1 text-sm font-medium text-[#BD2E25] mb-4">
              FRONTIER AI
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold text-[#171A20] mb-4">
              Powered by the World&apos;s Leading AI Labs
            </h2>
            <p className="text-[#5C6280] max-w-2xl mx-auto text-lg leading-relaxed">
              We integrate models and platforms from the frontier labs driving the AI revolution&mdash;giving your business access to the most advanced intelligence available.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {[
              { src: "/assets/partners/google.svg", alt: "Google" },
              { src: "/assets/partners/anthropic.svg", alt: "Anthropic" },
              { src: "/assets/partners/openai.svg", alt: "OpenAI" },
              { src: "/assets/partners/xai.svg", alt: "xAI" },
            ].map((lab) => (
              <div
                key={lab.alt}
                className="relative group bg-white h-[144px] w-[300px] flex items-center justify-center rounded-[10px] shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={lab.src}
                  alt={lab.alt}
                  className="w-[180px] h-[72px] object-contain"
                  loading="lazy"
                />
                <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#BD2E25] text-white text-xs font-medium px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-[#BD2E25]">
                  {lab.alt}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution cards */}
      <section>
        <div className="relative w-full h-[1600px] md:h-[700px] lg:h-[750px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/solutions/sol4.png" alt="Solutions background" className="hidden md:flex w-full h-[504px] object-cover" loading="lazy" />
          <div className="absolute lg:bottom-10 md:bottom-10 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-4 md:gap-2 lg:gap-0 lg:flex-row md:flex-row flex-col items-center justify-between">
            {[
              { img: "/assets/solutions/sol6.png", title: "Data-centric Solutions" },
              { img: "/assets/solutions/sol5.png", title: "Network Infrastructure" },
              { img: "/assets/solutions/sol7.png", title: "Cloud Services" },
              { img: "/assets/solutions/sol8.png", title: "Data Security" },
            ].map((item) => (
              <div key={item.title} className="relative shadow-md group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.img}
                  alt={item.title}
                  loading="lazy"
                  className="lg:w-[260px] h-full object-cover transform transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute bottom-0 left-2 lg:left-4 flex flex-col">
                  <span className="text-white text-[18px] leading-[21px]">{item.title}</span>
                  <span className="text-[#BD2E25] text-[14px] font-medium">Premium Solutions</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MainPartners />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TestimonialSlider />
      </div>
      <Banner />
    </div>
  );
}
