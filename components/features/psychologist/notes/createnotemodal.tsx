"use client";

import { X, AlertCircle, AlertTriangle, ShieldAlert } from "lucide-react";
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
  const [referralText, setReferralText] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    patientId: "",
    patientName: "",
    scheduleId: "",
    diagnosis: "",
    medication: "",
    allergies: "",
    subjective: "",
    objective: "",
    assessment: "",
    plan: "",
    riskLevel: "low" as string,
    riskReason: "",
    assessingPsychologistName: "",
    assessmentDate: new Date().toISOString().split("T")[0],
    diagnosisSummary: "",
    treatmentApproach: "",
    recommendation: "",
    followUpPlan: "CONTINUE_SESSION" as "CONTINUE_SESSION" | "REFER_TO_OTHER" | "COMPLETED",
    additionalNotes: "",
    followUpDate: "",
    nextSessionRecommendation: "",
    tags: [] as string[],
  });

  useEffect(() => {
    if (!isOpen) return;

    fetchPatients();
    setError(null);
    setFieldErrors({});
    setPatientSessions([]);

    if (editNote) {
      const resolvedPatientId =
        editNote.patientId ||
        (editNote as any).userId ||
        (editNote as any).user?.id ||
        "";

      const resolvedPatientName =
        editNote.patientName ||
        (editNote as any).user?.userProfile?.fullName ||
        (editNote as any).user?.name ||
        "";

      const initialTags = editNote.tags || [];
      const initialReferral = Array.isArray(initialTags)
        ? initialTags.join(", ")
        : String(initialTags || "");

      setReferralText(initialReferral);

      const initDiag = editNote.diagnosis || editNote.diagnosisSummary || "";
      const initMed = editNote.medication || editNote.currentMedication || (Array.isArray((editNote as any).currentMedication) ? ((editNote as any).currentMedication as string[]).join(", ") : "");

      setFormData({
        patientId: resolvedPatientId,
        patientName: resolvedPatientName,
        scheduleId: editNote.scheduleId || "",
        diagnosis: initDiag,
        medication: initMed,
        allergies: "",
        subjective: editNote.subjective || "",
        objective: editNote.objective || "",
        assessment: editNote.assessment || "",
        plan: editNote.plan || "",
        riskLevel: editNote.riskLevel || "",
        riskReason: editNote.riskReason || "",
        assessingPsychologistName: editNote.assessingPsychologistName || "",
        assessmentDate: editNote.assessmentDate || new Date().toISOString().split("T")[0],
        diagnosisSummary: initDiag,
        treatmentApproach: editNote.treatmentApproach || editNote.plan || "",
        recommendation: editNote.recommendation || editNote.nextSessionRecommendation || "",
        followUpPlan: editNote.followUpPlan || "CONTINUE_SESSION",
        additionalNotes: editNote.additionalNotes || "",
        followUpDate: editNote.followUpDate || "",
        nextSessionRecommendation: editNote.nextSessionRecommendation || "",
        tags: initialReferral ? [initialReferral] : [],
      });
    } else {
      setReferralText("");
      setFormData({
        patientId: "",
        patientName: "",
        scheduleId: "",
        diagnosis: "",
        medication: "",
        allergies: "",
        subjective: "",
        objective: "",
        assessment: "",
        plan: "",
        riskLevel: "",
        riskReason: "",
        assessingPsychologistName: "",
        assessmentDate: new Date().toISOString().split("T")[0],
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
  }, [isOpen, editNote]);

  const scrollToField = (fieldId: string) => {
    const el = document.getElementById(fieldId) || document.querySelector(`[name="${fieldId}"]`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      if ("focus" in el && typeof el.focus === "function") {
        (el as HTMLElement).focus();
      }
    }
  };

  const formatDate = (date?: string | Date | null) => {
    if (!date) return "-";
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
    if (fieldErrors.patientId) {
      setFieldErrors((prev) => ({ ...prev, patientId: "" }));
    }
    setFormData((prev) => ({
      ...prev,
      patientId,
      patientName: patient?.name || "",
      scheduleId: "",
    }));
    fetchPatientSessions(patientId);
  };

  const selectableSessions = patientSessions;

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!editNote && !formData.patientId) {
      errors.patientId = "Pilih Pasien terlebih dahulu";
    }

    if (!editNote && !formData.scheduleId && selectableSessions.length > 0) {
      errors.scheduleId = "Pilih Sesi Terkait untuk catatan ini";
    }

    if (!formData.diagnosis.trim()) {
      errors.diagnosis = "Diagnosis wajib diisi.";
    }

    if (!formData.medication.trim()) {
      errors.medication = "Obat saat ini wajib diisi.";
    }

    if (!formData.subjective.trim()) {
      errors.subjective = "Keluhan Utama (Subjective) wajib diisi";
    }

    if (!formData.objective.trim()) {
      errors.objective = "Observasi Psikolog (Objective) wajib diisi";
    }

    if (!formData.assessment.trim()) {
      errors.assessment = "Assessment & Analisis Psikologis wajib diisi";
    }

    if (!formData.plan.trim()) {
      errors.plan = "Intervensi & Rencana Treatment (Plan) wajib diisi";
    }

    if (!formData.riskLevel) {
      errors.riskLevel = "Tingkat Risiko wajib dipilih";
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
    setError(null);

    const activeConfig = getRiskConfig(formData.riskLevel);
    const trimmedDiag = formData.diagnosis.trim();
    const trimmedMed = formData.medication.trim();

    try {
      if (formData.patientId) {
        try {
          await updatePatientMedicalInfo(formData.patientId, {
            diagnosis: trimmedDiag ? [trimmedDiag] : undefined,
            currentMedication: trimmedMed ? [trimmedMed] : undefined,
            allergies: formData.allergies ? [formData.allergies] : undefined,
          });
        } catch (mErr) {
          console.warn("Could not update medical info via API, continuing:", mErr);
        }
      }

      if (editNote && editNote.id && String(editNote.id).trim() !== "") {
        await updateNote(editNote.id, {
          diagnosis: trimmedDiag,
          medication: trimmedMed,
          diagnosisSummary: trimmedDiag,
          subjective: formData.subjective,
          objective: formData.objective,
          assessment: formData.assessment,
          plan: formData.plan,
          riskLevel: formData.riskLevel,
          riskReason: formData.riskReason,
          riskRecommendations: activeConfig.recommendations,
          assessingPsychologistName: formData.assessingPsychologistName,
          assessmentDate: formData.assessmentDate,
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
          diagnosis: trimmedDiag,
          medication: trimmedMed,
          diagnosisSummary: trimmedDiag,
          subjective: formData.subjective,
          objective: formData.objective,
          assessment: formData.assessment,
          plan: formData.plan,
          riskLevel: formData.riskLevel,
          riskReason: formData.riskReason,
          riskRecommendations: activeConfig.recommendations,
          assessingPsychologistName: formData.assessingPsychologistName,
          assessmentDate: formData.assessmentDate,
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
    } catch (err: any) {
      console.error("Failed to save note:", err);
      setError(err.message || "Gagal menyimpan catatan konseling.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const selectedRiskConfig = getRiskConfig(formData.riskLevel as RiskLevelKey);
  const errorCount = Object.keys(fieldErrors).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white p-6 shadow-xs">
          <div>
            <h2 className="text-xl font-bold text-[#2B5379]">
              {editNote ? "Edit Catatan Konseling & Rekam Medis" : "Tambah Catatan Sesi Konseling & Rekam Medis"}
            </h2>
            <p className="mt-0.5 text-xs text-gray-500">
              Isi data evaluasi SOAP, diagnosis, dan assessment tingkat risiko pasien.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 transition-colors hover:bg-gray-100 cursor-pointer"
            type="button"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <form noValidate onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Top Error Summary Banner */}
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

          {error && (
            <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
              <p>{error}</p>
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Pasien <span className="text-red-500">*</span>
            </label>

            <select
              id="patientId"
              name="patientId"
              value={formData.patientId}
              onChange={(e) => handlePatientChange(e.target.value)}
              disabled={loading || !!editNote}
              className={`w-full rounded-lg border px-4 py-2 text-sm outline-none transition focus:ring-2 ${
                fieldErrors.patientId ? "border-red-500 bg-red-50/30 focus:ring-red-500/20" : "border-gray-300 focus:ring-[#2B5379]"
              }`}
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

            {fieldErrors.patientId && (
              <p className="mt-1 text-xs font-medium text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {fieldErrors.patientId}
              </p>
            )}
          </div>

          {!editNote && (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Sesi Terkait <span className="text-red-500">*</span>
              </label>

              <select
                id="scheduleId"
                name="scheduleId"
                value={formData.scheduleId}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    scheduleId: e.target.value,
                  }));
                  if (fieldErrors.scheduleId) setFieldErrors((prev) => ({ ...prev, scheduleId: "" }));
                }}
                disabled={
                  !formData.patientId ||
                  loadingSessions ||
                  selectableSessions.length === 0
                }
                className={`w-full rounded-lg border px-4 py-2 text-sm outline-none transition focus:ring-2 disabled:bg-gray-100 ${
                  fieldErrors.scheduleId ? "border-red-500 bg-red-50/30 focus:ring-red-500/20" : "border-gray-300 focus:ring-[#2B5379]"
                }`}
              >
                <option value="">
                  {!formData.patientId
                    ? "Pilih pasien terlebih dahulu"
                    : loadingSessions
                      ? "Memuat sesi..."
                      : selectableSessions.length === 0
                        ? "Sesi 1 (Akan Dibuat)"
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

              {fieldErrors.scheduleId && (
                <p className="mt-1 text-xs font-medium text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {fieldErrors.scheduleId}
                </p>
              )}
            </div>
          )}

          {/* Informasi Medis & Diagnosis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-xl border border-gray-200 bg-gray-50/70 p-4">
            <div>
              <label className="mb-1 block text-xs font-bold text-gray-700">
                Diagnosis Pasien <span className="text-red-500">*</span>
              </label>
              <input
                id="diagnosis"
                name="diagnosis"
                type="text"
                value={formData.diagnosis}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, diagnosis: e.target.value }));
                  if (fieldErrors.diagnosis) setFieldErrors((prev) => ({ ...prev, diagnosis: "" }));
                }}
                placeholder="Contoh: Gangguan Kecemasan Umum"
                className={`w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none transition focus:ring-2 ${
                  fieldErrors.diagnosis ? "border-red-500 bg-red-50/30 focus:ring-red-500/20" : "border-gray-300 focus:ring-[#2B5379]"
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
              <label className="mb-1 block text-xs font-bold text-gray-700">
                Obat Saat Ini <span className="text-red-500">*</span>
              </label>
              <input
                id="medication"
                name="medication"
                type="text"
                value={formData.medication}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, medication: e.target.value }));
                  if (fieldErrors.medication) setFieldErrors((prev) => ({ ...prev, medication: "" }));
                }}
                placeholder="Contoh: Sertraline 50 mg (atau 'Tidak ada')"
                className={`w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none transition focus:ring-2 ${
                  fieldErrors.medication ? "border-red-500 bg-red-50/30 focus:ring-red-500/20" : "border-gray-300 focus:ring-[#2B5379]"
                }`}
              />
              {fieldErrors.medication && (
                <p className="mt-1 text-xs font-medium text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {fieldErrors.medication}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#2B5379] uppercase tracking-wide">
              Catatan SOAP & Detail Rekam Medis
            </h3>

            <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4">
              <div className="mb-1 flex items-center justify-between">
                <label className="text-sm font-bold text-[#2B5379]">
                  Keluhan Utama (Subjective) <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] font-medium text-slate-500">
                  {formData.subjective.length} / 20.000 karakter
                </span>
              </div>
              <textarea
                id="subjective"
                name="subjective"
                maxLength={20000}
                value={formData.subjective}
                onChange={(e) => {
                  const val = e.target.value.slice(0, 20000);
                  setFormData((prev) => ({ ...prev, subjective: val }));
                  if (fieldErrors.subjective) setFieldErrors((prev) => ({ ...prev, subjective: "" }));
                }}
                rows={3}
                placeholder="Keluhan, perasaan, atau masalah yang disampaikan pasien..."
                className={`w-full rounded-lg border px-4 py-2 text-sm outline-none transition focus:ring-2 ${
                  fieldErrors.subjective ? "border-red-500 bg-red-50/30 focus:ring-red-500/20" : "border-blue-300 bg-white focus:ring-[#2B5379]"
                }`}
              />
              {fieldErrors.subjective && (
                <p className="mt-1 text-xs font-medium text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {fieldErrors.subjective}
                </p>
              )}
            </div>

            <div className="rounded-lg border border-green-200 bg-green-50/50 p-4">
              <div className="mb-1 flex items-center justify-between">
                <label className="text-sm font-bold text-[#2B5379]">
                  Observasi Psikolog (Objective) <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] font-medium text-slate-500">
                  {formData.objective.length} / 20.000 karakter
                </span>
              </div>
              <textarea
                id="objective"
                name="objective"
                maxLength={20000}
                value={formData.objective}
                onChange={(e) => {
                  const val = e.target.value.slice(0, 20000);
                  setFormData((prev) => ({ ...prev, objective: val }));
                  if (fieldErrors.objective) setFieldErrors((prev) => ({ ...prev, objective: "" }));
                }}
                rows={3}
                placeholder="Observasi objektif: afek, kontak mata, ekspresi, gestur..."
                className={`w-full rounded-lg border px-4 py-2 text-sm outline-none transition focus:ring-2 ${
                  fieldErrors.objective ? "border-red-500 bg-red-50/30 focus:ring-red-500/20" : "border-green-300 bg-white focus:ring-[#2B5379]"
                }`}
              />
              {fieldErrors.objective && (
                <p className="mt-1 text-xs font-medium text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {fieldErrors.objective}
                </p>
              )}
            </div>

            <div className="rounded-lg border border-yellow-200 bg-yellow-50/50 p-4">
              <div className="mb-1 flex items-center justify-between">
                <label className="text-sm font-bold text-[#2B5379]">
                  Assessment & Analisis <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] font-medium text-slate-500">
                  {formData.assessment.length} / 20.000 karakter
                </span>
              </div>
              <textarea
                id="assessment"
                name="assessment"
                maxLength={20000}
                value={formData.assessment}
                onChange={(e) => {
                  const val = e.target.value.slice(0, 20000);
                  setFormData((prev) => ({ ...prev, assessment: val }));
                  if (fieldErrors.assessment) setFieldErrors((prev) => ({ ...prev, assessment: "" }));
                }}
                rows={3}
                placeholder="Gejala, dinamika psikologis, dan analisis kondisi pasien..."
                className={`w-full rounded-lg border px-4 py-2 text-sm outline-none transition focus:ring-2 ${
                  fieldErrors.assessment ? "border-red-500 bg-red-50/30 focus:ring-red-500/20" : "border-yellow-300 bg-white focus:ring-[#2B5379]"
                }`}
              />
              {fieldErrors.assessment && (
                <p className="mt-1 text-xs font-medium text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {fieldErrors.assessment}
                </p>
              )}
            </div>

            <div className="rounded-lg border border-purple-200 bg-purple-50/50 p-4">
              <div className="mb-1 flex items-center justify-between">
                <label className="text-sm font-bold text-[#2B5379]">
                  Intervensi & Rencana (Plan) <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] font-medium text-slate-500">
                  {formData.plan.length} / 20.000 karakter
                </span>
              </div>
              <textarea
                id="plan"
                name="plan"
                maxLength={20000}
                value={formData.plan}
                onChange={(e) => {
                  const val = e.target.value.slice(0, 20000);
                  setFormData((prev) => ({ ...prev, plan: val }));
                  if (fieldErrors.plan) setFieldErrors((prev) => ({ ...prev, plan: "" }));
                }}
                rows={3}
                placeholder="Teknik intervensi, CBT, psicoeducation, relaksasi..."
                className={`w-full rounded-lg border px-4 py-2 text-sm outline-none transition focus:ring-2 ${
                  fieldErrors.plan ? "border-red-500 bg-red-50/30 focus:ring-red-500/20" : "border-purple-300 bg-white focus:ring-[#2B5379]"
                }`}
              />
              {fieldErrors.plan && (
                <p className="mt-1 text-xs font-medium text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {fieldErrors.plan}
                </p>
              )}
            </div>
          </div>

          {/* Assessment Tingkat Risiko Pasien */}
          <div className="space-y-4 rounded-xl border border-amber-300/80 bg-amber-50/40 p-5">
            <div className="flex items-center justify-between border-b border-amber-200 pb-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <h3 className="text-sm font-bold text-[#2B5379] uppercase tracking-wide">
                  Assessment Tingkat Risiko Pasien
                </h3>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-gray-700">Tingkat Risiko *</label>
              <select
                id="riskLevel"
                name="riskLevel"
                value={formData.riskLevel}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, riskLevel: e.target.value }));
                  if (fieldErrors.riskLevel) setFieldErrors((prev) => ({ ...prev, riskLevel: "" }));
                }}
                className={`w-full rounded-lg border px-3.5 py-2 text-sm font-bold outline-none focus:ring-2 ${
                  fieldErrors.riskLevel ? "border-red-500 ring-2 ring-red-200" : "border-amber-300 focus:ring-[#2B5379]"
                }`}
              >
                <option value="">Pilih Tingkat Risiko</option>
                {Object.entries(RISK_LEVEL_CONFIGS).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.label}
                  </option>
                ))}
              </select>
              {fieldErrors.riskLevel && (
                <p className="mt-1 text-xs font-semibold text-red-500">{fieldErrors.riskLevel}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-gray-700">
                Alasan Penilaian Risiko <span className="text-red-500">*</span>
              </label>
              <textarea
                id="riskReason"
                name="riskReason"
                value={formData.riskReason}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, riskReason: e.target.value }));
                  if (fieldErrors.riskReason) setFieldErrors((prev) => ({ ...prev, riskReason: "" }));
                }}
                rows={2}
                placeholder="Alasan mengapa pasien dikategorikan dalam tingkat risiko ini..."
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

          {/* Rencana Tindak Lanjut & Rekomendasi */}
          <div className="space-y-4 rounded-xl border border-indigo-200 bg-indigo-50/30 p-5">
            <h3 className="text-sm font-bold text-[#2B5379] uppercase tracking-wide">
              Rencana Tindak Lanjut & Rekomendasi Terapi
            </h3>

            <div>
              <label className="mb-2 block text-xs font-bold text-gray-700">Rencana Tindak Lanjut</label>
              <div className="flex flex-wrap gap-4 text-xs font-semibold text-gray-700">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="followUpPlan"
                    value="CONTINUE_SESSION"
                    checked={formData.followUpPlan === "CONTINUE_SESSION"}
                    onChange={(e) => setFormData((prev) => ({ ...prev, followUpPlan: e.target.value as any }))}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span>Lanjutan Sesi</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="followUpPlan"
                    value="REFER_TO_OTHER"
                    checked={formData.followUpPlan === "REFER_TO_OTHER"}
                    onChange={(e) => setFormData((prev) => ({ ...prev, followUpPlan: e.target.value as any }))}
                    className="text-amber-600 focus:ring-amber-500"
                  />
                  <span>Rujukan Profesional Lain</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="followUpPlan"
                    value="COMPLETED"
                    checked={formData.followUpPlan === "COMPLETED"}
                    onChange={(e) => setFormData((prev) => ({ ...prev, followUpPlan: e.target.value as any }))}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Selesai</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-gray-700">Tanggal Follow Up / Sesi Lanjutan</label>
                <input
                  type="date"
                  value={formData.followUpDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, followUpDate: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2B5379]"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-gray-700">Rekomendasi Penanganan</label>
                <input
                  type="text"
                  value={formData.recommendation}
                  onChange={(e) => setFormData((prev) => ({ ...prev, recommendation: e.target.value }))}
                  placeholder="Contoh: CBT 2 minggu sekali, latihan pernapasan diafragma"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2B5379]"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-gray-700">Fokus Sesi Berikutnya</label>
              <textarea
                value={formData.nextSessionRecommendation}
                onChange={(e) => setFormData((prev) => ({ ...prev, nextSessionRecommendation: e.target.value }))}
                rows={2}
                placeholder="Fokus pembahasan atau evaluasi jurnal pada sesi berikutnya..."
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2B5379]"
              />
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-xs font-bold text-gray-700">Catatan Tambahan</label>
                <span className="text-[11px] font-medium text-slate-500">
                  {formData.additionalNotes.length} / 200 karakter
                </span>
              </div>
              <textarea
                maxLength={200}
                value={formData.additionalNotes}
                onChange={(e) => {
                  const val = e.target.value.slice(0, 200);
                  setFormData((prev) => ({ ...prev, additionalNotes: val }));
                }}
                rows={2}
                placeholder="Catatan tambahan mengenai kondisi umum pasien..."
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2B5379]"
              />
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-xs font-bold text-gray-700">Referral Rekam Medis</label>
                <span className="text-[11px] font-medium text-slate-500">
                  {referralText.length} / 150 karakter
                </span>
              </div>
              <input
                type="text"
                maxLength={150}
                value={referralText}
                onChange={(e) => {
                  const val = e.target.value.slice(0, 150);
                  setReferralText(val);
                  setFormData((prev) => ({
                    ...prev,
                    tags: val.trim() ? [val.trim()] : [],
                  }));
                }}
                placeholder="Psikiater / Dokter Umum / Rumah Sakit / Profesional lainnya..."
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2B5379]"
              />
            </div>
          </div>

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
              className="rounded-lg bg-[#2B5379] px-5 py-2 text-xs font-bold text-white hover:bg-[#234463] transition shadow-xs cursor-pointer disabled:opacity-50"
            >
              {submitting ? "Menyimpan..." : editNote ? "Simpan Perubahan" : "Simpan Catatan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}