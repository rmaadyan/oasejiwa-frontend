"use client";

import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import type { TesItem } from "@/components/features/manajemen-tes/types";
import { getAllTes } from "@/lib/api/tes";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type GroupedTes = {
  jenis: string;
  items: TesItem[];
};

// 🟢 HELPER: Menentukan gambar kartu berdasarkan nama/jenis tes
function getTesImage(tes: TesItem): string {
  if (tes.coverUrl && tes.coverUrl.trim() !== "") return tes.coverUrl;

  const namaLower = (tes.nama || "").toLowerCase();
  const jenisLower = (tes.jenis || "").toLowerCase();

  if (namaLower.includes("iq") || jenisLower.includes("iq")) {
    return "/assets/tes/tes_iq.jpg";
  }
  if (
    namaLower.includes("personality") ||
    namaLower.includes("mbti") ||
    namaLower.includes("kepribadian") ||
    jenisLower.includes("kepribadian")
  ) {
    return "/assets/tes/personalitiy_tes.webp";
  }
  if (
    namaLower.includes("koran") ||
    namaLower.includes("pauli") ||
    namaLower.includes("kraepelin") ||
    jenisLower.includes("koran")
  ) {
    return "/assets/tes/tes_koran.png";
  }
  if (namaLower.includes("papi") || jenisLower.includes("papi")) {
    return "/assets/tes/tes_papi.png";
  }
  if (namaLower.includes("verbal") || jenisLower.includes("verbal")) {
    return "/assets/tes/tes_ verbal.webp";
  }

  return "/assets/layanan-default.png";
}

export default function TesPsikologiUserPage() {
  const router = useRouter();
  const [tesList, setTesList] = useState<TesItem[]>([]);
  const [loading, setLoading] = useState(true);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function fetchTes() {
      try {
        const data = await getAllTes();
        const aktif = data.filter((t: TesItem) => t.status === "Aktif");
        setTesList(aktif);
      } catch (err) {
        console.error("Gagal fetch tes:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTes();
  }, []);

  const handleScrollToList = () => {
    if (listRef.current) {
      listRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const groupedByJenis: GroupedTes[] = (() => {
    const map = new Map<string, TesItem[]>();
    for (const item of tesList) {
      const key = item.jenis || "Tes Psikologi Online";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([jenis, items]) => ({ jenis, items }));
  })();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F0F4F8]">
        <div className="rounded-xl bg-white border border-[#E1E8F0] px-8 py-6 text-sm text-[#234463] shadow-md font-semibold animate-pulse">
          Memuat tes psikologi...
        </div>
      </div>
    );
  }

  return (
    <>
      {/* 🟢 CSS ANIMASI EXTRA SMOOTH & SOFT */}
      <style jsx global>{`
        @keyframes slideInFromLeft {
          0% {
            opacity: 0;
            transform: translateX(-35px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInFromRight {
          0% {
            opacity: 0;
            transform: translateX(35px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInFromBottom {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Durasi 1.2s dengan Easing Smooth Slow-Down */
        .animate-enter-left {
          animation: slideInFromLeft 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .animate-enter-right {
          animation: slideInFromRight 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .animate-enter-bottom {
          animation: slideInFromBottom 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>

      <Navbar />
      <div className="bg-white font-poppins">
        {/* HERO SECTION */}
        <section className="pt-32 pb-16 px-6 lg:px-12 overflow-hidden">
          <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-12 lg:flex-row lg:items-center lg:justify-between">
            
            {/* 🟢 GRID HERO 5 GAMBAR (ANIMASI KIRI EXTRA SMOOTH) */}
            <div className="w-full lg:w-[55%] order-2 lg:order-1 flex justify-center lg:justify-start animate-enter-left">
              <div className="grid grid-cols-4 gap-3 sm:gap-4 items-center w-full max-w-2xl">
                
                {/* 1. Personality Test */}
                <div className="h-64 sm:h-72 rounded-[28px] overflow-hidden">
                  <img
                    src="/assets/tes/personalitiy_tes.webp"
                    alt="Personality Test"
                    className="w-full h-full object-contain rounded-[24px]"
                  />
                </div>

                {/* 2. Tes IQ & PAPI */}
                <div className="flex flex-col gap-3 sm:gap-4">
                  <div className="h-28 sm:h-32 rounded-[22px] overflow-hidden">
                    <img
                      src="/assets/tes/tes_iq.jpg"
                      alt="Tes IQ"
                      className="w-full h-full object-contain rounded-[18px]"
                    />
                  </div>
                  <div className="h-28 sm:h-32 rounded-[22px] overflow-hidden">
                    <img
                      src="/assets/tes/tes_papi.png"
                      alt="Tes PAPI"
                      className="w-full h-full object-contain rounded-[18px]"
                    />
                  </div>
                </div>

                {/* 3. Tes Verbal */}
                <div className="h-72 sm:h-80 rounded-[32px] overflow-hidden transform -translate-y-2">
                  <img
                    src="/assets/tes/tes_verbal.webp"
                    alt="Tes Verbal"
                    className="w-full h-full object-contain rounded-[28px]"
                  />
                </div>

                {/* 4. Tes Koran */}
                <div className="h-56 sm:h-64 rounded-[28px] overflow-hidden">
                  <img
                    src="/assets/tes/tes_koran.png"
                    alt="Tes Koran"
                    className="w-full h-full object-contain rounded-[24px]"
                  />
                </div>

              </div>
            </div>

            {/* 🟢 TEKS HERO (ANIMASI KANAN EXTRA SMOOTH) */}
            <div className="w-full lg:w-[42%] order-1 lg:order-2 animate-enter-right">
              <h1 className="text-[38px] lg:text-[46px] font-semibold leading-[1.15] text-[#000000]">
                Apakah <span className="text-[#234463]">kamu</span>
                <br />
                baik-baik saja hari ini?
              </h1>
              <div className="mt-6 max-w-lg space-y-4 text-[15px] lg:text-[17px] leading-relaxed text-[#4B4B4B]">
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
                className="mt-8 rounded-xl bg-[#234463] px-8 py-3.5 text-[15px] font-semibold text-white hover:bg-[#1C364F] hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
              >
                Coba Tes
              </button>
            </div>

          </div>
        </section>

        {/* LIST TES SECTION (ANIMASI BAHWA EXTRA SMOOTH) */}
        <section ref={listRef} className="bg-[#F0F4F8] pb-20 pt-12 animate-enter-bottom">
          <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6 lg:px-16">
            
            {/* TAMPILAN KARTU JIKA DATA TES TERSEDIA */}
            {groupedByJenis.map((group) => (
              <div key={group.jenis} className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-1.5 w-10 bg-[#234463] rounded-full" />
                  <h2 className="text-[26px] md:text-[30px] font-bold text-[#1E293B]">
                    {group.jenis}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {group.items.map((tes) => {
                    const imageSrc = getTesImage(tes);

                    return (
                      <div
                        key={tes.id}
                        className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                      >
                        <div className="relative h-56 w-full overflow-hidden bg-slate-50 flex items-center justify-center p-2">
                          <img
                            src={imageSrc}
                            alt={tes.nama}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-2xl"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = "/assets/layanan-default.png";
                            }}
                          />
                        </div>

                        <div className="flex flex-col flex-1 p-7 justify-between">
                          <div>
                            <h3 className="text-[20px] font-bold text-[#112F4F] leading-snug line-clamp-2 mb-3 group-hover:text-[#234463] transition-colors duration-300">
                              {tes.nama}
                            </h3>
                            <p className="text-[14px] text-[#5A718F] leading-relaxed line-clamp-3 mb-6">
                              {tes.deskripsi || "Tes psikologi online untuk membantu memahami emosi dan potensi diri Anda."}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => router.push(`/tes/preview-tes/${tes.id}`)}
                            className="w-full bg-[#E8F1F9] hover:bg-[#234463] text-[#234463] hover:text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 text-[14px] flex items-center justify-center gap-2 group/btn cursor-pointer"
                          >
                            Mulai Tes
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              className="h-4 w-4 transform group-hover/btn:translate-x-1 transition-transform duration-300" 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* TAMPILAN JIKA BELUM ADA TES AKTIF */}
            {groupedByJenis.length === 0 && (
              <div className="text-center py-16">
                <div className="inline-block bg-white rounded-3xl border border-[#E1E8F0] px-10 py-8 shadow-sm max-w-md mx-auto">
                  <div className="w-14 h-14 bg-[#E8F1F9] text-[#234463] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-[18px] font-bold text-[#112F4F] mb-1">
                    Belum Ada Tes Aktif
                  </h3>
                  <p className="text-[14px] text-[#5A718F] leading-relaxed">
                    Saat ini belum ada tes yang tersedia. Silakan cek kembali dalam beberapa waktu ke depan.
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