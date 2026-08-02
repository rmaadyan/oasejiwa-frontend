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

<<<<<<< Updated upstream
          {loading ? (
            <div className="p-12 text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#2B5379] border-t-transparent" />
              <p className="text-gray-600 text-sm">Memuat data rekam medis pasien...</p>
            </div>
          ) : (
            <div className="space-y-6 p-6">
              {/* Header Pasien Card */}
              <div className="rounded-xl bg-gradient-to-r from-[#234463] to-[#2B5379] p-5 text-white shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white/40 text-white flex items-center justify-center font-bold text-xl shrink-0">
                      {patient.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{patient.name}</h3>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-blue-100 font-medium">
                        <span className="bg-white/20 px-2.5 py-0.5 rounded-md">
                          {patient.age} Tahun
                        </span>
                        <span>•</span>
                        <span className="bg-white/20 px-2.5 py-0.5 rounded-md">
                          {String(patient.gender).toLowerCase() === "female" ||
                          String(patient.gender).toLowerCase() === "perempuan"
                            ? "Perempuan"
                            : "Laki-laki"}
                        </span>
                        <span>•</span>
                        <span className="bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 px-2.5 py-0.5 rounded-md font-semibold">
                          {patient.totalSessions} Sesi Terdaftar
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 1. Informasi Profil & Demografi Pasien */}
              <div className="space-y-3">
                <h4 className="font-semibold text-[#2B5379] flex items-center gap-2 text-base">
                  <User className="h-4 w-4 text-[#2B5379]" />
                  Informasi Profil Pasien
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="flex items-center gap-3 rounded-xl bg-gray-50 border border-gray-200 p-3">
                    <Mail className="h-5 w-5 shrink-0 text-[#2B5379]" />
                    <div className="min-w-0">
                      <p className="text-[11px] text-gray-500 font-medium">Email</p>
                      <p className="break-words text-xs font-semibold text-gray-900">
                        {patient.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl bg-gray-50 border border-gray-200 p-3">
                    <Phone className="h-5 w-5 shrink-0 text-[#2B5379]" />
                    <div className="min-w-0">
                      <p className="text-[11px] text-gray-500 font-medium">Nomor Telepon</p>
                      <p className="break-words text-xs font-semibold text-gray-900">
                        {patient.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl bg-gray-50 border border-gray-200 p-3">
                    <MapPin className="h-5 w-5 shrink-0 text-[#2B5379]" />
                    <div className="min-w-0">
                      <p className="text-[11px] text-gray-500 font-medium">Alamat</p>
                      <p className="break-words text-xs font-semibold text-gray-900">
                        {patient.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl bg-gray-50 border border-gray-200 p-3">
                    <Cake className="h-5 w-5 shrink-0 text-[#2B5379]" />
                    <div className="min-w-0">
                      <p className="text-[11px] text-gray-500 font-medium">Tanggal Lahir</p>
                      <p className="break-words text-xs font-semibold text-gray-900">
                        {formatDate(patient.birthday)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl bg-gray-50 border border-gray-200 p-3">
                    <Heart className="h-5 w-5 shrink-0 text-[#2B5379]" />
                    <div className="min-w-0">
                      <p className="text-[11px] text-gray-500 font-medium">Status Pernikahan</p>
                      <p className="break-words text-xs font-semibold text-gray-900">
                        {patient.maritalStatus}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl bg-gray-50 border border-gray-200 p-3">
                    <Briefcase className="h-5 w-5 shrink-0 text-[#2B5379]" />
                    <div className="min-w-0">
                      <p className="text-[11px] text-gray-500 font-medium">Pekerjaan</p>
                      <p className="break-words text-xs font-semibold text-gray-900">
                        {patient.occupation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informasi Medis Summary */}
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="font-semibold text-[#2B5379] flex items-center gap-2 text-base">
                    <ClipboardList className="h-4 w-4 text-[#2B5379]" />
                    Informasi Medis Pasien
                  </h4>

                  <button
                    onClick={() => setIsEditMedicalOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#D1EAFF] px-3 py-1 text-xs font-semibold text-[#2B5379] transition-colors hover:bg-[#2B5379] hover:text-white"
                    type="button"
                  >
                    <Edit className="h-3.5 w-3.5" />
                    Edit Informasi Medis
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-3.5 shadow-sm">
                    <p className="mb-1.5 text-xs font-bold text-blue-900">
                      Diagnosis
                    </p>
                    <ul className="space-y-1">
                      {patient.diagnosis?.map((item, index) => (
                        <li key={index} className="text-xs font-medium text-blue-800">
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl border border-orange-200 bg-orange-50/70 p-3.5 shadow-sm">
                    <p className="mb-1.5 text-xs font-bold text-orange-900">
                      Obat Saat Ini
                    </p>
                    <ul className="space-y-1">
                      {patient.currentMedication?.map((item, index) => (
                        <li key={index} className="text-xs font-medium text-orange-800">
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl border border-red-200 bg-red-50/70 p-3.5 shadow-sm">
                    <p className="mb-1.5 text-xs font-bold text-red-900">
                      Alergi
                    </p>
                    <ul className="space-y-1">
                      {patient.allergies?.map((item, index) => (
                        <li key={index} className="text-xs font-medium text-red-800">
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* 2. Hasil Tes Psikologi */}
              <div className="space-y-3">
                <h4 className="font-semibold text-[#2B5379] flex items-center gap-2 text-base">
                  <Activity className="h-4 w-4 text-[#2B5379]" />
                  Hasil Tes Psikologi Pasien
                </h4>

                {loadingTes ? (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-6 text-center animate-pulse space-y-3">
                    <div className="h-4 w-48 bg-emerald-200 rounded mx-auto" />
                    <div className="h-3 w-32 bg-emerald-200 rounded mx-auto" />
                    <p className="text-xs text-emerald-700">Memuat hasil tes psikologi...</p>
                  </div>
                ) : tesResultsList.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50/80 p-6 text-center">
                    <Activity className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-xs font-semibold text-gray-700">Belum Ada Hasil Tes Psikologi</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">Pasien belum menyelesaikan tes psikologi online di platform.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tesResultsList.map((tesItem: any, index: number) => {
                      const itemKey = tesItem.id || `tes-${index}`;
                      const isExpanded = isTesDetailOpen[itemKey] ?? (index === 0);

                      return (
                        <div key={itemKey} className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 shadow-sm transition hover:border-emerald-300">
                          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-100 pb-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <h5 className="font-bold text-gray-900 text-sm">
                                  {tesItem.namaTes}
                                </h5>
                                <span className="rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-2.5 py-0.5 text-xs">
                                  {tesItem.percentage}%
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 mt-1">
                                Kategori: <span className="font-semibold text-gray-800">{tesItem.kategoriNama || tesItem.jenisTes || "Psikologi"}</span> • Tanggal: <span className="font-semibold text-gray-800">{formatDate(tesItem.createdAt)}</span>
                              </p>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <p className="text-[11px] text-gray-500">Diagnosis Tes</p>
                                <p className="text-xs font-bold text-emerald-700">{tesItem.diagnosis || tesItem.kategoriNama || "-"}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  setIsTesDetailOpen((prev) => ({
                                    ...prev,
                                    [itemKey]: !isExpanded,
                                  }))
                                }
                                className="flex items-center gap-1 rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-50 transition shadow-xs"
                              >
                                {isExpanded ? (
                                  <span className="flex items-center gap-1">
                                    Sembunyikan Detail <ChevronUp className="h-4 w-4" />
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1">
                                    Lihat Detail <ChevronDown className="h-4 w-4" />
                                  </span>
                                )}
                              </button>
                            </div>
                          </div>

                          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                            <div className="rounded-lg bg-white p-2 border border-emerald-100">
                              <p className="text-[10px] text-gray-500">Skor</p>
                              <p className="text-sm font-bold text-gray-900">{tesItem.totalScore}/{tesItem.maxScore} <span className="text-xs text-emerald-600 font-semibold">({tesItem.percentage}%)</span></p>
                            </div>
                            <div className="rounded-lg bg-white p-2 border border-emerald-100">
                              <p className="text-[10px] text-gray-500">Diagnosis</p>
                              <p className="text-xs font-bold text-emerald-700">{tesItem.diagnosis || tesItem.kategoriNama || "-"}</p>
                            </div>
                            <div className="rounded-lg bg-white p-2 border border-emerald-100">
                              <p className="text-[10px] text-gray-500">Tanggal Tes</p>
                              <p className="text-xs font-semibold text-gray-800">{formatDate(tesItem.createdAt)}</p>
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="mt-3 rounded-lg border border-emerald-200 bg-white p-3.5 text-xs space-y-2.5">
                              <div>
                                <p className="font-bold text-emerald-900 mb-0.5">Detail Diagnosis:</p>
                                <p className="text-gray-700 leading-relaxed">
                                  {tesItem.detailDiagnosis || `Berdasarkan hasil ${tesItem.namaTes}, pasien berada pada kategori ${tesItem.kategoriNama || "-"}.`}
                                </p>
                              </div>

                              {tesItem.interpretasi && (
                                <div>
                                  <p className="font-bold text-emerald-900 mb-0.5">Interpretasi:</p>
                                  <p className="text-gray-700 leading-relaxed">{tesItem.interpretasi}</p>
                                </div>
                              )}

                              {tesItem.rekomendasi && tesItem.rekomendasi.length > 0 && (
                                <div>
                                  <p className="font-semibold text-gray-800 mb-1">Rekomendasi:</p>
                                  <ul className="space-y-1 text-gray-600 pl-1">
                                    {tesItem.rekomendasi.map((rec: string, idx: number) => (
                                      <li key={idx} className="flex items-start gap-1.5">
                                        <span className="text-emerald-600 font-bold">•</span>
                                        <span>{rec}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 3. Card Assessment Tingkat Risiko */}
              {(() => {
                const activeRiskConfig = getRiskConfig(patient.riskLevel || "medium");
                const riskReasonText =
                  patient.riskReason ||
                  "Pasien mengalami kecemasan sedang berdasarkan hasil DASS-21, kesulitan tidur, serta mengalami overthinking yang mengganggu aktivitas sehari-hari.";
                const recommendationsList = patient.riskRecommendations || [
                  "Konseling dua minggu sekali.",
                  "CBT.",
                  "Latihan relaksasi.",
                  "Evaluasi pada sesi berikutnya.",
                ];
                const assessmentDateText = patient.assessmentDate || "29 Juli 2026";
                const psychologistName =
                  patient.assessingPsychologistName || "Dr. Maya Putri, M.Psi., Psikolog";

                return (
                  <div className="space-y-3">
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
                              {formatDate(assessmentDateText)}
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
                          <UserCheck className="h-3.5 w-3.5" /> Psikolog: {psychologistName}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Statistik Sesi */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-gray-50 border border-gray-200 p-3.5 text-center">
                  <p className="mb-0.5 text-xs text-gray-500 font-medium">Total Sesi</p>
                  <p className="text-2xl font-extrabold text-[#2B5379]">
                    {patient.totalSessions}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 border border-gray-200 p-3.5 text-center">
                  <p className="mb-0.5 text-xs text-gray-500 font-medium">Sesi Pertama</p>
                  <p className="text-xs font-bold text-gray-900">
                    {formatDate(patient.firstSessionDate)}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 border border-gray-200 p-3.5 text-center">
                  <p className="mb-0.5 text-xs text-gray-500 font-medium">Sesi Terakhir</p>
                  <p className="text-xs font-bold text-gray-900">
                    {formatDate(patient.lastSessionDate)}
                  </p>
                </div>
              </div>

              {noteError && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                  <p className="text-xs text-red-700">{noteError}</p>
                </div>
              )}

              {/* Riwayat Sesi - 🟢 PERBAIKAN TAMPILAN STATUS DI SINI */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-[#2B5379] flex items-center gap-2 text-base">
                    <Clock className="h-4 w-4 text-[#2B5379]" />
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

                              <p className="mt-1 text-xs text-gray-500 italic">
                                Catatan:{" "}
                                {isCompleted
                                  ? "Rekam medis sesi lengkap tersedia"
                                  : "Belum ada catatan"}
                              </p>
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
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center">
                    <p className="text-xs text-gray-500">Belum ada riwayat sesi.</p>
                  </div>
                )}
              </div>
            </div>
          )}
=======
          <button
            onClick={onClose}
            className="rounded-xl p-2 transition-colors hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
>>>>>>> Stashed changes
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