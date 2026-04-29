"use client";

import { Calendar, Clock } from "lucide-react";
import type { PsychologistSchedule } from "@/lib/types/psychologist";

interface AvailabilitySettingsProps {
  schedules?: PsychologistSchedule[];
}

export default function AvailabilitySettings({
  schedules = [],
}: AvailabilitySettingsProps) {
  const availableSchedules = schedules
    .filter((schedule) => schedule.isAvailable)
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();

      if (dateA !== dateB) return dateA - dateB;

      return a.startTime.localeCompare(b.startTime);
    });

  const formatDate = (date?: string | Date | null) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
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

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[#2B5379]">
          Ketersediaan
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Jadwal praktik Anda berdasarkan data dari admin
        </p>
      </div>

      <div className="space-y-3">
        {availableSchedules.length > 0 ? (
          availableSchedules.map((schedule) => (
            <div
              key={schedule.id}
              className="p-4 rounded-lg border border-green-200 bg-green-50"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-green-900 font-medium">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(schedule.date)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-green-700">
                    <Clock className="w-4 h-4" />
                    <span>
                      {schedule.startTime} • {formatDuration(schedule.duration)}
                    </span>
                  </div>
                </div>

                <span className="shrink-0 text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700 border border-green-200">
                  Tersedia
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
            <p className="text-sm text-gray-600">
              Belum ada jadwal tersedia.
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
        <p className="text-sm text-blue-900">
          <strong>Info:</strong> Untuk mengubah jadwal ketersediaan, hubungi
          admin.
        </p>
      </div>
    </div>
  );
}