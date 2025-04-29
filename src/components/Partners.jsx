/* eslint-disable no-unused-vars */
/* src/components/Partners.jsx */
import React from 'react'
import "./Global.css"
import partner1 from '../assets/partners/partner1.png'
import partner2 from '../assets/partners/partner2.png'
import partner3 from '../assets/partners/partner3.png'
import partner4 from '../assets/partners/partner4.png'
import partner5 from '../assets/partners/partner5.png'
import partner6 from '../assets/partners/partner6.png'
import partner7 from '../assets/partners/partner7.png'
import partner8 from '../assets/partners/partner8.png'
import partner9 from '../assets/partners/partner9.png'
import partner10 from '../assets/partners/partner10.png'
import partner11 from '../assets/partners/partner11.png'
import partner12 from '../assets/partners/partner12.png'
import partner13 from '../assets/partners/partner13.png'

const logos = [
    { src: partner1, alt: 'NOVA' },
    { src: partner2, alt: 'Belle Vista' },
    { src: partner3, alt: 'Niobe' },
    { src: partner4, alt: 'Rabito Clinic' },
    { src: partner5, alt: 'DSTRKT4' },
    { src: partner6, alt: 'Partner 6a' },
    { src: partner7, alt: 'Partner 6b' },
    { src: partner8, alt: 'Labianca' },
    { src: partner9, alt: 'Drop Shape' },
    { src: partner10, alt: 'Spectro' },
    { src: partner11, alt: 'POLYTANK' },
    { src: partner12, alt: 'Woodin' },
    { src: partner13, alt: 'Decorzone' },
]

export default function Partners() {
    // duplicate array for seamless loop
    const repeated = [...logos, ...logos]

    return (
        <div className="overflow-hidden w-full py-6 px-4 md:px-12 lg:px-[200px] 4xl:px-[250px]">
            <div className="flex items-center justify-center mb-4">
                <h1 className="text-[30px] font-normal leading-[38px]">Our Partners</h1>
            </div>
            <div className="flex animate-scroll whitespace-nowrap">
                {repeated.map((logo, idx) => (
                    <img
                        key={idx}
                        src={logo.src}
                        alt={logo.alt}
                        className="inline-block h-[67px] object-contain mx-6"
                        loading="lazy"
                    />
                ))}
            </div>
        </div>
    )
}
