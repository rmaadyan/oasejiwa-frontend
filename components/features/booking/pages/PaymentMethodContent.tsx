"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BookingStepper from "@/components/booking/BookingStepper";
import {
  BookingHero,
  PaymentMethodsSection,
  BookingSummaryCard,
  BookingSummary,
  PaymentMethod,
} from "@/components/features/booking";

interface PaymentMethodContentProps {
  bookingSummary: BookingSummary;
  paymentMethods: PaymentMethod[];
}

function PaymentMethodInner({
  bookingSummary,
  paymentMethods,
}: PaymentMethodContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("service");
  const psychologistId = searchParams.get("psychologist");
  const date = searchParams.get("date");
  const time = searchParams.get("time");

  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

  const handleNext = () => {
    if (selectedPayment) {
      router.push(
        `/booking/payment-confirmation?service=${serviceId}&psychologist=${psychologistId}&date=${date}&time=${time}&payment=${selectedPayment}`
      );
    }
  };

  return (
    <>
      <BookingHero
        title={
          <>
            <span className="text-[#2B5379]">Metode </span>
            <span className="text-[#234463]">Pembayaran</span>
          </>
        }
        subtitle="Selesaikan pembayaran untuk mengonfirmasi booking Anda"
      />

      <section className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8 animate-fadeIn stagger-2">
          <BookingStepper currentStep={5} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <PaymentMethodsSection
              paymentMethods={paymentMethods}
              selectedPayment={selectedPayment}
              onSelectPayment={setSelectedPayment}
            />
          </div>

          <div className="lg:col-span-1">
            <BookingSummaryCard
              summary={bookingSummary}
              selectedPayment={selectedPayment}
              paymentMethods={paymentMethods}
              onPayClick={handleNext}
            />
          </div>
        </div>

        {/* Bottom Navigation - Mobile */}
        <div className="flex justify-between items-center pt-6 mt-6 border-t border-[#D6E6F2] lg:hidden">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 text-[#2B5379] font-medium hover:bg-[#E8F6FF] rounded-xl transition-colors"
          >
            ← Kembali
          </button>
        </div>
      </section>
    </>
  );
}

export default function PaymentMethodContent(props: PaymentMethodContentProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-[#2B5379] border-t-transparent rounded-full" />
        </div>
      }
    >
      <PaymentMethodInner {...props} />
    </Suspense>
  );
}
