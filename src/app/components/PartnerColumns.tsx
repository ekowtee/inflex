import Image from "next/image";
import Reveal from "@/motion/Reveal";

/**
 * The two partner columns — extracted from home/PartnerWall.tsx so that
 * /solutions can show the same wall (PHASE5_BRIEF.md §4 Task 3).
 *
 * Two columns rather than one wall: the point is not how many logos there
 * are, it is that the same integrator holds both the infrastructure vendors
 * and the frontier labs, which few regional firms can show. That argument
 * only works if both columns are visible at once, which is why there is no
 * carousel, no paging and no autoplay here — and why the component this
 * replaces on /solutions, MainPartners, could not be re-set in place.
 *
 * The data and the markup are the home page's, unchanged. PartnerWall keeps
 * its section, its data-beat and its band; this is only what was inside.
 */

export const partnerColumns = [
  {
    eyebrow: "Infrastructure partners",
    caption:
      "Multi-vendor by design. Fourteen infrastructure partners, and the choice is always the one that fits.",
    logos: [
      { src: "/assets/partners/cisco.svg", alt: "Cisco" },
      { src: "/assets/partners/huawei.svg", alt: "Huawei" },
      { src: "/assets/partners/hp.svg", alt: "HP" },
      { src: "/assets/partners/dell.svg", alt: "Dell" },
      { src: "/assets/partners/lenovo.svg", alt: "Lenovo" },
      { src: "/assets/partners/sophos.svg", alt: "Sophos" },
      { src: "/assets/partners/eset.svg", alt: "ESET" },
      { src: "/assets/partners/cloudflare.svg", alt: "Cloudflare" },
      { src: "/assets/partners/amazon.svg", alt: "Amazon" },
      { src: "/assets/partners/digitalocean.svg", alt: "DigitalOcean" },
      { src: "/assets/partners/redhat.svg", alt: "Red Hat" },
      { src: "/assets/partners/avaya.svg", alt: "Avaya" },
      { src: "/assets/partners/hikvision.svg", alt: "Hikvision" },
      { src: "/assets/partners/schneider.svg", alt: "APC / Schneider Electric" },
    ],
  },
  {
    eyebrow: "Intelligence partners",
    caption:
      "Frontier AI labs alongside the infrastructure vendors. Few regional integrators can show both columns.",
    logos: [
      { src: "/assets/partners/anthropic.svg", alt: "Anthropic" },
      { src: "/assets/partners/openai.svg", alt: "OpenAI" },
      { src: "/assets/partners/google.svg", alt: "Google" },
      { src: "/assets/partners/xai.svg", alt: "xAI" },
      { src: "/assets/partners/microsoft.svg", alt: "Microsoft" },
    ],
  },
] as const;

/** One 160 x 64 box. Also used on its own by SolutionPartners. */
export function PartnerLogo({ src, alt }: { src: string; alt: string }) {
  return (
    <li
      /* Fixed box, fill image, object-contain: the SVGs have wildly
         different aspect ratios and this is the only way they read as one
         wall. focus-within is there so the treatment holds if a logo ever
         becomes a link; today none of them is. */
      className="relative h-16 w-40 opacity-60 grayscale transition-[filter,opacity] duration-[var(--motion-duration-ui)] ease-[var(--motion-ease-out)] hover:opacity-100 hover:grayscale-0 focus-within:opacity-100 focus-within:grayscale-0"
    >
      <Image src={src} alt={alt} fill sizes="160px" className="object-contain" unoptimized />
    </li>
  );
}

export default function PartnerColumns() {
  return (
    <div className="mx-auto grid max-w-7xl gap-16 px-4 sm:px-6 md:grid-cols-2 md:gap-12 lg:px-8">
      {partnerColumns.map((column) => (
        <div key={column.eyebrow}>
          <Reveal as="p" className="type-eyebrow text-neutral-500">
            {column.eyebrow}
          </Reveal>
          <Reveal as="p" className="type-body mt-4 max-w-[46ch] text-neutral-600" delay={80}>
            {column.caption}
          </Reveal>

          <ul className="mt-10 flex flex-wrap gap-x-4 gap-y-6">
            {column.logos.map((logo) => (
              <PartnerLogo key={logo.alt} src={logo.src} alt={logo.alt} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
