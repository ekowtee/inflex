"use client";

import { useState } from "react";
import { ChevronRight, Clock } from "lucide-react";
import type { CurriculumModule } from "../academy/data";

export default function CurriculumAccordion({
  modules,
}: {
  modules: CurriculumModule[];
}) {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <ul className="space-y-3">
      {modules.map((module, idx) => {
        const isOpen = idx === openIndex;
        return (
          <li
            key={idx}
            className="border border-[#D0D0D0] rounded-lg overflow-hidden bg-white"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? -1 : idx)}
              aria-expanded={isOpen}
              className="w-full flex justify-between items-center text-left p-5 hover:bg-[#F7F8FA] transition-colors"
            >
              <div className="flex-1 min-w-0 pr-4">
                <h4 className="text-base font-semibold text-[#171A20] mb-1">
                  {module.title}
                </h4>
                <span className="inline-flex items-center gap-1 text-xs text-[#5C6280]">
                  <Clock className="w-3.5 h-3.5" />
                  {module.duration}
                </span>
              </div>
              <ChevronRight
                size={20}
                className={`flex-shrink-0 text-[#5C6280] transform transition-transform duration-200 ${
                  isOpen ? "rotate-90" : ""
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-5 pb-5 border-t border-[#E6E6E6] pt-4">
                <ul className="space-y-2">
                  {module.topics.map((topic, tIdx) => (
                    <li
                      key={tIdx}
                      className="flex items-start gap-2 text-sm text-[#41444B]"
                    >
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#BD2E25] flex-shrink-0" />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
