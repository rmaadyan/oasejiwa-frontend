"use client";

import { useEffect, useState } from "react";
import { getPsychologistDashboard } from "@/lib/api/psychologist";

// 🟢 Helper Fungsi Sapaan Dinamis Berdasarkan Waktu
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
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="p-8 text-slate-500 font-poppins">Memuat dashboard...</div>;
  }

  const greetingText = getGreeting();

  const todayDateFormatted = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const todaySessions = data?.todaySessions || [];
  const upcomingSessions = data?.upcomingSessions || [];

  return (
    <div className="p-6 space-y-6 font-poppins text-xs max-w-6xl">
      {/* Header Title */}
      <div>
        <h1 className="text-lg font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500">Overview aktivitas dan jadwal Anda</p>
      </div>

      {/* 🟢 BANNER SAPAAN BIRU MUDA */}
      <div className="bg-[#D9EBFC] p-6 rounded-2xl border-2 border-slate-500 space-y-1">
        <h2 className="text-sm font-bold text-[#1F415F]">
          {greetingText}, {data?.psychologistName || "Okta"}
        </h2>
        <p className="text-slate-600">Semangat untuk membantu pasien hari ini</p>
        <p className="text-slate-400 text-[11px] pt-1">{todayDateFormatted}</p>
      </div>

      {/* 🟢 3 CARD STATISTIK (DENGAN BORDER-2 BORDER-SLATE-500 RATA KIRI) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Sesi Hari Ini */}
        <div className="bg-white p-5 rounded-2xl border-2 border-slate-500 shadow-xs space-y-2">
          <p className="text-slate-500 font-medium">Sesi hari ini</p>
          <p className="text-2xl font-bold text-slate-800">{data?.todaySessionsCount || 0}</p>
          <p className="text-slate-400 text-[11px]">{data?.todaySessionsCount || 0} Sesi</p>
        </div>

        {/* Card 2: Sesi Minggu Ini */}
        <div className="bg-white p-5 rounded-2xl border-2 border-slate-500 shadow-xs space-y-2">
          <p className="text-slate-500 font-medium">Sesi Minggu ini</p>
          <p className="text-2xl font-bold text-slate-800">{data?.weeklySessionsCount || 0}</p>
          <p className="text-slate-400 text-[11px]">Total minggu ini</p>
        </div>

        {/* Card 3: Total Pasien */}
        <div className="bg-white p-5 rounded-2xl border-2 border-slate-500 shadow-xs space-y-2">
          <p className="text-slate-500 font-medium">Total Pasien</p>
          <p className="text-2xl font-bold text-slate-800">{data?.totalPatients || 0}</p>
          <p className="text-slate-400 text-[11px]">Di bulan ini</p>
        </div>
      </div>

      {/* 🟢 CARD JADWAL HARI INI */}
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
                  <p className="font-semibold text-[#234463]">{session.time} WIB</p>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-medium uppercase">
                    {session.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🟢 CARD JADWAL MENDATANG */}
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
                  <p className="font-semibold text-[#234463]">{session.time} WIB</p>
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