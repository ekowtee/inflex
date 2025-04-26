/* eslint-disable no-unused-vars */
import React from 'react'
import Banner from '../components/Banner'
import aboutbg from "../assets/about/aboutsect.png"
import sol1 from "../assets/solutions/sol1.png"
import sol2 from "../assets/solutions/sol2.png"
import sol3 from "../assets/solutions/sol3.png"
import sol4 from "../assets/solutions/sol4.png"
import sol5 from "../assets/solutions/sol5.png"
import sol6 from "../assets/solutions/sol6.png"
import sol7 from "../assets/solutions/sol7.png"
import sol8 from "../assets/solutions/sol8.png"
import MainPartners from '../components/MainPartners'
import TestimonialSlider from '../components/TestimonialSlider'




const Solutions = () => {
    return (
        <div>
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
                                    Integrated IT <br className="hidden lg:block" />
                                    Solutions to Power <br className="hidden lg:block" />Your Business Engines
                                </h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className=" py-12 container mx-auto px-4 lg:px-[200px] 4xl:px-[250px]">
                <h1 className="text-4xl font-bold mb-8">Technology Solutions</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Red panel with text */}
                    <div className="bg-red-600 p-8 text-white flex items-center">
                        <p className="text-lg leading-relaxed">
                            Inflexions offers a comprehensive portfolio of technology solutions designed to address the core
                            infrastructure, operational, and strategic needs of modern businesses. We don’t just provide technology; we
                            architect integrated solutions tailored to drive your specific business outcomes—from enhancing
                            operational efficiency and security to enabling innovation and market expansion.
                        </p>
                    </div>

                    {/* Images grid on the right */}
                    <div className="grid grid-cols-2 grid-rows-2 gap-4">
                        {/* Top left image */}
                        <div className="rounded-lg overflow-hidden">
                            <img
                                src={sol2}
                                alt="Team collaborating on technology solutions"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Top right image */}
                        <div className="rounded-lg overflow-hidden">
                            <img
                                src={sol1}
                                alt="Professional working with technology"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Bottom spanning image */}
                        <div className="col-span-2 rounded-lg overflow-hidden">
                            <img
                                src={sol3}
                                alt="Data visualization and analytics dashboard"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <section className="py-12 container mx-auto px-4 sm:px-6 md:px-8 lg:px-[200px] 4xl:px-[250px]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* LEFT COLUMN: Headline */}
                    <div className="flex items-center justify-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-snug text-center md:text-left">
                            Integrated Solutions<br />
                            to Power Your<br />
                            Business Engine
                        </h2>
                    </div>

                    {/* RIGHT COLUMNS: Four Info Cards */}
                    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">

                        {/* Card 1 */}
                        <div className="border-l-2 border-gray-200 pl-6">
                            <h3 className="text-xl font-semibold text-gray-900">Network Infrastructure</h3>
                            <p className="mt-1 text-lg font-medium text-gray-800">
                                Building your high performance Digital Backbone
                            </p>
                            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                                Leverage the right hardware foundation. We procure, configure, and support servers, storage solutions (SAN, NAS, Cloud), and end-user devices, ensuring optimal performance, data availability, and lifecycle management aligned with your budget and needs.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="border-l-2 border-gray-200 pl-6">
                            <h3 className="text-xl font-semibold text-gray-900">Data-Science</h3>
                            <p className="mt-1 text-lg font-medium text-gray-800">
                                Secure, Efficient, and Resilient Datacentre Solutions
                            </p>
                            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                                Whether on-premise, co-located, or hybrid, your datacentre is the heart of your IT. We provide design, consolidation, migration, and management services for datacentres, focusing on power, cooling, security, and operational efficiency.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="border-l-2 border-gray-200 pl-6">
                            <h3 className="text-xl font-semibold text-gray-900">Cloud Service</h3>
                            <p className="mt-1 text-lg font-medium text-gray-800">
                                Harnessing the Power and Agility of the Cloud
                            </p>
                            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                                Navigate your cloud journey with confidence. We offer cloud strategy consulting, migration services (AWS, Azure, Google Cloud), hybrid cloud integration, and cloud management, enabling scalability, cost-efficiency, and innovation.
                            </p>
                        </div>

                        {/* Card 4 */}
                        <div className="border-l-2 border-gray-200 pl-6">
                            <h3 className="text-xl font-semibold text-gray-900">Data-centre Solutions</h3>
                            <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                                Following the quality of our service thus having gained the trust of our many clients.
                            </p>
                        </div>

                    </div>
                </div>
            </section>

            <section>
                <div className='relative w-full h-[1900px] md:h-[700px] lg:h-[750px]'>
                    <img
                        src={sol4}
                        alt="About NFLEXIONS-IT"
                        className="w-full h-[504px] object-cover"
                        loading="lazy"
                    />
                    <div className='absolute lg:bottom-10 md:bottom-10 lg:left-[200px] 4xl:left-[250px] w-full lg:w-[1110px] 4xl:w-[1400px] lg:h-[389px] flex gap-4 md:gap-2 lg:gap-0
                    lg:flex-row md:flex-row flex-col items-center justify-between'>
                        <div className='relative shadow-md'>
                            <img src={sol6} alt='sect' loading='lazy' className='w-[260px] h-full object-cover' />
                            <div className='absolute bottom-0 left-4 flex flex-col'>
                                <span className='text-white text-[18px] leading-[21px]'>Liquid Transportation</span>
                                <span className='text-[#BD2E25] text-[14px] font-medium'>Premium Tankers</span>
                            </div>
                        </div>
                        <div className='relative'>
                            <img src={sol5} alt='sect' loading='lazy' className='w-[260px] h-full object-cover' />
                            <div className='absolute bottom-0 left-4 flex flex-col'>
                                <span className='text-white text-[18px] leading-[21px]'>Packaging Solutions</span>
                                <span className='text-[#BD2E25] text-[14px] font-medium'>Warehouse Management</span>
                            </div>
                        </div>
                        <div className='relative'>
                            <img src={sol7} alt='sect' loading='lazy' className='w-[260px] h-full object-cover' />
                            <div className='absolute bottom-0 left-4 flex flex-col'>
                                <span className='text-white text-[18px] leading-[21px]'>Contract Logistics</span>
                                <span className='text-[#BD2E25] text-[14px] font-medium'>Road Transportation</span>
                            </div>
                        </div>
                        <div className='relative'>
                            <img src={sol8} alt='sect' loading='lazy' className='w-[260px] h-full object-cover' />
                            <div className='absolute bottom-0 left-4 flex flex-col'>
                                <span className='text-white text-[18px] leading-[21px]'>Warehouse & Distribution</span>
                                <span className='text-[#BD2E25] text-[14px] font-medium'>Large Warehouse</span>
                            </div>
                        </div>
                    </div>
                </div>

            </section>
            <MainPartners />
            <TestimonialSlider />
            <Banner />
        </div>
    )
}

export default Solutions