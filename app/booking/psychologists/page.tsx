"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BookingStepper from "@/components/booking/BookingStepper";
import PsychologistCard from "@/components/booking/PsychologistCard";

// Mock data for psychologists
const psychologists = [
  {
    id: "1",
    name: "Dr. Sarah Wijaya, M.Psi",
    role: "Psikolog Klinis",
    specializations: ["Depresi", "Kecemasan", "Trauma"],
    experience: "8 tahun",
    rating: 4.9,
    reviews: 128,
    price: 200000,
    avatar: "/assets/psychologists/sarah.jpg",
    available: true,
  },
  {
    id: "2",
    name: "Dr. Budi Santoso, M.Psi",
    role: "Psikolog Klinis Dewasa",
    specializations: ["Stres Kerja", "Burnout", "Hubungan"],
    experience: "10 tahun",
    rating: 4.8,
    reviews: 95,
    price: 250000,
    avatar: "/assets/psychologists/budi.jpg",
    available: true,
  },
  {
    id: "3",
    name: "Dr. Maya Putri, M.Psi",
    role: "Psikolog Anak & Remaja",
    specializations: ["ADHD", "Autism", "Parenting"],
    experience: "6 tahun",
    rating: 4.9,
    reviews: 87,
    price: 200000,
    avatar: "/assets/psychologists/maya.jpg",
    available: true,
  },
  {
    id: "4",
    name: "Dr. Ahmad Rizki, M.Psi",
    role: "Psikolog Keluarga",
    specializations: ["Konflik Keluarga", "Pernikahan", "Komunikasi"],
    experience: "12 tahun",
    rating: 4.7,
    reviews: 156,
    price: 300000,
    avatar: "/assets/psychologists/ahmad.jpg",
    available: false,
  },
  {
    id: "5",
    name: "Dr. Lisa Permata, M.Psi",
    role: "Psikolog Klinis",
    specializations: ["Eating Disorder", "Body Image", "Self-Esteem"],
    experience: "5 tahun",
    rating: 4.8,
    reviews: 62,
    price: 200000,
    avatar: "/assets/psychologists/lisa.jpg",
    available: true,
  },
];

const specializations = [
  "Semua",
  "Depresi",
  "Kecemasan",
  "Trauma",
  "Stres Kerja",
  "Hubungan",
  "ADHD",
  "Parenting",
];

function PsychologistSelectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("service");

  const [selectedPsychologist, setSelectedPsychologist] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("Semua");

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
    <main className="min-h-screen bg-white font-[var(--font-poppins)]">

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 px-6 lg:px-16 bg-gradient-to-b from-[#E8F6FF] to-white">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-[40px] md:text-[48px] font-semibold mb-4 animate-fade-in-up">
            <span className="text-[#000000]">Pilih </span>
            <span className="text-[#234463]">Psikolog </span>
            <span className="text-[#000000]">Anda</span>
          </h1>
          <p className="text-lg text-[#4B4B4B] animate-fade-in-up">
            Temukan psikolog yang tepat untuk kebutuhan Anda
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-5xl mx-auto px-4 py-8">
        {/* Stepper */}
        <div className="mb-8 animate-fadeIn stagger-2">
          <BookingStepper currentStep={2} />
        </div>

        {/* Filter Bar */}
        <div className="bg-[#F5F9FC] rounded-2xl p-4 shadow-sm mb-6 animate-fadeIn stagger-3">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Cari nama atau spesialisasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-[#D6E6F2] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#2B5379]/20 focus:border-[#2B5379] transition-all"
              />
            </div>

            {/* Specialization Filter */}
            <div className="flex gap-2 flex-wrap">
              {specializations.slice(0, 5).map((spec) => (
                <button
                  key={spec}
                  onClick={() => setSelectedSpecialization(spec)}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                    ${
                      selectedSpecialization === spec
                        ? "bg-[#2B5379] text-white"
                        : "bg-[#E8F6FF] text-[#2B5379] hover:bg-[#2B5379]/10"
                    }
                  `}
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 animate-fadeIn stagger-4">
          <p className="text-[#4B4B4B]">
            Menampilkan <span className="font-semibold text-[#234463]">{filteredPsychologists.length}</span> psikolog
          </p>
        </div>

        {/* Psychologist List */}
        <div className="space-y-4 mb-8">
          {filteredPsychologists.map((psy, index) => (
            <div
              key={psy.id}
              className="animate-fadeIn"
              style={{ animationDelay: `${(index + 5) * 0.1}s` }}
            >
              <PsychologistCard
                id={psy.id}
                name={psy.name}
                role={psy.role}
                specializations={psy.specializations}
                experience={psy.experience}
                rating={psy.rating}
                reviews={psy.reviews}
                price={psy.price}
                avatar={psy.avatar}
                available={psy.available}
                isSelected={selectedPsychologist === psy.id}
                onSelect={handleSelect}
              />
            </div>
          ))}
        </div>

        {filteredPsychologists.length === 0 && (
          <div className="text-center py-12 animate-fadeIn">
            <div className="w-16 h-16 bg-[#E8F6FF] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-[#2B5379]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#234463] mb-2">
              Tidak ada psikolog ditemukan
            </h3>
            <p className="text-[#4B4B4B]">
              Coba ubah kata kunci pencarian atau filter Anda
            </p>
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="flex justify-between items-center pt-6 border-t border-[#D6E6F2]">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 text-[#2B5379] font-medium hover:bg-[#E8F6FF] rounded-xl transition-colors"
          >
            ← Kembali
          </button>
          <button
            onClick={handleNext}
            disabled={!selectedPsychologist}
            className={`
              px-8 py-3 rounded-xl font-semibold transition-all duration-300
              ${
                selectedPsychologist
                  ? "bg-[#2B5379] text-white hover:bg-[#234463] shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }
            `}
          >
            Lanjutkan →
          </button>
        </div>
      </section>
    </main>
  );
}

export default function PsychologistSelectionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F5F9FC] flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-[#2B5379] border-t-transparent rounded-full" />
        </div>
      }
    >
      <PsychologistSelectionContent />
    </Suspense>
  );
}
