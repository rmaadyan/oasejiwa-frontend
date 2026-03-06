"use client";

import { useState } from "react";
import type { SessionNotePayload } from "@/lib/types/psychologist";

interface SOAPFormProps {
  initialData?: Partial<SessionNotePayload>;
  onSubmit: (data: SessionNotePayload) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function SOAPForm({ initialData, onSubmit, onCancel, loading }: SOAPFormProps) {
  const [formData, setFormData] = useState<Partial<SessionNotePayload>>({
    sessionId: initialData?.sessionId || 0,
    patientId: initialData?.patientId || 0,
    subjective: initialData?.subjective || "",
    objective: initialData?.objective || "",
    assessment: initialData?.assessment || "",
    plan: initialData?.plan || "",
    riskLevel: initialData?.riskLevel || "low",
    followUpDate: initialData?.followUpDate || "",
    nextSessionRecommendation: initialData?.nextSessionRecommendation || "",
    tags: initialData?.tags || []
  });

  const [tagInput, setTagInput] = useState("");

  const handleChange = (field: keyof SessionNotePayload, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && formData.tags && !formData.tags.includes(tagInput.trim())) {
      handleChange("tags", [...(formData.tags || []), tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    handleChange("tags", (formData.tags || []).filter(t => t !== tag));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subjective || !formData.objective || !formData.assessment || !formData.plan) {
      alert("Harap lengkapi semua field SOAP");
      return;
    }
    onSubmit(formData as SessionNotePayload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Risk Level */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Risk Level <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-3">
          {[
            { value: "low", label: "Low Risk", color: "green" },
            { value: "medium", label: "Medium Risk", color: "orange" },
            { value: "high", label: "High Risk", color: "red" }
          ].map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleChange("riskLevel", option.value)}
              className={`flex-1 px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                formData.riskLevel === option.value
                  ? `border-${option.color}-500 bg-${option.color}-50 text-${option.color}-700`
                  : "border-gray-300 text-gray-700 hover:border-gray-400"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* SOAP Fields */}
      <div className="space-y-4">
        {/* Subjective */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <label className="block text-sm font-bold text-blue-900 mb-2">
            S - SUBJECTIVE <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-blue-700 mb-2">Keluhan pasien, apa yang pasien sampaikan</p>
          <textarea
            value={formData.subjective}
            onChange={(e) => handleChange("subjective", e.target.value)}
            rows={4}
            placeholder="Contoh: Pasien melaporkan penurunan frekuensi serangan kecemasan..."
            className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            required
          />
        </div>

        {/* Objective */}
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <label className="block text-sm font-bold text-green-900 mb-2">
            O - OBJECTIVE <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-green-700 mb-2">Observasi psikolog, hasil tes/assessment</p>
          <textarea
            value={formData.objective}
            onChange={(e) => handleChange("objective", e.target.value)}
            rows={4}
            placeholder="Contoh: Pasien tampak lebih rileks, kontak mata baik. GAD-7 score: 12..."
            className="w-full px-3 py-2 border border-green-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            required
          />
        </div>

        {/* Assessment */}
        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <label className="block text-sm font-bold text-orange-900 mb-2">
            A - ASSESSMENT <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-orange-700 mb-2">Diagnosis, analisis, dan evaluasi klinis</p>
          <textarea
            value={formData.assessment}
            onChange={(e) => handleChange("assessment", e.target.value)}
            rows={4}
            placeholder="Contoh: Anxiety Disorder - menunjukkan progress signifikan. Teknik CBT efektif..."
            className="w-full px-3 py-2 border border-orange-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            required
          />
        </div>

        {/* Plan */}
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <label className="block text-sm font-bold text-purple-900 mb-2">
            P - PLAN <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-purple-700 mb-2">Rencana treatment, homework, follow-up</p>
          <textarea
            value={formData.plan}
            onChange={(e) => handleChange("plan", e.target.value)}
            rows={5}
            placeholder="Contoh: 1. Lanjutkan teknik CBT&#10;2. Homework: journal daily mood&#10;3. Follow-up 1 minggu"
            className="w-full px-3 py-2 border border-purple-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            required
          />
        </div>
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Follow-up Date
          </label>
          <input
            type="text"
            value={formData.followUpDate}
            onChange={(e) => handleChange("followUpDate", e.target.value)}
            placeholder="16 Feb 2026"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Rekomendasi Sesi Berikutnya
          </label>
          <textarea
            value={formData.nextSessionRecommendation}
            onChange={(e) => handleChange("nextSessionRecommendation", e.target.value)}
            rows={2}
            placeholder="Fokus pada exposure therapy untuk situasi sosial..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Tags
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
            placeholder="Tambah tag (Enter untuk menambah)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
          >
            Tambah
          </button>
        </div>
        {formData.tags && formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-md"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-purple-900"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Simpan Catatan"}
        </button>
      </div>
    </form>
  );
}
