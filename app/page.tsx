"use client";

import Footer from "@/components/common/footer";
import Navbar from "@/components/common/navbar";
import AboutSection from "@/components/features/landingpage/aboutsection";
import CTASection from "@/components/features/landingpage/ctasection";
import FAQSection from "@/components/features/landingpage/faqsection";
import HeroSection from "@/components/features/landingpage/herosection";
import ServicesSection from "@/components/features/landingpage/servicessection";
import TestimonialsSection from "@/components/features/landingpage/testimonialssection";

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
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  );
}
