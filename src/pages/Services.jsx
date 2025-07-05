/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react'
import servicebg from "../assets/services/servicebg.png"
import service1 from "../assets/services/service1.jpg"
import logo from "../assets/logo.png"
import service2 from "../assets/services/service2.jpg"
import service3 from "../assets/services/service3.jpg"
import service4 from "../assets/services/service4.jpg"
import Banner from '../components/Banner'

import AOS from 'aos';
import 'aos/dist/aos.css';


const Services = () => {

    const [mounted, setMounted] = useState(false)

    // custom hook for intersection‐based inView tracking
    function useInView(threshold = 0.1) {
        const ref = useRef(null)
        const [inView, setInView] = useState(false)
        useEffect(() => {
            const obs = new IntersectionObserver(
                ([entry]) => setInView(entry.isIntersecting),
                { threshold }
            )
            if (ref.current) obs.observe(ref.current)
            return () => obs.disconnect()
        }, [threshold])
        return [ref, inView]
    }

    // network refs
    const [serviceTitleRef, serviceTitleIn] = useInView()
    const [serviceParaRef, serviceParaIn] = useInView()
    const [serviceBtnRef, serviceBtnIn] = useInView()

    const [profTitleRef, profTitleIn] = useInView()
    const [profP1Ref, profP1In] = useInView()
    const [profP2Ref, profP2In] = useInView()
    const [profBtnRef, profBtnIn] = useInView()

    const [managedTitleRef, managedTitleIn] = useInView()
    const [managedParaRef, managedParaIn] = useInView()
    const [managedBtnRef, managedBtnIn] = useInView()

    const [supportTitleRef, supportTitleIn] = useInView()
    const [supportParaRef, supportParaIn] = useInView()
    const [supportBtnRef, supportBtnIn] = useInView()


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
        <div>
            <div className="relative w-full h-[500px]">
                {/* Background image */}
                <img
                    src={servicebg}
                    alt="About NFLEXIONS-IT"
                    className="w-full h-full object-cover"
                    loading="lazy"
                />

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/50" />

                {/* Content */}
                <div className="absolute inset-0 flex items-center">
                    <div className="container mx-auto px-4 lg:px-[240px] 4xl:px-[240px]">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-8">

                            {/* Left column */}
                            <div className="md:w-1/2 text-white space-y-4">
                                <h2 data-aos="fade-right" className="text-4xl lg:text-5xl font-bold">
                                    Flexible I.T. Service <br className="hidden lg:block" />
                                    Models Tailored to  <br className="hidden lg:block" />your needs
                                </h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <section className="bg-white container mx-auto px-4 lg:pl-[240px] 4xl:pl-[190px] lg:pr-[160px] 4xl:pr-[210px] 4xl:ml-[50px] lg:ml-0 md:ml-0 ml-0">
                {/* Banner */}
                <div className="container mx-auto px-4 md:px-8 lg:px-0 pt-8">
                    <img
                        src={service1}
                        alt="Service banner"
                        data-aos="zoom-in"
                        className="
        w-full
        h-[200px] sm:h-[300px] md:h-[450px]
        object-cover
        border border-blue-200
        shadow-[10px_5px_5px_#DFE9F8]
      "
                    />
                </div>

                {/* Content */}
                <div
                    className="
      container mx-auto
      px-4 md:px-8 lg:px-0
      py-12
      flex flex-col md:flex-row
      items-center md:items-start
      gap-8
    "
                >
                    {/* Logo box */}
                    <div className="w-full md:w-1/3 flex justify-center">
                        <div
                            className="
          bg-white
          border-2 border-gray-100
          shadow-sm
          p-6
          flex items-center justify-center
          w-full h-auto md:h-[309px]
        "
                        >
                            <img
                                src={logo}
                                alt="Inflexions-IT Logo"
                                data-aos="zoom-in"
                                className="max-h-full max-w-full object-contain"
                            />
                        </div>
                    </div>

                    {/* Text & button */}
                    <div className="w-full md:w-2/3 pt-4">
                        <h2
                            ref={serviceTitleRef}
                            className={`
      ${base}
      ${serviceTitleIn
                                    ? "translate-y-0 opacity-100 delay-[800ms]"
                                    : "translate-y-[50px] opacity-0"
                                }
      text-2xl md:text-[33px] font-bold text-[#1B3764] leading-[120%] tracking-[-2%] mb-4
    `}
                        >
                            Our IT Service Delivery Models
                        </h2>
                        <p
                            ref={serviceParaRef}
                            className={`
      ${base}
      ${serviceParaIn
                                    ? "translate-y-0 opacity-100 delay-[1000ms]"
                                    : "translate-y-[50px] opacity-0"
                                }
      w-full lg:w-[568px] text-[#666C89] mb-6 leading-[180%] tracking-[-1%] text-justify
    `}
                        >
                            Inflexions offers flexible engagement models designed to provide the right
                            level of support and expertise for your specific requirements. Whether you
                            need targeted project assistance, ongoing management, or responsive support,
                            we have a service model that fits.
                        </p>
                        <a
                            ref={serviceBtnRef}
                            href="/contact"
                            className={`
      ${base}
      ${serviceBtnIn
                                    ? "translate-y-0 opacity-100 delay-[1200ms]"
                                    : "translate-y-[50px] opacity-0"
                                }
      bg-[#BD2E25] hover:bg-[#A02923]
      text-white font-medium
      py-3 px-8
      transition mt-6
    `}
                        >
                            Contact now
                        </a>
                    </div>

                </div>
            </section>

            <section className="container mx-auto px-4 lg:pl-[240px] 4xl:pl-[190px] lg:pr-[160px] 4xl:pr-[210px] 4xl:ml-[50px] lg:ml-0 md:ml-0 ml-0 py-12">
                <div className="flex flex-col-reverse md:flex-row items-center gap-8">

                    {/* Left content */}
                    <div className="flex flex-col lg:flex-row md:flex-row items-start md:w-1/2">

                        {/* Number & dashed line */}
                        <div className="flex flex-col items-start flex-none mb-6 md:mb-0 md:mr-6">
                            <div className="bg-[#BD2E25] text-white font-bold text-[28px] w-12 h-14 flex items-center justify-center">
                                01
                            </div>
                            <div className="border-l-2 border-dashed border-gray-300 h-16 mt-2 md:mt-4"></div>
                        </div>

                        {/* Text + button */}
                        <div className="flex-1">
                            <h3
                                ref={profTitleRef}
                                className={`
      ${base}
      ${profTitleIn
                                        ? "translate-y-0 opacity-100 delay-[800ms]"
                                        : "translate-y-[50px] opacity-0"
                                    }
      text-xl md:text-[25px] leading-[20px] font-bold tracking-[-1%] text-[#1B3764] my-4 flex flex-col
    `}
                            >
                                Professional Services:
                                <span className="text-[16px] leading-[20px] font-normal tracking-[-1%] pt-3">
                                    {' '}Expert Guidance for Strategic IT Initiatives
                                </span>
                            </h3>
                            <p
                                ref={profP1Ref}
                                className={`
      ${base}
      ${profP1In
                                        ? "translate-y-0 opacity-100 delay-[1000ms]"
                                        : "translate-y-[50px] opacity-0"
                                    }
      text-[#666C89] text-[16px] leading-normal tracking-[-1%] mb-4 w-full lg:w-[405px] text-justify
    `}
                            >
                                Leverage our deep technical expertise for specific projects and strategic consulting. Our
                                Professional Services team provides IT assessments, technology roadmapping, solution design,
                                complex implementations, migrations, and upgrades. We work collaboratively with your team to
                                ensure successful project outcomes aligned with your business objectives.
                            </p>
                            <p
                                ref={profP2Ref}
                                className={`
      ${base}
      ${profP2In
                                        ? "translate-y-0 opacity-100 delay-[1200ms]"
                                        : "translate-y-[50px] opacity-0"
                                    }
      text-[#666C89] text-[16px] leading-normal tracking-[-1%] mb-6 w-full lg:w-[405px] text-justify
    `}
                            >
                                <b className="text-[#666C89]">Ideal For</b>: Businesses needing expert help with specific
                                technology implementations, upgrades, migrations, or strategic IT planning.
                            </p>
                            <a
                                ref={profBtnRef}
                                href="/contact"
                                className={`
      ${base}
      ${profBtnIn
                                        ? "translate-y-0 opacity-100 delay-[1400ms]"
                                        : "translate-y-[50px] opacity-0"
                                    }
      bg-[#BD2E25] hover:bg-[#A02923] text-white font-medium py-4 px-6 md:px-10 transition
    `}
                            >
                                Review
                            </a>
                        </div>

                    </div>

                    {/* Right image */}
                    <div data-aos="fade-left" className="w-full md:w-1/2">
                        <img
                            src={service2}
                            alt="Professional Services"
                            className="w-full h-auto lg:h-[559px] object-cover shadow-lg"
                        />
                    </div>
                </div>
            </section>

            <section className="container mx-auto px-4 lg:pl-[240px] 4xl:pl-[190px] lg:pr-[90px] 4xl:ml-[50px] lg:ml-0 md:ml-0 ml-0 py-12">
                <div className="flex flex-col md:flex-row items-center gap-8">


                    {/* Right image */}
                    <div className="w-full md:w-1/2 lg:pr-[50px]">
                        <img
                            src={service3}
                            alt="Professional Services"
                            data-aos="fade-right"
                            className="w-full h-auto lg:h-[559px] object-cover shadow-lg"
                        />
                    </div>

                    {/* Left content */}
                    <div className="flex flex-col lg:flex-row md:flex-row items-start lg:pl-8 pl-0 md:pl-0 md:w-1/2">

                        {/* Number & dashed line */}
                        <div className="flex flex-col items-start flex-none mb-6 md:mb-0 md:mr-6">
                            <div className="bg-[#BD2E25] text-white font-bold text-[28px] w-12 h-14 flex items-center justify-center">
                                02
                            </div>
                            <div className="border-l-2 border-dashed border-gray-300 h-16 mt-2 md:mt-4"></div>
                        </div>

                        {/* Text + button */}
                        <div className="flex-1">
                            <h3
                                ref={managedTitleRef}
                                className={`
      ${base}
      ${managedTitleIn
                                        ? "translate-y-0 opacity-100 delay-[800ms]"
                                        : "translate-y-[50px] opacity-0"
                                    }
      text-xl md:text-[25px] leading-[20px] font-bold tracking-[-1%] text-[#1B3764] my-4 flex flex-col
    `}
                            >
                                Managed Services:
                                <span className="text-[16px] leading-[20px] font-normal tracking-[-1%] lg:w-[316px] pt-3">
                                    {' '}Proactive Management for Optimal Performance & Peace of Minds
                                </span>
                            </h3>

                            <p
                                ref={managedParaRef}
                                className={`
      ${base}
      ${managedParaIn
                                        ? "translate-y-0 opacity-100 delay-[1000ms]"
                                        : "translate-y-[50px] opacity-0"
                                    }
      text-[#666C89] text-[16px] leading-normal tracking-[-1%] mb-10 w-full lg:w-[405px] 4xl:w-[550px] text-justify
    `}
                            >
                                Outsource the day-to-day management of your IT infrastructure to Inflexions. Our Managed Services provide proactive monitoring, maintenance, patch management, security oversight, helpdesk support, and performance reporting. Benefit from predictable costs, reduced downtime, enhanced security, and the freedom for your internal team to focus on strategic initiatives..
                                Ideal For: Organizations seeking predictable IT costs, improved system reliability, enhanced security posture, and expert ongoing management of their IT environment..
                            </p>

                            <a
                                ref={managedBtnRef}
                                href='/contact'
                                className={`
      ${base}
      ${managedBtnIn
                                        ? "translate-y-0 opacity-100 delay-[1200ms]"
                                        : "translate-y-[50px] opacity-0"
                                    }
      bg-[#BD2E25] hover:bg-[#A02923] text-white font-medium py-4 px-6 md:px-12 transition
    `}
                            >
                                Get a Quote
                            </a>
                        </div>

                    </div>

                </div>
            </section>

            <section className="container mx-auto px-4 lg:pl-[240px] 4xl:pl-[190px] lg:pr-[160px] 4xl:pr-[210px] 4xl:ml-[50px] lg:ml-0 md:ml-0 ml-0 py-12">
                <div className="flex flex-col-reverse md:flex-row items-center gap-8">

                    {/* Left content */}
                    <div className="flex flex-col lg:flex-row md:flex-row items-start md:w-1/2">

                        {/* Number & dashed line */}
                        <div className="flex flex-col items-start flex-none mb-6 md:mb-0 md:mr-6">
                            <div className="bg-[#BD2E25] text-white font-bold text-[28px] w-12 h-14 flex items-center justify-center">
                                03
                            </div>
                            <div className="border-l-2 border-dashed border-gray-300 h-16 mt-2 md:mt-4"></div>
                        </div>

                        {/* Text + button */}
                        <div className="flex-1">
                            <h3
                                ref={supportTitleRef}
                                className={`
      ${base}
      ${supportTitleIn
                                        ? "translate-y-0 opacity-100 delay-[800ms]"
                                        : "translate-y-[50px] opacity-0"
                                    }
      text-xl md:text-[25px] leading-[20px] font-bold tracking-[-1%] text-[#1B3764] my-4 flex flex-col
    `}
                            >
                                Support Services:
                                <span className="text-[16px] leading-[20px] font-normal tracking-[-1%] pt-3">
                                    {' '}Responsive and Reliable Technical Support
                                </span>
                            </h3>

                            <p
                                ref={supportParaRef}
                                className={`
      ${base}
      ${supportParaIn
                                        ? "translate-y-0 opacity-100 delay-[1000ms]"
                                        : "translate-y-[50px] opacity-0"
                                    }
      text-[#666C89] text-[16px] leading-normal tracking-[-1%] mb-10 w-full lg:w-[405px] text-justify
    `}
                            >
                                Ensure business continuity with timely and effective technical support. Our Support Services offer various tiers of assistance, from break/fix support for specific hardware or software issues to comprehensive helpdesk services for your end-users. Our experienced technicians are ready to resolve issues quickly and minimize disruption.
                                Ideal For: Businesses needing dependable technical assistance, troubleshooting, and issue resolution on an as-needed or contracted basis.
                            </p>

                            <a
                                ref={supportBtnRef}
                                href="/contact"
                                className={`
      ${base}
      ${supportBtnIn
                                        ? "translate-y-0 opacity-100 delay-[1200ms]"
                                        : "translate-y-[50px] opacity-0"
                                    }
      bg-[#BD2E25] hover:bg-[#A02923] text-white font-medium py-4 px-6 md:px-10 transition
    `}
                            >
                                Explore package
                            </a>
                        </div>

                    </div>

                    {/* Right image */}
                    <div className="w-full md:w-1/2">
                        <img
                            src={service4}
                            data-aos="fade-left"
                            alt="Professional Services"
                            className="w-full h-auto lg:h-[559px] object-cover shadow-lg"
                        />
                    </div>
                </div>
            </section>

            <Banner />

        </div>
    )
}

export default Services