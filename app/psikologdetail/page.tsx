"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { BadgeCheck, GraduationCap, User, Calendar, Clock, ArrowLeft, Award, Briefcase } from "lucide-react";
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-poppins">
        <p className="text-slate-500 text-xs font-semibold animate-pulse">Memuat profil psikolog...</p>
      </div>
    );
  }

  if (error || !psikolog) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3 font-poppins">
        <p className="text-red-500 text-xs font-semibold">{error || "Psikolog tidak ditemukan"}</p>
        <button
          onClick={() => router.push("/psikologlist")}
          className="px-4 py-2 bg-[#234463] text-white text-xs font-semibold rounded-xl"
        >
          Kembali ke Daftar
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F8FA] flex flex-col justify-between font-poppins text-xs">
      <Navbar />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#234463] transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>

        {/* HEADER PROFIL */}
        <div className="bg-[#DDEEFC] border-2 border-[#B3D7F8] rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {psikolog.avatarUrl ? (
            <img
              src={psikolog.avatarUrl}
              alt={psikolog.name}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover border-4 border-white shadow-md"
            />
          ) : (
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-white border-4 border-white flex items-center justify-center text-slate-400 shadow-md">
              <User size={40} />
            </div>
          )}

          <div className="space-y-2 text-center sm:text-left flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-[#1E3A5F]">{psikolog.name || psikolog.fullName}</h1>
            <p className="text-xs text-[#234463]/80 font-medium">{psikolog.about || "Psikolog Klinik Oase Jiwa"}</p>
            <div className="flex flex-wrap gap-2 pt-2 justify-center sm:justify-start">
              <span className="px-3 py-1 bg-white/80 border border-[#B3D7F8] rounded-xl font-mono text-[11px] text-[#1E3A5F]">
                SIPP: {psikolog.sipp || "-"}
              </span>
              <span className="px-3 py-1 bg-white/80 border border-[#B3D7F8] rounded-xl font-mono text-[11px] text-[#1E3A5F]">
                STR: {psikolog.str || "-"}
              </span>
            </div>
          </div>
        </div>

        {/* KUALIFIKASI & JADWAL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 space-y-4">
            {/* SPESIALISASI */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <h2 className="font-bold text-[#1E3A5F] flex items-center gap-2">
                <Award size={16} className="text-[#234463]" /> Bidang Spesialisasi
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {(psikolog.specializations || []).map((sp: string, idx: number) => (
                  <span key={idx} className="px-2.5 py-1 bg-blue-50 text-[#234463] rounded-lg border border-blue-100 font-medium">
                    {sp}
                  </span>
                ))}
              </div>
            </div>

            {/* PENDIDIKAN */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
              <h2 className="font-bold text-[#1E3A5F] flex items-center gap-2">
                <GraduationCap size={16} className="text-[#234463]" /> Pendidikan Terakhir
              </h2>
              <p className="text-slate-700 leading-relaxed">{psikolog.latestEducation || "Profesi Psikolog"}</p>
            </div>

            {/* PENGALAMAN */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <h2 className="font-bold text-[#1E3A5F] flex items-center gap-2">
                <Briefcase size={16} className="text-[#234463]" /> Pengalaman Praktik
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {(psikolog.experiences || []).map((exp: string, idx: number) => (
                  <span key={idx} className="px-2.5 py-1 bg-slate-50 text-slate-700 rounded-lg border border-slate-200 font-medium">
                    {exp}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* JADWAL */}
          <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="font-bold text-[#1E3A5F] flex items-center gap-2">
              <Calendar size={16} className="text-[#234463]" /> Jadwal Praktik Tersedia
            </h2>
            {psikolog.schedules && psikolog.schedules.length > 0 ? (
              <div className="space-y-2">
                {psikolog.schedules.map((sch: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 bg-blue-50/60 rounded-xl border border-blue-100">
                    <span className="font-bold text-[#1E3A5F]">{sch.day || sch.hari || "Senin"}</span>
                    <span className="flex items-center gap-1 font-semibold text-[#234463]">
                      <Clock size={13} /> {sch.startTime || sch.time} ({sch.duration || 60} mnt)
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 italic">Belum ada jadwal yang dibuka.</p>
            )}

            <button
              onClick={() => router.push(`/booking?psychologistId=${psikolog.id}`)}
              className="w-full py-3 bg-[#234463] hover:bg-[#1E3A5F] text-white font-bold rounded-xl shadow-md transition cursor-pointer"
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