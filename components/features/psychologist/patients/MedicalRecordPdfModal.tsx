"use client";

import React, { useRef, useState, useEffect } from "react";
import { X, Printer, Download } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import type { PsychologistPatientDetail } from "@/lib/types/psychologist";
import { getPsychologistProfile } from "@/lib/api/psychologist";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  patient: PsychologistPatientDetail | null;
  psychologistName?: string;
  psychologistSipp?: string;
  officialRecord?: any;
}

export default function MedicalRecordPdfModal({
  isOpen,
  onClose,
  patient,
  psychologistName,
  psychologistSipp,
  officialRecord,
}: Props) {
  const singlePageRef = useRef<HTMLDivElement>(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  // State to store dynamically fetched psychologist profile (logged-in user)
  const [fetchedPsychologist, setFetchedPsychologist] = useState<{
    name: string;
    sipp: string;
    str: string;
    signatureUrl?: string | null;
    signatureUpdatedAt?: string | null;
  } | null>(null);

  // Fetch logged in psychologist profile dynamically when modal opens
  useEffect(() => {
    if (!isOpen) return;

    getPsychologistProfile()
      .then((profile) => {
        if (profile) {
          setFetchedPsychologist({
            name: profile.name || "Dr. Ani Wijaya, M.Psi., Psikolog",
            sipp: profile.sipp
              ? profile.sipp.startsWith("SIPP")
                ? profile.sipp
                : `SIPP: ${profile.sipp}`
              : "SIPP-2024-001234",
            str: profile.str
              ? profile.str.startsWith("STR")
                ? profile.str
                : `STR: ${profile.str}`
              : "STR-PSI-2024-005678",
            signatureUrl: profile.signatureUrl || null,
            signatureUpdatedAt: profile.signatureUpdatedAt || null,
          });
        }
      })
      .catch((err) => {
        console.warn("Could not fetch psychologist profile for PDF modal:", err);
      });
  }, [isOpen]);

  if (!isOpen || !patient) return null;

  const notesList = (patient as any).sessionNotesList?.length
    ? (patient as any).sessionNotesList
    : (patient as any).notes?.length
    ? (patient as any).notes
    : (patient as any).sessionNotes?.length
    ? (patient as any).sessionNotes
    : officialRecord
    ? [officialRecord]
    : [];

  const note = notesList[0] || {};
  const totalSessionsCount = Math.max(
    patient.totalSessions || 1,
    notesList.length || 1
  );

  // Helper to format absolute backend signature URL
  const formatSignatureUrl = (rawUrl?: string | null) => {
    if (!rawUrl) return null;
    const trimmed = String(rawUrl).trim();
    if (!trimmed || trimmed === "null" || trimmed === "undefined") return null;
    if (trimmed.startsWith("http")) return trimmed;
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    return `${API_BASE_URL}${trimmed.startsWith("/") ? "" : "/"}${trimmed}`;
  };

  // 🟢 SINGLE UNIFIED UTILITY TO RESOLVE LEGAL SIGNER & SIGNATURE DATA
  // Sequence: note -> patient.psychologist -> fetchedPsychologist
  const resolveSignatureData = () => {
    const rawUrl =
      note.signatureUrl ||
      note.psychologistProfile?.signatureUrl ||
      note.psychologist?.signatureUrl ||
      (patient as any)?.signatureUrl ||
      (patient as any)?.psychologistProfile?.signatureUrl ||
      (patient as any)?.psychologist?.signatureUrl ||
      fetchedPsychologist?.signatureUrl ||
      null;

    const rawUpdatedAt =
      note.signatureUpdatedAt ||
      note.psychologistProfile?.signatureUpdatedAt ||
      note.psychologist?.signatureUpdatedAt ||
      (patient as any)?.signatureUpdatedAt ||
      (patient as any)?.psychologistProfile?.signatureUpdatedAt ||
      (patient as any)?.psychologist?.signatureUpdatedAt ||
      fetchedPsychologist?.signatureUpdatedAt ||
      null;

    const name =
      psychologistName ||
      note.psychologistName ||
      note.psychologistProfile?.fullName ||
      note.psychologist?.fullName ||
      (patient as any)?.psychologistProfile?.fullName ||
      (patient as any)?.psychologist?.fullName ||
      fetchedPsychologist?.name ||
      "Dr. Ani Wijaya, M.Psi., Psikolog";

    const sipp =
      psychologistSipp ||
      note.psychologistSipp ||
      note.psychologistProfile?.sipp ||
      note.psychologist?.sipp ||
      (patient as any)?.psychologistProfile?.sipp ||
      (patient as any)?.psychologist?.sipp ||
      fetchedPsychologist?.sipp ||
      "SIPP-2024-001234";

    const str =
      note.psychologistStr ||
      note.psychologistProfile?.str ||
      note.psychologist?.str ||
      (patient as any)?.psychologistProfile?.str ||
      (patient as any)?.psychologist?.str ||
      fetchedPsychologist?.str ||
      "STR-PSI-2024-005678";

    return {
      signatureUrl: formatSignatureUrl(rawUrl),
      signatureUpdatedAt: rawUpdatedAt,
      name,
      sipp,
      str,
    };
  };

  const resolvedLegalSigner = resolveSignatureData();

  const finalPsychologistName = resolvedLegalSigner.name;
  const finalPsychologistSipp = resolvedLegalSigner.sipp;
  const finalPsychologistStr = resolvedLegalSigner.str;
  const activeSignatureUrl = resolvedLegalSigner.signatureUrl;
  const activeSignatureUpdatedAt = resolvedLegalSigner.signatureUpdatedAt;

  // Clinical Details
  const mainProblem = note.subjective || "Belum ada catatan keluhan utama";
  const observation = note.objective || "Belum ada catatan observasi";
  const assessment = note.assessment || "Belum ada catatan assessment";
  const plan = note.plan || "Belum ada catatan rekomendasi terapi";

  const nextSessionDate = note.followUpDate
    ? new Date(note.followUpDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
    : note.nextSessionDate || "Belum dijadwalkan";

  const riskReason = note.riskReason || note.riskAssessmentReason || "Belum ada alasan penilaian risiko";
  const autoRecommendations: string[] = note.recommendation
    ? [note.recommendation]
    : note.riskRecommendations?.length
    ? note.riskRecommendations
    : note.autoRecommendations || [];

  const nextSessionFocus = note.nextSessionRecommendation || note.nextSessionFocus || "Belum ada fokus sesi berikutnya";
  const additionalNotes = note.additionalNotes || "Tidak ada catatan tambahan";
  const tags: string[] = note.tags?.length ? note.tags : [];

  const rawPdfRisk = note.riskLevel || patient.latestRiskLevel;
  const riskLevel = rawPdfRisk ? String(rawPdfRisk).toLowerCase() : "";

  const sessionNum = note.sessionNumber || 1;
  const formattedSessionDate = note.consultationDate || note.sessionDate || note.createdAt
    ? new Date(note.consultationDate || note.sessionDate || note.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
    : "-";
  const formattedSessionTime = note.sessionTime || "09:00 WIB";
  const consultationStatus = note.consultationStatus || "SELESAI";

  const rawDiagnosis = note.diagnosisSummary || (patient as any)?.diagnosis || (note as any)?.diagnosis;
  const diagnosisStr = Array.isArray(rawDiagnosis)
    ? rawDiagnosis.length > 0 ? rawDiagnosis.join(", ") : "-"
    : typeof rawDiagnosis === "string" && rawDiagnosis.trim()
    ? rawDiagnosis
    : "-";

  const medicationStr = Array.isArray(patient.currentMedication) && patient.currentMedication.length > 0
    ? patient.currentMedication.join(", ")
    : note.currentMedication || "Tidak ada";

  const allergiesStr = Array.isArray(patient.allergies) && patient.allergies.length > 0
    ? patient.allergies.join(", ")
    : note.allergies || "Tidak ada";

  const followUpPlan = note.followUpPlan || "CONTINUE_SESSION";

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJsPDF = async () => {
    const element = singlePageRef.current;
    if (!element) {
      alert("Element PDF tidak ditemukan");
      return;
    }

    setDownloadingPdf(true);
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 5) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Rekam-Medis-${patient.name.replace(/\s+/g, "_")}.pdf`);
    } catch (err) {
      console.error("Gagal generate PDF:", err);
      alert("Terjadi kesalahan saat memproses file PDF.");
    } finally {
      setDownloadingPdf(false);
    }
  };

  return (
    <>
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }

          html,
          body {
            width: 210mm !important;
            height: 297mm !important;
            max-height: 297mm !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          #medical-record-pdf-target,
          #medical-record-pdf-target * {
            visibility: visible !important;
            box-sizing: border-box !important;
          }

          #medical-record-pdf-target {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            max-height: 297mm !important;
            margin: 0 !important;
            padding: 6mm 10mm !important;
            box-sizing: border-box !important;
            background: #ffffff !important;
            box-shadow: none !important;
            border: none !important;
            overflow: hidden !important;
            page-break-after: avoid !important;
            page-break-before: avoid !important;
            break-after: avoid !important;
            break-before: avoid !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }
      `}</style>

      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 font-poppins text-xs"
        onClick={onClose}
      >
        <div
          className="max-h-[94vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-slate-200 shadow-2xl p-4 sm:p-6 space-y-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* TOP CONTROLS & HEADER */}
          <div className="sticky top-0 z-20 flex items-center justify-between border-b-2 border-slate-300 bg-white p-4 rounded-xl shadow-xs">
            <div>
              <h3 className="font-bold text-[#19355E] text-sm">
                Dokumen Rekam Medis Digital
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Pasien: <strong className="text-slate-800">{patient.name}</strong> &nbsp;|&nbsp; Rekam Medis #{patient.id?.substring(0, 8)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-700 hover:bg-slate-800 text-white font-bold text-xs transition shadow-xs cursor-pointer"
              >
                <Printer className="h-4 w-4" />
                <span>Cetak PDF</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadJsPDF}
                disabled={downloadingPdf}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#19355E] hover:bg-[#122746] text-white font-bold text-xs transition shadow-xs cursor-pointer disabled:opacity-50"
              >
                <Download className="h-4 w-4 text-amber-300" />
                <span>{downloadingPdf ? "Memproses PDF..." : "Unduh PDF (1 Halaman)"}</span>
              </button>

              <button
                onClick={onClose}
                className="rounded-lg p-2 transition-colors hover:bg-slate-100 text-slate-500 cursor-pointer"
                type="button"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* ============================================================ */}
          {/* SINGLE PAGE A4 CONTAINER SHEET */}
          {/* ============================================================ */}
          <div
            id="medical-record-pdf-target"
            ref={singlePageRef}
            className="w-[210mm] mx-auto bg-white p-[6mm_10mm] shadow-md border border-slate-300 font-sans text-[11.5px] leading-snug space-y-1.5 flex flex-col justify-between box-border"
            style={{ width: "210mm", minHeight: "297mm", height: "auto" }}
          >
            <div className="space-y-1.5">
              {/* HEADER OASE JIWA */}
              <div className="flex justify-between items-center border-b-2 border-slate-800 pb-1.5">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/assets/logo/logo.png"
                    alt="Oase Jiwa Logo"
                    className="h-11 w-auto object-contain shrink-0"
                  />
                  <div>
                    <h2 className="font-extrabold text-base text-[#19355E] tracking-tight">Oase Jiwa</h2>
                    <p className="text-[10.5px] text-slate-500 font-semibold italic">Biro Psikologi</p>
                  </div>
                </div>

                <div className="text-right">
                  <h2 className="font-extrabold text-xs text-[#19355E] uppercase tracking-wider">
                    BIRO PSIKOLOGI OASE JIWA
                  </h2>
                  <p className="text-[10.5px] text-slate-500 italic">Temukan Dirimu, Pulihkan Jiwamu.</p>
                </div>
              </div>

              {/* DOCUMENT TITLE */}
              <div className="text-center border-b border-slate-700 pb-0.5">
                <h3 className="font-bold text-[#19355E] uppercase tracking-wide text-[12px] underline decoration-slate-400 decoration-1">
                  CATATAN UNTUK PSIKOLOG (DIISI OLEH PSIKOLOG SETELAH SESI)
                </h3>
              </div>

              {/* METADATA BOX */}
              <div className="p-2 rounded-xl border border-slate-300 bg-slate-50/70 space-y-1">
                <div className="flex justify-between items-center border-b border-slate-200 pb-1">
                  <span className="font-bold text-[#19355E] text-[11px]">
                    Sesi Konsultasi ke-{sessionNum} (dari total {totalSessionsCount} sesi) &nbsp;|&nbsp; Tanggal: {formattedSessionDate} &nbsp;|&nbsp; Jam: {formattedSessionTime}
                  </span>

                  {/* RISK LEVEL BADGE WITH MR-3 MARGIN TO PREVENT CLIPPING */}
                  <span
                    className={`px-2.5 py-0.5 mr-3 rounded-full text-[10.5px] font-extrabold tracking-wide uppercase border ${
                      riskLevel === "very_high" || riskLevel === "sangat_tinggi" || riskLevel === "high" || riskLevel === "tinggi"
                        ? "bg-red-50 text-red-700 border-red-300"
                        : riskLevel === "medium" || riskLevel === "sedang"
                        ? "bg-amber-50 text-amber-800 border-amber-300"
                        : "bg-emerald-50 text-emerald-800 border-emerald-300"
                    }`}
                  >
                    RISK LEVEL: {
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
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-0.5 text-[11px]">
                  <div>
                    <span className="font-bold text-slate-700">Psikolog:</span>{" "}
                    <span className="text-slate-900 font-medium">{finalPsychologistName}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700">Pasien:</span>{" "}
                    <span className="text-slate-900 font-semibold">{patient.name}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700">No. Rekam Medis:</span>{" "}
                    <span className="text-slate-800 font-mono text-[10.5px]">{patient.id}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700">Status Konsultasi:</span>{" "}
                    <span className="text-emerald-700 font-bold">{consultationStatus}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700">Diagnosis:</span>{" "}
                    <span className="text-slate-900 font-medium">{diagnosisStr}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700">Obat Saat Ini:</span>{" "}
                    <span className="text-slate-800">{medicationStr}</span>
                  </div>
                </div>
              </div>

              {/* MAIN CLINICAL DOCUMENTATION BOX */}
              <div className="p-2 rounded-xl border-2 border-slate-300 bg-white space-y-1.5 text-[10px] leading-snug break-words">
                {/* 1. Ringkasan Masalah Utama */}
                <div>
                  <span className="font-bold text-[#19355E] text-[11px] block mb-0.5">• Ringkasan Masalah Utama (Subjective) :</span>
                  <p className="pl-4 text-slate-800 text-justify">{mainProblem}</p>
                </div>

                {/* 2. Observasi Psikolog */}
                <div>
                  <span className="font-bold text-[#19355E] text-[11px] block mb-0.5">• Observasi Psikolog (Objective) :</span>
                  <p className="pl-4 text-slate-800 text-justify">{observation}</p>
                </div>

                {/* 3. Assessment Psikolog */}
                <div>
                  <span className="font-bold text-[#19355E] text-[11px] block mb-0.5">• Assessment Psikolog :</span>
                  <p className="pl-4 text-slate-800 text-justify">{assessment}</p>
                </div>

                {/* 4. Rekomendasi Pendekatan Terapi */}
                <div>
                  <span className="font-bold text-[#19355E] text-[11px] block mb-0.5">• Rekomendasi Pendekatan Terapi (Plan) :</span>
                  <p className="pl-4 text-slate-800 text-justify">{plan}</p>
                </div>

                {/* 5. Rencana Tindak Lanjut */}
                <div>
                  <span className="font-bold text-[#19355E] text-[11px] block mb-0.5">• Rencana Tindak Lanjut :</span>
                  <div className="pl-4 flex items-center gap-6 text-slate-800 font-medium">
                    <label className={`flex items-center gap-1.5 ${followUpPlan === "CONTINUE_SESSION" ? "font-bold text-blue-800" : ""}`}>
                      <input type="checkbox" readOnly checked={followUpPlan === "CONTINUE_SESSION"} className="rounded text-blue-600" />
                      <span>[{followUpPlan === "CONTINUE_SESSION" ? " ✓ " : "   "}] Lanjutan sesi</span>
                    </label>
                    <label className={`flex items-center gap-1.5 ${followUpPlan === "REFER_TO_OTHER" ? "font-bold text-amber-800" : ""}`}>
                      <input type="checkbox" readOnly checked={followUpPlan === "REFER_TO_OTHER"} className="rounded text-amber-600" />
                      <span>[{followUpPlan === "REFER_TO_OTHER" ? " ✓ " : "   "}] Rujukan ke profesional lain</span>
                    </label>
                    <label className={`flex items-center gap-1.5 ${followUpPlan === "COMPLETED" ? "font-bold text-emerald-800" : ""}`}>
                      <input type="checkbox" readOnly checked={followUpPlan === "COMPLETED"} className="rounded text-emerald-600" />
                      <span>[{followUpPlan === "COMPLETED" ? " ✓ " : "   "}] Selesai</span>
                    </label>
                  </div>
                </div>

                {/* 6. Sesi ke & Follow Up Date */}
                <div className="pt-1 border-t border-slate-200 flex items-center justify-between text-slate-800">
                  <span>• <strong>Sesi ini merupakan sesi ke :</strong> {sessionNum}</span>
                  <span>• <strong>Tanggal Sesi Lanjutan / Follow-up :</strong> {nextSessionDate}</span>
                </div>

                {/* 7. Alasan Penilaian Risiko */}
                <div>
                  <span className="font-bold text-[#19355E] text-[11px] block mb-0.5">
                    • Alasan Penilaian Risiko ({riskLevel.toUpperCase()}) :
                  </span>
                  <p className="pl-4 text-slate-700 italic">{riskReason}</p>
                </div>

                {/* 8. Rekomendasi Penanganan Otomatis */}
                <div>
                  <span className="font-bold text-[#19355E] text-[11px] block mb-0.5">• Rekomendasi Penanganan Otomatis :</span>
                  <ul className="pl-8 list-disc text-slate-800 space-y-0.5">
                    {autoRecommendations.map((rec: string, idx: number) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </div>

                {/* 9. Fokus Sesi Berikutnya */}
                <div>
                  <span className="font-bold text-[#19355E] text-[11px] block mb-0.5">• Fokus Sesi Berikutnya :</span>
                  <p className="pl-4 text-slate-800">{nextSessionFocus}</p>
                </div>

                {/* 10. Catatan Tambahan */}
                <div>
                  <span className="font-bold text-[#19355E] text-[11px] block mb-0.5">• Catatan Tambahan (jika ada) :</span>
                  <p className="pl-4 text-slate-700 italic">{additionalNotes}</p>
                </div>

                {/* 11. Referral */}
                <div className="pt-1 border-t border-slate-200 flex items-start gap-2">
                  <span className="font-bold text-slate-900 shrink-0">• Referral :</span>
                  <p className="text-slate-800 text-[11px] break-words">
                    {tags && tags.length > 0
                      ? Array.isArray(tags)
                        ? tags.join(", ")
                        : String(tags)
                      : "Tidak ada"}
                  </p>
                </div>
              </div>
            </div>

            {/* DIGITAL SIGNATURE BLOCK & FOOTER */}
            <div className="space-y-1 pt-2 border-t border-slate-200" style={{ pageBreakInside: "avoid", breakInside: "avoid" }}>
              <div className="flex justify-end font-sans">
                <div className="text-center w-64">
                  <p className="mb-0.5 text-[11.5px] text-slate-800 font-medium">
                    Malang, {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                  <p className="font-bold text-[#19355E] text-[11.5px]">
                    Psikolog Penanggung Jawab,
                  </p>

                  {/* Dynamic Digital Signature Image vs Fallback Placeholder */}
                  {activeSignatureUrl ? (
                    <div className="h-16 flex items-center justify-center my-1">
                      <img
                        src={activeSignatureUrl}
                        alt="Tanda Tangan Digital"
                        className="max-h-16 max-w-[170px] object-contain"
                      />
                    </div>
                  ) : (
                    <div className="p-2 border border-dashed border-slate-300 bg-slate-50/70 rounded-lg text-center my-1">
                      <p className="text-[10px] text-slate-400 font-mono">-----------------------------</p>
                      <p className="text-[10px] font-bold text-slate-600">Belum memiliki tanda tangan digital</p>
                      <p className="text-[10px] text-slate-400 font-mono">-----------------------------</p>
                      <p className="text-[9px] text-slate-400 italic mt-0.5">
                        Silakan membuat tanda tangan digital pada menu Profil Saya.
                      </p>
                    </div>
                  )}

                  <p className="font-bold text-[#19355E] text-[11.5px] underline mt-0.5">
                    {finalPsychologistName}
                  </p>
                  <p className="text-[10.5px] text-slate-600 font-semibold">
                    {finalPsychologistSipp.startsWith("SIPP") ? finalPsychologistSipp : `SIPP: ${finalPsychologistSipp}`}
                  </p>
                  {finalPsychologistStr && (
                    <p className="text-[10px] text-slate-600 font-medium">
                      {finalPsychologistStr.startsWith("STR") ? finalPsychologistStr : `STR: ${finalPsychologistStr}`}
                    </p>
                  )}

                  {/* Status Badge & Timestamp */}
                  {activeSignatureUrl && (
                    <div className="mt-1 flex flex-col items-center gap-0.5 text-[9.5px]">
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        ✔ Ditandatangani secara Digital
                      </span>
                      {activeSignatureUpdatedAt && (
                        <span className="text-[9px] text-slate-500 font-medium">
                          Terakhir diperbarui:{" "}
                          {new Date(activeSignatureUpdatedAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}{" "}
                          •{" "}
                          {new Date(activeSignatureUpdatedAt).toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          WIB
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-1 border-t border-slate-300 flex justify-between items-center text-[9.5px] text-slate-500 font-sans">
                <span>Dokumen Rahasia Medis - Biro Psikologi Oase Jiwa</span>
                <span>Generated by Oase Jiwa System</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
