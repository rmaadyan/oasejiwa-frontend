"use client";

import type { LayananItem } from "@/components/features/manajemen-layanan/types";
import { getAllLayanan } from "@/lib/api/layanan";
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
  const [scrollDirection, setScrollDirection] = useState<
    "left" | "right" | null
  >(null);

  useEffect(() => {
    async function fetchLayanan() {
      try {
        const data = await getAllLayanan();
        setServices(data);
      } catch (err) {
        console.error("Gagal fetch layanan:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLayanan();
  }, []);

  const activeServices = services.filter((item) => item.status === "Aktif");
  const displayedServices = activeServices.slice(0, 5);
  const router = useRouter();

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
    setScrollDirection(dir);
    el.scrollBy({ left: dir === "left" ? -420 : 420, behavior: "smooth" });
    setTimeout(() => {
      checkScrollPosition();
      setScrollDirection(null);
    }, 300);
  };

  const formatPrice = (price: number) => `Rp ${(price || 0).toLocaleString("id-ID")}`;

  const handleLihatDetail = (id: number) => {
    router.push(`/layanan/layanan-preview/preview/${id}`);
  };

  if (loading) {
    return (
      <section id="services" className="bg-[#F5FBFF] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-4xl font-semibold text-[#2B5379] md:text-5xl mb-12">
            Layanan Kami
          </h2>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2B5379]"></div>
            <span className="ml-3 text-[#2B5379]">Memuat layanan...</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="bg-[#F5FBFF] py-20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-center text-4xl font-semibold text-[#2B5379] md:text-5xl">
            Layanan Kami
          </h2>
        </motion.div>

        <div className="relative">
          <AnimatePresence>
            {canScrollLeft && (
              <motion.div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#F5FBFF] to-transparent z-10" />
            )}
          </AnimatePresence>

          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#F5FBFF] to-transparent z-10" />

          <AnimatePresence>
            {canScrollLeft && (
              <motion.button
                onClick={() => scrollByCard("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 grid h-12 w-12 place-items-center rounded-full bg-white shadow-lg cursor-pointer"
              >
                <ChevronLeft className="h-6 w-6 text-[#2B5379]" />
              </motion.button>
            )}
          </AnimatePresence>

          <div
            ref={scrollerRef}
            className="flex gap-5 overflow-x-auto scroll-smooth pb-4 px-2"
            onScroll={checkScrollPosition}
          >
            {displayedServices.length === 0 ? (
              <div className="flex items-center justify-center w-full py-12">
                <p className="text-[#2B5379]/60 text-sm">
                  Belum ada layanan aktif.
                </p>
              </div>
            ) : (
              displayedServices.map((item) => {
                // 🟢 1. Cek path gambar dari API
                const rawImagePath =
                  item.coverUrl ||
                  (item as any).imageUrl ||
                  (item as any).image;

                // 🟢 2. Ubah path relatif menjadi URL absolut ke backend NestJS
                const imageSrc = getImageUrl(rawImagePath);

                return (
                  <motion.div
                    key={item.id}
                    className="flex flex-col overflow-hidden rounded-[22px] bg-[#E8F6FF] shadow-md w-[340px] shrink-0 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group"
                    initial={{
                      opacity: 0,
                      x: scrollDirection === "left" ? -50 : 50,
                    }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    {/* Gambar atas */}
                    <div className="relative h-48 w-full bg-slate-200 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#234463]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                      <img
                        src={imageSrc}
                        alt={item.nama}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          // Matikan event onerror agar tidak loop & set fallback SVG Data-URI
                          e.currentTarget.onerror = null;
                          e.currentTarget.src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300' fill='%23f1f5f9'%3E%3Crect width='400' height='300' fill='%23f1f5f9'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-family='sans-serif' font-size='14' font-weight='500'%3EGambar Tidak Tersedia%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    </div>

                    {/* Konten bawah */}
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-[18px] font-semibold text-[#234463] mb-4 line-clamp-2 leading-tight">
                        {item.nama}
                      </h3>

                      <div className="w-12 h-1 bg-[#234463] rounded-full mb-4 group-hover:w-20 transition-all duration-300" />

                      <p className="text-[14px] text-[#4B4B4B] line-clamp-2 mb-4 leading-relaxed">
                        {item.deskripsi}
                      </p>

                      <div className="space-y-3 mb-6">
                        {/* Durasi */}
                        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 flex items-center gap-3">
                          <div className="w-9 h-9 bg-[#234463] rounded-full flex items-center justify-center shrink-0">
                            <Clock className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-[12px] font-medium text-[#4B4B4B]">
                              Durasi
                            </p>
                            <p className="text-[14px] font-semibold text-[#234463]">
                              {item.durasiMenit} menit
                            </p>
                          </div>
                        </div>

                        {/* Harga */}
                        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 flex items-center gap-3">
                          <div className="w-9 h-9 bg-[#234463] rounded-full flex items-center justify-center shrink-0">
                            <Banknote className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-[12px] font-medium text-[#4B4B4B]">
                              Harga
                            </p>
                            <p className="text-[14px] font-semibold text-[#234463]">
                              {formatPrice(item.harga)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-center">
                        <button
                          type="button"
                          onClick={() => handleLihatDetail(item.id)}
                          className="inline-flex h-11 items-center justify-center rounded-full bg-[#3AB64C] px-10 text-sm font-semibold text-white hover:bg-[#2E8B3D] transition cursor-pointer"
                        >
                          Lihat Detail
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}

            {/* Lihat semua */}
            <div className="flex items-center justify-center w-[200px] shrink-0">
              <Link
                href="/layanan"
                className="flex flex-col items-center gap-3 text-[#2B5379]"
              >
                <div className="flex items-center gap-2 text-lg font-semibold">
                  Lihat Semua
                  <ArrowRight className="h-5 w-5" />
                </div>
                <p className="text-sm text-[#2B5379]/70 text-center">
                  {activeServices.length} layanan tersedia
                </p>
              </Link>
            </div>
          </div>

          <AnimatePresence>
            {canScrollRight && (
              <motion.button
                onClick={() => scrollByCard("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 grid h-12 w-12 place-items-center rounded-full bg-white shadow-lg cursor-pointer"
              >
                <ChevronRight className="h-6 w-6 text-[#2B5379]" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Geser untuk melihat layanan lainnya • {displayedServices.length} dari{" "}
          {activeServices.length} layanan ditampilkan
        </p>
      </div>
    </section>
  );
}