"use client";

import React, { useRef, useState } from "react";
import { X, Printer, Download, FileText } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import type { PsychologistPatientDetail } from "@/lib/types/psychologist";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  patient: PsychologistPatientDetail | null;
  psychologistName?: string;
  psychologistSipp?: string;
}

export default function MedicalRecordPdfModal({
  isOpen,
  onClose,
  patient,
  psychologistName = "Andi Zainuddin Japeri, M.Psi., Psikolog",
  psychologistSipp = "SIPP: 20221034-2024-2272",
}: Props) {
  const printRef = useRef<HTMLDivElement>(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  if (!isOpen || !patient) return null;

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const styles = Array.from(
      document.querySelectorAll("style, link[rel='stylesheet']")
    )
      .map((el) => el.outerHTML)
      .join("\n");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Formulir Klien & Rekam Medis Digital - ${patient.name}</title>
          ${styles}
          <style>
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            @media print {
              body {
                background-color: #ffffff !important;
                margin: 0 !important;
                padding: 0 !important;
              }
              @page {
                size: A4;
                margin: 0;
              }
              .pdf-page {
                page-break-after: always !important;
                break-after: page !important;
                margin: 0 !important;
                box-shadow: none !important;
                border: none !important;
                border-radius: 0 !important;
                padding: 15mm 15mm 15mm 15mm !important;
              }
              .no-print {
                display: none !important;
              }
            }
            body {
              font-family: 'Times New Roman', Times, serif;
              background: #f1f5f9;
              color: #111;
              padding: 20px;
            }
          </style>
        </head>
        <body>
          <div style="max-width: 800px; margin: 0 auto;">
            ${content.innerHTML}
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
    }, 600);
  };

  const handleDownloadJsPDF = async () => {
    const content = printRef.current;
    if (!content) return;

    setDownloadingPdf(true);
    try {
      const pageElements = content.querySelectorAll<HTMLElement>(".pdf-page");
      const pdf = new jsPDF("p", "mm", "a4");

      if (pageElements.length > 0) {
        for (let i = 0; i < pageElements.length; i++) {
          const pageEl = pageElements[i];
          const canvas = await html2canvas(pageEl, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: "#ffffff",
          });

          const imgData = canvas.toDataURL("image/png");
          if (i > 0) {
            pdf.addPage();
          }
          pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
        }
      } else {
        const canvas = await html2canvas(content, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
        });
        const imgData = canvas.toDataURL("image/png");
        pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
      }

      pdf.save(
        `Rekam_Medis_${(patient.name || "Klien").replace(/\s+/g, "_")}.pdf`
      );
    } catch (err) {
      console.error("Gagal export jsPDF:", err);
    } finally {
      setDownloadingPdf(false);
    }
  };

  const cForm = patient.consultationForm || {
    mainReason: patient.lastNotes || "Mengalami kecemasan berlebih dan gangguan tidur terkait tekanan aktivitas kerja.",
    takingPsychiatricMeds: false,
    problemDuration: "ONE_TO_3_MONTHS",
    symptomFrequency: "WEEKLY",
    dailyImpact: "MODERATE",
    hasSimilarHistory: false,
    hasFamilyHistory: false,
    hasMedicalTreatment: false,
    hasTraumaticEvent: false,
    sleepQuality: "POOR",
    selfHarmThoughts: "NEVER",
    usesAddictiveSubstances: false,
    eatingPattern: "IRREGULAR",
    exerciseFrequency: "RARELY",
    stressLevel: "MODERATE",
  };

  const tesResults =
    patient.tesResults && patient.tesResults.length > 0
      ? patient.tesResults
      : [
          {
            createdAt: "2026-07-15",
            namaTes: patient.latestTesName || "Skala Kecemasan (DASS-21)",
            totalScore: 10,
            maxScore: 21,
            percentage: 48,
            kategoriNama: patient.latestTesCategory
              ? `${patient.latestTesCategory} Sedang`
              : "Kecemasan Sedang (Moderate Anxiety)",
          },
        ];

  const defaultSessionNotes = [
    {
      id: "note-pdf-1",
      sessionNumber: 1,
      consultationDate: "2026-07-15",
      riskLevel: patient.latestRiskLevel
        ? patient.latestRiskLevel.toUpperCase()
        : "MEDIUM",
      diagnosisSummary:
        "Gejala mengarah pada Gangguan Kecemasan Umum (Generalized Anxiety Disorder) dengan tingkat keparahan sedang.",
      treatmentApproach:
        "Psychoeducation mengenai kecemasan, Teknik pernapasan diafragma, CBT dasar, dan latihan relaksasi.",
      followUpPlan: "CONTINUE_SESSION",
      followUpDate: "2026-07-29",
      additionalNotes:
        "Pasien kooperatif dan termotivasi tinggi untuk melanjutkan sesi konseling.",
    },
  ];

  const notes =
    patient.sessionNotesList && patient.sessionNotesList.length > 0
      ? patient.sessionNotesList
      : Array.isArray(patient.notes) && patient.notes.length > 0
      ? patient.notes
      : defaultSessionNotes;

  const defaultEdu: Record<string, { institution: string; major: string; startYear: string; endYear: string }> = {
    SD: { institution: "SD Negeri 01 Jakarta", major: "Umum", startYear: "2004", endYear: "2010" },
    SMP: { institution: "SMP Negeri 11 Jakarta", major: "Umum", startYear: "2010", endYear: "2013" },
    SMA: { institution: "SMA Negeri 28 Jakarta", major: "IPA", startYear: "2013", endYear: "2016" },
    "Perguruan Tinggi": { institution: "Universitas Indonesia", major: "Teknik Informatika", startYear: "2016", endYear: "2020" },
  };

  const eduHistory = patient.educationHistory || defaultEdu;
  const siblingPos = patient.siblingPosition || 1;
  const totalSibl = patient.totalSiblings || 2;
  const placeBirth = patient.placeOfBirth || "Jakarta";
  const origAddr = patient.originalAddress || patient.address || "Jl. Sudirman No. 45, Jakarta Selatan";
  const patientAge = patient.age || 28;
  const patientBday = patient.birthday ? String(patient.birthday).split("T")[0] : "1998-05-14";
  const patientAddr = patient.address || "Jl. Sudirman No. 45, Jakarta Selatan";
  const patientPhone = patient.phone || "0812-3456-7890";
  const patientEmail = patient.email || "budi.santoso@example.com";
  const patientOcc = patient.occupation || "Software Engineer";

  const isMarried =
    patient.maritalStatus?.toLowerCase().includes("menikah") &&
    !patient.maritalStatus?.toLowerCase().includes("belum");
  const isDivorced =
    patient.maritalStatus?.toLowerCase().includes("duda") ||
    patient.maritalStatus?.toLowerCase().includes("janda");
  const isSingle = !isMarried && !isDivorced;
  const isFirstVisit = patient.isFirstVisit ?? true;

  const HeaderBanner = () => (
    <div
      className="flex items-center justify-between bg-gradient-to-r from-sky-100 via-blue-100 to-sky-200 px-6 py-3.5 rounded-xl mb-4 border border-sky-300 shadow-sm"
      style={{ WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
    >
      <div className="flex items-center gap-3">
        <img
          src="/logo.png"
          alt="Oase Jiwa Logo"
          className="h-12 w-auto object-contain rounded"
          onError={(e) => {
            (e.target as HTMLElement).setAttribute("src", "/logo.svg");
          }}
        />
        <div>
          <h2 className="font-sans font-extrabold text-[#234463] text-lg leading-none tracking-wide">
            Oase Jiwa
          </h2>
          <p className="text-[10px] text-slate-600 font-sans italic mt-0.5">
            Biro Psikologi
          </p>
        </div>
      </div>
      <div className="text-right">
        <h1 className="font-sans font-bold text-lg text-[#234463] tracking-wider uppercase">
          BIRO PSIKOLOGI OASE JIWA
        </h1>
        <p className="text-[11px] text-slate-600 italic mt-0.5">
          Temukan Dirimu, Pulihkan Jiwamu.
        </p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="flex h-[92vh] w-full max-w-4xl flex-col rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-[#2B5379] flex items-center gap-2">
              <FileText className="h-5 w-5" /> Formulir Rekam Medis Digital Klien
            </h2>
            <p className="text-xs text-slate-500">
              Format Standar 4 Halaman Biro Psikologi Oase Jiwa
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadJsPDF}
              disabled={downloadingPdf}
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50 shadow-sm"
            >
              <Download className="h-4 w-4" />
              {downloadingPdf ? "Mengunduh File PDF..." : "Export File PDF (jsPDF)"}
            </button>
            <button
              onClick={handlePrint}
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-[#2B5379] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#1f3b5b] shadow-sm"
            >
              <Printer className="h-4 w-4" />
              Cetak / Print PDF
            </button>
            <button
              onClick={onClose}
              type="button"
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable 4-Page Document View */}
        <div className="flex-1 overflow-y-auto bg-slate-200 p-6 space-y-6">
          <div ref={printRef} className="mx-auto max-w-3xl space-y-6">
            
            {/* ==================== PAGE 1 ==================== */}
            <div className="pdf-page bg-white p-8 shadow-md rounded-lg border border-slate-300 text-slate-900 font-serif text-[12.5px] leading-relaxed flex flex-col justify-between" style={{ minHeight: "297mm", boxSizing: "border-box" }}>
              <div>
                <HeaderBanner />

                <h2 className="text-center font-sans font-bold text-base uppercase tracking-wide text-slate-900 mb-5 underline decoration-[#234463] decoration-2 underline-offset-4">
                  FORMULIR PENDAFTARAN KLIEN BARU
                </h2>

                {/* A. INFORMASI KLIEN */}
                <div className="mb-5">
                  <h3 className="font-bold italic text-[#234463] border-b border-slate-300 pb-1 mb-2.5 text-[13.5px]">
                    A. INFORMASI KLIEN
                  </h3>
                  <div className="space-y-1 pl-2">
                    <div className="flex">
                      <span className="w-56 font-medium">1. Nama Lengkap</span>
                      <span className="w-4">:</span>
                      <span className="flex-1 font-semibold">{patient.name || "Budi Santoso"}</span>
                    </div>
                    <div className="flex">
                      <span className="w-56 font-medium">2. Jenis Kelamin</span>
                      <span className="w-4">:</span>
                      <span className="flex-1">
                        [ {String(patient.gender).toLowerCase() === "male" ? "✓" : " "} ] Laki-laki &nbsp;&nbsp;&nbsp;&nbsp; [ {String(patient.gender).toLowerCase() === "female" ? "✓" : " "} ] Perempuan
                      </span>
                    </div>
                    <div className="flex">
                      <span className="w-56 font-medium">3. Tanggal Lahir</span>
                      <span className="w-4">:</span>
                      <span className="flex-1">{patientBday}</span>
                    </div>
                    <div className="flex">
                      <span className="w-56 font-medium">4. Tempat Lahir</span>
                      <span className="w-4">:</span>
                      <span className="flex-1">{placeBirth}</span>
                    </div>
                    <div className="flex">
                      <span className="w-56 font-medium">5. Usia</span>
                      <span className="w-4">:</span>
                      <span className="flex-1">{patientAge} tahun</span>
                    </div>
                    <div className="flex">
                      <span className="w-56 font-medium">6. Anak ke</span>
                      <span className="w-4">:</span>
                      <span className="flex-1">{siblingPos} dari {totalSibl} Bersaudara</span>
                    </div>
                    <div className="flex">
                      <span className="w-56 font-medium">7. Alamat</span>
                      <span className="w-4">:</span>
                      <span className="flex-1">{patientAddr}</span>
                    </div>
                    <div className="flex">
                      <span className="w-56 font-medium">8. Alamat Asal</span>
                      <span className="w-4">:</span>
                      <span className="flex-1">{origAddr}</span>
                    </div>
                    <div className="flex">
                      <span className="w-56 font-medium">9. Nomor Telepon</span>
                      <span className="w-4">:</span>
                      <span className="flex-1">{patientPhone}</span>
                    </div>
                    <div className="flex">
                      <span className="w-56 font-medium">10. Email</span>
                      <span className="w-4">:</span>
                      <span className="flex-1">{patientEmail}</span>
                    </div>
                    <div className="flex">
                      <span className="w-56 font-medium">11. Pekerjaan</span>
                      <span className="w-4">:</span>
                      <span className="flex-1">{patientOcc}</span>
                    </div>
                    <div className="flex">
                      <span className="w-56 font-medium">12. Status Pernikahan</span>
                      <span className="w-4">:</span>
                      <span className="flex-1">
                        [ {isSingle ? "✓" : " "} ] Lajang &nbsp;&nbsp; [ {isMarried ? "✓" : " "} ] Menikah &nbsp;&nbsp; [ {isDivorced ? "✓" : " "} ] Duda/Janda
                      </span>
                    </div>
                    <div className="flex">
                      <span className="w-56 font-medium">13. Kunjungan Pertama?</span>
                      <span className="w-4">:</span>
                      <span className="flex-1">
                        [ {isFirstVisit ? "✓" : " "} ] Ya &nbsp;&nbsp; [ {!isFirstVisit ? "✓" : " "} ] Tidak, Saya sudah pernah
                      </span>
                    </div>
                    <div className="mt-2">
                      <span className="block mb-1 font-medium">14. Riwayat Pendidikan:</span>
                      <table className="w-full border-collapse border border-slate-400 text-center text-xs">
                        <thead>
                          <tr className="bg-sky-50">
                            <th className="border border-slate-400 p-1">Jenjang</th>
                            <th className="border border-slate-400 p-1">Sekolah / Perguruan Tinggi</th>
                            <th className="border border-slate-400 p-1">Jurusan</th>
                            <th className="border border-slate-400 p-1">Tahun Masuk</th>
                            <th className="border border-slate-400 p-1">Tahun Lulus</th>
                          </tr>
                        </thead>
                        <tbody>
                          {["SD", "SMP", "SMA", "Perguruan Tinggi"].map((j) => {
                            const ed = eduHistory?.[j] || defaultEdu[j];
                            return (
                              <tr key={j}>
                                <td className="border border-slate-400 p-1 font-medium">{j}</td>
                                <td className="border border-slate-400 p-1">{ed?.institution || defaultEdu[j].institution}</td>
                                <td className="border border-slate-400 p-1">{ed?.major || defaultEdu[j].major}</td>
                                <td className="border border-slate-400 p-1">{ed?.startYear || defaultEdu[j].startYear}</td>
                                <td className="border border-slate-400 p-1">{ed?.endYear || defaultEdu[j].endYear}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* B. ALASAN KONSULTASI */}
                <div>
                  <h3 className="font-bold italic text-[#234463] border-b border-slate-300 pb-1 mb-2 text-[13.5px]">
                    B. ALASAN KONSULTASI
                  </h3>
                  <div className="space-y-1.5 pl-2">
                    <div>
                      <p className="font-medium">1. Alasan utama mencari layanan psikologi:</p>
                      <p className="pl-4 italic text-slate-800 bg-slate-50 p-2 rounded border border-slate-200 mt-0.5">
                        "{cForm.mainReason || patient.lastNotes || "Konsultasi keluhan umum & kesehatan mental"}"
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">2. Apakah saat ini sedang mengonsumsi obat-obatan psikiatri?</p>
                      <p className="pl-4">
                        [ {cForm.takingPsychiatricMeds ? "✓" : " "} ] Ya &nbsp;&nbsp;&nbsp;&nbsp; [ {!cForm.takingPsychiatricMeds ? "✓" : " "} ] Tidak
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">3. Sejak kapan Anda mengalami masalah ini?</p>
                      <p className="pl-4">
                        [ {cForm.problemDuration === "LESS_THAN_1_MONTH" ? "✓" : " "} ] Kurang dari 1 bulan &nbsp;&nbsp;&nbsp;&nbsp;
                        [ {cForm.problemDuration === "ONE_TO_3_MONTHS" ? "✓" : " "} ] 1-3 bulan &nbsp;&nbsp;&nbsp;&nbsp;
                        [ {cForm.problemDuration === "THREE_TO_6_MONTHS" ? "✓" : " "} ] 3-6 bulan &nbsp;&nbsp;&nbsp;&nbsp;
                        [ {cForm.problemDuration === "MORE_THAN_6_MONTHS" ? "✓" : " "} ] Lebih dari 6 bulan
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">4. Seberapa sering Anda merasakan gejala ini?</p>
                      <p className="pl-4">
                        [ {cForm.symptomFrequency === "DAILY" ? "✓" : " "} ] Setiap hari &nbsp;&nbsp;&nbsp;&nbsp;
                        [ {cForm.symptomFrequency === "WEEKLY" ? "✓" : " "} ] Beberapa kali seminggu &nbsp;&nbsp;&nbsp;&nbsp;
                        [ {cForm.symptomFrequency === "MONTHLY" ? "✓" : " "} ] Beberapa kali sebulan &nbsp;&nbsp;&nbsp;&nbsp;
                        [ {cForm.symptomFrequency === "RARELY" ? "✓" : " "} ] Jarang
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">5. Bagaimana perasaan atau dampaknya terhadap kehidupan sehari-hari Anda?</p>
                      <p className="pl-4">
                        [ {cForm.dailyImpact === "NONE" ? "✓" : " "} ] Tidak terlalu mengganggu &nbsp;&nbsp;&nbsp;&nbsp;
                        [ {cForm.dailyImpact === "MILD" ? "✓" : " "} ] Sedikit mengganggu &nbsp;&nbsp;&nbsp;&nbsp;
                        [ {cForm.dailyImpact === "MODERATE" ? "✓" : " "} ] Cukup mengganggu &nbsp;&nbsp;&nbsp;&nbsp;
                        [ {cForm.dailyImpact === "SEVERE" ? "✓" : " "} ] Sangat mengganggu
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-right text-[10px] text-slate-400 italic pt-2">
                Halaman 1 dari 4
              </div>
            </div>

            {/* ==================== PAGE 2 ==================== */}
            <div className="pdf-page bg-white p-8 shadow-md rounded-lg border border-slate-300 text-slate-900 font-serif text-[12.5px] leading-relaxed flex flex-col justify-between" style={{ minHeight: "297mm", boxSizing: "border-box" }}>
              <div>
                <HeaderBanner />

                {/* C. RIWAYAT PSIKOLOGIS DAN KESEHATAN */}
                <div className="mb-6">
                  <h3 className="font-bold italic text-[#234463] border-b border-slate-300 pb-1 mb-3 text-[13.5px]">
                    C. RIWAYAT PSIKOLOGIS DAN KESEHATAN
                  </h3>
                  <div className="space-y-2 pl-2">
                    <div>
                      <p className="font-medium">1. Apakah Anda pernah mengalami hal serupa sebelumnya?</p>
                      <p className="pl-4">
                        [ {cForm.hasSimilarHistory ? "✓" : " "} ] Ya {cForm.similarHistoryDetail ? `(${cForm.similarHistoryDetail})` : ""} &nbsp;&nbsp;&nbsp;&nbsp; [ {!cForm.hasSimilarHistory ? "✓" : " "} ] Tidak
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">2. Apakah ada anggota keluarga yang memiliki riwayat gangguan psikologis?</p>
                      <p className="pl-4">
                        [ {cForm.hasFamilyHistory ? "✓" : " "} ] Ya {cForm.familyHistoryDetail ? `(${cForm.familyHistoryDetail})` : ""} &nbsp;&nbsp;&nbsp;&nbsp; [ {!cForm.hasFamilyHistory ? "✓" : " "} ] Tidak
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">3. Apakah Anda sedang menjalani pengobatan medis atau terapi psikologis?</p>
                      <p className="pl-4">
                        [ {cForm.hasMedicalTreatment ? "✓" : " "} ] Ya {cForm.medicalTreatmentDetail ? `(${cForm.medicalTreatmentDetail})` : ""} &nbsp;&nbsp;&nbsp;&nbsp; [ {!cForm.hasMedicalTreatment ? "✓" : " "} ] Tidak
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">4. Apakah Anda pernah mengalami kejadian traumatis (misalnya kehilangan orang terdekat, kecelakaan, kekerasan, dll.)?</p>
                      <p className="pl-4">
                        [ {cForm.hasTraumaticEvent ? "✓" : " "} ] Ya {cForm.traumaticEventDetail ? `(${cForm.traumaticEventDetail})` : ""} &nbsp;&nbsp;&nbsp;&nbsp; [ {!cForm.hasTraumaticEvent ? "✓" : " "} ] Tidak
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">5. Bagaimana kualitas tidur Anda dalam sebulan terakhir?</p>
                      <p className="pl-4">
                        [ {cForm.sleepQuality === "GOOD" ? "✓" : " "} ] Baik (7-8 jam per hari) &nbsp;&nbsp;&nbsp;&nbsp;
                        [ {cForm.sleepQuality === "FAIR" ? "✓" : " "} ] Cukup (5-6 jam per hari) &nbsp;&nbsp;&nbsp;&nbsp;
                        [ {cForm.sleepQuality === "POOR" ? "✓" : " "} ] Kurang dari 5 jam per hari &nbsp;&nbsp;&nbsp;&nbsp;
                        [ {cForm.sleepQuality === "DISTURBED" ? "✓" : " "} ] Sering mengalami gangguan tidur
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">6. Apakah Anda pernah memiliki pemikiran untuk menyakiti diri sendiri atau orang lain?</p>
                      <p className="pl-4">
                        [ {cForm.selfHarmThoughts === "NEVER" ? "✓" : " "} ] Tidak pernah &nbsp;&nbsp;&nbsp;&nbsp;
                        [ {cForm.selfHarmThoughts === "SOMETIMES" ? "✓" : " "} ] Pernah, tetapi tidak serius &nbsp;&nbsp;&nbsp;&nbsp;
                        [ {cForm.selfHarmThoughts === "FREQUENT" ? "✓" : " "} ] Sering, dan saya membutuhkan bantuan segera
                      </p>
                    </div>
                  </div>
                </div>

                {/* D. KEBIASAAN DAN GAYA HIDUP */}
                <div className="mb-6">
                  <h3 className="font-bold italic text-[#234463] border-b border-slate-300 pb-1 mb-3 text-[13.5px]">
                    D. KEBIASAAN DAN GAYA HIDUP
                  </h3>
                  <div className="space-y-2 pl-2">
                    <div>
                      <p className="font-medium">1. Apakah Anda mengonsumsi alkohol, rokok, atau zat adiktif lainnya?</p>
                      <p className="pl-4">
                        [ {!cForm.usesAddictiveSubstances ? "✓" : " "} ] Tidak &nbsp;&nbsp;&nbsp;&nbsp;
                        [ {cForm.usesAddictiveSubstances ? "✓" : " "} ] Ya {cForm.addictiveSubstancesDetail ? `(${cForm.addictiveSubstancesDetail})` : ""}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">2. Bagaimana pola makan Anda sehari-hari?</p>
                      <p className="pl-4">
                        [ {cForm.eatingPattern === "REGULAR" ? "✓" : " "} ] Seimbang dan sehat &nbsp;&nbsp;&nbsp;&nbsp;
                        [ {cForm.eatingPattern === "IRREGULAR" ? "✓" : " "} ] Tidak teratur &nbsp;&nbsp;&nbsp;&nbsp;
                        [ {cForm.eatingPattern === "UNDEREATING" ? "✓" : " "} ] Kurang makan atau sering melewatkan makan
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">3. Seberapa sering Anda berolahraga?</p>
                      <p className="pl-4">
                        [ {cForm.exerciseFrequency === "REGULARLY" ? "✓" : " "} ] Setiap hari &nbsp;&nbsp;&nbsp;&nbsp;
                        [ {cForm.exerciseFrequency === "SOMETIMES" ? "✓" : " "} ] Beberapa kali dalam seminggu &nbsp;&nbsp;&nbsp;&nbsp;
                        [ {cForm.exerciseFrequency === "RARELY" ? "✓" : " "} ] Jarang &nbsp;&nbsp;&nbsp;&nbsp;
                        [ {cForm.exerciseFrequency === "NEVER" ? "✓" : " "} ] Tidak pernah
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">4. Bagaimana tingkat stres Anda dalam kehidupan sehari-hari?</p>
                      <p className="pl-4">
                        [ {cForm.stressLevel === "LOW" ? "✓" : " "} ] Rendah &nbsp;&nbsp;&nbsp;&nbsp;
                        [ {cForm.stressLevel === "MODERATE" ? "✓" : " "} ] Sedang &nbsp;&nbsp;&nbsp;&nbsp;
                        [ {cForm.stressLevel === "HIGH" || cForm.stressLevel === "VERY_HIGH" ? "✓" : " "} ] Tinggi
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-right text-[10px] text-slate-400 italic pt-2">
                Halaman 2 dari 4
              </div>
            </div>

            {/* ==================== PAGE 3 ==================== */}
            <div className="pdf-page bg-white p-8 shadow-md rounded-lg border border-slate-300 text-slate-900 font-serif text-[12.5px] leading-relaxed flex flex-col justify-between" style={{ minHeight: "297mm", boxSizing: "border-box" }}>
              <div>
                <HeaderBanner />

                {/* E. INFORMASI KEBIJAKAN */}
                <div className="mb-5">
                  <h3 className="font-bold italic text-[#234463] border-b border-slate-300 pb-1 mb-2 text-[13.5px]">
                    E. INFORMASI KEBIJAKAN
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed mb-2 pl-2">
                    Kami berkomitmen untuk menjaga kerahasiaan informasi pribadi klien sesuai dengan kode etik psikologi dan peraturan yang berlaku. Berikut adalah kebijakan yang harus dipahami oleh setiap klien:
                  </p>
                  <ol className="list-decimal pl-6 space-y-1 text-xs text-slate-800">
                    <li>
                      <strong>Kerahasiaan Informasi:</strong> Semua informasi yang diberikan klien, baik secara lisan maupun tertulis, akan dijaga kerahasiaannya. Informasi tidak akan dibagikan kepada pihak ketiga tanpa persetujuan tertulis dari klien.
                    </li>
                    <li>
                      <strong>Pengecualian Kerahasiaan:</strong> Informasi dapat dibuka kepada pihak berwenang jika ada ancaman serius terhadap keselamatan diri klien/orang lain, atau diwajibkan oleh hukum.
                    </li>
                    <li>
                      <strong>Keamanan Data:</strong> Semua catatan klien disimpan dalam sistem aman yang terenkripsi dan hanya diakses oleh psikolog yang menangani.
                    </li>
                    <li>
                      <strong>Hak Klien:</strong> Klien berhak meminta akses catatan konsultasi secara tertulis dan berhak berhenti dari layanan kapan saja sesuai ketentuan.
                    </li>
                  </ol>
                </div>

                {/* F. PERNYATAAN PERSETUJUAN */}
                <div className="mb-6">
                  <h3 className="font-bold italic text-[#234463] border-b border-slate-300 pb-1 mb-2 text-[13.5px]">
                    F. PERNYATAAN PERSETUJUAN
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed mb-3 pl-2">
                    Saya yang bertanda tangan di bawah ini, menyatakan bahwa saya telah membaca, memahami, dan menyetujui kebijakan privasi serta kerahasiaan layanan konsultasi psikologi ini. Saya memahami bahwa informasi saya akan dijaga kerahasiaannya.
                  </p>
                  <div className="flex justify-between items-end pl-2 text-xs pt-1">
                    <div>
                      <p>Tanggal : {new Date().toLocaleDateString("id-ID")}</p>
                      <p>Nama Klien : <strong>{patient.name}</strong></p>
                    </div>
                    <div className="text-center w-48 border-t border-slate-300 pt-1">
                      <div className="h-8 flex items-center justify-center italic text-slate-500 font-sans text-[11px]">
                        ( Terkonfirmasi Digital )
                      </div>
                      <p className="font-semibold">Tanda Tangan Klien</p>
                    </div>
                  </div>
                </div>

                {/* HASIL TES PSIKOLOGI */}
                <div className="mt-4 border-t border-slate-300 pt-3">
                  <h3 className="font-bold italic text-[#234463] border-b border-slate-300 pb-1 mb-2 text-[13.5px]">
                    HASIL TES PSIKOLOGI (SISTEM)
                  </h3>
                  {tesResults.length > 0 ? (
                    <table className="w-full border-collapse border border-slate-400 text-center text-xs my-2">
                      <thead>
                        <tr className="bg-sky-50">
                          <th className="border border-slate-400 p-1.5">Tanggal Tes</th>
                          <th className="border border-slate-400 p-1.5">Nama Tes Psikologi</th>
                          <th className="border border-slate-400 p-1.5">Skor / Maksimal</th>
                          <th className="border border-slate-400 p-1.5">Persentase</th>
                          <th className="border border-slate-400 p-1.5">Kategori Hasil / Diagnostik</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tesResults.map((t, idx) => (
                          <tr key={idx}>
                            <td className="border border-slate-400 p-1.5">{String(t.createdAt).split("T")[0]}</td>
                            <td className="border border-slate-400 p-1.5 font-medium">{t.namaTes}</td>
                            <td className="border border-slate-400 p-1.5">{t.totalScore} / {t.maxScore}</td>
                            <td className="border border-slate-400 p-1.5">{t.percentage}%</td>
                            <td className="border border-slate-400 p-1.5 font-semibold text-[#234463]">{t.kategoriNama}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="pl-2 text-xs italic text-slate-500">Belum ada hasil tes psikologi yang tercatat.</p>
                  )}
                </div>
              </div>

              <div className="text-right text-[10px] text-slate-400 italic pt-2">
                Halaman 3 dari 4
              </div>
            </div>

            {/* ==================== PAGE 4 ==================== */}
            <div className="pdf-page bg-white p-8 shadow-md rounded-lg border border-slate-300 text-slate-900 font-serif text-[12.5px] leading-relaxed flex flex-col justify-between" style={{ minHeight: "297mm", boxSizing: "border-box" }}>
              <div>
                <HeaderBanner />

                {/* CATATAN UNTUK PSIKOLOG */}
                <div>
                  <h3 className="font-bold italic text-[#234463] border-b-2 border-[#234463] pb-1 mb-4 text-[14px] uppercase tracking-wide">
                    CATATAN UNTUK PSIKOLOG (diisi oleh Psikolog setelah sesi)
                  </h3>

                  {notes.length > 0 ? (
                    notes.map((note, nIdx) => {
                      const sNum = note.sessionNumber || notes.length - nIdx;
                      const planType =
                        note.followUpPlan ||
                        (note.followUpDate
                          ? "CONTINUE_SESSION"
                          : note.nextSessionRecommendation
                          ? "REFER_TO_OTHER"
                          : "COMPLETED");
                      const diag =
                        note.diagnosisSummary ||
                        note.subjective ||
                        note.assessment ||
                        "Pasien mengeluhkan kecemasan berlebihan, kesulitan fokus di tempat kerja, serta gangguan pola tidur.";
                      const treat =
                        note.treatmentApproach ||
                        note.plan ||
                        note.objective ||
                        "Psychoeducation kecemasan, latihan relaksasi diafragma, CBT dasar, dan jurnal harian.";
                      const extra =
                        note.additionalNotes ||
                        (note.tags && note.tags.length > 0
                          ? note.tags.join(", ")
                          : "Pasien sangat kooperatif dan termotivasi tinggi.");

                      return (
                        <div
                          key={note.id || nIdx}
                          className="mb-6 p-4 rounded-lg border border-slate-300 bg-slate-50/50 space-y-3"
                        >
                          <div className="flex justify-between items-center pb-2 border-b border-slate-200 text-xs">
                            <span className="font-bold text-[#234463]">
                              Sesi Konsultasi ke-{sNum} &nbsp;|&nbsp; Tanggal:{" "}
                              {note.consultationDate ||
                                (note.createdAt
                                  ? String(note.createdAt).split("T")[0]
                                  : "2026-07-15")}
                            </span>
                            <span className="font-semibold text-amber-700 uppercase bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              Risk Level: {note.riskLevel || "MEDIUM"}
                            </span>
                          </div>

                          <div className="space-y-2 pl-2 text-xs">
                            <div>
                              <span className="font-bold text-slate-900">
                                • Ringkasan masalah utama :
                              </span>
                              <p className="pl-4 text-slate-800 whitespace-pre-wrap mt-0.5">
                                {diag}
                              </p>
                            </div>
                            <div>
                              <span className="font-bold text-slate-900">
                                • Rekomendasi pendekatan terapi :
                              </span>
                              <p className="pl-4 text-slate-800 whitespace-pre-wrap mt-0.5">
                                {treat}
                              </p>
                            </div>
                            <div>
                              <span className="font-bold text-slate-900">
                                • Rencana tindak lanjut :
                              </span>
                              <div className="pl-4 mt-1 space-x-4">
                                <span>
                                  [ {planType === "CONTINUE_SESSION" ? "✓" : " "} ] Lanjutan sesi
                                </span>
                                <span>
                                  [ {planType === "REFER_TO_OTHER" ? "✓" : " "} ] Rujukan ke profesional lain
                                </span>
                                <span>
                                  [ {planType === "COMPLETED" ? "✓" : " "} ] Selesai
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-8 pt-1">
                              <p>
                                <span className="font-bold text-slate-900">
                                  • Sesi ini merupakan sesi ke :
                                </span>{" "}
                                {sNum}
                              </p>
                              <p>
                                <span className="font-bold text-slate-900">
                                  • Tanggal sesi lanjutan :
                                </span>{" "}
                                {note.followUpDate
                                  ? String(note.followUpDate).split("T")[0]
                                  : "2026-08-12"}
                              </p>
                            </div>
                            {extra && (
                              <div className="pt-1">
                                <span className="font-bold text-slate-900">
                                  • catatan tambahan (jika ada) :
                                </span>
                                <p className="pl-4 text-slate-800 italic mt-0.5">
                                  {extra}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-4 rounded border border-slate-300 bg-slate-50 space-y-2 text-xs">
                      <p>• <strong>Ringkasan masalah utama :</strong> {patient.lastNotes || "Pasien mengeluhkan kecemasan berlebih dan stres kerja."}</p>
                      <p>• <strong>Rekomendasi pendekatan terapi :</strong> Psychoeducation kecemasan, latihan relaksasi diafragma, CBT dasar.</p>
                      <p>• <strong>Rencana tindak lanjut :</strong> [ ✓ ] Lanjutan sesi &nbsp;&nbsp;&nbsp;&nbsp; [ &nbsp; ] Rujukan ke profesional lain &nbsp;&nbsp;&nbsp;&nbsp; [ &nbsp; ] Selesai</p>
                      <p>• <strong>Sesi ini merupakan sesi ke :</strong> 1</p>
                      <p>• <strong>Tanggal sesi lanjutan :</strong> 12 Agustus 2026</p>
                      <p>• <strong>catatan tambahan (jika ada) :</strong> Pasien kooperatif dan termotivasi tinggi.</p>
                    </div>
                  )}

                  {/* Signature Box */}
                  <div className="mt-12 flex justify-end">
                    <div className="text-center w-72">
                      <p className="mb-1 text-xs">
                        Malang, {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                      <p className="font-bold text-[#234463] text-xs">
                        Psikolog Penanggung Jawab,
                      </p>
                      <div className="h-16 flex items-center justify-center italic text-slate-400 text-xs my-1">
                        ( Tanda Tangan Digital )
                      </div>
                      <p className="font-bold text-[#234463] text-sm underline">
                        {psychologistName}
                      </p>
                      <p className="text-xs text-slate-600 font-sans">
                        {psychologistSipp}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-right text-[10px] text-slate-400 italic pt-2">
                Halaman 4 dari 4
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
