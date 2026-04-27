"use client";
import { PaymentConfirmationContent } from "@/components/features/booking";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useEffect, useState } from "react";
import { getUserBookingDetail } from "@/lib/api/booking";

const BANK_ACCOUNTS: Record<string, string> = {
  "bca": "123-456-7890",
  "bni": "098-765-4321",
  "mandiri": "111-222-333-444",
  "gopay": "0812-3456-7890",
  "ovo": "0812-9876-5432",
};

function Content() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const [paymentData, setPaymentData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const selectedPayment = searchParams.get("payment"); 

  useEffect(() => {
    if (!bookingId) return;
    getUserBookingDetail(bookingId)
      .then((res) => {
        const data = res.data; 
        const accountNumber = selectedPayment 
          ? BANK_ACCOUNTS[selectedPayment.toLowerCase()] 
          : (data.bankNumber ?? "Pilih metode pembayaran");
        setPaymentData({
          orderId: data.id ?? bookingId,
          accountNumber: accountNumber,
          bank: selectedPayment?.toUpperCase() ?? data.bank?.toUpperCase() ?? "-",
          amount: data.dpAmount ?? Math.ceil((data.totalPrice ?? 0) * 0.5),
          expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          service: data.service?.nama ?? "-",
          psychologist: data.psychologist?.fullName ?? "-",
          date: data.scheduledDate ?? "-",
          time: data.scheduledTime ?? "-",
        });
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [bookingId]);

  if (isLoading) return (
    <div className="min-h-screen bg-[#f5f7fb] flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-[#2B5379] border-t-transparent rounded-full" />
    </div>
  );

  if (!paymentData) return (
    <div className="min-h-screen bg-[#f5f7fb] flex items-center justify-center">
      <p className="text-red-500">Data pembayaran tidak ditemukan.</p>
    </div>
  );

  return <PaymentConfirmationContent paymentData={paymentData} />;
}

export default function PaymentConfirmationPage() {
  return (
    <main className="min-h-screen bg-white font-[var(--font-poppins)]">
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-[#2B5379] border-t-transparent rounded-full" /></div>}>
        <Content />
      </Suspense>
    </main>
  );
}