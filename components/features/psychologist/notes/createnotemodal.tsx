"use client";

import { X, AlertCircle, AlertTriangle, CheckCircle2, ShieldAlert, Info } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getAllPatients,
  getPatientDetail,
  createNote,
  updateNote,
  updatePatientMedicalInfo,
} from "@/lib/api/psychologist";
import type {
  PsychologistPatient,
  SessionNote,
  SessionNotePayload,
  SessionSummary,
} from "@/lib/types/psychologist";
import { getRiskConfig, RISK_LEVEL_CONFIGS, type RiskLevelKey } from "@/lib/types/psychologist";

interface CreateNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editNote?: SessionNote | null;
}

export default function CreateNoteModal({
  isOpen,
  onClose,
  onSuccess,
  editNote,
}: CreateNoteModalProps) {
  const [patients, setPatients] = useState<PsychologistPatient[]>([]);
  const [patientSessions, setPatientSessions] = useState<SessionSummary[]>([]);

  const [loading, setLoading] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    patientId: "",
    patientName: "",
    scheduleId: "",
    diagnosis: "Gangguan Kecemasan Umum",
    medication: "Sertraline 50 mg (1x sehari setelah makan pagi)",
    allergies: "Tidak ada alergi yang diketahui",
    subjective: "",
    objective: "",
    assessment: "",
    plan: "",
    riskLevel: "medium" as string,
    riskReason: "Pasien menunjukkan kecemasan berlebih selama lebih dari dua minggu, mengalami gangguan tidur, dan kesulitan berkonsentrasi sehingga dikategorikan sebagai Risiko Sedang.",
    assessingPsychologistName: "Dr. Maya Putri, M.Psi., Psikolog",
    assessmentDate: "2026-07-29",
    diagnosisSummary: "",
    treatmentApproach: "",
    recommendation: "",
    followUpPlan: "CONTINUE_SESSION" as "CONTINUE_SESSION" | "REFER_TO_OTHER" | "COMPLETED",
    additionalNotes: "",
    followUpDate: "",
    nextSessionRecommendation: "",
    tags: [] as string[],
  });

  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    fetchPatients();
    setError(null);
    setPatientSessions([]);

    if (editNote) {
      setFormData({
        patientId: editNote.patientId,
        patientName: editNote.patientName,
        scheduleId: editNote.scheduleId || "",
        diagnosis: "Gangguan Kecemasan Umum",
        medication: "Sertraline 50 mg (1x sehari setelah makan pagi)",
        allergies: "Tidak ada alergi yang diketahui",
        subjective: editNote.subjective || "",
        objective: editNote.objective || "",
        assessment: editNote.assessment || "",
        plan: editNote.plan || "",
        riskLevel: editNote.riskLevel || "medium",
        riskReason: editNote.riskReason || "Pasien menunjukkan kecemasan berlebih selama lebih dari dua minggu, mengalami gangguan tidur, dan kesulitan berkonsentrasi sehingga dikategorikan sebagai Risiko Sedang.",
        assessingPsychologistName: editNote.assessingPsychologistName || "Dr. Maya Putri, M.Psi., Psikolog",
        assessmentDate: editNote.assessmentDate || "2026-07-29",
        diagnosisSummary: editNote.diagnosisSummary || editNote.subjective || "",
        treatmentApproach: editNote.treatmentApproach || editNote.plan || "",
        recommendation: editNote.recommendation || editNote.nextSessionRecommendation || "",
        followUpPlan: editNote.followUpPlan || "CONTINUE_SESSION",
        additionalNotes: editNote.additionalNotes || "",
        followUpDate: editNote.followUpDate || "",
        nextSessionRecommendation: editNote.nextSessionRecommendation || "",
        tags: editNote.tags || [],
      });
    } else {
      setFormData({
        patientId: "",
        patientName: "",
        scheduleId: "",
        diagnosis: "Gangguan Kecemasan Umum",
        medication: "Sertraline 50 mg (1x sehari setelah makan pagi)",
        allergies: "Tidak ada alergi yang diketahui",
        subjective: "",
        objective: "",
        assessment: "",
        plan: "",
        riskLevel: "medium",
        riskReason: "Pasien menunjukkan kecemasan berlebih selama lebih dari dua minggu, mengalami gangguan tidur, dan kesulitan berkonsentrasi sehingga dikategorikan sebagai Risiko Sedang.",
        assessingPsychologistName: "Dr. Maya Putri, M.Psi., Psikolog",
        assessmentDate: "2026-07-29",
        diagnosisSummary: "",
        treatmentApproach: "",
        recommendation: "",
        followUpPlan: "CONTINUE_SESSION",
        additionalNotes: "",
        followUpDate: "",
        nextSessionRecommendation: "",
        tags: [],
      });
    }

    setTagInput("");
  }, [isOpen, editNote]);

  const formatDate = (date?: string | Date | null) => {
    if (!date) return "-";

    const rawDate = String(date);

    if (/^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
      const [year, month, day] = rawDate.split("-").map(Number);

      return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(new Date(year, month - 1, day));
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "-";

    return parsedDate.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusLabel = (status?: string) => {
    if (status === "completed") return "Selesai";
    if (status === "cancelled") return "Dibatalkan";
    return "Terjadwal";
  };

  const fetchPatients = async () => {
    setLoading(true);

    try {
      const data = await getAllPatients({});

      const normalizedPatients = data.patients.map((patient) => ({
        ...patient,
        id: String(patient.id),
      }));

      setPatients(normalizedPatients);
    } catch (error) {
      console.error("Failed to fetch patients:", error);
      setPatients([]);
      setError("Gagal memuat daftar pasien.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientSessions = async (patientId: string) => {
    if (!patientId) {
      setPatientSessions([]);
      return;
    }

    setLoadingSessions(true);
    setError(null);

    try {
      const detail = await getPatientDetail(patientId);

      const sessions = (detail?.sessionHistory || []).filter(
        (session) => session.status !== "cancelled"
      );

      setPatientSessions(sessions);
    } catch (error) {
      console.error("Failed to fetch patient sessions:", error);
      setPatientSessions([]);
      setError("Gagal memuat riwayat sesi pasien.");
    } finally {
      setLoadingSessions(false);
    }
  };

  const handlePatientChange = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId);

    setFormData((prev) => ({
      ...prev,
      patientId,
      patientName: patient?.name || "",
      scheduleId: "",
    }));

    fetchPatientSessions(patientId);
  };

  const handleAddTag = () => {
    const cleanedTag = tagInput.trim();

    if (!cleanedTag || formData.tags.includes(cleanedTag)) return;

    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, cleanedTag],
    }));

    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const validateForm = () => {
    if (!formData.patientId && !editNote) {
      return "Pilih pasien terlebih dahulu";
    }

    if (!formData.scheduleId && !editNote) {
      return "Pilih sesi terkait terlebih dahulu";
    }

    if (
      !formData.subjective.trim() ||
      !formData.objective.trim() ||
      !formData.assessment.trim() ||
      !formData.plan.trim()
    ) {
      return "Semua field SOAP (Keluhan, Observasi, Assessment, Intervensi) wajib diisi";
    }

    if (!formData.riskReason || !formData.riskReason.trim()) {
      return "Alasan Penilaian Risiko wajib diisi terlebih dahulu";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError(null);

    const activeConfig = getRiskConfig(formData.riskLevel);

    try {
      if (formData.patientId) {
        try {
          await updatePatientMedicalInfo(formData.patientId, {
            diagnosis: formData.diagnosis ? [formData.diagnosis] : undefined,
            currentMedication: formData.medication ? [formData.medication] : undefined,
            allergies: formData.allergies ? [formData.allergies] : undefined,
          });
        } catch (mErr) {
          console.warn("Could not update medical info via API, continuing:", mErr);
        }
      }

      if (editNote) {
        await updateNote(editNote.id, {
          subjective: formData.subjective,
          objective: formData.objective,
          assessment: formData.assessment,
          plan: formData.plan,
          riskLevel: formData.riskLevel,
          riskReason: formData.riskReason,
          riskRecommendations: activeConfig.recommendations,
          assessingPsychologistName: formData.assessingPsychologistName,
          assessmentDate: formData.assessmentDate,
          diagnosisSummary: formData.diagnosisSummary || formData.subjective,
          treatmentApproach: formData.treatmentApproach || formData.plan,
          recommendation: formData.recommendation || formData.nextSessionRecommendation,
          followUpPlan: formData.followUpPlan,
          additionalNotes: formData.additionalNotes,
          followUpDate: formData.followUpDate || undefined,
          nextSessionRecommendation:
            formData.nextSessionRecommendation || undefined,
          tags: formData.tags,
        });
      } else {
        const payload: SessionNotePayload = {
          userId: formData.patientId,
          scheduleId: formData.scheduleId,
          subjective: formData.subjective,
          objective: formData.objective,
          assessment: formData.assessment,
          plan: formData.plan,
          riskLevel: formData.riskLevel,
          riskReason: formData.riskReason,
          riskRecommendations: activeConfig.recommendations,
          assessingPsychologistName: formData.assessingPsychologistName,
          assessmentDate: formData.assessmentDate,
          diagnosisSummary: formData.diagnosisSummary || formData.subjective,
          treatmentApproach: formData.treatmentApproach || formData.plan,
          recommendation: formData.recommendation || formData.nextSessionRecommendation,
          followUpPlan: formData.followUpPlan,
          additionalNotes: formData.additionalNotes,
          followUpDate: formData.followUpDate || undefined,
          nextSessionRecommendation:
            formData.nextSessionRecommendation || undefined,
          tags: formData.tags,
        };

        await createNote(payload);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to save note:", error);
      setError("Gagal menyimpan catatan. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const selectableSessions = patientSessions.filter(
    (session) => session.scheduleId && !session.hasNotes
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white p-6">
          <div>
            <h2 className="text-xl font-semibold text-[#2B5379]">
              {editNote ? "Edit Catatan" : "Buat Catatan Baru"}
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Format SOAP: Subjective, Objective, Assessment, Plan
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 transition-colors hover:bg-gray-100"
            type="button"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {error && (
            <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Pasien <span className="text-red-500">*</span>
            </label>

            <select
              value={formData.patientId}
              onChange={(e) => handlePatientChange(e.target.value)}
              disabled={loading || !!editNote}
              required={!editNote}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-[#2B5379]"
            >
              <option value="">
                {loading ? "Memuat pasien..." : "Pilih Pasien"}
              </option>

              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name}
                  {patient.email ? ` (${patient.email})` : ""}
                </option>
              ))}
            </select>

            {editNote && (
              <p className="mt-1 text-xs text-gray-500">
                Pasien tidak bisa diubah saat edit catatan.
              </p>
            )}
          </div>

          {!editNote && (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Sesi Terkait <span className="text-red-500">*</span>
              </label>

              <select
                value={formData.scheduleId}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    scheduleId: e.target.value,
                  }))
                }
                disabled={
                  !formData.patientId ||
                  loadingSessions ||
                  selectableSessions.length === 0
                }
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-[#2B5379] disabled:bg-gray-100"
              >
                <option value="">
                  {!formData.patientId
                    ? "Pilih pasien terlebih dahulu"
                    : loadingSessions
                      ? "Memuat sesi..."
                      : selectableSessions.length === 0
                        ? "Tidak ada sesi yang bisa dibuatkan catatan"
                        : "Pilih sesi"}
                </option>

                {selectableSessions.map((session) => (
                  <option
                    key={session.id}
                    value={session.scheduleId || ""}
                  >
                    {formatDate(session.date)} • {session.time || "-"} •{" "}
                    {session.service || "Konseling"} •{" "}
                    {getStatusLabel(session.status)}
                  </option>
                ))}
              </select>

              <p className="mt-1 text-xs text-gray-500">
                Catatan akan ditempelkan ke sesi yang dipilih agar tanggal dan
                waktu sesi bisa tampil di riwayat.
              </p>
            </div>
          )}

          {/* Informasi Medis & Diagnosis */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-xl border border-gray-200 bg-gray-50/70 p-4">
            <div>
              <label className="mb-1 block text-xs font-bold text-gray-700">
                Diagnosis Pasien
              </label>
              <input
                type="text"
                value={formData.diagnosis}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, diagnosis: e.target.value }))
                }
                placeholder="Contoh: Gangguan Kecemasan Umum"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2B5379]"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-gray-700">
                Obat Saat Ini
              </label>
              <input
                type="text"
                value={formData.medication}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, medication: e.target.value }))
                }
                placeholder="Contoh: Sertraline 50 mg (1x sehari)"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2B5379]"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-gray-700">
                Alergi
              </label>
              <input
                type="text"
                value={formData.allergies}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, allergies: e.target.value }))
                }
                placeholder="Contoh: Tidak ada alergi yang diketahui"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2B5379]"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#2B5379]">
              Catatan SOAP & Detail Rekam Medis
            </h3>

            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <label className="mb-2 block text-sm font-bold text-[#2B5379]">
                Keluhan Utama (Subjective) <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.subjective}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    subjective: e.target.value,
                  }))
                }
                rows={4}
                required
                placeholder="Keluhan, perasaan, cerita, atau pengalaman yang disampaikan pasien..."
                className="w-full rounded-lg border border-blue-300 bg-white px-4 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-[#2B5379]"
              />
            </div>

            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <label className="mb-2 block text-sm font-bold text-[#2B5379]">
                Observasi Psikolog (Objective) <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.objective}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    objective: e.target.value,
                  }))
                }
                rows={4}
                required
                placeholder="Observasi objektif: ekspresi, kontak mata, bahasa tubuh, perilaku..."
                className="w-full rounded-lg border border-green-300 bg-white px-4 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-[#2B5379]"
              />
            </div>

            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <label className="mb-2 block text-sm font-bold text-[#2B5379]">
                Assessment <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.assessment}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    assessment: e.target.value,
                  }))
                }
                rows={4}
                required
                placeholder="Gejala, diagnosis, dan analisis psikologis..."
                className="w-full rounded-lg border border-yellow-300 bg-white px-4 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-[#2B5379]"
              />
            </div>

            <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
              <label className="mb-2 block text-sm font-bold text-[#2B5379]">
                Intervensi (Plan) <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.plan}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    plan: e.target.value,
                  }))
                }
                rows={4}
                required
                placeholder="Rencana treatment, psychoeducation, teknik pernapasan, latihan relaksasi..."
                className="w-full rounded-lg border border-purple-300 bg-white px-4 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-[#2B5379]"
              />
            </div>
          </div>

          {/* Section Rekam Medis (Formulir Psikolog Oase Jiwa) */}
          <div className="space-y-4 rounded-xl border border-[#2B5379]/30 bg-slate-50 p-5">
            <h3 className="text-md font-bold text-[#2B5379] uppercase tracking-wide border-b border-slate-200 pb-2">
              📋 Rekam Medis (Format Formulir Psikolog Oase Jiwa)
            </h3>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Rencana Tindak Lanjut <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-4 pt-1">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="radio"
                    name="followUpPlan"
                    value="CONTINUE_SESSION"
                    checked={formData.followUpPlan === "CONTINUE_SESSION"}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        followUpPlan: e.target.value as "CONTINUE_SESSION",
                      }))
                    }
                    className="h-4 w-4 text-[#2B5379]"
                  />
                  <span>Lanjutan Sesi</span>
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="radio"
                    name="followUpPlan"
                    value="REFER_TO_OTHER"
                    checked={formData.followUpPlan === "REFER_TO_OTHER"}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        followUpPlan: e.target.value as "REFER_TO_OTHER",
                      }))
                    }
                    className="h-4 w-4 text-[#2B5379]"
                  />
                  <span>Rujukan ke Profesional Lain</span>
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="radio"
                    name="followUpPlan"
                    value="COMPLETED"
                    checked={formData.followUpPlan === "COMPLETED"}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        followUpPlan: e.target.value as "COMPLETED",
                      }))
                    }
                    className="h-4 w-4 text-[#2B5379]"
                  />
                  <span>Selesai</span>
                </label>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Catatan Tambahan (jika ada)
              </label>
              <textarea
                value={formData.additionalNotes}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    additionalNotes: e.target.value,
                  }))
                }
                rows={2}
                placeholder="Catatan tambahan untuk dokumen rekam medis PDF..."
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-[#2B5379]"
              />
            </div>
          </div>

          {/* 🛡️ Assessment Tingkat Risiko Pasien */}
          <div className="space-y-4 rounded-xl border border-amber-300/80 bg-amber-50/40 p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-amber-200/80 pb-2.5">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <h3 className="text-md font-bold text-[#2B5379] uppercase tracking-wide">
                  Assessment Tingkat Risiko Pasien
                </h3>
              </div>
              <span className="text-xs text-amber-800 bg-amber-100 font-semibold px-2.5 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" /> Klasifikasi Risiko Klinis
              </span>
            </div>

            {/* Dropdown 5 pilihan */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Tingkat Risiko <span className="text-red-500">*</span>
                </label>
                <span className="text-xs text-gray-500 italic">
                  Pilih 1 dari 5 kategori risiko
                </span>
              </div>

              <select
                value={formData.riskLevel}
                onChange={(e) => {
                  const level = e.target.value;
                  const config = getRiskConfig(level);
                  setFormData((prev) => ({
                    ...prev,
                    riskLevel: level,
                    nextSessionRecommendation: config.recommendations.map((r) => `• ${r}`).join("\n"),
                  }));
                }}
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold outline-none focus:border-transparent focus:ring-2 focus:ring-[#2B5379]"
              >
                <option value="very_low">🟢 Sangat Rendah</option>
                <option value="low">🟢 Rendah</option>
                <option value="medium">🟡 Sedang</option>
                <option value="high">🟠 Tinggi</option>
                <option value="very_high">🔴 Sangat Tinggi</option>
              </select>
            </div>

            {/* Dynamic Badge, Deskripsi Risiko Otomatis & Rekomendasi Otomatis */}
            {(() => {
              const activeConfig = getRiskConfig(formData.riskLevel);
              return (
                <div className="space-y-3">
                  <div className="rounded-lg border border-amber-200 bg-white p-3.5 shadow-2xs">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${activeConfig.badgeClass}`}>
                        {activeConfig.emoji} {activeConfig.label}
                      </span>
                      <span className="text-xs font-semibold text-gray-600">Deskripsi Risiko Otomatis:</span>
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed font-normal">
                      {activeConfig.description}
                    </p>
                  </div>

                  <div className="rounded-lg border border-blue-200 bg-blue-50/70 p-3.5">
                    <p className="text-xs font-bold text-[#2B5379] mb-1.5 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Rekomendasi Penanganan Otomatis:
                    </p>
                    <ul className="space-y-1">
                      {activeConfig.recommendations.map((rec, rIdx) => (
                        <li key={rIdx} className="text-xs text-gray-700 font-medium flex items-start gap-1.5">
                          <span className="text-blue-600 font-bold">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })()}

            {/* Alasan Penilaian Risiko (Textarea - Mandatory) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-bold text-gray-800 flex items-center gap-1">
                  Alasan Penilaian Risiko <span className="text-red-500">*</span>
                </label>
                <span className="text-xs text-red-600 font-medium">Wajib diisi</span>
              </div>
              <textarea
                value={formData.riskReason}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    riskReason: e.target.value,
                  }))
                }
                rows={3}
                required
                placeholder="Jelaskan alasan mengapa pasien dikategorikan pada tingkat risiko tersebut..."
                className="w-full rounded-lg border border-amber-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-[#2B5379]"
              />
              <p className="mt-1 text-[11px] text-gray-500 italic">
                Contoh: Pasien menunjukkan kecemasan berlebih selama lebih dari dua minggu, mengalami gangguan tidur, dan kesulitan berkonsentrasi sehingga dikategorikan sebagai Risiko Sedang.
              </p>
            </div>
          </div>

            {/* Tanggal Follow-up */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Tanggal Follow-up
              </label>

              <input
                type="date"
                value={formData.followUpDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    followUpDate: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-[#2B5379]"
              />
            </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Rekomendasi Sesi Berikutnya
            </label>

            <textarea
              value={formData.nextSessionRecommendation}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  nextSessionRecommendation: e.target.value,
                }))
              }
              rows={2}
              placeholder="Fokus atau topik untuk sesi berikutnya..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-[#2B5379]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Tags
            </label>

            <div className="mb-2 flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Tambah tag lalu tekan Enter"
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-[#2B5379]"
              />

              <button
                type="button"
                onClick={handleAddTag}
                className="rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200"
              >
                Tambah
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 rounded-md bg-[#D1EAFF] px-3 py-1 text-sm text-[#2B5379]"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 bg-white px-6 py-2 text-gray-700 transition-colors hover:bg-gray-50"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-[#2B5379] px-6 py-2 text-white transition-colors hover:bg-[#2B5379]/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? "Menyimpan..."
                : editNote
                  ? "Update Catatan"
                  : "Simpan Catatan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}