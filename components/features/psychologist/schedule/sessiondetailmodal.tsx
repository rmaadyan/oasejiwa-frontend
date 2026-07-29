"use client";

import {
  X,
  Clock,
  Calendar,
  MessageSquare,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import type { Session } from "@/lib/types/psychologist";

interface SessionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session | null;
  onMarkCompleted?: (sessionId: number | string) => void | Promise<void>;
  onCancel?: (sessionId: number | string, reason: string) => void | Promise<void>;
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

  const formatDate = (date?: string | Date | null) => {
    if (!date) return "-";

    const rawDate = String(date);

    if (/^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
      const [year, month, day] = rawDate.split("-").map(Number);

      return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(new Date(year, month - 1, day));
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handleMarkCompleted = async () => {
    if (!session?.id) return;

    setLoading(true);

    try {
      // 1. Panggil API backend NestJS
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token'); // Sesuaikan tempat penyimpanan token-mu

      const res = await fetch(`${baseUrl}/psychologist/sessions/${session.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'COMPLETED' }),
      });

      const responseData = await res.json();

      if (!res.ok) {
        // 🟢 MENAMPILKAN POP-UP PENGINGAT JIKA BELUM WAKTUNYA
        alert(responseData.message || 'Sesi belum dapat ditandai selesai!');
        return;
      }

      // Jika ada callback dari parent component
      if (onMarkCompleted) {
        await onMarkCompleted(session.id);
      }

      alert('Sesi berhasil ditandai selesai!');
      onClose();
      
      // 🟢 Refresh halaman agar card statistik langsung ter-update (Selesai: 1)
      window.location.reload();
    } catch (error: any) {
      console.error(error);
      alert('Terjadi kesalahan saat memperbarui status sesi');
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
      await onCancel(session.id, cancelReason.trim());
      onClose();
    } catch (error) {
      console.error(error);
      alert("Gagal membatalkan sesi");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (statusParam?: string) => {
    const rawStatus = String(statusParam || session?.status || '').toLowerCase();

    let normalizedStatus = rawStatus;
    if (['approved', 'paid', 'success', 'confirmed'].includes(rawStatus)) {
      normalizedStatus = 'upcoming';
    }

    const styles: Record<string, string> = {
      upcoming: "bg-blue-100 text-blue-700",
      completed: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
      "no-show": "bg-gray-100 text-gray-700",
    };

    const labels: Record<string, string> = {
      upcoming: "Akan Datang",
      completed: "Selesai",
      cancelled: "Dibatalkan",
      "no-show": "Tidak Hadir",
    };

    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
          styles[normalizedStatus] || "bg-blue-100 text-blue-700"
        }`}
      >
        {labels[normalizedStatus] || statusParam || "Akan Datang"}
      </span>
    );
  };

  const handleClose = () => {
    setShowCancelForm(false);
    setCancelReason("");
    onClose();
  };

  const isUpcoming = ['upcoming', 'approved', 'paid', 'success', 'confirmed'].includes(
    String(session?.status || '').toLowerCase()
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div>
            <h2 className="text-xl font-semibold text-[#2B5379]">
              Detail Sesi
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Informasi lengkap sesi konseling
            </p>
          </div>

          <button
            onClick={handleClose}
            className="rounded-lg p-2 transition-colors hover:bg-gray-100"
            type="button"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 p-6">
          {/* Patient Info */}
          <div>
            <h3 className="text-lg font-semibold text-[#2B5379]">
              {session.patientName || "Pasien"}
            </h3>
            <p className="text-sm text-gray-600">
              {session.service || "Konseling"}
            </p>

            <div className="mt-2 flex items-center gap-2">
              {getStatusBadge(session?.status)}
              <span className="text-xs text-gray-500">
                Sesi ke-{session.sessionNumber || 1}
              </span>
            </div>
          </div>

          {/* Session Details */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
              <Calendar className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-xs text-gray-600">Tanggal</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatDate(session.date)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
              <Clock className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-xs text-gray-600">Waktu</p>
                <p className="text-sm font-medium text-gray-900">
                  {session.time || "-"} ({session.duration || 60} menit)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
              <CheckCircle className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-xs text-gray-600">Status Pembayaran</p>
                <p className="text-sm font-medium text-gray-900">
                  {session.paymentStatus === "paid" || isUpcoming ? "Lunas" : "Pending"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
              <MessageSquare className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-xs text-gray-600">Catatan</p>
                <p className="text-sm font-medium text-gray-900">
                  {session.notes || "-"}
                </p>
              </div>
            </div>
          </div>

          {/* Cancel Form */}
          {showCancelForm && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <label className="mb-2 block text-sm font-medium text-gray-900">
                Alasan Pembatalan
              </label>

              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Masukkan alasan pembatalan..."
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-red-500"
              />
            </div>
          )}
        </div>

        {/* Actions */}
        {isUpcoming && (
          <div className="flex items-center gap-3 border-t border-gray-200 bg-gray-50 p-6">
            {!showCancelForm ? (
              <>
                <button
                  onClick={handleMarkCompleted}
                  disabled={loading}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#2B5379] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2B5379]/90 disabled:opacity-50 cursor-pointer"
                  type="button"
                >
                  <CheckCircle className="h-4 w-4" />
                  {loading ? "Memproses..." : "Tandai Selesai"}
                </button>

                <button
                  onClick={() => setShowCancelForm(true)}
                  disabled={loading}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50 cursor-pointer"
                  type="button"
                >
                  <XCircle className="h-4 w-4" />
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
                  disabled={loading}
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
                  type="button"
                >
                  Batal
                </button>

                <button
                  onClick={handleCancel}
                  disabled={loading || !cancelReason.trim()}
                  className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50 cursor-pointer"
                  type="button"
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