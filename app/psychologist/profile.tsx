"use client";

import { useEffect, useState } from "react";
import ProfileHeader from "@/components/features/psychologist/profile/profileheader";
import PersonalInfo from "@/components/features/psychologist/profile/personalinfo";
import ProfessionalInfo from "@/components/features/psychologist/profile/professionalinfo";
import AvailabilitySettings from "@/components/features/psychologist/profile/availabilitysettings";
import { getPsychologistProfile } from "@/lib/api/psychologist";
import type { Psychologist } from "@/lib/types/psychologist";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Psychologist | null>(null);

  const fetchProfile = async () => {
    setLoading(true);

    try {
      const data = await getPsychologistProfile();
      setProfile(data);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#2B5379] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Memuat profil...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-red-600 font-medium">Gagal memuat profil</p>
          <button
            onClick={fetchProfile}
            className="mt-4 px-6 py-2 bg-[#2B5379] text-white rounded-lg hover:bg-[#2B5379]/90 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#2B5379]">Profil Saya</h1>
        <p className="text-gray-600 mt-1">Informasi profil psikolog</p>
      </div>

      <ProfileHeader psychologist={profile} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        <div className="xl:col-span-2 space-y-6">
          <PersonalInfo psychologist={profile} />
          <ProfessionalInfo psychologist={profile} />
        </div>

        <div className="xl:col-span-1">
          <AvailabilitySettings schedules={profile.schedules} />
        </div>
      </div>
    </div>
  );
}