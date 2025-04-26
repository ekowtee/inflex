/* eslint-disable no-unused-vars */
import React from 'react'
import map from "../assets/hero/map.png"
import { Link } from 'react-router-dom'

import part1 from "../assets/hero/part1.png"
import part2 from "../assets/hero/part2.png"
import part3 from "../assets/hero/part3.png"
import part4 from "../assets/hero/part4.png"
import part5 from "../assets/hero/part5.png"
import part6 from "../assets/hero/part6.png"
import part7 from "../assets/hero/part7.png"
import part8 from "../assets/hero/part8.png"
import part9 from "../assets/hero/part9.png"

const MainPartners = () => {
    return (
        <section className='container mx-auto px-4 lg:px-[200px] 4xl:px-[250px]'>
            <div className='flex flex-col md:flex-col lg:flex-row w-full lg:h-[500px]'>
                <div className='flex-1 flex md:flex-col pt-0 lg:pt-20 md:pt-0'>
                    <div className='w-[403px] h-[353px] mb-4 md:mb-0 lg:mb-0'>
                        <div className='lg:w-[403px] lg:h-[100px]'>
                            <h3 className='font-light text-[33px] leading-[50px] tracking-[1.04px] mb-10'>
                                Proven Expertise,<br />Training Solutions
                            </h3>

                            <span className='font-normal text-[17px] leading-[27.1px]'>
                                Curriculum tailored to your organization, delivered with white-glove service and support
                            </span>

                            <div
                                className='
                                        w-[285px] lg:mt-[105px] mt-10
                                        h-[50px] 
                                        bg-[#BD2E25] 
                                        flex items-center justify-center
                                      '
                            >
                                <Link to="#" className="text-white font-semibold">
                                    View our Case studies
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex-1 pt-0 lg:pt-10 md:pt-0">
                    <div
                        className="relative w-full lg:h-[457px] bg-cover bg-center"
                        style={{ backgroundImage: `url(${map})` }}
                    >

                        {/* actual text wrapper, above the overlay */}
                        <div className="relative z-10 lg:p-8 p-0">
                            <p className="text-black mt-2 font-medium text-[21px] leading-[25px]">
                                Our Technology Partners
                            </p>

                            <div className="grid grid-cols-[repeat(2,1fr)] md:grid-cols-[repeat(3,1fr)] grid-rows-[repeat(4,1fr)] md:grid-rows-[repeat(3,1fr)] gap-y-[30px] gap-x-2 md:gap-x-[25px] mt-4">
                                <div className='bg-white w-[150.52px] h-[83.12px] flex items-center justify-center rounded-[10px] shadow-md'>
                                    <img src={part1} alt='partner' className='w-[100px] h-[42px] object-contain' loading='lazy' />
                                </div>
                                <div className='bg-white w-[150.52px] h-[83.12px] flex items-center justify-center rounded-[10px] shadow-md'>
                                    <img src={part2} alt='partner' className='w-[100px] h-[42px] object-contain' loading='lazy' />

                                </div>
                                <div className='bg-white w-[150.52px] h-[83.12px] flex items-center justify-center rounded-[10px] shadow-md'>
                                    <img src={part3} alt='partner' className='w-[100px] h-[42px] object-contain' loading='lazy' />

                                </div>
                                <div className='bg-white w-[150.52px] h-[83.12px] flex items-center justify-center rounded-[10px] shadow-md'>
                                    <img src={part4} alt='partner' className='w-[100px] h-[42px] object-contain' loading='lazy' />

                                </div>
                                <div className='bg-white w-[150.52px] h-[83.12px] flex items-center justify-center rounded-[10px] shadow-md'>
                                    <img src={part5} alt='partner' className='w-[100px] h-[42px] object-contain' loading='lazy' />

                                </div>
                                <div className='bg-white w-[150.52px] h-[83.12px] flex items-center justify-center rounded-[10px] shadow-md'>
                                    <img src={part6} alt='partner' className='w-[100px] h-[42px] object-contain' loading='lazy' />

                                </div>
                                <div className='bg-white w-[150.52px] h-[83.12px] flex items-center justify-center rounded-[10px] shadow-md'>
                                    <img src={part7} alt='partner' className='w-[100px] h-[42px] object-contain' loading='lazy' />

                                </div>
                                <div className='bg-white w-[150.52px] h-[83.12px] flex items-center justify-center rounded-[10px] shadow-md'>
                                    <img src={part8} alt='partner' className='w-[100px] h-[42px] object-contain' loading='lazy' />

                                </div>
                                <div className='bg-white w-[150.52px] h-[83.12px] flex items-center justify-center rounded-[10px] shadow-md'>
                                    <img src={part9} alt='partner' className='w-[100px] h-[42px] object-contain' loading='lazy' />

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    )
}

export default MainPartners