import type { ProgrammeLevel } from "../academy/data";

/**
 * A programme's level — PHASE5_BRIEF.md §4 Task 5.
 *
 * Three filled pills in three unrelated colours (emerald, amber, brand red)
 * became one hairline outline. The level is a fact about a programme, not a
 * status to be colour-coded, and the greens and ambers belonged to no
 * palette on this site.
 */
export default function LevelBadge({ level }: { level: ProgrammeLevel }) {
  return (
    <span className="type-telemetry inline-flex items-center rounded-[6px] border border-current/30 px-2.5 py-1.5">
      {level}
    </span>
  );
}
