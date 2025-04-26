/* eslint-disable no-unused-vars */
import React, { useState, useRef } from "react"
import Slider from "react-slick"
import { Quote } from "lucide-react"
import Test1 from "../assets/Testimonials/test1.png"

// remember to install:
// npm install react-slick slick-carousel lucide-react
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

export default function TestimonialSlider() {
    const [activeSlide, setActiveSlide] = useState(0)
    const sliderRef = useRef(null)

    const testimonials = [
        {
            id: 1,
            name: "Katy Grey",
            position: "CEO",
            company: "Grey Industries",
            content:
                "Suspendisse tortor enim, varius et porttitor sit amet, posuere vitae massa. Proin ac quam eu erat semper sagittis in vitae elit. Nam neque erat, semper vel ultrices in, finibus eu magna. Pellentesque habitant morbi tristique",
            image: Test1,
        },
        {
            id: 2,
            name: "John Smith",
            position: "CTO",
            company: "Tech Solutions",
            content:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl.",
            image:
                Test1,
        },
        {
            id: 3,
            name: "Sarah Johnson",
            position: "Marketing Director",
            company: "Global Brands",
            content:
                "Maecenas consequat sagittis orci, in posuere nisi. Suspendisse potenti. Donec ut ex vel nisi consequat aliquam. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed vitae magna eu eros tempor.",
            image: Test1,
        },
    ]

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        beforeChange: (_current, next) => setActiveSlide(next),
        autoplay: true,
        autoplaySpeed: 5000,
    }

    return (
        <div className="container mx-auto py-10 px-4 lg:px-[200px] 4xl:px-[250px]">
            <div className="max-w-7xl lg:h-[550px] h-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-20 gap-4 items-center">
                    {/* Image column */}
                    <div className="col-span-12 md:col-span-4 flex items-center justify-center lg:items-end lg:justify-end lg:h-[500px]">
                        <div className="relative w-[150px] h-[150px] border-white border-8 rounded-full lg:w-full lg:h-full lg:rounded-lg overflow-hidden shadow-lg mt-10">
                            <img
                                src={testimonials[activeSlide].image}
                                alt="Client testimonial"
                                className="w-full h-full object-cover "
                                loading="lazy"
                            />
                        </div>
                    </div>

                    {/* Testimonial content */}
                    <div className="col-span-12 md:col-span-7">
                        <div className="mb-12 text-center lg:text-center">
                            <h3 className="text-red-600 font-medium tracking-wide uppercase mb-2">
                                TESTIMONIALS
                            </h3>
                            <h2 className="text-[30px] font-normal text-[#16213E] leading-[64px]">
                                Our Clients Say
                            </h2>
                        </div>
                        <Slider ref={sliderRef} {...settings}>
                            {testimonials.map((t) => (
                                <div key={t.id} className="outline-none">
                                    <div className="flex flex-col items-center md:items-start">
                                        <div className="bg-red-600 w-16 h-16 flex items-center justify-center mb-6">
                                            <Quote className="text-white w-10 h-10" />
                                        </div>
                                        <p className="text-slate-700 text-lg leading-relaxed mb-8 text-center md:text-left">
                                            {t.content}
                                        </p>
                                        <div className="text-center md:text-left">
                                            <h4 className="text-xl font-bold text-slate-800">
                                                {t.name}
                                            </h4>
                                            <p className="text-red-600">
                                                {t.position}, {t.company}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </Slider>

                        {/* Custom dots */}
                        <div className="flex mt-8 space-x-2 justify-center md:justify-start">
                            {testimonials.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => sliderRef.current?.slickGoTo(idx)}
                                    className={`transition-colors duration-300 rounded-full ${activeSlide === idx
                                        ? "bg-red-600 w-5 h-5 relative -top-1"
                                        : "bg-red-200 w-3 h-3"
                                        }`}
                                    aria-label={`Go to slide ${idx + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
