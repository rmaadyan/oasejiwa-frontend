"use client";

import { useRouter } from "next/navigation";

interface PaymentSuccessCardProps {
  orderId: string;
  service: string;
  date: string;
}

export default function PaymentSuccessCard({
  orderId,
  service,
  date,
}: PaymentSuccessCardProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white font-[var(--font-poppins)] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full text-center animate-fadeIn">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-[#22C55E] rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-subtle">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-[#234463] mb-2">
          Pembayaran Terkirim!
        </h1>
        <p className="text-[#4B4B4B] mb-6">
          Bukti pembayaran Anda sedang diverifikasi. Kami akan mengirim
          notifikasi setelah pembayaran dikonfirmasi.
        </p>

        {/* Order Summary */}
        <div className="bg-[#E8F6FF] rounded-xl p-4 mb-6 text-left">
          <h3 className="font-semibold text-[#234463] mb-3">Detail Booking</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#4B4B4B]">No. Pesanan</span>
              <span className="font-medium text-[#234463]">{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#4B4B4B]">Layanan</span>
              <span className="font-medium text-[#234463]">{service}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#4B4B4B]">Jadwal</span>
              <span className="font-medium text-[#234463]">{date}</span>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => router.push("/bookings")}
            className="w-full py-3 bg-[#2B5379] text-white rounded-xl font-semibold hover:bg-[#234463] transition-colors"
          >
            Lihat Booking Saya
          </button>
          <button
            onClick={() => router.push("/")}
            className="w-full py-3 text-[#2B5379] hover:bg-[#E8F6FF] rounded-xl font-medium transition-colors"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
}
