"use client";

import React, { useState, useEffect } from "react";
import { X, FileText, AlertTriangle, AlertCircle, ShieldAlert, Sparkles, UserCheck } from "lucide-react";
import {
  getAllPatients,
  getPatientDetail,
  createOfficialMedicalRecord,
} from "@/lib/api/psychologist";
import type { PsychologistPatient } from "@/lib/types/psychologist";
import { getRiskConfig, RISK_LEVEL_CONFIGS, type RiskLevelKey } from "@/lib/types/psychologist";

interface CreateMedicalRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialPatientId?: string;
}

export default function CreateMedicalRecordModal({
  isOpen,
  onClose,
  onSuccess,
  initialPatientId,
}: CreateMedicalRecordModalProps) {
  const [patients, setPatients] = useState<PsychologistPatient[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    userId: "",
    patientName: "",
    sessionNumber: 1,
    consultationDate: new Date().toISOString().split("T")[0],
    psychologistName: "",
    diagnosis: "",
    currentMedication: "",
    allergies: "",
    problemSummary: "",
    therapyApproach: "",
    followUpPlan: "CONTINUE_SESSION" as "CONTINUE_SESSION" | "REFER_TO_OTHER" | "COMPLETED",
    nextSessionDate: "",
    additionalNotes: "",
    riskLevel: "low" as string,
    riskReason: "",
    followUpDate: "",
    nextSessionRecommendation: "",
  });

  useEffect(() => {
    if (!isOpen) return;

    fetchPatients();
    setError(null);
    setFieldErrors({});
  }, [isOpen]);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const data = await getAllPatients({});
      setPatients(data.patients || []);

      const defaultId = initialPatientId || (data.patients?.[0]?.id ?? "");
      if (defaultId) {
        handlePatientSelect(defaultId, data.patients || []);
      }
    } catch (err: any) {
      console.error("Gagal memuat daftar pasien:", err);
      setError("Gagal memuat daftar pasien");
    } finally {
      setLoading(false);
    }
  };

  const handlePatientSelect = async (patientId: string, patientList = patients) => {
    const selected = patientList.find((p) => p.id === patientId);
    if (!selected) return;

    if (fieldErrors.userId) {
      setFieldErrors((prev) => ({ ...prev, userId: "" }));
    }

    setFormData((prev) => ({
      ...prev,
      userId: patientId,
      patientName: selected.name,
      sessionNumber: Math.max(selected.totalSessions || 1, 1),
    }));

    try {
      const detail = await getPatientDetail(patientId);
      if (detail) {
        const latestNote = detail.sessionNotesList?.[0] || (detail as any).sessionNotes?.[0];
        const medRec = detail.diagnosis;

        setFormData((prev) => ({
          ...prev,
          diagnosis: Array.isArray(medRec) && medRec.length > 0 ? medRec.join(", ") : "",
          currentMedication: Array.isArray(detail.currentMedication) && detail.currentMedication.length > 0 ? detail.currentMedication.join(", ") : "",
          allergies: Array.isArray(detail.allergies) && detail.allergies.length > 0 ? detail.allergies.join(", ") : "",
          problemSummary: latestNote?.assessment || latestNote?.diagnosisSummary || "",
          therapyApproach: latestNote?.treatmentApproach || latestNote?.plan || "",
          riskLevel: latestNote?.riskLevel?.toLowerCase() || "low",
          riskReason: (latestNote as any)?.riskReason || "",
          additionalNotes: latestNote?.additionalNotes || "",
          nextSessionRecommendation: latestNote?.recommendation || latestNote?.nextSessionRecommendation || "",
          followUpDate: latestNote?.followUpDate ? String(latestNote.followUpDate).split("T")[0] : prev.followUpDate,
        }));
      }
    } catch (err) {
      console.error("Gagal auto-fill data pasien:", err);
    }
  };

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

    if (!formData.userId) {
      errors.userId = "Silakan pilih pasien terlebih dahulu";
    }

    if (!formData.problemSummary.trim()) {
      errors.problemSummary = "Ringkasan Masalah Utama (Bagian 2) wajib diisi";
    }

    if (!formData.therapyApproach.trim()) {
      errors.therapyApproach = "Rekomendasi Pendekatan Terapi (Bagian 3) wajib diisi";
    }

    if (!formData.riskReason.trim()) {
      errors.riskReason = "Alasan Penilaian Risiko (Bagian 8) wajib diisi";
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
    setError(null);

    try {
      await createOfficialMedicalRecord({
        userId: formData.userId,
        sessionNumber: Number(formData.sessionNumber),
        consultationDate: formData.consultationDate,
        diagnosis: formData.diagnosis,
        currentMedication: formData.currentMedication,
        allergies: formData.allergies,
        problemSummary: formData.problemSummary,
        therapyApproach: formData.therapyApproach,
        followUpPlan: formData.followUpPlan,
        nextSessionDate: formData.nextSessionDate || undefined,
        additionalNotes: formData.additionalNotes,
        riskLevel: formData.riskLevel.toUpperCase(),
        riskReason: formData.riskReason,
        followUpDate: formData.followUpDate || undefined,
        nextSessionRecommendation: formData.nextSessionRecommendation,
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Gagal membuat Rekam Medis:", err);
      setError(err.message || "Gagal membuat Rekam Medis Resmi");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const selectedRiskConfig = getRiskConfig(formData.riskLevel as RiskLevelKey);
  const errorCount = Object.keys(fieldErrors).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-poppins text-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-fadeIn">
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#1F415F] text-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl">
              <FileText className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-bold">Buat Rekam Medis (Format Client)</h3>
              <p className="text-[11px] text-slate-200">Formulir Rekam Medis Standar Biro Psikologi Oase Jiwa</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form noValidate onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Top Error Summary Banner */}
          {errorCount > 0 && (
            <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-xs">
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

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 font-medium">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* BAGIAN 1: INFORMASI PASIEN & KONSULTASI */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
            <h4 className="font-bold text-[#1F415F] text-xs uppercase tracking-wider flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#2B5379]" />
              <span>Bagian 1: Informasi Pasien & Konsultasi</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Pilih Pasien *</label>
                <select
                  id="userId"
                  name="userId"
                  value={formData.userId}
                  onChange={(e) => handlePatientSelect(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border bg-white font-medium outline-none transition focus:ring-2 ${
                    fieldErrors.userId ? "border-red-500 bg-red-50/30 focus:ring-red-500/20" : "border-slate-300 focus:ring-[#1F415F]"
                  }`}
                >
                  <option value="">-- Pilih Pasien --</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.email})
                    </option>
                  ))}
                </select>
                {fieldErrors.userId && (
                  <p className="mt-1 text-xs font-medium text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {fieldErrors.userId}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nomor Sesi Konsultasi *</label>
                <input
                  id="sessionNumber"
                  name="sessionNumber"
                  type="number"
                  min={1}
                  value={formData.sessionNumber}
                  onChange={(e) => setFormData({ ...formData, sessionNumber: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-[#1F415F] outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Tanggal Konsultasi *</label>
                <input
                  id="consultationDate"
                  name="consultationDate"
                  type="date"
                  value={formData.consultationDate}
                  onChange={(e) => setFormData({ ...formData, consultationDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-[#1F415F] outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Diagnosis</label>
                <input
                  id="diagnosis"
                  name="diagnosis"
                  type="text"
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-[#1F415F] outline-none"
                  placeholder="Misal: Gangguan Kecemasan Umum (GAD)"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Obat Saat Ini</label>
                <input
                  id="currentMedication"
                  name="currentMedication"
                  type="text"
                  value={formData.currentMedication}
                  onChange={(e) => setFormData({ ...formData, currentMedication: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-[#1F415F] outline-none"
                  placeholder="Misal: Sertraline 50mg"
                />
              </div>
            </div>
          </div>

          {/* BAGIAN 2: RINGKASAN MASALAH UTAMA */}
          <div className="space-y-1.5">
            <label className="block text-[#1F415F] font-bold">Bagian 2: Ringkasan Masalah Utama *</label>
            <textarea
              id="problemSummary"
              name="problemSummary"
              rows={3}
              value={formData.problemSummary}
              onChange={(e) => {
                setFormData({ ...formData, problemSummary: e.target.value });
                if (fieldErrors.problemSummary) setFieldErrors((prev) => ({ ...prev, problemSummary: "" }));
              }}
              className={`w-full p-3.5 rounded-2xl border bg-white font-medium outline-none transition focus:ring-2 ${
                fieldErrors.problemSummary ? "border-red-500 bg-red-50/30 focus:ring-red-500/20" : "border-slate-300 focus:ring-[#1F415F]"
              }`}
              placeholder="Jelaskan ringkasan keluhan utama dan kondisi psikologis pasien..."
            />
            {fieldErrors.problemSummary && (
              <p className="mt-1 text-xs font-medium text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {fieldErrors.problemSummary}
              </p>
            )}
          </div>

          {/* BAGIAN 3: REKOMENDASI PENDEKATAN TERAPI */}
          <div className="space-y-1.5">
            <label className="block text-[#1F415F] font-bold">Bagian 3: Rekomendasi Pendekatan Terapi *</label>
            <textarea
              id="therapyApproach"
              name="therapyApproach"
              rows={3}
              value={formData.therapyApproach}
              onChange={(e) => {
                setFormData({ ...formData, therapyApproach: e.target.value });
                if (fieldErrors.therapyApproach) setFieldErrors((prev) => ({ ...prev, therapyApproach: "" }));
              }}
              className={`w-full p-3.5 rounded-2xl border bg-white font-medium outline-none transition focus:ring-2 ${
                fieldErrors.therapyApproach ? "border-red-500 bg-red-50/30 focus:ring-red-500/20" : "border-slate-300 focus:ring-[#1F415F]"
              }`}
              placeholder="Jelaskan teknik intervensi, CBT, psicoeducation, relaksasi..."
            />
            {fieldErrors.therapyApproach && (
              <p className="mt-1 text-xs font-medium text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {fieldErrors.therapyApproach}
              </p>
            )}
          </div>

          {/* BAGIAN 4: RENCANA TINDAK LANJUT */}
          <div className="space-y-2 p-4 bg-blue-50/50 rounded-2xl border border-blue-200">
            <label className="block text-[#1F415F] font-bold">Bagian 4: Rencana Tindak Lanjut *</label>
            <div className="flex flex-wrap gap-6 pt-1">
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                <input
                  type="radio"
                  name="followUpPlan"
                  value="CONTINUE_SESSION"
                  checked={formData.followUpPlan === "CONTINUE_SESSION"}
                  onChange={() => setFormData({ ...formData, followUpPlan: "CONTINUE_SESSION" })}
                  className="w-4 h-4 text-[#1F415F]"
                />
                <span>Lanjutan Sesi</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                <input
                  type="radio"
                  name="followUpPlan"
                  value="REFER_TO_OTHER"
                  checked={formData.followUpPlan === "REFER_TO_OTHER"}
                  onChange={() => setFormData({ ...formData, followUpPlan: "REFER_TO_OTHER" })}
                  className="w-4 h-4 text-[#1F415F]"
                />
                <span>Rujukan ke Profesional Lain</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                <input
                  type="radio"
                  name="followUpPlan"
                  value="COMPLETED"
                  checked={formData.followUpPlan === "COMPLETED"}
                  onChange={() => setFormData({ ...formData, followUpPlan: "COMPLETED" })}
                  className="w-4 h-4 text-[#1F415F]"
                />
                <span>Selesai</span>
              </label>
            </div>
          </div>

          {/* BAGIAN 6 & 7: TANGGAL SESI LANJUTAN & CATATAN TAMBAHAN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#1F415F] font-bold mb-1">Bagian 6: Tanggal Sesi Lanjutan</label>
              <input
                id="nextSessionDate"
                name="nextSessionDate"
                type="date"
                value={formData.nextSessionDate}
                onChange={(e) => setFormData({ ...formData, nextSessionDate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-[#1F415F] outline-none"
              />
            </div>

            <div>
              <label className="block text-[#1F415F] font-bold mb-1">Bagian 9: Tanggal Follow-up</label>
              <input
                id="followUpDate"
                name="followUpDate"
                type="date"
                value={formData.followUpDate}
                onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-[#1F415F] outline-none"
              />
            </div>
          </div>

          {/* BAGIAN 7: CATATAN TAMBAHAN */}
          <div className="space-y-1.5">
            <label className="block text-[#1F415F] font-bold">Bagian 7: Catatan Tambahan (jika ada)</label>
            <textarea
              id="additionalNotes"
              name="additionalNotes"
              rows={2}
              value={formData.additionalNotes}
              onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
              className="w-full p-3.5 rounded-2xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-[#1F415F] outline-none"
              placeholder="Catatan khusus atau instruksi tambahan untuk dokumen rekam medis..."
            />
          </div>

          {/* BAGIAN 8: ASSESSMENT TINGKAT RISIKO */}
          <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-200 space-y-4">
            <h4 className="font-bold text-amber-900 text-xs uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Bagian 8: Assessment Tingkat Risiko Pasien</span>
            </h4>

            <div>
              <label className="block text-slate-800 font-semibold mb-1">Tingkat Risiko *</label>
              <select
                id="riskLevel"
                name="riskLevel"
                value={formData.riskLevel}
                onChange={(e) => setFormData({ ...formData, riskLevel: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 bg-white font-bold text-slate-800 focus:ring-2 focus:ring-amber-500 outline-none"
              >
                <option value="">Pilih Tingkat Risiko</option>
                {Object.entries(RISK_LEVEL_CONFIGS).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.emoji} {config.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="p-3 bg-white rounded-xl border border-amber-200 space-y-2">
              <div className="text-xs font-semibold text-slate-700">
                <strong>Deskripsi Risiko Otomatis:</strong> {selectedRiskConfig.description}
              </div>
              <div className="text-xs text-slate-700">
                <strong>Rekomendasi Penanganan:</strong>
                <ul className="list-disc pl-5 mt-1 space-y-0.5">
                  {selectedRiskConfig.recommendations.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <label className="block text-slate-800 font-semibold mb-1">Alasan Penilaian Risiko *</label>
              <textarea
                id="riskReason"
                name="riskReason"
                rows={2}
                value={formData.riskReason}
                onChange={(e) => {
                  setFormData({ ...formData, riskReason: e.target.value });
                  if (fieldErrors.riskReason) setFieldErrors((prev) => ({ ...prev, riskReason: "" }));
                }}
                className={`w-full p-3.5 rounded-xl border bg-white font-medium outline-none transition focus:ring-2 ${
                  fieldErrors.riskReason ? "border-red-500 bg-red-50/30 focus:ring-red-500/20" : "border-amber-300 focus:ring-amber-500"
                }`}
                placeholder="Alasan mengapa pasien dikategorikan dalam tingkat risiko ini..."
              />
              {fieldErrors.riskReason && (
                <p className="mt-1 text-xs font-medium text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {fieldErrors.riskReason}
                </p>
              )}
            </div>
          </div>

          {/* BAGIAN 10: REKOMENDASI SESI BERIKUTNYA */}
          <div className="space-y-1.5">
            <label className="block text-[#1F415F] font-bold">Bagian 10: Rekomendasi Sesi Berikutnya</label>
            <textarea
              id="nextSessionRecommendation"
              name="nextSessionRecommendation"
              rows={2}
              value={formData.nextSessionRecommendation}
              onChange={(e) => setFormData({ ...formData, nextSessionRecommendation: e.target.value })}
              className="w-full p-3.5 rounded-2xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-[#1F415F] outline-none"
              placeholder="Fokus atau topik khusus untuk sesi konsultasi berikutnya..."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#1F415F] hover:bg-[#163047] text-white font-bold rounded-xl shadow-md transition cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <span>Menyimpan & Membuat Rekam Medis...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Simpan & Generate Rekam Medis</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
