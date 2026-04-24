"use client";

import type { LayananItem } from "@/components/features/manajemen-layanan/types";
import { INITIAL_LAYANAN } from "@/components/features/manajemen-layanan/dataDummy";
import { bgServiceImages } from "@/lib/imageLoader";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Banknote,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

const STORAGE_KEY = "layanan-list";

export default function ServicesSection() {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const [services, setServices] = useState<LayananItem[]>([]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollDirection, setScrollDirection] = useState<
    "left" | "right" | null
  >(null);

  /* ===============================
     LOAD DATA DARI LOCAL STORAGE
  =============================== */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const raw = localStorage.getItem(STORAGE_KEY);

    if (raw) {
      try {
        const parsed: LayananItem[] = JSON.parse(raw);
        setServices(parsed);
      } catch {
        setServices(INITIAL_LAYANAN);
      }
    } else {
      setServices(INITIAL_LAYANAN);
    }
  }, []);

  /* ===============================
     FILTER LAYANAN AKTIF
  =============================== */
  const activeServices = services.filter((item) => item.status === "Aktif");

  const displayedServices = activeServices.slice(0, 5);

  const items = useMemo(
    () =>
      displayedServices.map((s, idx) => ({
        ...s,
        image: s.coverUrl || bgServiceImages[idx % bgServiceImages.length],
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

    const scrollAmount = 420;

    el.scrollBy({
      left: dir === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });

    setTimeout(() => {
      checkScrollPosition();
      setScrollDirection(null);
    }, 300);
  };

  const formatDuration = (minutes: number) => {
    if (!minutes) return "-";
    return `${minutes} menit`;
  };

  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString("id-ID")}`;
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
        >
          <h2 className="text-center text-4xl font-semibold text-[#2B5379] md:text-5xl">
            Layanan Kami
          </h2>
        </motion.div>

        <div className="relative">

          <AnimatePresence>
            {canScrollLeft && (
              <motion.div
                className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#F5FBFF] to-transparent z-10"
              />
            )}
          </AnimatePresence>

          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#F5FBFF] to-transparent z-10" />

          <AnimatePresence>
            {canScrollLeft && (
              <motion.button
                onClick={() => scrollByCard("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 grid h-12 w-12 place-items-center rounded-full bg-white shadow-lg"
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
            {items.map((item) => (
              <motion.article
                key={item.id}
                className="relative h-[500px] w-[400px] shrink-0 overflow-hidden rounded-3xl shadow-xl"
                initial={{ opacity: 0, x: scrollDirection === "left" ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="absolute inset-0">
                  <Image
                    src={item.image}
                    alt={item.nama}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                </div>

                <div className="absolute bottom-0 inset-x-0 p-6">
                  <div className="rounded-2xl bg-[#D1EAFF]/95 px-6 py-6">

                    <h3 className="text-center text-xl font-bold text-[#2B5379] mb-3">
                      {item.nama}
                    </h3>

                    <div className="flex justify-center gap-4 mb-4">

                      <div className="flex items-center gap-1 text-[#2B5379] text-xs">
                        <Clock className="h-4 w-4" />
                        {formatDuration(item.durasiMenit)}
                      </div>

                      <div className="h-4 w-px bg-[#2B5379]/30" />

                      <div className="flex items-center gap-1 text-[#2B5379] text-xs font-semibold">
                        <Banknote className="h-4 w-4" />
                        {formatPrice(item.harga)}
                      </div>

                    </div>

                    <p className="text-center text-xs text-[#2B5379] mb-4">
                      {item.deskripsi}
                    </p>

                    <div className="flex justify-center">
                      <a
                        href="https://wa.me/6281313888830"
                        target="_blank"
                        className="inline-flex h-11 items-center justify-center rounded-full bg-[#3AB64C] px-10 text-sm font-semibold text-white"
                      >
                        Booking
                      </a>
                    </div>

                  </div>
                </div>
              </motion.article>
            ))}

            <div className="flex items-center justify-center w-[400px] shrink-0">
              <Link
                href="/layanan"
                className="flex flex-col items-center gap-3 text-[#2B5379]"
              >
                <div className="flex items-center gap-2 text-xl font-semibold">
                  Lihat Semua Layanan
                  <ArrowRight className="h-6 w-6" />
                </div>
                <p className="text-sm text-[#2B5379]/70">
                  {activeServices.length} layanan tersedia
                </p>
              </Link>
            </div>
          </div>

          <AnimatePresence>
            {canScrollRight && (
              <motion.button
                onClick={() => scrollByCard("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 grid h-12 w-12 place-items-center rounded-full bg-white shadow-lg"
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