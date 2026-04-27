"use client";

import Image from "next/image";
import { useMemo, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, useAnimationControls } from "framer-motion";
import { services } from "@/lib/services";
import { bgServiceImages } from "@/lib/imageLoader";

export default function ServicesSection() {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const controls = useAnimationControls();

  const items = useMemo(() => {
    const mapped = services.map((s, idx) => ({
      ...s,
      image: bgServiceImages[idx % bgServiceImages.length],
    }));
    // Duplicate items untuk infinite scroll seamless
    return [...mapped, ...mapped];
  }, []);

  // Start infinite scroll animation
  const startAnimation = () => {
    const cardWidth = 340 + 24; // card width + gap
    const totalWidth = cardWidth * (services.length);

    controls.start({
      x: -totalWidth,
      transition: {
        duration: 30, // 30 detik untuk 1 loop
        ease: "linear",
        repeat: Infinity,
      },
    });
  };

  // Stop animation
  const stopAnimation = () => {
    controls.stop();
  };

  const scrollByCard = (dir: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -364 : 364, behavior: "smooth" });
  };

  return (
    <section id="services" className="bg-[#F5FBFF] py-20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-12 flex items-center justify-between gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="w-full text-center text-4xl font-semibold text-primary-text md:text-5xl">
            Layanan Kami
          </h2>

          {/* Navigation Buttons */}
          <div className="hidden items-center gap-3 md:flex">
            <button
              type="button"
              onClick={() => scrollByCard("left")}
              className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white hover:bg-slate-50"
              aria-label="Geser kiri"
            >
              <ChevronLeft className="h-5 w-5 text-primary-text" />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard("right")}
              className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white hover:bg-slate-50"
              aria-label="Geser kanan"
            >
              <ChevronRight className="h-5 w-5 text-primary-text" />
            </button>
          </div>
        </motion.div>

        {/* Cards Slider dengan Infinite Auto-scroll */}
        <div
          ref={scrollerRef}
          className="overflow-hidden"
          onMouseEnter={stopAnimation}
          onMouseLeave={startAnimation}
        >
          <motion.div
            className="flex gap-6"
            animate={controls}
            onViewportEnter={startAnimation}
          >
            {items.map((item, index) => (
              <article
                key={`${item.id}-${index}`}
                className="relative h-80 w-56 sm:w-64 lg:w-72 shrink-0 overflow-hidden rounded-3xl"
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="340px"
                    priority={false}
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />
                </div>

                {/* Content Overlay - FIXED HEIGHT untuk ukuran sama */}
                <div className="absolute inset-x-6 bottom-6 h-60 flex flex-col rounded-2xl bg-[#D1EAFF] px-6 py-6">
                  <h3 className="text-center text-lg font-semibold text-primary-text leading-tight">
                    {item.name}
                  </h3>

                  {/* Deskripsi dengan scrollable jika terlalu panjang */}
                  <div className="mt-3 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300">
                    <p className="text-center text-xs leading-relaxed text-[#2B5379]">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4 flex justify-center">
                    <a
                      href="https://wa.me/6281313888830"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-10 items-center justify-center rounded-full bg-[#3AB64C] px-8 text-sm font-medium text-white hover:opacity-95 transition-colors"
                    >
                      Booking
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </motion.div>
        </div>

        {/* Mobile Hint */}
        <p className="mt-6 text-center text-sm text-slate-500">
          Geser untuk melihat layanan lainnya • Auto-scroll aktif
        </p>
      </div>
    </section>
  );
}
