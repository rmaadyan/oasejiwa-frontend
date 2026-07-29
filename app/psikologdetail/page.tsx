"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { BadgeCheck, GraduationCap, Stethoscope, User, Calendar, Clock, ArrowLeft, Briefcase } from "lucide-react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { getPsychologistByIdPublic } from "@/lib/api/psychologists";

type Schedule = {
  id: string;
  date?: string;
  day?: string;
  hari?: string;
  dayOfWeek?: string;
  startTime: string;
  duration: number;
  isAvailable: boolean;
};

type EducationItem = {
  id?: string;
  degree?: string;
  institution?: string;
  city?: string;
  startYear?: number | string;
  endYear?: number | string;
};

type PsikologDetail = {
  id: string;
  name: string;
  avatarUrl: string | null;
  about: string;
  sipp: string;
  str: string;
  educations?: EducationItem[] | any[];
  education?: EducationItem[] | any[];
  experiences?: string[] | any[];
  specializations?: string[];
  expertises?: string[];
  schedules: Schedule[];
};

// 🟢 Helper Normalisasi Nama Hari
function formatDayName(item: any): string {
  if (!item) return "Senin";

  // Ambil nilai hari/tanggal dari object schedule
  const val = typeof item === "object" 
    ? (item.day || item.hari || item.dayOfWeek || item.date) 
    : item;

  if (!val) return "Senin";

  const valStr = String(val).trim();

  // Jika formatnya berupa Tanggal ISO (contoh: "2026-07-27T00:00:00.000Z" atau "2026-07-27")
  if (valStr.includes("-") || valStr.includes("T")) {
    const d = new Date(valStr);
    if (!isNaN(d.getTime())) {
      const daysID = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
      return daysID[d.getDay()];
    }
  }

  // Jika formatnya berupa Nama Hari (English/Indonesian)
  const cleanStr = valStr.toUpperCase();
  const dayMapping: Record<string, string> = {
    SENIN: "Senin",
    SELASA: "Selasa",
    RABU: "Rabu",
    KAMIS: "Kamis",
    JUMAT: "Jumat",
    SABTU: "Sabtu",
    MINGGU: "Minggu",
    MONDAY: "Senin",
    TUESDAY: "Selasa",
    WEDNESDAY: "Rabu",
    THURSDAY: "Kamis",
    FRIDAY: "Jumat",
    SATURDAY: "Sabtu",
    SUNDAY: "Minggu",
  };

  return dayMapping[cleanStr] || "Senin";
}

// 🟢 Helper Format Rentang Jam
function formatTimeRange(startTime: string, durationMinutes: number) {
  if (!startTime) return "09:00 WIB";
  const [hours, minutes] = startTime.split(":").map(Number);
  const totalMinutes = hours * 60 + minutes + (Number(durationMinutes) || 60);

  const endHours = Math.floor(totalMinutes / 60) % 24;
  const endMins = totalMinutes % 60;

  const endTimeStr = `${String(endHours).padStart(2, "0")}:${String(endMins).padStart(2, "0")}`;
  return `${startTime} - ${endTimeStr} WIB`;
}

// 🟢 Pengelompokkan Jadwal Berdasarkan Hari
function groupSchedulesByDate(schedules: Schedule[]) {
  const map = new Map<string, Schedule[]>();

  if (!Array.isArray(schedules) || schedules.length === 0) {
    return [];
  }

  schedules.forEach((s) => {
    // Ambil nama hari
    const dayKey = formatDayName(s);

    if (!map.has(dayKey)) {
      map.set(dayKey, []);
    }
    map.get(dayKey)!.push(s);
  });

  return Array.from(map.entries()).map(([day, items]) => ({ day, items }));
}

function PsikologDetailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const [psikolog, setPsikolog] = useState<PsikologDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeDay, setActiveDay] = useState(0);

  useEffect(() => {
  if (!id) return;

  const fetchData = async () => {
    try {
      const result = await getPsychologistByIdPublic(id);
      
      // Ambil data utuh
      const data = result?.data || result?.psychologist || result;
      
      // Ambil array schedules dari semua kemungkinan nama properti
      const rawSchedules = 
        data?.schedules || 
        data?.schedule || 
        data?.availableSchedules || 
        [];

      setPsikolog({
        ...data,
        schedules: rawSchedules,
      });
    } catch (err: any) {
      console.error("Error loading psychologist:", err);
      setError(err.message || "Gagal memuat data psikolog");
    } finally {
      setIsLoading(false);
    }
  };

  fetchData();
}, [id, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-poppins">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-slate-500 font-medium animate-pulse">Memuat profil psikolog...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !psikolog) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-poppins">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <p className="text-red-500 font-medium">{error || "Psikolog tidak ditemukan"}</p>
          <button
            onClick={() => router.push("/psikolog")}
            className="flex items-center gap-2 px-4 py-2 bg-[#234463] text-white text-xs font-semibold rounded-xl cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Daftar Psikolog
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const groupedSchedules = groupSchedulesByDate(psikolog.schedules);

  const educationList = Array.isArray(psikolog.educations) && psikolog.educations.length > 0
    ? psikolog.educations
    : Array.isArray(psikolog.education)
    ? psikolog.education
    : [];

  const rawExperiences = psikolog.experiences || (psikolog as any)?.experienceList || [];
  const experienceList = Array.isArray(rawExperiences)
    ? rawExperiences.map((item: any) => (typeof item === "object" ? item.name || item : item))
    : [];

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col justify-between font-poppins text-xs">
      <Navbar />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#234463] transition mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 bg-white border border-slate-200/80 rounded-3xl shadow-xs overflow-hidden">
          
          <div className="lg:col-span-6 p-6 sm:p-8 space-y-6 border-b lg:border-b-0 lg:border-r border-slate-100">
            <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start text-center sm:text-left">
              {psikolog.avatarUrl ? (
                <img
                  src={psikolog.avatarUrl}
                  alt={psikolog.name}
                  className="w-24 h-24 rounded-2xl object-cover shrink-0 shadow-md border border-slate-100"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-blue-50 text-[#234463] flex items-center justify-center shrink-0 border border-blue-100">
                  <User className="w-10 h-10" />
                </div>
              )}

              <div className="space-y-1.5">
                <h1 className="text-xl sm:text-2xl font-bold text-[#234463]">
                  {psikolog.name}
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Psikolog Klinik Oase Jiwa
                </p>
                {psikolog.about && (
                  <p className="text-xs text-slate-600 leading-relaxed pt-1">
                    {psikolog.about}
                  </p>
                )}
              </div>
            </div>

            {psikolog.specializations && psikolog.specializations.length > 0 && (
              <div className="flex gap-3 items-center py-1">
                <Stethoscope className="w-4 h-4 text-[#234463] shrink-0" />
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-semibold text-[#234463]">Spesialisasi:</span>
                  <span className="text-slate-600">{psikolog.specializations.join(", ")}</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100">
              <div className="flex gap-2.5 items-center">
                <BadgeCheck className="w-4 h-4 text-[#234463] shrink-0" />
                <div>
                  <p className="text-[11px] font-bold text-[#234463]">No. SIPP / SILP</p>
                  <p className="text-xs text-slate-600 mt-0.5">{psikolog.sipp || "-"}</p>
                </div>
              </div>

              <div className="flex gap-2.5 items-center">
                <BadgeCheck className="w-4 h-4 text-[#234463] shrink-0" />
                <div>
                  <p className="text-[11px] font-bold text-[#234463]">No. STR</p>
                  <p className="text-xs text-slate-600 mt-0.5">{psikolog.str || "-"}</p>
                </div>
              </div>
            </div>

            {educationList.length > 0 && (
              <div className="pt-3 border-t border-slate-100">
                <div className="flex gap-2 items-center mb-2.5">
                  <GraduationCap className="w-4 h-4 text-[#234463]" />
                  <p className="text-xs font-bold text-[#234463]">Riwayat Pendidikan</p>
                </div>
                <ul className="space-y-2 text-xs text-slate-600 pl-6">
                  {educationList.map((edu: any, idx: number) => (
                    <li key={idx} className="list-disc leading-relaxed">
                      {typeof edu === "string" 
                        ? edu 
                        : `${edu.degree || ""} — ${edu.institution || ""}${edu.city ? `, ${edu.city}` : ""} (${edu.endYear || ""})`
                      }
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="lg:col-span-6 p-6 sm:p-8 space-y-6 bg-slate-50/40 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#234463] mb-1 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#234463]" />
                Jadwal Konseling Tersedia
              </h3>
              <p className="text-[11px] text-slate-500 mb-4">Pilih hari dan jam ketersediaan untuk melakukan sesi</p>

              {groupedSchedules.length === 0 ? (
                <div className="p-6 bg-white rounded-2xl border border-dashed border-slate-200 text-center">
                  <p className="text-xs text-slate-400">Belum ada jadwal praktik yang dibuka oleh psikolog ini.</p>
                </div>
              ) : (
                <>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {groupedSchedules.map((group, index) => (
                      <button
                        key={group.day || index}
                        onClick={() => setActiveDay(index)}
                        className={`border rounded-xl text-center px-4 py-2 transition cursor-pointer font-bold text-xs shrink-0 ${
                          activeDay === index
                            ? "bg-[#234463] text-white border-[#234463] shadow-xs"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {group.day}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2.5 mt-4">
                    {groupedSchedules[activeDay]?.items.map((sch, idx) => (
                      <div
                        key={sch.id || idx}
                        className="bg-white border border-[#234463] rounded-xl px-3.5 py-2 text-xs text-[#234463] font-semibold hover:bg-blue-50 transition cursor-pointer shadow-2xs flex items-center gap-1.5"
                      >
                        <Clock className="w-3.5 h-3.5 text-[#234463]" />
                        {formatTimeRange(sch.startTime, sch.duration)}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-200/60">
              {psikolog.expertises && psikolog.expertises.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-[#234463] mb-2">Topik & Keahlian</h3>
                  <div className="flex flex-wrap gap-2">
                    {psikolog.expertises.map((item, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200/80 rounded-lg px-2.5 py-1 text-xs font-medium shadow-2xs"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {experienceList.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-[#234463] mb-2 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-[#234463]" />
                    Pengalaman Kerja
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {experienceList.map((exp: string, idx: number) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 bg-slate-100 text-[#234463] border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-medium shadow-2xs"
                      >
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

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