import Link from "next/link";
import { User, Building2, ArrowRight, CheckCircle } from "lucide-react";

const individualBenefits = [
  "Advance your career with internationally recognised programmes",
  "Learn from active industry practitioners, not career trainers",
  "Flexible scheduling with virtual and in-person options",
];

const corporateBenefits = [
  "Custom curricula built around your team's objectives",
  "On-site delivery at your offices, anywhere in the region",
  "Measurable ROI with post-programme evaluation reporting",
];

export default function AudienceSwitcher() {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#171A20] mb-4">
            Training That Meets You Where You Are
          </h2>
          <p className="text-[#5C6280] text-lg max-w-2xl mx-auto">
            Whether you&apos;re advancing your own career or upskilling a team,
            Inflexions Academy delivers rigorous, practitioner-led programmes
            built around your goals.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="relative bg-[#F7F8FA] border border-[#D0D0D0] rounded-lg p-8 lg:p-10 flex flex-col hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-[#BD2E25] rounded-[6px] flex items-center justify-center mb-6">
              <User className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-[#171A20] mb-3">
              For Individuals
            </h3>
            <p className="text-[#41444B] leading-relaxed mb-6">
              Advance your skills with open-enrolment programmes across AI,
              cybersecurity, cloud, and digital strategy.
            </p>
            <ul className="space-y-3 mb-8 flex-grow">
              {individualBenefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#BD2E25] mt-0.5 flex-shrink-0" />
                  <span className="text-[#41444B] text-sm">{benefit}</span>
                </li>
              ))}
            </ul>
            <Link
              href="#domains"
              className="inline-flex items-center justify-center bg-[#BD2E25] hover:bg-[#A02923] text-white font-semibold px-6 py-3 rounded-[6px] transition-colors group"
            >
              Browse Programmes
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="relative bg-[#1B3764] rounded-lg p-8 lg:p-10 flex flex-col hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-white rounded-[6px] flex items-center justify-center mb-6">
              <Building2 className="w-7 h-7 text-[#1B3764]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              For Organisations
            </h3>
            <p className="text-white/80 leading-relaxed mb-6">
              Custom team training and enterprise programmes designed around
              your strategic priorities.
            </p>
            <ul className="space-y-3 mb-8 flex-grow">
              {corporateBenefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                  <span className="text-white/90 text-sm">{benefit}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/academy/for-organizations"
              className="inline-flex items-center justify-center bg-white hover:bg-[#F7F8FA] text-[#1B3764] font-semibold px-6 py-3 rounded-[6px] transition-colors group"
            >
              Enterprise Training
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
