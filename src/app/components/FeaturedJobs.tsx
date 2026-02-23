import Link from "next/link";

const featuredJobs = [
  {
    id: "network-engineer",
    title: "Network Engineer",
    image: "/assets/career/career2.png",
    description:
      "Design, deploy, and manage enterprise LAN, WAN, and SD-WAN solutions for clients across Ghana. Work with Cisco, Huawei, and next-gen wireless platforms at scale.",
    link: "/careers",
  },
  {
    id: "cloud-solutions-architect",
    title: "Cloud Solutions Architect",
    image: "/assets/career/career3.png",
    description:
      "Architect hybrid and multi-cloud environments across AWS, Azure, and Google Cloud. Lead migration strategies that deliver scalability, security, and measurable cost savings.",
    link: "/careers",
  },
  {
    id: "cybersecurity-analyst",
    title: "Cybersecurity Analyst",
    image: "/assets/career/career4.png",
    description:
      "Protect enterprise infrastructure with proactive threat monitoring, incident response, and compliance frameworks. Join our Security Operations Centre and defend what matters most.",
    link: "/careers",
  },
];

export default function FeaturedJobs() {
  return (
    <section className="bg-[#F6F6F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-semibold text-center mb-8">
          Featured Jobs
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {featuredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={job.image}
                alt={job.title}
                className="w-full h-48 object-cover"
                loading="lazy"
              />
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                <p className="text-[#41444B] flex-1">{job.description}</p>
                <Link
                  href={job.link}
                  className="mt-4 text-[#262626] hover:text-[#BD2E25] underline"
                >
                  See Opportunities
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
