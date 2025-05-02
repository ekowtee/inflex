/* eslint-disable no-unused-vars */
/* src/components/Partners.jsx */
import React from 'react'
import "./Global.css"
import partner1 from '../assets/partners/part1.svg'
import partner2 from '../assets/partners/part2.png'
import partner3 from '../assets/partners/part3.png'
import partner4 from '../assets/partners/part4.png'
import partner5 from '../assets/partners/part5.png'
import partner6 from '../assets/partners/part6.png'
import partner7 from '../assets/partners/part7.png'
import partner8 from '../assets/partners/part8.png'


const logos = [
    { src: partner1, alt: 'NOVA' },
    { src: partner2, alt: 'Belle Vista' },
    { src: partner3, alt: 'Niobe' },
    { src: partner4, alt: 'Rabito Clinic' },
    { src: partner5, alt: 'DSTRKT4' },
    { src: partner6, alt: 'Partner 6a' },
    { src: partner7, alt: 'Partner 6b' },
    { src: partner8, alt: 'Labianca' },

]

export default function Partners() {
    // duplicate array for seamless loop
    const repeated = [...logos, ...logos]

    return (
        <div className="overflow-hidden w-full py-6 md:py-10 px-4 md:px-12 lg:px-[200px] 4xl:px-[250px]">
            <div className="flex items-center justify-center mb-4">
                <h1 className="text-[30px] font-normal leading-[38px]">Our Partners</h1>
            </div>
            <div className="flex animate-scroll whitespace-nowrap">
                {repeated.map((logo, idx) => (
                    <img
                        key={idx}
                        src={logo.src}
                        alt={logo.alt}
                        className="inline-block h-12 object-contain mx-6"
                        loading="lazy"
                    />
                ))}
            </div>
        </div>
    )
}
