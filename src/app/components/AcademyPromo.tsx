import Link from "next/link";
import { ArrowRight, Brain, Cloud, ShieldCheck, TrendingUp } from "lucide-react";

const domainPills = [
  { icon: Brain, label: "AI & Intelligent Systems" },
  { icon: Cloud, label: "Infrastructure & Cloud" },
  { icon: ShieldCheck, label: "Cybersecurity & Compliance" },
  { icon: TrendingUp, label: "Digital Strategy" },
];

export default function AcademyPromo() {
  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-[#1B3764]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/solutions/sol6.jpeg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-20"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1B3764] via-[#1B3764]/95 to-[#1B3764]/70" />
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 lg:p-12 items-center">
            <div>
              <span className="inline-block bg-[#BD2E25] text-white text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-sm mb-5">
                Inflexions Academy
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Develop Your Edge.
              </h2>
              <p className="text-white/85 text-lg leading-relaxed mb-6 max-w-xl">
                Expert-led training in AI, cybersecurity, cloud, and digital
                strategy. Open-enrolment programmes for professionals and
                custom training for enterprise teams.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/academy"
                  className="inline-flex items-center bg-white hover:bg-[#F7F8FA] text-[#1B3764] font-semibold px-6 py-3 rounded-[6px] transition-colors group"
                >
                  Explore Programmes
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  href="/academy/for-organizations"
                  className="inline-flex items-center border border-white/40 hover:bg-white/10 text-white font-semibold px-6 py-3 rounded-[6px] transition-colors"
                >
                  Enterprise Training
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {domainPills.map((pill) => {
                const Icon = pill.icon;
                return (
                  <div
                    key={pill.label}
                    className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4"
                  >
                    <div className="w-10 h-10 bg-[#BD2E25] rounded-[6px] flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm text-white font-medium leading-tight">
                      {pill.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
