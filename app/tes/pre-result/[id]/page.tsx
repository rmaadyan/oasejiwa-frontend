"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const RESULT_KEY = "tes-last-result";

type DiagnosisKategori = {
  id: string;
  nama: string;
  minPersen: number;
  maxPersen: number;
  deskripsi?: string | null;
  result?: string | null; // <─ penting
};

type HasilStored = {
  tesId: number;
  namaTes: string;
  total: number;
  maks: number;
  persen: number;
  kategoriNama: string;
  kategoriList: DiagnosisKategori[];
};

export default function PreResultPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [hasil, setHasil] = useState<HasilStored | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const raw = window.localStorage.getItem(RESULT_KEY);
    if (raw) {
      try {
        const parsed: HasilStored = JSON.parse(raw);
        if (parsed && parsed.tesId === id) {
          setHasil(parsed);
        }
      } catch {

      }
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f7fb]">
        <div className="rounded-xl bg-white px-6 py-4 text-sm text-gray-600 shadow">
          Memuat...
        </div>
      </div>
    );
  }

  if (!hasil) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f7fb] px-4">
        <div className="rounded-xl bg-white px-6 py-4 text-sm text-gray-700 shadow">
          Hasil tes tidak ditemukan. Silakan lakukan tes terlebih dahulu.
          <button
            onClick={() => router.push("/")}
            className="ml-3 rounded-full border border-gray-300 px-3 py-1 text-xs text-gray-700 hover:bg-gray-50"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  const { namaTes, total, maks, kategoriList, kategoriNama } = hasil;

  // cari kategori yang match berdasarkan skor total
  let matchedKategori: DiagnosisKategori | null = null;
  if (kategoriList && kategoriList.length > 0) {
    for (const k of kategoriList) {
      const minSkor = Math.round((k.minPersen / 100) * maks);
      const maxSkor = Math.round((k.maxPersen / 100) * maks);
      if (total >= minSkor && total <= maxSkor) {
        matchedKategori = k;
        break;
      }
    }
  }

  const levelNama = matchedKategori?.nama ?? kategoriNama;

  // PAKAI result untuk paragraf panjang.
  const paragrafDeskripsi =
    matchedKategori?.result?.trim() ||
    matchedKategori?.deskripsi?.trim() ||
    "Terima kasih sudah menyelesaikan tes ini. Hasil yang akan Anda lihat merupakan skrining awal dan bukan diagnosis pasti. Anda tetap disarankan mempertimbangkan konsultasi dengan profesional bila keluhan dirasa mengganggu.";

  return (
    <div className="min-h-screen bg-[#f5f7fb] px-4 py-8">
      <div className="mx-auto flex max-w-3xl flex-col items-center rounded-2xl bg-white px-6 pb-10 pt-8 shadow-sm">
        <div className="mb-6 flex justify-center">
          <img
            src="\assets\imghasiltes.PNG"
            alt="Ilustrasi kondisi emosional"
            className="h-60 w-auto object-contain"
          />
        </div>

        <h1 className="mb-5 text-center text-xl font-bold text-[#1f3b5b]">
          Hi, kondisi kamu saat ini berada pada kategori {levelNama}
        </h1>

        <div className="max-h-[360px] w-full overflow-y-auto rounded-xl bg-[#f9fafb] px-5 py-4 text-justify text-sm leading-relaxed text-[#555555]">
          {paragrafDeskripsi}
        </div>

        <div className="mt-6 flex w-full justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push(`/tes/hasil/${hasil.tesId ?? 0}`)}
            className="rounded-full bg-[#1f3b5b] px-6 py-2 text-xs font-semibold text-white hover:bg-blue-900"
          >
            Detail Hasil
          </button>
        </div>
      </div>
    </div>
  );
}
