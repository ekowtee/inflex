/* eslint-disable no-unused-vars */
import React, { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { caseStudies } from '../data'
import casedetailbg from '../assets/case/casedetailbg.png'
import { ArrowRight, ArrowUpRight, Play } from 'lucide-react'
import Banner from '../components/Banner'

export default function CaseStudyDetail() {
    const { id: currentId } = useParams()
    const study = caseStudies.find(cs => cs.id === currentId)



    // filter out current, shuffle, take first 3
    const related = useMemo(() => {
        const others = caseStudies.filter(cs => cs.id !== currentId)
        return others
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
    }, [currentId])

    if (!study) {
        return (
            <div className="container mx-auto px-4 py-12">
                <h2 className="text-2xl font-semibold mb-4">Case study not found</h2>
                <Link to="/case-studies" className="text-blue-600 underline">
                    ← Back to all case studies
                </Link>
            </div>
        )
    }

    return (
        <>
            {/* Hero banner + overlay */}
            <div className="relative w-full h-[300px] md:h-[500px]">
                <img
                    src={study.image}
                    alt="Case study background"
                    className="w-full h-full object-cover"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute inset-0 flex items-center">
                    <div className="container mx-auto px-4 md:px-8 lg:px-[200px]">
                        <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-snug">
                            {study.title}
                        </h2>
                    </div>
                </div>
            </div>

            {/* Detail content */}
            <section className="container mx-auto px-4 lg:px-[200px] 4xl:px-[250px]  py-12">
                <Link
                    to="/case-studies"
                    className=" inline-block bg-[#BD2E25] hover:bg-[#A02923] text-white font-medium py-2 px-6 rounded-lg shadow-md transition-colors duration-200
  "
                >
                    ← Back to case studies
                </Link>


                <section className="bg-white pt-8">
                    <div className="">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-8">

                            {/* Left: project image */}
                            <div className="w-full md:w-1/2">
                                <img
                                    src={study.innerImage1}
                                    alt="Project overview"
                                    className="w-full h-auto object-cover shadow-lg"
                                />
                            </div>

                            {/* Right: details */}
                            <div className="w-full md:w-1/2">
                                <h2 className="text-3xl font-semibold text-gray-900 mb-6">
                                    Project Details
                                </h2>
                                <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-base">
                                    <dt className="text-gray-700">Customer:</dt>
                                    <dd className="text-gray-900">{study.title}</dd>

                                    <dt className="text-gray-700">Category:</dt>
                                    <dd className="text-gray-900">{study.category}</dd>

                                    <dt className="text-gray-700">Date:</dt>
                                    <dd className="text-gray-900">{study.date}</dd>

                                    <dt className="text-gray-700">Status:</dt>
                                    <dd className="text-gray-900">{study.status}</dd>
                                </dl>
                            </div>

                        </div>
                    </div>
                </section>
            </section>

            <section className="container mx-auto px-4 lg:px-[200px] 4xl:px-[250px] py-12">
                {/* Heading */}
                <h2 className="text-3xl font-semibold text-black mb-6">
                    {study.title}
                </h2>

                {/* Intro paragraph */}
                <p className="text-[#666C89] leading-relaxed">
                    {study.summary}
                </p>

                {/* Feature list */}
                <ul className="mt-8 space-y-4">
                    <li className="flex items-start gap-3">
                        <div className="flex-shrink-0 bg-white p-1 rounded-full">
                            <ArrowRight size={20} className="text-black" />
                        </div>
                        <span className="text-black">
                            National Customer Service Center – 24 hours a day.
                        </span>
                    </li>
                    <li className="flex items-start gap-3">
                        <div className="flex-shrink-0 bg-white p-1 rounded-full">
                            <ArrowRight size={20} className="text-black" />
                        </div>
                        <span className="text-black">
                            Online shipping navigator lets you quote, book, and track shipments
                        </span>
                    </li>
                    <li className="flex items-start gap-3">
                        <div className="flex-shrink-0 bg-white p-1 rounded-full">
                            <ArrowRight size={20} className="text-black" />
                        </div>
                        <span className="text-black">
                            Your Logistics Needs Are At The Heart Of Our Business
                        </span>
                    </li>
                    <li className="flex items-start gap-3">
                        <div className="flex-shrink-0 bg-white p-1 rounded-full">
                            <ArrowRight size={20} className="text-black" />
                        </div>
                        <span className="text-black">
                            Very careful handling of valuable goods
                        </span>
                    </li>
                    <li className="flex items-start gap-3">
                        <div className="flex-shrink-0 bg-white p-1 rounded-full">
                            <ArrowRight size={20} className="text-black" />
                        </div>
                        <span className="text-black">
                            Time saving and convenient transportation services in your area
                        </span>
                    </li>
                </ul>
            </section>

            <section className="container mx-auto px-4 lg:px-[200px] 4xl:px-[250px] py-12">
                {/* Heading */}
                <h2 className="text-3xl font-semibold text-[#1B3764] mb-4">
                    {study.title}
                </h2>

                {/* Intro paragraph */}
                <p className="text-[#666C89] leading-relaxed mb-8">
                    Duis semper lacus scelerisque, aliquam leo quis, porttitor leo. Etiam lobortis dapibus libero vel porttitor.
                    Nulla tempor elit nec feugiat tempus. Phasellus at quam id elit hendrerit semper feugiat id nunc. Morbi quis
                    justo velit. Duis semper lacus scelerisque, aliquam leo quis, porttitor leo. Fusce lectus ex, pretium efficitur
                    suscipit sed, faucibus vel elit Integer adipiscing erat eget risus sollicitudin pellentesque non erat.
                    Maecenas nibh dolor malesuada sagittis accumsan ipsum. Pellentesque ultrices ultrices sapien, nec tincidunt nunc
                    posuere.
                </p>

                {/* Video thumbnail */}
                <div className="relative w-full overflow-hidden rounded-lg shadow-lg">
                    <img
                        src={study.image}
                        alt="Project overview"
                        className="w-full h-[651px] object-cover"
                    />

                    {/* Play button overlay */}
                    <button className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md">
                            <Play size={32} className="text-black" />
                        </div>
                    </button>
                </div>
            </section>

            <section className="container mx-auto px-4 lg:px-[200px] 4xl:px-[250px] py-12">
                <h2 className="text-2xl md:text-3xl font-semibold text-[#1B3764] mb-6">
                    Related Case
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {related.map(item => (
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
        </>
    )
}
