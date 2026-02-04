"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Mock payment data
const paymentData = {
  orderId: "OJ-20250115-001",
  virtualAccount: "8800123456789012",
  bank: "BCA",
  amount: 200000,
  expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
  service: "Konseling Individu",
  psychologist: "Dr. Sarah Wijaya, M.Psi",
  date: "Senin, 15 Januari 2025",
  time: "10:00 WIB",
};

function PaymentConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentMethod = searchParams.get("payment");

  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59,
  });
  const [copied, setCopied] = useState(false);
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

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const padZero = (num: number) => num.toString().padStart(2, "0");

  // Success State
  if (isSuccess) {
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
            Bukti pembayaran Anda sedang diverifikasi. Kami akan mengirim notifikasi setelah pembayaran dikonfirmasi.
          </p>

          {/* Order Summary */}
          <div className="bg-[#E8F6FF] rounded-xl p-4 mb-6 text-left">
            <h3 className="font-semibold text-[#234463] mb-3">Detail Booking</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#4B4B4B]">No. Pesanan</span>
                <span className="font-medium text-[#234463]">{paymentData.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4B4B4B]">Layanan</span>
                <span className="font-medium text-[#234463]">{paymentData.service}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4B4B4B]">Jadwal</span>
                <span className="font-medium text-[#234463]">{paymentData.date}</span>
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

  return (
    <main className="min-h-screen bg-white font-[var(--font-poppins)]">

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 px-6 lg:px-16 bg-gradient-to-b from-[#E8F6FF] to-white">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-[40px] md:text-[48px] font-semibold mb-4 animate-fade-in-up">
            <span className="text-[#2B5379]">Konfirmasi </span>
            <span className="text-[#234463]">Pembayaran</span>
          </h1>
          <p className="text-lg text-[#4B4B4B] animate-fade-in-up">
            Selesaikan pembayaran untuk mengonfirmasi booking Anda
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-3xl mx-auto px-4 py-8">
        {/* Timer Warning */}
        <div className="bg-[#FEF3C7] border border-[#F59E0B] rounded-2xl p-4 mb-6 flex items-center gap-4 animate-fadeIn stagger-2">
          <div className="w-12 h-12 bg-[#F59E0B] rounded-full flex items-center justify-center flex-shrink-0">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm text-[#92400E] font-medium">
              Selesaikan pembayaran dalam:
            </p>
            <p className="text-2xl font-bold text-[#B45309]">
              {padZero(timeLeft.hours)}:{padZero(timeLeft.minutes)}:
              {padZero(timeLeft.seconds)}
            </p>
          </div>
        </div>

        {/* Payment Details Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 animate-fadeIn stagger-3">
          <h2 className="text-lg font-bold text-[#234463] mb-4">
            Detail Pembayaran
          </h2>

          {/* Amount */}
          <div className="bg-[#E8F6FF] rounded-xl p-4 mb-6 text-center">
            <p className="text-sm text-[#4B4B4B] mb-1">Total Pembayaran</p>
            <p className="text-3xl font-bold text-[#2B5379]">
              {formatPrice(paymentData.amount)}
            </p>
          </div>

          {/* Bank Info */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="text-sm text-[#4B4B4B]">Bank Tujuan</p>
                <p className="font-semibold text-[#234463]">{paymentData.bank}</p>
              </div>
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <img
                  src={`/assets/payments/${paymentData.bank.toLowerCase()}.png`}
                  alt={paymentData.bank}
                  className="max-w-[32px] max-h-[32px] object-contain"
                />
              </div>
            </div>

            {/* Virtual Account */}
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-[#4B4B4B] mb-2">Nomor Virtual Account</p>
              <div className="flex items-center justify-between">
                <p className="text-xl font-mono font-bold text-[#234463] tracking-wider">
                  {paymentData.virtualAccount}
                </p>
                <button
                  onClick={() => handleCopy(paymentData.virtualAccount)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                    ${
                      copied
                        ? "bg-[#22C55E] text-white"
                        : "bg-[#2B5379] text-white hover:bg-[#234463]"
                    }
                  `}
                >
                  {copied ? (
                    <>
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Tersalin
                    </>
                  ) : (
                    <>
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
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      Salin
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Instructions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 animate-fadeIn stagger-4">
          <h2 className="text-lg font-bold text-[#234463] mb-4">
            Cara Pembayaran
          </h2>
          <div className="space-y-3">
            {[
              "Buka aplikasi mobile banking atau ATM BCA",
              "Pilih menu Transfer > Virtual Account",
              "Masukkan nomor Virtual Account di atas",
              `Pastikan jumlah pembayaran adalah ${formatPrice(paymentData.amount)}`,
              "Konfirmasi dan selesaikan pembayaran",
              "Simpan bukti pembayaran dan upload di bawah",
            ].map((step, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#2B5379] text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium">
                  {index + 1}
                </div>
                <p className="text-[#4B4B4B] text-sm pt-0.5">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Upload Payment Proof */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 animate-fadeIn stagger-5">
          <h2 className="text-lg font-bold text-[#234463] mb-4">
            Upload Bukti Pembayaran
          </h2>
          <p className="text-sm text-[#4B4B4B] mb-4">
            Upload screenshot atau foto bukti transfer Anda untuk mempercepat proses verifikasi.
          </p>

          {/* Upload Area */}
          {!uploadedFile ? (
            <label className="block">
              <div className="border-2 border-dashed border-[#D6E6F2] rounded-xl p-8 text-center cursor-pointer hover:border-[#2B5379] hover:bg-[#E8F6FF]/50 transition-all">
                <svg
                  className="w-12 h-12 text-[#2B5379] mx-auto mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-[#234463] font-medium mb-1">
                  Klik untuk upload atau drag & drop
                </p>
                <p className="text-xs text-[#4B4B4B]">
                  PNG, JPG atau PDF (Max 5MB)
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          ) : (
            <div className="border border-[#D6E6F2] rounded-xl p-4">
              <div className="flex items-center gap-4">
                {/* Preview */}
                {previewUrl && (
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#234463] truncate">
                    {uploadedFile.name}
                  </p>
                  <p className="text-xs text-[#4B4B4B]">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                
                {/* Remove Button */}
                <button
                  onClick={handleRemoveFile}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!uploadedFile || isSubmitting}
            className={`
              w-full mt-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2
              ${
                uploadedFile && !isSubmitting
                  ? "bg-[#2B5379] text-white hover:bg-[#234463] shadow-lg hover:shadow-xl"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }
            `}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Mengirim...
              </>
            ) : (
              <>
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
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
                Kirim Bukti Pembayaran
              </>
            )}
          </button>
        </div>

        {/* Help Section */}
        <div className="bg-[#E8F6FF] rounded-2xl p-4 flex items-center gap-4 animate-fadeIn stagger-6">
          <div className="w-10 h-10 bg-[#2B5379] rounded-full flex items-center justify-center flex-shrink-0">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm text-[#234463] font-medium">
              Butuh bantuan?
            </p>
            <p className="text-xs text-[#4B4B4B]">
              Hubungi customer service kami di{" "}
              <a href="https://wa.me/6281234567890" className="text-[#2B5379] font-medium hover:underline">
                WhatsApp
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function PaymentConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-[#2B5379] border-t-transparent rounded-full" />
        </div>
      }
    >
      <PaymentConfirmationContent />
    </Suspense>
  );
}
