"use client";

import { useRef, useState, useEffect } from "react";

interface PaymentUploadSectionProps {
  uploadedFile: File | null;
  previewUrl: string | null;
  isSubmitting: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: () => void;
  onSubmit: () => void;
}

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg"];
const ALLOWED_EXTENSIONS = [".png", ".jpg", ".jpeg"];

export default function PaymentUploadSection({
  uploadedFile,
  previewUrl,
  isSubmitting,
  onFileChange,
  onRemoveFile,
  onSubmit,
}: PaymentUploadSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadAreaRef = useRef<HTMLDivElement>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [shakeUpload, setShakeUpload] = useState(false);
  const [fileTypeError, setFileTypeError] = useState<string | null>(null);

  // Auto-hide warning after 5 seconds
  useEffect(() => {
    if (showWarning) {
      const timer = setTimeout(() => setShowWarning(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showWarning]);

  // Auto-hide file type error after 5 seconds
  useEffect(() => {
    if (fileTypeError) {
      const timer = setTimeout(() => setFileTypeError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [fileTypeError]);

  // Reset shake animation
  useEffect(() => {
    if (shakeUpload) {
      const timer = setTimeout(() => setShakeUpload(false), 600);
      return () => clearTimeout(timer);
    }
  }, [shakeUpload]);

  const handleRemove = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onRemoveFile();
  };

  const handleFileChangeWithValidation = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.toLowerCase().substring(file.name.lastIndexOf("."));
    if (!ALLOWED_TYPES.includes(file.type) && !ALLOWED_EXTENSIONS.includes(ext)) {
      setFileTypeError(
        `Format file "${file.name}" tidak didukung. Hanya file PNG dan JPG yang diperbolehkan.`
      );
      // Reset the input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setFileTypeError(null);
    setShowWarning(false);
    onFileChange(e);
  };

  const handleConfirmClick = () => {
    if (!uploadedFile) {
      // Show warning and scroll to upload area
      setShowWarning(true);
      setShakeUpload(true);
      uploadAreaRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }
    onSubmit();
  };

  const hasFile = !!uploadedFile;

  return (
    <div
      ref={uploadAreaRef}
      className="bg-white rounded-2xl p-6 shadow-sm mb-6 animate-fadeIn stagger-5"
    >
      <h2 className="text-lg font-bold text-[#234463] mb-4">
        Upload Bukti Pembayaran
      </h2>
      <p className="text-sm text-[#4B4B4B] mb-4">
        Upload screenshot atau foto bukti transfer Anda untuk mempercepat proses
        verifikasi.
      </p>

      {/* Warning Notification */}
      {showWarning && (
        <div className="mb-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 animate-[slideDown_0.3s_ease-out]">
          <svg
            className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-700">
              Bukti pembayaran belum diupload!
            </p>
            <p className="text-xs text-red-600 mt-0.5">
              Silakan upload bukti transfer dalam format PNG atau JPG sebelum melanjutkan konfirmasi pembayaran.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowWarning(false)}
            className="text-red-400 hover:text-red-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* File Type Error Notification */}
      {fileTypeError && (
        <div className="mb-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 animate-[slideDown_0.3s_ease-out]">
          <svg
            className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-700">
              Format file tidak didukung!
            </p>
            <p className="text-xs text-amber-600 mt-0.5">
              {fileTypeError}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setFileTypeError(null)}
            className="text-amber-400 hover:text-amber-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Upload Area */}
      {!uploadedFile ? (
        <label className="block">
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-[#2B5379] hover:bg-[#E8F6FF]/50 transition-all ${
              showWarning
                ? "border-red-400 bg-red-50/30"
                : "border-[#D6E6F2]"
            } ${shakeUpload ? "animate-[shake_0.5s_ease-in-out]" : ""}`}
          >
            <svg
              className={`w-12 h-12 mx-auto mb-3 ${
                showWarning ? "text-red-400" : "text-[#2B5379]"
              }`}
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
            <p className={`font-medium mb-1 ${
              showWarning ? "text-red-500" : "text-[#234463]"
            }`}>
              Klik untuk upload atau drag & drop
            </p>
            <p className="text-xs text-[#4B4B4B]">PNG atau JPG (Max 5MB)</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".png,.jpg,.jpeg,image/png,image/jpeg"
            className="hidden"
            onChange={handleFileChangeWithValidation}
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

      {/* Keyframes for custom animations */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        @keyframes slideDown {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Submit Button */}
      <button
        onClick={handleConfirmClick}
        disabled={isSubmitting}
        className={`
          w-full mt-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2
          ${
            isSubmitting
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : hasFile
                ? "bg-[#2B5379] text-white hover:bg-[#234463] shadow-lg hover:shadow-xl cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-70"
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
            {hasFile ? "Kirim Bukti Pembayaran" : "Konfirmasi Pembayaran (Lanjut Step Berikutnya >)"}
          </>
        )}
      </button>
    </div>
  );
}

