"use client";

import { X, AlertCircle, Calendar, Clock, User } from "lucide-react";
import { useState, useEffect } from "react";
import { getAllPatients, createNote, updateNote } from "@/lib/api/psychologist";
import type { SessionNote, PsychologistPatient, SessionNotePayload } from "@/lib/types/psychologist";

interface CreateNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editNote?: SessionNote | null;
}

export default function CreateNoteModal({ isOpen, onClose, onSuccess, editNote }: CreateNoteModalProps) {
  const [patients, setPatients] = useState<PsychologistPatient[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    patientId: 0,
    patientName: "",
    sessionDate: "",
    sessionTime: "",
    duration: 60,
    sessionNumber: 1,
    service: "",
    subjective: "",
    objective: "",
    assessment: "",
    plan: "",
    riskLevel: "low" as "low" | "medium" | "high",
    followUpDate: "",
    nextSessionRecommendation: "",
    tags: [] as string[]
  });

  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchPatients();
      if (editNote) {
        setFormData({
          patientId: editNote.patientId,
          patientName: editNote.patientName,
          sessionDate: editNote.sessionDate,
          sessionTime: editNote.sessionTime,
          duration: editNote.duration,
          sessionNumber: editNote.sessionNumber,
          service: editNote.service,
          subjective: editNote.subjective,
          objective: editNote.objective,
          assessment: editNote.assessment,
          plan: editNote.plan,
          riskLevel: editNote.riskLevel || "low",
          followUpDate: editNote.followUpDate || "",
          nextSessionRecommendation: editNote.nextSessionRecommendation || "",
          tags: editNote.tags || []
        });
      } else {
        // Reset form for new note
        const today = new Date().toISOString().split("T")[0];
        const now = new Date().toTimeString().slice(0, 5);
        setFormData({
          patientId: 0,
          patientName: "",
          sessionDate: today,
          sessionTime: now,
          duration: 60,
          sessionNumber: 1,
          service: "",
          subjective: "",
          objective: "",
          assessment: "",
          plan: "",
          riskLevel: "low",
          followUpDate: "",
          nextSessionRecommendation: "",
          tags: []
        });
      }
    }
  }, [isOpen, editNote]);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const data = await getAllPatients({});
      setPatients(data.patients);
    } catch (error) {
      console.error("Failed to fetch patients:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePatientChange = (patientId: string) => {
    const patient = patients.find(p => p.id === parseInt(patientId));
    if (patient) {
      setFormData({
        ...formData,
        patientId: patient.id,
        patientName: patient.name,
        sessionNumber: patient.totalSessions + 1
      });
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.patientId) {
      setError("Pilih pasien terlebih dahulu");
      return;
    }
    
    if (!formData.subjective || !formData.objective || !formData.assessment || !formData.plan) {
      setError("Semua field SOAP wajib diisi");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Prepare payload - hanya kirim field yang diperlukan
      const payload: SessionNotePayload = {
        patientId: formData.patientId,
        sessionDate: formData.sessionDate,
        sessionTime: formData.sessionTime,
        duration: formData.duration,
        sessionNumber: formData.sessionNumber,
        service: formData.service,
        subjective: formData.subjective,
        objective: formData.objective,
        assessment: formData.assessment,
        plan: formData.plan,
        riskLevel: formData.riskLevel,
        followUpDate: formData.followUpDate || undefined,
        nextSessionRecommendation: formData.nextSessionRecommendation || undefined,
        tags: formData.tags
      };

      if (editNote) {
        // Update existing note
        await updateNote(editNote.id, payload);
      } else {
        // Create new note
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-xl font-semibold text-[#2B5379]">
              {editNote ? "Edit Catatan" : "Buat Catatan Baru"}
            </h2>
            <p className="text-sm text-gray-600 mt-1">Format SOAP (Subjective, Objective, Assessment, Plan)</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Patient & Session Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Patient Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pasien <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.patientId}
                onChange={(e) => handlePatientChange(e.target.value)}
                disabled={loading || !!editNote}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5379] focus:border-transparent outline-none"
              >
                <option value="">Pilih Pasien</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name} ({patient.totalSessions} sesi)
                  </option>
                ))}
              </select>
            </div>

            {/* Service */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Layanan <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5379] focus:border-transparent outline-none"
              >
                <option value="">Pilih Layanan</option>
                <option value="Konseling Individu">Konseling Individu</option>
                <option value="Konsultasi Psikologi">Konsultasi Psikologi</option>
                <option value="Mental Health Check-Up">Mental Health Check-Up</option>
                <option value="Terapi Keluarga">Terapi Keluarga</option>
              </select>
            </div>

            {/* Session Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Sesi <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.sessionDate}
                onChange={(e) => setFormData({ ...formData, sessionDate: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5379] focus:border-transparent outline-none"
              />
            </div>

            {/* Session Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Waktu Sesi <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={formData.sessionTime}
                onChange={(e) => setFormData({ ...formData, sessionTime: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5379] focus:border-transparent outline-none"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Durasi (menit) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                min="15"
                step="15"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5379] focus:border-transparent outline-none"
              />
            </div>

            {/* Session Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sesi Ke- <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.sessionNumber}
                onChange={(e) => setFormData({ ...formData, sessionNumber: parseInt(e.target.value) })}
                min="1"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5379] focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* SOAP Format */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#2B5379]">Catatan SOAP</h3>

            {/* Subjective */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <label className="block text-sm font-bold text-[#2B5379] mb-2">
                S - SUBJECTIVE (Keluhan Pasien) <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.subjective}
                onChange={(e) => setFormData({ ...formData, subjective: e.target.value })}
                rows={4}
                required
                placeholder="Apa yang disampaikan pasien? Keluhan, perasaan, pengalaman..."
                className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-[#2B5379] focus:border-transparent outline-none bg-white"
              />
            </div>

            {/* Objective */}
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <label className="block text-sm font-bold text-[#2B5379] mb-2">
                O - OBJECTIVE (Observasi) <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.objective}
                onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                rows={4}
                required
                placeholder="Observasi objektif: kontak mata, body language, affect, test scores..."
                className="w-full px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-[#2B5379] focus:border-transparent outline-none bg-white"
              />
            </div>

            {/* Assessment */}
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <label className="block text-sm font-bold text-[#2B5379] mb-2">
                A - ASSESSMENT (Analisis) <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.assessment}
                onChange={(e) => setFormData({ ...formData, assessment: e.target.value })}
                rows={4}
                required
                placeholder="Diagnosis, interpretasi, progress assessment, clinical impression..."
                className="w-full px-4 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-[#2B5379] focus:border-transparent outline-none bg-white"
              />
            </div>

            {/* Plan */}
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <label className="block text-sm font-bold text-[#2B5379] mb-2">
                P - PLAN (Rencana) <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.plan}
                onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                rows={4}
                required
                placeholder="Rencana treatment, homework, follow-up, referral..."
                className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-[#2B5379] focus:border-transparent outline-none bg-white"
              />
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Risk Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Risk Level <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.riskLevel}
                onChange={(e) => setFormData({ ...formData, riskLevel: e.target.value as "low" | "medium" | "high" })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5379] focus:border-transparent outline-none"
              >
                <option value="low">Risiko Rendah</option>
                <option value="medium">Risiko Sedang</option>
                <option value="high">Risiko Tinggi</option>
              </select>
            </div>

            {/* Follow-up Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Follow-up
              </label>
              <input
                type="date"
                value={formData.followUpDate}
                onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5379] focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Next Session Recommendation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rekomendasi Sesi Berikutnya
            </label>
            <textarea
              value={formData.nextSessionRecommendation}
              onChange={(e) => setFormData({ ...formData, nextSessionRecommendation: e.target.value })}
              rows={2}
              placeholder="Fokus atau topik untuk sesi berikutnya..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5379] focus:border-transparent outline-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                placeholder="Tambah tag (tekan Enter)"
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
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
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

          {/* Submit Button */}
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
              {submitting ? "Menyimpan..." : editNote ? "Update Catatan" : "Simpan Catatan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
