"use client";

import {
  X,
  Mail,
  Phone,
  MapPin,
  AlertCircle,
  FileText,
  Calendar,
  Clock,
  Edit,
} from "lucide-react";
import { useEffect, useState } from "react";
import EditMedicalModal from "../notes/editmedicalmodal";
import { getPatientDetail, getNoteById } from "@/lib/api/psychologist";
import SessionNoteModal from "./sessionnotemodal";
import type {
  PsychologistPatientDetail,
  SessionNote,
} from "@/lib/types/psychologist";

interface PatientDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string | null;
}

export default function PatientDetailModal({
  isOpen,
  onClose,
  patientId,
}: PatientDetailModalProps) {
  const [loading, setLoading] = useState(false);
  const [patient, setPatient] = useState<PsychologistPatientDetail | null>(
    null
  );

  const [selectedNote, setSelectedNote] = useState<SessionNote | null>(null);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [loadingNote, setLoadingNote] = useState(false);
  const [noteError, setNoteError] = useState<string | null>(null);
  const [isEditMedicalOpen, setIsEditMedicalOpen] = useState(false);

  useEffect(() => {
    if (isOpen && patientId) {
      fetchPatientDetail();
    }

    if (!isOpen) {
      setPatient(null);
      setSelectedNote(null);
      setIsNoteModalOpen(false);
      setNoteError(null);
      setIsEditMedicalOpen(false);
    }
  }, [isOpen, patientId]);

  const formatDate = (date?: string | Date | null) => {
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
  };

  const fetchPatientDetail = async () => {
    if (!patientId) return;

    setLoading(true);
    setNoteError(null);

    try {
      const data = await getPatientDetail(patientId);
      setPatient(data);
    } catch (error) {
      console.error("Failed to fetch patient detail:", error);
      setPatient(null);
    } finally {
      setLoading(false);
    }
  };

  const handleViewNote = async (noteId: string) => {
    setLoadingNote(true);
    setNoteError(null);

    try {
      const note = await getNoteById(noteId);
      setSelectedNote(note);
      setIsNoteModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch note:", error);
      setNoteError("Catatan untuk sesi ini tidak ditemukan.");
    } finally {
      setLoadingNote(false);
    }
  };

  const handleMedicalUpdateSuccess = async () => {
    await fetchPatientDetail();
  };

  if (!isOpen) return null;

  const sessionHistory = patient?.sessionHistory ?? [];

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        onClick={onClose}
      >
        <div
          className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white p-6">
            <div>
              <h2 className="text-xl font-semibold text-[#2B5379]">
                Detail Pasien
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Informasi lengkap pasien
              </p>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-2 transition-colors hover:bg-gray-100"
              type="button"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#2B5379] border-t-transparent" />
              <p className="text-gray-600">Memuat data pasien...</p>
            </div>
          ) : patient ? (
            <div className="space-y-6 p-6">
              {/* Header Pasien */}
              <div className="rounded-lg bg-[#D1EAFF] p-4">
                <h3 className="text-lg font-semibold text-[#2B5379]">
                  {patient.name}
                </h3>

                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                  {patient.age && <span>{patient.age} tahun</span>}

                  {patient.gender && (
                    <span>
                      {patient.age ? "• " : ""}
                      {String(patient.gender).toLowerCase() === "male"
                        ? "Laki-laki"
                        : "Perempuan"}
                    </span>
                  )}
                </div>
              </div>

              {/* Informasi Kontak */}
              <div className="space-y-3">
                <h4 className="font-semibold text-[#2B5379]">
                  Informasi Kontak
                </h4>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                    <Mail className="h-5 w-5 shrink-0 text-gray-600" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-600">Email</p>
                      <p className="break-words text-sm font-medium text-gray-900">
                        {patient.email || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                    <Phone className="h-5 w-5 shrink-0 text-gray-600" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-600">Telepon</p>
                      <p className="break-words text-sm font-medium text-gray-900">
                        {patient.phone || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gray-600" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-600">Alamat</p>
                      <p className="break-words text-sm font-medium text-gray-900">
                        {patient.address || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informasi Medis */}
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="font-semibold text-[#2B5379]">
                    Informasi Medis
                  </h4>

                  <button
                    onClick={() => setIsEditMedicalOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#D1EAFF] px-3 py-1.5 text-sm text-[#2B5379] transition-colors hover:bg-[#2B5379] hover:text-white"
                    type="button"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <p className="mb-2 text-xs font-medium text-blue-900">
                      Diagnosis
                    </p>

                    {patient.diagnosis && patient.diagnosis.length > 0 ? (
                      <ul className="space-y-1">
                        {patient.diagnosis.map((diagnosis, index) => (
                          <li key={index} className="text-sm text-blue-700">
                            • {diagnosis}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-blue-700">-</p>
                    )}
                  </div>

                  <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
                    <p className="mb-2 text-xs font-medium text-orange-900">
                      Obat Saat Ini
                    </p>

                    {patient.currentMedication &&
                    patient.currentMedication.length > 0 ? (
                      <ul className="space-y-1">
                        {patient.currentMedication.map((medication, index) => (
                          <li key={index} className="text-sm text-orange-700">
                            • {medication}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-orange-700">-</p>
                    )}
                  </div>

                  <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                    <p className="mb-2 text-xs font-medium text-red-900">
                      Alergi
                    </p>

                    {patient.allergies && patient.allergies.length > 0 ? (
                      <ul className="space-y-1">
                        {patient.allergies.map((allergy, index) => (
                          <li key={index} className="text-sm text-red-700">
                            • {allergy}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-red-700">-</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Statistik Sesi */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-lg bg-gray-50 p-4 text-center">
                  <p className="mb-1 text-xs text-gray-600">Total Sesi</p>
                  <p className="text-2xl font-bold text-[#2B5379]">
                    {patient.totalSessions}
                  </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-4 text-center">
                  <p className="mb-1 text-xs text-gray-600">Sesi Pertama</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(patient.firstSessionDate)}
                  </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-4 text-center">
                  <p className="mb-1 text-xs text-gray-600">Sesi Terakhir</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(patient.lastSessionDate)}
                  </p>
                </div>
              </div>

              {noteError && (
                <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                  <p className="text-sm text-red-700">{noteError}</p>
                </div>
              )}

              {/* Riwayat Sesi - 🟢 PERBAIKAN TAMPILAN STATUS DI SINI */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-[#2B5379]">
                    Riwayat Sesi
                  </h4>

                  <p className="text-xs text-gray-500 font-medium">
                    {sessionHistory.length} sesi tercatat
                  </p>
                </div>

                {sessionHistory.length > 0 ? (
                  <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
                    {sessionHistory.map((session) => {
                      const canOpenNote =
                        Boolean(session.hasNotes) && Boolean(session.noteId);

                      const statusUpper = String(session.status || "").toUpperCase();

                      return (
                        <button
                          key={session.id}
                          onClick={() => {
                            if (canOpenNote) {
                              handleViewNote(String(session.noteId));
                            }
                          }}
                          disabled={!canOpenNote || loadingNote}
                          className={`flex w-full items-center justify-between rounded-xl border p-3.5 transition-all shadow-xs ${
                            canOpenNote
                              ? "cursor-pointer border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
                              : "cursor-not-allowed border-gray-200 bg-gray-50/80"
                          } ${loadingNote ? "cursor-wait opacity-50" : ""}`}
                          type="button"
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-left space-y-1">
                              <p className="text-sm font-bold text-gray-900">
                                {session.service}
                              </p>

                              <div className="flex flex-wrap items-center gap-2 text-xs">
                                <span className="flex items-center gap-1 font-semibold text-slate-700">
                                  <Calendar className="h-3.5 w-3.5 text-[#2B5379]" />
                                  {formatDate(session.date)}
                                </span>
                                <span className="text-slate-300">•</span>
                                <span className="flex items-center gap-1 font-semibold text-[#2B5379]">
                                  <Clock className="h-3.5 w-3.5" />
                                  {session.time || "-"}
                                </span>
                                <span className="text-slate-300">•</span>

                                {/* 🟢 BADGE STATUS JELAS DAN TEBAL */}
                                <span
                                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                    statusUpper === "COMPLETED" || statusUpper === "SELESAI"
                                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                      : statusUpper === "CANCELLED" || statusUpper === "REJECTED" || statusUpper === "DIBATALKAN"
                                      ? "bg-rose-100 text-rose-800 border border-rose-200"
                                      : "bg-blue-100 text-blue-800 border border-blue-200"
                                  }`}
                                >
                                  {statusUpper === "COMPLETED" || statusUpper === "SELESAI"
                                    ? "Selesai"
                                    : statusUpper === "CANCELLED" || statusUpper === "REJECTED" || statusUpper === "DIBATALKAN"
                                    ? "Dibatalkan"
                                    : "Terjadwal"}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex shrink-0 items-center gap-1.5 pl-2">
                            {canOpenNote ? (
                              <div className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1 text-[#2B5379]">
                                <FileText className="h-4 w-4" />
                                <span className="text-xs font-semibold">
                                  Lihat Catatan
                                </span>
                              </div>
                            ) : (
                              <span className="text-xs font-medium text-gray-400">
                                Tidak ada catatan
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
                    <p className="text-sm text-gray-600">
                      Belum ada riwayat sesi.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center">
              <p className="text-red-600">Gagal memuat data pasien</p>
              <button
                onClick={fetchPatientDetail}
                className="mt-4 rounded-lg bg-[#2B5379] px-4 py-2 text-white hover:bg-[#2B5379]/90"
                type="button"
              >
                Coba Lagi
              </button>
            </div>
          )}
        </div>
      </div>

      {patient && (
        <EditMedicalModal
          isOpen={isEditMedicalOpen}
          onClose={() => setIsEditMedicalOpen(false)}
          onSuccess={handleMedicalUpdateSuccess}
          patientId={patient.id}
          initialData={{
            diagnosis: patient.diagnosis || [],
            currentMedication: patient.currentMedication || [],
            allergies: patient.allergies || [],
          }}
        />
      )}

      <SessionNoteModal
        isOpen={isNoteModalOpen}
        onClose={() => {
          setIsNoteModalOpen(false);
          setSelectedNote(null);
        }}
        note={selectedNote}
      />
    </>
  );
}