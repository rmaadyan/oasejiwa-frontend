"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import BookingStepper from "@/components/booking/BookingStepper";
import ServiceCard from "@/components/booking/ServiceCard";

const services = [
  {
    id: "1",
    title: "Konseling Individu",
    description: "Sesi konseling one-on-one dengan psikolog untuk membahas masalah pribadi Anda secara mendalam.",
    price: 200000,
    image: "/assets/services/individual.jpg",
    duration: "60 menit",
  },
  {
    id: "2",
    title: "Konseling Pasangan",
    description: "Konseling untuk pasangan yang ingin memperbaiki komunikasi dan hubungan mereka.",
    price: 350000,
    image: "/assets/services/couple.jpg",
    duration: "90 menit",
  },
  {
    id: "3",
    title: "Konseling Keluarga",
    description: "Sesi konseling untuk seluruh anggota keluarga guna menyelesaikan konflik dan meningkatkan keharmonisan.",
    price: 400000,
    image: "/assets/services/family.jpg",
    duration: "90 menit",
  },
  {
    id: "4",
    title: "Asesmen Psikologi",
    description: "Tes dan evaluasi psikologis untuk memahami kondisi mental dan kepribadian Anda.",
    price: 500000,
    image: "/assets/services/assessment.jpg",
    duration: "120 menit",
  },
  {
    id: "5",
    title: "Terapi CBT",
    description: "Cognitive Behavioral Therapy untuk mengatasi kecemasan, depresi, dan pola pikir negatif.",
    price: 250000,
    image: "/assets/services/cbt.jpg",
    duration: "60 menit",
  },
  {
    id: "6",
    title: "Konseling Anak & Remaja",
    description: "Konseling khusus untuk anak-anak dan remaja dengan pendekatan yang sesuai usia.",
    price: 200000,
    image: "/assets/services/child.jpg",
    duration: "45 menit",
  },
];

export default function ServiceSelectionPage() {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const handleNext = () => {
    if (selectedService) {
      // In real app, store selection in state management (Zustand/Context)
      router.push(`/booking/psychologists?service=${selectedService}`);
    }
  };

  return (
    <main className="min-h-screen bg-white font-[var(--font-poppins)]">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-12 px-6 lg:px-16 bg-gradient-to-b from-[#E8F6FF] to-white">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-[40px] md:text-[48px] font-semibold mb-4 animate-fade-in-up">
            <span className="text-[#000000]">Mulai Perjalanan </span>
            <span className="text-[#234463]">Sehatmu</span>
          </h1>
          <p className="text-lg text-[#4B4B4B] animate-fade-in-up">
            Pilih Layanan & Ahli yang Tepat untuk Anda
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-5xl mx-auto px-4 py-8">
        {/* Stepper */}
        <div className="mb-8 animate-fadeIn stagger-2">
          <BookingStepper currentStep={1} />
        </div>

        {/* Section Title */}
        <div className="mb-6 animate-fadeIn stagger-3">
          <h2 className="text-2xl font-bold text-[#234463] mb-2">
            Pilih Layanan
          </h2>
          <p className="text-[#4B4B4B]">
            Pilih layanan yang sesuai dengan kebutuhan Anda
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="animate-fadeIn"
              style={{ animationDelay: `${(index + 4) * 0.1}s` }}
            >
              <ServiceCard
                id={service.id}
                title={service.title}
                description={service.description}
                price={service.price}
                image={service.image}
                duration={service.duration}
                isSelected={selectedService === service.id}
                onSelect={setSelectedService}
              />
            </div>
          ))}
        </div>

        {/* Bottom Navigation */}
        <div className="flex justify-end items-center pt-6 border-t border-[#D6E6F2]">
          <button
            onClick={handleNext}
            disabled={!selectedService}
            className={`
              px-8 py-3 rounded-xl font-semibold transition-all duration-300
              ${
                selectedService
                  ? "bg-[#2B5379] text-white hover:bg-[#234463] shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }
            `}
          >
            Lanjutkan →
          </button>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
