import Link from "next/link";
import { Clock, Users, MapPin, Calendar } from "lucide-react";
import type { Programme } from "../academy/data";
import LevelBadge from "./LevelBadge";

export default function ProgrammeDetailsSidebar({
  programme,
}: {
  programme: Programme;
}) {
  return (
    <aside className="lg:sticky lg:top-24 bg-white border border-[#D0D0D0] rounded-lg p-6 space-y-6">
      <div>
        <LevelBadge level={programme.level} />
      </div>

      <dl className="space-y-4">
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-[#BD2E25] mt-0.5 flex-shrink-0" />
          <div>
            <dt className="text-xs text-[#5C6280] uppercase tracking-wide font-medium">
              Duration
            </dt>
            <dd className="text-sm text-[#171A20] font-medium">
              {programme.duration}
            </dd>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-[#BD2E25] mt-0.5 flex-shrink-0" />
          <div>
            <dt className="text-xs text-[#5C6280] uppercase tracking-wide font-medium">
              Formats
            </dt>
            <dd className="text-sm text-[#171A20] font-medium">
              {programme.formats.join(", ")}
            </dd>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-[#BD2E25] mt-0.5 flex-shrink-0" />
          <div>
            <dt className="text-xs text-[#5C6280] uppercase tracking-wide font-medium">
              Next Cohort
            </dt>
            <dd className="text-sm text-[#171A20] font-medium">
              Contact us for dates
            </dd>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Users className="w-5 h-5 text-[#BD2E25] mt-0.5 flex-shrink-0" />
          <div>
            <dt className="text-xs text-[#5C6280] uppercase tracking-wide font-medium">
              Audience
            </dt>
            <dd className="text-sm text-[#171A20] font-medium">
              {programme.audienceTypes
                .map((a) => (a === "individual" ? "Individuals" : "Organisations"))
                .join(" & ")}
            </dd>
          </div>
        </div>
      </dl>

      <div className="pt-4 border-t border-[#E6E6E6] space-y-3">
        <Link
          href={`/contact?programme=${programme.slug}&type=individual`}
          className="block w-full text-center bg-[#BD2E25] hover:bg-[#A02923] text-white font-semibold px-6 py-3 rounded-[6px] transition-colors"
        >
          Register as Individual
        </Link>
        <Link
          href={`/academy/for-organizations?programme=${programme.slug}`}
          className="block w-full text-center border border-[#BD2E25] text-[#BD2E25] hover:bg-[#BD2E25] hover:text-white font-semibold px-6 py-3 rounded-[6px] transition-colors"
        >
          Request Corporate Training
        </Link>
      </div>

      <p className="text-xs text-[#5C6280] leading-relaxed">
        Pricing varies by format and cohort size. Contact us for a tailored
        quote.
      </p>
    </aside>
  );
}
