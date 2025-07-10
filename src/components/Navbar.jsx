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
        `pb-2 border-b-4 transition-colors duration-200 font-medium ${isActive
            ? 'text-red-600 border-red-600'
            : 'text-[#5C5D5D] border-transparent'
        } hover:text-red-600 hover:border-red-600`

    return (
        <header className="w-full bg-white shadow-sm fixed z-50">
            <div className="container mx-auto flex items-center h-[70px] pl-10 pr-10">
                {/* Logo - stays in original position but within container */}
                <div className="flex-shrink-0 ml-2">
                    <Link to="/">
                        <img src={logo} alt="INFLEXIONS-IT" className="h-10 w-auto" />
                    </Link>
                </div>

                {/* Content area */}
                <div className="flex items-center justify-between gap-10 flex-1">
                    {/* Desktop nav */}
                    <nav className="hidden lg:flex items-center lg:space-x-16 4xl:space-x-20">
                        <NavLink to="/" className={navLinkClasses}>
                            Home
                        </NavLink>
                        <NavLink to="/about" className={navLinkClasses}>
                            About Us
                        </NavLink>
                        <NavLink to="/solutions" className={navLinkClasses}>
                            Solutions
                        </NavLink>
                        <NavLink to="/services" className={navLinkClasses}>
                            Services
                        </NavLink>
                        <NavLink to="/resources" className={navLinkClasses}>
                            Resources
                        </NavLink>
                    </nav>

                    {/* Spacer for mobile hamburger alignment */}
                    <div className="lg:hidden flex-1"></div>

                    {/* Hamburger (below lg) */}
                    <div className="lg:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-[#5C5D5D] hover:text-red-600 focus:outline-none"
                        >
                            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                        </button>
                    </div>

                    {/* Contact Us button - with same margin as left side */}
                    <div className="hidden lg:flex items-center">
                        <Link
                            to="/contact"
                            className="bg-red-600 hover:bg-red-700 w-[194px] h-[70px] text-white flex items-center justify-center font-medium transition-colors"
                        >
                            Contact us
                        </Link>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
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
                            About Us
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
                            to="/resources"
                            onClick={() => setIsMenuOpen(false)}
                            className={({ isActive }) =>
                                `block ${navLinkClasses({ isActive })} py-2`
                            }
                        >
                            Resources
                        </NavLink>
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
