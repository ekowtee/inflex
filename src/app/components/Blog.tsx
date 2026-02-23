const blog = [
  {
    id: 1,
    image: "/assets/blog/blog1.png",
    title: "Responsive Redesign: Boosting User Engagement by 40%",
    description:
      "How a mobile-first overhaul drove a 40% increase in session duration and 20% uplift in conversions.",
    link: "#",
  },
  {
    id: 2,
    image: "/assets/blog/blog2.png",
    title: "Personalized Content Engine: Driving ROI with Tailored Experiences",
    description:
      "Leveraging edge-powered personalization to boost session duration by 25% and ad revenue by 12%.",
    link: "#",
  },
  {
    id: 3,
    image: "/assets/blog/blog3.png",
    title: "Strengthening Cybersecurity in Remote Work Environments",
    description:
      "Explore essential strategies and tools to secure your remote workforce, protect sensitive data, and maintain compliance in today\u2019s distributed workplace.",
    link: "#",
  },
];

export default function Blog() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">
      <h2 className="text-xl sm:text-2xl font-medium text-[#262626] text-center mb-12">
        Recent Case studies
      </h2>

      <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {blog.map(({ id, image, title, description, link }) => (
          <div
            key={id}
            className="bg-[#F6F6F6] rounded-2xl shadow-md overflow-hidden flex flex-col"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={title}
              className="w-full h-40 md:h-48 object-cover rounded-t-2xl"
              loading="lazy"
            />
            <div className="py-6 px-4 flex-1 flex flex-col">
              <h3 className="text-base md:text-lg font-medium text-[#262626] mb-2">
                {title}
              </h3>
              <p className="text-sm md:text-base text-[#41444B] mb-4 flex-1 leading-relaxed">
                {description}
              </p>
              <a
                href={link}
                className="mt-auto inline-flex items-center text-[#BD2E25] font-medium hover:underline"
              >
                READ MORE <span className="ml-1">&rarr;</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
