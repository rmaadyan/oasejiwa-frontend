import { notFound } from "next/navigation";
import PsychologistDashboard from "@/app/psychologist/dashboard";
import SchedulePage from "@/app/psychologist/schedule";
import PatientsPage from "@/app/psychologist/patients";
import NotesPage from "@/app/psychologist/notes";
import ProfilePage from "@/app/psychologist/profile";
import PsychologistRekamMedisPage from "@/app/psychologist/rekam-medis";

interface PageProps {
  params: Promise<{ slug: string }>;  // ← PROMISE!
}

export default async function PsychologistSlugPage({ params }: PageProps) {
  const { slug } = await params;  // ← AWAIT!

  switch (slug) {
    case "dashboard":
      return <PsychologistDashboard />;
    
    case "schedule":
      return <SchedulePage />;
    
    case "patients":
      return <PatientsPage />;
    
    case "notes":
      return <NotesPage />;

    case "rekam-medis":
      return <PsychologistRekamMedisPage />;
    
    case "profile":
    case "settings":
      return <ProfilePage />;
    
    default:
      notFound();
  }
}
