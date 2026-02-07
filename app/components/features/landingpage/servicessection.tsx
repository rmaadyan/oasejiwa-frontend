"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useMemo, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, Clock, Banknote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { LayananItem } from "@/components/features/manajemen-layanan/types";
import { INITIAL_LAYANAN } from "@/components/features/manajemen-layanan/dataDummy";
import { bgServiceImages } from "@/lib/imageLoader";

const STORAGE_KEY = "layanan-list";

const formatDuration = (layanan: LayananItem): string => {
  if (!layanan.durasiMenit) return "-";
  return `${layanan.durasiMenit} menit`;
};

const formatPrice = (layanan: LayananItem): string => {
  if (layanan.harga === undefined || layanan.harga === null) {
    return "Hubungi Kami";
  }
  return `Rp ${layanan.harga.toLocaleString("id-ID")}`;
};

export default function ServicesSection() {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollDirection, setScrollDirection] = useState<"left" | "right" | null>(null);

  const [layananList, setLayananList] = useState<LayananItem[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let list: LayananItem[] = INITIAL_LAYANAN;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed: LayananItem[] = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          list = parsed;
        }
      } catch {
      }
    }
    setLayananList(list);
  }, []);

  const displayedServices = useMemo(
    () => layananList.slice(0, 5),
    [layananList]
  );

  const items = useMemo(
    () =>
      displayedServices.map((l, idx) => ({
        ...l,
        image: l.coverUrl || bgServiceImages[idx % bgServiceImages.length],
      })),
    [displayedServices]
  );

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

    const scrollAmount = 420; // card width (400) + gap (20)
    el.scrollBy({
      left: dir === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });

    setTimeout(() => {
      checkScrollPosition();
      setScrollDirection(null);
    }, 300);
  };

  return (
    <section id="services" className="bg-[#F5FBFF] py-20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false }}
        >
          <h2 className="text-center text-4xl font-semibold text-[#2B5379] md:text-5xl">
            Layanan Kami
          </h2>
        </motion.div>

        {/* Cards Container dengan Navigation */}
        <div className="relative">
          {/* Gradient Fade Kiri */}
          <AnimatePresence>
            {canScrollLeft && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute left-0 top-0 bottom-0 w-24 bg-linear-to-r from-[#F5FBFF] to-transparent z-10 pointer-events-none"
              />
            )}
          </AnimatePresence>

          {/* Gradient Fade Kanan */}
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-linear-to-l from-[#F5FBFF] to-transparent z-10 pointer-events-none" />

          {/* Left Arrow */}
          <AnimatePresence>
            {canScrollLeft && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                type="button"
                onClick={() => scrollByCard("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 grid h-12 w-12 place-items-center rounded-full bg-white shadow-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                aria-label="Geser kiri"
              >
                <ChevronLeft className="h-6 w-6 text-[#2B5379]" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Cards Slider */}
          <div
            ref={scrollerRef}
            className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth pb-4 px-2"
            onScroll={checkScrollPosition}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <AnimatePresence mode="sync">
              {items.map((item, index) => (
                <motion.article
                  key={item.id}
                  className="relative h-130 w-100 shrink-0 overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-shadow"
                  initial={{ opacity: 0, x: scrollDirection === "left" ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: scrollDirection ? 0 : index * 0.1,
                    ease: "easeOut",
                  }}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <Image
                      src={item.image}
                      alt={item.nama}
                      fill
                      className="object-cover"
                      sizes="400px"
                      priority={index < 3}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />
                  </div>

                  {/* Content Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <div className="rounded-2xl bg-[#D1EAFF]/95 backdrop-blur-sm px-6 py-6">
                      <h3 className="text-center text-xl font-bold text-[#2B5379] leading-tight mb-3">
                        {item.nama}
                      </h3>

                      {/* Durasi & Harga */}
                      <div className="flex items-center justify-center gap-4 mb-4">
                        {/* Durasi */}
                        <div className="flex items-center gap-1.5 text-[#2B5379]">
                          <Clock className="h-4 w-4" />
                          <span className="text-xs font-medium">
                            {formatDuration(item)}
                          </span>
                        </div>

                        {/* Separator */}
                        <div className="h-4 w-px bg-[#2B5379]/30" />

                        {/* Harga */}
                        <div className="flex items-center gap-1.5 text-[#2B5379]">
                          <Banknote className="h-4 w-4" />
                          <span className="text-xs font-semibold">
                            {formatPrice(item)}
                          </span>
                        </div>
                      </div>

                      {/* Tombol detail */}
                      <div className="flex justify-center">
                        <Link
                          href={`/layanan/${item.id}`}
                          className="inline-flex h-11 items-center justify-center rounded-full bg-[#3AB64C] px-10 text-sm font-semibold text-white hover:bg-[#329A42] transition-colors shadow-md"
                        >
                          Lihat Detail
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>

            {/* Card 'Lihat semua layanan' */}
            <motion.div
              className="flex items-center justify-center w-100 shrink-0"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: items.length * 0.1 }}
            >
              <Link
                href="/layanan"
                className="group flex flex-col items-center gap-4 text-[#2B5379] hover:text-[#1E3A5F] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl font-semibold">Lihat Semua Layanan</span>
                  <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-base text-center text-[#2B5379]/70">
                  {layananList.length} layanan tersedia
                </p>
              </Link>
            </motion.div>
          </div>

          {/* Right Arrow */}
          <AnimatePresence>
            {canScrollRight && (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                type="button"
                onClick={() => scrollByCard("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 grid h-12 w-12 place-items-center rounded-full bg-white shadow-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                aria-label="Geser kanan"
              >
                <ChevronRight className="h-6 w-6 text-[#2B5379]" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile hint */}
        <p className="mt-6 text-center text-sm text-slate-500">
          Geser untuk melihat layanan lainnya • {displayedServices.length} dari {layananList.length} layanan ditampilkan
        </p>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
