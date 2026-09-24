import Link from "next/link";
import Magnetic from "@/motion/Magnetic";

/**
 * 404 — PHASE5_BRIEF.md §4 Task 10, copy approved in SCROLL_NARRATIVE.md §7.
 *
 * On Obsidian, because a dead end should still look like the site. The
 * approved line answers the question a lost visitor actually has, which is
 * not "what is a 404" but "where do I go now".
 */
export default function NotFound() {
  return (
    <section
      data-register="obsidian"
      data-header-dark=""
      className="band-obsidian on-obsidian flex min-h-[80svh] w-full items-center"
      aria-label="Page not found"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <p className="type-eyebrow text-silver-500">404</p>
        <h1 className="type-display-l mt-6 max-w-[20ch] text-silver-100">
          That page is not on the network.
        </h1>
        <p className="type-body-l mt-6 max-w-[48ch] text-silver-300">
          Try the navigation, or go back to the start.
        </p>

        <div className="mt-10">
          <Magnetic>
            <Link
              href="/"
              className="inline-flex h-14 items-center rounded-[6px] bg-primary-500 px-8 font-semibold text-white transition-colors duration-[var(--motion-duration-micro)] hover:bg-primary-600"
            >
              Back to Home
            </Link>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
