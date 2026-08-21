"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import SessionCard from "./sessioncard";
import type { Session } from "@/lib/types/psychologist";

interface ScheduleListProps {
  sessions: Session[];
  onViewDetails: (session: Session) => void;
}

export default function ScheduleList({ sessions, onViewDetails }: ScheduleListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const safeSessions = Array.isArray(sessions) ? sessions : [];

  if (safeSessions.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <p className="text-gray-600 font-medium">Tidak ada jadwal</p>
        <p className="text-sm text-gray-500 mt-1">Belum ada sesi dengan filter ini</p>
      </div>
    );
  }

  // 🟢 Helper format tanggal header Indonesia
  const formatDateHeader = (dateStr: string) => {
    if (!dateStr || dateStr === "undefined") return "Jadwal Belum Ditentukan";
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;

    return new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(d);
  };

  // Group sessions by date
  const groupedSessions = safeSessions.reduce((acc, session) => {
    const rawDate = session.date || "Tanpa Tanggal";
    const dateKey = String(rawDate).split("T")[0]; // Ambil format YYYY-MM-DD

    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(session);
    return acc;
  }, {} as Record<string, Session[]>);

  // Sort dates (terbaru terlebih dahulu)
  const sortedDates = Object.keys(groupedSessions).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  // Flatten sessions for pagination
  const allSessionsFlat = sortedDates.flatMap((date) =>
    groupedSessions[date].map((session) => ({ date, session }))
  );

  // Calculate pagination
  const totalPages = Math.ceil(allSessionsFlat.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSessions = allSessionsFlat.slice(startIndex, endIndex);

  // Group current page sessions by date
  const currentGrouped = currentSessions.reduce((acc, { date, session }) => {
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(session);
    return acc;
  }, {} as Record<string, Session[]>);

  const currentDates = Object.keys(currentGrouped);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      {currentDates.map((date) => (
        <div key={date}>
          {/* Date Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gray-200" />
            <h3 className="text-xs font-bold text-[#2B5379] px-3.5 py-1 bg-blue-50 border border-blue-200 rounded-full shadow-xs">
              {formatDateHeader(date)}
            </h3>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* Sessions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentGrouped[date].map((session) => (
              <SessionCard
                key={session.id || (session as any).bookingId}
                session={session}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4 text-xs">
          <div className="text-gray-600">
            Menampilkan {startIndex + 1}-{Math.min(endIndex, allSessionsFlat.length)} dari {allSessionsFlat.length} sesi
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              type="button"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`min-w-7 h-7 px-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        currentPage === page
                          ? "bg-[#2B5379] text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                      type="button"
                    >
                      {page}
                    </button>
                  );
                } else if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return (
                    <span key={page} className="px-1 text-gray-400">
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              type="button"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}