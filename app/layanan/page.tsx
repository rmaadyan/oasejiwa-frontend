"use client";
// app/layanan/page.tsx
import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";

import type { LayananItem } from "@/components/features/manajemen-layanan/types";
import { getAllLayanan } from "@/lib/api/layanan";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Grouped = {
  jenis: string;
  items: LayananItem[];
};

export default function LayananLandingPage() {
  const [layananAktif, setLayananAktif] = useState<LayananItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const jenisRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllLayanan();
        const aktif = data.filter((l) => l.status === "Aktif");
        setLayananAktif(aktif);
      } catch (err) {
        console.error(err);
        setErrorMsg("Gagal memuat layanan. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
    router.push(`/layanan/layanan-preview/preview/${id}`);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="rounded-xl bg-[#E8F6FF] px-8 py-6 text-sm text-[#234463] shadow-lg font-[var(--font-poppins)] font-semibold">
          Memuat layanan...
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="rounded-xl bg-red-50 px-8 py-6 text-sm text-red-600 shadow-lg font-[var(--font-poppins)] font-semibold">
          {errorMsg}
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
                Sudah memberi{" "}
                <span className="text-[#234463]">ruang</span>
                <br />
                untuk dirimu hari ini?
              </h1>

              <div className="mt-6 max-w-lg space-y-4 text-[16px] md:text-[18px] leading-relaxed text-[#4B4B4B]">
                <p>
                  Setiap orang punya cara berbeda untuk pulih dan bertumbuh. Di
                  sini, kamu bisa memilih layanan yang paling sesuai: psikotes,
                  konseling, atau sesi edukatif bersama profesional.
                </p>
                <p className="text-[#4B4B4B]/80">
                  Gulir ke bawah untuk melihat layanan yang tersedia dan mulai
                  dari langkah yang paling ringan untukmu.
                </p>
              </div>

              <button
                type="button"
                onClick={handleScrollToJenis}
                className="mt-8 rounded-xl bg-[#234463] px-8 py-3.5 text-[15px] font-semibold text-white hover:bg-[#2B5379] hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                Jelajahi Layanan
              </button>
            </div>

            {/* kanan: ilustrasi */}
            <div className="w-full md:w-1/2 animate-fade-in-right">
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
        <section ref={jenisRef} className="bg-gradient-to-b from-white to-[#E8F6FF]/20 pb-20 pt-8">
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

                {/* deretan kartu */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {group.items.map((layanan, index) => (
                    <div
                      key={layanan.id}
                      className={`flex flex-col overflow-hidden rounded-[22px] bg-[#E8F6FF] shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:bg-gradient-to-b hover:from-[#E8F6FF] hover:to-[#d4edff] group animate-fade-in-up stagger-${(index % 6) + 1}`}
                    >
                      {/* gambar header */}
                      <div className="relative h-48 w-full bg-slate-200 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#234463]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={layanan.coverUrl || "/assets/layanan-default.png"}
                          alt={layanan.nama}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>

                      {/* body */}
                      <div className="flex flex-1 flex-col p-6">
                        <h3 className="text-[18px] md:text-[20px] font-semibold text-[#234463] mb-4 line-clamp-2 leading-tight">
                          {layanan.nama}
                        </h3>

                        <div className="w-12 h-1 bg-[#234463] rounded-full mb-4 group-hover:w-20 transition-all duration-300" />

                        <div className="space-y-3 mb-6">
                          {/* Durasi Card */}
                          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 flex items-center gap-3 transition-all duration-300 hover:bg-white/80">
                            <div className="w-9 h-9 bg-[#234463] rounded-full flex items-center justify-center shrink-0">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <p className="text-[12px] font-medium text-[#4B4B4B]">Durasi</p>
                              <p className="text-[14px] font-semibold text-[#234463]">
                                {layanan.durasiMenit} menit
                              </p>
                            </div>
                          </div>

                          {/* Harga Card */}
                          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 flex items-center gap-3 transition-all duration-300 hover:bg-white/80">
                            <div className="w-9 h-9 bg-[#234463] rounded-full flex items-center justify-center shrink-0">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <p className="text-[12px] font-medium text-[#4B4B4B]">Harga</p>
                              <p className="text-[14px] font-semibold text-[#234463]">
                                Rp {layanan.harga.toLocaleString("id-ID")}
                              </p>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleLihatDetail(layanan.id)}
                          className="w-full mt-auto rounded-xl bg-[#234463] px-6 py-3 text-[14px] font-semibold text-white hover:bg-[#2B5379] hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                        >
                          Lihat Detail
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {groupedByJenis.length === 0 && (
              <div className="text-center py-16">
                <div className="inline-block bg-[#E8F6FF] rounded-2xl px-8 py-6">
                  <p className="text-[16px] text-[#234463] font-medium">
                    Belum ada layanan aktif yang dapat ditampilkan.
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