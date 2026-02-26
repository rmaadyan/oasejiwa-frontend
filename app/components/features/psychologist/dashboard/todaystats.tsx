"use client";

import type { PsychologistDashboardStats } from "@/lib/types/psychologist";

interface TodayStatsProps {
  stats: PsychologistDashboardStats;
}

export default function TodayStats({ stats }: TodayStatsProps) {
  const cards = [
    {
      label: "Sesi Hari Ini",
      value: stats.todaySessions,
      subtext: `${stats.todayCompleted} selesai`,
    },
    {
      label: "Sesi Minggu Ini",
      value: stats.weekSessions,
      subtext: "Total minggu ini",
    },
    {
      label: "Total Pasien",
      value: stats.totalPatients,
      subtext: `${stats.activePatientsThisMonth} aktif bulan ini`,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card) => {
        return (
          <div
            key={card.label}
            className="bg-white rounded-xl border border-gray-200 p-6"
          >
            <p className="text-sm font-medium text-gray-600 mb-2">
              {card.label}
            </p>
            <p className="text-3xl font-bold text-[#2B5379] mb-1">
              {card.value}
            </p>
            <p className="text-xs text-gray-500">{card.subtext}</p>
          </div>
        );
      })}
    </div>
  );
}
