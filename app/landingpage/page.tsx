"use client";

import HeroSection from "@/components/features/landingpage/herosection";
import AboutSection from "@/components/features/landingpage/aboutsection";
import ServicesSection from "@/components/features/landingpage/servicessection";
import BundlingSection from "@/components/features/landingpage/bundlingsection";
import TestimonialsSection from "@/components/features/landingpage/testimonialssection";
import FAQSection from "@/components/features/landingpage/faqsection";
import CTASection from "@/components/features/landingpage/ctasection";

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <BundlingSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </main>
  );
}
