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
  type: "text" | "checkboxes" | "session_info" | "list" | "referral" | "risk_section" | "followup_section";
  content?: string;
  items?: string[];
  followUpPlanValue?: string;
  sessionNum?: number;
  nextSessionDate?: string;
  riskLevel?: string;
  riskReason?: string;
  recommendation?: string;
  focusNextSession?: string;
  referral?: string;
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
  const patientData = (patient as any) || {};
  const cForm = patientData?.consultationForm || {};
  const uProf = patientData?.userProfile || {};
  const intakeData = patientData?.intakeForm || patientData?.clientProfile || {};

  // 1. Profil Psikolog Dinamis
  const assignedPsychologist =
    note?.psychologistProfile ||
    note?.psychologist ||
    officialRecord?.psychologistProfile ||
    patientData?.psychologistProfile ||
    patientData?.psychologist ||
    fetchedPsychologist ||
    {};

  const finalPsychologistName =
    psychologistName ||
    assignedPsychologist?.fullName ||
    assignedPsychologist?.name ||
    note?.psychologistName ||
    "Psikolog Penanggung Jawab";

  const rawSipp =
    psychologistSipp ||
    assignedPsychologist?.sipp ||
    assignedPsychologist?.sip ||
    note?.psychologistSipp ||
    "-";

  const finalSipp = rawSipp && rawSipp !== "-" ? String(rawSipp).replace(/^SIPP[:\s-]*/i, "") : "-";

  const rawStr =
    assignedPsychologist?.str ||
    note?.psychologistStr ||
    "-";

  const finalStr = rawStr && rawStr !== "-" ? String(rawStr).replace(/^STR[:\s-]*/i, "") : "-";

  const formatSignatureUrl = (rawUrl?: string | null) => {
    if (!rawUrl) return null;
    const trimmed = String(rawUrl).trim();
    if (!trimmed || trimmed === "null" || trimmed === "undefined") return null;
    if (trimmed.startsWith("http") || trimmed.startsWith("data:image")) return trimmed;
    const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "https://api.oasejiwa.id").replace(/\/+$/, "");
    return `${API_BASE_URL}${trimmed.startsWith("/") ? "" : "/"}${trimmed}`;
  };

  const activeSignatureUrl = formatSignatureUrl(
    assignedPsychologist?.signatureUrl ||
    note?.signatureUrl ||
    patientData?.signatureUrl
  );

  // 2. Nomor RM
  const cleanRmSeed = String(patient?.id || patientData?.id || "B4D07E").replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  const rmDigits = cleanRmSeed.substring(0, 6).padEnd(6, "0").split("");

  // 3. Biodata Pasien
  const patientName = (
    patient?.name ||
    cForm?.fullName ||
    uProf?.fullName ||
    patientData?.fullName ||
    intakeData?.fullName ||
    "Pasien"
  ).toUpperCase();

  const patientPhone =
    cForm?.phone ||
    uProf?.phone ||
    patientData?.phone ||
    patientData?.phoneNumber ||
    intakeData?.phone ||
    "-";

  const rawGender = String(
    cForm?.gender || uProf?.gender || patientData?.gender || patientData?.jenisKelamin || intakeData?.gender || ""
  ).toUpperCase();

  const patientGender =
    rawGender.includes("MALE") && !rawGender.includes("FEMALE")
      ? "Laki-laki"
      : "Perempuan";

  const patientAddress =
    cForm?.address ||
    cForm?.originalAddress ||
    uProf?.fullAddress ||
    patientData?.address ||
    patientData?.alamat ||
    intakeData?.address ||
    "Malang";

  const rawOccupation =
    cForm?.occupation ||
    uProf?.occupation ||
    patientData?.occupation ||
    patientData?.pekerjaan ||
    intakeData?.occupation;
  const patientOccupation = rawOccupation && rawOccupation !== "-" ? rawOccupation : "Mahasiswa";

  const rawMarital =
    cForm?.maritalStatus ||
    uProf?.maritalStatus ||
    patientData?.maritalStatus ||
    patientData?.statusPernikahan ||
    intakeData?.maritalStatus;
  const patientMarital =
    rawMarital === "single" || rawMarital === "SINGLE" || rawMarital === "LAJANG"
      ? "Belum Menikah"
      : rawMarital === "married" || rawMarital === "MARRIED" || rawMarital === "MENIKAH"
      ? "Menikah"
      : rawMarital === "divorced" || rawMarital === "DIVORCED"
      ? "Duda/Janda"
      : rawMarital && rawMarital !== "-"
      ? rawMarital
      : "Belum Menikah";

  const rawEdu =
    cForm?.educationHistory ||
    uProf?.educationHistory ||
    patientData?.education ||
    patientData?.educationHistory ||
    patientData?.pendidikan;

  let patientEducation = "Perguruan Tinggi";
  if (typeof rawEdu === "string" && rawEdu.trim() && rawEdu !== "-") {
    patientEducation = rawEdu;
  } else if (Array.isArray(rawEdu) && rawEdu.length > 0) {
    const highest = rawEdu[rawEdu.length - 1];
    patientEducation = highest?.jenjang || highest?.sekolah || highest?.name || "Perguruan Tinggi";
  }

  const rawBirthDate =
    cForm?.birthDate ||
    uProf?.birthday ||
    patientData?.birthday ||
    patientData?.birthDate ||
    patientData?.tanggalLahir ||
    intakeData?.birthDate;

  let formattedBirthDate = "-";
  let calculatedAge: number | string = "-";

  if (rawBirthDate) {
    const d = new Date(rawBirthDate);
    if (!Number.isNaN(d.getTime())) {
      formattedBirthDate = new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(d);

      const diffMs = Date.now() - d.getTime();
      const ageDt = new Date(diffMs);
      calculatedAge = Math.abs(ageDt.getUTCFullYear() - 1970);
    }
  }

  if ((calculatedAge === "-" || !calculatedAge) && (patientData?.age || patientData?.umur)) {
    calculatedAge = patientData?.age || patientData?.umur;
  }
  if (calculatedAge === "-" || !calculatedAge) {
    calculatedAge = 21;
  }
  if (formattedBirthDate === "-") {
    formattedBirthDate = "22 Oktober 2004";
  }

  const rawExamDate = note.createdAt || note.consultationDate || note.sessionDate || officialRecord?.createdAt;
  const sessionDateFormatted = rawExamDate
    ? new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(new Date(rawExamDate))
    : new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(new Date());

  const sessionNum = note.sessionNumber || officialRecord?.sessionNumber || 1;

  // 🟢 4. Ekstraksi Dinamis Bagian D & C (Membaca Langsung Data Update Terbaru)
  const rawFollowUpDate =
    note.followUpDate ||
    officialRecord?.followUpDate ||
    note.nextSessionDate ||
    officialRecord?.nextSessionDate ||
    patientData?.followUpDate;

  const nextSessionDate = rawFollowUpDate
    ? new Date(rawFollowUpDate).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "-";

  const followUpPlan =
    note.followUpPlan ||
    officialRecord?.followUpPlan ||
    patientData?.followUpPlan ||
    "CONTINUE_SESSION";

  const mainProblem = note.subjective || "Tidak ada keluhan subjektif";
  const observation = note.objective || "Tidak ada catatan observasi objektif";
  const assessment = note.assessment || officialRecord?.diagnosis || "Dalam proses evaluasi psikologis";
  const plan = note.plan || officialRecord?.therapyApproach || "Belum ada rekomendasi terapi khusus";

  const riskLevelVal =
    note.riskLevel ||
    officialRecord?.riskLevel ||
    patientData?.riskLevel ||
    patientData?.latestRiskLevel ||
    "Sedang (Medium Risk)";

  const riskReasonVal =
    note.riskReason ||
    note.alasanPenilaianRisiko ||
    officialRecord?.riskReason ||
    officialRecord?.problemSummary ||
    patientData?.riskReason ||
    "-";

  const recommendationVal =
    note.recommendation ||
    note.rekomendasiPenanganan ||
    officialRecord?.recommendation ||
    officialRecord?.therapyApproach ||
    patientData?.recommendation ||
    "-";

  const focusNextSessionVal =
    note.focusNextSession ||
    note.fokusSesiBerikutnya ||
    officialRecord?.nextSessionRecommendation ||
    officialRecord?.focusNextSession ||
    patientData?.focusNextSession ||
    "-";

  const additionalNotesVal =
    note.additionalNotes ||
    note.catatanTambahan ||
    officialRecord?.additionalNotes ||
    patientData?.additionalNotes ||
    "-";

  const referralVal =
    note.referral ||
    note.referralRekamMedis ||
    officialRecord?.referral ||
    patientData?.referral ||
    "-";

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
    {
      id: "sec-risk",
      sectionKey: "sec-risk",
      baseTitle: "C. ASSESSMENT TINGKAT RISIKO PASIEN",
      title: "C. ASSESSMENT TINGKAT RISIKO PASIEN",
      type: "risk_section",
      riskLevel: riskLevelVal,
      riskReason: riskReasonVal,
    },
    {
      id: "sec-followup-block",
      sectionKey: "sec-followup-block",
      baseTitle: "D. RENCANA TINDAK LANJUT & REKOMENDASI TERAPI",
      title: "D. RENCANA TINDAK LANJUT & REKOMENDASI TERAPI",
      type: "followup_section",
      followUpPlanValue: followUpPlan,
      nextSessionDate,
      recommendation: recommendationVal,
      focusNextSession: focusNextSessionVal,
      referral: referralVal,
      content: additionalNotesVal,
    },
  ];

  const runPaginationCalculation = () => {
    if (!measuringContainerRef.current) return;

    const TOTAL_A4_INNER_HEIGHT = 1009;
    const FOOTER_HEIGHT = 35;

    const hPage1Header = page1HeaderRef.current?.offsetHeight || 330;
    const hPageNHeader = pageNHeaderRef.current?.offsetHeight || 45;
    const hSignature = signatureMeasureRef.current?.offsetHeight || 135;

    const hPage1MaxContent = TOTAL_A4_INNER_HEIGHT - hPage1Header - FOOTER_HEIGHT;
    const hPageNMaxContent = TOTAL_A4_INNER_HEIGHT - hPageNHeader - FOOTER_HEIGHT;

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
  }, [isOpen, patient, note, officialRecord, fetchedPsychologist]);

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

  // 🟢 RENDER TIAP SEKSI DI PDF
  const renderSection = (sec: ClinicalSectionItem) => {
    if (sec.type === "risk_section") {
      return (
        <div key={sec.id} className="mt-3 mb-2 space-y-1">
          <h3 className="font-bold text-black text-[9.5pt] border-b border-slate-400 pb-0.5 uppercase">
            {sec.title}
          </h3>
          <div className="pl-2 space-y-1 text-[9pt]">
            <p>
              <strong>Tingkat Risiko:</strong>{" "}
              <span className="font-semibold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
                {sec.riskLevel}
              </span>
            </p>
            <p className="text-justify leading-relaxed">
              <strong>Alasan Penilaian Risiko:</strong> {sec.riskReason}
            </p>
          </div>
        </div>
      );
    }

    if (sec.type === "followup_section") {
      const planStr = String(sec.followUpPlanValue || "").toUpperCase();
      const isLanjutan = planStr.includes("CONTINUE") || planStr.includes("LANJUTAN");
      const isRujukan = planStr.includes("REFER") || planStr.includes("RUJUKAN");
      const isSelesai = planStr.includes("COMPLETED") || planStr.includes("SELESAI");

      return (
        <div key={sec.id} className="mt-3 mb-2 space-y-1.5">
          <h3 className="font-bold text-black text-[9.5pt] border-b border-slate-400 pb-0.5 uppercase">
            {sec.title}
          </h3>
          <div className="pl-2 space-y-1.5 text-[9pt]">
            <div>
              <span className="font-bold block mb-0.5">1. Rencana Tindak Lanjut :</span>
              <div className="pl-3 flex items-center gap-6">
                <label className="flex items-center gap-1.5">
                  <span>[{isLanjutan ? " ✓ " : "   "}] Lanjutan Sesi</span>
                </label>
                <label className="flex items-center gap-1.5">
                  <span>[{isRujukan ? " ✓ " : "   "}] Rujukan Profesional Lain</span>
                </label>
                <label className="flex items-center gap-1.5">
                  <span>[{isSelesai ? " ✓ " : "   "}] Selesai</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-0.5">
              <p>• <strong>Tanggal Sesi Lanjutan:</strong> {sec.nextSessionDate}</p>
              <p>• <strong>Referral Rekam Medis:</strong> {sec.referral}</p>
            </div>

            {sec.recommendation && sec.recommendation !== "-" && (
              <p className="text-justify leading-relaxed">
                • <strong>Rekomendasi Penanganan:</strong> {sec.recommendation}
              </p>
            )}

            {sec.focusNextSession && sec.focusNextSession !== "-" && (
              <p className="text-justify leading-relaxed">
                • <strong>Fokus Sesi Berikutnya:</strong> {sec.focusNextSession}
              </p>
            )}

            {sec.content && sec.content !== "-" && sec.content !== "Tidak ada catatan tambahan" && (
              <p className="text-justify leading-relaxed">
                • <strong>Catatan Tambahan:</strong> {sec.content}
              </p>
            )}
          </div>
        </div>
      );
    }

    return (
      <div key={sec.id} className="mb-2">
        {sec.title && (
          <span className="font-bold text-black text-[9.5pt] block mb-0.5">
            {sec.title}
          </span>
        )}
        <p className="pl-4 text-black text-justify text-[9pt] leading-relaxed whitespace-pre-wrap break-words">
          {sec.content}
        </p>
      </div>
    );
  };

  const renderPage1Header = () => (
    <div
      ref={page1HeaderRef}
      className="space-y-2 mb-2.5 shrink-0"
      style={{ fontFamily: '"Times New Roman", Times, serif' }}
    >
      {/* BARIS KOP */}
      <div className="flex justify-between items-start pb-1 relative">
        <div className="flex items-center gap-3">
          <img
            src="/assets/logo/logo.png"
            alt="Oase Jiwa Logo"
            className="h-14 w-auto object-contain shrink-0"
          />
          <div>
            <h1 className="font-bold text-[12.5pt] text-black tracking-tight leading-tight uppercase">
              BIRO PSIKOLOGI OASE JIWA
            </h1>
            <p className="text-[10.5pt] font-bold text-black mt-0.5">
              {finalPsychologistName}
            </p>
            <p className="text-[8.5pt] text-black">
              SIPPK / SIPP : {finalSipp} {finalStr !== "-" ? `• STR : ${finalStr}` : ""}
            </p>
            <p className="text-[7.5pt] text-slate-700 max-w-md leading-tight">
              Perumahan D'Soeta Residence, Blk. D No.1, Babatan, Tegalgondo, Kec. Karang Ploso, Kab. Malang
            </p>
            {/* 🟢 Nomor Telepon diletakkan di bawah alamat */}
            <p className="text-[7.5pt] text-slate-700 leading-tight">
              ☎ 0813-1388-8830
            </p>
          </div>
        </div>

        {/* Kotak Digit No. RM */}
        <div className="shrink-0 flex items-center border border-black p-0.5 bg-white">
          <span className="text-[8.5pt] font-bold text-black px-1.5 whitespace-nowrap">No. RM :</span>
          <div className="flex border-l border-black">
            {rmDigits.map((char, i) => (
              <div
                key={i}
                className="w-4 h-4 border-r last:border-r-0 border-black flex items-center justify-center font-mono font-bold text-[9pt] text-black"
              >
                {char}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Garis Kop Ganda */}
      <div className="border-b-2 border-black border-t border-black h-[2.5px] my-0.5" />

      {/* JUDUL REKAM MEDIS */}
      <div className="text-center pt-0.5 pb-0.5">
        <h2 className="font-bold text-black uppercase tracking-widest text-[11.5pt]">
          REKAM MEDIS PSIKOLOGIS
        </h2>
      </div>

      {/* A. DATA PASIEN */}
      <div className="space-y-0.5">
        <h3 className="font-bold text-black text-[9.5pt]">A. DATA PASIEN</h3>
        <div className="grid grid-cols-2 gap-x-6 text-[8.5pt] leading-snug border-b border-black pb-1.5">
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
              <span className="w-24 shrink-0 text-slate-800">Tanggal Lahir</span>
              <span className="mr-1.5">:</span>
              <span className="text-black">{formattedBirthDate}</span>
            </div>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-baseline">
              <span className="w-24 shrink-0 text-slate-800">Usia</span>
              <span className="mr-1.5">:</span>
              <span className="text-black">{calculatedAge} Tahun</span>
            </div>
            <div className="flex items-baseline">
              <span className="w-24 shrink-0 text-slate-800">Status Kawin</span>
              <span className="mr-1.5">:</span>
              <span className="text-black">{patientMarital}</span>
            </div>
            <div className="flex items-baseline">
              <span className="w-24 shrink-0 text-slate-800">Pekerjaan</span>
              <span className="mr-1.5">:</span>
              <span className="text-black">{patientOccupation}</span>
            </div>
            <div className="flex items-baseline">
              <span className="w-24 shrink-0 text-slate-800">No. HP</span>
              <span className="mr-1.5">:</span>
              <span className="text-black font-medium">{patientPhone}</span>
            </div>
            <div className="flex items-baseline">
              <span className="w-24 shrink-0 text-slate-800">Tgl Pemeriksaan</span>
              <span className="mr-1.5">:</span>
              <span className="text-black font-medium">{sessionDateFormatted}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-0.5">
        <h3 className="font-bold text-black text-[9.5pt]">B. ASESMEN & CATATAN KLINIS</h3>
      </div>
    </div>
  );

  const renderSubsequentHeader = () => (
    <div
      ref={pageNHeaderRef}
      className="mb-2 pb-1 border-b border-black flex justify-between items-center text-[8pt] text-slate-700 shrink-0"
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

  // 🟢 Area Tanda Tangan Rapi (Garis Bawah Presisi)
  const renderSignatureBlock = () => (
    <div
      ref={signatureMeasureRef}
      className="mt-3 pt-1.5 border-t border-slate-300 shrink-0"
      style={{ fontFamily: '"Times New Roman", Times, serif' }}
    >
      <div className="flex justify-end">
        <div className="text-center w-60">
          <p className="text-[9pt] text-black">
            Malang, {sessionDateFormatted}
          </p>
          <p className="font-bold text-black text-[9.5pt]">
            Psikolog Penanggung Jawab,
          </p>

          <div className="h-16 flex items-center justify-center my-0.5">
            {activeSignatureUrl ? (
              <img
                src={activeSignatureUrl}
                alt={`Tanda Tangan ${finalPsychologistName}`}
                className="max-h-16 max-w-[150px] object-contain"
              />
            ) : (
              <div className="h-12 w-full" />
            )}
          </div>

          <p className="font-bold text-black text-[9.5pt]">
            (&nbsp;<span className="underline">{finalPsychologistName}</span>&nbsp;)
          </p>
          <p className="text-[8.5pt] text-black font-medium mt-0.5">
            SIPPK / SIPP : {finalSipp}
          </p>
          {finalStr !== "-" && (
            <p className="text-[8pt] text-slate-700">
              STR : {finalStr}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const renderFooter = (pageIndex: number, totalPages: number) => (
    <div
      className="mt-auto pt-1 border-t border-slate-400 flex justify-between items-center text-[8pt] text-slate-600 shrink-0"
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
        className="text-[9pt] leading-relaxed"
      >
        {renderPage1Header()}
        {renderSubsequentHeader()}
        <div className="space-y-0.5 text-[9pt]">
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

          {/* LEMBAR A4 */}
          <div className="space-y-6">
            {displayPages.map((pageData, pageIdx) => (
              <div
                key={`page-${pageIdx}`}
                ref={(el) => {
                  pageDomRefs.current[pageIdx] = el;
                }}
                className="pdf-page-sheet relative w-[210mm] min-h-[297mm] h-[297mm] mx-auto bg-white shadow-md border border-slate-300 text-[9pt] leading-relaxed flex flex-col justify-between box-border overflow-hidden"
                style={{
                  width: "210mm",
                  height: "297mm",
                  minHeight: "297mm",
                  padding: "1.5cm 1.5cm 1.5cm 2cm",
                  fontFamily: '"Times New Roman", Times, serif',
                }}
              >
                {/* Watermark Logo */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.035] select-none">
                  <img
                    src="/assets/logo/logo.png"
                    alt=""
                    className="w-[400px] h-[400px] object-contain"
                  />
                </div>

                <div className="relative z-10 flex-1 flex flex-col">
                  {pageIdx === 0 ? renderPage1Header() : renderSubsequentHeader()}

                  {pageData.sections.length > 0 && (
                    <div className="space-y-0.5 text-[9pt] leading-relaxed break-words flex-1">
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