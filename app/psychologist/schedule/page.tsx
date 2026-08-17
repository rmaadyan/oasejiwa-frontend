"use client";

import { useEffect, useState } from "react";
import ScheduleList from "@/components/features/psychologist/schedule/schedulelist";
import SessionDetailModal from "@/components/features/psychologist/schedule/sessiondetailmodal";
import {
  cancelSession,
  getAllSessions,
  markSessionCompleted,
} from "@/lib/api/psychologist";
import type { Session } from "@/lib/types/psychologist";

export default function SchedulePage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"ALL" | "UPCOMING" | "COMPLETED" | "CANCELLED">("ALL");
  const [scheduleData, setScheduleData] = useState<any>(null);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchSchedule = async () => {
    setLoading(true);
    try {
      const data = await getAllSessions();
      setScheduleData(data);
    } catch (error) {
      console.error("Failed to fetch schedule:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  const sessions: Session[] = Array.isArray(scheduleData?.sessions)
    ? scheduleData.sessions
    : Array.isArray(scheduleData?.data)
    ? scheduleData.data
    : Array.isArray(scheduleData)
    ? scheduleData
    : [];

  const upcomingSessions = sessions.filter((s) => {
    const st = String(s.status || "").toLowerCase();
    return ["upcoming", "approved", "paid", "waiting_approval", "fully_paid"].includes(st);
  });

  const completedSessions = sessions.filter((s) => {
    const st = String(s.status || "").toLowerCase();
    return st === "completed" || st === "selesai";
  });

  const cancelledSessions = sessions.filter((s) => {
    const st = String(s.status || "").toLowerCase();
    return ["cancelled", "rejected", "batal"].includes(st);
  });

  const displayedSessions = sessions.filter((s) => {
    const st = String(s.status || "").toLowerCase();
    if (activeTab === "UPCOMING") return ["upcoming", "approved", "paid", "waiting_approval", "fully_paid"].includes(st);
    if (activeTab === "COMPLETED") return st === "completed" || st === "selesai";
    if (activeTab === "CANCELLED") return ["cancelled", "rejected", "batal"].includes(st);
    return true;
  });

  return (
    <div className="space-y-6 font-poppins text-xs">
      <div>
        <h1 className="text-2xl font-bold text-[#2B5379]">Jadwal Konseling</h1>
        <p className="mt-1 text-slate-500">Kelola jadwal sesi konseling Anda</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-2xl border-2 border-slate-500 bg-white p-5">
          <p className="text-xs font-semibold text-slate-800">Total Sesi</p>
          <p className="mt-2 text-2xl font-bold text-[#2B5379]">{sessions.length}</p>
        </div>
        <div className="rounded-2xl border-2 border-slate-500 bg-white p-5">
          <p className="text-xs font-semibold text-slate-800">Akan Datang</p>
          <p className="mt-2 text-2xl font-bold text-blue-600">{upcomingSessions.length}</p>
        </div>
        <div className="rounded-2xl border-2 border-slate-500 bg-white p-5">
          <p className="text-xs font-semibold text-slate-800">Selesai</p>
          <p className="mt-2 text-2xl font-bold text-emerald-600">{completedSessions.length}</p>
        </div>
        <div className="rounded-2xl border-2 border-slate-500 bg-white p-5">
          <p className="text-xs font-semibold text-slate-800">Dibatalkan</p>
          <p className="mt-2 text-2xl font-bold text-rose-600">{cancelledSessions.length}</p>
        </div>
      </div>

      <div className="flex gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab("ALL")}
          className={`px-4 py-2 rounded-lg font-medium text-xs transition-all ${
            activeTab === "ALL" ? "bg-[#2B5379] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Semua ({sessions.length})
        </button>
        <button
          onClick={() => setActiveTab("UPCOMING")}
          className={`px-4 py-2 rounded-lg font-medium text-xs transition-all ${
            activeTab === "UPCOMING" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Akan Datang ({upcomingSessions.length})
        </button>
        <button
          onClick={() => setActiveTab("COMPLETED")}
          className={`px-4 py-2 rounded-lg font-medium text-xs transition-all ${
            activeTab === "COMPLETED" ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Selesai ({completedSessions.length})
        </button>
        <button
          onClick={() => setActiveTab("CANCELLED")}
          className={`px-4 py-2 rounded-lg font-medium text-xs transition-all ${
            activeTab === "CANCELLED" ? "bg-rose-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Dibatalkan ({cancelledSessions.length})
        </button>
      </div>

      <ScheduleList
        sessions={displayedSessions}
        onViewDetails={(s) => {
          setSelectedSession(s);
          setIsModalOpen(true);
        }}
      />

      <SessionDetailModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSession(null);
        }}
        session={selectedSession}
        onMarkCompleted={async (id) => {
          await markSessionCompleted(id);
          fetchSchedule();
          setIsModalOpen(false);
        }}
        onCancel={async (id, reason) => {
          await cancelSession(id, { reason });
          fetchSchedule();
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}