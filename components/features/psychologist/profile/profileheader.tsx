"use client";

import { User, Camera } from "lucide-react";
import { useState } from "react";
import type { Psychologist } from "@/lib/types/psychologist";
import { updatePsychologistProfile } from "@/lib/api/psychologist";

interface ProfileHeaderProps {
  psychologist: Psychologist;
  isEditing?: boolean;
  onToggleEdit?: () => void;
}

export default function ProfileHeader({
  psychologist,
}: ProfileHeaderProps) {
  const [photoUrl, setPhotoUrl] = useState(psychologist.photo || "");
  const [isUploading, setIsUploading] = useState(false);

  const formatJoinedDate = (date?: string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64Image = reader.result as string;
      setPhotoUrl(base64Image);

      try {
        setIsUploading(true);
        await updatePsychologistProfile({
          avatarUrl: base64Image,
        });
        alert("Foto profil berhasil diperbarui!");
        window.location.reload();
      } catch (err: any) {
        alert(err.message || "Gagal memperbarui foto profil.");
      } finally {
        setIsUploading(false);
      }
    };
  };

  return (
    <div className="bg-[#D1EAFF] rounded-2xl p-6 md:p-8 border-blue-100 font-poppins border-2 border-slate-500 shadow-xs space-y-2">
      <div className="flex flex-col md:flex-row items-center gap-6">
        
        {/* Avatar & Tombol Ubah Foto */}
        <div className="relative group w-28 h-28 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center overflow-hidden shrink-0 shadow-md border-4 border-white">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={psychologist.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-16 h-16 text-[#2B5379]" />
          )}

          <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition cursor-pointer">
            <Camera className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-semibold">
              {isUploading ? "Mengunggah..." : "Ubah Foto"}
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
              disabled={isUploading}
            />
          </label>
        </div>

        {/* Info Nama & Email */}
        <div className="flex-1 text-center md:text-left space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-[#2B5379]">
            {psychologist.name}
          </h1>
          <p className="text-gray-700 text-sm md:text-base">{psychologist.email}</p>
          <div className="inline-flex px-3.5 py-1.5 bg-white/90 rounded-xl text-gray-700 text-xs font-medium border border-blue-50">
            <span className="text-gray-500 mr-1.5">Bergabung:</span>
            {formatJoinedDate(psychologist.joinedDate)}
          </div>
        </div>

        {/* Badge Status */}
        <div className="px-5 py-2 rounded-xl text-xs md:text-sm font-semibold bg-[#2B5379] text-white">
          {psychologist.status === "active" ? "Aktif" : "Tidak Aktif"}
        </div>

      </div>
    </div>
  );
}