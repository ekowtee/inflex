import Link from "next/link";
import Image from "next/image";

export default function Banner() {
  return (
    <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden">
      <Image
        src="/assets/about/vidmin.webp"
        alt="Cloud technology interface"
        width={1920}
        height={412}
        className="w-full h-full object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-[#1B3764]/80" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center px-4 max-w-2xl">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your IT?
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Let&apos;s architect a solution that moves your business forward.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-[#BD2E25] hover:bg-[#A02923] text-white font-semibold px-8 py-3 rounded-[6px] transition-colors duration-300"
          >
            Start the Conversation
          </Link>
        </div>
      </div>
    </div>
  );
}
