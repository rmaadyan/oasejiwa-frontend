// app/tes/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { TesItem } from "@/components/features/manajemen-tes/types";
import { INITIAL_DATA } from "@/components/features/manajemen-tes/dataDummy";

const STORAGE_KEY = "tes-list";

type GroupedTes = {
  jenis: string;
  items: TesItem[];
};

export default function TesPsikologiUserPage() {
  const router = useRouter();
  const [tesList, setTesList] = useState<TesItem[]>([]);
  const [loading, setLoading] = useState(true);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let data: TesItem[] = INITIAL_DATA;

    if (typeof window !== "undefined") {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        try {
          const parsed: TesItem[] = JSON.parse(raw);
          if (Array.isArray(parsed)) data = parsed;
        } catch {
          // ignore
        }
      }
    }

    const aktif = data.filter((t) => t.status === "Aktif");
    setTesList(aktif);
    setLoading(false);
  }, []);

  const handleScrollToList = () => {
    if (listRef.current) {
      listRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const groupedByJenis: GroupedTes[] = (() => {
    const map = new Map<string, TesItem[]>();
    for (const item of tesList) {
      const key = item.jenis || "Tes lainnya"; // fallback Tes lainnya
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([jenis, items]) => ({ jenis, items }));
  })();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f7fb]">
        <div className="rounded-xl bg-white px-6 py-4 text-sm text-gray-600 shadow">
          Memuat tes psikologi...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="flex min-h-screen items-center bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 px-4 py-10 md:flex-row md:items-center">
          {/* kiri: teks */}
          <div className="w-full md:w-1/2">
            <h1 className="text-[38px] font-bold leading-[1.15] text-[#0f172a] md:text-[46px]">
              Sudah sempat{" "}
              <span className="text-[#319def]">jujur</span>
              <br />
              pada diri sendiri hari ini?
            </h1>

            <div className="mt-5 max-w-lg space-y-3 text-[15px] leading-relaxed text-gray-600">
              <p>
                Luangkan beberapa menit untuk mengenali kondisi emosimu melalui Tes
                Psikologi yang kami sediakan. Jawabanmu akan tetap privat dan hanya
                tersimpan di perangkat yang kamu gunakan.
              </p>
              <p className="text-gray-500">
                Kenali dirimu lebih dalam, lalu ambil langkah kecil yang tepat
                untuk menjaga kesehatan mentalmu.
              </p>
            </div>

            <button
              type="button"
              onClick={handleScrollToList}
              className="mt-8 rounded-full bg-[#1f3b5b] px-6 py-2 text-xs font-semibold text-white hover:bg-blue-900"
            >
              Coba Tes
            </button>
          </div>

          {/* kanan: gambar */}
          <div className="w-full md:w-1/2">
            <div className="mx-auto w-full max-w-xl">
              <img
                src="/assets/newtes.PNG"
                alt="Ilustrasi kesehatan mental"
                className="w-full object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* LIST TES */}
      <section ref={listRef} className="bg-white pb-16 pt-2">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4">
          {groupedByJenis.map((group) => (
            <div key={group.jenis} className="space-y-4">
              {/* judul jenis */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#1f3b5b]">
                  {group.jenis}
                </h2>
              </div>

              {/* deretan kartu tes */}
              <div className="flex flex-wrap justify-start gap-4">
                {group.items.map((tes) => (
                  <div
                    key={tes.id}
                    className="flex w-full max-w-xs flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-0.5 hover:shadow-lg sm:w-[260px] lg:w-[260px]"
                  >
                    {/* header image: samakan dengan layanan */}
                    <div className="relative h-32 w-full bg-slate-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={tes.coverUrl || "/assets/layanan-default.png"}
                        alt={tes.nama}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* body */}
                    <div className="flex flex-1 flex-col px-3 pt-3 pb-2">
                      <p className="text-xs font-semibold text-[#1f3b5b] line-clamp-2">
                        {tes.nama}
                      </p>
                      <p className="mt-1 line-clamp-2 text-[11px] text-gray-600">
                        {tes.deskripsi}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-[10px] text-gray-400">
                        <span>{tes.jumlah} pertanyaan</span>
                        <span />
                      </div>
                    </div>

                    {/* footer tombol */}
                    <div className="border-t border-gray-100 px-3 py-2.5">
                      <div className="flex justify-center">
                        <button
                          type="button"
                          onClick={() =>
                            router.push(`/manajemen-tes/preview/${tes.id}`)
                          }
                          className="rounded-full bg-[#1f3b5b] px-4 py-1.5 text-[11px] font-semibold text-white hover:bg-blue-900"
                        >
                          Mulai Tes
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {group.items.length === 0 && (
                  <p className="text-center text-xs text-gray-500">
                    Belum ada tes untuk kategori ini.
                  </p>
                )}
              </div>
            </div>
          ))}

          {groupedByJenis.length === 0 && (
            <p className="text-center text-sm text-gray-500">
              Belum ada tes aktif yang dapat ditampilkan.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
