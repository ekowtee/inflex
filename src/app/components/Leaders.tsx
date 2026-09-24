import Image from "next/image";

/**
 * The three directors — PHASE5_BRIEF.md §4 Task 6.
 *
 * Was a `leaders.css` card deck: fixed-height boxes with a radius and a
 * shadow, a portrait cropped into them, and three social icons in red
 * circles under every name. The icons linked to `href="#"` — three dead
 * links per director, nine on the page.
 *
 * Now: the portrait, the name, the role, the biography. Graded like every
 * other photograph on the site, on a hairline, with nothing around it.
 */

const leaders = [
  {
    name: "Ekow M. Thompson",
    role: "Director, Business Development",
    image: "/assets/about/ekowmain1.webp",
    bio: "Ekow Thompson is a visionary business leader with over 18 years of executive experience in technology, media, and telecommunications across Africa. As Managing Director of Inflexions, he brings a proven track record of driving digital transformation and substantial growth. His strategic leadership was instrumental in transforming Interactive Digital into one of Ghana’s most respected digital agencies (achieving 750% revenue growth) and co-founding Blu Telecommunications, Ghana’s innovative 4G network. Ekow excels at aligning technological capabilities with business objectives, ensuring clients receive solutions that create lasting competitive advantage. He holds a Bachelor’s degree in Electrical / Electronic Engineering and is dedicated to continuous learning in leadership and digital innovation.",
  },
  {
    name: "Anthony Getor",
    role: "Director, Business Solutions",
    image: "/assets/about/anthonymain.webp",
    bio: "Anthony Getor is a technology leader delivering innovative solutions that fuel business growth, leveraging over 15 years of experience in digital transformation across Africa. His expertise spans information security, enterprise architecture, cloud infrastructure (design, migration, optimization), and telecommunications. He is pursuing an MSc. in Cybersecurity and Digital Forensics (KNUST), an M.Sc. in Information Technology (Nottingham), and industry certifications including CHFI and CEH.",
  },
  {
    name: "Dr.Jade Appiah-Lartey",
    role: "Director – Marketing",
    image: "/assets/about/jade.webp",
    bio: "Dr. Jade Appiah-Lartey is a results-driven executive spearheading Inflexions’ strategic growth initiatives, brand development, and digital transformation efforts. Leading the company’s revitalization and strategic relaunch, she brings over 15 years of experience from the technology, telecommunications, and digital marketing sectors. Dr. Appiah-Lartey excels at identifying high-value market opportunities, crafting effective go-to-market strategies, and building strategic partnerships. Her background includes roles as Brand Strategy Consultant at Interactive Digital, Customer Experience Design Manager at Millicom, and Product Manager, providing her with multifaceted expertise to design customer-centric technology solutions and maximize revenue potential for Inflexions and its clients.",
  },
] as const;

export default function Leaders() {
  return (
    <div className="grid gap-x-12 gap-y-16 md:grid-cols-3">
      {leaders.map((leader) => (
        <article key={leader.name}>
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src={leader.image}
              alt={leader.name}
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              className="photo-grade object-cover"
            />
          </div>
          <h3 className="type-h3 mt-8 border-t border-neutral-200 pt-8 text-neutral-900">
            {leader.name}
          </h3>
          <p className="type-telemetry mt-3 text-neutral-500">{leader.role}</p>
          <p className="type-body mt-5 text-neutral-600">{leader.bio}</p>
        </article>
      ))}
    </div>
  );
}
