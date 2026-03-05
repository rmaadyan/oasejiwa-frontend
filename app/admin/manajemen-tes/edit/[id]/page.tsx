// app/manajemen-tes/edit/[id]/page.tsx

"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DetailTesForm, {
  TesDetail,
} from "@/components/features/manajemen-tes/DetailTesForm";
import type { TesItem } from "@/components/features/manajemen-tes/types";
import { INITIAL_DATA } from "@/components/features/manajemen-tes/dataDummy";
import { ChevronLeft } from "lucide-react";

const STORAGE_KEY = "tes-list";

export default function EditTesPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [initialTes, setInitialTes] = useState<TesDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let list: TesItem[] = INITIAL_DATA;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed: TesItem[] = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          list = parsed;
        }
      } catch {
        // fallback INITIAL_DATA
      }
    }

    const found = list.find((t) => t.id === id);
    if (found) {
      setInitialTes({
        id: found.id,
        nama: found.nama,
        deskripsi: found.deskripsi,
        penjelasanHasil: found.penjelasanHasil, 
        status: found.status,
        likert: found.likert,
        kategori: found.kategori,
        pertanyaan: found.pertanyaan,
        sectionKategori: found.sectionKategori,
      });
    } else {
      setInitialTes(null);
    }
    setLoading(false);
  }, [id]);

  const handleSave = (detail: TesDetail) => {
    if (typeof window === "undefined") return;

    let list: TesItem[] = INITIAL_DATA;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed: TesItem[] = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          list = parsed;
        }
      } catch {
        // fallback
      }
    }

    const updated: TesItem[] = list.map((item) =>
      item.id === id
        ? {
            ...item,
            nama: detail.nama,
            deskripsi: detail.deskripsi,
            penjelasanHasil: detail.penjelasanHasil, // <-- NEW
            status: detail.status,
            jumlah: detail.pertanyaan.length,
            pertanyaan: detail.pertanyaan,
            likert: detail.likert,
            kategori: detail.kategori,
            sectionKategori: detail.sectionKategori,
          }
        : item,
    );

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // setelah simpan langsung kembali ke tabel
    router.push("/");
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
            onClick={() => router.push("/manajemen-tes")}
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

      <DetailTesForm
        initial={initialTes}
        onSave={handleSave}
        onCancel={() => router.back()}
      />
    </div>
  );
}
