import { PaymentMethodContent } from "@/components/features/booking";
import { bookingSummary, paymentMethods } from "@/lib/booking-data";

export default function PaymentMethodPage() {
  return (
    <main className="min-h-screen bg-white font-[var(--font-poppins)]">
      <PaymentMethodContent
        bookingSummary={bookingSummary}
        paymentMethods={paymentMethods}
      />
    </main>
  );
}
