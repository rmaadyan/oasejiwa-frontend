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

  if (sessions.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <p className="text-gray-600 font-medium">Tidak ada jadwal</p>
        <p className="text-sm text-gray-500 mt-1">Belum ada sesi dengan filter ini</p>
      </div>
    );
  }

  // Group sessions by date
  const groupedSessions = sessions.reduce((acc, session) => {
    const date = session.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(session);
    return acc;
  }, {} as Record<string, Session[]>);

  // Sort dates (newest first)
  const sortedDates = Object.keys(groupedSessions).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  // Flatten sessions for pagination
  const allSessionsFlat = sortedDates.flatMap(date => 
    groupedSessions[date].map(session => ({ date, session }))
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      {currentDates.map((date) => (
        <div key={date}>
          {/* Date Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gray-200" />
            <h3 className="text-sm font-semibold text-[#2B5379] px-3 py-1 bg-gray-50 rounded-full">
              {date}
            </h3>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* Sessions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentGrouped[date].map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-sm text-gray-600">
            Menampilkan {startIndex + 1}-{Math.min(endIndex, allSessionsFlat.length)} dari {allSessionsFlat.length} sesi
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Show first page, last page, current page, and pages around current
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`min-w-8 h-8 px-2 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === page
                          ? "bg-[#2B5379] text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return <span key={page} className="px-2 text-gray-400">...</span>;
                }
                return null;
              })}
            </div>
            
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
