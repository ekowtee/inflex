"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { HiMenu, HiX } from "react-icons/hi";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const closeAllDropdowns = () => setOpenDropdown(null);

  const toggleDropdown = (name: string) =>
    setOpenDropdown((current) => (current === name ? null : name));

  const isDropdownOpen = (name: string) => openDropdown === name;

  const closeMobileNavigation = () => {
    closeAllDropdowns();
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    {
      name: "Solutions",
      href: "/solutions",
      dropdown: true,
      submenu: [
        {
          name: "Data-centric Solutions",
          href: "/solutions/data-centric-solutions",
        },
        { name: "Cloud Services", href: "/solutions/cloud-services" },
        { name: "Data Security", href: "/solutions/data-security" },
        {
          name: "Network Infrastructure",
          href: "/solutions/network-infrastructure",
        },
      ],
    },
    {
      name: "Services",
      href: "/services",
      dropdown: true,
      submenu: [
        { name: "Professional Services", href: "/services/professional" },
        { name: "Managed Services", href: "/services/managed" },
        { name: "Support Services", href: "/services/support" },
      ],
    },
    {
      name: "Academy",
      href: "/academy",
      dropdown: true,
      submenu: [
        {
          name: "AI & Intelligent Systems",
          href: "/academy/ai-intelligent-systems",
        },
        {
          name: "Infrastructure & Cloud",
          href: "/academy/infrastructure-cloud",
        },
        {
          name: "Cybersecurity & Compliance",
          href: "/academy/cybersecurity-compliance",
        },
        { name: "Digital Strategy", href: "/academy/digital-strategy" },
        {
          name: "For Organizations",
          href: "/academy/for-organizations",
        },
      ],
    },
    { name: "Case study", href: "/case-study" },
    { name: "Careers", href: "/careers" },
  ];

  const socialLinks = [
    {
      name: "Instagram",
      href: "https://instagram.com",
      iconPath: "/icons/Instagram.png",
    },
    {
      name: "Facebook",
      href: "https://facebook.com",
      iconPath: "/icons/facebook.png",
    },
    {
      name: "Twitter",
      href: "https://twitter.com",
      iconPath: "/icons/twitter.png",
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com",
      iconPath: "/icons/linkedin.png",
    },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 shadow-md bg-white">
      {/* Logo in the left margin (Desktop only - absolute position) */}
      <Link href="/" className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 hidden lg:block"
          style={{ left: "calc((100vw - 80rem) / 4 + 1rem)" }}>
        <Image
          src="/inflexlogo.png"
          alt="Inflexions IT Logo"
          width={168}
          height={42}
          priority
        />
      </Link>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 w-full relative">
          
          {/* Mobile Hamburger on Left */}
          <div className="lg:hidden flex items-center">
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-red-600 hover:bg-gray-100 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <HiX className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <HiMenu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Mobile Centered Logo */}
          <Link href="/" className="lg:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center">
            <Image
              src="/inflexlogo.png"
              alt="Inflexions IT Logo"
              width={112}
              height={28}
              priority
            />
          </Link>

          {/* Desktop Navigation - Starts on left of container */}
          <nav className="hidden lg:flex lg:items-center">
            <div className="flex space-x-6 lg:space-x-8">
              {navLinks.map((link) => {
                const isOpen = isDropdownOpen(link.name);
                return (
                  <div key={link.name} className="relative">
                    {link.dropdown ? (
                      <>
                        <button
                          type="button"
                          onClick={() => toggleDropdown(link.name)}
                          className={`group inline-flex items-center text-sm font-medium transition duration-150 ease-in-out hover:text-red-600 focus:outline-none focus:text-red-600 ${
                            isOpen ? "text-red-600" : "text-gray-700"
                          }`}
                          aria-expanded={isOpen}
                        >
                          <span>{link.name}</span>
                          <svg
                            className={`ml-1 h-5 w-5 group-hover:text-gray-500 transition ease-in-out duration-150 ${
                              isOpen ? "transform rotate-180" : ""
                            }`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                        <div
                          className={`absolute left-0 mt-2 w-60 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-top-left ${
                            isOpen
                              ? "opacity-100 translate-y-0 scale-100"
                              : "opacity-0 -translate-y-2 scale-95 invisible"
                          }`}
                          role="menu"
                          aria-orientation="vertical"
                        >
                          <div className="py-1" role="none">
                            {link.submenu?.map((subitem) => (
                              <Link
                                key={subitem.name}
                                href={subitem.href}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600"
                                role="menuitem"
                                onClick={closeAllDropdowns}
                              >
                                {subitem.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <Link
                        href={link.href}
                        className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-red-600 transition duration-150 ease-in-out"
                        onClick={closeAllDropdowns}
                      >
                        {link.name}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </nav>

          {/* Right Group (CTA, Socials on desktop) */}
          <div className="flex items-center space-x-6">
            {/* Social media icons - desktop only */}
            <div className="hidden lg:flex items-center space-x-4">
              {socialLinks.map(({ name, href, iconPath }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-red-600"
                  title={name}
                >
                  <span className="sr-only">{name}</span>
                  <Image
                    src={iconPath}
                    alt={`${name} icon`}
                    width={20}
                    height={20}
                    className="h-5 w-5"
                  />
                </a>
              ))}
            </div>

            {/* Contact button */}
            <Link
              href="/contact"
              onClick={closeAllDropdowns}
              className="inline-flex items-center justify-center border border-transparent text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors px-4 h-10 rounded-md lg:px-6 lg:h-16 lg:rounded-none"
            >
              Contact us
            </Link>
          </div>

        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isMobileMenuOpen ? "opacity-100 max-h-screen visible" : "opacity-0 max-h-0 invisible overflow-hidden"
        }`}
        id="mobile-menu"
      >
        <div className="pt-2 pb-3 space-y-1 px-2 sm:px-3 border-t border-gray-200 bg-white">
          {navLinks.map((link) => {
            const isOpen = isDropdownOpen(link.name);
            return (
              <div key={link.name}>
                {link.dropdown ? (
                  <>
                    <button
                      onClick={() => toggleDropdown(link.name)}
                      className="w-full flex items-center justify-between py-2 pl-3 pr-3.5 text-base font-medium text-gray-700 rounded-md hover:bg-gray-50 hover:text-red-600"
                      aria-expanded={isOpen}
                    >
                      <span>{link.name}</span>
                      <svg
                        className={`${
                          isOpen ? "transform rotate-180" : ""
                        } ml-1 h-5 w-5 transition ease-in-out duration-150`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <div className={`pl-4 space-y-1 ${isOpen ? "block" : "hidden"}`}>
                      {link.submenu?.map((subitem) => (
                        <Link
                          key={subitem.name}
                          href={subitem.href}
                          className="block py-2 pl-7 pr-4 text-base font-medium text-gray-500 rounded-md hover:bg-gray-50 hover:text-red-600"
                          onClick={closeMobileNavigation}
                        >
                          {subitem.name}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    href={link.href}
                    className="block py-2 pl-3 pr-4 text-base font-medium text-gray-700 rounded-md hover:bg-gray-50 hover:text-red-600"
                    onClick={closeMobileNavigation}
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
        {/* Mobile Social Icons */}
        <div className="pt-4 pb-3 border-t border-gray-200 px-2 sm:px-3 bg-white">
          <div className="flex justify-center space-x-6">
            {socialLinks.map(({ name, href, iconPath }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-red-600"
                title={name}
              >
                <span className="sr-only">{name}</span>
                <Image
                  src={iconPath}
                  alt={`${name} icon`}
                  width={24}
                  height={24}
                  className="h-6 w-6"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
