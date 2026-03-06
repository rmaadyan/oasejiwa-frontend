"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Session } from "@/lib/types/psychologist";

interface UpcomingAppointmentsProps {
  sessions: Session[];
}

export default function UpcomingAppointments({ sessions }: UpcomingAppointmentsProps) {
  if (sessions.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <p className="text-gray-600 font-medium">Tidak ada jadwal mendatang</p>
        <p className="text-sm text-gray-500 mt-1">7 hari ke depan kosong</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div>
          <h2 className="text-lg font-semibold text-[#2B5379]">Jadwal Mendatang</h2>
          <p className="text-sm text-gray-600 mt-1">7 hari ke depan</p>
        </div>
        <Link
          href="/psychologist/schedule"
          className="text-sm font-medium text-[#2B5379] hover:text-[#2B5379]/80 flex items-center gap-1"
        >
          Lihat Semua
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Sessions List */}
      <div className="divide-y divide-gray-200">
        {sessions.slice(0, 5).map((session) => (
          <div key={session.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-[#2B5379]">{session.patientName}</h3>
                <p className="text-sm text-gray-600">{session.service}</p>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>{session.date}</span>
                <span className="text-gray-400">•</span>
                <span>{session.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
