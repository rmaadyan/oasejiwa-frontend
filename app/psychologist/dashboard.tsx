"use client";

import { useState, useEffect } from "react";
import WelcomeCard from "@/app/components/features/psychologist/dashboard/welcomecard";
import TodayStats from "@/app/components/features/psychologist/dashboard/todaystats";
import TodaySchedule from "@/app/components/features/psychologist/dashboard/todayschedule";
import UpcomingAppointments from "@/app/components/features/psychologist/dashboard/upcomingappointments";
import { getPsychologistDashboard, getPsychologistProfile, markSessionCompleted } from "@/lib/api/psychologist";
import type { Psychologist, PsychologistDashboardStats, Session } from "@/lib/types/psychologist";

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
        getPsychologistDashboard()
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

  const handleMarkCompleted = async (sessionId: number) => {
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#2B5379] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  if (!profile || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-red-600">Gagal memuat data dashboard</p>
          <button
            onClick={fetchDashboardData}
            className="mt-4 px-4 py-2 bg-[#2B5379] text-white rounded-lg hover:bg-[#2B5379]/90"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#2B5379]">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview aktivitas dan jadwal Anda</p>
      </div>

      {/* Welcome Card */}
      <WelcomeCard 
        psychologist={profile} 
        nextSessionTime={stats.nextSessionTime} 
      />

      {/* Stats Cards */}
      <TodayStats stats={stats} />

      {/* Today's Schedule */}
      <TodaySchedule 
        sessions={todaySchedule}
        onMarkCompleted={handleMarkCompleted}
      />

      {/* Upcoming Appointments */}
      <UpcomingAppointments sessions={upcomingSessions} />
    </div>
  );
}
