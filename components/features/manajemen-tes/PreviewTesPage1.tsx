// components/features/manajemen-tes/PreviewTesPage.tsx

"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TestRunner from "./TestRunner1";
import { INITIAL_DATA } from "./dataDummy";
import type { TesItem } from "./types";
import TestRunner1 from "./TestRunner1";

const STORAGE_KEY = "tes-list";

export default function PreviewTesPage1() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [tes, setTes] = useState<TesItem | null>(null);
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
        // kalau gagal parse, tetap pakai INITIAL_DATA
      }
    }

    const found = list.find((t) => t.id === id) ?? null;
    setTes(found);
    setLoading(false);
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
