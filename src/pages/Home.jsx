/* eslint-disable no-irregular-whitespace */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import herobg from "../assets/hero/herobg.png"
import { Link } from 'react-router-dom'
import Partners from '../components/Partners'
import svgbg from "../assets/bgsvg/Background.png"
import imagesvg from "../assets/bgsvg/image.png"
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import subtract from "../assets/sub/subtract.png"
// import infra from "../assets/sub/infra.png"
// import infra1 from "../assets/sub/infra1.png"
// import infra2 from "../assets/sub/infra2.png"
// import infra3 from "../assets/sub/infra3.png"

import mid1 from "../assets/mid/mid1.png"
import mid2 from "../assets/mid/mid2.png"
import mid3 from "../assets/mid/mid3.png"
import mid4 from "../assets/mid/mid4.png"

import ban from "../assets/hero/ban1.png"
// import ban1 from "../assets/hero/ban2.png"
import MainPartners from '../components/MainPartners'
import TestimonialSlider from '../components/TestimonialSlider'

import AOS from 'aos';
import 'aos/dist/aos.css';
import SwapGrid from '../components/SwapGrid'



export default function Home() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        AOS.init({
            duration: 3000,
        });
        AOS.refresh();
    }, []);

    const base = "transform transition-all duration-[600ms] ease-out"

    return (
        <>
            <div className="relative w-full">
                <img src={herobg} alt="herobg" className="object-cover w-full lg:h-[85vh] 4xl:h-[60vh] md:h-[60vh] h-[70vh]" />
                <div className="absolute inset-0 bg-black/30" />

                <div
                    className=" absolute top-28 xxsm:top-28 md:top-28 lg:top-24 4xl:top-[170px] left-0 p-4 md:p-0 w-full md:w-[571px] h-auto md:left-10 lg:left-[200px] 4xl:left-[250px] flex flex-col justify-center items-start"
                >
                    <h1
                        className={`${base}${mounted ? "translate-y-0 opacity-100 delay-[800ms]" : "translate-y-[50px] opacity-0"}
                    text-3xl md:text-5xl lg:text-[60px] font-bold text-white leading-tight md:leading-[71px] mb-4`}
                    >
                        Architecting Your Future: Resilient IT Solutions for Global Ambition
                    </h1>

                    <p
                        className={`
            ${base}
            ${mounted ? "translate-y-0 opacity-100 delay-[1100ms]" : "translate-y-[50px] opacity-0"} text-base md:text-lg text-white  mb-6
          `}
                    >
                        Inflexions I.T. Services partners with businesses to design, implement,
                        and manage robust technology infrastructures that drive efficiency,
                        innovation, and growth.
                    </p>

                    <div
                        className={`
            ${base}
            ${mounted
                                ? "translate-y-0 opacity-100 delay-[1400ms]"
                                : "translate-y-[50px] opacity-0"
                            }
            w-full md:w-[254px] 
            h-[60px] 
            bg-[#BD2E25] 
            flex items-center justify-center
          `}
                    >
                        <Link to="/contact" className="text-white font-semibold">
                            Request consultation
                        </Link>
                    </div>
                </div>
            </div>

            <Partners />

            <section>
                <div className='flex flex-col md:flex-col lg:flex-row 4xl:flex-row w-full lg:h-[554px] px-4 lg:pl-[200px] 4xl:pl-[250px]'>
                    <div className='flex-1 md:px-8 lg:px-0 md:py-10 lg:py-14 '>
                        <h2 className={`${base} ${mounted ? "translate-y-0 opacity-100 delay-[800ms]" : "translate-y-[50px] opacity-0"} lg:w-[486px] lg:h-[144px] lg:text-[40px] md:text-[28px] text-[24px] lg:leading-[45px] mb-2 py-2`}>
                            Your Strategic Technology Partner, From Foundation to Future.
                        </h2>
                        <div className='w-full md:w-[600px] lg:w-[450px] 4xl:w-[650px] text-justify'>
                            <span className={`${base} ${mounted ? "translate-y-0 opacity-100 delay-[1200ms]" : "translate-y-[50px] opacity-0"} text-[18px] w-[300px] leading-[30px]`}>
                                In today's hyper-connected world, your IT infrastructure isn't just support – it's the engine of your success. Inflexions I.T. Services understands the critical link between technology and business outcomes. We deliver tailored IT solutions – from robust network infrastructure and secure cloud services to intelligent data insights – empowering you to navigate complexity, scale efficiently, and achieve your strategic objectives.
                            </span>
                        </div>

                        <div className={`${base} ${mounted ? "translate-y-0 opacity-100 delay-[1400ms]" : "translate-y-[50px] opacity-0"} bg-[#BD2E25] w-[201.32px] h-[53px] mt-6 flex items-center justify-center`}>
                            <Link to="/contact" className="text-white font-normal">
                                Request consultation
                            </Link>
                        </div>
                    </div>
                    <div className='relative flex flex-1 items-center md:pl-[160px] lg:pl-[72px] 4xl:pl-[310px] mt-2 md:mt-0 lg:mt-0'>
                        <div className=''>
                            <img src={svgbg} alt='svgbg' className='w-[419px] lg:ml-5 4xl:ml-16 h-full object-contain' loading='lazy' />
                            <div className='absolute top-20 md:top-32 lg:top-32 4xl:top-32 md:left-[17%] lg:left-[8%] 4xl:left-[35%]'>
                                <img src={imagesvg} alt='svgbg' className='w-[490px] h-[353px] object-contain' loading='lazy' />
                            </div>
                            {/* 1) Robust Infrastructure */}
                            <div
                                className={`
            ${base}
            ${mounted
                                        ? "translate-x-0 opacity-100 delay-[1600ms]"
                                        : "translate-x-[50px] opacity-0"
                                    }
            absolute top-[165px] md:left-[80px] lg:left-0 4xl:left-[200px]
            flex gap-2 items-center justify-center
            w-[262px] py-[4px] border border-[#BD2E25] rounded-[49px] bg-white
          `}
                            >
                                <IoIosCheckmarkCircleOutline className='text-[#BD2E25]' />
                                <span className='text-[16px] leading-[30px] text-[#1D3C6D]'>
                                    Robust Infrastructure
                                </span>
                            </div>

                            {/* 2) Cloud Infrastructure */}
                            <div
                                className={`
            ${base}
            ${mounted
                                        ? "translate-x-0 opacity-100 delay-[1800ms]"
                                        : "translate-x-[50px] opacity-0"
                                    }
            absolute top-[220px] md:top-[240px] lg:top-[240px]
            left-[30px] md:left-[45px] lg:left-[-30px] 4xl:left-[120px]
            flex gap-2 items-center justify-center
            w-[262px] py-[4px] border border-[#BD2E25] rounded-[49px] bg-white
          `}
                            >
                                <IoIosCheckmarkCircleOutline className='text-[#BD2E25]' />
                                <span className='text-[16px] leading-[30px] text-[#1D3C6D]'>
                                    Cloud Infrastructure
                                </span>
                            </div>

                            {/* 3) Security & Support */}
                            <div
                                className={`
            ${base}
            ${mounted
                                        ? "translate-x-0 opacity-100 delay-[2000ms]"
                                        : "translate-x-[50px] opacity-0"
                                    }
            absolute top-[280px] md:top-[315px] lg:top-[315px]
            md:left-[80px] lg:left-0 4xl:left-[200px]
            flex gap-2 items-center justify-center
            w-[262px] py-[4px] border border-[#BD2E25] rounded-[49px] bg-white
          `}
                            >
                                <IoIosCheckmarkCircleOutline className='text-[#BD2E25]' />
                                <span className='text-[16px] leading-[30px] text-[#1D3C6D]'>
                                    Security &amp; Support
                                </span>
                            </div>

                            {/* 4) Data Intelligence */}
                            <div
                                className={`
            ${base}
            ${mounted
                                        ? "translate-x-0 opacity-100 delay-[2200ms]"
                                        : "translate-x-[50px] opacity-0"
                                    }
            absolute top-[340px] md:top-[390px] lg:top-[390px]
            left-[30px] md:left-[45px] lg:left-[-30px] 4xl:left-[120px]
            flex gap-2 items-center justify-center
            w-[262px] py-[4px] border border-[#BD2E25] rounded-[49px] bg-white
          `}
                            >
                                <IoIosCheckmarkCircleOutline className='text-[#BD2E25]' />
                                <span className='text-[16px] leading-[30px] text-[#1D3C6D]'>
                                    Data Intelligence
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="flex flex-col md:flex-col lg:flex-row lg:h-[800px] h-full w-full gap-x-10">
                <div data-aos="flip-right" className="flex-1 py-2 md:py-4 lg:py-0 md:px-4 lg:px-0 px-0 4xl:px-0">
                    <img
                        src={subtract}
                        alt="sub"
                        className="w-full lg:w-[710px] md:w-[700px] 4xl:w-full lg:h-[800px] object-contain"
                        loading="lazy"
                    />
                </div>
                <div className="flex-1 py-4 md:py-10 lg:py-20 lg:pl-[200px] px-4 md:px-8 lg:px-0">
                    <div className='flex flex-col gap-8 w-full lg:w-[700px] 4xl:w-[600px] lg:h-[700px]'>
                        <h2 className="lg:w-[400px] lg:h-[93px] lg:text-[32px] md:text-[32px] text-[20px] lg:leading-[40px] text-[#265982]">
                            Comprehensive Solutions for Modern Challenges
                        </h2>
                        <div className="lg:w-[555px] 4xl:w-full 4xl:ml-[92px] lg:ml-0 md:ml-0 ml-0 4xl:space-y-8 lg:space-y-4 space-y-4">
                            <SwapGrid />
                        </div>
                    </div>
                </div>
            </div>

            <section className="container mx-auto px-4 lg:pl-[200px] 4xl:pl-[250px] lg:pr-[160px] py-12">
                {/* Heading */}
                <h2 className="text-3xl font-medium text-gray-900 mb-12">
                    Your The Inflexions
                    <br />
                    Advantage
                </h2>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4">
                    {[
                        { src: mid1, title: "Embrace Agility & Scale:", text: "Seamless Cloud Services, Collaboration tools, and modern Application Platforms", overlay: "bg-black/50", rowSpan: "" },
                        { src: mid2, title: "Client-Centric Approach:", text: "Solutions tailored to your unique business goals and operational needs.", overlay: "bg-black/50", rowSpan: "" },
                        { src: mid3, title: "Build a Rock-Solid Foundation:", text: "Reliable Network Infrastructure, IT Hardware, and Datacentre solutions.", overlay: "", rowSpan: "md:row-span-2 lg:h-[530px] md:h-[540px] h-[214px]" },
                        { src: mid4, title: "Unlock Future Potential:", text: "Harness the power of Data Science and AI for strategic advantage.", overlay: "bg-black/50", rowSpan: "md:col-span-2 h-[259px]" },
                    ].map((item, idx) => (
                        <div
                            key={idx}
                            className={`
          relative w-full ${item.rowSpan || "h-[260px]"} rounded-lg overflow-hidden
          group transition-transform duration-500
        `}
                        >
                            {/* Image */}
                            <img
                                src={item.src}
                                alt={item.title}
                                loading="lazy"
                                className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-110"
                            />

                            {/* Optional dark overlay */}
                            {item.overlay && (
                                <div className={`absolute inset-0 ${item.overlay} transition-opacity duration-500 opacity-0 group-hover:opacity-100`} />
                            )}

                            {/* Text content */}
                            <div className="absolute inset-0 flex flex-col items-start justify-center p-6 text-white">
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <h3 className="text-xl font-semibold">{item.title}</h3>
                                    <p>{item.text}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>


            <MainPartners />
            <TestimonialSlider />

            <section>
                <div className="relative w-full h-[300px] sm:h-[350px] md:h-[400px] lg:h-[440px] overflow-hidden">
                    <img
                        src={ban}
                        alt="banner"
                        loading="lazy"
                        className="w-full h-full object-cover"
                    />

                    <div
                        className="
            absolute top-4 sm:top-8 md:top-20 lg:top-[20%]
            left-4 sm:left-6 md:left-4 lg:left-[165px] 4xl:left-[220px]
            w-[calc(100%-2rem)] sm:w-[calc(100%-3rem)] md:w-[400px] lg:w-[568px] bg-opacity-90
            p-4 sm:p-6 md:p-8
            flex flex-col gap-3 sm:gap-4
          "
                    >
                        <h2 className="
            text-lg sm:text-xl md:text-2xl lg:text-[43px]
            leading-snug md:leading-tight lg:leading-[43px]
            font-normal text-white
          ">
                            Ready to Transform Your Technology Landscape?
                        </h2>

                        <p className="text-sm sm:text-base text-white">
                            Let&apos;s discuss how Inflexions can empower your business growth.
                        </p>

                        <div className="
            bg-white
            w-[180px] h-[50px] items-center justify-center flex
          ">
                            <Link to="" className="text-[#BD2E25] font-semibold block text-center">
                                Schedule a Call
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* <section>
                <img
                    src={ban1}
                    alt="banner"
                    loading="lazy"
                    className="w-full h-full object-cover"
                />
            </section> */}
        </>
    )
}
