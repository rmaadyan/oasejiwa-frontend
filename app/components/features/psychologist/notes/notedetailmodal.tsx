"use client";

import { X, Calendar, Clock, AlertTriangle, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import type { SessionNote } from "@/lib/types/psychologist";

interface NoteDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: SessionNote | null;
  onEdit?: (note: SessionNote) => void;
  onDelete?: (noteId: string) => void | Promise<void>;
}

export default function NoteDetailModal({
  isOpen,
  onClose,
  note,
  onEdit,
  onDelete
}: NoteDetailModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!isOpen || !note) return null;

  const getRiskBadge = () => {
    const styles = {
      low: { bg: "bg-green-100", text: "text-green-700", border: "border-green-200", label: "Risiko Rendah" },
      medium: { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-200", label: "Risiko Sedang" },
      high: { bg: "bg-red-100", text: "text-red-700", border: "border-red-200", label: "Risiko Tinggi" }
    };

    const style = styles[note.riskLevel || "low"];

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${style.bg} ${style.text} ${style.border}`}>
        <AlertTriangle className="w-4 h-4" />
        {style.label}
      </span>
    );
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    setDeleting(true);
    try {
      await onDelete(note.id);
      onClose();
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus catatan");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-[#2B5379]">Catatan Konseling</h2>
            <p className="text-sm text-gray-600 mt-1">Detail catatan sesi SOAP</p>
          </div>
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(note)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Edit className="w-5 h-5 text-gray-600" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-5 h-5 text-red-600" />
              </button>
            )}
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Patient & Session Info */}
          <div className="flex items-start justify-between p-4 bg-[#D1EAFF] rounded-lg">
            <div>
              <h3 className="text-lg font-semibold text-[#2B5379]">{note.patientName}</h3>
              <p className="text-sm text-gray-600">{note.service} - Sesi ke-{note.sessionNumber}</p>
              <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>{note.sessionDate}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>{note.sessionTime} ({note.duration} menit)</span>
                </div>
              </div>
            </div>
            {getRiskBadge()}
          </div>

          {/* SOAP Format */}
          <div className="space-y-4">
            {/* Subjective */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm font-bold text-[#2B5379] mb-2">S - SUBJECTIVE</h4>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.subjective}</p>
            </div>

            {/* Objective */}
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="text-sm font-bold text-[#2B5379] mb-2">O - OBJECTIVE</h4>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.objective}</p>
            </div>

            {/* Assessment */}
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="text-sm font-bold text-[#2B5379] mb-2">A - ASSESSMENT</h4>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.assessment}</p>
            </div>

            {/* Plan */}
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="text-sm font-bold text-[#2B5379] mb-2">P - PLAN</h4>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.plan}</p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {note.followUpDate && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs font-medium text-gray-600 mb-1">Follow-up Date</p>
                <p className="text-sm font-semibold text-gray-900">{note.followUpDate}</p>
              </div>
            )}

            {note.nextSessionRecommendation && (
              <div className="p-4 bg-gray-50 rounded-lg md:col-span-2">
                <p className="text-xs font-medium text-gray-600 mb-1">Rekomendasi Sesi Berikutnya</p>
                <p className="text-sm text-gray-700">{note.nextSessionRecommendation}</p>
              </div>
            )}
          </div>

          {/* Tags */}
          {note.tags && note.tags.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-600 mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {note.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-[#D1EAFF] text-[#2B5379] text-sm rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Dibuat: {note.createdAt}</span>
              {note.updatedAt !== note.createdAt && (
                <span>Diubah: {note.updatedAt}</span>
              )}
            </div>
          </div>
        </div>

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="p-6 border-t border-gray-200 bg-red-50">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900">Hapus catatan ini?</p>
                <p className="text-sm text-red-700 mt-1">
                  Tindakan ini tidak dapat dibatalkan. Catatan konseling akan dihapus secara permanen.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleting ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
