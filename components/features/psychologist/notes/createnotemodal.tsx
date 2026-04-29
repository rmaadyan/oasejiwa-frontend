"use client";

import { X, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { getAllPatients, createNote, updateNote } from "@/lib/api/psychologist";
import type {
  PsychologistPatient,
  SessionNote,
  SessionNotePayload,
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
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    patientId: "",
    patientName: "",
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

    if (editNote) {
      setFormData({
        patientId: editNote.patientId,
        patientName: editNote.patientName,
        subjective: editNote.subjective || "",
        objective: editNote.objective || "",
        assessment: editNote.assessment || "",
        plan: editNote.plan || "",
        riskLevel: (editNote.riskLevel?.toLowerCase() || "low") as "low" | "medium" | "high",
        followUpDate: editNote.followUpDate || "",
        nextSessionRecommendation: editNote.nextSessionRecommendation || "",
        tags: editNote.tags || [],
      });
    } else {
      setFormData({
        patientId: "",
        patientName: "",
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

      // Sementara fallback untuk testing lokal.
      // Ganti id ini dengan id pasien dummy dari database kamu.
      setPatients([
        {
          id: "ISI_ID_PASIEN_DUMMY_DI_SINI",
          name: "Pasien Test",
          email: "pasien@test.com",
          firstSessionDate: "",
          totalSessions: 0,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePatientChange = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId);

    setFormData({
      ...formData,
      patientId,
      patientName: patient?.name || "",
    });
  };

  const handleAddTag = () => {
    const cleanedTag = tagInput.trim();

    if (!cleanedTag || formData.tags.includes(cleanedTag)) return;

    setFormData({
      ...formData,
      tags: [...formData.tags, cleanedTag],
    });

    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const validateForm = () => {
    if (!formData.patientId && !editNote) {
      return "Pilih pasien terlebih dahulu";
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-xl font-semibold text-[#2B5379]">
              {editNote ? "Edit Catatan" : "Buat Catatan Baru"}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Format SOAP: Subjective, Objective, Assessment, Plan
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pasien <span className="text-red-500">*</span>
            </label>

            <select
              value={formData.patientId}
              onChange={(e) => handlePatientChange(e.target.value)}
              disabled={loading || !!editNote}
              required={!editNote}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5379] focus:border-transparent outline-none"
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
              <p className="text-xs text-gray-500 mt-1">
                Pasien tidak bisa diubah saat edit catatan.
              </p>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#2B5379]">
              Catatan SOAP
            </h3>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <label className="block text-sm font-bold text-[#2B5379] mb-2">
                S - SUBJECTIVE <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.subjective}
                onChange={(e) =>
                  setFormData({ ...formData, subjective: e.target.value })
                }
                rows={4}
                required
                placeholder="Keluhan, perasaan, cerita, atau pengalaman yang disampaikan pasien..."
                className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-[#2B5379] focus:border-transparent outline-none bg-white"
              />
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <label className="block text-sm font-bold text-[#2B5379] mb-2">
                O - OBJECTIVE <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.objective}
                onChange={(e) =>
                  setFormData({ ...formData, objective: e.target.value })
                }
                rows={4}
                required
                placeholder="Observasi objektif: ekspresi, kontak mata, bahasa tubuh, perilaku..."
                className="w-full px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-[#2B5379] focus:border-transparent outline-none bg-white"
              />
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <label className="block text-sm font-bold text-[#2B5379] mb-2">
                A - ASSESSMENT <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.assessment}
                onChange={(e) =>
                  setFormData({ ...formData, assessment: e.target.value })
                }
                rows={4}
                required
                placeholder="Analisis psikolog, progress, clinical impression, atau kesimpulan sementara..."
                className="w-full px-4 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-[#2B5379] focus:border-transparent outline-none bg-white"
              />
            </div>

            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <label className="block text-sm font-bold text-[#2B5379] mb-2">
                P - PLAN <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.plan}
                onChange={(e) =>
                  setFormData({ ...formData, plan: e.target.value })
                }
                rows={4}
                required
                placeholder="Rencana treatment, latihan rumah, follow-up, atau rekomendasi..."
                className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-[#2B5379] focus:border-transparent outline-none bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Risk Level <span className="text-red-500">*</span>
              </label>

              <select
                value={formData.riskLevel}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    riskLevel: e.target.value as "low" | "medium" | "high",
                  })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5379] focus:border-transparent outline-none"
              >
                <option value="low">Risiko Rendah</option>
                <option value="medium">Risiko Sedang</option>
                <option value="high">Risiko Tinggi</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Follow-up
              </label>

              <input
                type="date"
                value={formData.followUpDate}
                onChange={(e) =>
                  setFormData({ ...formData, followUpDate: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5379] focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rekomendasi Sesi Berikutnya
            </label>

            <textarea
              value={formData.nextSessionRecommendation}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  nextSessionRecommendation: e.target.value,
                })
              }
              rows={2}
              placeholder="Fokus atau topik untuk sesi berikutnya..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5379] focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>

            <div className="flex gap-2 mb-2">
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
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5379] focus:border-transparent outline-none"
              />

              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Tambah
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#D1EAFF] text-[#2B5379] text-sm rounded-md"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 text-white bg-[#2B5379] rounded-lg hover:bg-[#2B5379]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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