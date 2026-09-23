/**
 * Beat 6 — the partner wall. SCROLL_NARRATIVE.md §6 Beat 6, copy sheet row 6.
 *
 * The rest between the ledger and the ask, and the answer to "what is my
 * risk". Two columns rather than one wall: the point is not how many logos
 * there are, it is that the same integrator holds both the infrastructure
 * vendors and the frontier labs, which few regional firms can show.
 *
 * Column assignment is the narrative's proposal (§6 Beat 6) and is still
 * awaiting the owner's confirmation — see PHASE2_REPORT.md.
 *
 * No carousel, no paging, no autoplay: the component this replaces on the
 * home page cycled nine logos at a time on a five-second timer, which is
 * exactly the behaviour CREATIVE_DIRECTION_3D.md §11 rules out.
 */
import Image from "next/image";
import Reveal from "@/motion/Reveal";

const columns = [
  {
    eyebrow: "Infrastructure partners",
    caption: "Multi-vendor by design. The architecture serves you, not a quota.",
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

export default function PartnerWall() {
  return (
    <section
      id="partner-wall"
      data-beat="6"
      data-register="ivory"
      className="band-ivory w-full py-24 md:py-32"
      aria-label="Partners"
    >
      <div className="mx-auto grid max-w-7xl gap-16 px-4 sm:px-6 md:grid-cols-2 md:gap-12 lg:px-8">
        {columns.map((column) => (
          <div key={column.eyebrow}>
            <Reveal as="p" className="type-eyebrow text-neutral-500">
              {column.eyebrow}
            </Reveal>
            <Reveal as="p" className="type-body mt-4 max-w-[46ch] text-neutral-600" delay={80}>
              {column.caption}
            </Reveal>

            <ul className="mt-10 flex flex-wrap gap-x-4 gap-y-6">
              {column.logos.map((logo) => (
                <li
                  key={logo.alt}
                  /* Fixed box, fill image, object-contain: the SVGs have wildly
                     different aspect ratios and this is the only way they read
                     as one wall. focus-within is there so the treatment holds
                     if a logo ever becomes a link; today none of them is. */
                  className="relative h-16 w-40 opacity-60 grayscale transition-[filter,opacity] duration-[var(--motion-duration-ui)] ease-[var(--motion-ease-out)] hover:opacity-100 hover:grayscale-0 focus-within:opacity-100 focus-within:grayscale-0"
                >
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    fill
                    sizes="160px"
                    className="object-contain"
                    unoptimized
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
