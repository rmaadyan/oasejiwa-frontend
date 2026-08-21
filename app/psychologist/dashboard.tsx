"use client";

import { useEffect, useState } from "react";
import { getPsychologistDashboard } from "@/lib/api/psychologist";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 3 && hour < 11) return "Selamat Pagi";
  if (hour >= 11 && hour < 15) return "Selamat Siang";
  if (hour >= 15 && hour < 18) return "Selamat Sore";
  return "Selamat Malam";
}

export default function PsychologistDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await getPsychologistDashboard();
        setData(res?.data || res);
      } catch (err) {
        console.error("Gagal memuat dashboard:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="p-8 text-slate-500 font-poppins text-xs">Memuat dashboard...</div>;
  }

  const greetingText = getGreeting();

  const todayDateFormatted = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // 🟢 1. BACA DATA STATISTIK DENGAN FLEKSIBEL (MENDUKUNG FORMAT BARU & LAMA)
  const stats = data?.stats || {};
  const todaySessionsCount =
    data?.todaySessionsCount ?? stats?.todaySessions ?? stats?.sesiHariIni ?? 0;
  const weeklySessionsCount =
    data?.weeklySessionsCount ?? stats?.weekSessions ?? stats?.sesiMingguIni ?? 0;
  const totalPatients =
    data?.totalPatients ?? stats?.totalPatients ?? stats?.totalPasien ?? 0;

  // 🟢 2. BACA LIST SESI HARI INI & MENDATANG
  const rawTodaySessions =
    data?.todaySessions || data?.todaySchedule || data?.jadwalHariIni || [];
  const rawUpcomingSessions =
    data?.upcomingSessions || data?.jadwalMendatang || [];

  const todaySessions = rawTodaySessions.map((session: any) => ({
    id: session.id || session.bookingId,
    patientName:
      session.patientName ||
      session.consultationForm?.fullName ||
      session.user?.userProfile?.fullName ||
      session.user?.email ||
      "Pasien",
    serviceName:
      session.serviceName ||
      session.service?.nama ||
      session.service ||
      "Konseling Klinis",
    time: session.time || session.scheduledTime || "09:00 WIB",
    status: (session.bookingStatus || session.status || "APPROVED").toUpperCase(),
  }));

  const upcomingSessions = rawUpcomingSessions.map((session: any) => ({
    id: session.id || session.bookingId,
    patientName:
      session.patientName ||
      session.consultationForm?.fullName ||
      session.user?.userProfile?.fullName ||
      session.user?.email ||
      "Pasien",
    serviceName:
      session.serviceName ||
      session.service?.nama ||
      session.service ||
      "Konseling Klinis",
    date: session.date || (session.scheduledDate
      ? new Date(session.scheduledDate).toLocaleDateString("id-ID", { day: "numeric", month: "short" })
      : "-"),
    time: session.time || session.scheduledTime || "09:00 WIB",
    status: (session.bookingStatus || session.status || "APPROVED").toUpperCase(),
  }));

  return (
    <div className="p-6 space-y-6 font-poppins text-xs max-w-6xl">
      <div>
        <h1 className="text-lg font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500">Overview aktivitas dan jadwal Anda</p>
      </div>

      {/* BANNER SAPAAN */}
      <div className="bg-[#D9EBFC] p-6 rounded-2xl border-2 border-slate-500 space-y-1">
        <h2 className="text-sm font-bold text-[#1F415F]">
          {greetingText}, {data?.psychologistName || "Psikolog"}
        </h2>
        <p className="text-slate-600">Semangat untuk membantu pasien hari ini</p>
        <p className="text-slate-400 text-[11px] pt-1">{todayDateFormatted}</p>
      </div>

      {/* 3 CARD STATISTIK */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border-2 border-slate-500 shadow-xs space-y-2">
          <p className="text-slate-500 font-medium">Sesi hari ini</p>
          <p className="text-2xl font-bold text-slate-800">{todaySessionsCount}</p>
          <p className="text-slate-400 text-[11px]">{todaySessionsCount} Sesi</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border-2 border-slate-500 shadow-xs space-y-2">
          <p className="text-slate-500 font-medium">Sesi Minggu ini</p>
          <p className="text-2xl font-bold text-slate-800">{weeklySessionsCount}</p>
          <p className="text-slate-400 text-[11px]">Total minggu ini</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border-2 border-slate-500 shadow-xs space-y-2">
          <p className="text-slate-500 font-medium">Total Pasien (Selesai)</p>
          <p className="text-2xl font-bold text-slate-800">{totalPatients}</p>
          <p className="text-slate-400 text-[11px]">Pasien yang telah selesai konseling</p>
        </div>
      </div>

      {/* JADWAL HARI INI */}
      <div className="bg-white p-5 rounded-2xl border-2 border-slate-500 shadow-xs space-y-2">
        <h3 className="font-bold text-slate-800 text-sm">Jadwal Sesi Hari Ini</h3>
        {todaySessions.length === 0 ? (
          <div className="text-center py-6 space-y-1">
            <p className="text-slate-700 font-semibold">Tidak ada jadwal hari ini</p>
            <p className="text-slate-400 text-[11px]">Selamat beristirahat!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {todaySessions.map((session: any) => (
              <div key={session.id} className="flex justify-between items-center p-3 bg-slate-50/50 rounded-xl border border-slate-300">
                <div>
                  <p className="font-bold text-slate-800">{session.patientName}</p>
                  <p className="text-slate-500 text-[11px]">{session.serviceName}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[#234463]">{session.time}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase ${
                    session.status === 'CANCELLED' || session.status === 'REJECTED'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {session.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* JADWAL MENDATANG */}
      <div className="bg-white p-6 rounded-2xl border-2 border-slate-500 shadow-xs space-y-3">
        <h3 className="font-bold text-slate-800 text-sm">Jadwal Sesi Mendatang</h3>
        {upcomingSessions.length === 0 ? (
          <div className="text-center py-6 space-y-1">
            <p className="text-slate-700 font-semibold">Tidak ada jadwal mendatang</p>
            <p className="text-slate-400 text-[11px]">7 hari ke depan kosong</p>
          </div>
        ) : (
          <div className="space-y-2">
            {upcomingSessions.map((session: any) => (
              <div key={session.id} className="flex justify-between items-center p-3 bg-slate-50/50 rounded-xl border border-slate-300">
                <div>
                  <p className="font-bold text-slate-800">{session.patientName}</p>
                  <p className="text-slate-500 text-[11px]">{session.serviceName} • {session.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[#234463]">{session.time}</p>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium uppercase">
                    {session.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}