/**
 * Beat 6 — the partner wall. SCROLL_NARRATIVE.md §6 Beat 6, copy sheet row 6.
 *
 * The rest between the ledger and the ask, and the answer to "what is my
 * risk". The columns themselves moved to components/PartnerColumns.tsx in
 * Phase 5 so that /solutions could show the same wall in place of an
 * autoplaying carousel; the section, its band and its data-beat stay here.
 *
 * Column assignment is the narrative's proposal (§6 Beat 6) and is still
 * awaiting the owner's confirmation — see PHASE2_REPORT.md.
 */
import PartnerColumns from "../PartnerColumns";

export default function PartnerWall() {
  return (
    <section
      id="partner-wall"
      data-beat="6"
      data-register="ivory"
      className="band-ivory w-full py-24 md:py-32"
      aria-label="Partners"
    >
      <PartnerColumns headingLevel="h2" />
    </section>
  );
}
