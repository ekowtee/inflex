/* eslint-disable no-unused-vars */
import React from 'react'
import careerbg from "../assets/career/careerbg.png"
import { Search } from 'lucide-react'
import career1 from "../assets/career/career1.png"
import { Link } from 'react-router-dom'
import FeaturedJobs from '../components/FeaturedJobs'
import vidmin from "../assets/about/vidmin.png"


const Careers = () => {
    return (
        <div>
            <div className="relative w-full h-[300px] md:h-[500px]">
                {/* Background image */}
                <img
                    src={careerbg}
                    alt="About NFLEXIONS-IT"
                    className="w-full h-full object-cover"
                    loading="lazy"
                />

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/30" />

                {/* Content */}
                <div className="absolute inset-0 flex items-center">
                    <div className="container mx-auto px-4 md:px-8 lg:px-[200px] 4xl:px-[250px]">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-8">

                            {/* Left column */}
                            <div className="w-full md:w-2/2 text-white space-y-4">
                                <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-snug md:leading-[76px]">
                                    Careers at Inflexions <br className="hidden lg:block" />
                                    | Shape the Future of Technology
                                </h2>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <section className="bg-[#F4F4F4]">
                <div className="container mx-auto px-4 lg:px-[200px] 4xl:px-[250px] py-12">
                    <div className="flex flex-col md:flex-row items-center gap-8">

                        {/* Left: hero image */}
                        <div className="w-full md:w-1/2">
                            <img
                                src={career1}
                                alt="Team reviewing job roles"
                                className="w-full h-auto object-cover rounded-lg shadow-lg"
                            />
                        </div>

                        {/* Right: search block */}
                        <div className="w-full md:w-1/2">
                            <h2 className="text-3xl font-semibold text-[#1B3764] mb-6">
                                Search Job
                            </h2>

                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search by role or keyword"
                                    className="
                  w-full
                  border border-gray-300
                  rounded-md
                  py-3 pl-10 pr-4
                  focus:outline-none focus:ring-2 focus:ring-[#BD2E25]
                  transition
                "
                                />
                            </div>

                            <p className="text-[#666C89] leading-relaxed text-justify">
                                Pioneering next-generation technology solutions to tackle the toughest
                                tech engineering, networking, and operational challenges—driving innovation
                                to power a clean technological future.
                            </p>
                        </div>

                    </div>
                </div>
            </section>

            <section className="container mx-auto px-4 lg:px-[200px] 4xl:px-[250px] py-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    {/* Left: intro text */}
                    <p className="text-[#333333] leading-relaxed max-w-xl text-justify">
                        Exceptional minds belong here—no matter your background, education, or industry. If you’re pushing boundaries,
                        join us to redefine the future of sustainable energy and advanced manufacturing through innovation.
                    </p>

                    {/* Right: heading + button */}
                    <div className="text-center md:text-right space-y-4">
                        <h3 className="text-[23px] font-normal leading-[28px] text-[#171A20]">
                            Working with us
                        </h3>
                        <Link
                            to="/jobs"
                            className="
              inline-block
              border-4 border-black
              text-black font-medium
              py-2 px-12
              rounded-md
              hover:bg-black hover:text-white
              transition-colors duration-200
            "
                        >
                            View Jobs
                        </Link>
                    </div>
                </div>
            </section>

            <FeaturedJobs />

            <section className="relative w-full h-[400px] md:h-[600px]">
                {/* Background image */}
                <img
                    src={vidmin}
                    alt="Join Us Hero"
                    className="w-full h-full object-cover"
                />

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/40" />

                {/* Centered content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                    <h1 className="text-white text-3xl md:text-5xl font-semibold mb-2">
                        Join Us
                    </h1>
                    <p className="text-white text-sm md:text-lg mb-6">
                        Accelerate the world’s transition to sustainable energy
                    </p>
                    <div className="flex flex-col gap-4">
                        <button
                            className=" px-6 py-2 border border-white text-white rounded-md hover:bg-white hover:text-black transition-colors duration-200
            "
                        >
                            View Jobs
                        </button>
                        <button
                            className=" px-6 py-2 bg-[#BD2E25] text-white rounded-md hover:bg-[#A02923] transition-colors duration-200
            "
                        >
                            View Internships
                        </button>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Careers