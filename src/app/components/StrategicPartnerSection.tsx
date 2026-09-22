import Link from "next/link";
import { CheckCircle } from "lucide-react";
import Reveal from "@/motion/Reveal";

export default function StrategicPartnerSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-col lg:flex-row w-full lg:h-[554px]">
        <div className="flex-1 md:py-10 lg:py-14">
          <Reveal as="h2" className="lg:w-[500px] lg:h-[144px] lg:text-[36px] md:text-[28px] text-[24px] lg:leading-tight font-semibold mb-2 py-2">
            From Legacy Burden to Competitive Edge
          </Reveal>
          <div className="w-full md:w-[600px] lg:w-[500px]">
            <Reveal as="span" delay={200} className="text-[18px] w-full lg:w-[300px] leading-[30px]">
              Legacy infrastructure drains budget and blocks innovation.
              Inflexions replaces complexity with clarity&mdash;AI-driven networks,
              secure cloud, and machine learning-powered data platforms built
              to scale with your ambition. No vendor lock-in. No surprise costs.
            </Reveal>
          </div>

          <Reveal as="div" delay={300} className="bg-[#BD2E25] w-[201.32px] h-[53px] mt-6 rounded-[6px] flex items-center justify-center">
            <Link href="/solutions" className="text-white font-medium">
              See Our Approach
            </Link>
          </Reveal>
        </div>

        <div className="relative flex flex-col flex-1 items-center justify-center mt-2 md:mt-0 lg:mt-0">
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/bgsvg/Background.png"
              alt=""
              className="w-full max-w-[419px] h-full object-contain"
              loading="lazy"
            />
            <div className="absolute top-[calc(12.5%-10px)] bottom-[calc(12.5%+15px+44px)] left-[calc(0.5%-1px)] right-[calc(0.5%-2px)] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/bgsvg/image.png"
                alt="Professional at work"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Floating badges */}
            <Reveal as="div" delay={400} className="absolute top-[107px] left-[-60px] hidden md:flex gap-2 items-center justify-center w-[262px] py-[4px] border border-[#BD2E25] rounded-[49px] bg-white">
              <CheckCircle className="text-[#BD2E25]" />
              <span className="text-[16px] leading-[30px] text-[#1B3764]">
                Data Intelligence
              </span>
            </Reveal>

            <Reveal as="div" delay={500} className="absolute top-[162px] md:top-[182px] lg:top-[182px] left-[-90px] hidden md:flex gap-2 items-center justify-center w-[262px] py-[4px] border border-[#BD2E25] rounded-[49px] bg-white">
              <CheckCircle className="text-[#BD2E25]" />
              <span className="text-[16px] leading-[30px] text-[#1B3764]">
                Network Infrastructure
              </span>
            </Reveal>

            <Reveal as="div" delay={600} className="absolute top-[222px] md:top-[257px] lg:top-[257px] left-[-60px] hidden md:flex gap-2 items-center justify-center w-[262px] py-[4px] border border-[#BD2E25] rounded-[49px] bg-white">
              <CheckCircle className="text-[#BD2E25]" />
              <span className="text-[16px] leading-[30px] text-[#1B3764]">
                Cloud Services
              </span>
            </Reveal>

            <Reveal as="div" delay={700} className="absolute top-[282px] md:top-[332px] lg:top-[332px] left-[-90px] hidden md:flex gap-2 items-center justify-center w-[262px] py-[4px] border border-[#BD2E25] rounded-[49px] bg-white">
              <CheckCircle className="text-[#BD2E25]" />
              <span className="text-[16px] leading-[30px] text-[#1B3764]">
                Security &amp; Support
              </span>
            </Reveal>
          </div>

          {/* Mobile pills — visible below image on small screens */}
          <div className="flex flex-wrap gap-2 mt-4 md:hidden justify-center">
            {["Data Intelligence", "Network Infrastructure", "Cloud Services", "Security & Support"].map((label) => (
              <div key={label} className="flex gap-2 items-center px-4 py-2 border border-[#BD2E25] rounded-full bg-white">
                <CheckCircle className="text-[#BD2E25] w-4 h-4" />
                <span className="text-[14px] text-[#1B3764]">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
