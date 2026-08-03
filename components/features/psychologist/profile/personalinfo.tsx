"use client";

import { useState, useEffect } from "react";
import { Save, Lock, Pencil, X } from "lucide-react";
import { updatePsychologistProfile } from "@/lib/api/psychologist";

export default function PersonalInfo({
  psychologist,
  onUpdate,
}: {
  psychologist: any;
  onUpdate?: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    sipp: "",
    str: "",
    about: "",
  });

  useEffect(() => {
    if (psychologist) {
      setFormData({
        fullName: psychologist.name || psychologist.fullName || "",
        email: psychologist.email || "",
        phoneNumber:
          psychologist.phoneNumber ||
          psychologist.phone ||
          psychologist.user?.userProfile?.phone ||
          "",
        sipp: psychologist.sipp || "",
        str: psychologist.str || "",
        about: psychologist.about || psychologist.bio || "",
      });
    }
  }, [psychologist]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updatePsychologistProfile({
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        sipp: formData.sipp,
        str: formData.str,
        about: formData.about,
      });
      setIsEditing(false);
      if (onUpdate) await onUpdate();
      alert("Informasi pribadi berhasil diperbarui!");
    } catch (err: any) {
      alert(err.message || "Gagal memperbarui informasi pribadi.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (psychologist) {
      setFormData({
        fullName: psychologist.name || psychologist.fullName || "",
        email: psychologist.email || "",
        phoneNumber:
          psychologist.phoneNumber ||
          psychologist.phone ||
          psychologist.user?.userProfile?.phone ||
          "",
        sipp: psychologist.sipp || "",
        str: psychologist.str || "",
        about: psychologist.about || psychologist.bio || "",
      });
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl border-2 border-slate-500 shadow-xs space-y-2 font-poppins text-xs">
      
      {/* 🟢 HEADER PILL BLUE BALOK (SESUAI MODEL PROFESSIONAL INFO) */}
      <div className="w-full bg-[#1F415F] text-white py-2 rounded-full text-center font-semibold text-xs tracking-wide">
        Informasi Pribadi
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        
        {/* 🟢 SUSUNAN 2 KOLOM (KIRI & KANAN) DENGAN GARIS TEPI INPUT TEGAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
          
          {/* ==================== KOLOM KIRI ==================== */}
          <div className="space-y-3">
            {/* Nama Lengkap & Gelar */}
            <div className="space-y-1">
              <label className="font-bold text-gray-700 block">
                Nama Lengkap & Gelar <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                disabled={!isEditing}
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className={`w-full p-2.5 border border-slate-300 rounded-lg outline-none font-medium transition ${
                  isEditing
                    ? "bg-white focus:border-[#1F415F] focus:ring-1 focus:ring-[#1F415F]"
                    : "bg-slate-50 text-slate-700 cursor-not-allowed"
                }`}
                placeholder="Dr. Sarah Amelia, M.Psi."
              />
            </div>

            {/* Email Resmi (Read-Only) */}
            <div className="space-y-1">
              <label className="font-bold text-gray-700 flex items-center justify-between">
                <span>Email Resmi (Read-Only)</span>
                <Lock size={12} className="text-gray-400" />
              </label>
              <input
                type="email"
                disabled
                value={formData.email}
                className="w-full p-2.5 bg-slate-100 border border-slate-300 rounded-lg font-medium text-slate-500 cursor-not-allowed"
              />
            </div>

            {/* No. SIPP */}
            <div className="space-y-1">
              <label className="font-bold text-gray-700 block">
                No. SIPP <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                disabled={!isEditing}
                value={formData.sipp}
                onChange={(e) => setFormData({ ...formData, sipp: e.target.value })}
                className={`w-full p-2.5 border border-slate-300 rounded-lg outline-none font-medium transition ${
                  isEditing
                    ? "bg-white focus:border-[#1F415F] focus:ring-1 focus:ring-[#1F415F]"
                    : "bg-slate-50 text-slate-700 cursor-not-allowed"
                }`}
                placeholder="12333-SIPP"
              />
            </div>
          </div>

          {/* ==================== KOLOM KANAN ==================== */}
          <div className="space-y-3">
            {/* Nomor HP / WhatsApp */}
            <div className="space-y-1">
              <label className="font-bold text-gray-700 block">
                Nomor HP / WhatsApp <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                disabled={!isEditing}
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className={`w-full p-2.5 border border-slate-300 rounded-lg outline-none font-medium transition ${
                  isEditing
                    ? "bg-white focus:border-[#1F415F] focus:ring-1 focus:ring-[#1F415F]"
                    : "bg-slate-50 text-slate-700 cursor-not-allowed"
                }`}
                placeholder="081234567890"
              />
            </div>

            {/* No. STR */}
            <div className="space-y-1">
              <label className="font-bold text-gray-700 block">
                No. STR <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                disabled={!isEditing}
                value={formData.str}
                onChange={(e) => setFormData({ ...formData, str: e.target.value })}
                className={`w-full p-2.5 border border-slate-300 rounded-lg outline-none font-medium transition ${
                  isEditing
                    ? "bg-white focus:border-[#1F415F] focus:ring-1 focus:ring-[#1F415F]"
                    : "bg-slate-50 text-slate-700 cursor-not-allowed"
                }`}
                placeholder="9897867-STR"
              />
            </div>

            {/* Tentang Saya / Bio Singkat */}
            <div className="space-y-1">
              <label className="font-bold text-gray-700 block">
                Tentang Saya / Bio Singkat <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                disabled={!isEditing}
                value={formData.about}
                onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                className={`w-full p-2.5 border border-slate-300 rounded-lg outline-none font-medium transition ${
                  isEditing
                    ? "bg-white focus:border-[#1F415F] focus:ring-1 focus:ring-[#1F415F]"
                    : "bg-slate-50 text-slate-700 cursor-not-allowed"
                }`}
                placeholder="Tuliskan perkenalan singkat mengenai latar belakang klinis Anda..."
              />
            </div>
          </div>

        </div>

        {/* 🟢 TOMBOL AKSI DI POJOK KANAN BAWAH */}
        <div className="flex justify-end pt-3 border-t border-slate-100">
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-[#1F415F] text-white font-semibold rounded-lg hover:bg-[#18334b] transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Pencil className="w-4 h-4" />
              <span>Edit Profil</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="px-3.5 py-2 border border-slate-300 rounded-lg text-slate-600 font-medium hover:bg-slate-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-[#1F415F] text-white font-semibold rounded-lg hover:bg-[#18334b] transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? "Menyimpan..." : "Simpan Perubahan"}</span>
              </button>
            </div>
          )}
        </div>

      </form>
    </div>
  );
}