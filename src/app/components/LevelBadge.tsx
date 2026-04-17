import type { ProgrammeLevel } from "../academy/data";

const styles: Record<ProgrammeLevel, string> = {
  Beginner: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Intermediate: "bg-amber-50 text-amber-700 border-amber-200",
  Advanced: "bg-[#F7E8E6] text-[#BD2E25] border-[#E9C4C1]",
};

export default function LevelBadge({ level }: { level: ProgrammeLevel }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-medium ${styles[level]}`}
    >
      {level}
    </span>
  );
}
