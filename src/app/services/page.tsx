import AskBand from "../components/AskBand";
import Reveal from "@/motion/Reveal";
import Image from "next/image";

export default function ServicesPage() {
  return (
    <div>
      {/* Hero */}
      <div className="relative w-full h-[500px]">
        <Image
          src="/assets/services/Servicesbg.webp"
          alt="Services"
          width={1648}
          height={640}
          className="w-full h-full object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-end pb-10 md:pb-28 lg:pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="md:w-1/2 text-white space-y-4">
              <h2 className="text-4xl lg:text-5xl font-bold">
                Your Operations. <br className="hidden lg:block" />Our Obsession.
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Service Delivery Models */}
      <section className="bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-8">
          <Image
            src="/assets/services/Services1.webp"
            alt="Service banner"
            width={1376}
            height={768}
            className="w-full h-[200px] sm:h-[300px] md:h-[450px] object-cover border border-[#D0D0D0] shadow-lg"
            sizes="(min-width: 1280px) 1216px, 100vw"
            priority
          />
        </div>
        <div className="py-12 flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="w-full md:w-1/3 flex justify-center">
            <div className="bg-white border-2 border-[#E6E6E6] shadow-sm p-6 flex items-center justify-center w-full h-auto md:h-[309px]">
              <Image
                src="/assets/logo.png"
                alt="Inflexions-IT Logo"
                width={770}
                height={150}
                className="max-h-full max-w-full object-contain"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
          </div>
          <div className="w-full md:w-2/3 pt-4">
            <Reveal as="h2" className="text-2xl md:text-[32px] font-semibold text-[#1B3764] leading-[120%] tracking-tight mb-4">
              Four Service Models. One Standard: Excellence.
            </Reveal>
            <Reveal as="p" delay={100} className="w-full lg:w-[568px] text-[#5C6280] mb-6 leading-[180%] tracking-tight">
              Every business has a different appetite for IT ownership. Whether you&apos;re automating operations, adopting AI, or modernising legacy systems&mdash;choose the model that matches your transformation goals, then scale as your ambitions evolve.
            </Reveal>
            <Reveal delay={200}>
              <a
                href="/contact"
                className="bg-[#BD2E25] hover:bg-[#A02923] text-white font-medium py-3 px-8 rounded-[6px] transition mt-6 inline-block"
              >
                Start a Conversation
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Professional Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col-reverse md:flex-row items-center gap-8">
          <div className="flex flex-col lg:flex-row md:flex-row items-start md:w-1/2">
            <div className="flex flex-col items-start flex-none mb-6 md:mb-0 md:mr-6">
              <div className="bg-[#BD2E25] text-white font-bold text-[28px] w-12 h-14 flex items-center justify-center">01</div>
              <div className="border-l-2 border-dashed border-[#A6A6A6] h-16 mt-2 md:mt-4"></div>
            </div>
            <div className="flex-1">
              <Reveal as="h3" className="text-xl md:text-[24px] leading-[20px] font-semibold tracking-tight text-[#1B3764] my-4 flex flex-col">
                Professional Services:
                <span className="text-[16px] leading-[20px] font-normal tracking-tight pt-3">Expert Guidance for High-Stakes IT Initiatives</span>
              </Reveal>
              <Reveal as="p" delay={100} className="text-[#5C6280] text-[16px] leading-normal tracking-tight mb-4 w-full lg:w-[405px]">
                Leverage our deep technical expertise for specific projects and strategic consulting. Our Professional Services team provides IT assessments, technology roadmapping, AI strategy workshops, automation opportunity assessments, solution design, complex implementations, cloud migrations, and digital transformation planning.
              </Reveal>
              <Reveal as="p" delay={200} className="text-[#5C6280] text-[16px] leading-normal tracking-tight mb-6 w-full lg:w-[405px]">
                <b className="text-[#5C6280]">Ideal For</b>: Businesses needing expert help with digital transformation strategy, AI adoption, automation implementation, technology migrations, or strategic IT planning.
              </Reveal>
              <Reveal delay={300}>
                <a
                  href="/contact"
                  className="bg-[#BD2E25] hover:bg-[#A02923] text-white font-medium py-4 px-6 md:px-10 rounded-[6px] transition inline-block"
                >
                  Explore This Model
                </a>
              </Reveal>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <Image
              src="/assets/services/Services2.webp"
              alt="Professional Services"
              width={1376}
              height={768}
              className="w-full h-auto lg:h-[559px] object-cover shadow-lg"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
        </div>
      </section>

      {/* Managed Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-1/2">
            <Image
              src="/assets/services/Services3.webp"
              alt="Managed Services"
              width={1376}
              height={768}
              className="w-full h-auto lg:h-[559px] object-cover shadow-lg"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
          <div className="flex flex-col lg:flex-row md:flex-row items-start lg:pl-8 pl-0 md:pl-0 md:w-1/2">
            <div className="flex flex-col items-start flex-none mb-6 md:mb-0 md:mr-6">
              <div className="bg-[#BD2E25] text-white font-bold text-[28px] w-12 h-14 flex items-center justify-center">02</div>
              <div className="border-l-2 border-dashed border-[#A6A6A6] h-16 mt-2 md:mt-4"></div>
            </div>
            <div className="flex-1">
              <Reveal as="h3" className="text-xl md:text-[24px] leading-[20px] font-semibold tracking-tight text-[#1B3764] my-4 flex flex-col">
                Managed Services:
                <span className="text-[16px] leading-[20px] font-normal tracking-tight lg:w-[316px] pt-3">Proactive Management. Predictable Costs. Peace of Mind.</span>
              </Reveal>
              <Reveal as="p" delay={100} className="text-[#5C6280] text-[16px] leading-normal tracking-tight mb-10 w-full lg:w-[405px]">
                Outsource the day-to-day management of your IT infrastructure to Inflexions. Our Managed Services combine AIOps-driven monitoring, automated remediation, intelligent alerting, patch management, security oversight, and helpdesk support. Benefit from predictable costs, near-zero downtime, and the freedom for your internal team to focus on innovation and digital transformation.
              </Reveal>
              <Reveal delay={200}>
                <a
                  href="/contact"
                  className="bg-[#BD2E25] hover:bg-[#A02923] text-white font-medium py-4 px-6 md:px-12 rounded-[6px] transition inline-block"
                >
                  Get Your Custom Quote
                </a>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Support Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col-reverse md:flex-row items-center gap-8">
          <div className="flex flex-col lg:flex-row md:flex-row items-start md:w-1/2">
            <div className="flex flex-col items-start flex-none mb-6 md:mb-0 md:mr-6">
              <div className="bg-[#BD2E25] text-white font-bold text-[28px] w-12 h-14 flex items-center justify-center">03</div>
              <div className="border-l-2 border-dashed border-[#A6A6A6] h-16 mt-2 md:mt-4"></div>
            </div>
            <div className="flex-1">
              <Reveal as="h3" className="text-xl md:text-[24px] leading-[20px] font-semibold tracking-tight text-[#1B3764] my-4 flex flex-col">
                Support Services:
                <span className="text-[16px] leading-[20px] font-normal tracking-tight pt-3">Fast, Reliable Technical Support When It Matters Most</span>
              </Reveal>
              <Reveal as="p" delay={100} className="text-[#5C6280] text-[16px] leading-normal tracking-tight mb-10 w-full lg:w-[405px]">
                Ensure business continuity with intelligent, responsive technical support. Our Support Services leverage AI-powered ticketing, automated diagnostics, and self-service portals alongside experienced technicians who resolve issues fast. From break/fix support to comprehensive helpdesk services&mdash;we minimise disruption so your teams stay productive.
              </Reveal>
              <Reveal delay={200}>
                <a
                  href="/contact"
                  className="bg-[#BD2E25] hover:bg-[#A02923] text-white font-medium py-4 px-6 md:px-10 rounded-[6px] transition inline-block"
                >
                  View Support Tiers
                </a>
              </Reveal>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <Image
              src="/assets/services/Services4.webp"
              alt="Support Services"
              width={1376}
              height={768}
              className="w-full h-auto lg:h-[559px] object-cover shadow-lg"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
        </div>
      </section>

      {/* Digital Transformation Advisory */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-1/2">
            <Image
              src="/assets/services/Services1.webp"
              alt="Digital Transformation Advisory"
              width={1376}
              height={768}
              className="w-full h-auto lg:h-[559px] object-cover shadow-lg"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
          <div className="flex flex-col lg:flex-row md:flex-row items-start lg:pl-8 pl-0 md:pl-0 md:w-1/2">
            <div className="flex flex-col items-start flex-none mb-6 md:mb-0 md:mr-6">
              <div className="bg-[#BD2E25] text-white font-bold text-[28px] w-12 h-14 flex items-center justify-center">04</div>
              <div className="border-l-2 border-dashed border-[#A6A6A6] h-16 mt-2 md:mt-4"></div>
            </div>
            <div className="flex-1">
              <Reveal as="h3" className="text-xl md:text-[24px] leading-[20px] font-semibold tracking-tight text-[#1B3764] my-4 flex flex-col">
                Digital Transformation Advisory:
                <span className="text-[16px] leading-[20px] font-normal tracking-tight lg:w-[316px] pt-3">From Vision to Execution&mdash;AI, Automation, and Beyond</span>
              </Reveal>
              <Reveal as="p" delay={100} className="text-[#5C6280] text-[16px] leading-normal tracking-tight mb-10 w-full lg:w-[405px]">
                Technology alone doesn&apos;t transform businesses&mdash;strategy does. Our Digital Transformation Advisory practice helps you define your AI and automation roadmap, prioritise high-impact initiatives, manage organisational change, and build internal capabilities. We bridge the gap between executive vision and technical execution so your transformation delivers ROI, not just slides.
              </Reveal>
              <Reveal delay={200}>
                <a
                  href="/contact"
                  className="bg-[#BD2E25] hover:bg-[#A02923] text-white font-medium py-4 px-6 md:px-10 rounded-[6px] transition inline-block"
                >
                  Start Your Transformation
                </a>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <AskBand />
    </div>
  );
}
