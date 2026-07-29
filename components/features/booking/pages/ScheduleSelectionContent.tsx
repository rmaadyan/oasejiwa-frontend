"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BookingStepper from "@/components/booking/BookingStepper";
import {
  BookingHero,
  BookingNavigation,
  ScheduleSection,
  ScheduleSummary,
  PsychologistProfile,
} from "@/components/features/booking";
import { DateOption, RawSchedule } from "@/lib/booking-data";

interface ScheduleSelectionContentProps {
  psychologist: PsychologistProfile;
  dates: DateOption[];
  rawSchedules: RawSchedule[]; 
}

function ScheduleSelectionInner({
  psychologist,
  dates,
  rawSchedules,
}: ScheduleSelectionContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("service");
  const psychologistId = searchParams.get("psychologist");

  const [selectedDate, setSelectedDate] = useState<string | null>(
    dates[0]?.value || null
  );
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);

  // 🟢 KUNCI UTAMA: Pilih hari pertama otomatis jika data dates baru selesai dimuat
  useEffect(() => {
    if (dates && dates.length > 0) {
      if (!selectedDate || !dates.some((d) => d.value === selectedDate)) {
        setSelectedDate(dates[0].value);
      }
    }
  }, [dates, selectedDate]);

  const selectedSlot = rawSchedules.find((s) => s.id === selectedScheduleId);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedScheduleId(null);
  };

  const handleNext = () => {
    if (selectedDate && selectedScheduleId) {
      router.push(
        `/booking/form?service=${serviceId}&psychologist=${psychologistId}&date=${selectedDate}&scheduleId=${selectedScheduleId}&time=${selectedSlot?.startTime}`
      );
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f7fb]">
      <BookingHero
        title={
          <>
            <span className="text-[#000000]">Pilih </span>
            <span className="text-[#234463]">Jadwal</span>
          </>
        }
        subtitle="Tentukan waktu konsultasi yang sesuai dengan jadwal Anda"
      />

      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8 animate-fadeIn stagger-2">
          <BookingStepper currentStep={2} />
        </div>

        <ScheduleSection
          psychologist={psychologist}
          dates={dates}
          rawSchedules={rawSchedules}   
          selectedDate={selectedDate}
          selectedScheduleId={selectedScheduleId} 
          onDateSelect={handleDateSelect}
          onScheduleSelect={setSelectedScheduleId}
        />

        {selectedDate && selectedScheduleId && selectedSlot && (
          <ScheduleSummary
            selectedDate={selectedDate}
            selectedScheduleId={selectedScheduleId}
            selectedStartTime={selectedSlot.startTime}
          />
        )}

        <div className="mt-6">
          <BookingNavigation
            onBack={() => router.back()}
            onNext={handleNext}
            isNextDisabled={!selectedDate || !selectedScheduleId}
          />
        </div>
      </section>
    </main>
  );
}

export default function ScheduleSelectionContent(
  props: ScheduleSelectionContentProps
) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f5f7fb] flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-[#2B5379] border-t-transparent rounded-full" />
        </div>
      }
    >
      <ScheduleSelectionInner {...props} />
    </Suspense>
  );
}