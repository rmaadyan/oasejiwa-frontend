import { ScheduleSelectionContent } from "@/components/features/booking";
import { PsychologistProfile } from "@/components/features/booking";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const DAYS_ORDER = ["SENIN", "SELASA", "RABU", "KAMIS", "JUMAT", "SABTU", "MINGGU"];
const DAYS_MAP: Record<number, string> = {
  0: "MINGGU",
  1: "SENIN",
  2: "SELASA",
  3: "RABU",
  4: "KAMIS",
  5: "JUMAT",
  6: "SABTU",
};

// 🟢 MURNI MENGAMBIL HARI UNIK DARI DATA JADWAL PSIKOLOG
function deriveAvailableDaysFromProfile(rawSchedules: any[]) {
  if (!Array.isArray(rawSchedules) || rawSchedules.length === 0) return [];

  const activeDaysSet = new Set<string>();

  rawSchedules.forEach((s) => {
    let dayName = "";

    // 1. Cek string hari langsung
    if (s.day || s.hari || s.dayOfWeek) {
      dayName = String(s.day || s.hari || s.dayOfWeek).toUpperCase().trim();
    }
    
    // 2. Cek dari tanggal jika s.day kosong
    if (!dayName && s.date) {
      const d = new Date(s.date);
      if (!isNaN(d.getTime())) {
        dayName = DAYS_MAP[d.getDay()];
      }
    }

    if (dayName && s.isAvailable !== false) {
      activeDaysSet.add(dayName);
    }
  });

  return DAYS_ORDER
    .filter((day) => activeDaysSet.has(day))
    .map((day) => ({
      value: day,      // "SENIN", "JUMAT"
      dayName: day,    // "SENIN", "JUMAT"
      dayNum: "",
      month: "",
    }));
}

function formatProfileData(p: any): PsychologistProfile {
  return {
    id: p.id,
    name: p.name || p.fullName || "Psikolog",
    avatar: p.avatarUrl || p.photo || "/assets/psychologists/default.jpg",
    education:
      p.educations?.map(
        (e: { degree?: string; institution?: string }) =>
          `${e.degree || ""}, ${e.institution || ""}`.trim()
      ) ?? [],
    licenseNumber: p.sipp ?? "-",
    specialization: Array.isArray(p.specializations) ? p.specializations.join(", ") : p.specializations || "-",
    bio: p.about ?? "Psikolog Klinik Oase Jiwa",
    expertise: p.expertises ?? [],
    caseExperience: p.experiences ?? [],
  };
}

export default async function ScheduleSelectionPage({
  searchParams,
}: {
  searchParams: Promise<{ psychologist?: string }>;
}) {
  const { psychologist: psychologistId } = await searchParams;

  if (!psychologistId) {
    return <div className="p-8 text-center text-red-500">Psikolog tidak ditemukan.</div>;
  }

  let pData: any = null;

  try {
    const res = await fetch(`${API_BASE_URL}/psychologists/public/${psychologistId}`, { cache: "no-store" });
    if (res.ok) {
      const text = await res.text();
      const json = text ? JSON.parse(text) : {};
      pData = json.data || json.psychologist || json;
    }
  } catch (err) {
    console.error("Fetch public error:", err);
  }

  if (!pData || (!pData.schedules && !pData.schedule)) {
    try {
      const resFallback = await fetch(`${API_BASE_URL}/psychologists/${psychologistId}`, { cache: "no-store" });
      if (resFallback.ok) {
        const textF = await resFallback.text();
        const jsonF = textF ? JSON.parse(textF) : {};
        pData = jsonF.data || jsonF.psychologist || jsonF;
      }
    } catch (err) {
      console.error("Fetch fallback error:", err);
    }
  }

  if (!pData) {
    return <div className="p-8 text-center text-red-500">Gagal memuat profil psikolog.</div>;
  }

  const psychologist = formatProfileData(pData);
  const unparsedSchedules = pData.schedules || pData.schedule || pData.availableSchedules || [];

  const rawSchedules = Array.isArray(unparsedSchedules)
    ? unparsedSchedules.map((s: any, idx: number) => {
        let dayName = String(s.day || s.hari || s.dayOfWeek || "").toUpperCase().trim();
        if (!dayName && s.date) {
          const d = new Date(s.date);
          if (!isNaN(d.getTime())) {
            dayName = DAYS_MAP[d.getDay()];
          }
        }

        return {
          ...s,
          id: s.id || `sch-${idx}`,
          day: dayName || "SENIN",
          startTime: String(s.startTime || s.time || "09:00"),
          duration: Number(s.duration) || 60,
          isAvailable: s.isAvailable ?? true,
        };
      })
    : [];

  const dates = deriveAvailableDaysFromProfile(rawSchedules);

  return (
    <main className="min-h-screen bg-white font-[var(--font-poppins)]">
      <ScheduleSelectionContent
        psychologist={psychologist}
        dates={dates as any}
        rawSchedules={rawSchedules}
      />
    </main>
  );
}