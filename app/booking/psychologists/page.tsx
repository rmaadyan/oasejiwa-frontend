import { PsychologistSelectionContent } from "@/components/features/booking";

async function getPsychologists() {
  const API_BASE_URL =  "http://localhost:3001";
  const res = await fetch(`${API_BASE_URL}/psychologists`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data ?? [];
}

export default async function PsychologistSelectionPage() {
  const raw = await getPsychologists();

  // Map response API ke struktur Psychologist interface
  const psychologists = raw.map((p: any) => ({
    id: p.id,
    name: p.name,
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
    new Set(psychologists.flatMap((p: any) => p.specializations as string[]))
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