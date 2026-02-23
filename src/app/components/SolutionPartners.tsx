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
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-[#5C6280] text-sm font-medium uppercase tracking-wider">
            Powered by Industry Leaders
          </span>
          <h3 className="text-2xl font-semibold text-[#171A20] mt-2">
            Our Technology Partners
          </h3>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6">
          {partners.map((partner) => (
            <div
              key={partner.alt}
              title={partner.alt}
              className="relative group bg-white h-[144px] w-[300px] flex items-center justify-center rounded-[10px] shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-300"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={partner.src}
                alt={partner.alt}
                className="w-[180px] h-[72px] object-contain"
                loading="lazy"
              />
              <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#BD2E25] text-white text-xs font-medium px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-[#BD2E25]">
                {partner.alt}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
