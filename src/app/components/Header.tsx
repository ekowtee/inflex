"use client";

/**
 * Site header.
 *
 * Two registers. Over the arrival (any element carrying `data-header-dark`,
 * which the home hero does) the bar is a light frost on Obsidian (a tint and
 * a blur) with the light logo; once the visitor scrolls past it, and on every other page, it is the
 * solid white bar with a hairline. The mobile menu is a full-screen Obsidian
 * panel with the dropdown groups as accordions.
 *
 * Fixed by decision (CLAUDE.md, "Navbar"): the desktop logo stays absolutely
 * positioned in the left margin; the link order; the single `openDropdown`
 * state; the 64 px desktop height; the full-height red Contact block on
 * desktop, with socials between the links and the button.
 */
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";

const DESKTOP_HEADER_PX = 64;
const MOBILE_HEADER_PX = 56;

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  {
    name: "Solutions",
    href: "/solutions",
    dropdown: true,
    submenu: [
      { name: "Data-centric Solutions", href: "/solutions/data-centric-solutions" },
      { name: "Cloud Services", href: "/solutions/cloud-services" },
      { name: "Data Security", href: "/solutions/data-security" },
      { name: "Network Infrastructure", href: "/solutions/network-infrastructure" },
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
      { name: "AI & Intelligent Systems", href: "/academy/ai-intelligent-systems" },
      { name: "Infrastructure & Cloud", href: "/academy/infrastructure-cloud" },
      { name: "Cybersecurity & Compliance", href: "/academy/cybersecurity-compliance" },
      { name: "Digital Strategy", href: "/academy/digital-strategy" },
      { name: "For Organizations", href: "/academy/for-organizations" },
    ],
  },
  { name: "Case study", href: "/case-study" },
  { name: "Careers", href: "/careers" },
];

const socialLinks = [
  { name: "Instagram", href: "https://instagram.com", iconPath: "/icons/Instagram.png" },
  { name: "Facebook", href: "https://facebook.com", iconPath: "/icons/facebook.png" },
  { name: "Twitter", href: "https://twitter.com", iconPath: "/icons/twitter.png" },
  { name: "LinkedIn", href: "https://linkedin.com", iconPath: "/icons/linkedin.png" },
];

export default function Header() {
  const pathname = usePathname() ?? "/";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Whether the visitor has scrolled past the dark element. Keyed by path so
  // a navigation resets it without an effect writing state.
  const [scrolled, setScrolled] = useState<{ path: string; past: boolean }>({ path: pathname, past: false });
  const pastDark = scrolled.path === pathname ? scrolled.past : false;

  // The dark register: only while a `data-header-dark` element is under the
  // bar. The server can decide this for the home page, so there is no flash
  // of a white bar over the hero on the first paint.
  const [hasDark, setHasDark] = useState<{ path: string; value: boolean }>({ path: pathname, value: pathname === "/" });
  const overDark = (hasDark.path === pathname ? hasDark.value : pathname === "/") && !pastDark;

  useEffect(() => {
    const dark = document.querySelector<HTMLElement>("[data-header-dark]");
    let frame = 0;
    const measure = () => {
      frame = 0;
      const headerPx = window.innerWidth >= 1024 ? DESKTOP_HEADER_PX : MOBILE_HEADER_PX;
      const threshold = dark ? dark.offsetTop + dark.offsetHeight - headerPx : 0;
      const past = !dark || window.scrollY > threshold;
      setScrolled((s) => (s.path === pathname && s.past === past ? s : { path: pathname, past }));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    // Late-mounting pages: re-read whether a dark element exists.
    if (Boolean(dark) !== (hasDark.path === pathname ? hasDark.value : pathname === "/")) {
      requestAnimationFrame(() => setHasDark({ path: pathname, value: Boolean(dark) }));
    }
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [pathname, hasDark]);

  // The open panel locks page scroll.
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = previous;
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => setIsMobileMenuOpen((open) => !open);
  const closeAllDropdowns = useCallback(() => setOpenDropdown(null), []);
  const toggleDropdown = (name: string) => setOpenDropdown((current) => (current === name ? null : name));
  const isDropdownOpen = (name: string) => openDropdown === name;
  const closeMobileNavigation = () => {
    closeAllDropdowns();
    setIsMobileMenuOpen(false);
  };

  // The bar is dark while over the arrival, and while the panel is open.
  const dark = overDark || isMobileMenuOpen;
  const linkClass = dark
    ? "text-silver-300 hover:text-white focus:text-white"
    : "text-gray-700 hover:text-red-600 focus:text-red-600";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color,box-shadow] duration-300 ${
        dark
          ? // A light frost over the hero rather than full transparency: a
            // tint of Obsidian with a blur, and a hairline at 8% white.
            "bg-obsidian-950/45 backdrop-blur-md border-b border-white/[0.08] supports-[backdrop-filter]:bg-obsidian-950/35"
          : "bg-white border-b border-[#E6E6E6]"
      } ${isMobileMenuOpen ? "!bg-obsidian-950 !backdrop-blur-none" : ""}`}
      data-register={dark ? "obsidian" : "ivory"}
    >

      {/* Logo in the left margin (desktop only, absolute position — locked) */}
      <Link
        href="/"
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 hidden lg:block"
        style={{ left: "calc((100vw - 80rem) / 4 + 1rem)" }}
        onClick={closeAllDropdowns}
      >
        <Image
          src={dark ? "/inflexlogo-light.png" : "/inflexlogo.png"}
          alt="Inflexions IT Logo"
          width={168}
          height={33}
          priority
        />
      </Link>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 lg:h-16 w-full relative">
          {/* Mobile menu button, left */}
          <div className="lg:hidden flex items-center">
            <button
              type="button"
              onClick={toggleMobileMenu}
              className={`inline-flex items-center justify-center -ml-2 h-10 w-10 rounded-[6px] focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${
                dark ? "text-silver-100 hover:text-white" : "text-gray-600 hover:text-red-600"
              }`}
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">{isMobileMenuOpen ? "Close main menu" : "Open main menu"}</span>
              {isMobileMenuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
            </button>
          </div>

          {/* Mobile centred logo */}
          <Link
            href="/"
            className="lg:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center"
            onClick={closeMobileNavigation}
          >
            <Image
              src={dark ? "/inflexlogo-light.png" : "/inflexlogo.png"}
              alt="Inflexions IT Logo"
              width={112}
              height={22}
              priority
            />
          </Link>

          {/* Desktop navigation, left of the container */}
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
                          className={`group inline-flex items-center text-sm font-medium transition duration-150 ease-in-out focus:outline-none ${
                            isOpen ? (dark ? "text-white" : "text-red-600") : linkClass
                          }`}
                          aria-expanded={isOpen}
                        >
                          <span>{link.name}</span>
                          <ChevronDown
                            className={`ml-1 h-4 w-4 transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}
                            aria-hidden="true"
                          />
                        </button>
                        <div
                          className={`absolute left-0 mt-2 w-60 rounded-[6px] shadow-lg bg-white ring-1 ring-black/5 focus:outline-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-top-left ${
                            isOpen ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-2 scale-95 invisible"
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
                        className={`inline-flex items-center text-sm font-medium transition duration-150 ease-in-out ${linkClass}`}
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

          {/* Right group: socials (desktop), Contact */}
          <div className="flex items-center space-x-6">
            <div className="hidden lg:flex items-center space-x-4">
              {socialLinks.map(({ name, href, iconPath }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`transition-opacity ${dark ? "opacity-80 hover:opacity-100" : "text-gray-400 hover:text-red-600"}`}
                  title={name}
                >
                  <span className="sr-only">{name}</span>
                  <Image
                    src={iconPath}
                    alt=""
                    width={20}
                    height={20}
                    className={`h-5 w-5 ${dark ? "brightness-0 invert" : ""}`}
                  />
                </a>
              ))}
            </div>

            {/* Contact: full-height block on desktop (locked); compact pill on mobile */}
            <Link
              href="/contact"
              onClick={closeMobileNavigation}
              className="inline-flex items-center justify-center text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500 transition-colors h-9 px-3.5 rounded-[6px] lg:px-6 lg:h-16 lg:rounded-none"
            >
              Contact us
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu: full-screen Obsidian panel */}
      <div
        id="mobile-menu"
        data-lenis-prevent=""
        className={`lg:hidden fixed inset-x-0 top-14 bottom-0 bg-obsidian-950 text-silver-100 overflow-y-auto transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isMobileMenuOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-2 invisible"
        }`}
        aria-hidden={!isMobileMenuOpen}
      >
        <nav className="flex min-h-full flex-col px-6 pt-4 pb-8 sm:px-8" aria-label="Mobile">
          <ul className="flex-1 divide-y divide-white/10">
            {navLinks.map((link) => {
              const isOpen = isDropdownOpen(link.name);
              return (
                <li key={link.name}>
                  {link.dropdown ? (
                    <>
                      <button
                        type="button"
                        onClick={() => toggleDropdown(link.name)}
                        className="w-full flex items-center justify-between py-4 text-left text-[22px] font-semibold tracking-[-0.01em] text-silver-100"
                        aria-expanded={isOpen}
                      >
                        <span>{link.name}</span>
                        <ChevronDown
                          className={`h-5 w-5 text-silver-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                          aria-hidden="true"
                        />
                      </button>
                      <div className={`${isOpen ? "grid" : "hidden"} pb-3 gap-1`}>
                        <Link
                          href={link.href}
                          className="block py-2 text-base text-silver-300 hover:text-white"
                          onClick={closeMobileNavigation}
                        >
                          All {link.name.toLowerCase()}
                        </Link>
                        {link.submenu?.map((subitem) => (
                          <Link
                            key={subitem.name}
                            href={subitem.href}
                            className="block py-2 text-base text-silver-300 hover:text-white"
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
                      className="block py-4 text-[22px] font-semibold tracking-[-0.01em] text-silver-100 hover:text-white"
                      onClick={closeMobileNavigation}
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="mt-8">
            <Link
              href="/contact"
              onClick={closeMobileNavigation}
              className="flex h-12 w-full items-center justify-center rounded-[6px] bg-red-600 text-base font-semibold text-white hover:bg-red-700"
            >
              Contact us
            </Link>
            <div className="mt-6 flex justify-center space-x-7">
              {socialLinks.map(({ name, href, iconPath }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-70 hover:opacity-100"
                  title={name}
                >
                  <span className="sr-only">{name}</span>
                  <Image src={iconPath} alt="" width={24} height={24} className="h-6 w-6 brightness-0 invert" />
                </a>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
