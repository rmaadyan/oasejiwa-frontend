"use client";

import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import AboutSection from "@/components/features/landingpage/aboutsection";
import CTASection from "@/components/features/landingpage/ctasection";
import FAQSection from "@/components/features/landingpage/faqsection";
import HeroSection from "@/components/features/landingpage/herosection";
import ServicesSection from "@/components/features/landingpage/servicessection";
import TestimonialsSection from "@/components/features/landingpage/testimonialssection";

export default function Home() {
  return (
    <main className="min-h-screen bg-white font-poppins overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Main Sections dengan spacing yang lega & simetris */}
      <div className="w-full space-y-12 sm:space-y-20">
        <AboutSection />
        <ServicesSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </div>

      <Footer />
    </main>
  );
}