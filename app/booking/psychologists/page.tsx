import { PsychologistSelectionContent } from "@/components/features/booking";

// Pastikan halaman selalu di-render ulang (tidak di-cache) agar data spesialisasi selalu fresh
export const dynamic = "force-dynamic";

type ApiPsychologist = {
  id?: string;
  name?: string;
  fullName?: string;
  sipp?: string;
  specializations?: string[];
  avatarUrl?: string;
};

async function getPsychologists() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.oasejiwa.id";
  const res = await fetch(`${API_BASE_URL}/psychologists`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  const json = await res.json();
  return (json.data ?? []) as ApiPsychologist[];
}

export default async function PsychologistSelectionPage() {
  const raw = await getPsychologists();

  // Map response API ke struktur Psychologist interface
  const psychologists = raw.map((p) => ({
    id: p.id || "",
    name: p.name || p.fullName || "Psikolog",
    role: p.sipp ?? "Psikolog",
    specializations: p.specializations ?? [],
    experience: "-",
    rating: 0,
    reviews: 0,
    price: 0,
    avatar: p.avatarUrl ?? "/assets/psychologists/default.jpg",
    available: true,
  }));

  // Ambil semua spesialisasi unik dari data
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