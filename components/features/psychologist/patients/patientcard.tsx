"use client";

import { Calendar } from "lucide-react";
import type { PsychologistPatient } from "@/lib/types/psychologist";

interface PatientCardProps {
  patient: PsychologistPatient;
  onViewDetails: (patient: PsychologistPatient) => void;
}

export default function PatientCard({
  patient,
  onViewDetails,
}: PatientCardProps) {
  const formatDate = (date?: string | Date | null) => {
    if (!date) return "-";

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

  return (
    <div
      onClick={() => onViewDetails(patient)}
      className="bg-white rounded-lg border border-gray-200 p-6 hover:border-[#2B5379] hover:shadow-md transition-all cursor-pointer"
    >
      {/* Header */}
      <div className="mb-4">
        <h3 className="font-semibold text-[#2B5379] text-lg">
          {patient.name}
        </h3>
        <p className="text-sm text-gray-600 mt-1">{patient.email}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-2 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Total Sesi</p>
          <p className="text-lg font-bold text-[#2B5379]">
            {patient.totalSessions}
          </p>
        </div>

        <div className="text-center p-2 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Sesi Pertama</p>
          <p className="text-xs font-medium text-gray-900">
            {formatDate(patient.firstSessionDate)}
          </p>
        </div>

        <div className="text-center p-2 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Sesi Terakhir</p>
          <p className="text-xs font-medium text-gray-900">
            {formatDate(patient.lastSessionDate)}
          </p>
        </div>
      </div>

      {/* Upcoming Session */}
      {patient.upcomingSessionDate && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
          <div className="flex-1">
            <p className="text-xs text-blue-900 font-medium">
              Sesi Mendatang
            </p>
            <p className="text-xs text-blue-700">
              {formatDate(patient.upcomingSessionDate)}
            </p>
          </div>
        </div>
      )}

      {/* Notes Preview */}
      {patient.notes && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-600 line-clamp-2">{patient.notes}</p>
        </div>
      )}
    </div>
  );
}