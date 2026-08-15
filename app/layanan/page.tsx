"use client";

import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";

import type { LayananItem } from "@/components/features/manajemen-layanan/types";
import { getAllLayananPublic } from "@/lib/api/layanan";
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

  const fetchLayanan = async () => {
    try {
      const data = await getAllLayananPublic();
      const aktif = data
        .filter((l: LayananItem) => l.status === "Aktif")
        .sort((a: LayananItem, b: LayananItem) => (Number(a.urutan) || 0) - (Number(b.urutan) || 0));
      setLayananAktif(aktif);
    } catch (err) {
      console.error(err);
      setErrorMsg("Gagal memuat layanan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLayanan();

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        fetchLayanan();
      }
    };

    window.addEventListener("focus", fetchLayanan);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("focus", fetchLayanan);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
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
        {/* HERO LAYANAN */}
        <section className="pt-28 sm:pt-32 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-12 overflow-hidden">
          <div className="mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center max-w-7xl">
            <div className="md:col-span-5 md:row-start-1 animate-fade-in-left">
              <h1 className="text-[32px] sm:text-[38px] lg:text-[46px] font-semibold leading-[1.15] text-[#000000]">
                Apakah <span className="text-[#234463]">kamu</span>
                <br />
                baik-baik saja hari ini?
              </h1>

              <div className="mt-4 space-y-3 text-[15px] lg:text-[17px] leading-relaxed text-[#4B4B4B]">
                <p>
                  Setiap orang punya cara berbeda untuk pulih dan bertumbuh. Di sini,
                  kamu bisa memilih layanan yang paling sesuai: psikotes, konseling,
                  atau sesi edukatif bersama professional.
                </p>
                <p className="text-[#4B4B4B]/80">
                  Gulir ke bawah untuk melihat layanan yang tersedia dan mulai dari
                  langkah yang paling ringan untukmu.
                </p>
              </div>
            </div>

            <div className="md:col-span-7 md:row-span-2 md:col-start-6 animate-fade-in-right py-2">
              <div className="grid grid-cols-4 gap-2 sm:gap-4 items-center w-full">
                <div className="flex items-center justify-center">
                  <div className="aspect-[3/4] w-full overflow-hidden rounded-2xl sm:rounded-[26px] bg-slate-100 shadow-md">
                    <img
                      src="/assets/foto-1.jpg"
                      alt="Konseling 1"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = SVG_FALLBACK;
                      }}
                    />
                  </div>
                </div>

                <div className="flex flex-col justify-center gap-2 sm:gap-4">
                  <div className="aspect-[4/3] w-full overflow-hidden rounded-xl sm:rounded-[22px] bg-slate-100 shadow-md">
                    <img
                      src="/assets/foto-2.jpg"
                      alt="Konseling Pasangan"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = SVG_FALLBACK;
                      }}
                    />
                  </div>
                  <div className="aspect-[4/3] w-full overflow-hidden rounded-xl sm:rounded-[22px] bg-slate-100 shadow-md">
                    <img
                      src="/assets/foto-5.jpg"
                      alt="Konseling Individu"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = SVG_FALLBACK;
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <div className="aspect-[3/4] sm:aspect-[1/1.9] w-full overflow-hidden rounded-2xl sm:rounded-[30px] bg-slate-100 shadow-md">
                    <img
                      src="/assets/foto-3.jpg"
                      alt="Psikolog dan Klien"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = SVG_FALLBACK;
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <div className="aspect-[3/4] w-full overflow-hidden rounded-2xl sm:rounded-[26px] bg-slate-100 shadow-md">
                    <img
                      src="/assets/foto-4.jpeg"
                      alt="Konseling Anak"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = SVG_FALLBACK;
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-5 md:row-start-2">
              <button
                type="button"
                onClick={handleScrollToJenis}
                className="w-full md:w-auto rounded-xl bg-[#234463] px-8 py-3.5 text-[15px] font-semibold text-white hover:bg-[#2B5379] hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer text-center"
              >
                Jelajahi Layanan
              </button>
            </div>
          </div>
        </section>

        {/* SECTION DAFTAR LAYANAN */}
        <section ref={jenisRef} className="bg-[#F0F4F8] pb-20 pt-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6 lg:px-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {layananAktif.map((layanan) => {
                const rawImagePath =
                  layanan.coverUrl ||
                  (layanan as any).imageUrl ||
                  (layanan as any).image;

                const imageSrc = getImageUrl(rawImagePath);

                return (
                  <div
                    key={layanan.id}
                    className="bg-[#DDEEFC] border-2 border-[#B3D7F8] rounded-3xl p-7 shadow-md hover:shadow-xl hover:border-[#234463] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-full h-44 rounded-2xl overflow-hidden border-4 border-white shadow-md mb-4 bg-slate-100">
                        <img
                          src={imageSrc}
                          alt={layanan.nama}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = SVG_FALLBACK;
                          }}
                        />
                      </div>

                      <h3 className="text-xl font-bold text-[#1E3A5F] leading-snug line-clamp-2 min-h-[56px] flex items-center justify-center">
                        {layanan.nama}
                      </h3>

                      <div className="w-full border-t border-[#C3E0FA] my-3"></div>

                      <div className="w-full space-y-3 text-left">
                        <div className="bg-white/60 p-2.5 rounded-xl border border-[#C3E0FA] flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#234463] rounded-lg flex items-center justify-center shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-[11px] font-semibold text-[#1E3A5F]">Durasi</p>
                            <p className="font-mono text-xs text-[#3B597B] font-semibold">
                              {layanan.durasiMenit} menit
                            </p>
                          </div>
                        </div>

                        <div className="bg-white/60 p-2.5 rounded-xl border border-[#C3E0FA] flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#234463] rounded-lg flex items-center justify-center shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-[11px] font-semibold text-[#1E3A5F]">Harga</p>
                            <p className="font-mono text-xs text-[#3B597B] font-semibold">
                              Rp {(layanan.harga || 0).toLocaleString("id-ID")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleLihatDetail(layanan.id)}
                      className="w-full bg-[#234463] hover:bg-[#1C364F] active:scale-[0.98] text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-200 shadow-md mt-6 cursor-pointer text-sm"
                    >
                      Lihat Detail
                    </button>
                  </div>
                );
              })}
            </div>

            {layananAktif.length === 0 && (
              <div className="text-center py-16">
                <div className="inline-block bg-[#DDEEFC] border border-[#B3D7F8] rounded-2xl px-8 py-6">
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