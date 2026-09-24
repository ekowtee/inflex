/**
 * The home page — SCROLL_NARRATIVE.md §6.
 *
 * Nine beats in order. Beat 7 (Voices) is omitted: it runs only on two real,
 * attributable, permissioned quotes, and there are none, so Beat 6 flows
 * straight into Beat 8. It is not filled with placeholders.
 *
 * Registers alternate so the eye never spends more than two beats in one
 * world, and Obsidian is broken exactly once trust has been won:
 * 0-4 Obsidian, 5-6 Ivory, 8 Obsidian, 9 Ivory.
 *
 * The legacy home sections were retired in Phase 4 (24 September 2026):
 * StrategicPartnerSection, ComprehensiveSolutions and its SwapGrid,
 * InflexionsAdvantage, IntelligentAutomation, AcademyPromo and CallToAction
 * are deleted, and their images moved to assets-src/unreferenced/.
 * Partners stays for /about and /contact, MainPartners for /solutions.
 */
import Arrival from "./components/home/Arrival";
import TrustedBy from "./components/home/TrustedBy";
import TurningPoint from "./components/home/TurningPoint";
import Receipt from "./components/home/Receipt";
import Pillars from "./components/home/Pillars";
import Difference from "./components/home/Difference";
import Intelligence from "./components/home/Intelligence";
import PartnerWall from "./components/home/PartnerWall";
import TheAsk from "./components/home/TheAsk";
import SideDoors from "./components/home/SideDoors";
import JsonLd from "./components/JsonLd";

export default function Home() {
  return (
    <div className="w-full">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Inflexions I.T. Services",
          url: "https://inflexions.tech",
          logo: "https://inflexions.tech/assets/logo.png",
          description:
            "Enterprise IT integration, cloud services, cybersecurity, and managed services provider based in Accra, Ghana.",
          email: "info@inflexions.tech",
          telephone: "+233208889270",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Accra",
            addressCountry: "GH",
          },
          sameAs: [],
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Inflexions I.T. Services",
          url: "https://inflexions.tech",
        }}
      />

      {/* 0 — Where am I, and is this for me? */}
      <Arrival />

      {/* 1 — Who else trusts them? */}
      <TrustedBy />

      {/* 2 — What do you actually do? */}
      <TurningPoint />

      {/* 3 — Why should I believe you? Trust is won here. */}
      <Receipt />

      {/* 4 — What exactly would you do for me? */}
      <Pillars />

      {/* 5 — Why you and not the others I am comparing? */}
      <Difference />
      <Intelligence />

      {/* 6 — What is my risk? Are they backed? */}
      <PartnerWall />

      {/* 8 — What do I do now, and what will it cost me? */}
      <TheAsk />

      {/* 9 — And for the visitor who is not the buyer. */}
      <SideDoors />
    </div>
  );
}
