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
  FileDown,
  Eye,
} from "lucide-react";
import { getPatientDetail } from "@/lib/api/psychologist";
import type { PsychologistPatientDetail } from "@/lib/types/psychologist";
import { calculateDass21Result } from "@/lib/utils/dass21-calculator";
import { downloadDass21Pdf } from "@/lib/utils/dass21-pdf-generator";
import TestResultDetailModal from "./TestResultDetailModal";

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
  const [selectedTestForDetail, setSelectedTestForDetail] = useState<any | null>(null);

  useEffect(() => {
    if (isOpen && patientId) {
      fetchPatientDetail();
    }

    if (!isOpen) {
      setPatient(null);
      setActiveTab("profil");
      setSelectedTestForDetail(null);
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
  const name = patient?.name || "-";
  const age = patient?.age ? `${patient.age} Tahun` : "-";
  const gender =
    patient?.gender === "FEMALE" || patient?.gender === "female"
      ? "Perempuan"
      : patient?.gender === "MALE" || patient?.gender === "male"
      ? "Laki-Laki"
      : "-";

  const email = patient?.email || "-";
  const phone = patient?.phone || "-";
  const address = patient?.address || "-";
  const birthday = patient?.birthday ? String(patient.birthday) : "-";
  const maritalStatus = patient?.maritalStatus || "-";
  const occupation = patient?.occupation || "-";

  const rawRisk = patient?.riskLevel || patient?.latestRiskLevel;
  const riskLevel = rawRisk ? String(rawRisk).toLowerCase() : null;

  const totalSessions = patient?.totalSessions || 0;

  // Clinical & Medical Data (NO hardcoded mock fallbacks)
  const activeNote = (patient as any)?.sessionNotes?.[0] || {};
  const diagnosis = (patient as any)?.diagnosis?.length
    ? (patient as any).diagnosis
    : activeNote.diagnosis?.length
    ? activeNote.diagnosis
    : ["Belum ada diagnosis."];

  const currentMedication = (patient as any)?.currentMedication?.length
    ? (patient as any).currentMedication
    : activeNote.currentMedication?.length
    ? activeNote.currentMedication
    : ["Belum ada obat yang tercatat."];

  const allergies = (patient as any)?.allergies?.length
    ? (patient as any).allergies
    : activeNote.allergies?.length
    ? activeNote.allergies
    : ["Tidak ada alergi yang dicatat."];

  // Real Test Results from backend (NO dummy fallbacks)
  const tesResults = patient?.tesResults || [];

  // Session History (Primary source: patient.sessionHistory from bookings/sessions)
  const sessionHistoryList = (patient as any)?.sessionHistory?.length
    ? (patient as any).sessionHistory
    : (patient as any)?.sessionNotesList?.length
    ? (patient as any).sessionNotesList
    : (patient as any)?.sessionNotes?.length
    ? (patient as any).sessionNotes
    : [];

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
                {age} &nbsp;•&nbsp; {gender} &nbsp;•&nbsp; {totalSessions} Sesi Konsultasi
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
                <span>Riwayat Sesi ({sessionHistoryList.length})</span>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Diagnosis */}
                  <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-2">
                    <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span>Diagnosis Medis</span>
                    </div>
                    <div className="space-y-1 pl-6">
                      {diagnosis.map((d: string, i: number) => (
                        <p key={i} className="text-slate-800 font-medium">{d}</p>
                      ))}
                    </div>
                  </div>

                  {/* Current Medication */}
                  <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                      <Activity className="w-4 h-4 text-emerald-600" />
                      <span>Pengobatan / Obat Saat Ini</span>
                    </div>
                    <div className="space-y-1 pl-6">
                      {currentMedication.map((m: string, i: number) => (
                        <p key={i} className="text-slate-800 font-medium">{m}</p>
                      ))}
                    </div>
                  </div>

                  {/* Allergies */}
                  <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2 md:col-span-2">
                    <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Alergi Obat / Makanan</span>
                    </div>
                    <div className="space-y-1 pl-6">
                      {allergies.map((a: string, i: number) => (
                        <p key={i} className="text-slate-800 font-medium">{a}</p>
                      ))}
                    </div>
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

                {tesResults.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 font-medium">
                    Belum ada hasil tes psikologi.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {tesResults.map((tes: any, idx: number) => {
                      const testName = tes.tesName || tes.namaTes || "Tes Psikologi";
                      const isDass21 = (testName || "").toUpperCase().includes("DASS");
                      const dassRes = isDass21 && tes.answers ? calculateDass21Result(tes.answers) : null;

                      const handleDownloadPdf = () => {
                        if (dassRes) {
                          downloadDass21Pdf({
                            userName: name || "Pasien Oase Jiwa",
                            date: tes.date || new Date(tes.createdAt || Date.now()).toLocaleDateString("id-ID"),
                            testName: testName,
                            result: dassRes,
                          });
                        } else {
                          alert(`Mendownload laporan PDF ${testName}...`);
                        }
                      };

                      return (
                        <div
                          key={tes.id || idx}
                          className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                            <div>
                              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full inline-block mb-1">
                                {testName}
                              </span>
                              <p className="text-[11px] text-slate-500">{tes.date || new Date(tes.createdAt || Date.now()).toLocaleDateString("id-ID")}</p>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="px-3 py-1 bg-[#19355E] text-white rounded-lg font-bold text-xs">
                                Kategori: {tes.category || tes.kategoriNama || "-"}
                              </span>
                              <button
                                type="button"
                                onClick={() => setSelectedTestForDetail(tes)}
                                className="flex items-center gap-1 px-3 py-1 bg-[#19355E] hover:bg-[#234463] text-white rounded-lg text-xs font-semibold transition cursor-pointer shadow-xs"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Lihat Hasil</span>
                              </button>
                              <button
                                type="button"
                                onClick={handleDownloadPdf}
                                className="flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer"
                              >
                                <FileDown className="w-3.5 h-3.5" />
                                <span>Download PDF</span>
                              </button>
                            </div>
                          </div>

                          {dassRes ? (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-slate-50 p-3 rounded-lg text-xs">
                              <div className="p-2.5 bg-white rounded-md border border-slate-200">
                                <span className="text-slate-500 font-medium block text-[11px]">Depresi</span>
                                <div className="flex items-center justify-between mt-1">
                                  <span className="font-bold text-slate-900">{dassRes.depression.score} / 21</span>
                                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800">
                                    {dassRes.depression.category}
                                  </span>
                                </div>
                              </div>

                              <div className="p-2.5 bg-white rounded-md border border-slate-200">
                                <span className="text-slate-500 font-medium block text-[11px]">Kecemasan (Anxiety)</span>
                                <div className="flex items-center justify-between mt-1">
                                  <span className="font-bold text-slate-900">{dassRes.anxiety.score} / 21</span>
                                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-800">
                                    {dassRes.anxiety.category}
                                  </span>
                                </div>
                              </div>

                              <div className="p-2.5 bg-white rounded-md border border-slate-200">
                                <span className="text-slate-500 font-medium block text-[11px]">Stres</span>
                                <div className="flex items-center justify-between mt-1">
                                  <span className="font-bold text-slate-900">{dassRes.stress.score} / 21</span>
                                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-100 text-indigo-800">
                                    {dassRes.stress.category}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <p className="text-xs text-slate-600">{tes.description || tes.detailDiagnosis || "Hasil skrining pasien."}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: RIWAYAT SESI KONSELING */}
            {activeTab === "riwayat" && (
              <div className="space-y-4">
                <h3 className="font-bold text-[#19355E] text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Riwayat Sesi Konsultasi & Catatan</span>
                </h3>

                {sessionHistoryList.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 font-medium">
                    Belum ada riwayat sesi.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sessionHistoryList.map((sn: any, idx: number) => {
                      const sessionDate = sn.date || sn.createdAt;
                      const serviceName = sn.service || sn.namaLayanan || "Konseling";
                      return (
                        <div
                          key={sn.id || idx}
                          className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs"
                        >
                          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#19355E] text-xs">
                                Sesi Konsultasi ke-{sn.sessionNumber || idx + 1}
                              </span>
                              {serviceName && (
                                <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold text-[10px]">
                                  {serviceName}
                                </span>
                              )}
                            </div>
                            <span className="text-slate-500 font-medium text-[11px]">
                              {sessionDate
                                ? new Date(sessionDate).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  })
                                : "-"}
                            </span>
                          </div>

                          <div className="space-y-1 text-slate-700 leading-relaxed">
                            {sn.subjective ? (
                              <p>
                                <strong className="text-slate-900">Subjective:</strong> {sn.subjective}
                              </p>
                            ) : null}
                            {sn.assessment ? (
                              <p>
                                <strong className="text-slate-900">Assessment:</strong> {sn.assessment}
                              </p>
                            ) : null}
                            {sn.plan ? (
                              <p>
                                <strong className="text-slate-900">Plan:</strong> {sn.plan}
                              </p>
                            ) : null}
                            {!sn.subjective && !sn.assessment && !sn.plan && (
                              <p className="text-slate-500 italic">
                                Sesi konsultasi terjadwal. Catatan klinis belum ditambahkan.
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <TestResultDetailModal
        isOpen={!!selectedTestForDetail}
        onClose={() => setSelectedTestForDetail(null)}
        testData={selectedTestForDetail}
        patientName={name}
      />
    </div>
  );
}