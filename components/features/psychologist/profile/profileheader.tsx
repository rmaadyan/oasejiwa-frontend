"use client";

import { User, Camera, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
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

  const percentage = (psychologist as any).profilePercentage ?? (
    psychologist.status === "Aktif" || (psychologist as any).isProfileComplete ? 100 : 40
  );

  const isCompleted = percentage === 100;

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
    } catch (err: any) {
      console.error("Gagal memproses file foto psikolog:", err);
      alert(err.message || "Gagal memproses foto yang dipilih.");
    } finally {
      setIsProcessing(false);
      e.target.value = "";
    }
  };

  const handleCroppedPhotoUpload = async (croppedBlob: Blob) => {
    const croppedFile = new File([croppedBlob], `psychologist-${Date.now()}.jpg`, {
      type: "image/jpeg",
    });
    const localPreviewUrl = URL.createObjectURL(croppedFile);

    setPhotoUrl(localPreviewUrl);
    setIsUploading(true);

    try {
      const uploadedUrl = await uploadImage(croppedFile);
      await updatePsychologistProfile({
        avatarUrl: uploadedUrl,
        photo: uploadedUrl,
      });

      setPhotoUrl(uploadedUrl);

      if (onUpdate) {
        onUpdate();
      }
    } catch (err: any) {
      console.error("Gagal update foto psikolog:", err);
      setPhotoUrl(psychologist.photo || (psychologist as any).avatarUrl || "");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-[#D1EAFF] rounded-2xl p-6 md:p-8 font-poppins border-2 border-slate-300 shadow-xs space-y-5">
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Avatar & Tombol Kamera */}
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
              accept="image/jpeg, image/png, image/webp, image/*, .heic, .heif"
              className="hidden"
              onChange={handlePhotoSelect}
              disabled={isUploading || isProcessing}
            />
          </label>
        </div>

        {/* Info Nama & Detail */}
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

        {/* Status Badge */}
        <div className="flex flex-col items-center md:items-end gap-2">
          <div
            className={`px-5 py-2 rounded-xl text-xs md:text-sm font-semibold shadow-xs flex items-center gap-1.5 ${
              isCompleted
                ? "bg-emerald-600 text-white"
                : "bg-amber-500 text-white"
            }`}
          >
            {isCompleted ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{isCompleted ? "Aktif" : "Menunggu Profil"}</span>
          </div>
          <span className="text-[11px] font-semibold text-slate-600">
            Kelengkapan: {percentage}%
          </span>
        </div>
      </div>

      {/* 🟢 PROGRESS BAR KELENGKAPAN PROFIL (PERSIS PROFILE PASIEN) */}
      <div className="bg-white/80 backdrop-blur-xs rounded-xl p-4 border border-blue-100 space-y-2">
        <div className="flex justify-between items-center text-xs font-bold text-[#2B5379]">
          <span>Status Kelengkapan Profil</span>
          <span>{percentage}% / 100%</span>
        </div>
        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              isCompleted ? "bg-emerald-500" : "bg-[#2B5379]"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-[11px] text-slate-600 font-medium">
          {isCompleted
            ? "Profil Anda telah lengkap 100% dan akun Anda berstatus Aktif untuk menerima pemesanan konsultasi."
            : "Lengkapi 5 bagian (Personal Info, Foto, Pendidikan, Info Profesional, dan Jadwal Praktik) agar profil aktif di publik."}
        </p>
      </div>

      {/* Modal Crop */}
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