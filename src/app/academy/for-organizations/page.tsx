import type { Metadata } from "next";
import {
  Layers,
  MapPin,
  BarChart3,
  Search,
  PenTool,
  GraduationCap,
  LineChart,
} from "lucide-react";
import AcademyHero from "../../components/AcademyHero";
import DomainCard from "../../components/DomainCard";
import Banner from "../../components/Banner";
import { domains } from "../data";

export const metadata: Metadata = {
  title: "Corporate & Enterprise Training",
  description:
    "Custom training programmes for corporate teams and institutions. On-site delivery, measurable ROI, and curricula tailored to your strategic priorities.",
};

const valueProps = [
  {
    icon: Layers,
    title: "Custom Curricula",
    description:
      "Programmes adapted to your technology stack, team maturity, and commercial objectives — not off-the-shelf content.",
  },
  {
    icon: MapPin,
    title: "On-Site Delivery",
    description:
      "We come to your offices, in Ghana and across the region. Minimise disruption, maximise team cohesion.",
  },
  {
    icon: BarChart3,
    title: "Measurable ROI",
    description:
      "Pre- and post-programme assessments, competency mapping, and outcome reporting you can take to your CFO.",
  },
];

const process = [
  {
    number: "01",
    icon: Search,
    title: "Assess",
    description:
      "We start by understanding your team, your current capability, and the commercial outcomes the training needs to drive.",
  },
  {
    number: "02",
    icon: PenTool,
    title: "Design",
    description:
      "We tailor the curriculum to your context — selecting modules, adjusting depth, and incorporating your real-world scenarios.",
  },
  {
    number: "03",
    icon: GraduationCap,
    title: "Deliver",
    description:
      "Practitioner-led delivery on-site, virtually, or hybrid. Hands-on where it matters, with flexibility for team schedules.",
  },
  {
    number: "04",
    icon: LineChart,
    title: "Measure",
    description:
      "Post-programme assessment, capability reporting, and a follow-up plan to embed learning into day-to-day work.",
  },
];

export default function ForOrganizationsPage() {
  return (
    <div>
      <AcademyHero
        eyebrow="For Organisations"
        title="Transform your workforce. Transform your business."
        subtitle="Custom training programmes built around your strategic priorities. Delivered on-site, virtually, or hybrid — measured against the outcomes that matter to your leadership team."
        backgroundImage="/assets/services/Servicesbg.jpeg"
        breadcrumbs={[
          { label: "Academy", href: "/academy" },
          { label: "For Organisations" },
        ]}
      />

      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block border-l-4 border-[#BD2E25] bg-[#F7F8FA] px-2 py-1 text-sm font-medium text-[#333333] mb-4">
              Why Corporates Choose Us
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#171A20] mb-4">
              Training that moves commercial outcomes.
            </h2>
            <p className="text-[#5C6280] text-lg max-w-2xl mx-auto">
              Three reasons L&amp;D leaders and CIOs partner with Inflexions
              Academy over generic training providers.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {valueProps.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="bg-white border border-[#D0D0D0] rounded-lg p-8 hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 bg-[#BD2E25] rounded-[6px] flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#171A20] mb-3">
                    {item.title}
                  </h3>
                  <p className="text-[#41444B] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-[#F7F8FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#171A20] mb-4">
              A proven four-step engagement
            </h2>
            <p className="text-[#5C6280] text-lg max-w-2xl mx-auto">
              Our engagement model is built for organisations that need
              outcomes, not just attendance sheets.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="relative bg-white border border-[#D0D0D0] rounded-lg p-6"
                >
                  <span className="absolute top-4 right-4 text-4xl font-bold text-[#F0E1DF]">
                    {step.number}
                  </span>
                  <div className="w-12 h-12 bg-[#1B3764] rounded-[6px] flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#171A20] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[#41444B] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#171A20] mb-4">
              Four domains. One partner.
            </h2>
            <p className="text-[#5C6280] text-lg max-w-2xl">
              Explore the domains most relevant to your team. Programmes can be
              combined into multi-track learning journeys.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {domains.map((domain) => (
              <DomainCard key={domain.slug} domain={domain} />
            ))}
          </div>
        </div>
      </section>

      <section id="enquire" className="py-16 lg:py-20 bg-[#F7F8FA]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-[#D0D0D0] rounded-lg p-8 lg:p-10">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-[#171A20] mb-3">
                Tell us about your team
              </h2>
              <p className="text-[#5C6280]">
                Share a few details and our Academy team will be in touch within
                two working days to design your engagement.
              </p>
            </div>
            <form
              action="mailto:sales@inflexions.tech"
              method="post"
              encType="text/plain"
              className="space-y-5"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="company"
                    className="block text-sm font-medium text-[#171A20] mb-1.5"
                  >
                    Organisation
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    required
                    className="w-full border border-[#D0D0D0] rounded-[6px] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#BD2E25] focus:border-transparent"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-sm font-medium text-[#171A20] mb-1.5"
                  >
                    Your name
                  </label>
                  <input
                    id="contact-name"
                    name="contactName"
                    type="text"
                    required
                    className="w-full border border-[#D0D0D0] rounded-[6px] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#BD2E25] focus:border-transparent"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[#171A20] mb-1.5"
                  >
                    Work email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full border border-[#D0D0D0] rounded-[6px] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#BD2E25] focus:border-transparent"
                  />
                </div>
                <div>
                  <label
                    htmlFor="team-size"
                    className="block text-sm font-medium text-[#171A20] mb-1.5"
                  >
                    Team size
                  </label>
                  <select
                    id="team-size"
                    name="teamSize"
                    className="w-full border border-[#D0D0D0] rounded-[6px] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#BD2E25] focus:border-transparent bg-white"
                  >
                    <option>1–10</option>
                    <option>11–25</option>
                    <option>26–50</option>
                    <option>51–100</option>
                    <option>100+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#171A20] mb-2">
                  Domains of interest
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {domains.map((domain) => (
                    <label
                      key={domain.slug}
                      className="flex items-center gap-2 text-sm text-[#41444B]"
                    >
                      <input
                        type="checkbox"
                        name="domains"
                        value={domain.slug}
                        className="rounded border-[#D0D0D0] text-[#BD2E25] focus:ring-[#BD2E25]"
                      />
                      {domain.title}
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="format"
                    className="block text-sm font-medium text-[#171A20] mb-1.5"
                  >
                    Preferred format
                  </label>
                  <select
                    id="format"
                    name="format"
                    className="w-full border border-[#D0D0D0] rounded-[6px] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#BD2E25] focus:border-transparent bg-white"
                  >
                    <option>On-site</option>
                    <option>Virtual</option>
                    <option>Hybrid</option>
                    <option>Not sure yet</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="timeline"
                    className="block text-sm font-medium text-[#171A20] mb-1.5"
                  >
                    Timeline
                  </label>
                  <select
                    id="timeline"
                    name="timeline"
                    className="w-full border border-[#D0D0D0] rounded-[6px] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#BD2E25] focus:border-transparent bg-white"
                  >
                    <option>Within 1 month</option>
                    <option>1–3 months</option>
                    <option>3–6 months</option>
                    <option>Exploring only</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-[#171A20] mb-1.5"
                >
                  Anything else we should know?
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  className="w-full border border-[#D0D0D0] rounded-[6px] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#BD2E25] focus:border-transparent resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full md:w-auto bg-[#BD2E25] hover:bg-[#A02923] text-white font-semibold px-8 py-3 rounded-[6px] transition-colors"
              >
                Request Training Proposal
              </button>
            </form>
          </div>
        </div>
      </section>

      <Banner />
    </div>
  );
}
