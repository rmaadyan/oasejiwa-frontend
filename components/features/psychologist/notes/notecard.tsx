"use client";

import { Calendar, Clock, AlertTriangle, Eye, FileText, ArrowRight } from "lucide-react";
import type { SessionNote } from "@/lib/types/psychologist";

interface NoteCardProps {
  note: SessionNote;
  onViewDetails: (note: SessionNote) => void;
}

export default function NoteCard({ note, onViewDetails }: NoteCardProps) {
  const formatDate = (date?: string | Date | null) => {
    if (!date) return "-";

    const rawDate = String(date);

    if (/^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
      const [year, month, day] = rawDate.split("-").map(Number);

      return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(year, month - 1, day));
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return String(date);
    }

    return parsedDate.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
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
        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${style.bg} ${style.text} ${style.border}`}
      >
        <AlertTriangle className="h-3 w-3" />
        {style.label}
      </span>
    );
  };

  const sessionDate = formatDate(note.sessionDate || note.createdAt);
  const sessionTime = note.sessionTime || "09.00";
  const sessionNumber = note.sessionNumber || 1;
  const initialLetter = note.patientName ? note.patientName.charAt(0).toUpperCase() : "P";

  return (
    <div
      onClick={() => onViewDetails(note)}
      className="group cursor-pointer rounded-2xl border border-gray-200 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#2B5379]/40 hover:shadow-md flex flex-col justify-between"
    >
      <div>
        {/* Header Pasien & Risk */}
        <div className="mb-3.5 flex items-start justify-between gap-3 border-b border-gray-100 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#EAF4FD] text-[#234463] flex items-center justify-center font-bold text-sm shrink-0 border border-blue-100">
              {initialLetter}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-gray-900 text-base group-hover:text-[#2B5379] transition-colors truncate">
                {note.patientName || "Budi Santoso"}
              </h3>
              <p className="text-xs font-medium text-gray-500">
                {note.service || "Konseling Individu"}
              </p>
            </div>
          </div>

          {getRiskBadge()}
        </div>

        {/* Session Meta */}
        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-medium text-gray-600 bg-gray-50/80 p-2.5 rounded-xl border border-gray-100">
          <div className="flex items-center gap-1.5 text-[#234463] font-semibold">
            <Calendar className="h-3.5 w-3.5 text-[#2B5379]" />
            <span>{sessionDate}</span>
          </div>

          <span className="text-gray-300">•</span>

          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-gray-400" />
            <span>{sessionTime}</span>
          </div>

          <span className="text-gray-300">•</span>

          <span className="bg-blue-100/70 text-[#2B5379] px-2 py-0.5 rounded-md text-[11px] font-bold">
            Sesi ke-{sessionNumber}
          </span>
        </div>

        {/* Clinical Snippets */}
        <div className="space-y-2 mb-4">
          {note.subjective && (
            <div className="rounded-xl bg-blue-50/60 p-3 border border-blue-100">
              <p className="mb-1 text-[11px] font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1">
                <FileText className="w-3 h-3 text-blue-600" /> Keluhan Utama
              </p>
              <p className="line-clamp-2 text-xs text-blue-950 font-normal leading-relaxed">
                {note.subjective}
              </p>
            </div>
          )}

          {note.assessment && (
            <div className="rounded-xl bg-amber-50/60 p-3 border border-amber-100">
              <p className="mb-1 text-[11px] font-bold text-amber-900 uppercase tracking-wider">
                Assessment
              </p>
              <p className="line-clamp-2 text-xs text-amber-950 font-normal leading-relaxed">
                {note.assessment}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div>
        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5 pt-1">
            {note.tags.slice(0, 3).map((tag, index) => (
              <span
                key={`${tag}-${index}`}
                className="inline-flex items-center rounded-md bg-[#F0F7FF] px-2.5 py-0.5 text-[11px] font-medium text-[#2B5379] border border-blue-100"
              >
                {tag}
              </span>
            ))}
            {note.tags.length > 3 && (
              <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500">
                +{note.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-400 font-medium">Rekam Medis Terverifikasi</span>
          <button
            type="button"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#2B5379] group-hover:translate-x-0.5 transition-transform"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Lihat Detail</span>
            <ArrowRight className="w-3 h-3 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}