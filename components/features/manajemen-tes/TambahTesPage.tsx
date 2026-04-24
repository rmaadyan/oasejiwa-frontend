"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import DetailTesForm, { TesDetail } from "./DetailTesForm";
import { ChevronLeft } from "lucide-react";
import { createTes } from "@/lib/api/tes";

export default function TambahTesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: TesDetail) => {
    try {
      setLoading(true);
      setError(null);

      // Konversi sectionKategori dari object ke array flat
      const sectionKategoriFlat = Object.entries(data.sectionKategori ?? {}).flatMap(
        ([sectionNama, list]) =>
          list.map((item) => ({
            sectionNama,
            nama: item.nama,
            minSkor: item.minSkor,
            maxSkor: item.maxSkor,
            deskripsi: item.deskripsi,
          }))
      );

      await createTes({
        nama: data.nama,
        deskripsi: data.deskripsi,
        penjelasanHasil: data.penjelasanHasil,
        status: data.status,
        coverUrl: data.coverUrl || undefined, // ← tambahan
        jumlah: data.pertanyaan.length,
        pertanyaan: data.pertanyaan.map((p, i) => ({
          teks: p.teks,
          arah: p.arah,
          section: p.section || undefined,
          urutan: i + 1,
        })),
        likert: data.likert.map((l) => ({
          label: l.label,
          value: l.value,
        })),
        kategori: data.kategori.map((k) => ({
          nama: k.nama,
          minPersen: k.minPersen,
          maxPersen: k.maxPersen,
          deskripsi: k.deskripsi,
          result: k.result,
        })),
        sectionKategori: sectionKategoriFlat,
      });

      router.push("/admin/manajemen-tes"); // ← arahkan ke halaman admin
    } catch (err) {
      setError("Gagal menyimpan tes. Silakan coba lagi.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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

      {loading && (
        <div className="mb-4 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-600">
          Menyimpan data...
        </div>
      )}

      <DetailTesForm
        initial={null}
        onSave={handleSubmit}
        onCancel={() => router.back()}
      />
    </div>
  );
}