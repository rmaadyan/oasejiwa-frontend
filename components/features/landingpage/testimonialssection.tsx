"use client";

import Image from "next/image";
import { useMemo, useRef } from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { testimonials } from "../../../lib/data";
import { bgTestimoniImages } from "../../../lib/imageLoader";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="mt-5 flex items-center justify-center gap-2">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < rating;
        return (
          <Star
            key={i}
            className={filled ? "h-4 w-4 text-[#E7A14A]" : "h-4 w-4 text-[#E7A14A]/30"}
            fill={filled ? "#E7A14A" : "transparent"}
          />
        );
      })}
    </div>
  );
}

export default function TestimonialsSection() {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const items = useMemo(() => {
    return testimonials.map((t: any, idx: number) => ({
      ...t,
      avatar: bgTestimoniImages[idx % bgTestimoniImages.length],
    }));
  }, []);

  const scrollByCard = (dir: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const amount = (card?.offsetWidth ?? 360) + 24;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <motion.section 
      id="testimonials" 
      className="bg-[#F5FBFF] py-20"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="mx-auto max-w-7xl px-2 sm:px-3 lg:px-4">
        <div className="mb-10 flex items-center justify-between gap-6">
          <h2 className="text-center text-4xl font-semibold text-primary-text md:text-5xl w-full">
            Testimoni
          </h2>

          <div className="hidden md:flex items-center gap-3">
            <button
              type="button"
              onClick={() => scrollByCard("left")}
              className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white shadow-sm hover:bg-slate-50"
              aria-label="Geser kiri"
            >
              <ChevronLeft className="h-5 w-5 text-primary-text" />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard("right")}
              className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white shadow-sm hover:bg-slate-50"
              aria-label="Geser kanan"
            >
              <ChevronRight className="h-5 w-5 text-primary-text" />
            </button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="flex gap-6 overflow-x-auto pb-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth snap-x snap-mandatory"
        >
          {items.map((t: any) => (
            <article
              key={t.id}
              data-card
              className={[
                "relative shrink-0 snap-start",
                "w-full sm:max-w-xs lg:max-w-sm",
                "pt-10", // ruang untuk avatar yang nyembul
              ].join(" ")}
            >
              {/* Card */}
              <div className="relative rounded-3xl bg-[#D1EAFF] px-7 pb-8 pt-14 border border-[#D1EAFF]/30">
                {/* Avatar bubble */}
                <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                  <div className="relative h-16 w-16 rounded-full bg-white ring-4 ring-white overflow-hidden border border-[#D1EAFF]">
                    <Image
                      src={t.avatar}
                      alt={t.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                </div>

                <h3 className="text-center text-xl font-semibold text-primary-text">
                  {t.name}
                </h3>
                <p className="mt-1 text-center text-sm text-slate-500">{t.role}</p>

                <p className="mt-5 text-center text-sm leading-relaxed text-slate-700">
                  “{t.content}”
                </p>

                <Stars rating={t.rating} />
              </div>
            </article>
          ))}
        </div>

        <p className="mt-2 text-center text-sm text-slate-500 md:hidden">
          Geser ke kiri/kanan untuk melihat testimoni lainnya.
        </p>
      </div>
    </motion.section>
  );
}
