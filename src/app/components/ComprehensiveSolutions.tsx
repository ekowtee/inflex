import SwapGrid from "./SwapGrid";
import Image from "next/image";

export default function ComprehensiveSolutions() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-col lg:flex-row lg:h-[800px] h-full w-full gap-x-10">
        <div className="flex-1 py-2 md:py-4 lg:py-20">
          <Image
            src="/assets/sub/subtract.webp"
            alt=""
            width={815}
            height={826}
            className="w-full lg:h-[700px] h-auto object-cover object-center"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>
        <div className="flex-1 py-4 md:py-10 lg:py-20">
          <div className="flex flex-col gap-8 w-full lg:h-[700px]">
            <h2 className="lg:w-[500px] lg:h-[93px] lg:text-[32px] md:text-[32px] text-[20px] lg:leading-[40px] font-semibold text-[#265982]">
              Four Pillars. Zero Gaps.
            </h2>
            <div className="w-full lg:space-y-4 space-y-4">
              <SwapGrid />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
