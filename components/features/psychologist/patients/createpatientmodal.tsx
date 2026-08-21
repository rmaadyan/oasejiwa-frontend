"use client";

import { X, User, Phone, AlertTriangle, AlertCircle, ShieldAlert } from "lucide-react";
import { useState, useEffect } from "react";
import { getRiskConfig, RISK_LEVEL_CONFIGS } from "@/lib/types/psychologist";
import { createPatient } from "@/lib/api/psychologist";
import { getAllLayanan } from "@/lib/api/layanan"; // 🟢 Pakai helper yang sama dengan Manajemen Layanan Admin

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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [servicesList, setServicesList] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "female" as "male" | "female",
    age: "",
    address: "",
    birthday: "",
    maritalStatus: "Belum Menikah",
    occupation: "",
    education: "Perguruan Tinggi",
    serviceId: "", // 🟢 ID Layanan yang dipilih
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",
    diagnosis: "",
    medication: "",
    allergies: "",
    riskLevel: "low" as string,
    riskReason: "",
  });

  // 🟢 Load data layanan dari fungsi getAllLayanan() yang dipakai Admin
  useEffect(() => {
    if (isOpen) {
      getAllLayanan()
        .then((data) => {
          const list = Array.isArray(data) ? data : (data as any)?.data || [];
          setServicesList(list);
          if (list.length > 0) {
            // Utamakan pilih Konseling Individu jika ada di daftar
            const defaultItem = list.find((s: any) => s.nama?.toLowerCase().includes("individu")) || list[0];
            setFormData((prev) => ({ ...prev, serviceId: String(defaultItem.id) }));
          }
        })
        .catch((err) => {
          console.warn("Gagal load layanan dari API:", err);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const scrollToField = (fieldId: string) => {
    const el = document.getElementById(fieldId) || document.querySelector(`[name="${fieldId}"]`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      if ("focus" in el && typeof el.focus === "function") {
        (el as HTMLElement).focus();
      }
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Nama Lengkap Pasien wajib diisi";
    }

    if (!formData.email.trim()) {
      errors.email = "Email Pasien wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = "Format email tidak valid (contoh: pasien@email.com)";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Nomor Telepon wajib diisi";
    }

    if (!formData.address.trim()) {
      errors.address = "Alamat Lengkap wajib diisi";
    }

    if (!formData.serviceId) {
      errors.serviceId = "Pilihan Layanan Konseling wajib dipilih";
    }

    if (!formData.diagnosis.trim()) {
      errors.diagnosis = "Diagnosis Utama wajib diisi";
    }

    if (!formData.riskReason.trim()) {
      errors.riskReason = "Alasan Penilaian Risiko wajib diisi";
    }

    setFieldErrors(errors);

    const errorFields = Object.keys(errors);
    if (errorFields.length > 0) {
      setTimeout(() => {
        scrollToField(errorFields[0]);
      }, 50);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const createdPatient = await createPatient(formData);

      if (typeof onSuccess === "function") {
        await onSuccess(createdPatient);
      }
      onClose();
    } catch (err: any) {
      console.error("Error creating patient:", err);
      alert(err.message || "Gagal membuat pasien baru.");
    } finally {
      setSubmitting(false);
    }
  };

  const activeRiskConfig = getRiskConfig(formData.riskLevel);
  const errorCount = Object.keys(fieldErrors).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 font-poppins text-xs">
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
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form noValidate onSubmit={handleSubmit} className="space-y-6 p-6">
          {errorCount > 0 && (
            <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-xs">
              <div className="flex items-center gap-2 text-red-800 font-bold mb-2">
                <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
                <span>Harap perbaiki {errorCount} kesalahan sebelum menyimpan:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-red-700 font-medium">
                {Object.entries(fieldErrors).map(([field, msg]) => (
                  <li
                    key={field}
                    onClick={() => scrollToField(field)}
                    className="cursor-pointer hover:underline"
                  >
                    {msg}
                  </li>
                ))}
              </ul>
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
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: "" }));
                  }}
                  placeholder="e.g. Dewi Lestari"
                  className={`w-full rounded-lg border px-3.5 py-2 text-sm outline-none transition focus:ring-2 ${
                    fieldErrors.name ? "border-red-500 bg-red-50/30 focus:ring-red-500/20" : "border-gray-300 bg-white focus:ring-[#2B5379]"
                  }`}
                />
                {fieldErrors.name && (
                  <p className="mt-1 text-xs font-medium text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {fieldErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-gray-700">
                  Email Pasien <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: "" }));
                  }}
                  placeholder="dewi@example.com"
                  className={`w-full rounded-lg border px-3.5 py-2 text-sm outline-none transition focus:ring-2 ${
                    fieldErrors.email ? "border-red-500 bg-red-50/30 focus:ring-red-500/20" : "border-gray-300 bg-white focus:ring-[#2B5379]"
                  }`}
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-xs font-medium text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-gray-700">
                  Nomor Telepon <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    if (fieldErrors.phone) setFieldErrors((prev) => ({ ...prev, phone: "" }));
                  }}
                  placeholder="0813-XXXX-XXXX"
                  className={`w-full rounded-lg border px-3.5 py-2 text-sm outline-none transition focus:ring-2 ${
                    fieldErrors.phone ? "border-red-500 bg-red-50/30 focus:ring-red-500/20" : "border-gray-300 bg-white focus:ring-[#2B5379]"
                  }`}
                />
                {fieldErrors.phone && (
                  <p className="mt-1 text-xs font-medium text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {fieldErrors.phone}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-gray-700">
                  Jenis Kelamin <span className="text-red-500">*</span>
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as "male" | "female" })}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2B5379] cursor-pointer"
                >
                  <option value="female">Perempuan</option>
                  <option value="male">Laki-laki</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-gray-700">Umur (Tahun)</label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="Contoh: 24"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2B5379]"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-gray-700">Tanggal Lahir</label>
                <input
                  id="birthday"
                  name="birthday"
                  type="date"
                  value={formData.birthday}
                  onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2B5379] cursor-pointer"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-gray-700">Status Pernikahan</label>
                <select
                  id="maritalStatus"
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2B5379] cursor-pointer"
                >
                  <option value="Belum Menikah">Belum Menikah</option>
                  <option value="Menikah">Menikah</option>
                  <option value="Duda/Janda">Duda / Janda</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-gray-700">Pekerjaan</label>
                <input
                  id="occupation"
                  name="occupation"
                  type="text"
                  value={formData.occupation}
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  placeholder="Contoh: Pegawai Swasta / Mahasiswa"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2B5379]"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-gray-700">Pendidikan Terakhir</label>
                <select
                  id="education"
                  name="education"
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2B5379] cursor-pointer"
                >
                  <option value="SD">SD</option>
                  <option value="SMP">SMP</option>
                  <option value="SMA">SMA / SMK</option>
                  <option value="Diploma">Diploma (D3/D4)</option>
                  <option value="Perguruan Tinggi">Sarjana (S1)</option>
                  <option value="Magister">Magister (S2)</option>
                </select>
              </div>

              {/* 🟢 PILIHAN LAYANAN KONSELING SESUAI TABEL LAYANAN ADMIN */}
              <div>
                <label className="mb-1 block text-xs font-bold text-gray-700">
                  Pilihan Layanan Konseling <span className="text-red-500">*</span>
                </label>
                <select
                  id="serviceId"
                  name="serviceId"
                  value={formData.serviceId}
                  onChange={(e) => {
                    setFormData({ ...formData, serviceId: e.target.value });
                    if (fieldErrors.serviceId) setFieldErrors((prev) => ({ ...prev, serviceId: "" }));
                  }}
                  className={`w-full rounded-lg border px-3.5 py-2 text-sm font-semibold outline-none transition focus:ring-2 cursor-pointer ${
                    fieldErrors.serviceId ? "border-red-500 bg-red-50/30 focus:ring-red-500/20" : "border-blue-400 bg-white text-slate-800 focus:ring-[#2B5379]"
                  }`}
                >
                  {servicesList.length === 0 ? (
                    <option value="">Memuat layanan dari database...</option>
                  ) : (
                    servicesList.map((srv: any) => (
                      <option key={srv.id} value={srv.id}>
                        {srv.nama} (Rp {Number(srv.harga || 0).toLocaleString("id-ID")})
                      </option>
                    ))
                  )}
                </select>
                {fieldErrors.serviceId && (
                  <p className="mt-1 text-xs font-medium text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {fieldErrors.serviceId}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-bold text-gray-700">
                  Alamat Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={(e) => {
                    setFormData({ ...formData, address: e.target.value });
                    if (fieldErrors.address) setFieldErrors((prev) => ({ ...prev, address: "" }));
                  }}
                  placeholder="Alamat domisili pasien"
                  className={`w-full rounded-lg border px-3.5 py-2 text-sm outline-none transition focus:ring-2 ${
                    fieldErrors.address ? "border-red-500 bg-red-50/30 focus:ring-red-500/20" : "border-gray-300 bg-white focus:ring-[#2B5379]"
                  }`}
                />
                {fieldErrors.address && (
                  <p className="mt-1 text-xs font-medium text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {fieldErrors.address}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Kontak Darurat */}
          <div className="space-y-4 rounded-xl border border-gray-200 bg-gray-50/50 p-4">
            <h3 className="text-sm font-bold text-[#2B5379] uppercase tracking-wide flex items-center gap-2">
              <Phone className="h-4 w-4 text-[#2B5379]" /> Kontak Darurat Pasien
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-bold text-gray-700">Nama Kontak</label>
                <input
                  id="emergencyContactName"
                  name="emergencyContactName"
                  type="text"
                  value={formData.emergencyContactName}
                  onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                  placeholder="Nama kerabat"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2B5379]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-gray-700">No. Telepon</label>
                <input
                  id="emergencyContactPhone"
                  name="emergencyContactPhone"
                  type="text"
                  value={formData.emergencyContactPhone}
                  onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                  placeholder="0812-XXXX-XXXX"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2B5379]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-gray-700">Hubungan</label>
                <input
                  id="emergencyContactRelation"
                  name="emergencyContactRelation"
                  type="text"
                  value={formData.emergencyContactRelation}
                  onChange={(e) => setFormData({ ...formData, emergencyContactRelation: e.target.value })}
                  placeholder="Contoh: Orang Tua / Pasangan"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2B5379]"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Profil Medis */}
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
                  id="diagnosis"
                  name="diagnosis"
                  type="text"
                  value={formData.diagnosis}
                  onChange={(e) => {
                    setFormData({ ...formData, diagnosis: e.target.value });
                    if (fieldErrors.diagnosis) setFieldErrors((prev) => ({ ...prev, diagnosis: "" }));
                  }}
                  placeholder="e.g. Gangguan Kecemasan Umum"
                  className={`w-full rounded-lg border px-3.5 py-2 text-sm outline-none transition focus:ring-2 ${
                    fieldErrors.diagnosis ? "border-red-500 bg-red-50/30 focus:ring-red-500/20" : "border-gray-300 bg-white focus:ring-[#2B5379]"
                  }`}
                />
                {fieldErrors.diagnosis && (
                  <p className="mt-1 text-xs font-medium text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {fieldErrors.diagnosis}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-gray-700">Obat Saat Ini</label>
                <input
                  id="medication"
                  name="medication"
                  type="text"
                  value={formData.medication}
                  onChange={(e) => setFormData({ ...formData, medication: e.target.value })}
                  placeholder="Daftar obat yang sedang dikonsumsi (jika ada)"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2B5379]"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Assessment Risiko */}
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
                id="riskLevel"
                name="riskLevel"
                value={formData.riskLevel}
                onChange={(e) => setFormData({ ...formData, riskLevel: e.target.value })}
                className="w-full rounded-lg border border-amber-300 bg-white px-3.5 py-2 text-sm font-semibold outline-none transition focus:ring-2 focus:ring-[#2B5379] cursor-pointer"
              >
                <option value="">Pilih Tingkat Risiko</option>
                {Object.entries(RISK_LEVEL_CONFIGS).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.emoji} {config.label}
                  </option>
                ))}
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
                id="riskReason"
                name="riskReason"
                rows={2}
                value={formData.riskReason}
                onChange={(e) => {
                  setFormData({ ...formData, riskReason: e.target.value });
                  if (fieldErrors.riskReason) setFieldErrors((prev) => ({ ...prev, riskReason: "" }));
                }}
                placeholder="Penjelasan latar belakang penilaian risiko..."
                className={`w-full rounded-lg border px-3.5 py-2 text-sm outline-none transition focus:ring-2 ${
                  fieldErrors.riskReason ? "border-red-500 bg-red-50/30 focus:ring-red-500/20" : "border-amber-300 bg-white focus:ring-[#2B5379]"
                }`}
              />
              {fieldErrors.riskReason && (
                <p className="mt-1 text-xs font-medium text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {fieldErrors.riskReason}
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-[#2B5379] px-5 py-2 text-xs font-bold text-white hover:bg-[#234463] transition shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {submitting ? "Menyimpan..." : "Simpan Pasien Baru"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}