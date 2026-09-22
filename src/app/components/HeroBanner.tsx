import Link from "next/link";
import Reveal from "@/motion/Reveal";
import Image from "next/image";

export default function HeroBanner() {
  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
      <Image
        src="/assets/hero/herobanner2.webp"
        alt=""
        width={1792}
        height={576}
        className="w-full h-full object-cover"
        sizes="100vw"
        priority
      />
      <div className="absolute inset-0 bg-black/30" />

      <div className="absolute inset-0 flex items-end pb-10 md:pb-28 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="md:w-[800px] flex flex-col justify-center items-start">
            <Reveal as="h1" className="text-2xl md:text-[32px] lg:text-4xl font-bold text-white leading-[1.2] mb-4">
              Engineered for the enterprises that can&apos;t afford to guess.
            </Reveal>

            <Reveal as="p" delay={100} className="text-sm md:text-base text-white/90 leading-relaxed mb-6">
              Network, cloud, security and data&mdash;engineered as one
              system, run by the team that built a national LTE core and two
              Tier III data centres.
            </Reveal>

            <p className="text-sm text-white/80 leading-relaxed mb-6">
              Book a 30-minute architecture review. With a Solutions
              Architect, not a salesperson. No pitch.
            </p>

            <Reveal as="div" delay={300} className="w-full md:w-[254px] h-[60px] bg-[#BD2E25] rounded-[6px] flex items-center justify-center">
              <Link href="/contact" className="text-white font-semibold">
                Book the review
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
