"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Partners from "../components/Partners";
import Banner from "../components/Banner";
import Leaders from "../components/Leaders";

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

export default function AboutPage() {
  const [aboutHeadingRef, aboutHeadingIn] = useInView();
  const [aboutSpanRef, aboutSpanIn] = useInView();
  const [aboutP1Ref, aboutP1In] = useInView();
  const [aboutP2Ref, aboutP2In] = useInView();
  const [aboutP3Ref, aboutP3In] = useInView();

  return (
    <>
      {/* Hero */}
      <div className="relative w-full h-[500px] md:h-[550px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/about/Photo.png"
          alt="About Inflexions IT"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/50" />
        {/* Hero text — standard positioning */}
        <div className="absolute inset-0 flex items-end pb-10 md:pb-28 lg:pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="md:w-2/3 text-white space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                80+ Years of Collective IT Mastery
              </h1>
              <p className="text-lg lg:text-xl text-white/90 leading-relaxed max-w-2xl">
                Precision engineering for the enterprises that can&apos;t
                afford to guess.
              </p>
            </div>
          </div>
        </div>
        {/* Vision & Mission card — bottom right */}
        <div className="absolute inset-0 flex items-end pb-6 md:pb-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="flex justify-end">
              <div className="hidden md:block w-[326px] bg-[#BD2E25] py-12 px-8 text-white space-y-6 rounded-[10px]">
                <h3 className="text-2xl font-semibold">
                  Vision &amp; Mission
                </h3>
                <ul className="space-y-4 text-sm">
                  <li>
                    <p className="font-semibold">Our Vision</p>
                    <p>
                      To turn IT complexity into competitive
                      advantage&mdash;simply, cost-effectively, and without
                      compromise.
                    </p>
                  </li>
                  <li>
                    <p className="font-semibold">Our Mission</p>
                    <p>
                      To be the technology partner enterprises trust when the
                      stakes are highest&mdash;delivering expertise,
                      accountability, and results that compound.
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Strategic Partner */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="w-full md:w-1/2 space-y-6">
              <h1 className="text-[24px] md:text-[32px] font-semibold text-[#16213E] leading-[32px] md:leading-[40px]">
                Your Strategic Technology Partner
              </h1>
              <p className="text-[14px] md:text-[16px] leading-[22px] md:leading-[25px] text-[#41444B]">
                At Inflexions I.T. Services, we don&apos;t just provide
                technology&mdash;we architect AI-integrated solutions that drive
                your specific business outcomes. Whether deploying machine
                learning for predictive operations, strengthening security with
                AI-driven threat detection, or enabling innovation through
                intelligent automation, we&apos;re your trusted guide through
                the complex IT landscape.
              </p>
              <p className="text-[14px] md:text-[16px] leading-[22px] md:leading-[25px] text-[#41444B]">
                Our privately-owned structure ensures agility, accountability,
                and accuracy in every engagement. We&apos;re sculpted for speed
                without sacrificing quality, delivering solutions that create
                lasting competitive advantages for businesses across Ghana and
                beyond.
              </p>
            </div>
            <div className="w-full md:w-1/2">
              <div className="grid grid-cols-2 gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/about/Strategy.png"
                  alt="Strategic technology planning in modern conference room"
                  className="w-full h-[200px] md:h-[280px] object-cover rounded-lg shadow-lg"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/about/Implementation.png"
                  alt="IT professional in enterprise data centre"
                  className="w-full h-[200px] md:h-[280px] object-cover rounded-lg shadow-lg mt-8"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Engineering the Future */}
      <section className="relative bg-[#2A2A2A] overflow-hidden">
        {/* Image — positioned to fill right half and bleed to edge */}
        <div className="hidden lg:block absolute top-0 right-0 w-1/2 h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/about/aboutsect.png"
            alt="Modern data center with server infrastructure"
            loading="lazy"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row">
            <div className="w-full lg:w-1/2 py-12 lg:py-20 lg:pr-12 text-white space-y-6">
            <h2
              ref={aboutHeadingRef as React.RefObject<HTMLHeadingElement>}
              className={`${base} ${
                aboutHeadingIn
                  ? "translate-y-0 opacity-100 delay-[600ms]"
                  : "translate-y-[30px] opacity-0"
              } text-[20px] lg:text-[24px] leading-[28px] lg:leading-[36px] font-semibold mb-6`}
            >
              Engineering the Future, One Solution at a Time
            </h2>
            <span
              ref={aboutSpanRef as React.RefObject<HTMLSpanElement>}
              className={`${base} ${
                aboutSpanIn
                  ? "translate-y-0 opacity-100 delay-[0ms]"
                  : "translate-y-[30px] opacity-0"
              } text-[14px] lg:text-[16px] leading-[22px] lg:leading-[25px] block`}
            >
              Founded in 2012 in Accra, Ghana, Inflexions I.T. Services was
              built on a singular conviction: the right technology, expertly
              implemented, is the inflexion point between stagnation and
              growth. Our core team brings decades of collective experience in
              IT systems integration.
            </span>
            <p
              ref={aboutP1Ref as React.RefObject<HTMLParagraphElement>}
              className={`${base} ${
                aboutP1In
                  ? "translate-y-0 opacity-100 delay-[100ms]"
                  : "translate-y-[30px] opacity-0"
              } text-[14px] lg:text-[16px] leading-[22px] lg:leading-[25px]`}
            >
              Today, we are the technology partner enterprises trust to
              navigate the AI era. We embed machine learning, AIOps, and
              intelligent automation into every solution we deliver&mdash;creating
              distinct competitive advantages, not incremental improvements.
            </p>
            <p
              ref={aboutP2Ref as React.RefObject<HTMLParagraphElement>}
              className={`${base} ${
                aboutP2In
                  ? "translate-y-0 opacity-100 delay-[200ms]"
                  : "translate-y-[30px] opacity-0"
              } text-[14px] lg:text-[16px] leading-[22px] lg:leading-[25px]`}
            >
              From our headquarters in Accra, we serve clients across Ghana
              with the ambition and capability to expand throughout West
              Africa. Our privately-owned structure means one thing: speed,
              accountability, and zero bureaucracy.
            </p>
            <p
              ref={aboutP3Ref as React.RefObject<HTMLParagraphElement>}
              className={`${base} ${
                aboutP3In
                  ? "translate-y-0 opacity-100 delay-[300ms]"
                  : "translate-y-[30px] opacity-0"
              } text-[14px] lg:text-[16px] leading-[22px] lg:leading-[25px]`}
            >
              Every engagement is a turning point. We help enterprises move
              from reactive IT spending to AI-ready, data-driven technology
              investment&mdash;and the results speak for themselves.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-[#BD2E25] hover:bg-[#A02923] text-white font-semibold px-8 py-3 rounded-[6px] transition-colors duration-300 mt-4"
            >
              Request Consultation
            </Link>
          </div>
          </div>
        </div>
        {/* Mobile/tablet image — normal flow */}
        <div className="lg:hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/about/aboutsect.png"
            alt="Modern data center with server infrastructure"
            loading="lazy"
            className="object-cover w-full h-[300px]"
          />
        </div>
      </section>

      {/* Leadership */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl lg:text-[36px] font-semibold text-[#1B3764] leading-tight mb-4">
            Leadership Built on Excellence
          </h2>
          <p className="max-w-3xl text-[#41444B] mb-10">
            Technical mastery meets business acumen. Our leadership team ensures
            every client receives solutions engineered for their specific
            challenges&mdash;not off-the-shelf templates.
          </p>
          <Leaders />
        </div>
      </section>

      {/* Powering Success */}
      <section className="bg-[#F7F8FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="w-full space-y-6">
              <div>
                <h2 className="text-[24px] md:text-[32px] font-semibold text-[#1B3764] leading-[32px] md:leading-tight mb-4">
                  Powering Success Across Industries
                </h2>
                <p className="text-base text-[#41444B]">
                  From telecommunications giants to high-growth startups,
                  leading organizations choose Inflexions for one reason: we
                  deliver measurable results. Every engagement is tailored,
                  every solution is proven.
                </p>
              </div>
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/about/vvvvv.png"
                  alt="Virtual reality experience"
                  className="w-full h-auto lg:h-[243px] rounded-[15px] object-cover"
                />
                <div className="absolute -bottom-6 -right-6 lg:-bottom-8 lg:-right-8">
                  <div className="bg-[#BD2E25] text-white w-[140px] h-[140px] lg:w-[160px] lg:h-[160px] flex flex-col items-center justify-center rounded-2xl border-4 border-white shadow-lg">
                    <span className="text-3xl lg:text-4xl font-bold">10</span>
                    <span className="uppercase text-xs lg:text-sm tracking-wide">
                      Years Of
                    </span>
                    <span className="uppercase text-xs lg:text-sm">
                      Experience
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full space-y-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/about/exp1.png"
                alt="Team meeting"
                className="w-full h-auto lg:h-[263px] rounded-[15px] object-cover"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                <div className="space-y-2">
                  <h3 className="text-[20px] lg:text-[24px] font-semibold text-[#1B3764]">
                    Certified Team
                  </h3>
                  <p className="text-sm text-[#41444B] leading-relaxed">
                    Our certified professionals with years of experience and top
                    industry credentials.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-[20px] lg:text-[24px] font-semibold text-[#1B3764]">
                    Trusted Company
                  </h3>
                  <p className="text-sm text-[#41444B] leading-relaxed">
                    With a proven track record, we deliver dependable,
                    high-quality results every time.
                  </p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-[6px] shadow-sm border border-[#E0E0E0]">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-[24px] font-bold text-[#1B3764] mb-1">
                      +233 208 889 270
                    </h3>
                    <p className="text-[#5C6280] text-sm">
                      Ready to get started? Call us now
                    </p>
                  </div>
                  <a
                    href="tel:+233208889270"
                    className="bg-[#BD2E25] hover:bg-[#A02923] text-white px-6 py-3 rounded-[6px] font-medium transition-colors duration-300 whitespace-nowrap"
                  >
                    Call Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Clients */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Partners />
        </div>
      </section>

      {/* Map */}
      <section>
        <div className="relative">
          <iframe
            title="Location map of Tsui Bleoo Rd, Accra"
            src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3970.5144110567144!2d-0.15543999999999997!3d5.63844!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNcKwMzgnMTguNCJOIDDCsDA5JzE5LjYiVw!5e0!3m2!1sen!2sgh!4v1746185407560!5m2!1sen!2sgh"
            width="100%"
            height="450"
            className="w-full h-[200px] sm:h-[300px] md:h-[450px]"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 md:bottom-6 md:left-6 md:translate-x-0 z-10 bg-white border-t-4 border-[#2A2A2A] shadow-lg p-4 sm:p-6 w-[90%] sm:w-auto">
            <span className="text-sm text-[#41444B]">Company Address</span>
            <span className="block text-xl sm:text-[28px] md:text-[32px] leading-tight sm:leading-[38px] font-medium mt-1">
              #2 Dei Close
              <br />
              East Legon
              <br />
              Accra, Ghana
            </span>
          </div>
        </div>
        <Banner />
      </section>
    </>
  );
}
