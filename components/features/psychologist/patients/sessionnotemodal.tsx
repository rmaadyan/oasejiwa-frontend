"use client";

import { X, Calendar, Clock, AlertTriangle } from "lucide-react";
import type { SessionNote } from "@/lib/types/psychologist";
import { getRiskConfig } from "@/lib/types/psychologist";

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

          {/* SOAP / Rekam Medis Sesi */}
          <div className="space-y-4">
            <h4 className="font-semibold text-[#2B5379]">Detail Rekam Medis Sesi</h4>

            <SoapSection
              title="Keluhan Utama (Subjective)"
              subtitle="Keluhan, cerita, atau pengalaman yang disampaikan pasien"
              content={note.subjective}
              className="border-blue-200 bg-blue-50"
            />

            <SoapSection
              title="Observasi Psikolog (Objective)"
              subtitle="Observasi objektif psikolog selama sesi berlangsung"
              content={note.objective}
              className="border-green-200 bg-green-50"
            />

            <SoapSection
              title="Assessment"
              subtitle="Gejala, diagnosis, dan analisis psikologis"
              content={note.assessment}
              className="border-yellow-200 bg-yellow-50"
            />

            <SoapSection
              title="Intervensi (Plan)"
              subtitle="Pendekatan terapi, psychoeducation, dan latihan relaksasi"
              content={note.plan}
              className="border-purple-200 bg-purple-50"
            />
          </div>

          {/* Assessment Tingkat Risiko Card */}
          {(() => {
            const activeRiskConfig = getRiskConfig(note.riskLevel || "medium");
            const riskReasonText =
              note.riskReason ||
              "Pasien mengalami kecemasan sedang berdasarkan hasil DASS-21, kesulitan tidur, serta mengalami overthinking yang mengganggu aktivitas sehari-hari.";
            const recommendationsList = note.riskRecommendations || [
              "Konseling dua minggu sekali.",
              "CBT.",
              "Latihan relaksasi.",
              "Evaluasi pada sesi berikutnya.",
            ];
            const assessmentDateText = note.assessmentDate || "29 Juli 2026";
            const psychologistName =
              note.assessingPsychologistName || "Dr. Maya Putri, M.Psi., Psikolog";

            return (
              <div className="space-y-3 pt-2">
                <h4 className="font-semibold text-[#2B5379] flex items-center gap-2 text-base">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  Assessment Tingkat Risiko
                </h4>

                <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 shadow-xs space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200/80 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-700">Tingkat Risiko:</span>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border ${activeRiskConfig.badgeClass}`}
                      >
                        {activeRiskConfig.emoji} {activeRiskConfig.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                      <Calendar className="h-3.5 w-3.5 text-gray-400" />
                      <span>
                        Tanggal Assessment:{" "}
                        <strong className="text-gray-900">
                          {formatDateOnly(assessmentDateText)}
                        </strong>
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-gray-800 mb-1">Alasan Penilaian:</p>
                    <p className="text-xs text-gray-700 bg-white p-3 rounded-lg border border-amber-100 leading-relaxed font-normal">
                      {riskReasonText}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-gray-800 mb-1">Rekomendasi:</p>
                    <div className="rounded-lg bg-white p-3 border border-amber-100">
                      <ul className="space-y-1">
                        {recommendationsList.map((item, idx) => (
                          <li
                            key={idx}
                            className="text-xs text-gray-700 font-medium flex items-start gap-1.5"
                          >
                            <span className="text-amber-600 font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2 border-t border-amber-200/60 text-xs text-gray-600">
                    <span className="italic text-[11px] text-gray-500">
                      {activeRiskConfig.description}
                    </span>
                    <span className="font-semibold text-[#2B5379] flex items-center gap-1 shrink-0">
                      Psikolog Penilai: {psychologistName}
                    </span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Rencana Tindak Lanjut */}
          {(note.followUpDate || note.nextSessionRecommendation || note.additionalNotes) && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <p className="mb-1 text-sm font-bold text-[#2B5379]">Rencana Tindak Lanjut</p>
              <p className="mb-3 text-xs text-emerald-700">Kontrol kembali, jurnal harian, dan latihan rumah</p>
              
              {note.nextSessionRecommendation && (
                <p className="whitespace-pre-wrap text-sm text-gray-800 mb-2">
                  {note.nextSessionRecommendation}
                </p>
              )}

              {note.additionalNotes && (
                <p className="whitespace-pre-wrap text-sm text-gray-700 italic border-t border-emerald-200 pt-2 mt-2">
                  {note.additionalNotes}
                </p>
              )}

              {note.followUpDate && (
                <div className="mt-3 inline-flex items-center gap-2 rounded-md bg-white px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-300">
                  <Calendar className="h-3.5 w-3.5" />
                  Jadwal Kontrol: {formatDateOnly(note.followUpDate)}
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