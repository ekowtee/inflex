/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { ChevronRight, Phone } from 'lucide-react'
import faq from '../assets/career/faq.png'


import AOS from 'aos';
import 'aos/dist/aos.css';

const FAQ_ITEMS = [
    {
        question: 'How can I pay for your tech services?',
        answer:
            'We accept all major credit and debit cards, bank transfers, and popular digital wallets like PayPal and Stripe for fast, secure payments.',
    },
    {
        question: 'What payment methods are supported?',
        answer:
            'Our platform supports Visa, MasterCard, American Express, ACH bank transfers, and digital wallets including PayPal and Apple Pay to give you maximum flexibility.',
    },
    {
        question: 'What options for tech plans are available?',
        answer:
            'We offer tiered plans from Basic Support (email and ticketing) up to Enterprise Managed Services with 24/7 monitoring, dedicated account management, and custom integrations to fit organizations of any size.',
    },
    {
        question: 'Can I specify a quotation date when ordering?',
        answer:
            'Absolutely—you can choose your preferred quote delivery date during checkout or by contacting our sales team. We’ll prepare and send your customized estimate on the date you request.',
    },
]

export default function Faq() {
    const [openIndex, setOpenIndex] = useState(0)


    useEffect(() => {
        AOS.init({
            duration: 3000,
        });
        AOS.refresh();
    }, []);

    return (
        <section className="bg-gray-50 py-12">
            <div className="container mx-auto px-4 lg:px-0 lg:pl-[240px] grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

                {/* Left: FAQ */}
                <div className="w-full md:w-[500px]">
                    <span className="inline-block border-l-4 border-yellow-400 bg-white px-2 py-1 text-sm font-medium text-gray-700 mb-2">
                        FAQ
                    </span>
                    <h2 className="text-3xl font-semibold text-gray-900 mb-6">
                        Frequently Asked <br /> Questions
                    </h2>
                    <ul className="space-y-4">
                        {FAQ_ITEMS.map((item, idx) => {
                            const isOpen = idx === openIndex
                            return (
                                <li key={idx} className="border-b border-gray-200 pb-4">
                                    <button
                                        onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                                        className="w-full flex justify-between items-center text-left text-gray-800"
                                    >
                                        <span className="text-lg">{item.question}</span>
                                        <ChevronRight
                                            size={24}
                                            className={`transform transition-transform duration-200 ${isOpen ? 'rotate-90' : ''
                                                }`}
                                        />
                                    </button>
                                    {isOpen && item.answer && (
                                        <p className="mt-2 text-gray-600">{item.answer}</p>
                                    )}
                                </li>
                            )
                        })}
                    </ul>
                </div>

                {/* Right: Hero image + consultation box */}
                <div className="relative w-full md:hidden lg:block">
                    <img
                        src={faq}
                        alt="Consultation"
                        className="w-full h-auto object-cover"
                    />
                    <div
                        className="
          absolute top-[25%]
          left-0 right-0 lg:left-[-80px]
          flex md:justify-start justify-center
          items-center
        "
                    >
                        <div data-aos="fade-up" className="bg-[#BD2E25] text-white p-8 max-w-sm shadow-lg transform scale-50 md:scale-100">
                            <h3 className="text-xl font-semibold mb-4">
                                You Need Any Help? Get Free Consultation
                            </h3>
                            <div className="flex items-center mb-6">
                                <div className="bg-white/20 p-3 rounded-full mr-3">
                                    <Phone className="text-white" size={20} />
                                </div>
                                <div>
                                    <p className="text-sm">Have Any Questions</p>
                                    <p className="font-medium">(233) 208 889 270</p>
                                </div>
                            </div>
                            <button className="bg-white text-[#BD2E25] px-6 py-2 font-medium hover:bg-gray-100 transition">
                                Contact Us
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </section>

    )
}
