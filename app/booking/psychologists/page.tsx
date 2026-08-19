import { PsychologistSelectionContent } from "@/components/features/booking";

// Pastikan halaman selalu di-render ulang (tidak di-cache) agar data spesialisasi selalu fresh
export const dynamic = "force-dynamic";

type ApiPsychologist = {
  id?: string;
  name?: string;
  fullName?: string;
  sipp?: string;
  str?: string;
  specializations?: string[];
  avatarUrl?: string;
  photo?: string;
  status?: string;
  isProfileComplete?: boolean;
  profilePercentage?: number;
  primarySpecialization?: string;
};

async function getPsychologists() {
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "https://api.oasejiwa.id";

  try {
    // 🟢 Coba endpoint publik /psychologist terlebih dahulu, fallback ke /psychologists
    let res = await fetch(`${API_BASE_URL}/psychologist`, {
      cache: "no-store",
    });

    if (!res.ok) {
      res = await fetch(`${API_BASE_URL}/psychologists`, {
        cache: "no-store",
      });
    }

    if (!res.ok) return [];
    const json = await res.json();
    const rawData = json.data ?? json ?? [];
    return (Array.isArray(rawData) ? rawData : []) as ApiPsychologist[];
  } catch (err) {
    console.error("Gagal mengambil daftar psikolog booking:", err);
    return [];
  }
}

export default async function PsychologistSelectionPage() {
  const raw = await getPsychologists();

  // 🟢 1. Filter hanya psikolog yang 100% lengkap / berstatus Aktif
  const activePsychologists = raw.filter((p) => {
    const isComplete =
      p.isProfileComplete === true ||
      p.status === "Aktif" ||
      p.profilePercentage === 100;
    const hasName = Boolean(p.name || p.fullName);
    return isComplete && hasName;
  });

  // 🟢 2. Map data ke struktur properti komponen
  const psychologists = activePsychologists.map((p) => ({
    id: p.id || "",
    name: p.fullName || p.name || "Psikolog",
    role:
      p.primarySpecialization ||
      (p.specializations && p.specializations.length > 0
        ? p.specializations[0]
        : "Psikolog Klinis"),
    specializations: (p.specializations || []).map((s: any) =>
      typeof s === "string" ? s : s.name || ""
    ),
    experience: "-",
    rating: 5,
    reviews: 0,
    price: 0,
    avatar:
      p.avatarUrl ||
      p.photo ||
      "/assets/default-avatar.png",
    available: true,
    status: p.status || "Aktif",
    isProfileComplete: true,
  }));

  // 🟢 3. Buat daftar kategori filter yang relevan dari psikolog yang aktif
  const specializations: string[] = [
    "Semua",
    ...Array.from<string>(
      new Set(psychologists.flatMap((p) => p.specializations ?? []))
    ),
  ];

  return (
    <main className="min-h-screen bg-white font-[var(--font-poppins)]">
      <PsychologistSelectionContent
        psychologists={psychologists}
        specializations={specializations}
      />
    </main>
  );
}