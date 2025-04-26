/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaInstagram, FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa'
import { FiMenu, FiX } from 'react-icons/fi'
import logo from '../assets/logo.png'

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <header className="w-full bg-white shadow-sm">
            <div
                className="
          container mx-auto
          px-4 sm:px-6 md:px-8
          lg:px-12
          xl:px-20
          2xl:px-40
          flex items-center justify-between
          h-[70px]
        "
            >
                {/* Logo */}
                <div className="flex-shrink-0">
                    <Link to="/">
                        <img src={logo} alt="INFLEXIONS-IT" className="h-10 w-auto" />
                    </Link>
                </div>

                {/* Hamburger button: visible on all screens below lg */}
                <div className="lg:hidden">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="text-[#5C5D5D] hover:text-red-600 focus:outline-none"
                    >
                        {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                </div>

                {/* Desktop Navigation & Social (lg and up) */}
                <nav className="hidden lg:flex items-center space-x-8">
                    <Link to="/" className="text-[#5C5D5D] hover:text-red-600 font-medium">
                        Home
                    </Link>
                    <Link to="/about" className="text-[#5C5D5D] hover:text-red-600 font-medium">
                        About
                    </Link>
                    <Link to="/solutions" className="text-[#5C5D5D] hover:text-red-600 font-medium">
                        Solutions
                    </Link>
                    <Link to="/services" className="text-[#5C5D5D] hover:text-red-600 font-medium">
                        Services
                    </Link>
                    <Link to="/case-studies" className="text-[#5C5D5D] hover:text-red-600 font-medium">
                        Case study
                    </Link>
                    <Link to="/careers" className="text-[#5C5D5D] hover:text-red-600 font-medium">
                        Careers
                    </Link>
                </nav>

                <div className="hidden lg:flex items-center space-x-4">
                    <div className="flex items-center space-x-3 mr-4">
                        <Link to="#" className="text-gray-500 hover:text-[#5C5D5D]">
                            <FaInstagram size={20} />
                        </Link>
                        <Link to="#" className="text-gray-500 hover:text-[#5C5D5D]">
                            <FaFacebookF size={20} />
                        </Link>
                        <Link to="#" className="text-gray-500 hover:text-[#5C5D5D]">
                            <FaTwitter size={20} />
                        </Link>
                        <Link to="#" className="text-gray-500 hover:text-[#5C5D5D]">
                            <FaLinkedinIn size={20} />
                        </Link>
                    </div>
                    <Link
                        to="/contact"
                        className="bg-red-600 hover:bg-red-700 w-[194px] h-[70px] text-white flex items-center justify-center font-medium transition-colors"
                    >
                        Contact us
                    </Link>
                </div>
            </div>

            {/* Mobile / MD menu: visible below lg when open */}
            {isMenuOpen && (
                <div className="lg:hidden bg-white border-t">
                    <div className="container mx-auto px-4 py-3 space-y-3">
                        <Link
                            to="/"
                            onClick={() => setIsMenuOpen(false)}
                            className="block text-gray-700 hover:text-red-600 font-medium py-2"
                        >
                            Home
                        </Link>
                        <Link
                            to="/about"
                            onClick={() => setIsMenuOpen(false)}
                            className="block text-gray-700 hover:text-red-600 font-medium py-2"
                        >
                            About
                        </Link>
                        <Link
                            to="/solutions"
                            onClick={() => setIsMenuOpen(false)}
                            className="block text-gray-700 hover:text-red-600 font-medium py-2"
                        >
                            Solutions
                        </Link>
                        <Link
                            to="/services"
                            onClick={() => setIsMenuOpen(false)}
                            className="block text-gray-700 hover:text-red-600 font-medium py-2"
                        >
                            Services
                        </Link>
                        <Link
                            to="/case-studies"
                            onClick={() => setIsMenuOpen(false)}
                            className="block text-gray-700 hover:text-red-600 font-medium py-2"
                        >
                            Case study
                        </Link>
                        <Link
                            to="/careers"
                            onClick={() => setIsMenuOpen(false)}
                            className="block text-gray-700 hover:text-red-600 font-medium py-2"
                        >
                            Careers
                        </Link>

                        <div className="flex items-center space-x-3 py-2">
                            <Link to="#" className="text-gray-500 hover:text-gray-700">
                                <FaInstagram size={20} />
                            </Link>
                            <Link to="#" className="text-gray-500 hover:text-gray-700">
                                <FaFacebookF size={20} />
                            </Link>
                            <Link to="#" className="text-gray-500 hover:text-gray-700">
                                <FaTwitter size={20} />
                            </Link>
                            <Link to="#" className="text-gray-500 hover:text-gray-700">
                                <FaLinkedinIn size={20} />
                            </Link>
                        </div>

                        <Link
                            to="/contact"
                            onClick={() => setIsMenuOpen(false)}
                            className="block bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-sm font-medium transition-colors text-center"
                        >
                            Contact us
                        </Link>
                    </div>
                </div>
            )}
        </header>
    )
}
