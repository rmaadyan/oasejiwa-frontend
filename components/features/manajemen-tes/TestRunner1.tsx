// components/features/manajemen-tes/TestRunner1.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import type {
  DiagnosisKategori,
  LikertOption,
  LikertValue,
  PertanyaanItem,
  SectionKategoriMap,
} from "./types";

import type { TesDetail } from "./DetailTesForm";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/Alert";
import { submitTesResult } from "@/lib/api/tes";
import { DASS21_QUESTIONS, DASS21_SCALE_OPTIONS } from "@/lib/data/dass21-questions";
import { calculateDass21Result } from "@/lib/utils/dass21-calculator";

const RESULT_KEY = "tes-last-result";

type Props = {
  tes: TesDetail;
  onBack: () => void;
};

type Jawaban = {
  [soalId: string]: LikertValue;
};

type SectionScore = {
  section: string;
  total: number;
  maks: number;
};

export default function TestRunner1({ tes, onBack }: Props) {
  const router = useRouter();

  const [jawaban, setJawaban] = useState<Jawaban>({});
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isDass21 =
    (tes.nama || "").toUpperCase().includes("DASS") ||
    (tes.jenis || "").toUpperCase().includes("DASS") ||
    tes.id === 1;

  const rawLikert = tes.likert as LikertOption[];
  const rawPertanyaan = tes.pertanyaan as PertanyaanItem[];

  const likert: LikertOption[] = isDass21
    ? DASS21_SCALE_OPTIONS.map((opt) => ({
        id: String(opt.value),
        label: opt.label,
        value: opt.value as LikertValue,
      }))
    : rawLikert;

  const pertanyaan: PertanyaanItem[] = isDass21
    ? DASS21_QUESTIONS.map((q) => ({
        id: String(q.id),
        teks: q.teks,
        section: q.dimension,
        urutan: q.id,
        arah: "positif" as const,
      }))
    : rawPertanyaan;

  const kategori = tes.kategori as DiagnosisKategori[];
  const sectionKategori = tes.sectionKategori as SectionKategoriMap | undefined;

  const jumlahSoal = pertanyaan.length;

  const skorMaksPerSoal =
    likert.length > 0 ? Math.max(...likert.map((l) => l.value)) : 3;

  const skorMaksTes = jumlahSoal * skorMaksPerSoal;

  const questionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  // List of unanswered questions with 1-based question numbers
  const unansweredQuestions = pertanyaan
    .map((p, idx) => ({ ...p, number: idx + 1 }))
    .filter((p) => jawaban[p.id] === undefined);

  const scrollToQuestion = (soalId: string) => {
    const node = questionRefs.current[soalId];
    if (node) {
      node.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      setHighlightedId(soalId);
      setTimeout(() => setHighlightedId(null), 2500);
    }
  };

  const handleJawab = (soalId: string, value: LikertValue) => {
    setJawaban((prev) => ({
      ...prev,
      [soalId]: value,
    }));

    setErrorMsg(null);
  };

  const hitungHasil = async () => {
    setErrorMsg(null);

    if (pertanyaan.length === 0) {
      setErrorMsg("Belum ada pertanyaan pada tes ini.");
      return;
    }

    if (unansweredQuestions.length > 0) {
      setErrorMsg(`Masih ada ${unansweredQuestions.length} pertanyaan yang belum dijawab.`);
      scrollToQuestion(unansweredQuestions[0].id);
      return;
    }

    if (isDass21) {
      const dassRes = calculateDass21Result(jawaban);
      const sections: SectionScore[] = [
        { section: "Depression", total: dassRes.depression.score, maks: 21 },
        { section: "Anxiety", total: dassRes.anxiety.score, maks: 21 },
        { section: "Stress", total: dassRes.stress.score, maks: 21 },
      ];

      const result = {
        tesId: tes.id ?? 0,
        namaTes: tes.nama,
        total: dassRes.totalScore,
        maks: dassRes.maxTotalScore,
        persen: Math.round((dassRes.totalScore / dassRes.maxTotalScore) * 100),
        kategoriNama: dassRes.overallCategory,
        kategoriList: kategori,
        sections,
        answers: jawaban,
        dassResult: dassRes,
      };

      if (typeof window !== "undefined") {
        localStorage.setItem(RESULT_KEY, JSON.stringify(result));
      }

      if (tes.id) {
        try {
          const submitted = await submitTesResult(tes.id, {
            namaTes: tes.nama,
            jenisTes: "DASS-21",
            totalScore: dassRes.totalScore,
            maxScore: dassRes.maxTotalScore,
            percentage: Math.round((dassRes.totalScore / dassRes.maxTotalScore) * 100),
            kategoriNama: dassRes.overallCategory,
            diagnosis: dassRes.overallCategory,
            detailDiagnosis: dassRes.disclaimer,
            interpretasi: dassRes.interpretation,
            rekomendasi: [
              "Melanjutkan sesi konseling secara berkala.",
              "Latihan relaksasi diafragma dan pengelolaan stres.",
              "Evaluasi perkembangan pada sesi berikutnya.",
              "Konsultasi dengan Psikolog Oase Jiwa."
            ],
            sectionScores: sections,
            answers: jawaban,
          });

          if (submitted?.id && typeof window !== "undefined") {
            const updatedResult = { ...result, dbResultId: submitted.id };
            localStorage.setItem(RESULT_KEY, JSON.stringify(updatedResult));
          }
        } catch (err) {
          console.error("Gagal menyimpan hasil tes ke rekam medis:", err);
        }
      }

      router.push(`/tes/pre-result/${tes.id ?? 0}`);
      return;
    }

    // Hitung total skor
    const total = Object.values(jawaban).reduce<number>(
      (sum, val) => sum + (val ?? 0),
      0
    );

    const maks = skorMaksTes;

    const persen = maks > 0 ? Math.round((total / maks) * 100) : 0;

    const kat = kategori.find(
      (k) => persen >= k.minPersen && persen <= k.maxPersen
    );

    // Hitung skor per section
    const bySection = new Map<string, { total: number; count: number }>();

    pertanyaan.forEach((p) => {
      const sectionName = (p.section || "").trim();

      if (!sectionName) return;

      const jawab = jawaban[p.id];

      if (jawab === undefined) return;

      const current = bySection.get(sectionName) || {
        total: 0,
        count: 0,
      };

      current.total += jawab;
      current.count += 1;

      bySection.set(sectionName, current);
    });

    const sections: SectionScore[] = Array.from(bySection.entries()).map(
      ([section, info]) => ({
        section,
        total: info.total,
        maks: info.count * skorMaksPerSoal,
      })
    );

    const result = {
      tesId: tes.id ?? 0,
      namaTes: tes.nama,
      total,
      maks,
      persen,
      kategoriNama: kat?.nama ?? "-",
      kategoriList: kategori,
      sections,
      sectionKategori: sectionKategori ?? undefined,
    };

    if (typeof window !== "undefined") {
      localStorage.setItem(RESULT_KEY, JSON.stringify(result));
    }

    // Submit ke backend untuk disimpan di rekam medis digital pasien
    if (tes.id) {
      try {
        await submitTesResult(tes.id, {
          namaTes: tes.nama,
          jenisTes: tes.jenis || "Psikologi",
          totalScore: total,
          maxScore: maks,
          percentage: persen,
          kategoriNama: kat?.nama ?? "-",
          diagnosis: kat?.nama ?? "-",
          detailDiagnosis: kat?.deskripsi ?? kat?.result ?? `Berdasarkan hasil ${tes.nama}, pasien berada dalam kategori ${kat?.nama ?? "-"}. Gejala yang muncul cukup memengaruhi aktivitas sehari-hari.`,
          interpretasi: tes.penjelasanHasil ?? "Hasil mengukur tingkat keparahan gejala.",
          rekomendasi: [
            "Melanjutkan sesi konseling secara berkala.",
            "Latihan relaksasi diafragma.",
            "Evaluasi perkembangan pada sesi berikutnya.",
            "Monitoring perkembangan secara teratur."
          ],
          sectionScores: sections,
          answers: jawaban,
        });
      } catch (err) {
        console.error("Gagal menyimpan hasil tes ke rekam medis:", err);
      }
    }

    // Redirect ke halaman USER
    router.push(`/tes/pre-result/${tes.id ?? 0}`);
  };

  useEffect(() => {
    setJawaban({});
    setErrorMsg(null);
  }, [tes.id]);

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f7fb] px-4 py-6">
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">

        {/* HEADER */}
        <div className="border-b border-slate-200 px-6 py-5">

          <div className="mb-3 flex items-center">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 shadow-sm hover:bg-slate-50"
            >
              <ChevronLeft size={16} />
            </button>
          </div>

          <h1 className="text-center text-2xl font-bold text-[#1964ae]">
            {tes.nama}
          </h1>

          {tes.deskripsi && (
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              {tes.deskripsi}
            </p>
          )}

          {/* PROGRESS BAR & STATS HEADER */}
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
              <span>Progress Pengerjaan</span>
              <span className="font-bold text-[#1f3b5b]">
                {Object.keys(jawaban).length} / {jumlahSoal} Pertanyaan ({jumlahSoal > 0 ? Math.round((Object.keys(jawaban).length / jumlahSoal) * 100) : 0}%)
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full bg-[#1964ae] transition-all duration-300 rounded-full"
                style={{
                  width: `${jumlahSoal > 0 ? Math.round((Object.keys(jawaban).length / jumlahSoal) * 100) : 0}%`,
                }}
              />
            </div>

            {/* 4 SUMMARY WIDGETS */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs text-center sm:text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">Terjawab</span>
                <span className="text-base font-bold text-emerald-700">{Object.keys(jawaban).length}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs text-center sm:text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">Belum Dijawab</span>
                <span className="text-base font-bold text-amber-700">{jumlahSoal - Object.keys(jawaban).length}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs text-center sm:text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">Progress</span>
                <span className="text-base font-bold text-[#1964ae]">
                  {jumlahSoal > 0 ? Math.round((Object.keys(jawaban).length / jumlahSoal) * 100) : 0}%
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs text-center sm:text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">Estimasi Selesai</span>
                <span className="text-base font-bold text-slate-700">± 5 menit</span>
              </div>
            </div>
          </div>

        </div>

        {/* ERROR ALERT */}
        {errorMsg && (
          <div className="px-6 pt-4">
            <Alert variant="warning">
              <AlertTitle>Form belum lengkap</AlertTitle>
              <AlertDescription>{errorMsg}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* PERTANYAAN */}
        <div className="flex-1 overflow-y-auto px-4 pt-3 pb-4">

          {pertanyaan.length === 0 ? (
            <div className="flex h-40 items-center justify-center">
              <p className="text-xs text-slate-500">
                Belum ada pertanyaan pada tes ini.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {pertanyaan.map((p, idx) => {
                const id = p.id;
                const answered = jawaban[id] !== undefined;
                const isHighlighted = highlightedId === id;

                return (
                  <div
                    key={id}
                    ref={(el) => {
                      questionRefs.current[id] = el;
                    }}
                    className={`rounded-2xl border p-5 shadow-xs transition-all duration-300 ${
                      isHighlighted
                        ? "border-amber-400 bg-amber-50/70 ring-4 ring-amber-300/80 scale-[1.01]"
                        : answered
                        ? "border-emerald-200 bg-white ring-1 ring-emerald-100"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >

                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[11px] font-bold text-[#1f3b5b] bg-slate-100 px-2.5 py-0.5 rounded-md inline-block mb-1.5">
                          Pertanyaan {idx + 1} dari {jumlahSoal}
                        </span>
                        <p className="text-sm font-semibold text-slate-900 leading-snug">
                          {p.teks}
                        </p>
                        {(p.image || p.imageUrl) && (
                          <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 max-w-md">
                            <img
                              src={p.image || p.imageUrl}
                              alt={`Gambar Pertanyaan ${idx + 1}`}
                              className="h-auto w-full object-contain max-h-60"
                            />
                          </div>
                        )}
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold inline-flex items-center gap-1 ${
                          answered
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {answered ? "✓ Sudah Dijawab" : "○ Belum Dijawab"}
                      </span>
                    </div>

                    <div className="grid gap-2.5 sm:grid-cols-2 mt-4">

                      {likert.map((l) => {
                        const selected = jawaban[id] === l.value;

                        // Custom Label Formatting for clear qualitative display without numeric score values
                        let optTitle = l.label;
                        let optSubtitle = "";

                        if (l.value === 0) {
                          optTitle = "Tidak Pernah";
                          optSubtitle = "Tidak sesuai dengan saya sama sekali";
                        } else if (l.value === 1) {
                          optTitle = "Kadang-kadang";
                          optSubtitle = "Sesuai sampai tingkat tertentu";
                        } else if (l.value === 2) {
                          optTitle = "Cukup Sering";
                          optSubtitle = "Sesuai sampai batas yang dapat dipertimbangkan";
                        } else if (l.value === 3) {
                          optTitle = "Sangat Sering";
                          optSubtitle = "Sangat sesuai dengan saya";
                        }

                        return (
                          <button
                            key={l.id}
                            type="button"
                            onClick={() => handleJawab(id, l.value)}
                            className={`flex items-start gap-3 rounded-xl border p-3.5 text-left transition cursor-pointer ${
                              selected
                                ? "border-[#1964ae] bg-blue-50/90 ring-2 ring-[#1964ae]/20 shadow-2xs"
                                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                            }`}
                          >
                            <span
                              className={`mt-0.5 h-4 w-4 shrink-0 rounded-full border flex items-center justify-center transition-colors ${
                                selected
                                  ? "border-[#1964ae] bg-[#1964ae]"
                                  : "border-slate-300 bg-white"
                              }`}
                            >
                              {selected && (
                                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                              )}
                            </span>

                            <div className="flex-1">
                              <span className="block text-xs font-bold text-slate-800">
                                {optTitle}
                              </span>
                              {optSubtitle && (
                                <span className="block text-[11px] text-slate-500 mt-0.5 leading-tight">
                                  {optSubtitle}
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}

                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </div>

        {/* FOOTER */}
        <div className="border-t border-slate-200 px-6 py-4 bg-slate-50/50 space-y-3">
          {unansweredQuestions.length > 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50/90 p-3.5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-800">
                <span>⚠️</span>
                <span>Masih ada {unansweredQuestions.length} pertanyaan yang belum dijawab.</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                <span className="text-[11px] font-medium text-amber-700 mr-1">
                  Belum dijawab:
                </span>
                {unansweredQuestions.map((q) => (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => scrollToQuestion(q.id)}
                    className="h-7 min-w-[28px] px-2 rounded-lg bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold hover:bg-amber-200 hover:scale-105 active:scale-95 transition-all shadow-2xs cursor-pointer flex items-center justify-center"
                    title={`Lompat ke Pertanyaan ${q.number}`}
                  >
                    {q.number}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">

            <div className="text-xs text-slate-600">
              {unansweredQuestions.length > 0 ? (
                <span className="text-[11px] font-medium text-slate-500">
                  Klik nomor di atas untuk langsung mengisi pertanyaan yang belum dijawab.
                </span>
              ) : (
                <span className="font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 inline-block">
                  ✓ Seluruh {jumlahSoal} pertanyaan telah terisi.
                </span>
              )}
            </div>

            <button
              type="button"
              disabled={unansweredQuestions.length > 0}
              onClick={hitungHasil}
              className={`rounded-full px-8 py-2.5 text-xs font-bold transition ${
                unansweredQuestions.length === 0
                  ? "bg-[#1f3b5b] text-white hover:bg-blue-900 shadow-md cursor-pointer"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed opacity-60"
              }`}
            >
              Selesaikan Tes
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}