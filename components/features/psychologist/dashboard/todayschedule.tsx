"use client";

import { CheckCircle, AlertCircle } from "lucide-react";
import type { Session } from "@/lib/types/psychologist";

interface TodayScheduleProps {
  sessions: Session[];
  onMarkCompleted?: (sessionId: number | string) => void;
}

export default function TodaySchedule({
  sessions,
  onMarkCompleted,
}: TodayScheduleProps) {
  const getStatusBadge = (status: string) => {
    const styles = {
      upcoming: "bg-blue-100 text-blue-700",
      completed: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
      "no-show": "bg-gray-100 text-gray-700",
    };

    const labels = {
      upcoming: "Akan Datang",
      completed: "Selesai",
      cancelled: "Dibatalkan",
      "no-show": "Tidak Hadir",
    };

    const safeStatus = status as keyof typeof styles;

    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
          styles[safeStatus] || "bg-gray-100 text-gray-700"
        }`}
      >
        {labels[safeStatus] || status}
      </span>
    );
  };

  const getPaymentBadge = (status: string) => {
    if (status === "paid") {
      return (
        <span className="inline-flex items-center gap-1 text-xs text-green-600">
          <CheckCircle className="h-3 w-3" />
          Lunas
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 text-xs text-orange-600">
        <AlertCircle className="h-3 w-3" />
        Pending
      </span>
    );
  };

  if (sessions.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
        <p className="font-medium text-gray-600">Tidak ada jadwal hari ini</p>
        <p className="mt-1 text-sm text-gray-500">
          Nikmati waktu istirahat Anda!
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-[#2B5379]">
          Jadwal Hari Ini
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          {sessions.length} sesi dijadwalkan
        </p>
      </div>

      <div className="divide-y divide-gray-200">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="p-6 transition-colors hover:bg-gray-50"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-[#2B5379]">
                  {session.patientName}
                </h3>

                <p className="mt-0.5 text-sm text-gray-600">
                  {session.service}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                  <span>
                    {session.time || "-"} ({session.duration || 0} menit)
                  </span>

                  <span className="text-gray-400">•</span>

                  <span>Sesi ke-{session.sessionNumber || 1}</span>

                  <span className="text-gray-400">•</span>

                  {getPaymentBadge(session.paymentStatus)}
                </div>
              </div>

              <div className="flex flex-col items-end gap-3">
                {getStatusBadge(session.status)}

                {session.status === "upcoming" && onMarkCompleted && (
                  <button
                    onClick={() => onMarkCompleted(session.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#2B5379] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#2B5379]/90"
                    type="button"
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                    Selesai
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}