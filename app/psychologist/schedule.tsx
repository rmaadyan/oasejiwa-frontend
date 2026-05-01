"use client";

import { useEffect, useState } from "react";
import FilterBar from "@/components/features/psychologist/schedule/filterbar";
import ScheduleCalendar from "@/components/features/psychologist/schedule/schedulecalendar";
import ScheduleList from "@/components/features/psychologist/schedule/schedulelist";
import SessionDetailModal from "@/components/features/psychologist/schedule/sessiondetailmodal";
import {
  cancelSession,
  getAllSessions,
  markSessionCompleted,
} from "@/lib/api/psychologist";
import type {
  ScheduleResponse,
  Session,
  SessionStatus,
} from "@/lib/types/psychologist";

export default function SchedulePage() {
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"calendar" | "list">("list");
  const [statusFilter, setStatusFilter] = useState<SessionStatus | "all">(
    "all"
  );
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<
    string | undefined
  >(undefined);
  const [scheduleData, setScheduleData] = useState<ScheduleResponse | null>(
    null
  );
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchSchedule = async (dateFilter?: string) => {
    setLoading(true);

    try {
      const data = await getAllSessions({
        status: statusFilter !== "all" ? statusFilter : undefined,
        date: dateFilter,
      });

      setScheduleData(data);
    } catch (error) {
      console.error("Failed to fetch schedule:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (view === "list") {
      fetchSchedule();
    } else {
      fetchSchedule(selectedCalendarDate);
    }
  }, [statusFilter, view]);

  useEffect(() => {
    if (view === "calendar") {
      fetchSchedule(selectedCalendarDate);
    }
  }, [selectedCalendarDate]);

  const handleViewChange = (newView: "calendar" | "list") => {
    setView(newView);

    if (newView === "list") {
      setSelectedCalendarDate(undefined);
    }
  };

  const handleViewDetails = (session: Session) => {
    setSelectedSession(session);
    setIsModalOpen(true);
  };

  const handleMarkCompleted = async (sessionId: number | string) => {
    try {
      await markSessionCompleted(sessionId);
      await fetchSchedule(view === "calendar" ? selectedCalendarDate : undefined);
      setIsModalOpen(false);
      setSelectedSession(null);
    } catch (error) {
      console.error("Failed to mark session as completed:", error);
      throw error;
    }
  };

  const handleCancelSession = async (
    sessionId: number | string,
    reason: string
  ) => {
    try {
      await cancelSession(sessionId, { reason });
      await fetchSchedule(view === "calendar" ? selectedCalendarDate : undefined);
      setIsModalOpen(false);
      setSelectedSession(null);
    } catch (error) {
      console.error("Failed to cancel session:", error);
      throw error;
    }
  };

  const handleCalendarDateSelect = (date: string) => {
    if (selectedCalendarDate === date) {
      setSelectedCalendarDate(undefined);
    } else {
      setSelectedCalendarDate(date);
    }
  };

  if (loading && !scheduleData) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#2B5379] border-t-transparent" />
          <p className="text-gray-600">Memuat jadwal...</p>
        </div>
      </div>
    );
  }

  const sessions = scheduleData?.sessions || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#2B5379]">
          Jadwal Konseling
        </h1>
        <p className="mt-1 text-gray-600">
          Kelola jadwal sesi konseling Anda
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm font-medium text-gray-600">Total Sesi</p>
          <p className="mt-2 text-3xl font-bold text-[#2B5379]">
            {scheduleData?.total || 0}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm font-medium text-gray-600">Akan Datang</p>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {scheduleData?.upcomingCount || 0}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm font-medium text-gray-600">Selesai</p>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {scheduleData?.completedCount || 0}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm font-medium text-gray-600">Dibatalkan</p>
          <p className="mt-2 text-3xl font-bold text-red-600">
            {scheduleData?.cancelledCount || 0}
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        view={view}
        onViewChange={handleViewChange}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {/* Calendar/List View */}
      {view === "calendar" ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <ScheduleCalendar
              sessions={sessions}
              onDateSelect={handleCalendarDateSelect}
              selectedDate={selectedCalendarDate}
            />
          </div>

          <div className="lg:col-span-2">
            {selectedCalendarDate ? (
              <div>
                <h2 className="mb-4 text-lg font-semibold text-[#2B5379]">
                  Sesi pada {selectedCalendarDate}
                </h2>

                <ScheduleList
                  sessions={sessions.filter(
                    (session) => session.date === selectedCalendarDate
                  )}
                  onViewDetails={handleViewDetails}
                />
              </div>
            ) : (
              <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
                <p className="font-medium text-gray-600">Pilih tanggal</p>
                <p className="mt-1 text-sm text-gray-500">
                  Klik tanggal di kalender untuk melihat sesi
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <ScheduleList sessions={sessions} onViewDetails={handleViewDetails} />
      )}

      <SessionDetailModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSession(null);
        }}
        session={selectedSession}
        onMarkCompleted={handleMarkCompleted}
        onCancel={handleCancelSession}
      />
    </div>
  );
}