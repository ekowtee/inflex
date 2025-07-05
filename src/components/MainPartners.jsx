/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from 'react'
import map from "../assets/hero/map.png"

import part1 from "../assets/hero/micro.png"
import part2 from "../assets/hero/aws.png"
import part3 from "../assets/hero/cisco.png"
import part4 from "../assets/hero/part4.png"
import part5 from "../assets/hero/part5.png"
import part6 from "../assets/hero/part6.png"
import part7 from "../assets/hero/part7.png"
import part8 from "../assets/hero/part8.png"
import part9 from "../assets/hero/part9.png"
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Link } from 'react-router-dom'

const partners = [part1, part2, part3, part4, part5, part6, part7, part8, part9];

const MainPartners = () => {
    const [mounted, setMounted] = useState(false);
    const refs = useRef([]);
    const [inView, setInView] = useState(partners.map(() => false));

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        AOS.init({ duration: 3000 });
        AOS.refresh();
    }, []);

    // IntersectionObserver to toggle inView on scroll in/out
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    const idx = refs.current.indexOf(entry.target);
                    if (idx !== -1) {
                        setInView(prev => {
                            const next = [...prev];
                            next[idx] = entry.isIntersecting;
                            return next;
                        });
                    }
                });
            },
            { threshold: 0.1 }
        );
        refs.current.forEach(el => el && observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const base = "transform transition-all duration-[600ms] ease-out";

    return (
        <section className='container mx-auto px-4 lg:pl-[240px] 4xl:pl-[240px] lg:pr-[160px]'>
            <div className='flex flex-col md:flex-col lg:flex-row w-full lg:h-[500px]'>
                <div className='flex-1 flex md:flex-col pt-0 lg:pt-20 md:pt-0'>
                    <div className='w-[403px] h-[353px] mb-4 md:mb-0 lg:mb-0'>
                        <div className='lg:w-[403px] lg:h-[100px]'>
                            <h3 data-aos="fade-right" className='font-bold text-[33px] leading-[50px] tracking-[1.04px] mb-10'>
                                Proven Expertise,<br />Tangible Results
                            </h3>
                            <div data-aos="fade-up" className='font-normal text-[17px] leading-[27.1px]'>
                                Engineering the Future of Business, <br />
                                One Solution at a Time
                            </div>
                            <div data-aos="fade-right" className='w-[285px] lg:mt-[105px] mt-10 h-[50px] bg-[#BD2E25] flex items-center justify-center'>
                                <Link to="/case-studies" className="text-white font-semibold">
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
                            <p className="text-black mt-2 font-bold text-[21px] leading-[25px]">
                                Our Technology Partners
                            </p>
                            <div className="grid grid-cols-[repeat(2,1fr)] md:grid-cols-[repeat(3,1fr)] grid-rows-[repeat(4,1fr)] md:grid-rows-[repeat(3,1fr)] gap-y-[30px] gap-x-2 md:gap-x-[25px] mt-4">
                                {partners.map((logo, i) => (
                                    <div
                                        key={i}
                                        ref={el => refs.current[i] = el}
                                        className={`
                      ${base}
                      bg-white w-[150.52px] h-[83.12px]
                      flex items-center justify-center
                      rounded-[10px] shadow-md
                      ${inView[i] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                    `}
                                        style={{ transitionDelay: `${i * 300}ms` }}
                                    >
                                        <img
                                            src={logo}
                                            alt="partner"
                                            className="w-[100px] h-[42px] object-contain"
                                            loading="lazy"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default MainPartners;
