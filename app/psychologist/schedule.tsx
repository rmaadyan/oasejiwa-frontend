"use client";

import { useState, useEffect } from "react";
import FilterBar from "@/components/features/psychologist/schedule/filterbar";
import ScheduleCalendar from "@/components/features/psychologist/schedule/schedulecalendar";
import ScheduleList from "@/components/features/psychologist/schedule/schedulelist";
import SessionDetailModal from "@/components/features/psychologist/schedule/sessiondetailmodal";
import { 
  getAllSessions, 
  markSessionCompleted, 
  cancelSession,
} from "@/lib/api/psychologist";
import type { Session, SessionStatus, ScheduleResponse } from "@/lib/types/psychologist";

export default function SchedulePage() {
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"calendar" | "list">("list");
  const [statusFilter, setStatusFilter] = useState<SessionStatus | "all">("all");
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | undefined>(undefined);
  const [scheduleData, setScheduleData] = useState<ScheduleResponse | null>(null);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Separate fetch for calendar and list
  const fetchSchedule = async (dateFilter?: string) => {
    setLoading(true);
    try {
      const data = await getAllSessions({
        status: statusFilter !== "all" ? statusFilter : undefined,
        date: dateFilter
      });
      setScheduleData(data);
    } catch (error) {
      console.error("Failed to fetch schedule:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when status filter changes (for both views)
  useEffect(() => {
    if (view === "list") {
      // List view: don't use date filter
      fetchSchedule();
    } else {
      // Calendar view: use selected date if any
      fetchSchedule(selectedCalendarDate);
    }
  }, [statusFilter, view]);

  // Fetch data when calendar date changes (only in calendar view)
  useEffect(() => {
    if (view === "calendar") {
      fetchSchedule(selectedCalendarDate);
    }
  }, [selectedCalendarDate]);

  const handleViewChange = (newView: "calendar" | "list") => {
    setView(newView);
    // Reset calendar selection when switching to list
    if (newView === "list") {
      setSelectedCalendarDate(undefined);
    }
  };

  const handleViewDetails = (session: Session) => {
    setSelectedSession(session);
    setIsModalOpen(true);
  };

  const handleMarkCompleted = async (sessionId: number) => {
    try {
      await markSessionCompleted(sessionId);
      await fetchSchedule(view === "calendar" ? selectedCalendarDate : undefined);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to mark session as completed:", error);
      throw error;
    }
  };

  const handleCancelSession = async (sessionId: number, reason: string) => {
    try {
      await cancelSession(sessionId, { reason });
      await fetchSchedule(view === "calendar" ? selectedCalendarDate : undefined);
      setIsModalOpen(false);
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#2B5379] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat jadwal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#2B5379]">Jadwal Konseling</h1>
        <p className="text-gray-600 mt-1">Kelola jadwal sesi konseling Anda</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600">Total Sesi</p>
          <p className="text-3xl font-bold text-[#2B5379] mt-2">{scheduleData?.total || 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600">Akan Datang</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{scheduleData?.upcomingCount || 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600">Selesai</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{scheduleData?.completedCount || 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600">Dibatalkan</p>
          <p className="text-3xl font-bold text-red-600 mt-2">{scheduleData?.cancelledCount || 0}</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-1">
            <ScheduleCalendar
              sessions={scheduleData?.sessions || []}
              onDateSelect={handleCalendarDateSelect}
              selectedDate={selectedCalendarDate}
            />
          </div>

          {/* Selected Date Sessions */}
          <div className="lg:col-span-2">
            {selectedCalendarDate ? (
              <div>
                <h2 className="text-lg font-semibold text-[#2B5379] mb-4">
                  Sesi pada {selectedCalendarDate}
                </h2>
                <ScheduleList
                  sessions={scheduleData?.sessions.filter(s => s.date === selectedCalendarDate) || []}
                  onViewDetails={handleViewDetails}
                />
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <p className="text-gray-600 font-medium">Pilih tanggal</p>
                <p className="text-sm text-gray-500 mt-1">Klik tanggal di kalender untuk melihat sesi</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <ScheduleList
          sessions={scheduleData?.sessions || []}
          onViewDetails={handleViewDetails}
        />
      )}

      {/* Session Detail Modal */}
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
