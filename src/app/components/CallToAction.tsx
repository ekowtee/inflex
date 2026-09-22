import Link from "next/link";
import Reveal from "@/motion/Reveal";

export default function CallToAction() {
  return (
    <section className="relative w-full min-h-[300px] md:h-[400px] overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/hero/ban1.png"
        alt=""
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center px-4 max-w-2xl">
          <Reveal as="h2" className="text-2xl md:text-4xl font-bold text-white mb-4">
            Stop Patching. Start Performing.
          </Reveal>

          <Reveal as="p" delay={100} className="text-white/90 text-base sm:text-lg mb-6 sm:mb-8">
            Book a 30-minute architecture review. With a Solutions
            Architect, not a salesperson. No pitch. You leave with a written
            view of what to fix first.
          </Reveal>

          <Reveal as="div" delay={200}>
            <Link
              href="/contact"
              className="inline-block bg-white hover:bg-gray-100 text-[#BD2E25] font-semibold px-6 sm:px-8 py-3 rounded-[6px] transition-colors duration-300"
            >
              Book the review
            </Link>
            <p className="mt-4 text-xs sm:text-sm text-white/70 tracking-wide">
              No cost. No obligation. One conversation.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
