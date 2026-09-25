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
    role: "Executive Director",
    image: "/assets/about/ekowmain1.webp",
    bio: "Ekow Thompson is Executive Director of Inflexions. He has spent twenty years building, running and turning around technology businesses across Africa. He co-founded Blu Telecommunications and, as Managing Director, took a greenfield 4G LTE operator from spectrum and licensing to commercial pilot. Before that he was Chief Technology Officer of iWayAfrica across eight African markets, and Managing Director of Africa Online Ghana, which he returned to profitability within a year. He also leads Interactive Digital, the full-service agency within Ninani Group, which he has taken since 2018 into the front rank of Ghana’s firms in brand, performance and digital products. An electrical engineer by training from KNUST, he completed MIT’s programme in Artificial Intelligence, Data Science and Machine Learning in 2024.",
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
