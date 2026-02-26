"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BookingStepper from "@/components/booking/BookingStepper";
import {
  BookingHero,
  BookingNavigation,
  ScheduleSection,
  ScheduleSummary,
  PsychologistProfile,
  TimeSlot,
  DateOption,
} from "@/components/features/booking";

interface ScheduleSelectionContentProps {
  psychologist: PsychologistProfile;
  dates: DateOption[];
  timeSlots: TimeSlot[];
}

function ScheduleSelectionInner({
  psychologist,
  dates,
  timeSlots,
}: ScheduleSelectionContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("service");
  const psychologistId = searchParams.get("psychologist");

  const [selectedDate, setSelectedDate] = useState<string | null>(
    dates[0]?.fullDate || null
  );
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleNext = () => {
    if (selectedDate && selectedTime) {
      router.push(
        `/booking/form?service=${serviceId}&psychologist=${psychologistId}&date=${selectedDate}&time=${selectedTime}`
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
          timeSlots={timeSlots}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          onDateSelect={handleDateSelect}
          onTimeSelect={setSelectedTime}
        />

        {selectedDate && selectedTime && (
          <ScheduleSummary
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            timeSlots={timeSlots}
          />
        )}

        <div className="mt-6">
          <BookingNavigation
            onBack={() => router.back()}
            onNext={handleNext}
            isNextDisabled={!selectedDate || !selectedTime}
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
