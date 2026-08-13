"use client";

import type { LayananItem } from "@/components/features/manajemen-layanan/types";
import { getAllLayanan, getAllLayananPublic } from "@/lib/api/layanan";
import { getImageUrl } from "@/lib/utils/getImageUrl";
import { useRouter } from "next/navigation";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Banknote,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function ServicesSection() {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const [services, setServices] = useState<LayananItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchLayanan() {
      try {
        let data: LayananItem[] = [];
        try {
          data = await getAllLayananPublic();
        } catch {
          data = await getAllLayanan();
        }
        setServices(data || []);
      } catch (err) {
        console.error("Gagal fetch layanan:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLayanan();
  }, []);

  // 🟢 FILTER AMAN: Toleran terhadap variasi huruf kapital status atau data kosong
  const activeServices = services.filter(
    (item) => !item.status || item.status.toLowerCase() === "aktif" || item.status === "Draft"
  );

  // Ambil list data akhir (Fallback ke `services` jika filter kosong)
  const listData = activeServices.length > 0 ? activeServices : services;
  
  // Ambil maksimal 3 item untuk beranda
  const displayedServices = listData.slice(0, 3);

  const checkScrollPosition = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const isAtStart = el.scrollLeft <= 10;
    const isAtEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 10;
    setCanScrollLeft(!isAtStart);
    setCanScrollRight(!isAtEnd);
  };

  const scrollByCard = (dir: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -350 : 350, behavior: "smooth" });
    setTimeout(() => checkScrollPosition(), 300);
  };

  const formatPrice = (price: number) => `Rp ${(price || 0).toLocaleString("id-ID")}`;

  const handleLihatDetail = (id: number) => {
    router.push(`/layanan/layanan-preview/preview/${id}`);
  };

  if (loading) {
    return (
      <section id="services" className="bg-[#F0F4F8] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-[#1E293B] md:text-5xl mb-8">
            Layanan <span className="text-[#234463]">Kami</span>
          </h2>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#234463]"></div>
            <span className="ml-3 text-[#234463] font-medium">Memuat layanan...</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="bg-[#F0F4F8] py-20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-center text-4xl font-bold text-[#1E293B] md:text-5xl">
            Layanan <span className="text-[#234463]">Kami</span>
          </h2>
        </motion.div>

        <div className="relative">
          {/* Tombol Scroll Kiri */}
          <AnimatePresence>
            {canScrollLeft && (
              <button
                type="button"
                onClick={() => scrollByCard("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-20 grid h-12 w-12 place-items-center rounded-full bg-white shadow-lg hover:bg-slate-50 transition-all cursor-pointer"
              >
                <ChevronLeft className="h-6 w-6 text-[#2B5379]" />
              </button>
            )}
          </AnimatePresence>

          {/* Scroller Container */}
          <div
            ref={scrollerRef}
            className="flex gap-6 overflow-x-auto scroll-smooth pb-4 px-2"
            onScroll={checkScrollPosition}
          >
            {displayedServices.length === 0 ? (
              <div className="flex items-center justify-center w-full py-12">
                <p className="text-[#2B5379]/60 text-sm">
                  Belum ada layanan aktif.
                </p>
              </div>
            ) : (
              displayedServices.map((item, index) => {
                const rawImagePath =
                  item.coverUrl ||
                  (item as any).imageUrl ||
                  (item as any).image;

                const imageSrc = getImageUrl(rawImagePath);

                return (
                  <div
                    key={item.id}
                    /* 🟢 KUNCI ATURAN HP VS LAPTOP:
                       HP (layar kecil): kartu index 0 & 1 tampil (2 kartu), index 2 hidden.
                       Laptop (md): kartu index 2 berubah jadi md:flex (3 kartu tampil). */
                    className={`bg-[#DDEEFC] border-2 border-[#B3D7F8] rounded-3xl p-6 shadow-md hover:shadow-xl hover:border-[#234463] hover:-translate-y-1 transition-all duration-300 flex-col justify-between shrink-0 w-[280px] sm:w-[320px] ${
                      index === 2 ? "hidden md:flex" : "flex"
                    }`}
                  >
                    <div className="flex flex-col items-center text-center">
                      {/* GAMBAR FOTO */}
                      <div className="w-full h-44 rounded-2xl overflow-hidden border-4 border-white shadow-md mb-4 bg-slate-100">
                        <img
                          src={imageSrc}
                          alt={item.nama}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src =
                              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300' fill='%23f1f5f9'%3E%3Crect width='400' height='300' fill='%23f1f5f9'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-family='sans-serif' font-size='14' font-weight='500'%3EGambar Tidak Tersedia%3C/text%3E%3C/svg%3E";
                          }}
                        />
                      </div>

                      {/* JUDUL */}
                      <h3 className="text-xl font-bold text-[#1E3A5F] leading-snug line-clamp-2 min-h-[56px] flex items-center justify-center">
                        {item.nama}
                      </h3>

                      {/* GARIS PEMBATAS */}
                      <div className="w-full border-t border-[#C3E0FA] my-3"></div>

                      {/* KONTEN DETAIL (DURASI & HARGA) */}
                      <div className="w-full space-y-3 text-left">
                        {/* DURASI */}
                        <div className="bg-white/60 p-2.5 rounded-xl border border-[#C3E0FA] flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#234463] rounded-lg flex items-center justify-center shrink-0">
                            <Clock className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <p className="text-[11px] font-semibold text-[#1E3A5F]">
                              Durasi
                            </p>
                            <p className="font-mono text-xs text-[#3B597B] font-semibold">
                              {item.durasiMenit} menit
                            </p>
                          </div>
                        </div>

                        {/* HARGA */}
                        <div className="bg-white/60 p-2.5 rounded-xl border border-[#C3E0FA] flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#234463] rounded-lg flex items-center justify-center shrink-0">
                            <Banknote className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <p className="text-[11px] font-semibold text-[#1E3A5F]">
                              Harga
                            </p>
                            <p className="font-mono text-xs text-[#3B597B] font-semibold">
                              {formatPrice(item.harga)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* TOMBOL LIHAT DETAIL */}
                    <button
                      type="button"
                      onClick={() => handleLihatDetail(item.id)}
                      className="w-full bg-[#234463] hover:bg-[#1C364F] active:scale-[0.98] text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-200 shadow-md mt-6 cursor-pointer text-sm"
                    >
                      Lihat Detail
                    </button>
                  </div>
                );
              })
            )}

            {/* Tombol Lihat Semua */}
            <div className="flex items-center justify-center w-[200px] shrink-0">
              <Link
                href="/layanan"
                className="flex flex-col items-center gap-3 text-[#2B5379] hover:text-[#1C364F] transition-colors"
              >
                <div className="flex items-center gap-2 text-lg font-semibold">
                  Lihat Semua
                  <ArrowRight className="h-5 w-5" />
                </div>
                <p className="text-sm text-[#2B5379]/70 text-center">
                  {listData.length} layanan tersedia
                </p>
              </Link>
            </div>
          </div>

          {/* Tombol Scroll Kanan */}
          <AnimatePresence>
            {canScrollRight && (
              <button
                type="button"
                onClick={() => scrollByCard("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-20 grid h-12 w-12 place-items-center rounded-full bg-white shadow-lg hover:bg-slate-50 transition-all cursor-pointer"
              >
                <ChevronRight className="h-6 w-6 text-[#2B5379]" />
              </button>
            )}
          </AnimatePresence>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Geser untuk melihat layanan lainnya
        </p>
      </div>
    </section>
  );
}