import { PsychologistSelectionContent } from "@/components/features/booking";
import { psychologists, specializations } from "@/lib/booking-data";

export default function PsychologistSelectionPage() {
  return (
    <main className="min-h-screen bg-white font-[var(--font-poppins)]">
      <PsychologistSelectionContent
        psychologists={psychologists}
        specializations={specializations}
      />
    </main>
  );
}