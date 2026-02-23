import HeroBanner from "./components/HeroBanner";
import Partners from "./components/Partners";
import StrategicPartnerSection from "./components/StrategicPartnerSection";
import ComprehensiveSolutions from "./components/ComprehensiveSolutions";
import InflexionsAdvantage from "./components/InflexionsAdvantage";
import MainPartners from "./components/MainPartners";
import TestimonialSlider from "./components/TestimonialSlider";
import CallToAction from "./components/CallToAction";

export default function Home() {
  return (
    <div className="w-full">
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
