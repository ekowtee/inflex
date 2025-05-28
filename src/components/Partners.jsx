/* eslint-disable no-unused-vars */
/* src/components/Partners.jsx */
import React from 'react'
import "./Global.css"
import client1 from '../assets/partners/part1.svg'
import client2 from '../assets/partners/part2.png'
import client3 from '../assets/partners/part3.png'
import client4 from '../assets/partners/part4.png'
import client5 from '../assets/partners/part5.png'
import client6 from '../assets/partners/part6.png'
import client7 from '../assets/partners/part7.png'
import client8 from '../assets/partners/part8.png'


const logos = [
    { src: client1, alt: 'NOVA' },
    { src: client2, alt: 'Belle Vista' },
    { src: client3, alt: 'Niobe' },
    { src: client4, alt: 'Rabito Clinic' },
    { src: client5, alt: 'DSTRKT4' },
    { src: client6, alt: 'client 6a' },
    { src: client7, alt: 'client 6b' },
    { src: client8, alt: 'Labianca' },

]

export default function Partners() {


    return (
        <div className="overflow-hidden w-full py-6 md:py-10 px-4">
            <div className="flex items-center justify-center mb-4">
                <h1 className="text-[30px] font-normal leading-[38px]">Our Partners</h1>
            </div>
            <div className='py-5'>
                <div className="wrapper">
                    <img src={client1} alt="brand" className="item item1 " loading="lazy" />
                    <img src={client2} alt="brand" className=" item item2 " loading="lazy" />
                    <img src={client3} alt="brand" className=" item item3 " loading="lazy" />
                    <img src={client4} alt="brand" className=" item item4 " loading="lazy" />
                    <img src={client5} alt="brand" className=" item item5 " loading="lazy" />
                    <img src={client6} alt="brand" className=" item item6 " loading="lazy" />
                    <img src={client7} alt="brand" className=" item item7 " loading="lazy" />
                    <img src={client8} alt="brand" className=" item item8 " loading="lazy" />
                </div>
            </div>
        </div>
    )
}
