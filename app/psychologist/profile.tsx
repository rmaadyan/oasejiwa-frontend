"use client";

import { useEffect, useState } from "react";
import ProfileHeader from "@/components/features/psychologist/profile/profileheader";
import PersonalInfo from "@/components/features/psychologist/profile/personalinfo";
import ProfessionalInfo from "@/components/features/psychologist/profile/professionalinfo";
import AvailabilitySettings from "@/components/features/psychologist/profile/availabilitysettings";
import { getPsychologistProfile } from "@/lib/api/psychologist";
import type { Psychologist } from "@/lib/types/psychologist";
import { Eye } from "lucide-react";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Psychologist | null>(null);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await getPsychologistProfile();
      setProfile(data);
    } catch (error) {
      console.error("Gagal memuat profil:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] font-poppins text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-[#1F415F] rounded-full animate-bounce"></div>
          <div className="w-2.5 h-2.5 bg-[#1F415F] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2.5 h-2.5 bg-[#1F415F] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    // 🟢 BACKGROUND KONTRAS DENGAN GRADASI HALUS
    <div className="w-full min-h-screen bg-slate-100/90 p-4 sm:p-6 lg:p-8 font-poppins text-xs">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Title & Preview Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border-2 border-slate-300 shadow-sm">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1F415F]">Profil Saya</h1>
            <p className="text-slate-500 mt-0.5 font-medium">Kelola informasi profil dan ketersediaan jadwal praktik</p>
          </div>
          <button
            type="button"
            onClick={() => window.open(`/psikologdetail?id=${profile.id}`, "_blank")}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#1F415F] hover:bg-[#163047] text-white rounded-xl font-semibold shadow-xs transition cursor-pointer shrink-0"
          >
            <Eye size={16} />
            <span>Preview Profil Publik</span>
          </button>
        </div>

        {/* 🟢 CARD 1: Header Profile (BORDER TEGAS - NO MOTION) */}
        <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-sm overflow-hidden">
          <ProfileHeader psychologist={profile} isEditing={false} onToggleEdit={() => {}} />
        </div>

        {/* 🟢 CARD 2: Personal Information */}
        <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-sm overflow-hidden">
          <PersonalInfo psychologist={profile} onUpdate={fetchProfile} />
        </div>

        {/* 🟢 CARD 3: Pendidikan & Professional Info */}
        <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-sm overflow-hidden">
          <ProfessionalInfo 
            key={JSON.stringify(profile)} 
            psychologist={profile} 
            onUpdate={fetchProfile} 
          />
        </div>

        {/* 🟢 CARD 4: Jadwal Praktik */}
        <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-sm overflow-hidden">
          <AvailabilitySettings schedules={(profile as any)?.schedules || []} onUpdate={fetchProfile} />
        </div>

      </div>
    </div>
  );
}