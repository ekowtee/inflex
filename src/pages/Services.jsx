/* eslint-disable no-unused-vars */
import React from 'react'
import servicebg from "../assets/services/servicebg.png"

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
        </div>
    )
}

export default Services