import Link from "next/link";

// Interface for individual solution data
interface Solution {
  id: string | number;
  title: string;
  description: string;
  icon?: string; // Using simple text/emoji icons for now
  link: string;
}

// Interface for the grid component props
interface SolutionsGridProps {
  title?: string;
  subtitle?: string;
  solutions: Solution[];
  bgColor?: string;
}

// The grid component itself
export default function SolutionsGrid({
  title = "Integrated IT Solutions", // Default title
  subtitle = "Comprehensive IT solutions tailored to power your business engine.", // Default subtitle
  solutions = [], // Default to empty array
  bgColor = "bg-[#F6F6F6]", // Default light gray background
}: SolutionsGridProps) {
  if (solutions.length === 0) {
    return null; // Don't render if no solutions are provided
  }

  return (
    <section className={`py-16 md:py-24 ${bgColor}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          {title && (
            <h2 className="text-3xl font-bold tracking-tight text-[#171A20] sm:text-4xl lg:text-5xl mb-4">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-xl text-[#41444B] max-w-3xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Grid Layout */}
        {/* Adjust grid columns for different screen sizes */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {solutions.map((solution) => (
            <SolutionCard key={solution.id} {...solution} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Sub-component for individual solution cards
function SolutionCard({ title, description, icon, link }: Solution) {
  return (
    // PRD 3.2.4: Distinctive red and white color scheme
    // Interpreted as white card with red accents on hover/interaction
    <Link
      href={link}
      className="group block rounded-lg bg-white p-6 shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
    >
      {/* Icon Container */}
      {icon && (
        <div className="mb-5 inline-block h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {/* Center the icon - might need adjustment based on actual icon/SVG size */}
          <span className="flex h-full w-full items-center justify-center text-3xl">
            {icon}
          </span>
        </div>
      )}

      {/* Text Content */}
      <div>
        <h3 className="text-lg font-semibold text-[#171A20] mb-2 group-hover:text-primary transition-colors duration-200">
          {title}
        </h3>
        <p className="text-sm text-[#41444B] line-clamp-3">
          {" "}
          {/* Requires line-clamp plugin */}
          {description}
        </p>
      </div>

      {/* Learn More Indicator (optional, appears on hover maybe?) - Current is simple text */}
      <div className="mt-4">
        <span className="inline-flex items-center text-sm font-medium text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          Learn more
          <svg
            className="ml-1.5 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
            />
          </svg>
        </span>
      </div>
    </Link>
  );
}
