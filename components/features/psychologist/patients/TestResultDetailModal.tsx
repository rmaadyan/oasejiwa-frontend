"use client";

import React from "react";
import {
  X,
  Award,
  Calendar,
  FileDown,
  AlertCircle,
  Activity,
  CheckCircle2,
  Brain,
} from "lucide-react";
import { calculateDass21Result, Dass21Result } from "@/lib/utils/dass21-calculator";
import { downloadDass21Pdf } from "@/lib/utils/dass21-pdf-generator";

interface TestResultDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  testData: any | null;
  patientName?: string;
}

export default function TestResultDetailModal({
  isOpen,
  onClose,
  testData,
  patientName = "Pasien Oase Jiwa",
}: TestResultDetailModalProps) {
  if (!isOpen || !testData) return null;

  const testName = testData.namaTes || testData.tesName || testData.nama || "Tes Psikologi";
  const isDass21 = (testName || "").toUpperCase().includes("DASS");

  // Format date
  const rawDate = testData.date || testData.createdAt;
  const formattedDate = rawDate
    ? new Date(rawDate).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "8 Agustus 2026";

  // Calculate or extract DASS-21 result
  let dassRes: Dass21Result | null = null;

  if (isDass21) {
    if (testData.answers && typeof testData.answers === "object") {
      dassRes = calculateDass21Result(testData.answers);
    } else if (testData.sectionScores && Array.isArray(testData.sectionScores)) {
      // Build from sectionScores if answers map is missing
      let depScore = 0;
      let anxScore = 0;
      let strScore = 0;

      for (const sec of testData.sectionScores) {
        const secName = (sec.section || "").toLowerCase();
        const scoreVal = Number(sec.total ?? 0);
        if (secName.includes("depress")) depScore = scoreVal;
        else if (secName.includes("anxiet")) anxScore = scoreVal;
        else if (secName.includes("stress") || secName.includes("stres")) strScore = scoreVal;
      }

      const mockAnswers: Record<number, number> = {};
      for (let i = 1; i <= 7; i++) mockAnswers[i] = Math.min(3, Math.floor(depScore / 7));
      dassRes = calculateDass21Result(mockAnswers);

      dassRes.depression.score = depScore;
      dassRes.anxiety.score = anxScore;
      dassRes.stress.score = strScore;
      dassRes.totalScore = depScore + anxScore + strScore;
    }
  }

  const categoryName = testData.kategoriNama || testData.category || dassRes?.overallCategory || "Normal";

  const handleDownloadPdf = () => {
    if (isDass21 && dassRes) {
      downloadDass21Pdf({
        userName: patientName,
        date: formattedDate,
        testName: testName,
        result: dassRes,
      });
    } else {
      alert(`Mendownload laporan PDF ${testName}...`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 font-poppins text-xs">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-2xl overflow-hidden animate-fade-in border border-slate-100">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#19355E] to-[#234463] text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20">
              <Brain className="w-5 h-5 text-sky-300" />
            </div>
            <div>
              <span className="text-[10px] font-semibold text-sky-200 uppercase tracking-wider">
                Detail Hasil Tes Psikologi
              </span>
              <h2 className="text-base font-bold text-white leading-tight">
                {testName}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* METADATA BAR */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 bg-slate-50 border-b border-slate-200 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>Tanggal Pengerjaan: <strong>{formattedDate}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500">Status Hasil:</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E8F6FF] text-[#19355E] border border-[#d4edff]">
              Kategori: {categoryName}
            </span>
          </div>
        </div>

        {/* BODY (SCROLLABLE) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* DASS-21 3-DIMENSIONS DISPLAY */}
          {isDass21 && dassRes ? (
            <div className="space-y-4">
              <h3 className="font-bold text-[#19355E] text-xs flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-600" />
                <span>Rincian 3 Subskala Dimensi DASS-21</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Depresi */}
                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[#19355E] text-xs">Depresi</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                        {dassRes.depression.category}
                      </span>
                    </div>
                    <div className="text-lg font-bold text-slate-900 mt-1">
                      {dassRes.depression.score} <span className="text-xs font-normal text-slate-500">/ 21</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed pt-2 border-t border-blue-100">
                    {dassRes.depression.description}
                  </p>
                </div>

                {/* Kecemasan (Anxiety) */}
                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[#19355E] text-xs">Kecemasan (Anxiety)</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        {dassRes.anxiety.category}
                      </span>
                    </div>
                    <div className="text-lg font-bold text-slate-900 mt-1">
                      {dassRes.anxiety.score} <span className="text-xs font-normal text-slate-500">/ 21</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed pt-2 border-t border-amber-100">
                    {dassRes.anxiety.description}
                  </p>
                </div>

                {/* Stres */}
                <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/40 space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[#19355E] text-xs">Stres</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                        {dassRes.stress.category}
                      </span>
                    </div>
                    <div className="text-lg font-bold text-slate-900 mt-1">
                      {dassRes.stress.score} <span className="text-xs font-normal text-slate-500">/ 21</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed pt-2 border-t border-purple-100">
                    {dassRes.stress.description}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* NON-DASS-21 SUMMARY DISPLAY */
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#19355E]">Ringkasan Skor Total</span>
                <span className="text-base font-bold text-slate-900">
                  {testData.score || testData.totalScore ? `${testData.totalScore || testData.score} / ${testData.maxScore || 100}` : "Selesai"}
                </span>
              </div>
              {testData.description || testData.detailDiagnosis ? (
                <p className="text-xs text-slate-600 leading-relaxed">
                  {testData.description || testData.detailDiagnosis}
                </p>
              ) : null}
            </div>
          )}

          {/* INTERPRETASI SKRINING */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
            <h4 className="font-bold text-[#19355E] text-xs flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-600" />
              <span>Interpretasi & Analisis Skrining</span>
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line pl-6">
              {testData.interpretasi ||
                testData.interpretation ||
                dassRes?.interpretation ||
                "Hasil skrining menunjukkan indikasi kondisi psikologis yang memerlukan perhatian serta pemantauan berkala."}
            </p>
          </div>

          {/* REKOMENDASI (IF AVAILABLE) */}
          {Array.isArray(testData.rekomendasi) && testData.rekomendasi.length > 0 && (
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
              <h4 className="font-bold text-emerald-900 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Rekomendasi Penanganan</span>
              </h4>
              <ul className="pl-6 list-disc text-slate-800 text-xs space-y-1">
                {testData.rekomendasi.map((rec: string, idx: number) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>
          )}

          {/* DISCLAIMER BANNER */}
          <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-900 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong>Disclaimer:</strong> {testData.detailDiagnosis || testData.disclaimer || dassRes?.disclaimer || "Hasil ini merupakan hasil skrining awal dan bukan diagnosis klinis."}
            </p>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-[#19355E] text-white hover:bg-[#234463] shadow-xs transition cursor-pointer"
          >
            <FileDown className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
