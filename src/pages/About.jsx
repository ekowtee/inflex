/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react'
import aboutbg from "../assets/about/Photo.png"
import { Link } from 'react-router-dom'
import { ChartBar, Phone, Play } from 'lucide-react'
import about1 from "../assets/about/about1.png"
import about2 from "../assets/about/about2.png"
import aboutsect from "../assets/about/aboutsect.png"
import exp from "../assets/about/exp.png"
import exp1 from "../assets/about/exp1.png"

import Partners from '../components/Partners'
import Blog from '../components/Blog'
import Banner from '../components/Banner'
import Leaders from '../components/Leaders'




const About = () => {
    const [showVideo, setShowVideo] = useState(false)
    const videoRef = useRef(null)

    useEffect(() => {
        if (showVideo && videoRef.current) {
            videoRef.current.play()
        }
    }, [showVideo])

    const handlePlayClick = () => {
        setShowVideo(true)
    }
    return (
        <>
            <div className="relative w-full h-[500px]">
                {/* Background image */}
                <img
                    src={aboutbg}
                    alt="About NFLEXIONS-IT"
                    className="w-full h-full object-cover"
                    loading="lazy"
                />

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/50" />

                {/* Content */}
                <div className="absolute inset-0 flex items-center">
                    <div className="container mx-auto px-4 lg:px-[200px] 4xl:px-[250px]">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-8">

                            {/* Left column */}
                            <div className="md:w-1/2 text-white space-y-4">
                                <h2 className="text-4xl lg:text-5xl font-bold">
                                    About <br className="hidden lg:block" />INFLEXIONS-IT
                                </h2>
                                <p className="text-lg">
                                    Who we are?
                                </p>
                                <button className="bg-[#BD2E25] hover:bg-red-700 transition px-6 py-3 text-white font-medium">
                                    <Link to="#">Request consultation</Link>
                                </button>
                            </div>

                            {/* Right “Our Services” card */}
                            <div className="w-[326px] h-[360px] hidden md:block lg:block bg-[#BD2E25] p-8 text-white space-y-6">
                                <h3 className="text-2xl font-semibold">Our Services</h3>
                                <ul className="space-y-4 text-sm">
                                    <li>
                                        <p className="font-semibold">Building Construction</p>
                                        <p>Lorem ipsum dolor sit amet consectetur adipiscing elit.</p>
                                    </li>
                                    <li>
                                        <p className="font-semibold">Foundation Work</p>
                                        <p>Lorem ipsum dolor sit amet consectetur adipiscing elit.</p>
                                    </li>
                                    <li>
                                        <p className="font-semibold">Site Management</p>
                                        <p>Lorem ipsum dolor sit amet consectetur adipiscing elit.</p>
                                    </li>
                                </ul>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <section>
                <div className="container mx-auto px-4 lg:px-[200px] 4xl:px-[250px] py-10">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        {/* Left content */}
                        <div className="w-full lg:w-1/2 space-y-10">
                            <h1
                                className="
            w-full lg:w-[350px] md:w-[335px]
            h-auto md:h-[120px]
            text-[24px] md:text-[33.35px]
            font-normal
            text-[#16213E]
            leading-[32px] md:leading-[40px]
          "
                            >
                                Engineering the Future of Business,
                                <br />
                                One Solution at a Time
                            </h1>
                            <p
                                className="
            w-full
            text-[14px] md:text-[15.31px]
            leading-[22px] md:leading-[25px]
            text-[#41444B]
            font-normal
          "
                            >
                                Founded in 2012 and headquartered in Accra, Ghana, Inflexions I.T. Services Limited is a dynamic technology solutions provider built on a foundation of deep industry expertise. With a core team possessing decades of collective experience in IT and systems integration, we were established to bridge the gap between complex technology and strategic business goals....
                            </p>
                        </div>

                        {/* Right content – Images with video button */}
                        <div className="w-full md:w-1/2 relative">
                            <div className="relative flex bg-white p-4 4xl:ml-36 ml-0 md:ml-0 lg:ml-0 shadow-lg rounded-lg">
                                {!showVideo ? (
                                    <>
                                        <div className="overflow-hidden rounded-lg border-white border-4">
                                            <img
                                                src={about1}
                                                alt="Cloud technology interface"
                                                className="w-full h-auto object-cover"
                                            />
                                        </div>

                                        <div className="absolute top-0 right-4 overflow-hidden rounded-lg border-white border-4">
                                            <img
                                                src={about2}
                                                alt="Cloud technology interface"
                                                className="w-full h-auto object-cover"
                                            />
                                        </div>

                                        {/* Play button overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <button
                                                onClick={handlePlayClick}
                                                className="bg-red-600 rounded-md p-3 shadow-lg hover:bg-red-700 transition-colors"
                                            >
                                                <Play className="w-8 h-8 text-white" />
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <video
                                        ref={videoRef}
                                        src="https://samplelib.com/lib/preview/mp4/sample-5s.mp4"
                                        controls
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className="flex flex-col lg:flex-row w-full">
                    {/* Left content */}
                    <div className="w-full lg:w-[589px] h-auto lg:h-[676px] 4xl:h-[905px] bg-[#2A2A2A] flex flex-col items-center justify-center px-6 lg:px-10 py-8 lg:py-0">
                        <div className="w-full lg:w-[490px] h-auto lg:h-[428px]  text-white space-y-4">
                            <span className="block text-[24px] lg:text-[33px] leading-[32px] lg:leading-[40px] font-normal">
                                Still reading...
                            </span>

                            <p className="text-[14px] lg:text-[15.31px] leading-[22px] lg:leading-[25px]">
                                Today, we sharpened our focus to delivering innovative, cost-effective IT solutions that give our clients a distinct competitive edge. Our vision is to be the thought-leading technology partner businesses trust to navigate transformation and achieve sustainable growth.                            </p>
                            <p className="text-[14px] lg:text-[15.31px] leading-[22px] lg:leading-[25px]">
                                From our head office in Accra, we serve clients across Ghana with the ambition and capabilities to expand our reach throughout West Africa and beyond. We are privately owned, fostering an environment sculpted for speed, accountability, and accuracy in delivering results.                            </p>
                            <p className="text-[14px] lg:text-[15.31px] leading-[22px] lg:leading-[25px]">
                                We believe that the right technology, expertly implemented and managed, is the critical inflexion point for business transformation and sustainable growth. Our journey is defined by helping our clients navigate their own technological turning points.
                            </p>
                        </div>
                    </div>

                    {/* Right content */}
                    <div className="w-full lg:w-auto flex flex-col items-start">
                        <img
                            src={aboutsect}
                            alt="abtsect"
                            loading="lazy"
                            className="object-cover w-full h-auto"
                        />
                        <div className="bg-[#BD2E25] text-white w-full lg:w-[400px] h-auto lg:h-[105px] p-4 lg:p-6 flex flex-col items-start justify-center">
                            <span className="text-[24px] lg:text-[40px] leading-[32px] lg:leading-[57px] font-bold">
                                Call for a Quote
                            </span>
                            <span className="text-[18px] lg:text-[32px] leading-[26px] lg:leading-[47px] font-medium">
                                +233 000 000 0
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="container mx-auto px-4 lg:px-[200px] 4xl:px-[250px] py-16 bg-[#F6F6F6] h-[1400px] md:h-full">
                <h2 className="text-3xl lg:text-[36px] font-normal text-[#1E3161] leading-[45px] text-center lg:mb-12">
                    Meet Our Strategic Leadership
                </h2>

                <Leaders />
            </section>

            <section className="container mx-auto px-4 lg:px-[200px] 4xl:px-[250px] py-16 bg-[#F6F6F6]">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* Left Column */}
                    <div className="w-full lg:w-[498px]">
                        <h2 className="text-[26px] md:text-[33px] font-normal text-[#1E3161] leading-[32px] md:leading-[42px]">
                            Unlock Your Potential with INFLEXIONS IT Services – Free Your Youth for a Brighter, More Purposeful Future!
                        </h2>
                        <p className="mt-2 text-base text-gray-600">
                            Inflexions is guided by a focused and experienced leadership team committed to driving innovation, client success, and strategic growth.
                        </p>

                        <div className="mt-2 relative">
                            <img
                                src={exp}
                                alt="Virtual reality experience"
                                className="w-full h-auto lg:h-[243px] rounded-[15px] object-cover"
                            />
                            {/* Badge overlay */}
                            <div className="absolute bottom-10 md:bottom-10 lg:bottom-0 right-20 md:right-[120px] lg:right-20 transform translate-x-1/2 translate-y-1/2">
                                <div className="bg-[#BD2E25] text-white w-[200px] md:w-[250px] h-28 md:h-32 flex flex-col items-center justify-center rounded-2xl border-8 border-white">
                                    <span className="text-4xl font-normal">10</span>
                                    <span className="uppercase text-sm tracking-wider">Years Of</span>
                                    <span className="uppercase text-sm">Experience</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="w-full lg:w-[495px]">
                        <img
                            src={exp1}
                            alt="Team meeting"
                            className="w-full h-auto lg:h-[263px] rounded-[15px] object-cover"
                        />

                        <div className="mt-8 flex flex-col sm:flex-row sm:space-x-8">
                            <div className="flex-1">
                                <h3 className="text-[24px] font-normal text-[#1E3161]">Certified Team</h3>
                                <p className="mt-2 text-sm text-gray-600">
                                    Non consectetur a erat nam at. Sit amet risus nullam.
                                </p>
                            </div>
                            <div className="flex-1 mt-6 sm:mt-0">
                                <h3 className="text-[24px] font-normal text-[#1E3161]">Trusted Company</h3>
                                <p className="mt-2 text-sm text-gray-600">
                                    Non consectetur a erat nam at. Sit amet risus nullam.
                                </p>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h3 className="text-[28px] md:text-[36px] font-normal text-[#1E3161]">
                                0 208 889 270
                            </h3>
                            <p className="text-gray-500">Call us</p>
                            <button className="mt-4 px-6 py-3 bg-[#BD2E25] text-white rounded-lg hover:bg-red-700 transition">
                                Book Appointment
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <Partners />
            <Blog />
            <section>
                <div className="relative">
                    {/* full-width map, shorter on mobile, taller on desktop */}
                    <iframe
                        title="Location map of Tsui Bleoo Rd, Accra"
                        src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3970.5144110567144!2d-0.15543999999999997!3d5.63844!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNcKwMzgnMTguNCJOIDDCsDA5JzE5LjYiVw!5e0!3m2!1sen!2sgh!4v1746185407560!5m2!1sen!2sgh"
                        width="100%"
                        height="450"
                        className="w-full h-[200px] sm:h-[300px] md:h-[450px]"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                    />


                    {/* contact info: column on mobile, row on md+ */}
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row mb-48 md:mb-0 lg:mb-0">
                        <div className="flex-1" />
                        <div className="flex-1 flex flex-col md:flex-row lg:flex-row items-start lg:items-center gap-[125px] gap-y-4 lg:gap-y-0">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center w-[45px] h-[45px] bg-[#030607] text-white">
                                    <Phone size={24} />
                                </div>
                                <div className="flex flex-col">
                                    <small>Company Phones</small>
                                    <span className="text-[#16213E] text-[18px] font-normal leading-[26px]">
                                        0 208 889 270
                                    </span>
                                    <span className="text-[#16213E] text-[18px] font-normal leading-[26px]">
                                        0 208 889 270
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center w-[45px] h-[45px] bg-[#BD2E25] text-white">
                                    <ChartBar size={24} />
                                </div>
                                <div className="flex flex-col">
                                    <small>Dustro Emails</small>
                                    <span className="text-[#16213E] text-[18px] font-normal leading-[26px]">
                                        dustro@gmail.com
                                    </span>
                                    <span className="text-[#16213E] text-[18px] font-normal leading-[26px]">
                                        dustro.info@gmail.com
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* absolute-card: centered & narrower on mobile, positioned with your offsets on md+ */}
                    <div
                        className="md:hidden flex absolute bg-white border-t-4 border-[#2A2A2A] z-10 w-[90%] sm:w-[480px] h-auto sm:h-[285px] left-1/2 sm:left-[200px] 
                        top-[400px] sm:top-[350px] -translate-x-1/2 sm:translate-x-0 lg:flex items-center justify-center"
                    >
                        <div className="w-full sm:w-[390px] h-auto sm:h-[139px] flex flex-col p-4">
                            <span>Company Address</span>
                            <span className="text-[34px] leading-[38px] font-medium">
                                #2 Dei Close
                                East Legon
                                Accra, Ghana
                            </span>
                        </div>
                    </div>
                    <div className=''>
                        <Banner />
                    </div>
                </div>
            </section>

        </>
    )
}

export default About