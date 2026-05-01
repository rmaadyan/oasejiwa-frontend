"use client";

import { Calendar, Clock, AlertTriangle } from "lucide-react";
import type { SessionNote } from "@/lib/types/psychologist";

interface NoteCardProps {
  note: SessionNote;
  onViewDetails: (note: SessionNote) => void;
}

export default function NoteCard({ note, onViewDetails }: NoteCardProps) {
  const formatDate = (date?: string | Date | null) => {
    if (!date) return "-";

    const rawDate = String(date);

    /**
     * Kalau backend kirim date-only seperti "2026-05-01",
     * jangan langsung pakai new Date("2026-05-01") karena rawan geser timezone.
     */
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
  };

  const getRiskBadge = () => {
    const riskLevel = (note.riskLevel?.toLowerCase() || "low") as
      | "low"
      | "medium"
      | "high";

    const styles = {
      low: {
        bg: "bg-green-100",
        text: "text-green-700",
        label: "Risiko Rendah",
      },
      medium: {
        bg: "bg-orange-100",
        text: "text-orange-700",
        label: "Risiko Sedang",
      },
      high: {
        bg: "bg-red-100",
        text: "text-red-700",
        label: "Risiko Tinggi",
      },
    };

    const style = styles[riskLevel];

    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${style.bg} ${style.text}`}
      >
        <AlertTriangle className="h-3 w-3" />
        {style.label}
      </span>
    );
  };

  const sessionDate = formatDate(note.sessionDate);
  const sessionTime = note.sessionTime || "-";
  const sessionNumber = note.sessionNumber || 1;
  const hasSessionInfo = Boolean(note.sessionDate || note.sessionTime);

  return (
    <div
      onClick={() => onViewDetails(note)}
      className="cursor-pointer rounded-lg border border-gray-200 bg-white p-5 transition-all hover:border-[#2B5379] hover:shadow-md"
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-[#2B5379]">
            {note.patientName || "Pasien"}
          </h3>
          <p className="mt-0.5 text-sm text-gray-600">
            {note.service || "Konseling"}
          </p>
        </div>

        {getRiskBadge()}
      </div>

      {/* Session Info */}
      <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-gray-600">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4" />
          <span>{sessionDate}</span>
        </div>

        <span className="text-gray-400">•</span>

        <div className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          <span>{sessionTime}</span>
        </div>

        <span className="text-gray-400">•</span>

        <span>Sesi ke-{sessionNumber}</span>
      </div>

      {!hasSessionInfo && (
        <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 px-3 py-2">
          <p className="text-xs text-yellow-700">
            Catatan ini belum terhubung ke jadwal sesi tertentu.
          </p>
        </div>
      )}

      {/* SOAP Preview */}
      <div className="space-y-2">
        <div className="rounded-lg bg-gray-50 p-3">
          <p className="mb-1 text-xs font-semibold text-gray-700">
            Assessment
          </p>
          <p className="line-clamp-2 text-sm text-gray-600">
            {note.assessment || "-"}
          </p>
        </div>
      </div>

      {/* Tags */}
      {note.tags && note.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-200 pt-4">
          {note.tags.slice(0, 3).map((tag, index) => (
            <span
              key={`${tag}-${index}`}
              className="inline-flex items-center rounded-md bg-[#D1EAFF] px-2 py-1 text-xs text-[#2B5379]"
            >
              {tag}
            </span>
          ))}

          {note.tags.length > 3 && (
            <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600">
              +{note.tags.length - 3} lainnya
            </span>
          )}
        </div>
      )}

      {/* Follow-up Date */}
      {note.followUpDate && (
        <div className="mt-3 border-t border-gray-200 pt-3">
          <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-700">
            <Calendar className="h-3.5 w-3.5" />
            <span>Follow-up: {formatDate(note.followUpDate)}</span>
          </div>
        </div>
      )}
    </div>
  );
}