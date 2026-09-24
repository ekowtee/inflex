import Link from "next/link";
import type { Programme } from "../academy/data";
import LevelBadge from "./LevelBadge";

/**
 * The facts about a programme, beside it — PHASE5_BRIEF.md §4 Task 5.
 *
 * Was a bordered white card holding four rows, each with a red icon. The
 * icons said nothing the label did not, and four red marks in a column made
 * a list of facts look like a set of alerts. Facts on hairlines now, with
 * the two actions below them: one primary, one secondary on the Ivory
 * outline rule.
 */
export default function ProgrammeDetailsSidebar({
  programme,
}: {
  programme: Programme;
}) {
  const facts = [
    { label: "Duration", value: programme.duration },
    { label: "Formats", value: programme.formats.join(", ") },
    { label: "Next cohort", value: "Contact us for dates" },
    {
      label: "Audience",
      value: programme.audienceTypes
        .map((a) => (a === "individual" ? "Individuals" : "Organisations"))
        .join(" & "),
    },
  ];

  return (
    <aside className="lg:sticky lg:top-28">
      <div className="text-neutral-500">
        <LevelBadge level={programme.level} />
      </div>

      <dl className="mt-8 border-t border-neutral-200">
        {facts.map((fact) => (
          <div key={fact.label} className="border-b border-neutral-200 py-5">
            <dt className="type-telemetry text-neutral-500">{fact.label}</dt>
            <dd className="type-body mt-3 text-neutral-900">{fact.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 flex flex-col gap-3">
        <Link
          href={`/contact?programme=${programme.slug}&type=individual`}
          className="inline-flex h-14 items-center justify-center rounded-[6px] bg-primary-500 px-8 font-semibold text-white transition-colors duration-[var(--motion-duration-micro)] hover:bg-primary-600"
        >
          Register as Individual
        </Link>
        <Link
          href={`/academy/for-organizations?programme=${programme.slug}`}
          className="inline-flex h-14 items-center justify-center rounded-[6px] border border-neutral-300 px-8 font-semibold text-neutral-900 transition-colors duration-[var(--motion-duration-micro)] hover:bg-neutral-50"
        >
          Request Corporate Training
        </Link>
      </div>

      <p className="type-body mt-6 text-neutral-500">
        Pricing varies by format and cohort size. Contact us for a tailored
        quote.
      </p>
    </aside>
  );
}
