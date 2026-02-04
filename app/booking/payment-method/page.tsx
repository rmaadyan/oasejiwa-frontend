"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BookingStepper from "@/components/booking/BookingStepper";
import PaymentMethodCard from "@/components/booking/PaymentMethodCard";

// Mock booking summary data (in real app, fetch from state/API)
const bookingSummary = {
  service: "Konseling Individu",
  psychologist: "Dr. Sarah Wijaya, M.Psi",
  date: "Senin, 15 Januari 2025",
  time: "10:00 WIB",
  duration: "60 menit",
  price: 200000,
};

// Payment methods data
const paymentMethods = [
  {
    id: "bca",
    name: "BCA Virtual Account",
    logo: "/assets/payments/bca.png",
    category: "bank",
  },
  {
    id: "bni",
    name: "BNI Virtual Account",
    logo: "/assets/payments/bni.png",
    category: "bank",
  },
  {
    id: "mandiri",
    name: "Mandiri Virtual Account",
    logo: "/assets/payments/mandiri.png",
    category: "bank",
  },
  {
    id: "bri",
    name: "BRI Virtual Account",
    logo: "/assets/payments/bri.png",
    category: "bank",
  },
  {
    id: "gopay",
    name: "GoPay",
    logo: "/assets/payments/gopay.png",
    category: "ewallet",
  },
  {
    id: "ovo",
    name: "OVO",
    logo: "/assets/payments/ovo.png",
    category: "ewallet",
  },
  {
    id: "dana",
    name: "DANA",
    logo: "/assets/payments/dana.png",
    category: "ewallet",
  },
  {
    id: "shopeepay",
    name: "ShopeePay",
    logo: "/assets/payments/shopeepay.png",
    category: "ewallet",
  },
];

function PaymentMethodContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("service");
  const psychologistId = searchParams.get("psychologist");
  const date = searchParams.get("date");
  const time = searchParams.get("time");

  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

  const bankMethods = paymentMethods.filter((p) => p.category === "bank");
  const ewalletMethods = paymentMethods.filter((p) => p.category === "ewallet");

  const handleNext = () => {
    if (selectedPayment) {
      router.push(
        `/booking/payment-confirmation?service=${serviceId}&psychologist=${psychologistId}&date=${date}&time=${time}&payment=${selectedPayment}`
      );
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <main className="min-h-screen bg-white font-[var(--font-poppins)]">

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 px-6 lg:px-16 bg-gradient-to-b from-[#E8F6FF] to-white">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-[40px] md:text-[48px] font-semibold mb-4 animate-fade-in-up">
            <span className="text-[#2B5379]">Metode </span>
            <span className="text-[#234463]">Pembayaran</span>
          </h1>
          <p className="text-lg text-[#4B4B4B] animate-fade-in-up">
            Selesaikan pembayaran untuk mengonfirmasi booking Anda
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-5xl mx-auto px-4 py-8">
        {/* Stepper */}
        <div className="mb-8 animate-fadeIn stagger-2">
          <BookingStepper currentStep={5} />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Payment Methods */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bank Transfer */}
            <div className="animate-fadeIn stagger-3">
              <h2 className="text-lg font-bold text-[#234463] mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                Transfer Bank (Virtual Account)
              </h2>
              <div className="space-y-3">
                {bankMethods.map((method, index) => (
                  <div
                    key={method.id}
                    className="animate-fadeIn"
                    style={{ animationDelay: `${(index + 4) * 0.1}s` }}
                  >
                    <PaymentMethodCard
                      id={method.id}
                      name={method.name}
                      logo={method.logo}
                      isSelected={selectedPayment === method.id}
                      onSelect={setSelectedPayment}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* E-Wallet */}
            <div className="animate-fadeIn stagger-4">
              <h2 className="text-lg font-bold text-[#234463] mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                E-Wallet
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ewalletMethods.map((method, index) => (
                  <div
                    key={method.id}
                    className="animate-fadeIn"
                    style={{ animationDelay: `${(index + 8) * 0.1}s` }}
                  >
                    <PaymentMethodCard
                      id={method.id}
                      name={method.name}
                      logo={method.logo}
                      isSelected={selectedPayment === method.id}
                      onSelect={setSelectedPayment}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-8 animate-fadeIn stagger-5">
              <h2 className="text-lg font-bold text-[#234463] mb-4">
                Ringkasan Pesanan
              </h2>

              {/* Summary Items */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-[#4B4B4B]">Layanan</span>
                  <span className="font-medium text-[#234463]">
                    {bookingSummary.service}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#4B4B4B]">Psikolog</span>
                  <span className="font-medium text-[#234463] text-right">
                    {bookingSummary.psychologist}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#4B4B4B]">Tanggal</span>
                  <span className="font-medium text-[#234463]">
                    {bookingSummary.date}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#4B4B4B]">Waktu</span>
                  <span className="font-medium text-[#234463]">
                    {bookingSummary.time}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#4B4B4B]">Durasi</span>
                  <span className="font-medium text-[#234463]">
                    {bookingSummary.duration}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-dashed border-[#D6E6F2] my-4" />

              {/* Total */}
              <div className="flex justify-between items-center mb-6">
                <span className="font-semibold text-[#234463]">Total</span>
                <span className="text-xl font-bold text-[#2B5379]">
                  {formatPrice(bookingSummary.price)}
                </span>
              </div>

              {/* Selected Payment */}
              {selectedPayment && (
                <div className="bg-[#E8F6FF] rounded-xl p-3 mb-4 flex items-center gap-3 animate-fadeIn">
                  <svg
                    className="w-5 h-5 text-[#22C55E]"
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
                  <span className="text-sm text-[#234463]">
                    {
                      paymentMethods.find((p) => p.id === selectedPayment)
                        ?.name
                    }
                  </span>
                </div>
              )}

              {/* Pay Button */}
              <button
                onClick={handleNext}
                disabled={!selectedPayment}
                className={`
                  w-full py-3 rounded-xl font-semibold transition-all duration-300
                  ${
                    selectedPayment
                      ? "bg-[#2B5379] text-white hover:bg-[#234463] shadow-lg hover:shadow-xl"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }
                `}
              >
                Bayar Sekarang
              </button>

              {/* Security Note */}
              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-[#4B4B4B]">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <span>Pembayaran aman & terenkripsi</span>
              </div>
            </div>
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
    </main>
  );
}

export default function PaymentMethodPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-[#2B5379] border-t-transparent rounded-full" />
        </div>
      }
    >
      <PaymentMethodContent />
    </Suspense>
  );
}
