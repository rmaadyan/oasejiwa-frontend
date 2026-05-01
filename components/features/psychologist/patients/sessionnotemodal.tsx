"use client";

import { X, Calendar, Clock, AlertTriangle } from "lucide-react";
import type { SessionNote } from "@/lib/types/psychologist";

interface SessionNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: SessionNote | null;
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
    return "-";
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
    return "-";
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
    <div className={`rounded-lg border p-4 ${className}`}>
      <p className="mb-1 text-sm font-bold text-[#2B5379]">{title}</p>
      <p className="mb-3 text-xs text-gray-600">{subtitle}</p>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800">
        {content || "-"}
      </p>
    </div>
  );
}

export default function SessionNoteModal({
  isOpen,
  onClose,
  note,
}: SessionNoteModalProps) {
  if (!isOpen || !note) return null;

  const riskLevel = (note.riskLevel?.toLowerCase() || "low") as
    | "low"
    | "medium"
    | "high";

  const getRiskBadge = () => {
    const styles = {
      low: "border-green-200 bg-green-100 text-green-700",
      medium: "border-yellow-200 bg-yellow-100 text-yellow-700",
      high: "border-red-200 bg-red-100 text-red-700",
    };

    const labels = {
      low: "Risiko Rendah",
      medium: "Risiko Sedang",
      high: "Risiko Tinggi",
    };

    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${styles[riskLevel]}`}
      >
        <AlertTriangle className="h-3 w-3" />
        {labels[riskLevel]}
      </span>
    );
  };

  const updatedText = formatDateTime(note.updatedAt);
  const createdText = formatDateTime(note.createdAt);
  const showUpdatedAt = Boolean(note.updatedAt) && updatedText !== createdText;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white p-6">
          <div>
            <h2 className="text-xl font-semibold text-[#2B5379]">
              Catatan Sesi
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Detail catatan konseling pasien
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 transition-colors hover:bg-gray-100"
            type="button"
            aria-label="Tutup modal"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          {/* Patient and Session Info */}
          <div className="rounded-lg bg-[#D1EAFF] p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#2B5379]">
                  {note.patientName || "Pasien"}
                </h3>
                <p className="mt-1 text-sm text-gray-700">
                  {note.service || "Konseling"}
                </p>
              </div>

              {getRiskBadge()}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-700">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>{formatDateOnly(note.sessionDate)}</span>
              </div>

              <span className="text-gray-400">•</span>

              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{note.sessionTime || "-"}</span>
              </div>

              <span className="text-gray-400">•</span>

              <span>{note.duration ? `${note.duration} menit` : "-"}</span>

              <span className="text-gray-400">•</span>

              <span>Sesi ke-{note.sessionNumber || 1}</span>
            </div>
          </div>

          {/* SOAP */}
          <div className="space-y-4">
            <h4 className="font-semibold text-[#2B5379]">Catatan SOAP</h4>

            <SoapSection
              title="S - Subjective"
              subtitle="Keluhan, cerita, atau pengalaman yang disampaikan pasien"
              content={note.subjective}
              className="border-blue-200 bg-blue-50"
            />

            <SoapSection
              title="O - Objective"
              subtitle="Observasi objektif selama sesi"
              content={note.objective}
              className="border-green-200 bg-green-50"
            />

            <SoapSection
              title="A - Assessment"
              subtitle="Analisis, progress, atau kesimpulan psikolog"
              content={note.assessment}
              className="border-yellow-200 bg-yellow-50"
            />

            <SoapSection
              title="P - Plan"
              subtitle="Rencana treatment, latihan rumah, atau rekomendasi"
              content={note.plan}
              className="border-purple-200 bg-purple-50"
            />
          </div>

          {/* Follow-up and Recommendation */}
          {(note.followUpDate || note.nextSessionRecommendation) && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {note.followUpDate && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <p className="mb-2 text-xs font-medium text-blue-900">
                    Tanggal Follow-up
                  </p>
                  <p className="text-sm text-blue-700">
                    {formatDateOnly(note.followUpDate)}
                  </p>
                </div>
              )}

              {note.nextSessionRecommendation && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <p className="mb-2 text-xs font-medium text-gray-700">
                    Rekomendasi Sesi Berikutnya
                  </p>
                  <p className="whitespace-pre-wrap text-sm text-gray-800">
                    {note.nextSessionRecommendation}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Tags */}
          {note.tags && note.tags.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-medium text-gray-600">Tags</p>
              <div className="flex flex-wrap gap-2">
                {note.tags.map((tag, index) => (
                  <span
                    key={`${tag}-${index}`}
                    className="inline-flex items-center rounded-md bg-[#D1EAFF] px-3 py-1 text-sm text-[#2B5379]"
                  >
                    {tag}
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
      </div>
    </div>
  );
}