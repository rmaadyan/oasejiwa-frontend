"use client";

import { User, Camera } from "lucide-react";
import { useState, useEffect } from "react";
import type { Psychologist } from "@/lib/types/psychologist";
import { updatePsychologistProfile, uploadImage } from "@/lib/api/psychologist";
import { processSelectedImage } from "@/lib/utils/imageHandler";
import AvatarCropperModal from "@/components/features/user/AvatarCropperModal";
import { getImageUrl } from "@/lib/utils/getImageUrl";

interface ProfileHeaderProps {
  psychologist: Psychologist;
  isEditing?: boolean;
  onToggleEdit?: () => void;
  onUpdate?: () => void;
}

export default function ProfileHeader({
  psychologist,
  onUpdate,
}: ProfileHeaderProps) {
  const [photoUrl, setPhotoUrl] = useState<string>(
    psychologist.photo || (psychologist as any).avatarUrl || ""
  );
  const [isUploading, setIsUploading] = useState(false);
  const [rawSelectedImage, setRawSelectedImage] = useState<string | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);

  useEffect(() => {
    if (psychologist.photo || (psychologist as any).avatarUrl) {
      setPhotoUrl(psychologist.photo || (psychologist as any).avatarUrl || "");
    }
  }, [psychologist]);

  const formatJoinedDate = (date?: string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // 🟢 1. Saat memilih file gambar (Mendukung HEIC dan buka Modal Crop)
  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imageSrc = await processSelectedImage(file);
      setRawSelectedImage(imageSrc);
      setIsCropperOpen(true);
    } catch (err: any) {
      alert(err.message || "Gagal memproses gambar.");
    } finally {
      e.target.value = "";
    }
  };

  // 🟢 2. Saat selesai di-crop (Upload instan, terkompresi, tanpa alert popup & reload)
  const handleCroppedPhotoUpload = async (croppedBlob: Blob) => {
    const croppedFile = new File([croppedBlob], "psychologist-avatar.jpg", {
      type: "image/jpeg",
    });
    const localPreviewUrl = URL.createObjectURL(croppedFile);

    // Optimistic UI: langsung tampilkan preview
    setPhotoUrl(localPreviewUrl);
    setIsUploading(true);

    try {
      // Unggah file binary hasil kompresi crop
      const uploadedUrl = await uploadImage(croppedFile);
      
      // Simpan URL ke profil psikolog
      await updatePsychologistProfile({
        avatarUrl: uploadedUrl,
        photo: uploadedUrl,
      });

      setPhotoUrl(uploadedUrl);

      if (onUpdate) {
        onUpdate();
      }
    } catch (err: any) {
      console.error("Gagal memperbarui foto profil:", err);
      // Fallback ke foto awal jika gagal
      setPhotoUrl(psychologist.photo || (psychologist as any).avatarUrl || "");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-[#D1EAFF] rounded-2xl p-6 md:p-8 font-poppins border-2 border-slate-300 shadow-xs space-y-2">
      <div className="flex flex-col md:flex-row items-center gap-6">
        
        {/* Avatar & Tombol Ubah Foto */}
        <div className="relative group w-28 h-28 md:w-32 md:h-32 bg-white rounded-2xl flex items-center justify-center overflow-hidden shrink-0 shadow-md border-4 border-white">
          {photoUrl ? (
            <img
              src={getImageUrl(photoUrl)}
              alt={psychologist.name}
              className={`w-full h-full object-cover transition-opacity ${
                isUploading ? "opacity-50 animate-pulse" : "opacity-100"
              }`}
            />
          ) : (
            <User className="w-14 h-14 text-[#2B5379]" />
          )}

          <label
            title="Ubah Foto Profil"
            className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition duration-200 cursor-pointer"
          >
            <Camera className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-semibold">
              {isUploading ? "Mengunggah..." : "Ubah Foto"}
            </span>
            <input
              type="file"
              accept="image/*, .heic, .heif"
              className="hidden"
              onChange={handlePhotoSelect}
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
        <div className="px-5 py-2 rounded-xl text-xs md:text-sm font-semibold bg-[#2B5379] text-white shadow-xs">
          {psychologist.status === "active" || psychologist.status === "Aktif"
            ? "Aktif"
            : "Tidak Aktif"}
        </div>

      </div>

      {/* Modal Crop Foto */}
      {rawSelectedImage && (
        <AvatarCropperModal
          imageSrc={rawSelectedImage}
          isOpen={isCropperOpen}
          onClose={() => {
            setIsCropperOpen(false);
            setRawSelectedImage(null);
          }}
          onCropCompleteAction={handleCroppedPhotoUpload}
        />
      )}
    </div>
  );
}