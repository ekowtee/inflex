import Link from "next/link";
import { BarChart3, Workflow, Database, BrainCircuit } from "lucide-react";

const capabilities = [
  {
    icon: BarChart3,
    title: "Predictive Analytics",
    text: "Demand forecasting, anomaly detection, and real-time operational dashboards that turn historical data into forward-looking intelligence.",
  },
  {
    icon: Workflow,
    title: "Process Automation",
    text: "Workflow orchestration, intelligent document processing, and robotic process automation that eliminate manual bottlenecks.",
  },
  {
    icon: Database,
    title: "Data Strategy & Architecture",
    text: "Data warehousing, pipeline design, and governance frameworks that give your organisation a single source of truth.",
  },
  {
    icon: BrainCircuit,
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
        <div className="text-center mb-12">
          <span className="inline-block border-l-4 border-[#BD2E25] bg-[#BD2E25]/10 px-3 py-1 text-sm font-medium text-[#BD2E25] mb-4">
            FRONTIER AI
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#171A20] mb-4">
            Intelligence Built Into Every Layer
          </h2>
          <p className="text-[#5C6280] max-w-2xl mx-auto text-base sm:text-lg">
            AI isn&apos;t a bolt-on&mdash;it&apos;s woven into every pillar of our
            stack, amplifying network performance, strengthening security posture,
            optimising cloud spend, and unlocking data-driven decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {capabilities.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-[#BD2E25]/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-[#BD2E25]" />
                </div>
                <h3 className="text-lg font-semibold text-[#171A20] mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-[#41444B] leading-relaxed">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mb-10">
          <p className="text-center text-[#5C6280] text-sm font-medium mb-6">
            Powered by the world&apos;s leading AI labs
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
            {aiPartners.map((logo) => (
              <div
                key={logo.alt}
                className="relative group bg-white h-[80px] w-[140px] sm:h-[100px] sm:w-[180px] flex items-center justify-center rounded-[10px] shadow-md"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="w-[100px] sm:w-[130px] h-[48px] sm:h-[56px] object-contain"
                  loading="lazy"
                />
                <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#BD2E25] text-white text-xs font-medium px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-[#BD2E25]">
                  {logo.alt}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/solutions/data-centric-solutions"
            className="inline-block bg-[#BD2E25] hover:bg-[#A02923] text-white font-semibold px-8 py-3 rounded-[6px] transition-colors duration-300"
          >
            Explore Data-centric Solutions
          </Link>
        </div>
      </div>
    </section>
  );
}
