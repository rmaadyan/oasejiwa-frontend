"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import BookingStepper from "@/components/booking/BookingStepper";
import {
  GraduationCap,
  FileBadge,
  Brain,
  Calendar,
} from "lucide-react";

// Mock psychologist data (would come from API based on psychologistId)
const psychologistData = {
  id: "1",
  name: "Andi Zainuddin Japeri, M. Psi, Psikolog",
  avatar: "/assets/psychologists/sarah.jpg",
  education: [
    "Sarjana Psikologi, Universitas Indonesia",
    "Magister Profesi Psikologi, Universitas Gadjah Mada",
  ],
  licenseNumber: "1234567890",
  specialization: "Klinis Dewasa",
  bio: "Seorang psikolog klinis berpengalaman dengan fokus pada kesehatan mental dewasa. Memiliki pendekatan yang hangat dan empatik dalam membantu klien mengatasi berbagai tantangan emosional dan psikologis. Berpengalaman menangani kasus depresi, kecemasan, trauma, dan masalah hubungan interpersonal.",
  expertise: ["Konseling Psikologi", "Psikoterapi", "Asesmen Psikologi", "Intervensi Psikologi"],
  caseExperience: ["Depresi", "Kecemasan", "Trauma", "Disabilitas Intelektual", "Permasalahan Kepercayaan Diri", "Permasalahan Keluarga", "Permasalahan Komunikasi Anak", "Permasalahan Harga Diri", "Permasalahan Bully"],
};

// Generate dates for the next 14 days
const generateDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push({
      id: `date-${i}`,
      date: date,
      dayName: date.toLocaleDateString("id-ID", { weekday: "long" }),
      dayNumber: date.getDate(),
      monthName: date.toLocaleDateString("id-ID", { month: "short" }),
      fullDate: date.toISOString().split("T")[0],
      isToday: i === 0,
    });
  }
  return dates;
};

// Mock time slots
const timeSlots = [
  { id: "09:00", time: "09.00 WIB", available: true },
  { id: "10:00", time: "10.00 WIB", available: true },
  { id: "11:00", time: "11.00 WIB", available: true },
  { id: "13:00", time: "13.00 WIB", available: true },
  { id: "14:00", time: "14.00 WIB", available: true },
  { id: "15:00", time: "15.00 WIB", available: true },
  { id: "16:00", time: "16.00 WIB", available: false },
  { id: "19:00", time: "19.00 WIB", available: true },
  { id: "20:00", time: "20.00 WIB", available: true },
];

function ScheduleSelectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("service");
  const psychologistId = searchParams.get("psychologist");

  const [dates] = useState(generateDates());
  const [selectedDate, setSelectedDate] = useState<string | null>(
    dates[0]?.fullDate || null
  );
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleNext = () => {
    if (selectedDate && selectedTime) {
      router.push(
        `/booking/form?service=${serviceId}&psychologist=${psychologistId}&date=${selectedDate}&time=${selectedTime}`
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
            <span className="text-[#234463]">Jadwal</span>
          </h1>
          <p className="text-lg text-[#4B4B4B] animate-fade-in-up">
            Tentukan waktu konsultasi yang sesuai dengan jadwal Anda
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        {/* Stepper */}
        <div className="mb-8 animate-fadeIn stagger-2">
          <BookingStepper currentStep={3} />
        </div>

        {/* Main Card Container */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 animate-fadeIn stagger-3">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Psychologist Profile (1/3) */}
            <div className="lg:col-span-1 lg:border-r lg:border-gray-200 lg:pr-8">
              {/* Avatar */}
              <div className="flex flex-col items-center lg:items-start mb-6">
                <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 ring-4 ring-[#E8F6FF]">
                  <Image
                    src={psychologistData.avatar}
                    alt={psychologistData.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        psychologistData.name
                      )}&background=2B5379&color=fff&size=128`;
                    }}
                  />
                </div>
                <h2 className="text-lg font-bold text-slate-800 text-center lg:text-left">
                  {psychologistData.name}
                </h2>
              </div>

              {/* Info Sections */}
              <div className="space-y-5">
                {/* Education */}
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#E8F6FF] rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-[#2B5379]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-1">
                      Pendidikan
                    </h3>
                    <ul className="space-y-1">
                      {psychologistData.education.map((edu, index) => (
                        <li
                          key={index}
                          className="text-sm text-slate-500 leading-relaxed"
                        >
                          {edu}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* License Number */}
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#E8F6FF] rounded-lg flex items-center justify-center">
                    <FileBadge className="w-5 h-5 text-[#2B5379]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-1">
                      Nomor Izin Praktek
                    </h3>
                    <p className="text-sm text-slate-500">
                      {psychologistData.licenseNumber}
                    </p>
                  </div>
                </div>

                {/* Specialization */}
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#E8F6FF] rounded-lg flex items-center justify-center">
                    <Brain className="w-5 h-5 text-[#2B5379]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-1">
                      Spesialisasi
                    </h3>
                    <p className="text-sm text-slate-500">
                      {psychologistData.specialization}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="mt-6 pt-5 border-t border-gray-100">
                <p className="text-sm text-slate-500 leading-relaxed text-justify">
                  {psychologistData.bio}
                </p>
              </div>
            </div>

            {/* Right Column - Schedule & Competencies (2/3) */}
            <div className="lg:col-span-2 space-y-8">
              {/* Section A: Date Picker */}
              <div>
                <h3 className="text-base font-semibold text-slate-800 mb-4">
                  Jadwal Praktek
                </h3>
                <div className="flex items-center gap-2">
                  {/* Date Cards - Horizontal Scroll */}
                  <div className="flex-1 overflow-x-auto pb-2 scrollbar-hide">
                    <div className="flex gap-3 min-w-max">
                      {dates.slice(0, 7).map((date) => (
                        <button
                          key={date.id}
                          onClick={() => {
                            setSelectedDate(date.fullDate);
                            setSelectedTime(null);
                          }}
                          className={`
                            flex flex-col items-center justify-center p-2 min-w-[80px] rounded-lg border transition-all duration-200
                            ${
                              selectedDate === date.fullDate
                                ? "bg-blue-50 border-blue-500 text-blue-600"
                                : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                            }
                          `}
                        >
                          <span
                            className={`text-sm font-medium ${
                              selectedDate === date.fullDate
                                ? "text-blue-600"
                                : "text-gray-700"
                            }`}
                          >
                            {date.dayName}
                          </span>
                          <span
                            className={`text-sm ${
                              selectedDate === date.fullDate
                                ? "text-blue-500"
                                : "text-gray-500"
                            }`}
                          >
                            {date.dayNumber} {date.monthName}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Calendar Icon Button */}
                  <button className="flex-shrink-0 w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                    <Calendar className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Section B: Time Slots */}
              <div>
                <h3 className="text-base font-semibold text-slate-800 mb-4">
                  Pilih Waktu
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => slot.available && setSelectedTime(slot.id)}
                      disabled={!slot.available}
                      className={`
                        px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200
                        ${
                          !slot.available
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : selectedTime === slot.id
                              ? "bg-[#2B5379] text-white shadow-md"
                              : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
                        }
                      `}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Section C: Competency Tags */}
              <div className="space-y-5">
                {/* Keahlian */}
                <div>
                  <h3 className="text-base font-semibold text-slate-800 mb-3">
                    Keahlian
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {psychologistData.expertise.map((skill, index) => (
                      <span
                        key={index}
                        className="px-4 py-1.5 rounded-full border border-gray-300 text-gray-600 text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pengalaman Kasus */}
                <div>
                  <h3 className="text-base font-semibold text-slate-800 mb-3">
                    Pengalaman Kasus
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {psychologistData.caseExperience.map((experience, index) => (
                      <span
                        key={index}
                        className="px-4 py-1.5 rounded-full border border-gray-300 text-gray-600 text-sm"
                      >
                        {experience}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Selection Summary */}
        {selectedDate && selectedTime && (
          <div className="mt-6 bg-[#E8F6FF] rounded-2xl p-4 flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#2B5379] rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-[#4B4B4B]">Jadwal yang dipilih:</p>
                <p className="font-semibold text-[#234463]">
                  {new Date(selectedDate).toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}{" "}
                  •{" "}
                  {timeSlots.find((t) => t.id === selectedTime)?.time ||
                    selectedTime}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="flex justify-between items-center pt-6 mt-6 border-t border-[#D6E6F2]">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 text-[#2B5379] font-medium hover:bg-[#E8F6FF] rounded-xl transition-colors"
          >
            ← Kembali
          </button>
          <button
            onClick={handleNext}
            disabled={!selectedDate || !selectedTime}
            className={`
              px-8 py-3 rounded-xl font-semibold transition-all duration-300
              ${
                selectedDate && selectedTime
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

export default function ScheduleSelectionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-[#2B5379] border-t-transparent rounded-full" />
        </div>
      }
    >
      <ScheduleSelectionContent />
    </Suspense>
  );
}
