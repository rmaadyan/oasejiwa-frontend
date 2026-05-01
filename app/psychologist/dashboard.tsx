"use client";

import { useState, useEffect } from "react";
import WelcomeCard from "@/components/features/psychologist/dashboard/welcomecard";
import TodayStats from "@/components/features/psychologist/dashboard/todaystats";
import TodaySchedule from "@/components/features/psychologist/dashboard/todayschedule";
import UpcomingAppointments from "@/components/features/psychologist/dashboard/upcomingappointments";
import {
  getPsychologistDashboard,
  getPsychologistProfile,
  markSessionCompleted,
} from "@/lib/api/psychologist";
import type {
  Psychologist,
  PsychologistDashboardStats,
  Session,
} from "@/lib/types/psychologist";

export default function PsychologistDashboard() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Psychologist | null>(null);
  const [stats, setStats] = useState<PsychologistDashboardStats | null>(null);
  const [todaySchedule, setTodaySchedule] = useState<Session[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([]);

  const fetchDashboardData = async () => {
    setLoading(true);

    try {
      const [profileData, dashboardData] = await Promise.all([
        getPsychologistProfile(),
        getPsychologistDashboard(),
      ]);

      setProfile(profileData);
      setStats(dashboardData.stats);
      setTodaySchedule(dashboardData.todaySchedule);
      setUpcomingSessions(dashboardData.upcomingSessions);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleMarkCompleted = async (sessionId: number | string) => {
    try {
      await markSessionCompleted(sessionId);
      await fetchDashboardData();
    } catch (error) {
      console.error("Failed to mark session as completed:", error);
      alert("Gagal menandai sesi selesai");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#2B5379] border-t-transparent" />
          <p className="text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  if (!profile || !stats) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Gagal memuat data dashboard</p>
          <button
            onClick={fetchDashboardData}
            className="mt-4 rounded-lg bg-[#2B5379] px-4 py-2 text-white hover:bg-[#2B5379]/90"
            type="button"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#2B5379]">Dashboard</h1>
        <p className="mt-1 text-gray-600">
          Overview aktivitas dan jadwal Anda
        </p>
      </div>

      <WelcomeCard
        psychologist={profile}
        nextSessionTime={stats.nextSessionTime}
      />

      <TodayStats stats={stats} />

      <TodaySchedule
        sessions={todaySchedule}
        onMarkCompleted={handleMarkCompleted}
      />

      <UpcomingAppointments sessions={upcomingSessions} />
    </div>
  );
}