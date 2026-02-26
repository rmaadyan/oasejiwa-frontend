// components/features/manajemen-tes/TambahTesPage.tsx

"use client";

import { useRouter } from "next/navigation";
import DetailTesForm, { TesDetail } from "./DetailTesForm";
import type { TesItem, TesCreatePayload } from "./types";
import { INITIAL_DATA } from "./dataDummy";
import { ChevronLeft } from "lucide-react";

const STORAGE_KEY = "tes-list";

export default function TambahTesPage() {
  const router = useRouter();

  const handleSubmit = (data: TesCreatePayload) => {
    let currentList: TesItem[] = INITIAL_DATA;

    if (typeof window !== "undefined") {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        try {
          const parsed: TesItem[] = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            currentList = parsed;
          }
        } catch {
          // biarkan pakai INITIAL_DATA
        }
      }

      const nextId =
        currentList.length > 0
          ? currentList[currentList.length - 1].id + 1
          : 1;

      const newItem: TesItem = { id: nextId, ...data };
      const updated = [...currentList, newItem];

      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }

    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] px-10 py-6">
      {/* Header: tombol kembali kiri, judul di tengah */}
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
        initial={null}
        onSave={(tesDetail: TesDetail) => {
          const data: TesCreatePayload = {
            nama: tesDetail.nama,
            deskripsi: tesDetail.deskripsi,
            penjelasanHasil: tesDetail.penjelasanHasil,
            status: tesDetail.status,
            jumlah: tesDetail.pertanyaan.length,
            pertanyaan: tesDetail.pertanyaan,
            likert: tesDetail.likert,
            kategori: tesDetail.kategori,
          };

          handleSubmit(data);
        }}
        onCancel={() => router.back()}
      />
    </div>
  );
}
