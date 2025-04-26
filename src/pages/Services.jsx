/* eslint-disable no-unused-vars */
import React from 'react'
import servicebg from "../assets/services/servicebg.png"
import service1 from "../assets/services/service1.jpg"
import logo from "../assets/logo.png"
import service2 from "../assets/services/service2.jpg"
import service3 from "../assets/services/service3.jpg"
import service4 from "../assets/services/service4.jpg"
import Banner from '../components/Banner'




const Services = () => {
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
                    <div className="container mx-auto px-4 lg:px-[200px] 4xl:px-[250px]">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-8">

                            {/* Left column */}
                            <div className="md:w-1/2 text-white space-y-4">
                                <h2 className="text-4xl lg:text-5xl font-bold">
                                    Flexible I.T Service <br className="hidden lg:block" />
                                    Models Tailored to  <br className="hidden lg:block" />your needs
                                </h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <section className="bg-white container mx-auto px-4 lg:px-[200px] 4xl:px-[250px] 4xl:ml-[50px] lg:ml-0 md:ml-0 ml-0">
                {/* Banner */}
                <div className="container mx-auto px-4 md:px-8 lg:px-0 pt-8">
                    <img
                        src={service1}
                        alt="Service banner"
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
                                className="max-h-full max-w-full object-contain"
                            />
                        </div>
                    </div>

                    {/* Text & button */}
                    <div className="w-full md:w-2/3 pt-4">
                        <h2 className="text-2xl md:text-[33px] font-normal text-[#1B3764] leading-[120%] tracking-[-2%] mb-4">
                            Our IT Service Delivery Models
                        </h2>
                        <p className="w-full lg:w-[568px] text-[#666C89] mb-6 leading-[180%] tracking-[-1%] text-justify">
                            Inflexions offers flexible engagement models designed to provide the right
                            level of support and expertise for your specific requirements. Whether you
                            need targeted project assistance, ongoing management, or responsive support,
                            we have a service model that fits.
                        </p>
                        <button
                            className="
          bg-[#BD2E25] hover:bg-[#A02923]
          text-white font-medium
          py-3 px-8
          transition mt-6
        "
                        >
                            Contact now
                        </button>
                    </div>
                </div>
            </section>

            <section className="container mx-auto px-4 lg:px-[200px] 4xl:px-[250px] 4xl:ml-[50px] lg:ml-0 md:ml-0 ml-0 py-12">
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
                            <h3 className="text-xl md:text-[25px] leading-[20px] font-normal tracking-[-1%] text-[#1B3764] my-4 flex flex-col">
                                Professional Services:
                                <span className="text-[16px] leading-[20px] font-normal tracking-[-1%]">
                                    {' '}Expert Guidance for Strategic IT Initiatives
                                </span>
                            </h3>
                            <p className="text-[#666C89] text-[16px] leading-normal tracking-[-1%] mb-4 w-full lg:w-[405px] text-justify">
                                Leverage our deep technical expertise for specific projects and strategic consulting. Our
                                Professional Services team provides IT assessments, technology roadmapping, solution design,
                                complex implementations, migrations, and upgrades. We work collaboratively with your team to
                                ensure successful project outcomes aligned with your business objectives.
                            </p>
                            <p className="text-[#666C89] text-[16px] leading-normal tracking-[-1%] mb-6 w-full lg:w-[405px] text-justify">
                                <b className="text-[#666C89]">Ideal For</b>: Businesses needing expert help with specific
                                technology implementations, upgrades, migrations, or strategic IT planning.
                            </p>
                            <button className="bg-[#BD2E25] hover:bg-[#A02923] text-white font-medium py-4 px-6 md:px-10 transition">
                                Review
                            </button>
                        </div>
                    </div>

                    {/* Right image */}
                    <div className="w-full md:w-1/2">
                        <img
                            src={service2}
                            alt="Professional Services"
                            className="w-full h-auto lg:h-[559px] object-cover shadow-lg"
                        />
                    </div>
                </div>
            </section>

            <section className="container mx-auto px-4 lg:px-[200px] 4xl:px-[250px] 4xl:ml-[50px] lg:ml-0 md:ml-0 ml-0 py-12">
                <div className="flex flex-col md:flex-row items-center gap-8">


                    {/* Right image */}
                    <div className="w-full md:w-1/2">
                        <img
                            src={service3}
                            alt="Professional Services"
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
                            <h3 className="text-xl md:text-[25px] leading-[20px] font-normal tracking-[-1%] text-[#1B3764] my-4 flex flex-col">
                                Managed Services:
                                <span className="text-[16px] leading-[20px] font-normal tracking-[-1%] lg:w-[316px]">
                                    {' '}Proactive Management for Optimal Performance & Peace of Minds
                                </span>
                            </h3>
                            <p className="text-[#666C89] text-[16px] leading-normal tracking-[-1%] mb-10 w-full lg:w-[405px] text-justify">
                                Outsource the day-to-day management of your IT infrastructure to Inflexions. Our Managed Services provide proactive monitoring, maintenance, patch management, security oversight, helpdesk support, and performance reporting. Benefit from predictable costs, reduced downtime, enhanced security, and the freedom for your internal team to focus on strategic initiatives..
                                Ideal For: Organizations seeking predictable IT costs, improved system reliability, enhanced security posture, and expert ongoing management of their IT environment..
                            </p>

                            <button className="bg-[#BD2E25] hover:bg-[#A02923] text-white font-medium py-4 px-6 md:px-12 transition">
                                Get a Quote
                            </button>
                        </div>
                    </div>

                </div>
            </section>

            <section className="container mx-auto px-4 lg:px-[200px] 4xl:px-[250px] 4xl:ml-[50px] lg:ml-0 md:ml-0 ml-0 py-12">
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
                            <h3 className="text-xl md:text-[25px] leading-[20px] font-normal tracking-[-1%] text-[#1B3764] my-4 flex flex-col">
                                Support Services:
                                <span className="text-[16px] leading-[20px] font-normal tracking-[-1%]">
                                    {' '}Responsive and Reliable Technical Support
                                </span>
                            </h3>
                            <p className="text-[#666C89] text-[16px] leading-normal tracking-[-1%] mb-10 w-full lg:w-[405px] text-justify">
                                Ensure business continuity with timely and effective technical support. Our Support Services offer various tiers of assistance, from break/fix support for specific hardware or software issues to comprehensive helpdesk services for your end-users. Our experienced technicians are ready to resolve issues quickly and minimize disruption.
                                Ideal For: Businesses needing dependable technical assistance, troubleshooting, and issue resolution on an as-needed or contracted basis.
                            </p>
                            <button className="bg-[#BD2E25] hover:bg-[#A02923] text-white font-medium py-4 px-6 md:px-10 transition">
                                Explore package
                            </button>
                        </div>
                    </div>

                    {/* Right image */}
                    <div className="w-full md:w-1/2">
                        <img
                            src={service4}
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