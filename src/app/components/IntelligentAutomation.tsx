import Link from "next/link";

const capabilities = [
  {
    src: "/assets/ai/ai1.jpeg",
    title: "Predictive Analytics",
    text: "Demand forecasting, anomaly detection, and real-time operational dashboards that turn historical data into forward-looking intelligence.",
  },
  {
    src: "/assets/ai/ai2.jpeg",
    title: "Process Automation",
    text: "Workflow orchestration, intelligent document processing, and robotic process automation that eliminate manual bottlenecks.",
  },
  {
    src: "/assets/ai/ai3.jpeg",
    title: "Data Strategy & Architecture",
    text: "Data warehousing, pipeline design, and governance frameworks that give your organisation a single source of truth.",
  },
  {
    src: "/assets/ai/ai4.jpeg",
    title: "AI Integration",
    text: "Embedding machine-learning models into existing business systems\u2014API-first, vendor-neutral, and built to scale.",
  },
];

const aiPartners = [
  { src: "/assets/partners/google.svg", alt: "Google" },
  { src: "/assets/partners/anthropic.svg", alt: "Anthropic" },
  { src: "/assets/partners/openai.svg", alt: "OpenAI" },
  { src: "/assets/partners/xai.svg", alt: "xAI" },
];

export default function IntelligentAutomation() {
  return (
    <section className="bg-[#F7F8FA] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left — 2x2 image card grid */}
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-3">
              {capabilities.map((item) => (
                <div
                  key={item.title}
                  className="relative w-full h-[180px] sm:h-[220px] lg:h-[240px] rounded-lg overflow-hidden group transition-transform duration-500"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.src}
                    alt={item.title}
                    loading="lazy"
                    className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Gradient — always visible on mobile, hover on desktop */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Text overlay — always visible on mobile, hover on desktop */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-500">
                    <h3 className="text-sm sm:text-base lg:text-lg font-semibold leading-tight">{item.title}</h3>
                    <p className="mt-1 text-xs sm:text-sm leading-relaxed line-clamp-2 md:line-clamp-3 hidden sm:block">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — text, AI partner logos, CTA */}
          <div className="flex-1 flex flex-col justify-center">
            <span className="inline-block w-fit border-l-4 border-[#BD2E25] bg-[#BD2E25]/10 px-3 py-1 text-sm font-medium text-[#BD2E25] mb-4">
              FRONTIER AI
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-[32px] font-semibold text-[#171A20] leading-tight mb-4">
              Intelligence Built Into Every Layer
            </h2>
            <p className="text-[#41444B] text-[16px] leading-[26px] mb-8">
              AI isn&apos;t a bolt-on&mdash;it&apos;s woven into every pillar of our
              stack, amplifying network performance, strengthening security posture,
              optimising cloud spend, and unlocking data-driven decisions.
            </p>

            <p className="text-[#5C6280] text-sm font-medium mb-4">
              Powered by the world&apos;s leading AI labs
            </p>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {aiPartners.map((logo) => (
                <div
                  key={logo.alt}
                  className="relative group bg-white h-[72px] sm:h-[80px] flex items-center justify-center rounded-[10px] shadow-md"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className="w-[100px] h-[40px] object-contain"
                    loading="lazy"
                  />
                  <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#BD2E25] text-white text-xs font-medium px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-[#BD2E25]">
                    {logo.alt}
                  </span>
                </div>
              ))}
            </div>

            <div>
              <Link
                href="/solutions/data-centric-solutions"
                className="inline-block bg-[#BD2E25] hover:bg-[#A02923] text-white font-semibold px-8 py-3 rounded-[6px] transition-colors duration-300"
              >
                Explore Data-centric Solutions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
