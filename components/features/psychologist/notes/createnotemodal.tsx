"use client";

import { X, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getAllPatients,
  getPatientDetail,
  createNote,
  updateNote,
} from "@/lib/api/psychologist";
import type {
  PsychologistPatient,
  SessionNote,
  SessionNotePayload,
  SessionSummary,
} from "@/lib/types/psychologist";

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
    subjective: "",
    objective: "",
    assessment: "",
    plan: "",
    riskLevel: "low" as "low" | "medium" | "high",
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
        subjective: editNote.subjective || "",
        objective: editNote.objective || "",
        assessment: editNote.assessment || "",
        plan: editNote.plan || "",
        riskLevel: (editNote.riskLevel?.toLowerCase() || "low") as
          | "low"
          | "medium"
          | "high",
        followUpDate: editNote.followUpDate || "",
        nextSessionRecommendation: editNote.nextSessionRecommendation || "",
        tags: editNote.tags || [],
      });
    } else {
      setFormData({
        patientId: "",
        patientName: "",
        scheduleId: "",
        subjective: "",
        objective: "",
        assessment: "",
        plan: "",
        riskLevel: "low",
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
      return "Semua field SOAP wajib diisi";
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

    try {
      if (editNote) {
        await updateNote(editNote.id, {
          subjective: formData.subjective,
          objective: formData.objective,
          assessment: formData.assessment,
          plan: formData.plan,
          riskLevel: formData.riskLevel,
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

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#2B5379]">
              Catatan SOAP
            </h3>

            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <label className="mb-2 block text-sm font-bold text-[#2B5379]">
                S - SUBJECTIVE <span className="text-red-500">*</span>
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
                O - OBJECTIVE <span className="text-red-500">*</span>
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
                A - ASSESSMENT <span className="text-red-500">*</span>
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
                placeholder="Analisis psikolog, progress, clinical impression, atau kesimpulan sementara..."
                className="w-full rounded-lg border border-yellow-300 bg-white px-4 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-[#2B5379]"
              />
            </div>

            <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
              <label className="mb-2 block text-sm font-bold text-[#2B5379]">
                P - PLAN <span className="text-red-500">*</span>
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
                placeholder="Rencana treatment, latihan rumah, follow-up, atau rekomendasi..."
                className="w-full rounded-lg border border-purple-300 bg-white px-4 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-[#2B5379]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Risk Level <span className="text-red-500">*</span>
              </label>

              <select
                value={formData.riskLevel}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    riskLevel: e.target.value as "low" | "medium" | "high",
                  }))
                }
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-[#2B5379]"
              >
                <option value="low">Risiko Rendah</option>
                <option value="medium">Risiko Sedang</option>
                <option value="high">Risiko Tinggi</option>
              </select>
            </div>

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