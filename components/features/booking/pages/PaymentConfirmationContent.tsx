"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
  BookingHero,
  PaymentTimer,
  PaymentDetailsCard,
  PaymentInstructionsCard,
  PaymentUploadSection,
  PaymentSuccessCard,
  PaymentHelpSection,
} from "@/components/features/booking";
import { uploadPaymentDP, uploadPaymentFull } from "@/lib/api/payment";

export interface PaymentData {
  orderId: string;
  accountNumber: string;
  bank: string;
  amount: number;
  expiredAt: Date;
  service: string;
  psychologist: string;
  date: string;
  time: string;
}

interface PaymentConfirmationContentProps {
  paymentData: PaymentData;
}

function PaymentConfirmationInner({
  paymentData,
}: PaymentConfirmationContentProps) {
  const searchParams = useSearchParams();
  const paymentMethod = searchParams.get("payment");
  const bookingId = searchParams.get("bookingId");
  const paymentType = searchParams.get("type"); // "full" or null/DP

  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const expiry = new Date(paymentData.expiredAt).getTime();
    const difference = expiry - now;

    if (difference > 0) {
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      return { hours, minutes, seconds };
    }
    return { hours: 0, minutes: 0, seconds: 0 };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (newTimeLeft.hours === 0 && newTimeLeft.minutes === 0 && newTimeLeft.seconds === 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [paymentData.expiredAt]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!uploadedFile || !bookingId) return;

    try {
      setIsSubmitting(true);
      if (paymentType === "full") {
        await uploadPaymentFull(bookingId, uploadedFile, paymentMethod ?? "");
      } else {
        await uploadPaymentDP(bookingId, uploadedFile, paymentMethod ?? ""); 
      }
      setIsSuccess(true);
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Gagal mengupload bukti pembayaran");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success State
  if (isSuccess) {
    return (
      <PaymentSuccessCard
        orderId={paymentData.orderId}
        service={paymentData.service}
        date={paymentData.date}
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb]">
      <BookingHero
        title={
          <>
            <span className="text-[#2B5379]">Konfirmasi </span>
            <span className="text-[#234463]">Pembayaran</span>
          </>
        }
        subtitle="Selesaikan pembayaran untuk mengonfirmasi booking Anda"
      />

      <section className="max-w-3xl mx-auto px-4 py-8">
        <PaymentTimer
          hours={timeLeft.hours}
          minutes={timeLeft.minutes}
          seconds={timeLeft.seconds}
        />

        <PaymentDetailsCard
          bank={paymentData.bank}
          virtualAccount={paymentData.accountNumber}
          amount={paymentData.amount}
        />

        <PaymentInstructionsCard
          bank={paymentData.bank}
          amount={paymentData.amount}
        />

        <PaymentUploadSection
          uploadedFile={uploadedFile}
          previewUrl={previewUrl}
          isSubmitting={isSubmitting}
          onFileChange={handleFileChange}
          onRemoveFile={handleRemoveFile}
          onSubmit={handleSubmit}
        />

        <PaymentHelpSection />
      </section>
    </main>
  );
}

export default function PaymentConfirmationContent(
  props: PaymentConfirmationContentProps
) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f5f7fb] flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-[#2B5379] border-t-transparent rounded-full" />
        </div>
      }
    >
      <PaymentConfirmationInner {...props} />
    </Suspense>
  );
}
