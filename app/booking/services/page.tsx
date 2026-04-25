import { ServiceSelectionContent } from "@/components/features/booking";
import { bookingServices } from "@/lib/booking-data";

export default function ServiceSelectionPage() {
  return (
    <main className="min-h-screen bg-white font-[var(--font-poppins)]">
      <ServiceSelectionContent services={bookingServices} />
    </main>
  );
}
