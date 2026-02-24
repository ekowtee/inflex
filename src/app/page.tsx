import HeroBanner from "./components/HeroBanner";
import Partners from "./components/Partners";
import StrategicPartnerSection from "./components/StrategicPartnerSection";
import ComprehensiveSolutions from "./components/ComprehensiveSolutions";
import InflexionsAdvantage from "./components/InflexionsAdvantage";
import MainPartners from "./components/MainPartners";
import TestimonialSlider from "./components/TestimonialSlider";
import CallToAction from "./components/CallToAction";
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

      {/* Hero Section */}
      <HeroBanner />

      {/* Partners Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Partners />
      </div>

      {/* Strategic Partner Section */}
      <StrategicPartnerSection />

      {/* Comprehensive Solutions Section */}
      <ComprehensiveSolutions />

      {/* Inflexions Advantage Section */}
      <InflexionsAdvantage />

      {/* Main Partners Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MainPartners />
      </div>

      {/* Testimonial Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TestimonialSlider />
      </div>

      {/* Call to Action Banner */}
      <CallToAction />
    </div>
  );
}
