"use client";

import { useState } from "react";
import type { Psychologist } from "@/lib/types/psychologist";

interface PersonalInfoProps {
  psychologist: Psychologist;
  onSave: (data: Partial<Psychologist>) => Promise<void>;
}

export default function PersonalInfo({ psychologist, onSave }: PersonalInfoProps) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: psychologist.name,
    email: psychologist.email,
    phone: psychologist.phone || "",
    bio: psychologist.bio || "",
    languages: psychologist.languages || []
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(formData);
      setEditing(false);
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan perubahan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-[#2B5379]">Informasi Personal</h2>
          <p className="text-sm text-gray-600 mt-1">Data pribadi dan kontak</p>
        </div>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-[#2B5379] rounded-lg hover:bg-[#1e3d57] transition-colors"
          >
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => {
                setEditing(false);
                setFormData({
                  name: psychologist.name,
                  email: psychologist.email,
                  phone: psychologist.phone || "",
                  bio: psychologist.bio || "",
                  languages: psychologist.languages || []
                });
              }}
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-white bg-[#2B5379] rounded-lg hover:bg-[#1e3d57] transition-colors disabled:opacity-50"
            >
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-[#2B5379] mb-2">
            Nama Lengkap
          </label>
          {editing ? (
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2B5379] focus:border-transparent outline-none"
            />
          ) : (
            <p className="text-gray-900">{psychologist.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-[#2B5379] mb-2">
            Email
          </label>
          {editing ? (
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2B5379] focus:border-transparent outline-none"
            />
          ) : (
            <p className="text-gray-900">{psychologist.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-[#2B5379] mb-2">
            Nomor Telepon
          </label>
          {editing ? (
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2B5379] focus:border-transparent outline-none"
            />
          ) : (
            <p className="text-gray-900">{psychologist.phone || "-"}</p>
          )}
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-[#2B5379] mb-2">
            Bio
          </label>
          {editing ? (
            <textarea
              value={formData.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2B5379] focus:border-transparent outline-none"
              placeholder="Ceritakan tentang diri Anda dan pengalaman profesional..."
            />
          ) : (
            <p className="text-gray-900">{psychologist.bio || "-"}</p>
          )}
        </div>

        {/* Languages */}
        <div>
          <label className="block text-sm font-medium text-[#2B5379] mb-2">
            Bahasa
          </label>
          <div className="flex flex-wrap gap-2">
            {psychologist.languages?.map((lang, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-[#D1EAFF] text-[#2B5379] text-sm font-medium rounded-md"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
