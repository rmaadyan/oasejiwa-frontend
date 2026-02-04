import { PaymentConfirmationContent } from "@/components/features/booking";
import { paymentData } from "@/lib/booking-data";

export default function PaymentConfirmationPage() {
  return (
    <main className="min-h-screen bg-white font-[var(--font-poppins)]">
      <PaymentConfirmationContent paymentData={paymentData} />
    </main>
  );
}
