import { ScheduleSelectionContent } from "@/components/features/booking";
import {
  psychologistProfile,
  generateDates,
  timeSlots,
} from "@/lib/booking-data";

export default function ScheduleSelectionPage() {
  const dates = generateDates();

  return (
    <main className="min-h-screen bg-white font-[var(--font-poppins)]">
      <ScheduleSelectionContent
        psychologist={psychologistProfile}
        dates={dates}
        timeSlots={timeSlots}
      />
    </main>
  );
}
