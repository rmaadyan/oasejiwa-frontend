"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DetailTesForm, { TesDetail } from "@/components/features/manajemen-tes/DetailTesForm";
import type { TesItem } from "@/components/features/manajemen-tes/types";
import { getTesById, updateTes } from "@/lib/api/tes";
import { ChevronLeft } from "lucide-react";

function mapTesItemToDetail(tes: TesItem): TesDetail {
  return {
    id: tes.id,
    nama: tes.nama,
    deskripsi: tes.deskripsi,
    penjelasanHasil: tes.penjelasanHasil,
    status: tes.status,
    coverUrl: tes.coverUrl, // ← tambahkan ini
    likert: tes.likert,
    kategori: tes.kategori,
    pertanyaan: tes.pertanyaan,
    sectionKategori: tes.sectionKategori,
  };
}

export default function EditTesPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id);

  const [initialTes, setInitialTes] = useState<TesDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTes() {
      try {
        const data: TesItem = await getTesById(id);
        setInitialTes(mapTesItemToDetail(data));
      } catch (err) {
        console.error(err);
        setInitialTes(null);
      } finally {
        setLoading(false);
      }
    }
    fetchTes();
  }, [id]);

  const handleSave = async (detail: TesDetail) => {
    try {
      setSaving(true);
      setError(null);

      const sectionKategoriFlat = Object.entries(detail.sectionKategori ?? {}).flatMap(
        ([sectionNama, list]) =>
          list.map((item) => ({
            sectionNama,
            nama: item.nama,
            minSkor: item.minSkor,
            maxSkor: item.maxSkor,
            deskripsi: item.deskripsi,
          }))
      );

      await updateTes(id, {
        nama: detail.nama,
        deskripsi: detail.deskripsi,
        penjelasanHasil: detail.penjelasanHasil,
        status: detail.status,
        coverUrl: detail.coverUrl || undefined, // ← tambahkan ini
        pertanyaan: detail.pertanyaan.map((p, i) => ({
          teks: p.teks,
          arah: p.arah,
          section: p.section || undefined,
          urutan: i + 1,
        })),
        likert: detail.likert.map((l) => ({
          label: l.label,
          value: l.value,
        })),
        kategori: detail.kategori.map((k) => ({
          nama: k.nama,
          minPersen: k.minPersen,
          maxPersen: k.maxPersen,
          deskripsi: k.deskripsi,
          result: k.result,
        })),
        sectionKategori: sectionKategoriFlat,
      });

      router.push("/admin/manajemen-tes");
    } catch (err) {
      setError("Gagal menyimpan tes. Silakan coba lagi.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f7fb]">
        <div className="rounded-xl bg-white px-6 py-4 text-sm text-gray-600 shadow">
          Memuat data tes...
        </div>
      </div>
    );
  }

  if (!initialTes) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f7fb]">
        <div className="rounded-xl bg-white px-6 py-4 text-sm text-gray-700 shadow">
          Tes tidak ditemukan.
          <button
            onClick={() => router.push("/admin/manajemen-tes")}
            className="ml-3 rounded-full border border-gray-300 px-3 py-1 text-xs text-gray-700 hover:bg-gray-50"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] px-10 py-6">
      <div className="mb-4 flex items-center">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 shadow-sm hover:bg-slate-50"
          aria-label="Kembali"
        >
          <ChevronLeft size={18} />
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {saving && (
        <div className="mb-4 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-600">
          Menyimpan perubahan...
        </div>
      )}

      <DetailTesForm
        initial={initialTes}
        onSave={handleSave}
        onCancel={() => router.back()}
      />
    </div>
  );
}