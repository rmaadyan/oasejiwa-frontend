"use client";

import { Calendar, Clock, AlertTriangle } from "lucide-react";
import type { SessionNote } from "@/lib/types/psychologist";

interface NoteCardProps {
  note: SessionNote;
  onViewDetails: (note: SessionNote) => void;
}

export default function NoteCard({ note, onViewDetails }: NoteCardProps) {
  const getRiskBadge = () => {
    const styles = {
      low: { bg: "bg-green-100", text: "text-green-700", label: "Risiko Rendah" },
      medium: { bg: "bg-orange-100", text: "text-orange-700", label: "Risiko Sedang" },
      high: { bg: "bg-red-100", text: "text-red-700", label: "Risiko Tinggi" }
    };

    const style = styles[note.riskLevel || "low"];

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
        <AlertTriangle className="w-3 h-3" />
        {style.label}
      </span>
    );
  };

  return (
    <div
      onClick={() => onViewDetails(note)}
      className="bg-white rounded-lg border border-gray-200 p-5 hover:border-[#2B5379] hover:shadow-md transition-all cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-[#2B5379]">{note.patientName}</h3>
          <p className="text-sm text-gray-600">{note.service}</p>
        </div>
        {getRiskBadge()}
      </div>

      {/* Session Info */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
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

      {/* SOAP Preview */}
      <div className="space-y-2">
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-xs font-semibold text-gray-700 mb-1">Assessment</p>
          <p className="text-sm text-gray-600 line-clamp-2">{note.assessment}</p>
        </div>
      </div>

      {/* Tags */}
      {note.tags && note.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
          {note.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 bg-[#D1EAFF] text-[#2B5379] text-xs rounded-md"
            >
              {tag}
            </span>
          ))}
          {note.tags.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
              +{note.tags.length - 3} lainnya
            </span>
          )}
        </div>
      )}

      {/* Follow-up Date */}
      {note.followUpDate && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center gap-2 text-xs text-blue-700 bg-blue-50 px-3 py-2 rounded-lg">
            <Calendar className="w-3.5 h-3.5" />
            <span>Follow-up: {note.followUpDate}</span>
          </div>
        </div>
      )}
    </div>
  );
}
