"use client";

import { X, Plus, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { updatePatientMedicalInfo } from "@/lib/api/psychologist";

interface EditMedicalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  patientId: string;
  initialData: {
    diagnosis?: string[];
    currentMedication?: string[];
    allergies?: string[];
  };
}

export default function EditMedicalModal({
  isOpen,
  onClose,
  onSuccess,
  patientId,
  initialData
}: EditMedicalModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [diagnosis, setDiagnosis] = useState<string[]>([]);
  const [medication, setMedication] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);

  const [diagnosisInput, setDiagnosisInput] = useState("");
  const [medicationInput, setMedicationInput] = useState("");
  const [allergyInput, setAllergyInput] = useState("");

  useEffect(() => {
    if (isOpen) {
      setDiagnosis(initialData.diagnosis || []);
      setMedication(initialData.currentMedication || []);
      setAllergies(initialData.allergies || []);
      setError(null);
    }
  }, [isOpen, initialData]);

  const handleAddDiagnosis = () => {
    if (diagnosisInput.trim() && !diagnosis.includes(diagnosisInput.trim())) {
      setDiagnosis([...diagnosis, diagnosisInput.trim()]);
      setDiagnosisInput("");
    }
  };

  const handleAddMedication = () => {
    if (medicationInput.trim() && !medication.includes(medicationInput.trim())) {
      setMedication([...medication, medicationInput.trim()]);
      setMedicationInput("");
    }
  };

  const handleAddAllergy = () => {
    if (allergyInput.trim() && !allergies.includes(allergyInput.trim())) {
      setAllergies([...allergies, allergyInput.trim()]);
      setAllergyInput("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setSubmitting(true);
    setError(null);

    try {
      await updatePatientMedicalInfo(patientId, {
        diagnosis,
        currentMedication: medication,
        allergies
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to update medical info:", error);
      setError("Gagal menyimpan informasi medis. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-xl font-semibold text-[#2B5379]">Edit Informasi Medis</h2>
            <p className="text-sm text-gray-600 mt-1">Update diagnosis, obat, dan alergi pasien</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form noValidate onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Diagnosis */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Diagnosis
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={diagnosisInput}
                onChange={(e) => setDiagnosisInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddDiagnosis())}
                placeholder="Tambah diagnosis (tekan Enter)"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5379] focus:border-transparent outline-none"
              />
              <button
                type="button"
                onClick={handleAddDiagnosis}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              {diagnosis.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <span className="text-sm text-blue-700">{item}</span>
                  <button
                    type="button"
                    onClick={() => setDiagnosis(diagnosis.filter((_, i) => i !== index))}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Current Medication */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Obat Saat Ini
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={medicationInput}
                onChange={(e) => setMedicationInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddMedication())}
                placeholder="Tambah obat (tekan Enter)"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5379] focus:border-transparent outline-none"
              />
              <button
                type="button"
                onClick={handleAddMedication}
                className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              {medication.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <span className="text-sm text-orange-700">{item}</span>
                  <button
                    type="button"
                    onClick={() => setMedication(medication.filter((_, i) => i !== index))}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Allergies */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alergi
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={allergyInput}
                onChange={(e) => setAllergyInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddAllergy())}
                placeholder="Tambah alergi (tekan Enter)"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5379] focus:border-transparent outline-none"
              />
              <button
                type="button"
                onClick={handleAddAllergy}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              {allergies.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                  <span className="text-sm text-red-700">{item}</span>
                  <button
                    type="button"
                    onClick={() => setAllergies(allergies.filter((_, i) => i !== index))}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
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
              {submitting ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
