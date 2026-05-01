"use client";

import { testimonials, type TestimonialItem } from "@/lib/testimonials";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, User, UserRound } from "lucide-react";
import { useRef } from "react";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < rating;

        return (
          <Star
            key={i}
            className={
              filled
                ? "h-4 w-4 text-[#E7A14A]"
                : "h-4 w-4 text-[#E7A14A]/30"
            }
            fill={filled ? "#E7A14A" : "transparent"}
          />
        );
      })}
    </div>
  );
}

// Component untuk Gender Icon
function GenderIcon({ gender }: { gender: "male" | "female" }) {
  const isMale = gender === "male";

  return (
    <div
      className={`
        flex h-20 w-20 items-center justify-center rounded-full
        ${
          isMale
            ? "bg-linear-to-br from-blue-400 to-blue-600"
            : "bg-linear-to-br from-pink-400 to-pink-600"
        }
        shadow-lg ring-4 ring-white
      `}
    >
      {isMale ? (
        <User className="h-9 w-9 text-white" strokeWidth={2.5} />
      ) : (
        <UserRound className="h-9 w-9 text-white" strokeWidth={2.5} />
      )}
    </div>
  );
}

export default function TestimonialsSection() {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const scrollByCard = (dir: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;

    const card = el.querySelector<HTMLElement>("[data-card]");
    const amount = (card?.offsetWidth ?? 390) + 24;

    el.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <motion.section
      id="testimonials"
      className="bg-[#F5FBFF] py-20"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: false }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex items-center justify-between gap-6">
          <div className="w-full text-center">
            <h2 className="text-4xl font-semibold text-primary-text md:text-5xl">
              Testimoni
            </h2>
            <p className="mt-3 text-sm text-slate-500">
              Beberapa ulasan dari pengguna layanan Oase Jiwa.
            </p>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <button
              type="button"
              onClick={() => scrollByCard("left")}
              className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white shadow-sm transition hover:bg-slate-50"
              aria-label="Geser kiri"
            >
              <ChevronLeft className="h-5 w-5 text-primary-text" />
            </button>

            <button
              type="button"
              onClick={() => scrollByCard("right")}
              className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white shadow-sm transition hover:bg-slate-50"
              aria-label="Geser kanan"
            >
              <ChevronRight className="h-5 w-5 text-primary-text" />
            </button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-8 pt-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {testimonials.map((t: TestimonialItem) => (
            <article
              key={t.id}
              data-card
              className="relative flex w-[330px] shrink-0 snap-start pt-10 sm:w-[370px] lg:w-[390px]"
            >
              <div className="relative flex min-h-[340px] w-full flex-col rounded-3xl border border-[#D1EAFF]/40 bg-[#D1EAFF] px-7 pb-8 pt-16 shadow-sm">
                {/* Gender Icon */}
                <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                  {t.gender && <GenderIcon gender={t.gender} />}
                </div>

                {/* Header */}
                <div className="text-center">
                  <h3 className="text-xl font-semibold leading-tight text-primary-text">
                    {t.name}
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">{t.role}</p>
                </div>

                {/* Content */}
                <div className="mt-6 flex flex-1 items-center">
                  <p className="w-full text-center text-sm leading-7 text-slate-700">
                    “{t.content}”
                  </p>
                </div>

                {/* Footer */}
                <div className="mt-6">
                  <Stars rating={t.rating} />

                  {t.source && (
                    <p className="mt-4 text-center text-xs text-slate-500">
                      Sumber: {t.source}
                    </p>
                  )}
                </div>
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