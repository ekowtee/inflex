import React from "react"; // Import React if using JSX elements directly as icons

// Interface for individual card data
interface CardItem {
  id: string | number;
  title: string;
  description: string;
  icon?: React.ReactNode; // Can be an emoji, text, or an SVG/icon component
}

// Interface for the section props
interface MultiCardSectionProps {
  title: string;
  subtitle?: string;
  cards: CardItem[];
  bgColor?: string;
}

export default function MultiCardSection({
  title,
  subtitle,
  cards = [],
  bgColor = "bg-blue-50", // Example alternating background
}: MultiCardSectionProps) {
  if (cards.length === 0) {
    return null;
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

        {/* Grid for the cards */}
        {/* Adjust columns based on the desired layout (e.g., 3 columns on larger screens) */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Card key={card.id} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Sub-component for individual cards
function Card({ title, description, icon }: CardItem) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-lg">
      {/* Icon */}
      {icon && (
        <div className="mb-5 inline-block h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <span className="flex h-full w-full items-center justify-center text-3xl">
            {icon}
          </span>
        </div>
      )}

      {/* Text Content */}
      <div>
        <h3 className="text-lg font-semibold text-[#171A20] mb-2">{title}</h3>
        <p className="text-sm text-[#41444B]">{description}</p>
      </div>
    </div>
  );
}
