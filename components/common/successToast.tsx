'use client'
import { CheckCircle, X } from "lucide-react";

type SuccessToastProps = {
  open: boolean;
  message: string;
  onClose: () => void;
};

export default function SuccessToast({
  open,
  message,
  onClose,
}: SuccessToastProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-70 flex items-start justify-center pt-20 px-4">
      <div className="bg-white border border-gray-200 rounded-xl shadow-2xl p-2 flex items-center gap-3 max-w-md animate-slide-down">
        <div className="p-2 bg-green-100 rounded-full">
          <CheckCircle size={24} className="text-green-600" />
        </div>

        <div className="flex-1">
          <p className="font-semibold text-gray-900">Berhasil!</p>
          <p className="text-sm text-gray-600">{message}</p>
        </div>

        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
        >
          <X size={20} className="text-gray-400" />
        </button>
      </div>
    </div>
  );
}
