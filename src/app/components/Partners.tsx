"use client";

import "./partners.css";

const logos = [
  { src: "/assets/clients/part1.svg", alt: "NOVA" },
  { src: "/assets/clients/part2.png", alt: "Belle Vista" },
  { src: "/assets/clients/part3.png", alt: "Niobe" },
  { src: "/assets/clients/part4.png", alt: "Rabito Clinic" },
  { src: "/assets/clients/part5.png", alt: "DSTRKT4" },
  { src: "/assets/clients/part6.png", alt: "Acme Group" },
  { src: "/assets/clients/part7.png", alt: "Zenith Corp" },
  { src: "/assets/clients/part8.png", alt: "Labianca" },
];

export default function Partners() {
  return (
    <div className="overflow-hidden w-full py-6 md:py-10 px-4">
      <div className="flex items-center justify-center mb-4">
        <h1 className="text-[32px] font-semibold leading-[38px]">Our Clients</h1>
      </div>
      <div className="py-5">
        <div className="partners-wrapper">
          {logos.map((logo, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={logo.alt}
              src={logo.src}
              alt={logo.alt}
              className={`partners-item partners-item${i + 1}`}
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
