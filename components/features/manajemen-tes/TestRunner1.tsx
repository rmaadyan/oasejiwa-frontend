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

  const likert = tes.likert as LikertOption[];
  const kategori = tes.kategori as DiagnosisKategori[];
  const pertanyaan = tes.pertanyaan as PertanyaanItem[];
  const sectionKategori = tes.sectionKategori as SectionKategoriMap | undefined;

  const jumlahSoal = pertanyaan.length;

  const skorMaksPerSoal =
    likert.length > 0 ? Math.max(...likert.map((l) => l.value)) : 5;

  const skorMaksTes = jumlahSoal * skorMaksPerSoal;

  const questionRefs = useRef<Record<string, HTMLDivElement | null>>({});

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

    const firstUnanswered = pertanyaan.find(
      (p) => jawaban[p.id] === undefined
    );

    if (firstUnanswered) {
      setErrorMsg("Masih ada pertanyaan yang belum dijawab.");

      const node = questionRefs.current[firstUnanswered.id];

      if (node) {
        node.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }

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

          {/* PETUNJUK */}
          <div className="mt-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#1f3b5b]">
              Petunjuk pengisian
            </p>

            <ol className="mt-2 space-y-1 text-[11px] text-slate-600 leading-relaxed">
              <li>1. Jawablah sesuai kondisi 1 minggu terakhir.</li>
              <li>2. Setiap jawaban memiliki skor.</li>
              <li>3. Jawaban yang jujur menghasilkan hasil lebih akurat.</li>
              <li>4. Pastikan semua pertanyaan sudah diisi.</li>
            </ol>
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
            <div className="space-y-4">

              {pertanyaan.map((p) => {
                const id = p.id;
                const answered = jawaban[id] !== undefined;

                return (
                  <div
                    key={id}
                    ref={(el) => {
                      questionRefs.current[id] = el;
                    }}
                    className="rounded-2xl border border-slate-100 bg-gradient-to-r from-sky-50 via-blue-50 to-sky-50 p-4 shadow-sm"
                  >

                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-900">
                        {p.teks}
                      </p>

                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          answered
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {answered ? "Terisi" : "Belum diisi"}
                      </span>
                    </div>

                    <div className="grid gap-2 md:grid-cols-2">

                      {likert.map((l) => {
                        const selected = jawaban[id] === l.value;

                        return (
                          <button
                            key={l.id}
                            type="button"
                            onClick={() => handleJawab(id, l.value)}
                            className={`flex items-center justify-between rounded-xl border px-3 py-2 text-[11px] font-medium transition ${
                              selected
                                ? "border-indigo-600 bg-indigo-600 text-white"
                                : "border-slate-300 bg-white hover:bg-indigo-50"
                            }`}
                          >
                            <span>{l.label}</span>

                            <span
                              className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                                selected
                                  ? "border-white bg-white"
                                  : "border-slate-300"
                              }`}
                            >
                              {selected && (
                                <span className="h-2 w-2 rounded-full bg-indigo-600" />
                              )}
                            </span>

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
        <div className="border-t border-slate-200 px-6 py-4">

          <div className="flex items-center justify-between">

            <div className="text-[11px] text-slate-500">
              <span className="font-semibold">
                {Object.keys(jawaban).length}
              </span>{" "}
              dari{" "}
              <span className="font-semibold">
                {jumlahSoal}
              </span>{" "}
              pertanyaan sudah diisi
            </div>

            <button
              type="button"
              onClick={hitungHasil}
              className="rounded-full bg-[#1f3b5b] px-6 py-2 text-xs font-semibold text-white hover:bg-blue-900"
            >
              Kirim
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}