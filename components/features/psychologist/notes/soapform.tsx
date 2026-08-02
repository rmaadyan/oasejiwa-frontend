"use client";

import { useState } from "react";
import { AlertCircle, AlertTriangle } from "lucide-react";
import type { SessionNotePayload } from "@/lib/types/psychologist";

interface SOAPFormProps {
  initialData?: Partial<SessionNotePayload>;
  onSubmit: (data: SessionNotePayload) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function SOAPForm({ initialData, onSubmit, onCancel, loading }: SOAPFormProps) {
  const [formData, setFormData] = useState<Partial<SessionNotePayload>>({
    userId: initialData?.userId || "",
    scheduleId: initialData?.scheduleId,
    subjective: initialData?.subjective || "",
    objective: initialData?.objective || "",
    assessment: initialData?.assessment || "",
    plan: initialData?.plan || "",
    riskLevel: initialData?.riskLevel || "low",
    followUpDate: initialData?.followUpDate,
    nextSessionRecommendation: initialData?.nextSessionRecommendation,
    tags: initialData?.tags || [],
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [tagInput, setTagInput] = useState("");

  const handleChange = (field: keyof SessionNotePayload, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && formData.tags && !formData.tags.includes(tagInput.trim())) {
      handleChange("tags", [...(formData.tags || []), tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    handleChange("tags", (formData.tags || []).filter((t) => t !== tag));
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

    if (!formData.subjective?.trim()) {
      errors.subjective = "Keluhan Utama (Subjective) wajib diisi";
    }

    if (!formData.objective?.trim()) {
      errors.objective = "Observasi Psikolog (Objective) wajib diisi";
    }

    if (!formData.assessment?.trim()) {
      errors.assessment = "Assessment & Analisis Psikologis wajib diisi";
    }

    if (!formData.plan?.trim()) {
      errors.plan = "Intervensi & Rencana (Plan) wajib diisi";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit(formData as SessionNotePayload);
  };

  const errorCount = Object.keys(fieldErrors).length;

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-6">
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

      {/* Risk Level */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Risk Level <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-3">
          {[
            { value: "low", label: "Low Risk", color: "green" },
            { value: "medium", label: "Medium Risk", color: "orange" },
            { value: "high", label: "High Risk", color: "red" },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleChange("riskLevel", option.value)}
              className={`flex-1 px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors cursor-pointer ${
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
        <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-lg">
          <label className="block text-sm font-bold text-blue-900 mb-1">
            S - SUBJECTIVE <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-blue-700 mb-2">Keluhan pasien, apa yang disampaikan pasien</p>
          <textarea
            id="subjective"
            name="subjective"
            value={formData.subjective}
            onChange={(e) => handleChange("subjective", e.target.value)}
            rows={4}
            placeholder="Jelaskan keluhan utama pasien..."
            className={`w-full px-3 py-2 border rounded-lg text-sm outline-none transition focus:ring-2 ${
              fieldErrors.subjective ? "border-red-500 bg-red-50/30 focus:ring-red-500/20" : "border-blue-300 focus:ring-blue-500"
            }`}
          />
          {fieldErrors.subjective && (
            <p className="mt-1 text-xs font-medium text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {fieldErrors.subjective}
            </p>
          )}
        </div>

        {/* Objective */}
        <div className="p-4 bg-green-50/60 border border-green-200 rounded-lg">
          <label className="block text-sm font-bold text-green-900 mb-1">
            O - OBJECTIVE <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-green-700 mb-2">Hasil pengamatan dan psikotes</p>
          <textarea
            id="objective"
            name="objective"
            value={formData.objective}
            onChange={(e) => handleChange("objective", e.target.value)}
            rows={4}
            placeholder="Jelaskan observasi klinis psikolog..."
            className={`w-full px-3 py-2 border rounded-lg text-sm outline-none transition focus:ring-2 ${
              fieldErrors.objective ? "border-red-500 bg-red-50/30 focus:ring-red-500/20" : "border-green-300 focus:ring-green-500"
            }`}
          />
          {fieldErrors.objective && (
            <p className="mt-1 text-xs font-medium text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {fieldErrors.objective}
            </p>
          )}
        </div>

        {/* Assessment */}
        <div className="p-4 bg-orange-50/60 border border-orange-200 rounded-lg">
          <label className="block text-sm font-bold text-orange-900 mb-1">
            A - ASSESSMENT <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-orange-700 mb-2">Analisis dan diagnosis psikolog</p>
          <textarea
            id="assessment"
            name="assessment"
            value={formData.assessment}
            onChange={(e) => handleChange("assessment", e.target.value)}
            rows={4}
            placeholder="Jelaskan analisis & diagnosis..."
            className={`w-full px-3 py-2 border rounded-lg text-sm outline-none transition focus:ring-2 ${
              fieldErrors.assessment ? "border-red-500 bg-red-50/30 focus:ring-red-500/20" : "border-orange-300 focus:ring-orange-500"
            }`}
          />
          {fieldErrors.assessment && (
            <p className="mt-1 text-xs font-medium text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {fieldErrors.assessment}
            </p>
          )}
        </div>

        {/* Plan */}
        <div className="p-4 bg-purple-50/60 border border-purple-200 rounded-lg">
          <label className="block text-sm font-bold text-purple-900 mb-1">
            P - PLAN <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-purple-700 mb-2">Rencana intervensi & sesi selanjutnya</p>
          <textarea
            id="plan"
            name="plan"
            value={formData.plan}
            onChange={(e) => handleChange("plan", e.target.value)}
            rows={4}
            placeholder="Jelaskan intervensi & rencana..."
            className={`w-full px-3 py-2 border rounded-lg text-sm outline-none transition focus:ring-2 ${
              fieldErrors.plan ? "border-red-500 bg-red-50/30 focus:ring-red-500/20" : "border-purple-300 focus:ring-purple-500"
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

      {/* Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 text-sm font-medium text-white bg-[#2B5379] rounded-lg hover:bg-[#234463] transition-colors cursor-pointer disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Simpan Catatan"}
        </button>
      </div>
    </form>
  );
}
