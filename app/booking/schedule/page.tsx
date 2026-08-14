"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BookingStepper from "@/components/booking/BookingStepper";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { ScheduleSelectionContent } from "@/components/features/booking";
import { PsychologistProfile } from "@/components/features/booking";
import { deriveUniqueDates, RawSchedule, DateOption } from "@/lib/booking-data";
import { getPsychologistByIdPublic } from "@/lib/api/psychologist";
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "https://api.oasejiwa.id").replace(/\/+$/, "");

export interface Schedule {
  id: string;
  startTime: string;
  duration?: number;
  day?: string;
  date?: string;
  dayName?: string;
  isAvailable?: boolean;
}

async function getPsychologistDetail(id: string): Promise<PsychologistProfile | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/psychologists/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    const p = json.data;
    return {
      id: p.id,
      name: p.name,
      avatar: p.avatarUrl ?? "/assets/psychologists/default.jpg",
      education: p.educations?.map((e: any) => `${e.degree}, ${e.institution}`) ?? [],
      licenseNumber: p.sipp ?? "-",
      specialization: p.specializations?.join(", ") ?? "-",
      bio: p.about ?? "-",
      expertise: p.expertises ?? [],
      caseExperience: p.experiences ?? [],
    };
  } catch {
    return null;
  }
}

function formatDayName(sch: any) {
  const valStr = typeof sch === "string" ? sch : sch?.day || sch?.date || sch?.dayName || "";
  if (!valStr) return "Senin";
  const cleanStr = String(valStr).toUpperCase();
  const dayMapping: Record<string, string> = {
    SENIN: "Senin",
    SELASA: "Selasa",
    RABU: "Rabu",
    KAMIS: "Kamis",
    JUMAT: "Jumat",
    SABTU: "Sabtu",
    MINGGU: "Minggu",
  };

  return dayMapping[cleanStr] || "Senin";
}

function getAvailableDatesForDay(dayName: string, count = 4) {
  const daysMap: Record<string, number> = {
    Minggu: 0, MINGGU: 0,
    Senin: 1, SENIN: 1,
    Selasa: 2, SELASA: 2,
    Rabu: 3, RABU: 3,
    Kamis: 4, KAMIS: 4,
    Jumat: 5, JUMAT: 5,
    Sabtu: 6, SABTU: 6,
  };

  const targetDay = daysMap[dayName] ?? 1;
  const resultDates: { isoDate: string; label: string }[] = [];

  const today = new Date();
  const currentDay = today.getDay();

  let distance = targetDay - currentDay;
  if (distance <= 0) distance += 7;

  const baseDate = new Date(today);
  baseDate.setDate(today.getDate() + distance);

  for (let i = 0; i < count; i++) {
    const nextDate = new Date(baseDate);
    nextDate.setDate(baseDate.getDate() + i * 7);

    const isoDate = nextDate.toISOString().split("T")[0];
    const label = nextDate.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    resultDates.push({ isoDate, label });
  }

  return resultDates;
}

function SchedulePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const serviceId = searchParams.get("service") || "1";
  const psychologistId = searchParams.get("psychologist") || "";
  const queryScheduleId = searchParams.get("scheduleId") || "";

  const [isLoading, setIsLoading] = useState(true);
  const [schedulesMap, setSchedulesMap] = useState<Map<string, Schedule[]>>(new Map());
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>("");

  // 🟢 STATE TANGGAL TERISI/TERBOOKING PASIEN LAIN
  const [bookedDates, setBookedDates] = useState<string[]>([]);

  // 1. FETCH DATA JADWAL PSIKOLOG
  useEffect(() => {
    if (!psychologistId) return;

    const fetchPsychologist = async () => {
      try {
        setIsLoading(true);
        const result = await getPsychologistByIdPublic(psychologistId);
        const data = (result as any)?.data || (result as any)?.psychologist || result;
        const rawSchedules: Schedule[] = data?.schedules || data?.schedule || data?.availableSchedules || [];

        const map = new Map<string, Schedule[]>();
        rawSchedules.forEach((sch) => {
          const dayName = formatDayName(sch);
          if (!map.has(dayName)) map.set(dayName, []);
          map.get(dayName)!.push(sch);
        });

        const days = Array.from(map.keys());
        setSchedulesMap(map);
        setAvailableDays(days);

        if (days.length > 0) {
          const defaultDay = days[0];
          setSelectedDay(defaultDay);

          const defaultSchedules = map.get(defaultDay) || [];
          if (defaultSchedules.length > 0) {
            setSelectedTime(defaultSchedules[0].startTime);
            setSelectedScheduleId(defaultSchedules[0].id);
          }
        }
      } catch (err) {
        console.error("Gagal memuat jadwal psikolog:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPsychologist();
  }, [psychologistId]);

  // 🟢 2. FETCH STATUS BOOKING DENGAN AMAN DARI ERROR (PENCEGAHAN activeBookings.filter is not a function)
 // 🟢 FETCH STATUS TANGGAL TERBOOKING SECARA PUBLIK DAN PRESISI
  useEffect(() => {
    if (!psychologistId || !selectedTime) return;

    const fetchBookedDates = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(
          `${apiUrl}/bookings/public/booked-dates?psychologistId=${psychologistId}&time=${selectedTime}`
        );

        if (!res.ok) {
          console.error("HTTP Error saat fetch booked dates:", res.status);
          return;
        }

        const json = await res.json();

        let datesArray: string[] = [];
        if (Array.isArray(json)) {
          datesArray = json;
        } else if (Array.isArray(json?.data)) {
          datesArray = json.data;
        }

        // Ambil string format YYYY-MM-DD secara bersih
        const cleanDates = datesArray.map((d: string) => String(d).slice(0, 10));

        console.log("🟢 TANGGAL TERBOOKING DARI BACKEND:", cleanDates);
        setBookedDates(cleanDates);
      } catch (err) {
        console.error("Gagal mengecek ketersediaan tanggal:", err);
      }
    };

    fetchBookedDates();
  }, [psychologistId, selectedTime]);

  const handleDayChange = (dayName: string) => {
    setSelectedDay(dayName);
    const daySchedules = schedulesMap.get(dayName) || [];
    if (daySchedules.length > 0) {
      setSelectedTime(daySchedules[0].startTime);
      setSelectedScheduleId(daySchedules[0].id);
    } else {
      setSelectedTime("");
      setSelectedScheduleId("");
    }
  };

  const handleSelectDate = (chosenIsoDate: string) => {
    if (bookedDates.includes(chosenIsoDate)) {
      alert("Jadwal pada tanggal dan jam ini sudah penuh / dibooking oleh pasien lain.");
      return;
    }

    router.push(
      `/booking/form?service=${serviceId}&psychologist=${psychologistId}&scheduleId=${selectedScheduleId || queryScheduleId}&day=${selectedDay}&date=${chosenIsoDate}&time=${selectedTime}`
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f7fb] flex items-center justify-center font-poppins">
        <div className="animate-spin w-8 h-8 border-4 border-[#2B5379] border-t-transparent rounded-full" />
      </div>
    );
  }

  const currentDaySchedules = schedulesMap.get(selectedDay) || [];
  const availableDates = getAvailableDatesForDay(selectedDay);

  return (
    <main className="min-h-screen bg-[#f5f7fb] font-poppins pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div className="mb-8">
          <BookingStepper currentStep={2} />
        </div>

        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#234463] transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-bold text-[#234463] border-b border-gray-100 pb-3">
            Pilih Hari, Jam &amp; Tanggal Konsultasi
          </h2>

          {availableDays.length === 0 ? (
            <p className="text-xs text-slate-500">Belum ada jadwal praktik yang dibuka oleh psikolog ini.</p>
          ) : (
            <>
              {/* 1. HARI PRAKTIK */}
              <div>
                <label className="block text-xs font-bold text-[#234463] mb-2 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#2B5379]" /> Hari Praktik Tersedia:
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableDays.map((dayName) => (
                    <button
                      key={dayName}
                      type="button"
                      onClick={() => handleDayChange(dayName)}
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        selectedDay === dayName
                          ? "bg-[#234463] text-white shadow-xs"
                          : "bg-gray-100 text-slate-600 hover:bg-gray-200"
                      }`}
                    >
                      {dayName.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. JAM / WAKTU */}
              <div>
                <label className="block text-xs font-bold text-[#234463] mb-2 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#2B5379]" /> Jam Sesi Praktik:
                </label>
                <div className="flex flex-wrap gap-2">
                  {currentDaySchedules.map((sch) => (
                    <button
                      key={sch.id}
                      type="button"
                      onClick={() => {
                        setSelectedTime(sch.startTime);
                        setSelectedScheduleId(sch.id);
                      }}
                      className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition cursor-pointer ${
                        selectedTime === sch.startTime
                          ? "bg-[#234463] text-white border-[#234463] font-bold shadow-xs"
                          : "bg-white text-slate-700 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      {sch.startTime} ({sch.duration || 60} mnt)
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. DAFTAR TANGGAL (4 MINGGU MENDATANG) & CHECKING STATUS TERISI */}
              {selectedTime && (
                <div className="pt-4 border-t border-gray-100">
                  <label className="block text-xs font-bold text-[#234463] mb-3 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#2B5379]" />
                    Pilih Tanggal Sesi Hari {selectedDay} ({selectedTime} WIB):
                  </label>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {availableDates.map((item) => {
                      const isBooked = bookedDates.includes(item.isoDate);

                      return (
                        <button
                          key={item.isoDate}
                          type="button"
                          disabled={isBooked}
                          onClick={() => handleSelectDate(item.isoDate)}
                          className={`p-4 rounded-2xl border text-xs font-semibold text-center transition ${
                            isBooked
                              ? "bg-red-50 border-red-200 text-red-400 cursor-not-allowed line-through"
                              : "bg-white text-slate-700 border-gray-200 hover:border-[#234463] hover:bg-blue-50/50 cursor-pointer shadow-2xs"
                          }`}
                        >
                          <div className="text-sm font-bold mb-1">{item.label}</div>
                          <div className={`text-[10px] font-medium ${isBooked ? "text-red-500" : "text-emerald-600"}`}>
                            {isBooked ? "Telah Penuh" : "Tersedia"}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </main>
  );
}

export default function BookingSchedulePage() {
  return (
    <Suspense fallback={null}>
      <SchedulePageContent />
    </Suspense>
  );
}