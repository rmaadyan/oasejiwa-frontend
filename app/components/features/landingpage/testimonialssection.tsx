"use client";

import { useMemo, useRef, useState } from "react";
import { Star, User, UserRound, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { testimonials } from "@/lib/data/data";

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

// Icon 2D flat tanpa gradient
function GenderIcon({ gender }: { gender: "male" | "female" }) {
  const isMale = gender === "male";
  return (
    <div
      className={`h-16 w-16 rounded-full flex items-center justify-center ring-4 ring-white
        ${isMale ? "bg-blue-400" : "bg-pink-400"}`}
    >
      {isMale ? (
        <User className="h-8 w-8 text-white" strokeWidth={2} />
      ) : (
        <UserRound className="h-8 w-8 text-white" strokeWidth={2} />
      )}
    </div>
  );
}

export default function TestimonialsSection() {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const items = useMemo(() =>
    testimonials.map((t: typeof testimonials[0]) => ({ ...t })),
    []
  );

  const checkScrollPosition = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const scrollByCard = (dir: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const amount = (card?.offsetWidth ?? 360) + 24;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
    setTimeout(checkScrollPosition, 300);
  };

  return (
    <motion.section
      id="testimonials"
      className="bg-[#F5FBFF] py-20 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: false }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-center text-4xl font-semibold text-primary-text md:text-5xl">
            Testimoni
          </h2>
        </div>

        {/* Cards Container dengan Navigation di samping */}
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
                <ChevronLeft className="h-6 w-6 text-primary-text" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Cards Slider */}
          <div
            ref={scrollerRef}
            className="flex gap-6 overflow-x-auto pb-6 scroll-smooth snap-x snap-mandatory px-2"
            onScroll={checkScrollPosition}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {items.map((t: typeof items[0]) => (
              <article
                key={t.id}
                data-card
                className="relative shrink-0 snap-start w-full sm:max-w-xs lg:max-w-sm pt-10"
              >
                {/* Card */}
                <div className="relative rounded-3xl bg-[#D1EAFF] px-7 pb-8 pt-14 border border-[#D1EAFF]/30">
                  {/* Gender Icon */}
                  <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                    {t.gender && <GenderIcon gender={t.gender} />}
                  </div>

                  <h3 className="text-center text-xl font-semibold text-primary-text">
                    {t.name}
                  </h3>
                  <p className="mt-1 text-center text-sm text-slate-500">{t.role}</p>

                  <p className="mt-5 text-center text-sm leading-relaxed text-slate-700">
                    "{t.content}"
                  </p>

                  <Stars rating={t.rating} />
                </div>
              </article>
            ))}
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
                <ChevronRight className="h-6 w-6 text-primary-text" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile hint */}
        <p className="mt-6 text-center text-sm text-slate-500 md:hidden">
          Geser ke kiri/kanan untuk melihat testimoni lainnya.
        </p>
      </div>
    </motion.section>
  );
}
