import Link from "next/link";
import Magnetic from "@/motion/Magnetic";

/**
 * The closing band on every interior page — PHASE5_BRIEF.md §4 Task 2.
 *
 * It replaces Banner.tsx, which put "Ready to Transform Your IT?" over a
 * navy wash on a stock photograph on fifteen pages. That band asked for
 * nothing in particular; this one asks for the one thing the site sells, in
 * the approved words (SCROLL_NARRATIVE.md §7), and carries no heading and no
 * photograph, because a page that has just made its case does not need to
 * raise its voice to close.
 *
 * `variant="academy"` exists because the Academy's next step is not an
 * architecture review. There it carries the page's own enquiry line and
 * target, kept verbatim, and drops the friction line, which belongs to the
 * review offer and to nothing else.
 */

const OFFER =
  "Book a 30-minute architecture review. With a Solutions Architect, not a salesperson. No pitch.";
const FRICTION = "No obligation. One conversation.";

export interface AskBandProps {
  variant?: "default" | "academy";
  /** Page-specific line, kept verbatim. Defaults to the approved offer. */
  line?: string;
  label?: string;
  href?: string;
}

export default function AskBand({
  variant = "default",
  line,
  label,
  href,
}: AskBandProps) {
  const academy = variant === "academy";

  return (
    <section
      data-register="obsidian"
      data-header-dark=""
      className="band-obsidian on-obsidian w-full py-24 md:py-32"
      aria-label={academy ? "Train your team" : "Book the review"}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="type-body-l max-w-[52ch] text-silver-100">{line ?? OFFER}</p>

        <div className="mt-10">
          <Magnetic>
            <Link
              href={href ?? "/contact"}
              className="inline-flex h-14 items-center rounded-[6px] bg-primary-500 px-8 font-semibold text-white transition-colors duration-[var(--motion-duration-micro)] hover:bg-primary-600"
            >
              {label ?? "Book the review"}
            </Link>
          </Magnetic>
        </div>

        {!academy && (
          <p className="type-eyebrow mt-8 text-silver-500">{FRICTION}</p>
        )}
      </div>
    </section>
  );
}
