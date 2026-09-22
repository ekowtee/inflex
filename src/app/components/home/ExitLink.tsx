import Link from "next/link";

/**
 * The one way out of a beat — SCROLL_NARRATIVE.md §6, "exit".
 *
 * Eyebrow style, an arrow that shifts 4 px on hover, and nothing else. Four
 * beats carry one; no beat carries two.
 *
 * Inline rather than flex on purpose: the space between the label and the
 * arrow has to survive into textContent, because the copy sheet spells these
 * links with their arrow ("How we integrate →") and the copy check reads the
 * rendered text. A flex container drops whitespace-only children.
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
      {children}{" "}
      <span
        aria-hidden="true"
        className="inline-block transition-transform duration-[var(--motion-duration-micro)] ease-[var(--motion-ease-out)] group-hover:translate-x-1"
      >
        →
      </span>
    </Link>
  );
}
