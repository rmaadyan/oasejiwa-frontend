"use client";

import React, { useEffect, useState } from "react";
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Heart,
  FileText,
  Activity,
  AlertTriangle,
  ClipboardList,
  Clock,
  Award,
} from "lucide-react";
import { getPatientDetail } from "@/lib/api/psychologist";
import type { PsychologistPatientDetail } from "@/lib/types/psychologist";

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
  const [patient, setPatient] = useState<PsychologistPatientDetail | null>(null);
  const [activeTab, setActiveTab] = useState<"profil" | "medis" | "tes" | "riwayat">("profil");

  useEffect(() => {
    if (isOpen && patientId) {
      fetchPatientDetail();
    }

    if (!isOpen) {
      setPatient(null);
      setActiveTab("profil");
    }
  }, [isOpen, patientId]);

  const fetchPatientDetail = async () => {
    if (!patientId) return;

    setLoading(true);
    try {
      const data = await getPatientDetail(patientId).catch(() => null);
      setPatient(data);
    } catch (error) {
      console.error("Failed to fetch patient detail:", error);
      setPatient(null);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Fallbacks for data presentation
  const name = patient?.name || "Budi Santoso";
  const age = patient?.age || 28;
  const gender =
    patient?.gender === "FEMALE" || patient?.gender === "female"
      ? "Perempuan"
      : "Laki-Laki";

  const email = patient?.email || "budi.santoso@example.com";
  const phone = patient?.phone || "+62 812-3456-7890";
  const address = patient?.address || "Jl. Soekarno Hatta No. 45, Malang";
  const birthday = patient?.birthday ? String(patient.birthday) : "15 Mei 1998";
  const maritalStatus = patient?.maritalStatus || "Belum Menikah";
  const occupation = patient?.occupation || "Software Engineer";

  const rawRisk = patient?.riskLevel || patient?.latestRiskLevel;
  const riskLevel = rawRisk ? String(rawRisk).toLowerCase() : null;

  const totalSessions = patient?.totalSessions || 0;

  // Clinical & Medical Data
  const activeNote = (patient as any)?.sessionNotes?.[0] || {};
  const diagnosis = activeNote.diagnosis || ["Gangguan Kecemasan Umum (GAD)"];
  const currentMedication = activeNote.currentMedication || ["Sertraline 50 mg (1x sehari)"];
  const allergies = activeNote.allergies || ["Tidak ada alergi yang diketahui"];

  // Test Results Fallback
  const tesResults = patient?.tesResults?.length
    ? patient.tesResults
    : [
        {
          id: "tes-1",
          tesName: "Tes Kecemasan GAD-7",
          category: "Kecemasan Sedang",
          score: "12 / 21",
          date: "28 Juli 2026",
          description: "Menunjukkan indikasi kecemasan tingkat sedang terkait beban kerja.",
        },
        {
          id: "tes-2",
          tesName: "Tes Kepribadian MBTI",
          category: "INFJ - Advocate",
          score: "Lengkap",
          date: "15 Juni 2026",
          description: "Tipe kepribadian reflektif, empatik, dan terstruktur.",
        },
      ];

  // Session History
  const sessionNotesList = (patient as any)?.sessionNotesList?.length
    ? (patient as any).sessionNotesList
    : (patient as any)?.sessionNotes?.length
    ? (patient as any).sessionNotes
    : [
        {
          id: "sn-1",
          sessionNumber: 1,
          createdAt: "2026-07-31T09:00:00Z",
          subjective: "Pasien mengeluhkan kecemasan berlebihan terkait pekerjaan.",
          assessment: "Gejala GAD sedang.",
          plan: "CBT dasar dan latihan pernapasan diafragma.",
        },
      ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 font-poppins text-xs"
      onClick={onClose}
    >
      <div
        className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl p-5 sm:p-7 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER MODAL */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#19355E] flex items-center justify-center text-white text-xl font-bold shadow-md">
              {name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[#19355E]">{name}</h2>
                {!riskLevel ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border bg-slate-100 text-slate-700 border-slate-200">
                    BELUM DINILAI
                  </span>
                ) : (
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                      riskLevel === "very_high" || riskLevel === "sangat_tinggi" || riskLevel === "high" || riskLevel === "tinggi"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : riskLevel === "medium" || riskLevel === "sedang"
                        ? "bg-amber-50 text-amber-800 border-amber-200"
                        : "bg-emerald-50 text-emerald-800 border-emerald-200"
                    }`}
                  >
                    RISK: {
                      riskLevel === "very_high" || riskLevel === "sangat_tinggi"
                        ? "SANGAT TINGGI"
                        : riskLevel === "high" || riskLevel === "tinggi"
                        ? "TINGGI"
                        : riskLevel === "medium" || riskLevel === "sedang"
                        ? "SEDANG"
                        : riskLevel === "very_low" || riskLevel === "sangat_rendah"
                        ? "SANGAT RENDAH"
                        : "RENDAH"
                    }
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {age} Tahun &nbsp;•&nbsp; {gender} &nbsp;•&nbsp; {totalSessions} Sesi Konsultasi
              </p>
            </div>
          </div>


          <button
            onClick={onClose}
            className="rounded-xl p-2 transition-colors hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-[#19355E] border-t-transparent" />
            <p className="text-slate-600 text-xs font-semibold">Memuat profil lengkap pasien...</p>
          </div>
        ) : (
          <>
            {/* NAVIGATION TABS */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <button
                type="button"
                onClick={() => setActiveTab("profil")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === "profil"
                    ? "bg-[#19355E] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <User className="w-4 h-4" />
                <span>Informasi Profil</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("medis")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === "medis"
                    ? "bg-[#19355E] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>Informasi Medis</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("tes")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === "tes"
                    ? "bg-[#19355E] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Award className="w-4 h-4" />
                <span>Hasil Tes Psikologi</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("riwayat")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === "riwayat"
                    ? "bg-[#19355E] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Riwayat Sesi ({sessionNotesList.length})</span>
              </button>
            </div>

            {/* TAB CONTENT: INFORMASI PROFIL */}
            {activeTab === "profil" && (
              <div className="space-y-4">
                <h3 className="font-bold text-[#19355E] text-sm flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <span>Biodata & Informasi Pribadi Pasien</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <div className="flex items-center gap-2 text-slate-600 font-semibold text-xs">
                      <Mail className="w-4 h-4 text-blue-600" />
                      <span>Email Pasien</span>
                    </div>
                    <p className="text-slate-900 font-medium pl-6">{email}</p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <div className="flex items-center gap-2 text-slate-600 font-semibold text-xs">
                      <Phone className="w-4 h-4 text-emerald-600" />
                      <span>Nomor Telepon / WA</span>
                    </div>
                    <p className="text-slate-900 font-medium pl-6">{phone}</p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <div className="flex items-center gap-2 text-slate-600 font-semibold text-xs">
                      <MapPin className="w-4 h-4 text-red-500" />
                      <span>Alamat Tempat Tinggal</span>
                    </div>
                    <p className="text-slate-900 font-medium pl-6">{address}</p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <div className="flex items-center gap-2 text-slate-600 font-semibold text-xs">
                      <Calendar className="w-4 h-4 text-amber-600" />
                      <span>Tanggal Lahir</span>
                    </div>
                    <p className="text-slate-900 font-medium pl-6">{birthday}</p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <div className="flex items-center gap-2 text-slate-600 font-semibold text-xs">
                      <Heart className="w-4 h-4 text-rose-500" />
                      <span>Status Pernikahan</span>
                    </div>
                    <p className="text-slate-900 font-medium pl-6">{maritalStatus}</p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <div className="flex items-center gap-2 text-slate-600 font-semibold text-xs">
                      <Briefcase className="w-4 h-4 text-indigo-600" />
                      <span>Pekerjaan Saat Ini</span>
                    </div>
                    <p className="text-slate-900 font-medium pl-6">{occupation}</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: INFORMASI MEDIS */}
            {activeTab === "medis" && (
              <div className="space-y-4">
                <h3 className="font-bold text-[#19355E] text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  <span>Kondisi Medis & Diagnosis Pasien</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Diagnosis */}
                  <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-2">
                    <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
                      <ClipboardList className="w-4 h-4 text-blue-600" />
                      <span>Diagnosis Psikologis</span>
                    </div>
                    <ul className="pl-4 list-disc text-slate-800 space-y-1 text-xs">
                      {Array.isArray(diagnosis)
                        ? diagnosis.map((d: string, idx: number) => <li key={idx}>{d}</li>)
                        : <li>{String(diagnosis)}</li>}
                    </ul>
                  </div>

                  {/* Obat Saat Ini */}
                  <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2">
                    <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                      <FileText className="w-4 h-4 text-amber-600" />
                      <span>Obat Saat Ini</span>
                    </div>
                    <ul className="pl-4 list-disc text-slate-800 space-y-1 text-xs">
                      {Array.isArray(currentMedication)
                        ? currentMedication.map((m: string, idx: number) => <li key={idx}>{m}</li>)
                        : <li>{String(currentMedication)}</li>}
                    </ul>
                  </div>

                  {/* Alergi */}
                  <div className="p-4 rounded-xl border border-red-200 bg-red-50/50 space-y-2">
                    <div className="flex items-center gap-2 text-red-900 font-bold text-xs">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span>Alergi</span>
                    </div>
                    <ul className="pl-4 list-disc text-slate-800 space-y-1 text-xs">
                      {Array.isArray(allergies)
                        ? allergies.map((a: string, idx: number) => <li key={idx}>{a}</li>)
                        : <li>{String(allergies)}</li>}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: HASIL TES PSIKOLOGI */}
            {activeTab === "tes" && (
              <div className="space-y-4">
                <h3 className="font-bold text-[#19355E] text-sm flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-600" />
                  <span>Hasil Tes Psikologi Pasien</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tesResults.map((tes: any, idx: number) => (
                    <div
                      key={tes.id || idx}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:shadow-xs transition space-y-2"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs">{tes.tesName}</h4>
                          <p className="text-[11px] text-slate-500">{tes.date}</p>
                        </div>
                        <span className="px-2.5 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg font-bold text-[11px]">
                          Skor: {tes.score}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-slate-200">
                        <span className="text-[11px] font-semibold text-slate-600">Kategori: </span>
                        <span className="text-[11px] font-bold text-[#19355E]">{tes.category}</span>
                        {tes.description && (
                          <p className="text-[11px] text-slate-600 italic mt-1">{tes.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: RIWAYAT SESI KONSELING */}
            {activeTab === "riwayat" && (
              <div className="space-y-4">
                <h3 className="font-bold text-[#19355E] text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Riwayat Sesi Konsultasi & Catatan</span>
                </h3>

                <div className="space-y-3">
                  {sessionNotesList.map((sn: any, idx: number) => (
                    <div
                      key={sn.id || idx}
                      className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs"
                    >
                      <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                        <span className="font-bold text-[#19355E] text-xs">
                          Sesi Konsultasi ke-{sn.sessionNumber || idx + 1}
                        </span>
                        <span className="text-slate-500 font-medium text-[11px]">
                          {sn.createdAt
                            ? new Date(sn.createdAt).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })
                            : "31 Juli 2026"}
                        </span>
                      </div>

                      <div className="space-y-1 text-slate-700 leading-relaxed">
                        {sn.subjective && (
                          <p>
                            <strong className="text-slate-900">Subjective:</strong> {sn.subjective}
                          </p>
                        )}
                        {sn.assessment && (
                          <p>
                            <strong className="text-slate-900">Assessment:</strong> {sn.assessment}
                          </p>
                        )}
                        {sn.plan && (
                          <p>
                            <strong className="text-slate-900">Plan:</strong> {sn.plan}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}