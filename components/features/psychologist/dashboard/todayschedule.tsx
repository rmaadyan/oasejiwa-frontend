"use client";

import { CheckCircle, AlertCircle } from "lucide-react";
import type { Session } from "@/lib/types/psychologist";

interface TodayScheduleProps {
  sessions: Session[];
  onMarkCompleted?: (sessionId: number) => void;
}

export default function TodaySchedule({ sessions, onMarkCompleted }: TodayScheduleProps) {
  const getStatusBadge = (status: string) => {
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
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getPaymentBadge = (status: string) => {
    if (status === "paid") {
      return (
        <span className="inline-flex items-center gap-1 text-xs text-green-600">
          <CheckCircle className="w-3 h-3" />
          Lunas
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-xs text-orange-600">
        <AlertCircle className="w-3 h-3" />
        Pending
      </span>
    );
  };

  if (sessions.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <p className="text-gray-600 font-medium">Tidak ada jadwal hari ini</p>
        <p className="text-sm text-gray-500 mt-1">Nikmati waktu istirahat Anda!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-[#2B5379]">Jadwal Hari Ini</h2>
        <p className="text-sm text-gray-600 mt-1">{sessions.length} sesi dijadwalkan</p>
      </div>

      {/* Sessions List */}
      <div className="divide-y divide-gray-200">
        {sessions.map((session) => (
          <div key={session.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between gap-4">
              {/* Left: Patient Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[#2B5379]">{session.patientName}</h3>
                <p className="text-sm text-gray-600 mt-0.5">{session.service}</p>
                
                <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-600">
                  <span>
                    {session.time} ({session.duration} menit)
                  </span>
                  <span className="text-gray-400">•</span>
                  <span>Sesi ke-{session.sessionNumber}</span>
                  <span className="text-gray-400">•</span>
                  {getPaymentBadge(session.paymentStatus)}
                </div>
              </div>

              {/* Right: Status & Actions */}
              <div className="flex flex-col items-end gap-3">
                {getStatusBadge(session.status)}
                
                {session.status === "upcoming" && onMarkCompleted && (
                  <button
                    onClick={() => onMarkCompleted(session.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#2B5379] rounded-lg hover:bg-[#2B5379]/90 transition-colors"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
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
