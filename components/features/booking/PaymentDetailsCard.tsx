"use client";

import { useState } from "react";

interface PaymentDetailsCardProps {
  bank: string;
  virtualAccount: string;
  amount: number;
}

export default function PaymentDetailsCard({
  bank,
  virtualAccount,
  amount,
}: PaymentDetailsCardProps) {
  const [copied, setCopied] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 animate-fadeIn stagger-3">
      <h2 className="text-lg font-bold text-[#234463] mb-4">
        Detail Pembayaran
      </h2>

      {/* Amount */}
      <div className="bg-[#E8F6FF] rounded-xl p-4 mb-6 text-center">
        <p className="text-sm text-[#4B4B4B] mb-1">Total Pembayaran</p>
        <p className="text-3xl font-bold text-[#2B5379]">
          {formatPrice(amount)}
        </p>
      </div>

      {/* Bank Info */}
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <p className="text-sm text-[#4B4B4B]">Bank Tujuan</p>
            <p className="font-semibold text-[#234463]">{bank}</p>
          </div>
        </div>

        {/* Virtual Account */}
        <div className="p-4 bg-gray-50 rounded-xl">
          <p className="text-sm text-[#4B4B4B] mb-2">Nomor Pembayaran (Rekening / E-Wallet)</p>
          <div className="flex items-center justify-between">
            <p className="text-xl font-mono font-bold text-[#234463] tracking-wider">
              {virtualAccount}
            </p>
            <button
              onClick={() => handleCopy(virtualAccount)}
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
  );
}
