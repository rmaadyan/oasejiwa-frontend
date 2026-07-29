"use client";

import { X, User, Mail, Phone, MapPin, Calendar, Heart, Briefcase, AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { getRiskConfig, type RiskLevelKey } from "@/lib/types/psychologist";

interface CreatePatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newPatient: any) => void;
}

export default function CreatePatientModal({
  isOpen,
  onClose,
  onSuccess,
}: CreatePatientModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "Dewi Lestari",
    email: "dewi.lestari@example.com",
    phone: "0813-7788-9900",
    gender: "female" as "male" | "female",
    age: 25,
    address: "Jl. HR Rasuna Said No. 12, Jakarta Selatan",
    birthday: "2001-08-18",
    maritalStatus: "Belum Menikah",
    occupation: "UX Designer",
    emergencyContactName: "Bambang Lestari",
    emergencyContactPhone: "0812-4455-6677",
    emergencyContactRelation: "Ayah",
    diagnosis: "Gangguan Penyesuaian dengan Mood Cemas",
    medication: "Tidak ada obat (Psikoterapi mandiri)",
    allergies: "Tidak ada alergi yang diketahui",
    riskLevel: "medium" as string,
    riskReason: "Pasien mengalami kesulitan beradaptasi dengan lingkungan kerja baru, mengeluhkan kecemasan sosial ringan dan sulit fokus.",
  });

  if (!isOpen) return null;

  const validateForm = () => {
    if (!formData.name.trim()) return "Nama Pasien wajib diisi";
    if (!formData.email.trim()) return "Email Pasien wajib diisi";
    if (!formData.phone.trim()) return "Nomor Telepon wajib diisi";
    if (!formData.address.trim()) return "Alamat Lengkap wajib diisi";
    if (!formData.diagnosis.trim()) return "Diagnosis Utama wajib diisi";
    if (!formData.riskReason.trim()) return "Alasan Penilaian Risiko wajib diisi";
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const valError = validateForm();
    if (valError) {
      setError(valError);
      return;
    }

    setSubmitting(true);
    setError(null);

    const activeConfig = getRiskConfig(formData.riskLevel);
    const newId = `patient-${Date.now()}`;

    const createdPatient = {
      id: newId,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      age: Number(formData.age),
      gender: formData.gender,
      address: formData.address,
      birthday: formData.birthday,
      maritalStatus: formData.maritalStatus,
      occupation: formData.occupation,
      emergencyContact: {
        name: formData.emergencyContactName,
        phone: formData.emergencyContactPhone,
        relation: formData.emergencyContactRelation,
      },
      diagnosis: [formData.diagnosis],
      currentMedication: [formData.medication],
      allergies: [formData.allergies],
      riskLevel: formData.riskLevel,
      riskReason: formData.riskReason,
      riskRecommendations: activeConfig.recommendations,
      assessmentDate: new Date().toISOString().split("T")[0],
      assessingPsychologistName: "Dr. Maya Putri, M.Psi., Psikolog",
      totalSessions: 1,
      firstSessionDate: new Date().toISOString().split("T")[0],
      lastSessionDate: new Date().toISOString().split("T")[0],
      latestRiskLevel: formData.riskLevel,
      latestTesName: "Skala Kecemasan (DASS-21)",
      latestTesCategory: "Kecemasan",
      latestTesScore: "8 (35%)",
      hasSessionNotes: true,
      sessionHistory: [
        {
          id: `sesi-new-${Date.now()}`,
          bookingId: 201,
          scheduleId: `sch-new`,
          noteId: `note-new`,
          date: new Date().toISOString().split("T")[0],
          time: "10.00",
          duration: 60,
          service: "Konseling Individu",
          status: "completed",
          hasNotes: true,
        },
      ],
    };

    setTimeout(() => {
      setSubmitting(false);
      onSuccess(createdPatient);
      onClose();
    }, 400);
  };

  const activeRiskConfig = getRiskConfig(formData.riskLevel);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white p-6 shadow-xs">
          <div>
            <h2 className="text-xl font-bold text-[#2B5379]">
              Tambah Pasien Baru
            </h2>
            <p className="mt-0.5 text-xs text-gray-500">
              Isi data diri demografis, informasi medis, dan assessment risiko pasien secara lengkap.
            </p>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Demografi Pasien */}
          <div className="space-y-4 rounded-xl border border-gray-200 bg-gray-50/50 p-4">
            <h3 className="text-sm font-bold text-[#2B5379] uppercase tracking-wide flex items-center gap-2">
              <User className="h-4 w-4 text-[#2B5379]" /> Data Identitas & Demografi Pasien
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-bold text-gray-700">
                  Nama Lengkap Pasien <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Dewi Lestari"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-[#2B5379]"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-gray-700">
                  Email Pasien <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="dewi@example.com"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-[#2B5379]"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-gray-700">
                  Nomor Telepon <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0813-XXXX-XXXX"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-[#2B5379]"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-gray-700">
                  Jenis Kelamin <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as "male" | "female" })}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-[#2B5379]"
                >
                  <option value="female">Perempuan</option>
                  <option value="male">Laki-laki</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-gray-700">
                  Umur (Tahun) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-[#2B5379]"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-gray-700">
                  Tanggal Lahir <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.birthday}
                  onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-[#2B5379]"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-gray-700">
                  Status Pernikahan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.maritalStatus}
                  onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
                  placeholder="Belum Menikah / Menikah"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-[#2B5379]"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-gray-700">
                  Pekerjaan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.occupation}
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  placeholder="Pekerjaan pasien"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-[#2B5379]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-bold text-gray-700">
                  Alamat Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Alamat domisili pasien"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-[#2B5379]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Informasi Kontak Darurat */}
          <div className="space-y-4 rounded-xl border border-gray-200 bg-gray-50/50 p-4">
            <h3 className="text-sm font-bold text-[#2B5379] uppercase tracking-wide flex items-center gap-2">
              <Phone className="h-4 w-4 text-[#2B5379]" /> Kontak Darurat Pasien
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-bold text-gray-700">Nama Kontak</label>
                <input
                  type="text"
                  value={formData.emergencyContactName}
                  onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2B5379]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-gray-700">No. Telepon</label>
                <input
                  type="text"
                  value={formData.emergencyContactPhone}
                  onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2B5379]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-gray-700">Hubungan</label>
                <input
                  type="text"
                  value={formData.emergencyContactRelation}
                  onChange={(e) => setFormData({ ...formData, emergencyContactRelation: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2B5379]"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Informasi Profil Rekam Medis */}
          <div className="space-y-4 rounded-xl border border-[#2B5379]/20 bg-blue-50/40 p-4">
            <h3 className="text-sm font-bold text-[#2B5379] uppercase tracking-wide flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-[#2B5379]" /> Profil Medis Pasien
            </h3>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-bold text-gray-700">
                  Diagnosis Utama <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2B5379]"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-gray-700">Obat Saat Ini</label>
                <input
                  type="text"
                  value={formData.medication}
                  onChange={(e) => setFormData({ ...formData, medication: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2B5379]"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-gray-700">Alergi</label>
                <input
                  type="text"
                  value={formData.allergies}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2B5379]"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Assessment Tingkat Risiko */}
          <div className="space-y-4 rounded-xl border border-amber-300/80 bg-amber-50/40 p-4">
            <div className="flex items-center gap-2 border-b border-amber-200 pb-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <h3 className="text-sm font-bold text-[#2B5379] uppercase tracking-wide">
                Assessment Tingkat Risiko Initial
              </h3>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-gray-700">Tingkat Risiko *</label>
              <select
                value={formData.riskLevel}
                onChange={(e) => setFormData({ ...formData, riskLevel: e.target.value })}
                className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#2B5379]"
              >
                <option value="very_low">🟢 Sangat Rendah</option>
                <option value="low">🟢 Rendah</option>
                <option value="medium">🟡 Sedang</option>
                <option value="high">🟠 Tinggi</option>
                <option value="very_high">🔴 Sangat Tinggi</option>
              </select>
            </div>

            <div className="rounded-lg border border-amber-200 bg-white p-3 text-xs">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold border ${activeRiskConfig.badgeClass}`}>
                {activeRiskConfig.emoji} {activeRiskConfig.label}
              </span>
              <p className="mt-1 text-gray-700">{activeRiskConfig.description}</p>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-gray-700">
                Alasan Penilaian Risiko <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={2}
                value={formData.riskReason}
                onChange={(e) => setFormData({ ...formData, riskReason: e.target.value })}
                className="w-full rounded-lg border border-amber-300 bg-white px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2B5379]"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-[#2B5379] px-5 py-2 text-xs font-bold text-white hover:bg-[#234463] transition shadow-xs disabled:opacity-50"
            >
              {submitting ? "Menyimpan..." : "Simpan Pasien Baru"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
