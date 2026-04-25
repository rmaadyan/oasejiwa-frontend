"use client";

import { useRef } from "react";

interface PaymentUploadSectionProps {
  uploadedFile: File | null;
  previewUrl: string | null;
  isSubmitting: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: () => void;
  onSubmit: () => void;
}

export default function PaymentUploadSection({
  uploadedFile,
  previewUrl,
  isSubmitting,
  onFileChange,
  onRemoveFile,
  onSubmit,
}: PaymentUploadSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRemove = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onRemoveFile();
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 animate-fadeIn stagger-5">
      <h2 className="text-lg font-bold text-[#234463] mb-4">
        Upload Bukti Pembayaran
      </h2>
      <p className="text-sm text-[#4B4B4B] mb-4">
        Upload screenshot atau foto bukti transfer Anda untuk mempercepat proses
        verifikasi.
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
            <p className="text-xs text-[#4B4B4B]">PNG, JPG atau PDF (Max 5MB)</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={onFileChange}
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
              onClick={handleRemove}
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
        onClick={onSubmit}
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
  );
}
