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
    <main className="min-h-screen bg-slate-50/30 font-[var(--font-poppins)] flex flex-col justify-between overflow-x-hidden">
      {/* Sticky Navbar */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-100">
        <Navbar />
      </div>

      {/* Main Container - Diberi Max Width & Padding Rapi */}
      <div className="flex-1 w-full space-y-16 sm:space-y-24 pb-20">
        
        {/* 1. Hero Section */}
        <section className="w-full">
          <HeroSection />
        </section>

        {/* 2. Vision & Mission */}
        <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <VisionMissionSection />
        </section>

        {/* 3. CEO Message */}
        <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <CeoMessageSection />
        </section>

        {/* 4. Behind Our Team */}
        <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <TeamSection />
        </section>

        {/* 5. Location Section (Google Maps) */}
        <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <LocationSection />
        </section>
        
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}