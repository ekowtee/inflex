import Reveal from "@/motion/Reveal";
import { PartnerLogo } from "./PartnerColumns";

/**
 * The partners behind one pillar — PHASE5_BRIEF.md §4 Task 3.
 *
 * The logos used to sit in 300 x 144 white cards with a drop shadow, a
 * pointer cursor on something that was not a link, and a red tooltip on
 * hover carrying the name the alt text already gave. They now use the same
 * fixed box and greyscale-to-colour treatment as the partner wall, so a
 * vendor logo looks the same everywhere on the site.
 */
const allPartners: Record<string, { src: string; alt: string }[]> = {
  "network-infrastructure": [
    { src: "/assets/partners/cisco.svg", alt: "Cisco" },
    { src: "/assets/partners/huawei.svg", alt: "Huawei" },
    { src: "/assets/partners/hp.svg", alt: "HP" },
    { src: "/assets/partners/dell.svg", alt: "Dell" },
    { src: "/assets/partners/lenovo.svg", alt: "Lenovo" },
  ],
  "data-security": [
    { src: "/assets/partners/sophos.svg", alt: "Sophos" },
    { src: "/assets/partners/eset.svg", alt: "ESET" },
    { src: "/assets/partners/cloudflare.svg", alt: "Cloudflare" },
    { src: "/assets/partners/cisco.svg", alt: "Cisco" },
    { src: "/assets/partners/microsoft.svg", alt: "Microsoft" },
  ],
  "cloud-services": [
    { src: "/assets/partners/microsoft.svg", alt: "Microsoft" },
    { src: "/assets/partners/google.svg", alt: "Google" },
    { src: "/assets/partners/amazon.svg", alt: "Amazon" },
    { src: "/assets/partners/digitalocean.svg", alt: "DigitalOcean" },
    { src: "/assets/partners/redhat.svg", alt: "Red Hat" },
  ],
  "data-centric-solutions": [
    { src: "/assets/partners/google.svg", alt: "Google" },
    { src: "/assets/partners/anthropic.svg", alt: "Anthropic" },
    { src: "/assets/partners/openai.svg", alt: "OpenAI" },
    { src: "/assets/partners/xai.svg", alt: "xAI" },
    { src: "/assets/partners/microsoft.svg", alt: "Microsoft" },
    { src: "/assets/partners/amazon.svg", alt: "Amazon" },
  ],
};

export default function SolutionPartners({ solution }: { solution: string }) {
  const partners = allPartners[solution] || [];
  if (partners.length === 0) return null;

  return (
    <section className="band-ivory w-full py-24 md:py-32" aria-label="Technology partners">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal as="p" className="type-eyebrow text-neutral-500">
          Powered by industry leaders
        </Reveal>
        <Reveal as="h2" className="type-h2 mt-6 text-neutral-900" delay={80}>
          Our Technology Partners
        </Reveal>

        <ul className="mt-12 flex flex-wrap gap-x-4 gap-y-6">
          {partners.map((partner) => (
            <PartnerLogo key={partner.alt} src={partner.src} alt={partner.alt} />
          ))}
        </ul>
      </div>
    </section>
  );
}
