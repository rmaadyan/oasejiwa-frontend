import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import {
  HeroSection,
  VisionMissionSection,
  CeoMessageSection,
  TeamSection,
  LocationSection,
} from "@/components/features/about-us";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white font-[var(--font-poppins)]">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Vision & Mission Section */}
      <VisionMissionSection />

      {/* CEO Message Section */}
      <CeoMessageSection />

      {/* Behind Our Team Section */}
      <TeamSection />

      {/* Location Section */}
      <LocationSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
