"use client";

import {
  X,
  Calendar,
  Clock,
  AlertTriangle,
  Edit,
  Trash2,
  FileText,
  User,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";
import type { SessionNote } from "@/lib/types/psychologist";

interface NoteDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: SessionNote | null;
  onEdit?: (note: SessionNote) => void;
  onDelete?: (noteId: string) => void | Promise<void>;
}

function formatDateOnly(date?: string | Date | null) {
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

  if (Number.isNaN(parsedDate.getTime())) {
    return String(date);
  }

  return parsedDate.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatDateTime(date?: string | Date | null) {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return String(date);
  }

  return parsedDate.toLocaleString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function SoapSection({
  title,
  subtitle,
  content,
  className,
}: {
  title: string;
  subtitle: string;
  content?: string | null;
  className: string;
}) {
  return (
    <div className={`rounded-xl border p-4 shadow-2xs ${className}`}>
      <p className="mb-0.5 text-sm font-bold text-[#2B5379]">{title}</p>
      <p className="mb-2.5 text-xs text-gray-500">{subtitle}</p>
      <p className="whitespace-pre-wrap text-xs sm:text-sm leading-relaxed text-gray-800 font-normal">
        {content || "-"}
      </p>
    </div>
  );
}

export default function NoteDetailModal({
  isOpen,
  onClose,
  note,
  onEdit,
  onDelete,
}: NoteDetailModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!isOpen || !note) return null;

  const riskLevel = (note.riskLevel?.toLowerCase() || "low") as
    | "low"
    | "medium"
    | "high";

  const getRiskBadge = () => {
    const styles = {
      low: {
        bg: "bg-emerald-100",
        text: "text-emerald-800",
        border: "border-emerald-200",
        label: "Risiko Rendah",
      },
      medium: {
        bg: "bg-amber-100",
        text: "text-amber-800",
        border: "border-amber-200",
        label: "Risiko Sedang",
      },
      high: {
        bg: "bg-red-100",
        text: "text-red-800",
        border: "border-red-200",
        label: "Risiko Tinggi",
      },
    };

    const style = styles[riskLevel];

    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${style.bg} ${style.text} ${style.border}`}
      >
        <AlertTriangle className="h-3.5 w-3.5" />
        {style.label}
      </span>
    );
  };

  const handleDelete = async () => {
    if (!onDelete) return;

    setDeleting(true);

    try {
      await onDelete(note.id);
      setShowDeleteConfirm(false);
      onClose();
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus catatan");
    } finally {
      setDeleting(false);
    }
  };

  const updatedText = formatDateTime(note.updatedAt);
  const createdText = formatDateTime(note.createdAt);
  const showUpdatedAt = Boolean(note.updatedAt) && updatedText !== createdText;
  const initialLetter = note.patientName ? note.patientName.charAt(0).toUpperCase() : "P";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Sticky */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white p-6 shadow-xs">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-[#2B5379]">
              Detail Catatan Rekam Medis Sesi
            </h2>
            <p className="mt-0.5 text-xs text-gray-500">
              Dokumentasi terstruktur format SOAP Oase Jiwa
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(note)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
                type="button"
              >
                <Edit className="h-4 w-4 text-[#2B5379]" />
                Edit Catatan
              </button>
            )}

            {onDelete && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 transition"
                type="button"
              >
                <Trash2 className="h-4 w-4" />
                Hapus
              </button>
            )}

            <button
              onClick={onClose}
              className="rounded-lg p-2 transition-colors hover:bg-gray-100"
              type="button"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="space-y-6 p-6">
          {/* Banner Pasien Gradient */}
          <div className="rounded-xl bg-gradient-to-r from-[#234463] to-[#2B5379] p-5 text-white shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white/40 text-white flex items-center justify-center font-bold text-xl shrink-0">
                  {initialLetter}
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{note.patientName || "Budi Santoso"}</h3>
                  <p className="text-xs text-blue-100 font-medium mt-0.5">
                    {note.service || "Konseling Individu"}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-blue-100 font-medium">
                    <span className="flex items-center gap-1 bg-white/20 px-2.5 py-0.5 rounded-md">
                      <Calendar className="h-3.5 w-3.5" /> {formatDateOnly(note.sessionDate || note.createdAt)}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 bg-white/20 px-2.5 py-0.5 rounded-md">
                      <Clock className="h-3.5 w-3.5" /> {note.sessionTime || "09.00"}
                    </span>
                    <span>•</span>
                    <span className="bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 px-2.5 py-0.5 rounded-md font-bold">
                      Sesi ke-{note.sessionNumber || 1} ({note.duration || 60} menit)
                    </span>
                  </div>
                </div>
              </div>

              <div className="self-start sm:self-auto">
                {getRiskBadge()}
              </div>
            </div>
          </div>

          {/* Section Rekam Medis Sesi (SOAP Format) */}
          <div className="space-y-4">
            <h4 className="font-bold text-[#2B5379] flex items-center gap-2 text-base">
              <FileText className="h-4.5 w-4.5 text-[#2B5379]" />
              Detail Rekam Medis Sesi
            </h4>

            <SoapSection
              title="Keluhan Utama (Subjective)"
              subtitle="Keluhan, perasaan, atau pengalaman yang disampaikan pasien"
              content={note.subjective}
              className="border-blue-200 bg-blue-50/70"
            />

            <SoapSection
              title="Observasi Psikolog (Objective)"
              subtitle="Observasi objektif psikolog selama sesi berlangsung"
              content={note.objective}
              className="border-green-200 bg-green-50/70"
            />

            <SoapSection
              title="Assessment"
              subtitle="Gejala, diagnosis, dan analisis psikologis"
              content={note.assessment}
              className="border-yellow-200 bg-yellow-50/70"
            />

            <SoapSection
              title="Intervensi (Plan)"
              subtitle="Pendekatan terapi, psychoeducation, teknik pernapasan, dan relaksasi"
              content={note.plan}
              className="border-purple-200 bg-purple-50/70"
            />
          </div>

          {/* Rencana Tindak Lanjut */}
          {(note.followUpDate || note.nextSessionRecommendation || note.additionalNotes) && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 shadow-2xs space-y-2">
              <p className="text-sm font-bold text-[#2B5379] flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Rencana Tindak Lanjut & Rekomendasi
              </p>
              
              {note.nextSessionRecommendation && (
                <div className="rounded-lg bg-white p-3 border border-emerald-100 text-xs sm:text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {note.nextSessionRecommendation}
                </div>
              )}

              {note.additionalNotes && (
                <p className="text-xs text-gray-700 italic pt-1">
                  Catatan Tambahan: {note.additionalNotes}
                </p>
              )}

              {note.followUpDate && (
                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-300">
                    <Calendar className="h-3.5 w-3.5" />
                    Jadwal Kontrol: {formatDateOnly(note.followUpDate)}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Tags */}
          {note.tags && note.tags.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-bold text-gray-600 uppercase tracking-wider">Tags Klinik</p>
              <div className="flex flex-wrap gap-2">
                {note.tags.map((tag, index) => (
                  <span
                    key={`${tag}-${index}`}
                    className="inline-flex items-center rounded-lg bg-[#D1EAFF] px-3 py-1 text-xs font-semibold text-[#2B5379] border border-blue-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex flex-col gap-1 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
              <span>Dibuat: {createdText}</span>
              {showUpdatedAt && <span>Diubah: {updatedText}</span>}
            </div>
          </div>
        </div>

        {/* Modal Hapus Confirm */}
        {showDeleteConfirm && (
          <div className="border-t border-gray-200 bg-red-50 p-6 rounded-b-2xl">
            <div className="mb-4 flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
              <div>
                <p className="font-bold text-red-900">
                  Hapus catatan konseling ini?
                </p>
                <p className="mt-1 text-xs text-red-700">
                  Tindakan ini tidak dapat dibatalkan. Catatan sesi pasien akan dihapus secara permanen.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                type="button"
              >
                Batal
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                type="button"
              >
                {deleting ? "Menghapus..." : "Ya, Hapus Catatan"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}