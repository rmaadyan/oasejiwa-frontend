"use client";

import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
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
  riskLevelText?: string;
  isContinuation?: boolean;
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

  // State to store dynamically fetched psychologist profile (logged-in user)
  const [fetchedPsychologist, setFetchedPsychologist] = useState<{
    name: string;
    sipp: string;
    str: string;
    signatureUrl?: string | null;
    signatureUpdatedAt?: string | null;
  } | null>(null);

  // Pages layout state
  const [pdfPages, setPdfPages] = useState<PdfPageData[]>([]);
  const [isCalculated, setIsCalculated] = useState(false);

  // Measurement Refs
  const measuringContainerRef = useRef<HTMLDivElement>(null);
  const page1HeaderRef = useRef<HTMLDivElement>(null);
  const pageNHeaderRef = useRef<HTMLDivElement>(null);
  const sectionMeasureRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const signatureMeasureRef = useRef<HTMLDivElement>(null);
  const pageDomRefs = useRef<(HTMLDivElement | null)[]>([]);

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
  const totalSessionsCount = Math.max(
    patient?.totalSessions || 1,
    notesList.length || 1
  );

  // Helper to format absolute backend signature URL
  const formatSignatureUrl = (rawUrl?: string | null) => {
    if (!rawUrl) return null;
    const trimmed = String(rawUrl).trim();
    if (!trimmed || trimmed === "null" || trimmed === "undefined") return null;
    if (trimmed.startsWith("http")) return trimmed;
    const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "https://api.oasejiwa.id").replace(/\/+$/, "");
    return `${API_BASE_URL}${trimmed.startsWith("/") ? "" : "/"}${trimmed}`;
  };

  // Resolve signer data
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

  const rawPdfRisk = note.riskLevel || patient?.latestRiskLevel;
  const riskLevel = rawPdfRisk ? String(rawPdfRisk).toLowerCase() : "";

  const sessionNum = note.sessionNumber || 1;
  const formattedSessionDate = note.consultationDate || note.sessionDate || note.createdAt
    ? new Date(note.consultationDate || note.sessionDate || note.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
    : "-";
  const formattedSessionTime = note.sessionTime || "09:00 WIB";
  const consultationStatus = note.consultationStatus || "SELESAI";

  const rawDiagnosis = note?.diagnosis || note?.diagnosisSummary || (Array.isArray((patient as any)?.diagnosis) && (patient as any).diagnosis.length > 0 ? (patient as any).diagnosis.join(", ") : null) || "Dalam Evaluasi";
  const diagnosisStr = typeof rawDiagnosis === "string" && rawDiagnosis.trim() ? rawDiagnosis : "Dalam Evaluasi";

  const rawMedication = note?.medication || note?.currentMedication || (Array.isArray(patient?.currentMedication) && patient.currentMedication.length > 0 ? patient.currentMedication.join(", ") : null) || "Tidak ada";
  const medicationStr = typeof rawMedication === "string" && rawMedication.trim() ? rawMedication : "Tidak ada";

  const allergiesStr = Array.isArray(patient?.allergies) && patient.allergies.length > 0
    ? patient.allergies.join(", ")
    : note?.allergies || "Tidak ada";

  const followUpPlan = note?.followUpPlan || "CONTINUE_SESSION";
  const tagsStr = tags && tags.length > 0 ? (Array.isArray(tags) ? tags.join(", ") : String(tags)) : "Tidak ada";

  // Helper to split text content into natural paragraph/sentence chunks for dynamic A4 pagination
  const splitTextContent = (title: string, fullContent: string, baseId: string): ClinicalSectionItem[] => {
    if (!fullContent || fullContent.length <= 1200) {
      return [{ id: baseId, sectionKey: baseId, baseTitle: title, title, type: "text", content: fullContent }];
    }

    const rawParagraphs = fullContent.split(/\n+/).filter((p) => p.trim());
    const chunks: string[] = [];

    for (const p of rawParagraphs) {
      if (p.length <= 1200) {
        chunks.push(p);
      } else {
        let remaining = p;
        while (remaining.length > 0) {
          if (remaining.length <= 1000) {
            chunks.push(remaining);
            break;
          }

          let cutIdx = remaining.lastIndexOf(". ", 900);
          if (cutIdx < 300) cutIdx = remaining.lastIndexOf(" ", 900);
          if (cutIdx < 200) cutIdx = 800; // Fallback cut for huge unspaced strings

          chunks.push(remaining.substring(0, cutIdx + 1).trim());
          remaining = remaining.substring(cutIdx + 1).trim();
        }
      }
    }

    return chunks.map((chunkText, idx) => ({
      id: idx === 0 ? baseId : `${baseId}-part${idx + 1}`,
      sectionKey: baseId,
      baseTitle: title,
      title: title, // Base title initially; (Lanjutan) will be appended ONLY if it crosses a page break
      type: "text",
      content: chunkText,
    }));
  };

  // Build array of clinical sections for pagination calculation
  const allClinicalSections: ClinicalSectionItem[] = [
    ...splitTextContent("• Ringkasan Masalah Utama (Subjective) :", mainProblem, "sec-subjective"),
    ...splitTextContent("• Observasi Psikolog (Objective) :", observation, "sec-objective"),
    ...splitTextContent("• Assessment Psikolog :", assessment, "sec-assessment"),
    ...splitTextContent("• Rekomendasi Pendekatan Terapi (Plan) :", plan, "sec-plan"),
    { id: "sec-followup", sectionKey: "sec-followup", baseTitle: "• Rencana Tindak Lanjut :", title: "• Rencana Tindak Lanjut :", type: "checkboxes", followUpPlanValue: followUpPlan },
    { id: "sec-sessioninfo", sectionKey: "sec-sessioninfo", baseTitle: "• Sesi & Tanggal Follow-up :", title: "• Sesi & Tanggal Follow-up :", type: "session_info", sessionNum, nextSessionDate },
    ...splitTextContent(`• Alasan Penilaian Risiko (${riskLevel.toUpperCase() || "RENDAH"}) :`, riskReason, "sec-riskreason"),
    { id: "sec-recommendations", sectionKey: "sec-recommendations", baseTitle: "• Rekomendasi Penanganan Otomatis :", title: "• Rekomendasi Penanganan Otomatis :", type: "list", items: autoRecommendations },
    ...splitTextContent("• Fokus Sesi Berikutnya :", nextSessionFocus, "sec-nextfocus"),
    ...splitTextContent("• Catatan Tambahan (jika ada) :", additionalNotes, "sec-addnotes"),
    { id: "sec-referral", sectionKey: "sec-referral", baseTitle: "• Referral :", title: "• Referral :", type: "referral", content: tagsStr },
  ];

  // Perform dynamic height calculation & pagination
  const runPaginationCalculation = () => {
    if (!measuringContainerRef.current) return;

    // Standard A4 dimensions at 96 DPI: 297mm ~ 1122.5px.
    // Sheet padding top 1.5cm (15mm) + bottom 1.5cm (15mm) = 30mm ~ 113.4px.
    // Inner sheet total printable height = ~1009px.
    const TOTAL_A4_INNER_HEIGHT = 1009;
    const FOOTER_HEIGHT = 45;

    // Measured top headers
    const hPage1Header = page1HeaderRef.current?.offsetHeight || 340;
    const hPageNHeader = pageNHeaderRef.current?.offsetHeight || 115;
    const hSignature = signatureMeasureRef.current?.offsetHeight || 180;

    // Maximum height allowed for content per page
    const hPage1MaxContent = TOTAL_A4_INNER_HEIGHT - hPage1Header - FOOTER_HEIGHT - 15; // ~640px
    const hPageNMaxContent = TOTAL_A4_INNER_HEIGHT - hPageNHeader - FOOTER_HEIGHT - 15; // ~830px

    // Measure section heights
    const sectionHeights: { [id: string]: number } = {};
    allClinicalSections.forEach((sec) => {
      const el = sectionMeasureRefs.current[sec.id];
      sectionHeights[sec.id] = el?.offsetHeight || 50;
    });

    const rawPages: { pageIndex: number; sections: ClinicalSectionItem[]; includeSignature: boolean }[] = [];
    let currentSections: ClinicalSectionItem[] = [];
    let currentHeight = 0;
    let isPage1 = true;

    const maxContentHeight = () => (isPage1 ? hPage1MaxContent : hPageNMaxContent);

    for (let i = 0; i < allClinicalSections.length; i++) {
      const sec = allClinicalSections[i];
      const secH = sectionHeights[sec.id] || 50;

      // Check if section fits on current page
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

    // Now handle signature block
    if (currentHeight + hSignature <= maxContentHeight()) {
      rawPages.push({
        pageIndex: rawPages.length,
        sections: currentSections,
        includeSignature: true,
      });
    } else {
      // Save current page without signature
      if (currentSections.length > 0) {
        rawPages.push({
          pageIndex: rawPages.length,
          sections: currentSections,
          includeSignature: false,
        });
      }
      // Create new page specifically for signature
      rawPages.push({
        pageIndex: rawPages.length,
        sections: [],
        includeSignature: true,
      });
    }

    // Post-process section titles strictly based on PAGE BOUNDARIES
    const seenSectionKeys = new Set<string>();
    const finalPages: PdfPageData[] = rawPages.map((pageData) => {
      const pageSeenInThisPage = new Set<string>();
      const processedSections = pageData.sections.map((sec) => {
        const key = sec.sectionKey || sec.id;
        const baseTitle = sec.baseTitle || sec.title;

        if (seenSectionKeys.has(key)) {
          // This section key was rendered on a PREVIOUS PAGE
          if (!pageSeenInThisPage.has(key)) {
            pageSeenInThisPage.add(key);
            return {
              ...sec,
              title: `${baseTitle} (Lanjutan)`,
              isContinuation: true,
            };
          } else {
            // Second chunk on the SAME page -> Do not repeat title or (Lanjutan)
            return {
              ...sec,
              title: "",
              isContinuation: false,
            };
          }
        } else {
          // First time this section key appears in the document
          if (!pageSeenInThisPage.has(key)) {
            pageSeenInThisPage.add(key);
            return {
              ...sec,
              title: baseTitle,
              isContinuation: false,
            };
          } else {
            // Second chunk on the SAME first page -> Do not repeat title or (Lanjutan)
            return {
              ...sec,
              title: "",
              isContinuation: false,
            };
          }
        }
      });

      pageSeenInThisPage.forEach((k) => seenSectionKeys.add(k));

      return {
        ...pageData,
        sections: processedSections,
      };
    });

    setPdfPages(finalPages);
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
    if (!pageDomRefs.current.length) {
      alert("Element PDF tidak ditemukan");
      return;
    }

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

        if (i > 0) {
          pdf.addPage();
        }

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

      pdf.save(`Rekam-Medis-${patient.name.replace(/\s+/g, "_")}.pdf`);
    } catch (err) {
      console.error("Gagal generate PDF:", err);
      alert("Terjadi kesalahan saat memproses file PDF.");
    } finally {
      setDownloadingPdf(false);
    }
  };

  // Renders a single section component (Times New Roman, 11pt headings, 10pt body)
  const renderSection = (sec: ClinicalSectionItem) => {
    if (sec.type === "checkboxes") {
      return (
        <div key={sec.id} className="mb-2">
          <span className="font-bold text-[#19355E] text-[11pt] block mb-1">• Rencana Tindak Lanjut :</span>
          <div className="pl-4 flex items-center gap-6 text-slate-900 font-medium text-[10pt]">
            <label className={`flex items-center gap-1.5 ${sec.followUpPlanValue === "CONTINUE_SESSION" ? "font-bold text-blue-900" : ""}`}>
              <input type="checkbox" readOnly checked={sec.followUpPlanValue === "CONTINUE_SESSION"} className="rounded text-blue-600" />
              <span>[{sec.followUpPlanValue === "CONTINUE_SESSION" ? " ✓ " : "   "}] Lanjutkan sesi</span>
            </label>
            <label className={`flex items-center gap-1.5 ${sec.followUpPlanValue === "REFER_TO_OTHER" ? "font-bold text-amber-900" : ""}`}>
              <input type="checkbox" readOnly checked={sec.followUpPlanValue === "REFER_TO_OTHER"} className="rounded text-amber-600" />
              <span>[{sec.followUpPlanValue === "REFER_TO_OTHER" ? " ✓ " : "   "}] Rujukan ke profesional lain</span>
            </label>
            <label className={`flex items-center gap-1.5 ${sec.followUpPlanValue === "COMPLETED" ? "font-bold text-emerald-900" : ""}`}>
              <input type="checkbox" readOnly checked={sec.followUpPlanValue === "COMPLETED"} className="rounded text-emerald-600" />
              <span>[{sec.followUpPlanValue === "COMPLETED" ? " ✓ " : "   "}] Selesai</span>
            </label>
          </div>
        </div>
      );
    }

    if (sec.type === "session_info") {
      return (
        <div key={sec.id} className="pt-1 pb-1 my-1 border-t border-b border-slate-300 flex items-center justify-between text-slate-900 text-[10pt]">
          <span>• <strong>Sesi ini merupakan sesi ke :</strong> {sec.sessionNum}</span>
          <span>• <strong>Tanggal Sesi Lanjutan / Follow-up :</strong> {sec.nextSessionDate}</span>
        </div>
      );
    }

    if (sec.type === "list") {
      return (
        <div key={sec.id} className="mb-2">
          <span className="font-bold text-[#19355E] text-[11pt] block mb-1">{sec.title}</span>
          <ul className="pl-8 list-disc text-slate-900 space-y-0.5 text-[10pt] leading-relaxed break-words [overflow-wrap:anywhere] [word-break:break-word] whitespace-pre-wrap">
            {sec.items?.map((rec: string, idx: number) => (
              <li key={idx}>{rec}</li>
            ))}
          </ul>
        </div>
      );
    }

    if (sec.type === "referral") {
      return (
        <div key={sec.id} className="pt-1 my-1 border-t border-slate-300 flex items-start gap-2 text-[10pt]">
          <span className="font-bold text-[#19355E] shrink-0 text-[11pt]">• Referral :</span>
          <p className="text-slate-900 text-[10pt] leading-relaxed break-words [overflow-wrap:anywhere] [word-break:break-word] whitespace-pre-wrap pt-0.5">{sec.content}</p>
        </div>
      );
    }

    return (
      <div key={sec.id} className="mb-2">
        <span className="font-bold text-[#19355E] text-[11pt] block mb-1">{sec.title}</span>
        <p className="pl-4 text-slate-900 text-justify text-[10pt] leading-relaxed whitespace-pre-wrap break-words [overflow-wrap:anywhere] [word-break:break-word]">
          {sec.content}
        </p>
      </div>
    );
  };

  // Render Page 1 Header & Metadata (Times New Roman, clear hierarchy & balanced 2-column layout)
  const renderPage1Header = () => (
    <div ref={page1HeaderRef} className="space-y-2 mb-2 shrink-0" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
      {/* HEADER OASE JIWA */}
      <div className="flex justify-between items-center border-b-2 border-slate-800 pb-1.5">
        <div className="flex items-center gap-3">
          <img
            src="/assets/logo/logo.png"
            alt="Oase Jiwa Logo"
            className="h-11 w-auto object-contain shrink-0"
          />
          <div>
            <h2 className="font-bold text-[13pt] text-[#19355E] tracking-tight leading-tight">Oase Jiwa</h2>
            <p className="text-[10pt] text-slate-600 font-medium italic">Biro Psikologi</p>
          </div>
        </div>

        <div className="text-right">
          <h2 className="font-bold text-[11pt] text-[#19355E] uppercase tracking-wide">
            BIRO PSIKOLOGI OASE JIWA
          </h2>
          <p className="text-[10pt] text-slate-600 italic">Temukan Dirimu, Pulihkan Jiwamu.</p>
        </div>
      </div>

      {/* DOCUMENT TITLE */}
      <div className="text-center border-b border-slate-700 pb-0.5">
        <h3 className="font-bold text-[#19355E] uppercase tracking-wide text-[11pt] underline decoration-slate-400 decoration-1">
          CATATAN UNTUK PSIKOLOG (DIISI OLEH PSIKOLOG SETELAH SESI)
        </h3>
      </div>

      {/* METADATA BOX (Refined Professional 2-Column Grid & Risk Badge Layout) */}
      <div className="p-3 rounded-lg border border-slate-300 bg-slate-50/70 space-y-2.5 text-[10pt]">
        {/* ROW 1: Sesi, Tanggal, Jam (LEFT) & Risk Level Badge (RIGHT) */}
        <div className="flex justify-between items-center border-b border-slate-300/80 pb-2 gap-3">
          <div className="flex-1 min-w-0 text-slate-800 text-[10pt] font-medium leading-snug flex flex-wrap items-center gap-x-2.5 gap-y-0.5">
            <span className="whitespace-nowrap">
              <strong className="font-bold text-[#19355E]">
                Sesi Konsultasi ke-{sessionNum}
              </strong>{" "}
              <span className="text-slate-600">(dari total {totalSessionsCount} sesi)</span>
            </span>
            <span className="text-slate-400">|</span>
            <span className="whitespace-nowrap">
              Tanggal: <strong>{formattedSessionDate}</strong>
            </span>
            <span className="text-slate-400">|</span>
            <span className="whitespace-nowrap">
              Jam: <strong>{formattedSessionTime}</strong>
            </span>
          </div>

          <div className="shrink-0 flex-none pl-2">
            <span
              className={`inline-block px-2.5 py-0.5 rounded-full text-[9.5pt] font-bold tracking-wide uppercase border ${
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
        </div>

        {/* ROW 2: Balanced 2-Column Grid (Flat Pairs for Perfect Baseline Alignment) */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-[10pt] leading-snug items-baseline">
          {/* PAIR 1: Psikolog & Pasien */}
          <div className="min-w-0">
            <span className="font-bold text-slate-700">Psikolog:</span>{" "}
            <span className="text-slate-900 font-medium">{finalPsychologistName}</span>
          </div>
          <div className="min-w-0">
            <span className="font-bold text-slate-700">Pasien:</span>{" "}
            <span className="text-slate-900 font-bold">{patient.name}</span>
          </div>

          {/* PAIR 2: No. Rekam Medis & Status Konsultasi */}
          <div className="min-w-0 break-all [overflow-wrap:anywhere]">
            <span className="font-bold text-slate-700">No. Rekam Medis:</span>{" "}
            <span className="text-slate-900 font-mono text-[9.5pt]">{patient.id}</span>
          </div>
          <div className="min-w-0">
            <span className="font-bold text-slate-700">Status Konsultasi:</span>{" "}
            <span className="text-emerald-700 font-bold">{consultationStatus}</span>
          </div>

          {/* PAIR 3: Diagnosis & Obat Saat Ini */}
          <div className="min-w-0">
            <span className="font-bold text-slate-700">Diagnosis:</span>{" "}
            <span className="text-slate-900 font-medium">{diagnosisStr}</span>
          </div>
          <div className="min-w-0">
            <span className="font-bold text-slate-700">Obat Saat Ini:</span>{" "}
            <span className="text-slate-900 font-medium">{medicationStr}</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Render Page N Header (Subsequent Pages)
  const renderSubsequentHeader = () => (
    <div ref={pageNHeaderRef} className="space-y-1 mb-2 pb-1.5 border-b-2 border-slate-800 shrink-0" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <img
            src="/assets/logo/logo.png"
            alt="Oase Jiwa Logo"
            className="h-8 w-auto object-contain shrink-0"
          />
          <div>
            <h2 className="font-bold text-[11pt] text-[#19355E] tracking-tight">Oase Jiwa — Biro Psikologi</h2>
            <p className="text-[9.5pt] text-slate-600 italic">CATATAN UNTUK PSIKOLOG (LEMBAR LANJUTAN)</p>
          </div>
        </div>

        <div className="text-right text-[10pt]">
          <span className="font-bold text-[#19355E]">Pasien: {patient.name}</span>
          <span className="text-slate-600 block text-[9.5pt]">No. RM: {patient.id?.substring(0, 8)} &nbsp;|&nbsp; Sesi ke-{sessionNum}</span>
        </div>
      </div>
    </div>
  );

  // Render Digital Signature Block
  const renderSignatureBlock = () => (
    <div ref={signatureMeasureRef} className="mt-3 pt-2 border-t border-slate-300 shrink-0" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
      <div className="flex justify-end">
        <div className="text-center w-64">
          <p className="mb-0.5 text-[10pt] text-slate-800 font-medium">
            Malang, {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
          </p>
          <p className="font-bold text-[#19355E] text-[10.5pt]">
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
              <p className="text-[9.5pt] text-slate-400 font-mono">-----------------------------</p>
              <p className="text-[10pt] font-bold text-slate-700">Belum memiliki tanda tangan digital</p>
              <p className="text-[9.5pt] text-slate-400 font-mono">-----------------------------</p>
              <p className="text-[9pt] text-slate-500 italic mt-0.5">
                Silakan membuat tanda tangan digital pada menu Profil Saya.
              </p>
            </div>
          )}

          <p className="font-bold text-[#19355E] text-[11pt] underline mt-0.5">
            {finalPsychologistName}
          </p>
          <p className="text-[10pt] text-slate-700 font-semibold">
            {finalPsychologistSipp.startsWith("SIPP") ? finalPsychologistSipp : `SIPP: ${finalPsychologistSipp}`}
          </p>
          {finalPsychologistStr && (
            <p className="text-[9.5pt] text-slate-600 font-medium">
              {finalPsychologistStr.startsWith("STR") ? finalPsychologistStr : `STR: ${finalPsychologistStr}`}
            </p>
          )}

          {/* Status Badge & Timestamp */}
          {activeSignatureUrl && (
            <div className="mt-1 flex flex-col items-center gap-0.5 text-[9pt]">
              <span className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                ✔ Ditandatangani secara Digital
              </span>
              {activeSignatureUpdatedAt && (
                <span className="text-[8.5pt] text-slate-600 font-medium">
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
    </div>
  );

  // Render Footer for a page
  const renderFooter = (pageIndex: number, totalPages: number) => (
    <div className="mt-auto pt-1.5 border-t border-slate-300 flex justify-between items-center text-[9.5pt] text-slate-600 shrink-0" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
      <span>Dokumen Rahasia Medis - Biro Psikologi Oase Jiwa</span>
      <span>Generated by Oase Jiwa System | Halaman {pageIndex + 1} dari {totalPages}</span>
    </div>
  );

  const displayPages = isCalculated && pdfPages.length > 0 ? pdfPages : [
    { pageIndex: 0, sections: allClinicalSections, includeSignature: true }
  ];

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

      {/* OFF-SCREEN HIDDEN MEASURING CONTAINER */}
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
        className="text-[10pt] leading-relaxed"
      >
        {renderPage1Header()}
        {renderSubsequentHeader()}
        <div className="p-2.5 rounded-lg border border-slate-300 bg-white space-y-1.5 text-[10pt]">
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

      {/* VISIBLE MODAL OVERLAY */}
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
          {/* TOP CONTROLS & HEADER */}
          <div className="sticky top-0 z-20 flex items-center justify-between border-b-2 border-slate-300 bg-white p-4 rounded-xl shadow-xs no-print">
            <div>
              <h3 className="font-bold text-[#19355E] text-sm">
                Dokumen Rekam Medis Digital Multi-Page
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Pasien: <strong className="text-slate-800">{patient.name}</strong> &nbsp;|&nbsp; Rekam Medis #{patient.id?.substring(0, 8)} &nbsp;|&nbsp; <strong className="text-[#19355E]">{displayPages.length} Halaman</strong>
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

          {/* ============================================================ */}
          {/* MULTI-PAGE A4 CONTAINER SHEETS */}
          {/* ============================================================ */}
          <div className="space-y-6">
            {displayPages.map((pageData, pageIdx) => (
              <div
                key={`page-${pageIdx}`}
                ref={(el) => {
                  pageDomRefs.current[pageIdx] = el;
                }}
                className="pdf-page-sheet w-[210mm] min-h-[297mm] h-[297mm] mx-auto bg-white shadow-md border border-slate-300 text-[10pt] leading-relaxed flex flex-col justify-between box-border"
                style={{
                  width: "210mm",
                  height: "297mm",
                  minHeight: "297mm",
                  padding: "1.5cm 1.5cm 1.5cm 2cm",
                  fontFamily: '"Times New Roman", Times, serif',
                }}
              >
                <div className="flex-1 flex flex-col space-y-1.5">
                  {/* HEADER FOR THIS PAGE */}
                  {pageIdx === 0 ? renderPage1Header() : renderSubsequentHeader()}

                  {/* CLINICAL DOCUMENTATION BOX FOR THIS PAGE */}
                  {pageData.sections.length > 0 && (
                    <div className="p-2.5 rounded-lg border border-slate-300 bg-white space-y-1.5 text-[10pt] leading-relaxed break-words flex-1">
                      {pageData.sections.map((sec) => renderSection(sec))}
                    </div>
                  )}

                  {/* SIGNATURE BLOCK IF THIS PAGE CONTAINS SIGNATURE */}
                  {pageData.includeSignature && renderSignatureBlock()}
                </div>

                {/* CONSISTENT FOOTER FOR THIS PAGE */}
                {renderFooter(pageIdx, displayPages.length)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
