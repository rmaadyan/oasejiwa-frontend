"use client";

import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";

import type { LayananItem } from "@/components/features/manajemen-layanan/types";
import { getAllLayanan } from "@/lib/api/layanan";
import { getImageUrl } from "@/lib/utils/getImageUrl";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const SVG_FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300' fill='%23f1f5f9'%3E%3Crect width='400' height='300' fill='%23f1f5f9'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-family='sans-serif' font-size='14' font-weight='500'%3EGambar Tidak Tersedia%3C/text%3E%3C/svg%3E";

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
        const aktif = data.filter((l: LayananItem) => l.status === "Aktif");
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
      <div className="flex min-h-screen items-center justify-center bg-white font-poppins">
        <div className="rounded-xl bg-[#E8F6FF] px-8 py-6 text-sm text-[#234463] shadow-lg font-semibold">
          Memuat layanan...
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white font-poppins">
        <div className="rounded-xl bg-red-50 px-8 py-6 text-sm text-red-600 shadow-lg font-semibold">
          {errorMsg}
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="bg-white font-poppins">
        {/* HERO */}
        <section className="pt-32 pb-16 px-6 lg:px-12">
          <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-8 md:flex-row md:items-center md:justify-between">
            {/* Kiri: Teks (Diberi porsi 42% agar area kanan punya ruang lebih luas) */}
            <div className="w-full md:w-[42%] shrink-0 animate-fade-in-left">
              <h1 className="text-[38px] lg:text-[46px] font-semibold leading-[1.15] text-[#000000]">
                Sudah memberi{" "}
                <span className="text-[#234463]">ruang</span>
                <br />
                untuk dirimu hari ini?
              </h1>

              <div className="mt-6 max-w-lg space-y-4 text-[15px] lg:text-[17px] leading-relaxed text-[#4B4B4B]">
                <p>
                  Setiap orang punya cara berbeda untuk pulih dan bertumbuh. Di
                  sini, kamu bisa memilih layanan yang paling sesuai: psikotes,
                  konseling, atau sesi edukatif bersama professional.
                </p>
                <p className="text-[#4B4B4B]/80">
                  Gulir ke bawah untuk melihat layanan yang tersedia dan mulai
                  dari langkah yang paling ringan untukmu.
                </p>
              </div>

              <button
                type="button"
                onClick={handleScrollToJenis}
                className="mt-8 rounded-xl bg-[#234463] px-8 py-3.5 text-[15px] font-semibold text-white hover:bg-[#2B5379] hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
              >
                Jelajahi Layanan
              </button>
            </div>

            {/* Kanan: Large Clean Grid (Porsi 58% - Foto Beneran Besar & Keisi) */}
            <div className="w-full md:w-[58%] animate-fade-in-right py-2">
              <div className="grid w-full grid-cols-4 gap-3 sm:gap-4 lg:gap-5 items-center">
                
                {/* KOLOM 1: Foto 1 (Jabat Tangan) */}
                <div className="flex items-center justify-center">
                  <div className="aspect-[3/4] w-full overflow-hidden rounded-[26px] bg-slate-100 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <img
                      src="/assets/foto-1.jpg"
                      alt="Konseling 1"
                      className="h-full w-full object-cover object-[25%_40%] transition-transform duration-500 hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = SVG_FALLBACK;
                      }}
                    />
                  </div>
                </div>

                {/* KOLOM 2: Stacked Foto 2 & Foto 5 */}
                <div className="flex flex-col justify-center gap-3 sm:gap-4 lg:gap-5">
                  {/* Foto 2: Pasangan */}
                  <div className="aspect-[4/3] w-full overflow-hidden rounded-[22px] bg-slate-100 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <img
                      src="/assets/foto-2.jpg"
                      alt="Konseling Pasangan"
                      className="h-full w-full object-cover object-[50%_20%] transition-transform duration-500 hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = SVG_FALLBACK;
                      }}
                    />
                  </div>

                  {/* Foto 5: Konseling Individu */}
                  <div className="aspect-[4/3] w-full overflow-hidden rounded-[22px] bg-slate-100 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <img
                      src="/assets/foto-5.jpg"
                      alt="Konseling Individu"
                      className="h-full w-full object-cover object-[25%_20%] transition-transform duration-500 hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = SVG_FALLBACK;
                      }}
                    />
                  </div>
                </div>

                {/* KOLOM 3: Foto 3 (Portrait Utama - Paling Tinggi) */}
                <div className="flex items-center justify-center">
                  <div className="aspect-[1/1.9] w-full overflow-hidden rounded-[30px] bg-slate-100 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                    <img
                      src="/assets/foto-3.jpg"
                      alt="Psikolog dan Klien"
                      className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = SVG_FALLBACK;
                      }}
                    />
                  </div>
                </div>

                {/* KOLOM 4: Foto 4 (Anak - Melayang Pas di Tengah) */}
                <div className="flex items-center justify-center">
                  <div className="aspect-[3/4] w-full overflow-hidden rounded-[26px] bg-slate-100 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <img
                      src="/assets/foto-4.jpeg"
                      alt="Konseling Anak"
                      className="h-full w-full object-cover object-[15%_center] transition-transform duration-500 hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = SVG_FALLBACK;
                      }}
                    />
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>
           

        {/* SECTION PER JENIS */}
        <section ref={jenisRef} className="bg-gradient-to-b from-white to-[#E8F6FF]/20 pb-20 pt-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6 lg:px-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {layananAktif.map((layanan, index) => {
                const rawImagePath =
                  layanan.coverUrl ||
                  (layanan as any).imageUrl ||
                  (layanan as any).image;

                const imageSrc = getImageUrl(rawImagePath);

                return (
                  <div
                    key={layanan.id}
                    className={`flex flex-col overflow-hidden rounded-[22px] bg-[#E8F6FF] shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:bg-gradient-to-b hover:from-[#E8F6FF] hover:to-[#d4edff] group animate-fade-in-up stagger-${(index % 6) + 1}`}
                  >
                    {/* Gambar Header */}
                    <div className="relative h-48 w-full bg-slate-200 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#234463]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                      <img
                        src={imageSrc}
                        alt={layanan.nama}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = SVG_FALLBACK;
                        }}
                      />
                    </div>

                    {/* Body Card */}
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
                              Rp {(layanan.harga || 0).toLocaleString("id-ID")}
                            </p>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleLihatDetail(layanan.id)}
                        className="w-full mt-auto rounded-xl bg-[#234463] px-6 py-3 text-[14px] font-semibold text-white hover:bg-[#2B5379] hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
                      >
                        Lihat Detail
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {layananAktif.length === 0 && (
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