import Link from "next/link";

interface FeatureProps {
  title: string;
  description: string;
  icon?: string;
  imageSrc?: string;
  imageAlt?: string;
  ctaText?: string;
  ctaLink?: string;
  bgColor?: string;
  textColor?: string;
  direction?: "left" | "right";
}

export default function FeatureSection({
  title,
  description,
  icon,
  imageSrc,
  imageAlt = "Feature Image",
  ctaText,
  ctaLink,
  bgColor = "bg-white",
  textColor = "text-[#262626]",
  direction = "left",
}: FeatureProps) {
  // Determine text color based on background for better contrast
  const effectiveTextColor =
    bgColor === "bg-[#F6F6F6]" ? "text-[#1B3764]" : textColor;

  return (
    <section className={`py-16 md:py-24 ${bgColor}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex flex-col ${
            direction === "right" ? "md:flex-row-reverse" : "md:flex-row"
          } items-center gap-12 md:gap-16 lg:gap-20`}
        >
          {/* Image/Icon Section */}
          <div className="w-full md:w-5/12 lg:w-1/2">
            {imageSrc ? (
              <div className="relative aspect-w-4 aspect-h-3 rounded-lg overflow-hidden shadow-xl">
                <div className="bg-[#D0D0D0] h-full w-full flex items-center justify-center">
                  <span className="text-[#8C8C8C] italic">
                    Image: {imageAlt}
                  </span>
                </div>
              </div>
            ) : icon ? (
              <div className="w-full flex items-center justify-center aspect-square bg-primary/10 rounded-lg">
                <span className="text-6xl text-primary">{icon}</span>
              </div>
            ) : (
              <div className="aspect-w-4 aspect-h-3 rounded-lg bg-[#E6E6E6] flex items-center justify-center">
                <span className="text-[#8C8C8C] italic">No Visual</span>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className={`w-full md:w-7/12 lg:w-1/2 ${effectiveTextColor}`}>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-6">
              {title}
            </h2>
            <div className="prose prose-lg max-w-none mb-8 text-inherit">
              <p>{description}</p>
            </div>

            {ctaText && ctaLink && (
              <Link
                href={ctaLink}
                className="inline-block px-6 py-3 text-base font-semibold text-white bg-primary rounded-full shadow-md hover:bg-[#A02923] transition duration-150 ease-in-out transform hover:-translate-y-1"
              >
                {ctaText}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
