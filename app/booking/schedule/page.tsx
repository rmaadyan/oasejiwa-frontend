import { ScheduleSelectionContent } from "@/components/features/booking";
import { PsychologistProfile } from "@/components/features/booking";
import { deriveUniqueDates, RawSchedule, DateOption } from "@/lib/booking-data";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

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

export default async function ScheduleSelectionPage({
  searchParams,
}: {
  searchParams: Promise<{ psychologist?: string }>;
}) {
  const { psychologist: psychologistId } = await searchParams;

  if (!psychologistId) {
    return <div className="p-8 text-center text-red-500">Psikolog tidak ditemukan.</div>;
  }

  const psychologist = await getPsychologistDetail(psychologistId);
  if (!psychologist) {
    return <div className="p-8 text-center text-red-500">Gagal memuat data psikolog.</div>;
  }

  const res = await fetch(`${API_BASE_URL}/psychologists/${psychologistId}`, { cache: "no-store" });
  const json = await res.json();
  const rawSchedules = json.data?.schedules ?? [];
  const dates = deriveUniqueDates(rawSchedules);

  return (
    <main className="min-h-screen bg-white font-[var(--font-poppins)]">
      <ScheduleSelectionContent
        psychologist={psychologist}
        dates={dates}
        rawSchedules={rawSchedules}
      />
    </main>
  );
}