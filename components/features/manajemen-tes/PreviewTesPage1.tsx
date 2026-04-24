"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TestRunner1 from "@/components/features/manajemen-tes/TestRunner1";
import type { TesDetail } from "@/components/features/manajemen-tes/DetailTesForm";
import type { TesItem } from "@/components/features/manajemen-tes/types";
import { getTesById } from "@/lib/api/tes";

function mapTesItemToDetail(tes: TesItem): TesDetail {
  return {
    id: tes.id,
    nama: tes.nama,
    deskripsi: tes.deskripsi,
    penjelasanHasil: tes.penjelasanHasil,
    status: tes.status,
    likert: tes.likert,
    kategori: tes.kategori,
    pertanyaan: tes.pertanyaan,
    sectionKategori: tes.sectionKategori,
  };
}

export default function PreviewTesPage1() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id);

  const [tes, setTes] = useState<TesDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTes() {
      try {
        const data: TesItem = await getTesById(id);
        setTes(mapTesItemToDetail(data));
      } catch (err) {
        console.error("Gagal fetch tes:", err);
        setTes(null);
      } finally {
        setLoading(false);
      }
    }
    fetchTes();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f7fb]">
        <div className="rounded-xl bg-white px-6 py-4 text-sm text-gray-600 shadow">
          Memuat tes...
        </div>
      </div>
    );
  }

  if (!tes) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f7fb]">
        <div className="rounded-xl bg-white px-6 py-4 text-sm text-gray-700 shadow">
          Tes tidak ditemukan.
          <button
            onClick={() => router.back()}
            className="ml-3 rounded-full border border-gray-300 px-3 py-1 text-xs text-gray-700 hover:bg-gray-50"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return <TestRunner1 tes={tes} onBack={() => router.back()} />;
}