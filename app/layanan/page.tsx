"use client";
// app/layanan/page.tsx
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { LayananItem } from "@/components/features/manajemen-layanan/types";
import { INITIAL_LAYANAN } from "@/components/features/manajemen-layanan/dataDummy";

const STORAGE_KEY = "layanan-list";

type Grouped = {
  jenis: string;
  items: LayananItem[];
};

export default function LayananLandingPage() {
  const [layananAktif, setLayananAktif] = useState<LayananItem[]>([]);
  const [loading, setLoading] = useState(true);
  const jenisRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    let list: LayananItem[] = INITIAL_LAYANAN;

    if (typeof window !== "undefined") {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        try {
          const parsed: LayananItem[] = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            list = parsed;
          }
        } catch {
          // fallback INITIAL_LAYANAN
        }
      }
    }

    const aktif = list.filter((l) => l.status === "Aktif");
    setLayananAktif(aktif);
    setLoading(false);
  }, []);

  const groupedByJenis: Grouped[] = (() => {
    const map = new Map<string, LayananItem[]>();
    for (const item of layananAktif) {
      const key = item.jenis || "Lainnya";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([jenis, items]) => ({ jenis, items }));
  })();

  const handleScrollToJenis = () => {
    if (jenisRef.current) {
      jenisRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleLihatDetail = (id: number) => {
    // sesuaikan dengan lokasi file preview:
    // app/manajemen-layanan/preview/[id]/page.tsx
    router.push(`/manajemen-layanan/preview/${id}`);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f7fb]">
        <div className="rounded-xl bg-white px-6 py-4 text-sm text-gray-600 shadow">
          Memuat layanan...
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="bg-white">
        {/* HERO */}
        <section className="flex min-h-screen items-center bg-white">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 px-4 py-10 md:flex-row md:items-center">
            {/* kiri: teks */}
            <div className="w-full md:w-1/2">
              <h1 className="text-[38px] font-bold leading-[1.15] text-[#0f172a] md:text-[46px]">
                Sudah memberi{" "}
                <span className="text-[#319def]">ruang</span>
                <br />
                untuk dirimu hari ini?
              </h1>

              <div className="mt-5 max-w-lg space-y-3 text-[15px] leading-relaxed text-gray-600">
                <p>
                  Setiap orang punya cara berbeda untuk pulih dan bertumbuh. Di
                  sini, kamu bisa memilih layanan yang paling sesuai: psikotes,
                  konseling, atau sesi edukatif bersama profesional.
                </p>
                <p className="text-gray-500">
                  Gulir ke bawah untuk melihat layanan yang tersedia dan mulai
                  dari langkah yang paling ringan untukmu.
                </p>
              </div>

              <button
                type="button"
                onClick={handleScrollToJenis}
                className="mt-8 rounded-full bg-[#1f3b5b] px-6 py-2 text-sm font-semibold text-white hover:bg-blue-900 disabled:opacity-60"
              >
                Jelajahi Layanan
              </button>
            </div>

            {/* kanan: ilustrasi */}
            <div className="w-full md:w-1/2">
              <div className="mx-auto w-full max-w-xl">
                <img
                  src="/assets/newtes.PNG"
                  alt="Ilustrasi layanan psikologis"
                  className="w-full object-contain"
                />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION PER JENIS */}
        <section ref={jenisRef} className="bg-white pb-16 pt-2">
          <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4">
            {groupedByJenis.map((group) => (
              <div key={group.jenis} className="space-y-4">
                {/* judul jenis kiri */}
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-[#1f3b5b]">
                    {group.jenis}
                  </h2>
                </div>

                {/* deretan kartu */}
                <div className="flex flex-wrap justify-start gap-4">
                  {group.items.map((layanan) => (
                    <div
                      key={layanan.id}
                      className="flex w-full max-w-xs flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-0.5 hover:shadow-lg sm:w-[260px]"
                    >
                      {/* gambar header */}
                      <div className="relative h-32 w-full bg-slate-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={layanan.coverUrl || "/assets/layanan-default.png"}
                          alt={layanan.nama}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* body */}
                      <div className="flex flex-1 flex-col px-3 pt-3 pb-3">
                        <h3 className="text-sm font-semibold text-slate-900 line-clamp-2">
                          {layanan.nama}
                        </h3>

                        <div className="mt-2 space-y-1 text-[11px] text-slate-600">
                          <p>
                            Durasi:{" "}
                            <span className="font-semibold">
                              {layanan.durasiMenit} menit
                            </span>
                          </p>
                          <p>
                            Harga:{" "}
                            <span className="font-semibold text-[#1f3b5b]">
                              Rp {layanan.harga.toLocaleString("id-ID")}
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* footer tombol */}
                      <div className="border-t border-gray-100 px-3 py-2.5">
                        <button
                          type="button"
                          onClick={() => handleLihatDetail(layanan.id)}
                          className="rounded-full bg-[#1f3b5b] px-4 py-1.5 text-[11px] font-semibold text-white hover:bg-blue-900"
                        >
                          Lihat Detail
                        </button>
                      </div>
                    </div>
                  ))}

                  {group.items.length === 0 && (
                    <p className="text-center text-xs text-gray-500">
                      Belum ada layanan untuk jenis ini.
                    </p>
                  )}
                </div>
              </div>
            ))}

            {groupedByJenis.length === 0 && (
              <p className="text-center text-sm text-gray-500">
                Belum ada layanan aktif yang dapat ditampilkan.
              </p>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
