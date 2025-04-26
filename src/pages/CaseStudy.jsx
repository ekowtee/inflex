/* eslint-disable no-unused-vars */
import React from 'react'
import casebg from "../assets/case/casebg.png"

import case1 from '../assets/solutions/sol2.png'
import case2 from '../assets/solutions/sol1.png'
import case3 from '../assets/solutions/sol1.png'
import case4 from '../assets/case/case3.png'
import case5 from '../assets/case/case3.png'
import { caseStudies } from '../data'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import Banner from '../components/Banner'


const CaseStudy = () => {
    const topImages = [case1, case2, case3]
    const bottomImages = [case4, case5]
    return (
        <div>
            <div className="relative w-full h-[300px] md:h-[500px]">
                {/* Background image */}
                <img
                    src={casebg}
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
                                    Proven Results: Client Success
                                    <br className="hidden lg:block" />
                                    Stories | Inflexions I.T. Services
                                </h2>
                            </div>

                        </div>
                    </div>
                </div>
            </div>


            <section className="container mx-auto px-4 lg:px-[200px] 4xl:px-[250px] py-12">
                {/* Title */}
                <h2 className="text-3xl font-semibold mb-8">
                    Delivering Tangible Value Through Technology
                </h2>

                {/* Two‐column layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-auto md:h-[412px]">
                    {/* Left: red call-out */}
                    <div className="bg-[#BD2E25] text-white p-8 flex flex-col text-justify items-center justify-center h-auto md:h-full">
                        <p className="mb-2">
                            Don’t just take our word for it. Explore how Inflexions has partnered with organizations like
                            yours to solve complex challenges, implement transformative solutions, and achieve significant
                            business results.
                        </p>
                        <ul>
                            <li>
                                * **(Structure: Grid or list of case studies, filterable by Industry, Solution, or Service.).
                            </li>
                        </ul>
                    </div>

                    {/* Right: two nested grids filling full height */}
                    <div className="space-y-1 h-auto md:h-full">
                        {/* Top row: 1col → 3cols @ ≥768px */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 h-auto md:h-1/2">
                            {topImages.map((src, i) => (
                                <img
                                    key={i}
                                    src={src}
                                    alt={`Case study ${i + 1}`}
                                    className="w-full h-auto md:h-full object-cover rounded-lg shadow-lg"
                                />
                            ))}
                        </div>
                        {/* Bottom row: 1col → 2cols @ ≥768px */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 h-auto md:h-1/2">
                            {bottomImages.map((src, i) => (
                                <img
                                    key={i}
                                    src={src}
                                    alt={`Case study ${i + 4}`}
                                    className="w-full h-auto md:h-full object-cover rounded-lg shadow-lg"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="container mx-auto px-4 lg:px-[200px] 4xl:px-[250px] py-12">


                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {caseStudies.map(item => (
                        <Link
                            key={item.id}
                            to={`/case-studies/${item.id}`}
                            className="relative group block overflow-hidden shadow-lg"
                        >
                            {/* Base image */}
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                            />

                            {/* Hover overlay square with icon */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div
                                    className=" w-64 h-[220px] bg-[#BD2E25]/0 group-hover:bg-[#BD2E25]/70 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center"
                                >
                                    <ArrowUpRight size={48} className="text-white" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            <Banner />
        </div>


    )
}

export default CaseStudy