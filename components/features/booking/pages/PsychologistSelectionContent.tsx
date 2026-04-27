"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BookingStepper from "@/components/booking/BookingStepper";
import {
  BookingHero,
  BookingNavigation,
  PsychologistFilterBar,
  PsychologistListSection,
  Psychologist,
} from "@/components/features/booking";

interface PsychologistSelectionContentProps {
  psychologists: Psychologist[];
  specializations: string[];
}

function PsychologistSelectionInner({
  psychologists,
  specializations,
}: PsychologistSelectionContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("service");

  const [selectedPsychologist, setSelectedPsychologist] = useState<
    string | null
  >(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("Semua");

  useEffect(() => {
    if (!serviceId) {
        router.replace("/booking/services");
    }
  }, [serviceId]);

  const filteredPsychologists = psychologists.filter((psy) => {
    const matchesSearch =
      psy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      psy.specializations.some((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesSpecialization =
      selectedSpecialization === "Semua" ||
      psy.specializations.includes(selectedSpecialization);
    return matchesSearch && matchesSpecialization;
  });

  const handleSelect = (id: string) => {
    const psy = psychologists.find((p) => p.id === id);
    if (psy?.available) {
      setSelectedPsychologist(id);
    }
  };

  const handleNext = () => {
    if (selectedPsychologist) {
      router.push(
        `/booking/schedule?service=${serviceId}&psychologist=${selectedPsychologist}`
      );
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f7fb]">
      <BookingHero
        title={
          <>
            <span className="text-[#000000]">Pilih </span>
            <span className="text-[#234463]">Psikolog </span>
            <span className="text-[#000000]">Anda</span>
          </>
        }
        subtitle="Temukan psikolog yang tepat untuk kebutuhan Anda"
      />

      <section className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8 animate-fadeIn stagger-2">
          <BookingStepper currentStep={1} />
        </div>

        <PsychologistFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedSpecialization={selectedSpecialization}
          onSpecializationChange={setSelectedSpecialization}
          specializations={specializations}
        />

        <PsychologistListSection
          psychologists={filteredPsychologists}
          selectedPsychologist={selectedPsychologist}
          onSelect={handleSelect}
        />

        <BookingNavigation
          onBack={() => router.back()}
          onNext={handleNext}
          isNextDisabled={!selectedPsychologist}
        />
      </section>
    </main>
  );
}

export default function PsychologistSelectionContent(
  props: PsychologistSelectionContentProps
) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f5f7fb] flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-[#2B5379] border-t-transparent rounded-full" />
        </div>
      }
    >
      <PsychologistSelectionInner {...props} />
    </Suspense>
  );
}
