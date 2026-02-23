import Image from "next/image";
import React from "react";

// Interface for star rating component props
interface StarRatingProps {
  rating: number; // Rating out of 5
}

// Simple Star Rating component (replace with a more robust one if needed)
const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const totalStars = 5;
  return (
    <div className="flex items-center">
      {[...Array(totalStars)].map((_, index) => {
        const starNumber = index + 1;
        return (
          <svg
            key={starNumber}
            className={`w-5 h-5 ${
              starNumber <= rating ? "text-yellow-400" : "text-[#A6A6A6]"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
        );
      })}
    </div>
  );
};

// Interface for individual testimonial data
interface Testimonial {
  id: string | number;
  quote: string;
  rating: number; // e.g., 4 or 5
  name: string;
  title: string; // e.g., "CEO, Company Name"
  imagePath?: string; // Optional headshot path (relative to /public)
}

// Interface for the section props
interface TestimonialSectionProps {
  title?: string;
  subtitle?: string;
  testimonials: Testimonial[];
  bgColor?: string;
}

// The main section component
export default function TestimonialSection({
  title = "Our Clients Say", // Default title from PRD
  subtitle,
  testimonials = [],
  bgColor = "bg-[#F6F6F6]", // Default background
}: TestimonialSectionProps) {
  if (testimonials.length === 0) {
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

        {/* Grid for testimonials */}
        {/* Adjust columns based on the number of testimonials to show nicely */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Sub-component for individual testimonial cards
function TestimonialCard({
  quote,
  rating,
  name,
  title,
  imagePath,
}: Testimonial) {
  return (
    // PRD 3.2.6: Card-based layout
    <div className="flex flex-col rounded-lg bg-white p-6 shadow-lg h-full">
      {/* Rating */}
      <div className="mb-4">
        <StarRating rating={rating} />
      </div>

      {/* Quote */}
      <blockquote className="flex-grow mb-6">
        <p className="text-base text-[#333333] italic before:content-['\201C'] after:content-['\201D']">
          {quote}
        </p>
      </blockquote>

      {/* Author Info */}
      <footer className="flex items-center mt-auto pt-4 border-t border-[#E6E6E6]">
        {imagePath ? (
          <Image
            className="h-12 w-12 rounded-full mr-4 object-cover"
            src={imagePath}
            alt={`Headshot of ${name}`}
            width={48}
            height={48}
          />
        ) : (
          // Placeholder if no image
          <div className="h-12 w-12 rounded-full bg-[#D0D0D0] mr-4 flex items-center justify-center text-[#8C8C8C]">
            <span className="text-xl font-semibold">{name.charAt(0)}</span>
          </div>
        )}
        <div>
          <p className="text-sm font-semibold text-[#171A20]">{name}</p>
          <p className="text-sm text-[#5C6280]">{title}</p>
        </div>
      </footer>
    </div>
  );
}
