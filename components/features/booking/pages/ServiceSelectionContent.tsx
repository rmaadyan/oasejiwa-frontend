"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BookingStepper from "@/components/booking/BookingStepper";
import {
  BookingHero,
  BookingNavigation,
  ServiceSelectionSection,
  Service,
} from "@/components/features/booking";

interface ServiceSelectionContentProps {
  services: Service[];
}

export default function ServiceSelectionContent({
  services,
}: ServiceSelectionContentProps) {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const handleNext = () => {
    if (selectedService) {
      router.push(`/booking/psychologists?service=${selectedService}`);
    }
  };

  return (
    <>
      <BookingHero
        title={
          <>
            <span className="text-[#000000]">Mulai Perjalanan </span>
            <span className="text-[#234463]">Sehatmu</span>
          </>
        }
        subtitle="Pilih Layanan & Ahli yang Tepat untuk Anda"
      />

      <section className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8 animate-fadeIn stagger-2">
          <BookingStepper currentStep={1} />
        </div>

        <ServiceSelectionSection
          services={services}
          selectedService={selectedService}
          onSelectService={setSelectedService}
        />

        <BookingNavigation
          onBack={() => router.back()}
          onNext={handleNext}
          isNextDisabled={!selectedService}
        />
      </section>
    </>
  );
}
