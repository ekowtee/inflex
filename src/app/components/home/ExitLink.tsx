import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * The one way out of a beat — SCROLL_NARRATIVE.md §6, "exit".
 *
 * Eyebrow style, an arrow that shifts 4 px on hover, and nothing else. Four
 * beats carry one; no beat carries two.
 *
 * The arrow is a drawn icon, not the → glyph: a text arrow takes the
 * fallback font's shape and weight, an icon keeps one stroke across the
 * page. The copy sheet's "→" is rendered by it.
 *
 * The shift is a transform on the arrow alone, so nothing moves its layout
 * on hover (CREATIVE_DIRECTION_3D.md §8.5).
 */
export default function ExitLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`type-eyebrow group inline-block ${className}`.trim()}
    >
      <span className="inline-flex items-center gap-2">
        {children}
        <ArrowRight
          aria-hidden="true"
          strokeWidth={1.75}
          className="h-3.5 w-3.5 transition-transform duration-[var(--motion-duration-micro)] ease-[var(--motion-ease-out)] group-hover:translate-x-1"
        />
      </span>
    </Link>
  );
}
