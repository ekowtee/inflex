/* eslint-disable no-unused-vars */
import React from 'react'

// 1. UPDATE these import paths to match your actual filenames:
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

const Partners = () => {
    return (
        <div className="w-full py-6 px-4 md:px-12 lg:px-[200px] 4xl:px-[250px]">
            <div className='flex items-center justify-center mb-4'>
                <h1 className='text-[30px] font-normal leading-[38px]'>Our Partners</h1>
            </div>
            <div className="container mx-auto flex flex-wrap gap-6 items-center justify-between">
                <img
                    src={partner1}
                    alt="NOVA"
                    className="h-[67px] object-contain"
                    loading="lazy"
                />
                <img
                    src={partner2}
                    alt="Belle Vista"
                    className="h-[67px] object-contain"
                    loading="lazy"
                />
                <img
                    src={partner3}
                    alt="Niobe"
                    className="h-[67px] object-contain"
                    loading="lazy"
                />
                <img
                    src={partner4}
                    alt="Rabito Clinic"
                    className="h-[67px] object-contain"
                    loading="lazy"
                />
                <img
                    src={partner5}
                    alt="DSTRKT4"
                    className="h-[67px] object-contain"
                    loading="lazy"
                />
                <img
                    src={partner6}
                    alt="Partner 6a"
                    className="h-[67px] object-contain"
                    loading="lazy"
                />
                <img
                    src={partner7}
                    alt="Partner 6b"
                    className="h-[67px] object-contain"
                    loading="lazy"
                />
                <img
                    src={partner8}
                    alt="Labianca"
                    className="h-[67px] object-contain"
                    loading="lazy"
                />
                <img
                    src={partner9}
                    alt="Drop Shape"
                    className="h-[67px] object-contain"
                    loading="lazy"
                />
                <img
                    src={partner10}
                    alt="Spectro"
                    className="h-[67px] object-contain"
                    loading="lazy"
                />
                <img
                    src={partner11}
                    alt="POLYTANK"
                    className="h-[67px] object-contain"
                    loading="lazy"
                />
                <img
                    src={partner12}
                    alt="Woodin"
                    className="h-[67px] object-contain"
                    loading="lazy"
                />
                <img
                    src={partner13}
                    alt="Decorzone"
                    className="h-[67px] object-contain"
                    loading="lazy"
                />
            </div>
        </div>
    )
}

export default Partners
