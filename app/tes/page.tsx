// app/tes/page.tsx
"use client";

import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import { INITIAL_DATA } from "@/components/features/manajemen-tes/dataDummy";
import type { TesItem } from "@/components/features/manajemen-tes/types";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

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
      const key = item.jenis || "Tes Psikologi Online"; // fallback Tes lainnya
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([jenis, items]) => ({ jenis, items }));
  })();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="rounded-xl bg-[#E8F6FF] px-8 py-6 text-sm text-[#234463] shadow-lg font-[var(--font-poppins)] font-semibold">
          Memuat tes psikologi...
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="bg-white font-[var(--font-poppins)]">
        {/* HERO */}
        <section className="pt-32 pb-16 px-6 lg:px-16">
          <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-12 md:flex-row md:items-center">
            {/* kiri: teks */}
            <div className="w-full md:w-1/2 animate-fade-in-left">
              <h1 className="text-[40px] md:text-[48px] font-semibold leading-[1.15] text-[#000000]">
                Sudah sempat{" "}
                <span className="text-[#234463]">jujur</span>
                <br />
                pada diri sendiri hari ini?
              </h1>

              <div className="mt-6 max-w-lg space-y-4 text-[16px] md:text-[18px] leading-relaxed text-[#4B4B4B]">
                <p>
                  Luangkan beberapa menit untuk mengenali kondisi emosimu melalui Tes
                  Psikologi yang kami sediakan. Jawabanmu akan tetap privat dan hanya
                  tersimpan di perangkat yang kamu gunakan.
                </p>
                <p className="text-[#4B4B4B]/80">
                  Kenali dirimu lebih dalam, lalu ambil langkah kecil yang tepat
                  untuk menjaga kesehatan mentalmu.
                </p>
              </div>

              <button
                type="button"
                onClick={handleScrollToList}
                className="mt-8 rounded-xl bg-[#234463] px-8 py-3.5 text-[15px] font-semibold text-white hover:bg-[#2B5379] hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                Coba Tes
              </button>
            </div>

            {/* kanan: gambar */}
            <div className="w-full md:w-1/2 animate-fade-in-right">
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
        <section ref={listRef} className="bg-gradient-to-b from-white to-[#E8F6FF]/20 pb-20 pt-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6 lg:px-16">
            {groupedByJenis.map((group) => (
              <div key={group.jenis} className="space-y-6">
                {/* judul jenis */}
                <div className="flex items-center gap-3">
                  <div className="h-1 w-12 bg-[#234463] rounded-full" />
                  <h2 className="text-[28px] md:text-[32px] font-semibold text-[#234463]">
                    {group.jenis}
                  </h2>
                </div>

                {/* deretan kartu tes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {group.items.map((tes, index) => (
                    <div
                      key={tes.id}
                      className={`flex flex-col overflow-hidden rounded-[22px] bg-[#E8F6FF] shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:bg-gradient-to-b hover:from-[#E8F6FF] hover:to-[#d4edff] group animate-fade-in-up stagger-${(index % 6) + 1}`}
                    >
                      {/* header image */}
                      <div className="relative h-48 w-full bg-slate-200 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#234463]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={tes.coverUrl || "/assets/layanan-default.png"}
                          alt={tes.nama}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>

                      {/* body */}
                      <div className="flex flex-1 flex-col p-6">
                        <h3 className="text-[18px] md:text-[20px] font-semibold text-[#234463] mb-4 line-clamp-2 leading-tight">
                          {tes.nama}
                        </h3>

                        {/* Divider */}
                        <div className="w-12 h-1 bg-[#234463] rounded-full mb-4 group-hover:w-20 transition-all duration-300" />

                        <p className="text-[14px] text-[#4B4B4B] line-clamp-2 mb-4 leading-relaxed">
                          {tes.deskripsi}
                        </p>

                        <div className="space-y-3 mb-6">
                          {/* Info Pertanyaan */}
                          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 flex items-center gap-3 transition-all duration-300 hover:bg-white/80">
                            <div className="w-9 h-9 bg-[#234463] rounded-full flex items-center justify-center shrink-0">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <p className="text-[12px] font-medium text-[#4B4B4B]">Jumlah Pertanyaan</p>
                              <p className="text-[14px] font-semibold text-[#234463]">
                                {tes.jumlah} pertanyaan
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* footer tombol */}
                        <button
                          type="button"
                          onClick={() =>
                            router.push(`/tes/preview-tes/${tes.id}`)
                          }
                          className="w-full mt-auto rounded-xl bg-[#234463] px-6 py-3 text-[14px] font-semibold text-white hover:bg-[#2B5379] hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                        >
                          Mulai Tes
                        </button>
                      </div>
                    </div>
                  ))}

                  {group.items.length === 0 && (
                    <p className="col-span-full text-center text-sm text-[#4B4B4B] py-8">
                      Belum ada tes untuk kategori ini.
                    </p>
                  )}
                </div>
              </div>
            ))}

            {groupedByJenis.length === 0 && (
              <div className="text-center py-16">
                <div className="inline-block bg-[#E8F6FF] rounded-2xl px-8 py-6">
                  <p className="text-[16px] text-[#234463] font-medium">
                    Belum ada tes aktif yang dapat ditampilkan.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
