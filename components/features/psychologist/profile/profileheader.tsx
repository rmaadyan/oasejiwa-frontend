"use client";

import { User, Camera, Loader2 } from "lucide-react";
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
  const [isProcessing, setIsProcessing] = useState(false);
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

  // 🟢 1. Saat memilih file gambar (Mendukung HEIC dan buka Modal Crop tanpa popup alert)
  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      const imageSrc = await processSelectedImage(file);
      if (imageSrc) {
        setRawSelectedImage(imageSrc);
        setIsCropperOpen(true);
      }
    } catch (err) {
      console.error("Gagal memproses file foto:", err);
    } finally {
      setIsProcessing(false);
      e.target.value = "";
    }
  };

  // 🟢 2. Saat selesai di-crop (Upload instan, terkompresi, tanpa alert popup & tanpa reload)
  const handleCroppedPhotoUpload = async (croppedBlob: Blob) => {
    const croppedFile = new File([croppedBlob], "psychologist-avatar.jpg", {
      type: "image/jpeg",
    });
    const localPreviewUrl = URL.createObjectURL(croppedFile);

    // Optimistic UI: langsung ganti tampilan preview secara lokal
    setPhotoUrl(localPreviewUrl);
    setIsUploading(true);

    try {
      // Unggah file gambar
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
      // Rollback jika gagal
      setPhotoUrl(psychologist.photo || (psychologist as any).avatarUrl || "");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-[#D1EAFF] rounded-2xl p-6 md:p-8 font-poppins border-2 border-slate-300 shadow-xs space-y-2">
      <div className="flex flex-col md:flex-row items-center gap-6">
        
        {/* Avatar & Tombol Ubah Foto */}
        <div className="relative shrink-0 group">
          <div className="w-28 h-28 md:w-32 md:h-32 bg-white rounded-2xl flex items-center justify-center overflow-hidden shadow-md border-4 border-white">
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
          </div>

          {/* Tombol Kamera */}
          <label
            title="Ubah Foto Profil"
            className={`absolute -bottom-2 -right-2 bg-white text-[#234463] p-2.5 rounded-xl border border-blue-200 shadow-md hover:bg-blue-50 transition transform hover:scale-105 cursor-pointer ${
              isProcessing || isUploading ? "opacity-60 pointer-events-none" : ""
            }`}
          >
            {isProcessing ? (
              <Loader2 size={15} className="animate-spin text-[#234463]" />
            ) : (
              <Camera size={15} />
            )}
            <input
              type="file"
              accept="image/*, .heic, .heif"
              className="hidden"
              onChange={handlePhotoSelect}
              disabled={isUploading || isProcessing}
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