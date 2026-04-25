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

export interface PaymentData {
  orderId: string;
  virtualAccount: string;
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

  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59,
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
    if (!uploadedFile) return;

    setIsSubmitting(true);
    // Simulate upload
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSuccess(true);
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
          virtualAccount={paymentData.virtualAccount}
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
