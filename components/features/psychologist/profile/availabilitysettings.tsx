"use client";

import { Calendar, Clock } from "lucide-react";
import type { PsychologistSchedule } from "@/lib/types/psychologist";

interface AvailabilitySettingsProps {
  schedules?: PsychologistSchedule[];
}

export default function AvailabilitySettings({
  schedules = [],
}: AvailabilitySettingsProps) {
  /**
   * Ambil tanggal sebagai date-only.
   *
   * Tujuannya supaya tanggal dari backend seperti:
   * "2026-05-01T17:00:00.000Z"
   *
   * tidak berubah jadi tanggal 2 ketika diparse oleh browser dengan timezone lokal.
   */
  const getDateKey = (date?: string | Date | null) => {
    if (!date) return "";

    const rawDate = String(date);

    if (/^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
      return rawDate;
    }

    if (/^\d{4}-\d{2}-\d{2}T/.test(rawDate)) {
      return rawDate.slice(0, 10);
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const day = String(parsedDate.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const formatDate = (date?: string | Date | null) => {
    const dateKey = getDateKey(date);

    if (!dateKey) return "-";

    const [year, month, day] = dateKey.split("-").map(Number);

    return new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(year, month - 1, day));
  };

  const formatDuration = (duration?: number | null) => {
    if (!duration) return "-";

    if (duration < 60) {
      return `${duration} menit`;
    }

    const hour = Math.floor(duration / 60);
    const minute = duration % 60;

    if (minute === 0) {
      return `${hour} jam`;
    }

    return `${hour} jam ${minute} menit`;
  };

  const availableSchedules = schedules
    .filter((schedule) => schedule.isAvailable)
    .sort((a, b) => {
      const dateA = getDateKey(a.date);
      const dateB = getDateKey(b.date);

      if (dateA !== dateB) {
        return dateA.localeCompare(dateB);
      }

      return String(a.startTime || "").localeCompare(
        String(b.startTime || "")
      );
    });

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[#2B5379]">
          Ketersediaan
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Jadwal praktik Anda berdasarkan data dari admin
        </p>
      </div>

      <div className="space-y-3">
        {availableSchedules.length > 0 ? (
          availableSchedules.map((schedule) => (
            <div
              key={schedule.id}
              className="rounded-lg border border-green-200 bg-green-50 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-medium text-green-900">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(schedule.date)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-green-700">
                    <Clock className="h-4 w-4" />
                    <span>
                      {schedule.startTime || "-"} •{" "}
                      {formatDuration(schedule.duration)}
                    </span>
                  </div>
                </div>

                <span className="shrink-0 rounded-full border border-green-200 bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                  Tersedia
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm text-gray-600">
              Belum ada jadwal tersedia.
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 rounded-lg border-l-4 border-blue-500 bg-blue-50 p-4">
        <p className="text-sm text-blue-900">
          <strong>Info:</strong> Untuk mengubah jadwal ketersediaan, hubungi
          admin.
        </p>
      </div>
    </div>
  );
}