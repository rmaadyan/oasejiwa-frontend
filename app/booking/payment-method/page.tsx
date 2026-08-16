"use client";
import { PaymentMethodContent } from "@/components/features/booking";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useEffect, useState } from "react";
import { getUserBookingDetail } from "@/lib/api/booking";

function Content() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const [bookingSummary, setBookingSummary] = useState<any>(null);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!bookingId) return;
    getUserBookingDetail(bookingId)
      .then((res) => {
        const data = res.data;
        setBookingSummary({
          service: data.service?.nama ?? "-", 
          psychologist: data.psychologist?.fullName ?? "-",
          date: data.scheduledDate ?? "-",
          time: data.scheduledTime ?? "-",
          price: data.totalPrice ?? 0, 
        });
        setPaymentMethods(data.paymentMethods ?? [
          { id: "qris", name: "QRIS (Kode Barcode / QR)", category: "qris", description: "Scan via GoPay, OVO, ShopeePay, Dana, BCA Mobile, Livin, dll" },
          { id: "mandiri", name: "Bank Mandiri", category: "bank" },
        ]);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [bookingId]);

  if (isLoading) return (
    <div className="min-h-screen bg-[#f5f7fb] flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-[#2B5379] border-t-transparent rounded-full" />
    </div>
  );

  if (!bookingSummary) return (
    <div className="min-h-screen bg-[#f5f7fb] flex items-center justify-center">
      <p className="text-red-500">Booking tidak ditemukan.</p>
    </div>
  );

  return <PaymentMethodContent bookingSummary={bookingSummary} paymentMethods={paymentMethods} />;
}

export default function PaymentMethodPage() {
  return (
    <main className="min-h-screen bg-white font-[var(--font-poppins)]">
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-[#2B5379] border-t-transparent rounded-full" /></div>}>
        <Content />
      </Suspense>
    </main>
  );
}