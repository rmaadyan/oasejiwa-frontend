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

  const [selectedPsychologist, setSelectedPsychologist] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("Semua");

  useEffect(() => {
    if (!serviceId) {
      router.replace("/booking/services");
    }
  }, [serviceId, router]);

  const filteredPsychologists = psychologists.filter((psy: any) => {
    // 1. Cek kelengkapan/status aktif (cocokkan dengan backend & psikologlist)
    const isExplicitlyInactive =
      psy.status === "Menunggu Profil" ||
      psy.status === "inactive" ||
      psy.isProfileComplete === false;

    // Jika psikolog tidak berstatus non-aktif, izinkan tampil
    if (isExplicitlyInactive) return false;

    // 2. Pencarian Nama atau Spesialisasi
    const nameMatch = (psy.name || psy.fullName || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const specs = Array.isArray(psy.specializations)
      ? psy.specializations
      : Array.isArray(psy.specialization)
      ? psy.specialization
      : [];

    const specMatch = specs.some((s: string) =>
      s.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // 3. Filter Kategori Spesialisasi
    const categoryMatch =
      selectedSpecialization === "Semua" ||
      specs.includes(selectedSpecialization);

    return (nameMatch || specMatch) && categoryMatch;
  });

  const handleSelect = (id: string) => {
    // 🟢 Izinkan memilih psikolog yang ada di daftar
    setSelectedPsychologist(id);
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