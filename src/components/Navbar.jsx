/* eslint-disable no-unused-vars */
// src/components/Navbar.jsx
import React, { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import {
    FaInstagram,
    FaFacebookF,
    FaTwitter,
    FaLinkedinIn,
} from 'react-icons/fa'
import { FiMenu, FiX } from 'react-icons/fi'
import logo from '../assets/logo.png'

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    // Shared function for link classes
    const navLinkClasses = ({ isActive }) =>
        `pb-2 border-b-4 transition-colors duration-200 font-medium
     ${isActive
            ? 'text-red-600 border-red-600'
            : 'text-[#5C5D5D] border-transparent'} 
     hover:text-red-600 hover:border-red-600`

    return (
        <header className="w-full bg-white shadow-sm">
            <div
                className="
          container mx-auto
          px-4 sm:px-6 md:px-8
          lg:px-12 xl:px-20 2xl:px-40
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

                {/* Hamburger (below lg) */}
                <div className="lg:hidden">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="text-[#5C5D5D] hover:text-red-600 focus:outline-none"
                    >
                        {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                </div>

                {/* Desktop nav */}
                <nav className="hidden lg:flex items-center space-x-6">
                    <NavLink to="/" className={navLinkClasses}>
                        Home
                    </NavLink>
                    <NavLink to="/about" className={navLinkClasses}>
                        About
                    </NavLink>
                    <NavLink to="/solutions" className={navLinkClasses}>
                        Solutions
                    </NavLink>

                    {/* Services with hover-dropdown */}
                    <div className="relative group inline-flex items-center">
                        <NavLink to="/services" className={navLinkClasses}>
                            Services
                        </NavLink>
                        <div
                            className="
                absolute left-0 w-40 bg-white shadow-md rounded-md
                opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0
                transition-all duration-300
                pointer-events-none group-hover:pointer-events-auto
                z-10 mt-28
              "
                        >
                            <NavLink
                                to="/careers"
                                className="block px-4 py-2 text-sm font-medium text-[#5C5D5D] hover:text-white hover:bg-red-600"
                            >
                                Careers
                            </NavLink>
                            <NavLink
                                to="/resources"
                                className="block px-4 py-2 text-sm font-medium text-[#5C5D5D] hover:text-white hover:bg-red-600"
                            >
                                Resources
                            </NavLink>
                        </div>
                    </div>

                    <NavLink to="/case-studies" className={navLinkClasses}>
                        Case study
                    </NavLink>
                </nav>

                {/* Desktop social + contact */}
                <div className="hidden lg:flex items-center space-x-4">
                    <div className="flex items-center space-x-3 mr-4">
                        <Link to="#" className="text-gray-500 hover:text-[#BD2E25]">
                            <FaInstagram size={20} />
                        </Link>
                        <Link to="#" className="text-gray-500 hover:text-[#BD2E25]">
                            <FaFacebookF size={20} />
                        </Link>
                        <Link to="#" className="text-gray-500 hover:text-[#BD2E25]">
                            <FaTwitter size={20} />
                        </Link>
                        <Link to="#" className="text-gray-500 hover:text-[#BD2E25]">
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

            {/* Mobile menu (unchanged) */}
            {isMenuOpen && (
                <div className="lg:hidden bg-white border-t">
                    <div className="container mx-auto px-4 py-3 space-y-3">
                        <NavLink
                            to="/"
                            onClick={() => setIsMenuOpen(false)}
                            className={({ isActive }) =>
                                `block ${navLinkClasses({ isActive })} py-2`
                            }
                        >
                            Home
                        </NavLink>
                        <NavLink
                            to="/about"
                            onClick={() => setIsMenuOpen(false)}
                            className={({ isActive }) =>
                                `block ${navLinkClasses({ isActive })} py-2`
                            }
                        >
                            About
                        </NavLink>
                        <NavLink
                            to="/solutions"
                            onClick={() => setIsMenuOpen(false)}
                            className={({ isActive }) =>
                                `block ${navLinkClasses({ isActive })} py-2`
                            }
                        >
                            Solutions
                        </NavLink>
                        <NavLink
                            to="/services"
                            onClick={() => setIsMenuOpen(false)}
                            className={({ isActive }) =>
                                `block ${navLinkClasses({ isActive })} py-2`
                            }
                        >
                            Services
                        </NavLink>
                        <NavLink
                            to="/case-studies"
                            onClick={() => setIsMenuOpen(false)}
                            className={({ isActive }) =>
                                `block ${navLinkClasses({ isActive })} py-2`
                            }
                        >
                            Case study
                        </NavLink>
                        {/* Keep Careers & Resources visible on mobile */}
                        <NavLink
                            to="/careers"
                            onClick={() => setIsMenuOpen(false)}
                            className={({ isActive }) =>
                                `block ${navLinkClasses({ isActive })} py-2`
                            }
                        >
                            Careers
                        </NavLink>
                        <NavLink
                            to="/resources"
                            onClick={() => setIsMenuOpen(false)}
                            className={({ isActive }) =>
                                `block ${navLinkClasses({ isActive })} py-2`
                            }
                        >
                            Resources
                        </NavLink>

                        <div className="flex items-center space-x-3 py-2">
                            <Link to="#" className="text-gray-500 hover:text-[#BD2E25]">
                                <FaInstagram size={20} />
                            </Link>
                            <Link to="#" className="text-gray-500 hover:text-[#BD2E25]">
                                <FaFacebookF size={20} />
                            </Link>
                            <Link to="#" className="text-gray-500 hover:text-[#BD2E25]">
                                <FaTwitter size={20} />
                            </Link>
                            <Link to="#" className="text-gray-500 hover:text-[#BD2E25]">
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
