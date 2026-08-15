"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  BadgeCheck,
  GraduationCap,
  User,
  Calendar,
  Clock,
  ArrowLeft,
  Award,
  Briefcase,
  FileText,
} from "lucide-react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { getPsychologistByIdPublic } from "@/lib/api/psychologist";

function PsikologDetailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const [psikolog, setPsikolog] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const result = await getPsychologistByIdPublic(id);
        setPsikolog(result?.data || result);
      } catch (err: any) {
        setError(err.message || "Gagal memuat data psikolog");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center font-poppins">
        <p className="text-[#234463] text-xs font-semibold animate-pulse">
          Memuat profil psikolog...
        </p>
      </div>
    );
  }

  if (error || !psikolog) {
    return (
      <div className="min-h-screen bg-[#F0F4F8] flex flex-col items-center justify-center gap-3 font-poppins">
        <p className="text-red-500 text-xs font-semibold">
          {error || "Psikolog tidak ditemukan"}
        </p>
        <button
          onClick={() => router.push("/psikologlist")}
          className="px-4 py-2 bg-[#234463] text-white text-xs font-semibold rounded-xl cursor-pointer"
        >
          Kembali ke Daftar
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex flex-col justify-between font-poppins text-xs">
      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-12 space-y-4">
        {/* Tombol Kembali */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#234463] transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>

        {/* 🟢 BANNER HEADER PROFIL */}
        <div className="bg-[#DDEEFC] border border-[#B3D7F8] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="shrink-0">
            {psikolog.avatarUrl ? (
              <img
                src={psikolog.avatarUrl}
                alt={psikolog.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-white shadow-sm"
              />
            ) : (
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white border-2 border-white flex items-center justify-center text-slate-400 shadow-sm">
                <User size={36} />
              </div>
            )}
          </div>

          <div className="space-y-1.5 text-center sm:text-left flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-[#1E3A5F]">
              {psikolog.name || psikolog.fullName}
            </h1>
            <p className="text-xs text-[#234463]/80 font-medium leading-relaxed">
              {psikolog.about || "Psikolog Klinik Oase Jiwa"}
            </p>

            <div className="flex flex-wrap gap-2 pt-2 justify-center sm:justify-start">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/90 border border-[#B3D7F8] rounded-lg font-mono text-[11px] text-[#1E3A5F] font-semibold">
                <BadgeCheck size={13} className="text-[#234463]" />
                SIPP: {psikolog.sipp || "-"}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/90 border border-[#B3D7F8] rounded-lg font-mono text-[11px] text-[#1E3A5F] font-semibold">
                <FileText size={13} className="text-[#234463]" />
                STR: {psikolog.str || "-"}
              </span>
            </div>
          </div>
        </div>

        {/* 🟢 GRID KONTEN DUA KOLOM */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
          
          {/* Kolom Kiri: Detail Informasi Terpadu (Satu Card Ringkas) */}
          <div className="md:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            
            {/* 1. Bidang Spesialisasi */}
            <div className="space-y-1.5">
              <h2 className="font-bold text-[#1E3A5F] flex items-center gap-1.5 text-xs">
                <Award size={15} className="text-[#234463]" /> Bidang Spesialisasi
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {(psikolog.specializations || []).length > 0 ? (
                  psikolog.specializations.map((sp: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-blue-50 text-[#234463] rounded-lg border border-blue-100 font-medium text-[11px]"
                    >
                      {sp}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400 italic text-[11px]">-</span>
                )}
              </div>
            </div>

            <div className="border-t border-slate-100" />

            {/* 2. Pendidikan Terakhir */}
            <div className="space-y-1">
              <h2 className="font-bold text-[#1E3A5F] flex items-center gap-1.5 text-xs">
                <GraduationCap size={15} className="text-[#234463]" /> Pendidikan Terakhir
              </h2>
              <p className="text-slate-700 text-[11px] leading-relaxed">
                {psikolog.latestEducation || "Profesi Psikolog"}
              </p>
            </div>

            <div className="border-t border-slate-100" />

            {/* 3. Pengalaman Praktik */}
            <div className="space-y-1.5">
              <h2 className="font-bold text-[#1E3A5F] flex items-center gap-1.5 text-xs">
                <Briefcase size={15} className="text-[#234463]" /> Pengalaman Praktik
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {(psikolog.experiences || []).length > 0 ? (
                  psikolog.experiences.map((exp: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-slate-50 text-slate-700 rounded-lg border border-slate-200 font-medium text-[11px]"
                    >
                      {exp}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400 italic text-[11px]">-</span>
                )}
              </div>
            </div>

          </div>

          {/* Kolom Kanan: Jadwal Praktik & Booking */}
          <div className="md:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3.5">
            <h2 className="font-bold text-[#1E3A5F] flex items-center gap-1.5 text-xs">
              <Calendar size={15} className="text-[#234463]" /> Jadwal Praktik Tersedia
            </h2>

            {psikolog.schedules && psikolog.schedules.length > 0 ? (
              <div className="space-y-2">
                {psikolog.schedules.map((sch: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-3 py-2 bg-blue-50/70 rounded-xl border border-blue-100/80 text-[11px]"
                  >
                    <span className="font-bold text-[#1E3A5F]">
                      {sch.day || sch.hari || "Senin"}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-[#234463]">
                      <Clock size={12} /> {sch.startTime || sch.time} ({sch.duration || 60} mnt)
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-slate-400 italic text-[11px] bg-slate-50 rounded-xl border border-dashed border-slate-200">
                Belum ada jadwal yang dibuka.
              </div>
            )}

            <button
              onClick={() => router.push(`/booking?psychologistId=${psikolog.id}`)}
              className="w-full py-2.5 bg-[#234463] hover:bg-[#1E3A5F] active:scale-98 text-white font-bold rounded-xl shadow-xs transition cursor-pointer text-xs"
            >
              Booking Konseling Sekarang
            </button>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function PsikologDetail() {
  return (
    <Suspense fallback={null}>
      <PsikologDetailContent />
    </Suspense>
  );
}