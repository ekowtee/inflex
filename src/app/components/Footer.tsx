import Image from "next/image";
import Link from "next/link";
import { Instagram, Facebook, Twitter, Linkedin } from "lucide-react";

/**
 * Site footer, on Obsidian — CREATIVE_DIRECTION_3D.md §9 Phase 4 item 6.
 *
 * The home page now ends dark ask, light doors, dark footer, and every other
 * page gets the same closing register. Content is unchanged apart from the
 * strap line, which is the copy sheet's approved footer line
 * (SCROLL_NARRATIVE.md §7). The red circle badges and the red top bar are
 * gone: a hairline and the type tiers carry the structure, and red is kept
 * for the one action, Subscribe.
 *
 * It carries data-header-dark so the header takes its dark register when
 * the footer is under it.
 */

const company = [
  { label: "About Us", href: "/about" },
  { label: "Solutions", href: "/solutions" },
  { label: "Services", href: "/services" },
  { label: "Academy", href: "/academy" },
  { label: "Case Studies", href: "/case-study" },
  { label: "Careers", href: "/careers" },
];

const resources = [
  { label: "Blog", href: "/resources" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy" },
];

const social = [
  { label: "Instagram", href: "https://instagram.com", Icon: Instagram },
  { label: "Facebook", href: "https://facebook.com", Icon: Facebook },
  { label: "Twitter", href: "https://twitter.com", Icon: Twitter },
  { label: "LinkedIn", href: "https://linkedin.com", Icon: Linkedin },
];

const link =
  "text-silver-300 transition-colors duration-[var(--motion-duration-micro)] hover:text-white";

export default function Footer() {
  return (
    <footer
      role="contentinfo"
      data-header-dark=""
      className="on-obsidian relative border-t border-white/10 bg-obsidian-950 text-silver-100"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
          {/* Mark, strap, contact */}
          <div>
            <Image
              src="/inflexlogo-light.png"
              alt="Inflexions-IT"
              width={1408}
              height={274}
              className="h-9 w-auto"
            />
            <p className="type-telemetry mt-6 text-silver-500">
              Enterprise IT integration · Accra, Ghana · Since 2012
            </p>

            <dl className="mt-10 space-y-6">
              <div>
                <dt className="type-eyebrow text-silver-500">Email</dt>
                <dd className="type-body mt-3 space-y-1">
                  <a href="mailto:info@inflexions.tech" className={`block ${link}`}>
                    info@inflexions.tech
                  </a>
                  <a href="mailto:sales@inflexions.tech" className={`block ${link}`}>
                    sales@inflexions.tech
                  </a>
                </dd>
              </div>
              <div>
                <dt className="type-eyebrow text-silver-500">Call us</dt>
                <dd className="type-body mt-3 space-y-1 tabular-nums text-silver-300">
                  <a href="tel:+233208889270" className={`block ${link}`}>
                    (0) 208 889 270
                  </a>
                  <a href="tel:+233205179937" className={`block ${link}`}>
                    (0) 205 179 937
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          <nav aria-label="Company">
            <h3 className="type-eyebrow text-silver-500">Company</h3>
            <ul className="type-body mt-6 space-y-3">
              {company.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={link}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Resources">
            <h3 className="type-eyebrow text-silver-500">Resources</h3>
            <ul className="type-body mt-6 space-y-3">
              {resources.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={link}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="type-eyebrow text-silver-500">Stay updated</h3>
            <p className="type-body mt-6 text-silver-300">
              Get the latest insights on IT strategy and digital transformation.
            </p>
            <div className="mt-6 flex">
              <input
                type="email"
                placeholder="Your email address"
                aria-label="Email address"
                className="min-w-0 flex-1 rounded-l-[6px] border border-white/20 bg-obsidian-900 px-4 py-3 text-sm text-silver-100 placeholder:text-silver-500 focus:border-silver-300 focus:outline-none"
              />
              <button className="whitespace-nowrap rounded-r-[6px] bg-primary-500 px-5 py-3 text-sm font-semibold text-white transition-colors duration-[var(--motion-duration-micro)] hover:bg-primary-600">
                Subscribe
              </button>
            </div>

            <div className="mt-8 flex items-center gap-5">
              {social.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-silver-500 transition-colors duration-[var(--motion-duration-micro)] hover:text-white"
                >
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="type-telemetry text-silver-500">
            &copy; {new Date().getFullYear()} Inflexions I.T. Services Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
