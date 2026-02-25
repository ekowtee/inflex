import "./leaders.css";

const leaders = [
  {
    name: "Ekow M. Thompson",
    role: "Director, Business Development",
    image: "/assets/about/ekowmain1.jpeg",
    bio: "Ekow Thompson is a visionary business leader with over 18 years of executive experience in technology, media, and telecommunications across Africa. As Managing Director of Inflexions, he brings a proven track record of driving digital transformation and substantial growth. His strategic leadership was instrumental in transforming Interactive Digital into one of Ghana\u2019s most respected digital agencies (achieving 750% revenue growth) and co-founding Blu Telecommunications, Ghana\u2019s innovative 4G network. Ekow excels at aligning technological capabilities with business objectives, ensuring clients receive solutions that create lasting competitive advantage. He holds a Bachelor\u2019s degree in Electrical / Electronic Engineering and is dedicated to continuous learning in leadership and digital innovation.",
  },
  {
    name: "Dr.Jade Appiah-Lartey",
    role: "Director \u2013 Marketing",
    image: "/assets/about/jade.jpeg",
    bio: "Dr. Jade Appiah-Lartey is a results-driven executive spearheading Inflexions\u2019 strategic growth initiatives, brand development, and digital transformation efforts. Leading the company\u2019s revitalization and strategic relaunch, she brings over 15 years of experience from the technology, telecommunications, and digital marketing sectors. Dr. Appiah-Lartey excels at identifying high-value market opportunities, crafting effective go-to-market strategies, and building strategic partnerships. Her background includes roles as Brand Strategy Consultant at Interactive Digital, Customer Experience Design Manager at Millicom, and Product Manager, providing her with multifaceted expertise to design customer-centric technology solutions and maximize revenue potential for Inflexions and its clients.",
  },
  {
    name: "Anthony Getor",
    role: "Director, Business Solutions",
    image: "/assets/about/anthonymain.jpg",
    bio: "Anthony Getor is a technology leader delivering innovative solutions that fuel business growth, leveraging over 15 years of experience in digital transformation across Africa. His expertise spans information security, enterprise architecture, cloud infrastructure (design, migration, optimization), and telecommunications. He holds an M.Sc. in Cyber Security & Digital Forensics (KNUST), an M.Sc. in Information Technology (Nottingham), and industry certifications including CHFI and CEH.",
  },
];

export default function Leaders() {
  return (
    <div className="overflow-hidden">
      <div className="contain">
        {leaders.map((leader) => (
          <div key={leader.name} className="box">
            <div className="imgBx">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={leader.image} alt={leader.name} loading="lazy" />
            </div>
            <div className="content">
              <h3 className="text-[16px] font-semibold text-[#1B3764]">
                {leader.name}
              </h3>
              <p className="text-[#41444B] text-[14px]">{leader.role}</p>
              <div className="flex space-x-4 mt-4">
                <a
                  href="#"
                  aria-label="Facebook"
                  className="w-10 h-10 flex items-center justify-center border border-[#BD2E25] text-[#BD2E25] rounded-full hover:bg-[#BD2E25] hover:text-white transition"
                >
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
                <a
                  href="#"
                  aria-label="Instagram"
                  className="w-10 h-10 flex items-center justify-center border border-[#BD2E25] text-[#BD2E25] rounded-full hover:bg-[#BD2E25] hover:text-white transition"
                >
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" fill="none" stroke="currentColor" strokeWidth="2"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="currentColor" strokeWidth="2"/></svg>
                </a>
                <a
                  href="#"
                  aria-label="Twitter"
                  className="w-10 h-10 flex items-center justify-center border border-[#BD2E25] text-[#BD2E25] rounded-full hover:bg-[#BD2E25] hover:text-white transition"
                >
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                </a>
              </div>
              <span className="text-[12px] text-[#333333] text-justify mt-2">
                {leader.bio}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
