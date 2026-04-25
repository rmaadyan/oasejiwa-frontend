"use client";

import { X, Clock, Calendar, MessageSquare, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import type { Session } from "@/lib/types/psychologist";

interface SessionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session | null;
  onMarkCompleted?: (sessionId: number) => void;
  onCancel?: (sessionId: number, reason: string) => void;
}

export default function SessionDetailModal({
  isOpen,
  onClose,
  session,
  onMarkCompleted,
  onCancel,
}: SessionDetailModalProps) {
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen || !session) return null;

  const handleMarkCompleted = async () => {
    if (!onMarkCompleted) return;
    setLoading(true);
    try {
      await onMarkCompleted(session.id);
      onClose();
    } catch (error) {
      console.error(error);
      alert("Gagal menandai sesi selesai");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!onCancel || !cancelReason.trim()) {
      alert("Harap masukkan alasan pembatalan");
      return;
    }
    setLoading(true);
    try {
      await onCancel(session.id, cancelReason);
      onClose();
    } catch (error) {
      console.error(error);
      alert("Gagal membatalkan sesi");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = () => {
    const styles = {
      upcoming: "bg-blue-100 text-blue-700",
      completed: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
      "no-show": "bg-gray-100 text-gray-700"
    };

    const labels = {
      upcoming: "Akan Datang",
      completed: "Selesai",
      cancelled: "Dibatalkan",
      "no-show": "Tidak Hadir"
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${styles[session.status]}`}>
        {labels[session.status]}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div 
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-[#2B5379]">Detail Sesi</h2>
            <p className="text-sm text-gray-600 mt-1">Informasi lengkap sesi konseling</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Patient Info */}
          <div>
            <h3 className="text-lg font-semibold text-[#2B5379]">{session.patientName}</h3>
            <p className="text-sm text-gray-600">{session.service}</p>
            <div className="flex items-center gap-2 mt-2">
              {getStatusBadge()}
              <span className="text-xs text-gray-500">Sesi ke-{session.sessionNumber}</span>
            </div>
          </div>

          {/* Session Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-xs text-gray-600">Tanggal</p>
                <p className="text-sm font-medium text-gray-900">{session.date}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Clock className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-xs text-gray-600">Waktu</p>
                <p className="text-sm font-medium text-gray-900">{session.time} ({session.duration} menit)</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-xs text-gray-600">Status Pembayaran</p>
                <p className="text-sm font-medium text-gray-900">
                  {session.paymentStatus === "paid" ? "Lunas" : "Pending"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <MessageSquare className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-xs text-gray-600">Catatan</p>
                <p className="text-sm font-medium text-gray-900">{session.notes || "-"}</p>
              </div>
            </div>
          </div>

          {/* Cancel Form */}
          {showCancelForm && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Alasan Pembatalan
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Masukkan alasan pembatalan..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
              />
            </div>
          )}
        </div>

        {/* Actions */}
        {session.status === "upcoming" && (
          <div className="flex items-center gap-3 p-6 border-t border-gray-200 bg-gray-50">
            {!showCancelForm ? (
              <>
                <button
                  onClick={handleMarkCompleted}
                  disabled={loading}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#2B5379] rounded-lg hover:bg-[#2B5379]/90 transition-colors disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4" />
                  Tandai Selesai
                </button>
                <button
                  onClick={() => setShowCancelForm(true)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-300 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  Batalkan
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setShowCancelForm(false);
                    setCancelReason("");
                  }}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleCancel}
                  disabled={loading || !cancelReason.trim()}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {loading ? "Memproses..." : "Konfirmasi Pembatalan"}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
