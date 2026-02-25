"use client";

import { useState, useRef } from "react";
import Slider from "react-slick";
import { Quote } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const testimonials = [
  {
    id: 1,
    name: "Ama Serwaa",
    position: "Chief Marketing Officer",
    company: "Zenith Retail",
    content:
      "Inflexions I.T. Services transformed our marketing operations with a streamlined CRM integration—reducing campaign launch times by 40%. Their team's strategic understanding of both technology and business needs truly sets them apart.",
    image: "/assets/Testimonials/test1.png",
  },
  {
    id: 2,
    name: "John Kwame Boadu",
    position: "Operations Manager",
    company: "GreenLeaf Logistics",
    content:
      "Thanks to Inflexions' bespoke systems-integration approach, we now have real-time visibility across our supply chain. Inventory errors have dropped by 65%, and our on-time delivery rate is at an all-time high.",
    image: "/assets/Testimonials/test2.png",
  },
  {
    id: 3,
    name: "Sarah Nana Adjoa",
    position: "CEO",
    company: "AquaPure Solutions",
    content:
      "From initial consultation to ongoing support, Inflexions delivered cost-effective IT solutions that scale with our business. Their agile responsiveness means we can confidently pursue growth without worrying about tech bottlenecks.",
    image: "/assets/Testimonials/test3.png",
  },
];

export default function TestimonialSlider() {
  const [activeSlide, setActiveSlide] = useState(0);
  const sliderRef = useRef<Slider>(null);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: (_current: number, next: number) => setActiveSlide(next),
    autoplay: true,
    autoplaySpeed: 5000,
  };

  return (
    <div className="py-10">
      <div className="max-w-7xl lg:h-[550px] h-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-20 gap-4 items-center">
          {/* Image column */}
          <div className="col-span-12 md:col-span-4 flex items-center justify-center lg:items-end lg:justify-end lg:h-[500px]">
            <div className="relative w-[150px] h-[150px] border-white border-8 rounded-full lg:w-full lg:h-full lg:rounded-lg overflow-hidden shadow-lg mt-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={testimonials[activeSlide].image}
                alt="Client testimonial"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* Testimonial content */}
          <div className="col-span-12 md:col-span-7 lg:mr-[6px]">
            <div className="mb-12 text-center lg:text-left">
              <h3 className="text-[#BD2E25] font-semibold tracking-wide uppercase mb-2">
                CLIENT RESULTS
              </h3>
              <h2 className="text-[24px] sm:text-[28px] md:text-[32px] font-semibold text-[#16213E] leading-snug">
                Measurable Impact, Every Engagement
              </h2>
            </div>
            <div aria-live="polite">
              <Slider ref={sliderRef} {...settings}>
                {testimonials.map((t) => (
                  <div key={t.id} className="outline-none">
                    <div className="flex flex-col items-center md:items-start">
                      <div className="bg-[#BD2E25] w-16 h-16 flex items-center justify-center mb-6">
                        <Quote className="text-white w-10 h-10" />
                      </div>
                      <p className="text-[#333333] text-lg leading-relaxed mb-8 text-center md:text-left">
                        {t.content}
                      </p>
                      <div className="text-center md:text-left">
                        <h4 className="text-xl font-bold text-[#262626]">
                          {t.name}
                        </h4>
                        <p className="text-[#BD2E25]">
                          {t.position}, {t.company}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>

            {/* Custom dots */}
            <div className="flex mt-8 space-x-2 justify-center md:justify-start">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => sliderRef.current?.slickGoTo(idx)}
                  className={`transition-colors duration-300 rounded-full ${
                    activeSlide === idx
                      ? "bg-[#BD2E25] w-5 h-5 relative -top-1"
                      : "bg-[#F9C4C1] w-3 h-3"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
