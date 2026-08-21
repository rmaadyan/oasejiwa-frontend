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

export interface ClinicalSectionItem {
  id: string;
  sectionKey?: string;
  baseTitle?: string;
  title: string;
  type: "text" | "checkboxes" | "session_info" | "list" | "referral";
  content?: string;
  items?: string[];
  followUpPlanValue?: string;
  sessionNum?: number;
  nextSessionDate?: string;
}

export interface PdfPageData {
  pageIndex: number;
  sections: ClinicalSectionItem[];
  includeSignature: boolean;
}

export default function MedicalRecordPdfModal({
  isOpen,
  onClose,
  patient,
  psychologistName,
  psychologistSipp,
  officialRecord,
}: Props) {
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const [fetchedPsychologist, setFetchedPsychologist] = useState<{
    name: string;
    sipp: string;
    str: string;
    signatureUrl?: string | null;
  } | null>(null);

  const [pdfPages, setPdfPages] = useState<PdfPageData[]>([]);
  const [isCalculated, setIsCalculated] = useState(false);

  const measuringContainerRef = useRef<HTMLDivElement>(null);
  const page1HeaderRef = useRef<HTMLDivElement>(null);
  const pageNHeaderRef = useRef<HTMLDivElement>(null);
  const sectionMeasureRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const signatureMeasureRef = useRef<HTMLDivElement>(null);
  const pageDomRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    getPsychologistProfile()
      .then((profile) => {
        if (profile) {
          setFetchedPsychologist({
            name: profile.name || (profile as any).fullName || "Psikolog Klinis",
            sipp: profile.sipp && profile.sipp !== "-" ? profile.sipp : "-",
            str: profile.str && profile.str !== "-" ? profile.str : "-",
            signatureUrl: profile.signatureUrl || null,
          });
        }
      })
      .catch((err) => {
        console.warn("Gagal mengambil profil psikolog:", err);
      });
  }, [isOpen]);

  const notesList = patient
    ? (patient as any).sessionNotesList?.length
      ? (patient as any).sessionNotesList
      : (patient as any).notes?.length
      ? (patient as any).notes
      : (patient as any).sessionNotes?.length
      ? (patient as any).sessionNotes
      : officialRecord
      ? [officialRecord]
      : []
    : [];

  const note = notesList[0] || {};
  const patientData = patient as any;

  // Resolusi Profil Psikolog
  const finalPsychologistName =
    psychologistName ||
    note.psychologistName ||
    note.psychologistProfile?.fullName ||
    note.psychologist?.fullName ||
    fetchedPsychologist?.name ||
    "Psikolog Penanggung Jawab";

  const rawSipp =
    psychologistSipp ||
    note.psychologistSipp ||
    note.psychologistProfile?.sipp ||
    note.psychologist?.sipp ||
    fetchedPsychologist?.sipp ||
    "-";

  const finalSipp = rawSipp !== "-" ? rawSipp.replace(/^SIPP[:\s-]*/i, "") : "-";

  const rawStr =
    note.psychologistStr ||
    note.psychologistProfile?.str ||
    note.psychologist?.str ||
    fetchedPsychologist?.str ||
    "-";

  const finalStr = rawStr !== "-" ? rawStr.replace(/^STR[:\s-]*/i, "") : "-";

  const formatSignatureUrl = (rawUrl?: string | null) => {
    if (!rawUrl) return null;
    const trimmed = String(rawUrl).trim();
    if (!trimmed || trimmed === "null" || trimmed === "undefined") return null;
    if (trimmed.startsWith("http")) return trimmed;
    const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "https://api.oasejiwa.id").replace(/\/+$/, "");
    return `${API_BASE_URL}${trimmed.startsWith("/") ? "" : "/"}${trimmed}`;
  };

  const activeSignatureUrl = formatSignatureUrl(
    note.signatureUrl ||
    note.psychologistProfile?.signatureUrl ||
    fetchedPsychologist?.signatureUrl ||
    patientData?.signatureUrl
  );

  // Standarisasi Digit Nomor RM (6 Digit)
  const cleanRmSeed = String(patient?.id || "000001").replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  const rmDigits = cleanRmSeed.substring(0, 6).padEnd(6, "0").split("");

  // Resolusi Data Demografis Pasien (Otomatis dari Booking Online & Input Offline)
  const patientName = patient?.name || patientData?.fullName || "-";
  const patientPhone = patientData?.phone || patientData?.phoneNumber || "-";
  const patientGender = patientData?.gender || patientData?.jenisKelamin || "-";
  const patientAddress = patientData?.address || patientData?.alamat || "Malang";
  const patientEducation = patientData?.education || patientData?.pendidikan || "-";
  const patientOccupation = patientData?.occupation || patientData?.pekerjaan || "-";
  const patientMarital = patientData?.maritalStatus || patientData?.statusPernikahan || "-";
  const patientReligion = patientData?.religion || patientData?.agama || "-";
  const patientEthnicity = patientData?.ethnicity || patientData?.suku || "Jawa";
  const patientAge = patientData?.age || (patientData?.birthDate ? new Date().getFullYear() - new Date(patientData.birthDate).getFullYear() : "-");
  
  const birthDateFormatted = patientData?.birthDate || patientData?.tanggalLahir
    ? new Date(patientData.birthDate || patientData.tanggalLahir).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
    : "-";
  const patientTtl = patientData?.birthPlace ? `${patientData.birthPlace}, ${birthDateFormatted}` : birthDateFormatted;

  const sessionDateFormatted = note.consultationDate || note.sessionDate || note.createdAt
    ? new Date(note.consultationDate || note.sessionDate || note.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
    : new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

  const sessionNum = note.sessionNumber || 1;
  const followUpPlan = note?.followUpPlan || "CONTINUE_SESSION";
  const nextSessionDate = note.followUpDate
    ? new Date(note.followUpDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
    : note.nextSessionDate || "Belum dijadwalkan";

  const mainProblem = note.subjective || "Tidak ada keluhan subjektif";
  const observation = note.objective || "Tidak ada catatan observasi objektif";
  const assessment = note.assessment || "Dalam proses evaluasi psikologis";
  const plan = note.plan || "Belum ada rekomendasi terapi khusus";
  const additionalNotes = note.additionalNotes || "Tidak ada catatan tambahan";

  // Helper pemisah teks panjang tanpa menulis ulang judul kelanjutan
  const splitTextContent = (title: string, fullContent: string, baseId: string): ClinicalSectionItem[] => {
    if (!fullContent || fullContent.length <= 1100) {
      return [{ id: baseId, sectionKey: baseId, baseTitle: title, title, type: "text", content: fullContent }];
    }

    const rawParagraphs = fullContent.split(/\n+/).filter((p) => p.trim());
    const chunks: string[] = [];

    for (const p of rawParagraphs) {
      if (p.length <= 1100) {
        chunks.push(p);
      } else {
        let remaining = p;
        while (remaining.length > 0) {
          if (remaining.length <= 950) {
            chunks.push(remaining);
            break;
          }
          let cutIdx = remaining.lastIndexOf(". ", 850);
          if (cutIdx < 300) cutIdx = remaining.lastIndexOf(" ", 850);
          if (cutIdx < 200) cutIdx = 750;

          chunks.push(remaining.substring(0, cutIdx + 1).trim());
          remaining = remaining.substring(cutIdx + 1).trim();
        }
      }
    }

    return chunks.map((chunkText, idx) => ({
      id: idx === 0 ? baseId : `${baseId}-part${idx + 1}`,
      sectionKey: baseId,
      baseTitle: title,
      title: idx === 0 ? title : "",
      type: "text",
      content: chunkText,
    }));
  };

  const allClinicalSections: ClinicalSectionItem[] = [
    ...splitTextContent("1. KELUHAN UTAMA & KONDISI SUBJEKTIF (SUBJECTIVE) :", mainProblem, "sec-sub"),
    ...splitTextContent("2. OBSERVASI KLINIS & PEMERIKSAAN (OBJECTIVE) :", observation, "sec-obj"),
    ...splitTextContent("3. HASIL ASESMEN & DIAGNOSIS PSIKOLOGIS (ASSESSMENT) :", assessment, "sec-ass"),
    ...splitTextContent("4. RENCANA INTERVENSI & PENDEKATAN TERAPI (PLAN) :", plan, "sec-plan"),
    { id: "sec-followup", sectionKey: "sec-followup", baseTitle: "5. RENCANA TINDAK LANJUT :", title: "5. RENCANA TINDAK LANJUT :", type: "checkboxes", followUpPlanValue: followUpPlan },
    { id: "sec-sessioninfo", sectionKey: "sec-sessioninfo", baseTitle: "• Sesi & Tanggal Follow-up :", title: "• Sesi & Tanggal Follow-up :", type: "session_info", sessionNum, nextSessionDate },
    ...splitTextContent("6. CATATAN TAMBAHAN :", additionalNotes, "sec-addnotes"),
  ];

  const runPaginationCalculation = () => {
    if (!measuringContainerRef.current) return;

    const TOTAL_A4_INNER_HEIGHT = 1009;
    const FOOTER_HEIGHT = 40;

    const hPage1Header = page1HeaderRef.current?.offsetHeight || 370;
    const hPageNHeader = pageNHeaderRef.current?.offsetHeight || 50;
    const hSignature = signatureMeasureRef.current?.offsetHeight || 150;

    const hPage1MaxContent = TOTAL_A4_INNER_HEIGHT - hPage1Header - FOOTER_HEIGHT - 10;
    const hPageNMaxContent = TOTAL_A4_INNER_HEIGHT - hPageNHeader - FOOTER_HEIGHT - 10;

    const sectionHeights: { [id: string]: number } = {};
    allClinicalSections.forEach((sec) => {
      const el = sectionMeasureRefs.current[sec.id];
      sectionHeights[sec.id] = el?.offsetHeight || 40;
    });

    const rawPages: { pageIndex: number; sections: ClinicalSectionItem[]; includeSignature: boolean }[] = [];
    let currentSections: ClinicalSectionItem[] = [];
    let currentHeight = 0;
    let isPage1 = true;

    const maxContentHeight = () => (isPage1 ? hPage1MaxContent : hPageNMaxContent);

    for (let i = 0; i < allClinicalSections.length; i++) {
      const sec = allClinicalSections[i];
      const secH = sectionHeights[sec.id] || 40;

      if (currentHeight + secH <= maxContentHeight()) {
        currentSections.push(sec);
        currentHeight += secH;
      } else {
        if (currentSections.length > 0) {
          rawPages.push({
            pageIndex: rawPages.length,
            sections: currentSections,
            includeSignature: false,
          });
        }
        isPage1 = false;
        currentSections = [sec];
        currentHeight = secH;
      }
    }

    if (currentHeight + hSignature <= maxContentHeight()) {
      rawPages.push({
        pageIndex: rawPages.length,
        sections: currentSections,
        includeSignature: true,
      });
    } else {
      if (currentSections.length > 0) {
        rawPages.push({
          pageIndex: rawPages.length,
          sections: currentSections,
          includeSignature: false,
        });
      }
      rawPages.push({
        pageIndex: rawPages.length,
        sections: [],
        includeSignature: true,
      });
    }

    setPdfPages(rawPages);
    setIsCalculated(true);
  };

  useEffect(() => {
    if (!isOpen || !patient) return;
    setIsCalculated(false);
    const timer = setTimeout(() => {
      runPaginationCalculation();
    }, 150);
    return () => clearTimeout(timer);
  }, [isOpen, patient, note, fetchedPsychologist]);

  if (!isOpen || !patient) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJsPDF = async () => {
    if (!pageDomRefs.current.length) return;
    setDownloadingPdf(true);
    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      for (let i = 0; i < pageDomRefs.current.length; i++) {
        const pageEl = pageDomRefs.current[i];
        if (!pageEl) continue;
        if (i > 0) pdf.addPage();

        const canvas = await html2canvas(pageEl, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
          backgroundColor: "#ffffff",
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.95);
        pdf.addImage(imgData, "JPEG", 0, 0, 210, 297);
      }

      pdf.save(`Rekam_Medis_${patientName.replace(/\s+/g, "_")}.pdf`);
    } catch (err) {
      console.error("Gagal generate PDF:", err);
      alert("Terjadi kesalahan saat memproses file PDF.");
    } finally {
      setDownloadingPdf(false);
    }
  };

  const renderSection = (sec: ClinicalSectionItem) => {
    if (sec.type === "checkboxes") {
      return (
        <div key={sec.id} className="mb-2.5">
          <span className="font-bold text-black text-[10pt] block mb-1">
            {sec.title}
          </span>
          <div className="pl-4 flex items-center gap-6 text-black text-[9.5pt]">
            <label className="flex items-center gap-1.5">
              <span>[{sec.followUpPlanValue === "CONTINUE_SESSION" ? " ✓ " : "   "}] Lanjutkan sesi</span>
            </label>
            <label className="flex items-center gap-1.5">
              <span>[{sec.followUpPlanValue === "REFER_TO_OTHER" ? " ✓ " : "   "}] Rujukan ke profesional lain</span>
            </label>
            <label className="flex items-center gap-1.5">
              <span>[{sec.followUpPlanValue === "COMPLETED" ? " ✓ " : "   "}] Selesai</span>
            </label>
          </div>
        </div>
      );
    }

    if (sec.type === "session_info") {
      return (
        <div key={sec.id} className="pt-1 pb-1 my-1.5 border-t border-b border-slate-300 flex items-center justify-between text-black text-[9.5pt]">
          <span>• <strong>Sesi Konsultasi ke:</strong> {sec.sessionNum}</span>
          <span>• <strong>Tanggal Sesi Lanjutan:</strong> {sec.nextSessionDate}</span>
        </div>
      );
    }

    return (
      <div key={sec.id} className="mb-2.5">
        {sec.title && (
          <span className="font-bold text-black text-[10pt] block mb-1">
            {sec.title}
          </span>
        )}
        <p className="pl-4 text-black text-justify text-[9.5pt] leading-relaxed whitespace-pre-wrap break-words">
          {sec.content}
        </p>
      </div>
    );
  };

  // 🟢 KOP SURAT STANDAR PRAKTIK PSIKOLOG KLINIS + IDENTITAS LENGKAP
  const renderPage1Header = () => (
    <div
      ref={page1HeaderRef}
      className="space-y-2.5 mb-3 shrink-0"
      style={{ fontFamily: '"Times New Roman", Times, serif' }}
    >
      {/* BARIS KOP: LOGO + INFO PSIKOLOG KLINIS + KOTAK DIGIT NO. RM */}
      <div className="flex justify-between items-start pb-2 relative">
        <div className="flex items-center gap-3.5">
          <img
            src="/assets/logo/logo.png"
            alt="Oase Jiwa Logo"
            className="h-16 w-auto object-contain shrink-0"
          />
          <div>
            <h1 className="font-bold text-[13pt] text-black tracking-tight leading-tight uppercase">
              PRAKTIK PSIKOLOG KLINIS
            </h1>
            <p className="text-[11pt] font-bold text-black mt-0.5">
              {finalPsychologistName}
            </p>
            <p className="text-[9pt] text-black">
              SIPPK / SIPP : {finalSipp} {finalStr !== "-" ? `• STR : ${finalStr}` : ""}
            </p>
            <p className="text-[8.5pt] text-slate-700">
              Biro Psikologi Oase Jiwa • Jl. Alang-Alang No. 27 Malang • ☎ 0857 9119 1511
            </p>
          </div>
        </div>

        {/* Kotak Digit Resmi No. RM */}
        <div className="shrink-0 flex items-center border border-black p-1 bg-white">
          <span className="text-[9pt] font-bold text-black px-1.5 whitespace-nowrap">No. RM :</span>
          <div className="flex border-l border-black">
            {rmDigits.map((char, i) => (
              <div
                key={i}
                className="w-5 h-5 border-r last:border-r-0 border-black flex items-center justify-center font-mono font-bold text-[10pt] text-black"
              >
                {char}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Garis Ganda Pemisah Kop Surat */}
      <div className="border-b-2 border-black border-t border-black h-[3px] my-1" />

      {/* JUDUL DOKUMEN */}
      <div className="text-center pt-1 pb-1">
        <h2 className="font-bold text-black uppercase tracking-widest text-[12pt]">
          REKAM MEDIS PSIKOLOGIS
        </h2>
      </div>

     {/* BAGIAN A: IDENTITAS LENGKAP PASIEN (DUA KOLOM BERSIH TANPA AGAMA & SUKU) */}
      <div className="space-y-1">
        <h3 className="font-bold text-black text-[10pt]">A. DATA PASIEN</h3>
        <div className="grid grid-cols-2 gap-x-8 text-[9pt] leading-relaxed border-b border-black pb-2">
          {/* Kolom Kiri */}
          <div className="space-y-0.5">
            <div className="flex items-baseline">
              <span className="w-24 shrink-0 text-slate-800">Nama</span>
              <span className="mr-1.5">:</span>
              <span className="font-bold text-black uppercase">{patientName}</span>
            </div>
            <div className="flex items-baseline">
              <span className="w-24 shrink-0 text-slate-800">Alamat</span>
              <span className="mr-1.5">:</span>
              <span className="text-black">{patientAddress}</span>
            </div>
            <div className="flex items-baseline">
              <span className="w-24 shrink-0 text-slate-800">Pendidikan</span>
              <span className="mr-1.5">:</span>
              <span className="text-black">{patientEducation}</span>
            </div>
            <div className="flex items-baseline">
              <span className="w-24 shrink-0 text-slate-800">Jenis Kelamin</span>
              <span className="mr-1.5">:</span>
              <span className="text-black">{patientGender}</span>
            </div>
            <div className="flex items-baseline">
              <span className="w-24 shrink-0 text-slate-800">TTL</span>
              <span className="mr-1.5">:</span>
              <span className="text-black">{patientTtl}</span>
            </div>
          </div>

          {/* Kolom Kanan */}
          <div className="space-y-0.5">
            <div className="flex items-baseline">
              <span className="w-28 shrink-0 text-slate-800">Usia</span>
              <span className="mr-1.5">:</span>
              <span className="text-black">{patientAge} Tahun</span>
            </div>
            <div className="flex items-baseline">
              <span className="w-28 shrink-0 text-slate-800">Status Kawin</span>
              <span className="mr-1.5">:</span>
              <span className="text-black">{patientMarital}</span>
            </div>
            <div className="flex items-baseline">
              <span className="w-28 shrink-0 text-slate-800">Pekerjaan</span>
              <span className="mr-1.5">:</span>
              <span className="text-black">{patientOccupation}</span>
            </div>
            <div className="flex items-baseline">
              <span className="w-28 shrink-0 text-slate-800">No. HP</span>
              <span className="mr-1.5">:</span>
              <span className="text-black font-medium">{patientPhone}</span>
            </div>
            <div className="flex items-baseline">
              <span className="w-28 shrink-0 text-slate-800">Tgl Pemeriksaan</span>
              <span className="mr-1.5">:</span>
              <span className="text-black font-medium">{sessionDateFormatted}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-0.5">
        <h3 className="font-bold text-black text-[10pt]">B. ASESMEN & CATATAN KLINIS</h3>
      </div>
    </div>
  );

  const renderSubsequentHeader = () => (
    <div
      ref={pageNHeaderRef}
      className="mb-3 pb-1 border-b border-black flex justify-between items-center text-[8.5pt] text-slate-700 shrink-0"
      style={{ fontFamily: '"Times New Roman", Times, serif' }}
    >
      <span className="font-bold text-black uppercase">
        Oase Jiwa — Rekam Medis Psikologis
      </span>
      <span>
        Pasien: <strong>{patientName}</strong> &nbsp;|&nbsp; No. RM: {rmDigits.join("")} &nbsp;|&nbsp; Sesi ke-{sessionNum}
      </span>
    </div>
  );

  const renderSignatureBlock = () => (
    <div
      ref={signatureMeasureRef}
      className="mt-4 pt-2 border-t border-slate-300 shrink-0"
      style={{ fontFamily: '"Times New Roman", Times, serif' }}
    >
      <div className="flex justify-end">
        <div className="text-center w-64">
          <p className="text-[9.5pt] text-black">
            Malang, {sessionDateFormatted}
          </p>
          <p className="font-bold text-black text-[10pt] mt-0.5">
            Psikolog Penanggung Jawab,
          </p>

          <div className="h-20 flex items-center justify-center my-1">
            {activeSignatureUrl ? (
              <img
                src={activeSignatureUrl}
                alt="Tanda Tangan Psikolog"
                className="max-h-20 max-w-[180px] object-contain"
              />
            ) : (
              <div className="h-16 w-full" />
            )}
          </div>

          <p className="font-bold text-black text-[10.5pt] underline">
            ( {finalPsychologistName} )
          </p>
          <p className="text-[9pt] text-black font-medium mt-0.5">
            SIPPK / SIPP : {finalSipp}
          </p>
          {finalStr !== "-" && (
            <p className="text-[8.5pt] text-slate-700">
              STR : {finalStr}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const renderFooter = (pageIndex: number, totalPages: number) => (
    <div
      className="mt-auto pt-1.5 border-t border-slate-400 flex justify-between items-center text-[8.5pt] text-slate-600 shrink-0"
      style={{ fontFamily: '"Times New Roman", Times, serif' }}
    >
      <span>Dokumen Rahasia Medis • Biro Psikologi Oase Jiwa</span>
      <span>Halaman {pageIndex + 1} dari {totalPages}</span>
    </div>
  );

  const displayPages =
    isCalculated && pdfPages.length > 0
      ? pdfPages
      : [{ pageIndex: 0, sections: allClinicalSections, includeSignature: true }];

  return (
    <>
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }
          html, body {
            width: 210mm !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .pdf-page-sheet {
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 auto !important;
            padding: 1.5cm 1.5cm 1.5cm 2cm !important;
            box-sizing: border-box !important;
            background: #ffffff !important;
            box-shadow: none !important;
            border: none !important;
            page-break-after: always !important;
            break-after: page !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            font-family: "Times New Roman", Times, serif !important;
          }
          #medical-record-modal-overlay {
            position: absolute !important;
            inset: 0 !important;
            background: none !important;
            padding: 0 !important;
          }
          #medical-record-modal-container {
            max-height: none !important;
            width: 100% !important;
            background: transparent !important;
            padding: 0 !important;
            box-shadow: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* OFF-SCREEN MEASURING */}
      <div
        ref={measuringContainerRef}
        style={{
          position: "absolute",
          top: "-9999px",
          left: "-9999px",
          width: "210mm",
          padding: "1.5cm 1.5cm 1.5cm 2cm",
          visibility: "hidden",
          pointerEvents: "none",
          boxSizing: "border-box",
          fontFamily: '"Times New Roman", Times, serif',
        }}
        className="text-[9.5pt] leading-relaxed"
      >
        {renderPage1Header()}
        {renderSubsequentHeader()}
        <div className="space-y-1 text-[9.5pt]">
          {allClinicalSections.map((sec) => (
            <div
              key={sec.id}
              ref={(el) => {
                sectionMeasureRefs.current[sec.id] = el;
              }}
            >
              {renderSection(sec)}
            </div>
          ))}
        </div>
        {renderSignatureBlock()}
      </div>

      {/* MODAL OVERLAY */}
      <div
        id="medical-record-modal-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 text-xs"
        onClick={onClose}
      >
        <div
          id="medical-record-modal-container"
          className="max-h-[94vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-slate-200 shadow-2xl p-4 sm:p-6 space-y-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 z-20 flex items-center justify-between border-b-2 border-slate-300 bg-white p-4 rounded-xl shadow-xs no-print">
            <div>
              <h3 className="font-bold text-[#19355E] text-sm">
                Rekam Medis Psikologis
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Pasien: <strong className="text-slate-800">{patientName}</strong> &nbsp;|&nbsp; No. RM: {rmDigits.join("")} &nbsp;|&nbsp; <strong className="text-[#19355E]">{displayPages.length} Halaman</strong>
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
                <span>{downloadingPdf ? "Memproses PDF..." : `Unduh PDF (${displayPages.length} Halaman)`}</span>
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

          {/* LEMBAR A4 MULTI-PAGE */}
          <div className="space-y-6">
            {displayPages.map((pageData, pageIdx) => (
              <div
                key={`page-${pageIdx}`}
                ref={(el) => {
                  pageDomRefs.current[pageIdx] = el;
                }}
                className="pdf-page-sheet relative w-[210mm] min-h-[297mm] h-[297mm] mx-auto bg-white shadow-md border border-slate-300 text-[9.5pt] leading-relaxed flex flex-col justify-between box-border overflow-hidden"
                style={{
                  width: "210mm",
                  height: "297mm",
                  minHeight: "297mm",
                  padding: "1.5cm 1.5cm 1.5cm 2cm",
                  fontFamily: '"Times New Roman", Times, serif',
                }}
              >
                {/* Watermark Logo Oase Jiwa */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04] select-none">
                  <img
                    src="/assets/logo/logo.png"
                    alt=""
                    className="w-[420px] h-[420px] object-contain"
                  />
                </div>

                <div className="relative z-10 flex-1 flex flex-col">
                  {pageIdx === 0 ? renderPage1Header() : renderSubsequentHeader()}

                  {pageData.sections.length > 0 && (
                    <div className="space-y-1 text-[9.5pt] leading-relaxed break-words flex-1">
                      {pageData.sections.map((sec) => renderSection(sec))}
                    </div>
                  )}

                  {pageData.includeSignature && renderSignatureBlock()}
                </div>

                <div className="relative z-10">
                  {renderFooter(pageIdx, displayPages.length)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}