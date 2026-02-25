const cards = [
  {
    src: "/assets/mid/mid1.png",
    title: "Embrace Agility & Scale:",
    text: "Move faster without breaking things. Our architectures flex with demand so you scale on your terms, not your vendor\u2019s. Whether you\u2019re onboarding a new region, absorbing a spike in traffic, or consolidating after an acquisition, our solutions stretch and contract with you\u2014no rip-and-replace required.",
    rowSpan: "",
  },
  {
    src: "/assets/mid/mid2.png",
    title: "Client-Centric Approach:",
    text: "Your business goals drive every recommendation. No upsells, no generic playbooks\u2014just solutions engineered around your outcomes. We assign a dedicated team that learns your operations inside out, aligns with your internal stakeholders, and measures success by the metrics that matter to your board, not ours.",
    rowSpan: "",
  },
  {
    src: "/assets/mid/mid3.png",
    title: "Build a Rock-Solid Foundation:",
    text: "Uptime isn\u2019t aspirational\u2014it\u2019s guaranteed. We design resilient, redundant infrastructure that keeps critical operations running 24/7/365. From multi-path networking to failover-ready cloud environments, every layer is stress-tested so your teams stay productive and your customers stay connected.",
    rowSpan: "md:row-span-2 lg:h-[530px] md:h-[540px] h-[260px]",
  },
  {
    src: "/assets/mid/mid4.png",
    title: "Unlock Future Potential:",
    text: "Turn today\u2019s data into tomorrow\u2019s competitive edge. We embed intelligence into your stack so every decision is faster and sharper. From predictive analytics dashboards to AI-driven automation, we help you move from reactive reporting to proactive strategy\u2014giving leadership the clarity to act with confidence.",
    rowSpan: "md:col-span-2 h-[259px]",
  },
];

export default function InflexionsAdvantage() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl md:text-3xl font-semibold text-[#171A20] mb-12">
        Why 50+ Enterprises Trust Inflexions
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4">
        {cards.map((item, idx) => (
          <div
            key={idx}
            className={`relative w-full ${
              item.rowSpan || "h-[260px]"
            } rounded-lg overflow-hidden group transition-transform duration-500`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.src}
              alt={item.title}
              loading="lazy"
              className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-110"
            />

            {/* Persistent gradient — always visible so title reads on mobile */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500" />

            {/* Text overlay — always visible on mobile, hover on desktop */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-500">
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="mt-1 text-sm leading-relaxed line-clamp-3 md:line-clamp-none">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
