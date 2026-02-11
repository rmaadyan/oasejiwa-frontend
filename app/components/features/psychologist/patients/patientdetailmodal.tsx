"use client";

import { X, Mail, Phone, MapPin, AlertCircle, FileText, Calendar, Clock, Edit } from "lucide-react";
import { useState, useEffect } from "react";
import { getPatientDetail, getNoteDetail } from "@/lib/api/psychologist";
import SessionNoteModal from "./sessionnotemodal";
import EditMedicalModal from "../notes/editmedicalmodal";
import type { PsychologistPatientDetail, SessionNote } from "@/lib/types/psychologist";

interface PatientDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: number | null;
}

export default function PatientDetailModal({ isOpen, onClose, patientId }: PatientDetailModalProps) {
  const [loading, setLoading] = useState(false);
  const [patient, setPatient] = useState<PsychologistPatientDetail | null>(null);
  const [selectedNote, setSelectedNote] = useState<SessionNote | null>(null);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [loadingNote, setLoadingNote] = useState(false);
  const [noteError, setNoteError] = useState<string | null>(null);
  const [isEditMedicalOpen, setIsEditMedicalOpen] = useState(false); // Pindahkan ke sini

  useEffect(() => {
    if (isOpen && patientId) {
      fetchPatientDetail();
    }
  }, [isOpen, patientId]);

  const fetchPatientDetail = async () => {
    if (!patientId) return;
    
    setLoading(true);
    try {
      const data = await getPatientDetail(patientId);
      setPatient(data);
    } catch (error) {
      console.error("Failed to fetch patient detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewNote = async (sessionId: number) => {
    setLoadingNote(true);
    setNoteError(null);
    
    try {
      const note = await getNoteDetail(sessionId);
      setSelectedNote(note);
      setIsNoteModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch note:", error);
      setNoteError(`Catatan untuk sesi ini tidak ditemukan (Session ID: ${sessionId})`);
      alert(`Catatan tidak ditemukan atau belum dibuat untuk sesi ini.\n\nSession ID: ${sessionId}\n\nSilakan hubungi admin jika masalah berlanjut.`);
    } finally {
      setLoadingNote(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
        <div 
          className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
            <div>
              <h2 className="text-xl font-semibold text-[#2B5379]">Detail Pasien</h2>
              <p className="text-sm text-gray-600 mt-1">Informasi lengkap pasien</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 border-4 border-[#2B5379] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Memuat data pasien...</p>
            </div>
          ) : patient ? (
            <div className="p-6 space-y-6">
              {/* Patient Info */}
              <div className="p-4 bg-[#D1EAFF] rounded-lg">
                <h3 className="text-lg font-semibold text-[#2B5379]">{patient.name}</h3>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-600">
                  {patient.age && <span>{patient.age} tahun</span>}
                  {patient.gender && <span>• {patient.gender === "male" ? "Laki-laki" : "Perempuan"}</span>}
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-[#2B5379]">Informasi Kontak</h4>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-xs text-gray-600">Email</p>
                      <p className="text-sm font-medium text-gray-900">{patient.email || "-"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-xs text-gray-600">Telepon</p>
                      <p className="text-sm font-medium text-gray-900">{patient.phone || "-"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-600">Alamat</p>
                      <p className="text-sm font-medium text-gray-900">{patient.address || "-"}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-[#2B5379]">Kontak Darurat</h4>
                  
                  {patient.emergencyContact ? (
                    <>
                      <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                        <div>
                          <p className="text-xs text-red-600">Nama</p>
                          <p className="text-sm font-medium text-gray-900">{patient.emergencyContact.name}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                        <div>
                          <p className="text-xs text-red-600">Telepon</p>
                          <p className="text-sm font-medium text-gray-900">{patient.emergencyContact.phone}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                        <div>
                          <p className="text-xs text-red-600">Hubungan</p>
                          <p className="text-sm font-medium text-gray-900">{patient.emergencyContact.relation}</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-gray-500 p-3">Tidak ada kontak darurat</p>
                  )}
                </div>
              </div>

              {/* Medical Info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-[#2B5379]">Informasi Medis</h4>
                  <button
                    onClick={() => setIsEditMedicalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#2B5379] bg-[#D1EAFF] rounded-lg hover:bg-[#2B5379] hover:text-white transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-blue-900 font-medium mb-2">Diagnosis</p>
                    {patient.diagnosis && patient.diagnosis.length > 0 ? (
                      <ul className="space-y-1">
                        {patient.diagnosis.map((d, i) => (
                          <li key={i} className="text-sm text-blue-700">• {d}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-blue-700">-</p>
                    )}
                  </div>

                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-xs text-orange-900 font-medium mb-2">Obat Saat Ini</p>
                    {patient.currentMedication && patient.currentMedication.length > 0 ? (
                      <ul className="space-y-1">
                        {patient.currentMedication.map((m, i) => (
                          <li key={i} className="text-sm text-orange-700">• {m}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-orange-700">-</p>
                    )}
                  </div>

                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-xs text-red-900 font-medium mb-2">Alergi</p>
                    {patient.allergies && patient.allergies.length > 0 ? (
                      <ul className="space-y-1">
                        {patient.allergies.map((a, i) => (
                          <li key={i} className="text-sm text-red-700">• {a}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-red-700">-</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Session Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-xs text-gray-600 mb-1">Total Sesi</p>
                  <p className="text-2xl font-bold text-[#2B5379]">{patient.totalSessions}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-xs text-gray-600 mb-1">Sesi Pertama</p>
                  <p className="text-sm font-medium text-gray-900">{patient.firstSessionDate}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-xs text-gray-600 mb-1">Sesi Terakhir</p>
                  <p className="text-sm font-medium text-gray-900">{patient.lastSessionDate || "-"}</p>
                </div>
              </div>

              {/* Error Message for Note */}
              {noteError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-red-700">{noteError}</p>
                </div>
              )}

              {/* Session History */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-[#2B5379]">Riwayat Sesi</h4>
                  <p className="text-xs text-gray-500">{patient.sessionHistory.length} sesi tercatat</p>
                </div>
                
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {patient.sessionHistory.map((session) => (
                    <button
                      key={session.id}
                      onClick={() => session.hasNotes && handleViewNote(session.id)}
                      disabled={!session.hasNotes || loadingNote}
                      className={`w-full flex items-center justify-between p-3 border rounded-lg transition-all ${
                        session.hasNotes 
                          ? 'bg-gray-50 border-gray-200 hover:bg-blue-50 hover:border-blue-300 cursor-pointer' 
                          : 'bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed'
                      } ${loadingNote ? 'opacity-50 cursor-wait' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full shrink-0 ${
                          session.status === "completed" ? "bg-green-500" : 
                          session.status === "cancelled" ? "bg-red-500" : "bg-gray-400"
                        }`} />
                        <div className="text-left">
                          <p className="text-sm font-medium text-gray-900">{session.service}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-600 mt-0.5">
                            <Calendar className="w-3 h-3" />
                            <span>{session.date}</span>
                            <span>•</span>
                            <Clock className="w-3 h-3" />
                            <span>{session.time}</span>
                            <span>•</span>
                            <span className="capitalize">{session.status === "completed" ? "Selesai" : session.status === "cancelled" ? "Dibatalkan" : "Terjadwal"}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {session.hasNotes ? (
                          <>
                            <FileText className="w-4 h-4 text-[#2B5379]" />
                            <span className="text-xs text-[#2B5379] font-medium">Lihat Catatan</span>
                          </>
                        ) : (
                          <span className="text-xs text-gray-400">Tidak ada catatan</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Last Notes */}
              {patient.lastNotes && (
                <div className="p-4 bg-[#D1EAFF] border border-[#2B5379]/20 rounded-lg">
                  <p className="text-xs text-[#2B5379] font-medium mb-2">Catatan Terakhir</p>
                  <p className="text-sm text-gray-700">{patient.lastNotes}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 font-medium">Gagal memuat data pasien</p>
              <p className="text-sm text-gray-500 mt-2">Silakan coba lagi nanti</p>
            </div>
          )}
        </div>
      </div>

      {/* Session Note Modal */}
      <SessionNoteModal
        isOpen={isNoteModalOpen}
        onClose={() => {
          setIsNoteModalOpen(false);
          setSelectedNote(null);
          setNoteError(null);
        }}
        note={selectedNote}
      />

      {/* Edit Medical Info Modal */}
      {patient && (
        <EditMedicalModal
          isOpen={isEditMedicalOpen}
          onClose={() => setIsEditMedicalOpen(false)}
          onSuccess={() => {
            fetchPatientDetail();
            setIsEditMedicalOpen(false);
          }}
          patientId={patient.id}
          initialData={{
            diagnosis: patient.diagnosis,
            currentMedication: patient.currentMedication,
            allergies: patient.allergies
          }}
        />
      )}
    </>
  );
}
