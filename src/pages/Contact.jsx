/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react'
import casebg from "../assets/case/casebg.png"
import { FiMail, FiPhone, FiClock } from 'react-icons/fi'
import emailjs from '@emailjs/browser';
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Partners from "../components/Partners.jsx"
import Faq from "../components/Faq.jsx"


import AOS from 'aos';
import 'aos/dist/aos.css';


const Contact = () => {
    const formRef = useRef()
    const [sending, setSending] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        setSending(true)
        emailjs
            .sendForm('service_indt3ef', 'template_y76uids', formRef.current, {
                publicKey: 'qSj6aEZypD-snH-28',
                from_name: 'Inflex',
            })
            .then(
                () => {
                    toast.success('Message sent successfully!')
                    setSending(false)
                    formRef.current.reset()
                },
                () => {
                    toast.error('Failed to send, please try again.')
                    setSending(false)
                }
            )
    }

    useEffect(() => {
        AOS.init({
            duration: 3000,
        });
        AOS.refresh();
    }, []);
    return (
        <div>
            <div className="relative w-full h-[300px] md:h-[500px]">
                {/* Background image */}
                <img
                    src={casebg}
                    alt="About NFLEXIONS-IT"
                    className="w-full h-full object-cover"
                    loading="lazy"
                />

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/30" />

                {/* Content */}
                <div className="absolute inset-0 flex items-center">
                    <div className="container mx-auto px-4 md:px-8 lg:px-[240px] 4xl:px-[240px]">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-8">

                            {/* Left column */}
                            <div className="w-full md:w-2/2 text-white space-y-4">
                                <h2 data-aos="fade-right" className="text-2xl md:text-4xl lg:text-5xl font-bold leading-snug md:leading-[76px]">
                                    Proven Results: Client Success
                                    <br className="hidden lg:block" />
                                    Stories | Inflexions I.T. Services
                                </h2>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <section className="bg-[#F4F4F4] py-12">
                <div className="bg-[#BD2E25] w-[854px] lg:h-[824px] container mx-auto px-4 lg:px-[150px] py-10">
                    {/* Heading */}
                    <h2 className="text-3xl font-semibold text-white text-center mb-4">
                        Get in touch with us
                    </h2>
                    {/* Subheading */}
                    <p className="text-white text-center mb-12">
                        Leverage agile frameworks to provide a robust synopsis for strategy foster collaborative thinking to further the
                        overall value.
                    </p>

                    {/* Contact methods */}
                    <div className="flex flex-row items-center justify-center gap-12 mb-16">
                        <div className="flex flex-col items-center">
                            <div className="bg-[#A02923] p-4 rounded-full mb-2">
                                <FiMail className="text-white" size={24} />
                            </div>
                            <span className="text-white text-sm">info@inflexions.tech</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="bg-[#A02923] p-4 rounded-full mb-2">
                                <FiPhone className="text-white" size={24} />
                            </div>
                            <span className="text-white text-sm">(0) 208 889 270</span>
                        </div>
                        <div className="hidden md:flex flex-col items-center text-center">
                            <div className="bg-[#A02923] p-4 rounded-full mb-2">
                                <FiClock className="text-white" size={24} />
                            </div>
                            <span className="text-white text-sm">
                                Mon – Sat 9.00 – 18.00<br />Sunday Closed
                            </span>
                        </div>
                    </div>

                    {/* Contact form */}
                    <form ref={formRef} onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
                        <input
                            type="text"
                            name="user_name"
                            placeholder="Your name*"
                            required
                            className="w-full border border-white bg-transparent text-white placeholder-white p-3 focus:outline-none"
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="tel"
                                name="user_phone"
                                placeholder="Phone Number*"
                                required
                                className="w-full border border-white bg-transparent text-white placeholder-white p-3 focus:outline-none"
                            />
                            <input
                                type="email"
                                name="user_email"
                                placeholder="Email*"
                                required
                                className="w-full border border-white bg-transparent text-white placeholder-white p-3 focus:outline-none"
                            />
                        </div>

                        <textarea
                            name="message"
                            placeholder="Your Message"
                            className="w-full h-40 border border-white bg-transparent text-white placeholder-white p-3 focus:outline-none"
                        />

                        <div className="text-center">
                            <button
                                type="submit"
                                disabled={sending}
                                className="
                bg-white text-[#BD2E25] font-medium
                py-2 px-6
                hover:bg-gray-100
                transition-colors duration-200
                disabled:opacity-50
              "
                            >
                                {sending ? 'Sending...' : 'Submit Message'}
                            </button>
                        </div>
                    </form>

                    {/* Toast notifications */}
                    <ToastContainer
                        position="top-center"
                        autoClose={3000}
                        closeOnClick
                        pauseOnHover={false}
                        draggable={false}
                        theme="colored"
                    />
                </div>
            </section>

            <section>
                <Partners />
            </section>

            <section>
                <Faq />
            </section>

        </div>
    )
}

export default Contact