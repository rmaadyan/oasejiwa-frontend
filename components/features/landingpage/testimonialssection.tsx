"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, ExternalLink } from "lucide-react";
import { getGoogleReviews, type GoogleReviewsData, type GoogleReview } from "@/lib/api/google-reviews";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center justify-center gap-1.5">
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

// Icon Google
function GoogleIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.13C3.26 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.22c-.25-.72-.38-1.49-.38-2.22s.13-1.5.38-2.22V6.65H1.29C.47 8.27 0 10.08 0 12s.47 3.73 1.29 5.35l3.99-3.13z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.65l3.99 3.13c.95-2.85 3.6-4.96 6.72-4.96z"
      />
    </svg>
  );
}

export function getInitials(name: string): string {
  if (!name || !name.trim()) return "G";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  if (parts.length === 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  // Up to 3 parts initials: "Dicky C. Anggoro" -> "DCA", "Gilang Muhammad Faqih" -> "GMF"
  const rawInitials = (parts[0][0] + parts[1][0] + parts[2][0]).toUpperCase();
  return rawInitials.replace(/[^A-Z0-9]/g, "");
}

export function ReviewerAvatar({
  photoUrl,
  name,
  sizeClass = "w-16 h-16 text-lg border-4",
}: {
  photoUrl?: string;
  name: string;
  sizeClass?: string;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className={`rounded-full bg-[#234463] border-white text-white font-bold flex items-center justify-center shadow-md overflow-hidden shrink-0 ${sizeClass}`}
    >
      {photoUrl && !imgError ? (
        <img
          src={photoUrl}
          alt={name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="font-bold text-white tracking-wider">{getInitials(name)}</span>
      )}
    </div>
  );
}

const FALLBACK_DATA: GoogleReviewsData = {
  businessName: "Biro Psikologi Oase Jiwa",
  rating: 4.9,
  totalReviews: 157,
  googleMapsUrl: "https://maps.google.com/?q=Biro+Psikologi+Oase+Jiwa",
  reviews: [
    {
      id: "rev-1",
      author: "Dicky C. Anggoro",
      rating: 5,
      text: "Great experience, konseling profesional dan tempatnya sangat mendukung untuk relaksasi.",
      photoUrl: undefined,
      relativeTime: "8 bulan lalu",
    },
    {
      id: "rev-2",
      author: "Gilang Muhammad Faqih",
      rating: 5,
      text: "Tempatnya enak santai, nyaman dan bersih. Pendampingannya pun enak dan asik. Sukses teruss 😁",
      photoUrl: undefined,
      relativeTime: "8 bulan lalu",
    },
    {
      id: "rev-3",
      author: "Hana Bilqisty",
      rating: 5,
      text: "Mashallah, very helpful, the location is also close to the UMM campus 🤩",
      photoUrl: undefined,
      relativeTime: "9 bulan lalu",
    },
    {
      id: "rev-4",
      author: "ZuLvya R.",
      rating: 5,
      text: "Konseling di sini nyaman banget. Psikolognya ramah dan komunikatif. Untuk biayanya juga masih tergolong aman, tidak menguras dompet.",
      photoUrl: undefined,
      relativeTime: "2 minggu lalu",
    },
    {
      id: "rev-5",
      author: "Aditya P.",
      rating: 5,
      text: "Tempatnya nyaman, sangat berkualitas untuk konsultasi terkait diri sendiri, dan ditangani oleh ahlinya.",
      photoUrl: undefined,
      relativeTime: "1 bulan lalu",
    },
    {
      id: "rev-6",
      author: "Nur Avia A. J.",
      rating: 5,
      text: "Nyaman dan helpful sekali. Bintang 5 untuk pelayanannya. Psikolognya juga sangat membantu.",
      photoUrl: undefined,
      relativeTime: "2 bulan lalu",
    },
  ],
  lastSyncedAt: new Date().toISOString(),
  isFromCache: true,
  status: "Data disinkronkan dari Google Maps",
};

export default function TestimonialsSection() {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [data, setData] = useState<GoogleReviewsData>(FALLBACK_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReviews() {
      const apiData = await getGoogleReviews();
      if (apiData && apiData.reviews && apiData.reviews.length > 0) {
        setData(apiData);
      }
      setLoading(false);
    }
    loadReviews();
  }, []);

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
        {/* Header Section */}
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-1.5 shadow-xs mb-3">
            <GoogleIcon />
            <span className="text-xs font-semibold text-[#234463]">
              Official Google Reviews ({data.rating.toFixed(1)} ★ | {data.totalReviews}+ Ulasan)
            </span>
          </div>

          <h2 className="text-4xl font-semibold text-primary-text md:text-5xl">
            Testimoni Klien
          </h2>
          <p className="mt-3 text-sm text-slate-500 max-w-2xl">
            Ulasan asli langsung dari pengguna layanan Oase Jiwa di Google Maps.
          </p>

          <div className="mt-4 flex items-center justify-center gap-3">
            <a
              href={data.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-[#234463] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#1b354d] transition"
            >
              <GoogleIcon />
              <span>Lihat Semua Review di Google Maps</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Scroll Control Buttons */}
        <div className="mb-6 flex justify-end">
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

        {/* Testimonials List */}
        <div
          ref={scrollerRef}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-8 pt-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {data.reviews.map((t: GoogleReview, index: number) => (
            <article
              key={t.id || index}
              data-card
              className="relative flex w-[330px] shrink-0 snap-start pt-8 sm:w-[370px] lg:w-[390px]"
            >
              <div className="relative flex min-h-[340px] w-full flex-col rounded-3xl border border-[#D1EAFF]/60 bg-white px-7 pb-8 pt-12 shadow-sm transition hover:shadow-md">
                {/* Author Avatar / Badge */}
                <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                  <ReviewerAvatar photoUrl={t.photoUrl} name={t.author} />
                </div>

                {/* Header */}
                <div className="text-center mt-2">
                  <h3 className="text-lg font-bold leading-tight text-primary-text">
                    {t.author}
                  </h3>

                  <div className="mt-1 flex items-center justify-center gap-1">
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-[#234463]">
                      <GoogleIcon /> Google Review
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="mt-5 flex flex-1 items-center">
                  <p className="w-full text-center text-xs leading-relaxed text-slate-700 italic">
                    “{t.text}”
                  </p>
                </div>

                {/* Footer */}
                <div className="mt-6 border-t border-slate-100 pt-4 text-center space-y-1.5">
                  <Stars rating={t.rating} />

                  <p className="text-[11px] text-slate-400">
                    {t.relativeTime || "Ulasan terverifikasi Google"}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-2 text-center text-xs text-slate-500 md:hidden">
          Geser ke kiri/kanan untuk melihat testimoni lainnya.
        </p>
      </div>
    </motion.section>
  );
}