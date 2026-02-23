import Link from "next/link";
import { Mail, Phone, Instagram, Facebook, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer role="contentinfo" className="border-t-[3px] border-t-[#BD2E25] bg-[#F7F8FA] text-[#171A20]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* 1) Logo & Contact */}
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/logo.png"
              alt="Inflexions-IT"
              className="h-12"
            />

            <div className="space-y-5 mt-8">
              <div className="flex items-start">
                <div className="bg-[#BD2E25] rounded-full p-2.5 mr-3 mt-0.5 flex-shrink-0">
                  <Mail className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-sm text-[#41444B] uppercase tracking-wide">
                    Email
                  </p>
                  <a
                    href="mailto:info@inflexions.tech"
                    className="block text-[#171A20] hover:text-[#BD2E25] transition-colors"
                  >
                    info@inflexions.tech
                  </a>
                  <a
                    href="mailto:sales@inflexions.tech"
                    className="block text-[#171A20] hover:text-[#BD2E25] transition-colors"
                  >
                    sales@inflexions.tech
                  </a>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-[#BD2E25] rounded-full p-2.5 mr-3 mt-0.5 flex-shrink-0">
                  <Phone className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-sm text-[#41444B] uppercase tracking-wide">
                    Call Us
                  </p>
                  <p className="text-[#171A20]">(0) 208 889 270</p>
                  <p className="text-[#171A20]">(0) 205 179 937</p>
                </div>
              </div>
            </div>
          </div>

          {/* 2) Company */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Company</h3>
            <ul className="space-y-3 text-[#41444B]">
              <li>
                <Link
                  href="/about"
                  className="hover:text-[#BD2E25] transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/solutions"
                  className="hover:text-[#BD2E25] transition-colors"
                >
                  Solutions
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-[#BD2E25] transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/case-studies"
                  className="hover:text-[#BD2E25] transition-colors"
                >
                  Case Studies
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="hover:text-[#BD2E25] transition-colors"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* 3) Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Resources</h3>
            <ul className="space-y-3 text-[#41444B]">
              <li>
                <Link
                  href="/resources"
                  className="hover:text-[#BD2E25] transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-[#BD2E25] transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-[#BD2E25] transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* 4) Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Stay Updated</h3>
            <p className="text-[#41444B] text-sm mb-4">
              Get the latest insights on IT strategy and digital transformation.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email address"
                aria-label="Email address"
                className="flex-1 min-w-0 bg-white border border-[#A6A6A6] rounded-l-[6px] px-4 py-2.5 text-sm text-[#171A20] placeholder:text-[#A6A6A6] focus:outline-none focus:ring-2 focus:ring-[#BD2E25] focus:border-transparent"
              />
              <button className="bg-[#BD2E25] hover:bg-[#A02923] text-white text-sm font-medium px-5 py-2.5 rounded-r-[6px] transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>

            <div className="flex items-center space-x-4 mt-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-[#41444B] hover:text-[#BD2E25] transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-[#41444B] hover:text-[#BD2E25] transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="text-[#41444B] hover:text-[#BD2E25] transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-[#41444B] hover:text-[#BD2E25] transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-[#E0E0E0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <p className="text-center text-sm text-[#41444B]">
            &copy; {new Date().getFullYear()} Inflexions I.T. Services Ltd. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
