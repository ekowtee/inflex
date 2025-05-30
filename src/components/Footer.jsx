/* eslint-disable no-unused-vars */
import React from 'react'
import { Link } from 'react-router-dom'
import { Mail, Phone } from 'lucide-react'
import logo from '../assets/logo.png'


export default function Footer() {
    return (
        <footer className="bg-white">
            <div className="container mx-auto px-4 lg:pl-[200px] 4xl:pl-[200px] pr-[160px] py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    {/* 1) Logo & Contact */}
                    <div className="space-y-6">
                        <img src={logo} alt="Inflexions-IT" className="h-12" />

                        <div className="space-y-4 mt-8">
                            <div className="flex items-center">
                                <div className="bg-[#BD2E25] rounded-full p-3 mr-4">
                                    <Mail className="h-5 w-5 text-white" />
                                </div>
                                <div className=''>
                                    <p className="font-medium">Email</p>
                                    <p className="text-gray-600">
                                        <a href="mailto:info@inflexions.tech" className="underline hover:text-blue-600">
                                            info@inflexions.tech
                                        </a> {' '}
                                        <a href="mailto:sales@inflexions.tech" className="underline hover:text-blue-600">
                                            sales@inflexions.tech
                                        </a>
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="bg-[#BD2E25] rounded-full p-3 mr-4">
                                    <Phone className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="font-medium">Call Us</p>
                                    <p className="text-gray-600">(0) 208 889 270</p>
                                    <p className="text-gray-600">(0) 205 179 937</p>

                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2) Pages */}
                    <div>
                        <h3 className="text-xl font-bold mb-6 lg:mb-10">Pages</h3>
                        <ul className="space-y-4 text-black">
                            <li>
                                <Link to="/about" className="hover:text-[#BD2E25]">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/solution" className="hover:text-[#BD2E25]">
                                    Solution
                                </Link>
                            </li>
                            <li>
                                <Link to="/services" className="hover:text-[#BD2E25]">
                                    Services
                                </Link>
                            </li>
                            <li>
                                <Link to="/ccase-studies" className="hover:text-[#BD2E25]">
                                    Case study
                                </Link>
                            </li>
                            <li>
                                <Link to="/careers" className="hover:text-[#BD2E25]">
                                    Careers
                                </Link>
                            </li>
                            <li>
                                <Link to="/resources" className="hover:text-[#BD2E25]">
                                    Resources
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* 3) Access */}
                    <div>
                        <h3 className="text-xl font-bold mb-6 lg:mb-10">Access</h3>
                        <ul className="space-y-4 text-black">
                            <li>
                                <Link to="/resouces" className="hover:text-[#BD2E25]">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link to="/privacy" className="hover:text-[#BD2E25]">
                                    Privacy
                                </Link>
                            </li>
                            {/* <li>
                                <Link to="/temporary" className="hover:text-[#BD2E25]">
                                    Temporary
                                </Link>
                            </li> */}
                        </ul>
                    </div>

                    {/* 4) Subscribe */}
                    <div>
                        <h3 className="text-xl font-bold mb-6 lg:mb-10">Subscribe</h3>
                        <div className="space-y-4">
                            <input
                                type="email"
                                placeholder="Enter Email here*"
                                className="lg:w-full md:w-[250px] w-[300px] border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-[#BD2E25]"
                            />
                            <div className="flex md:flex-row lg:flex-row items-center lg:w-full md:w-[250px] w-[300px] gap-16">
                                {/* Social icons first */}
                                <div className="flex lg:mr-auto space-x-4 md:mb-4 lg:mb-0 text-gray-600">
                                    <Link to="https://linkedin.com" className="hover:text-[#BD2E25]">
                                        {/* LinkedIn SVG */}
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
                                    </Link>
                                    <Link to="https://twitter.com" className="hover:text-[#BD2E25]">
                                        {/* Twitter SVG */}
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
                                    </Link>
                                    <Link to="https://facebook.com" className="hover:text-[#BD2E25]">
                                        {/* Facebook SVG */}
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                                    </Link>
                                </div>

                                {/* Then the button */}
                                <button className="bg-[#BD2E25] text-white px-6 py-3 hover:bg-[#BD2E25] transition-colors">
                                    Send Now
                                </button>
                            </div>
                        </div>
                    </div>


                </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-[#4E5683]">
                <div className="container mx-auto px-4 lg:px-[200px] 4xl:px-[250px] py-6">
                    <div className="flex flex-wrap justify-end gap-6 text-sm text-[#8388A7]">
                        <Link to="/style-guide" className="hover:text-red-600">Style Guide</Link>
                        <Link to="/licenses" className="hover:text-red-600">Licenses</Link>
                        <Link to="/changelog" className="hover:text-red-600">Changelog</Link>
                        <Link to="/password" className="hover:text-red-600">Password</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}