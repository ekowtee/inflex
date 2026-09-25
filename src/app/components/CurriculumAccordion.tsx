"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { CurriculumModule } from "../academy/data";

/**
 * A programme's modules — PHASE5_BRIEF.md §4 Task 5 and Task 7.
 *
 * Rows on hairlines rather than a stack of bordered white boxes, and the
 * answer opens on the 0fr to 1fr grid that Pillars.tsx uses: no measured
 * height, no JavaScript layout, and the closed panel is genuinely closed
 * rather than removed and re-added, so the content is in the page for
 * anything reading it.
 *
 * The chevron becomes a plus that turns into a minus, which is the one
 * shape that says "there is more here" without pointing sideways at it.
 */
export default function CurriculumAccordion({
  modules,
}: {
  modules: CurriculumModule[];
}) {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <ul className="border-t border-neutral-200">
      {modules.map((module, idx) => {
        const isOpen = idx === openIndex;
        return (
          <li key={idx} className="border-b border-neutral-200">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? -1 : idx)}
              aria-expanded={isOpen}
              className="flex w-full items-start justify-between gap-6 py-6 text-left"
            >
              <span>
                <span className="type-h3 block text-neutral-900">{module.title}</span>
                <span className="type-telemetry mt-3 block text-neutral-500">
                  {module.duration}
                </span>
              </span>
              <Plus
                aria-hidden="true"
                strokeWidth={1.5}
                className={`mt-1 h-6 w-6 shrink-0 text-neutral-500 transition-transform duration-[var(--motion-duration-ui)] ease-[var(--motion-ease-out)] ${
                  isOpen ? "rotate-45" : ""
                }`}
              />
            </button>

            <div
              className={`grid transition-[grid-template-rows] duration-[var(--motion-duration-reveal)] ease-[var(--motion-ease-out)] ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <ul className="pb-8">
                  {module.topics.map((topic, tIdx) => (
                    <li key={tIdx} className="type-body py-1.5 text-neutral-600">
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
