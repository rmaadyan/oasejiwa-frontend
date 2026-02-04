"use client";

import Navbar from "@/components/common/navbar";
import Footer from "@/components/common/footer";
import HeroSection from "@/components/features/landingpage/herosection";
import AboutSection from "@/components/features/landingpage/aboutsection";
import ServicesSection from "@/components/features/landingpage/servicessection";
import BundlingSection from "@/components/features/landingpage/bundlingsection";
import TestimonialsSection from "@/components/features/landingpage/testimonialssection";
import FAQSection from "@/components/features/landingpage/faqsection";
import CTASection from "@/components/features/landingpage/ctasection";

// Analytics/admin UI was accidentally merged into this file.
// Keep this file as the main Home page. Admin analytics should live
// in a separate route (e.g., /app/admin/analytics). Removing the
// analytics imports and component to restore a single default export.

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <BundlingSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  );
}
