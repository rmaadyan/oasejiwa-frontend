"use client";

import { X, Calendar, Clock, FileText, AlertTriangle } from "lucide-react";
import type { SessionNote } from "@/lib/types/psychologist";

interface SessionNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: SessionNote | null;
}

export default function SessionNoteModal({ isOpen, onClose, note }: SessionNoteModalProps) {
  if (!isOpen || !note) return null;

  const getRiskBadge = () => {
    const styles = {
      low: "bg-green-100 text-green-700 border-green-200",
      medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
      high: "bg-red-100 text-red-700 border-red-200"
    };

    const labels = {
      low: "Risiko Rendah",
      medium: "Risiko Sedang",
      high: "Risiko Tinggi"
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${styles[note.riskLevel || "low"]}`}>
        <AlertTriangle className="w-3 h-3" />
        {labels[note.riskLevel || "low"]}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div 
        className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-xl font-semibold text-[#2B5379]">Catatan Sesi</h2>
            <p className="text-sm text-gray-600 mt-1">{note.patientName} - {note.service}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Session Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{note.sessionDate}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{note.sessionTime}</span>
              </div>
              <span>•</span>
              <span>Sesi ke-{note.sessionNumber}</span>
            </div>
            {getRiskBadge()}
          </div>

          {/* SOAP Notes */}
          <div className="space-y-4">
            {/* Subjective */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-sm font-semibold text-[#2B5379] mb-2">Subjective (Keluhan Pasien)</h3>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.subjective}</p>
            </div>

            {/* Objective */}
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="text-sm font-semibold text-[#2B5379] mb-2">Objective (Observasi)</h3>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.objective}</p>
            </div>

            {/* Assessment */}
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="text-sm font-semibold text-[#2B5379] mb-2">Assessment (Analisis)</h3>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.assessment}</p>
            </div>

            {/* Plan */}
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h3 className="text-sm font-semibold text-[#2B5379] mb-2">Plan (Rencana)</h3>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.plan}</p>
            </div>
          </div>

          {/* Follow Up & Recommendations */}
          {(note.followUpDate || note.nextSessionRecommendation) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {note.followUpDate && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Tanggal Follow Up</p>
                  <p className="text-sm font-medium text-gray-900">{note.followUpDate}</p>
                </div>
              )}
              {note.nextSessionRecommendation && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Rekomendasi Sesi Berikutnya</p>
                  <p className="text-sm font-medium text-gray-900">{note.nextSessionRecommendation}</p>
                </div>
              )}
            </div>
          )}

          {/* Tags */}
          {note.tags && note.tags.length > 0 && (
            <div>
              <p className="text-xs text-gray-600 mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {note.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-[#D1EAFF] text-[#2B5379] text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
