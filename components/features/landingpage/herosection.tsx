"use client";

import { Button } from "@/components/ui/Button";
import { loadBgheroImages } from "@/lib/imageLoader";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getGoogleReviews } from "@/lib/api/google-reviews";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Jarak minimal geser (px) supaya dianggap swipe, bukan tap biasa
const SWIPE_THRESHOLD = 50;

export default function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [googleRating, setGoogleRating] = useState<{ rating: number; total: number }>({
    rating: 4.9,
    total: 157,
  });

  // State untuk swipe/drag
  const [isPaused, setIsPaused] = useState(false);
  const dragStartX = useRef<number | null>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const loadedImages = await loadBgheroImages();
        setImages(loadedImages);
      } catch (error) {
        console.error("Error loading images:", error);
        setImages(["/landingpage/gambar2.jpg"]);
      } finally {
        setIsLoading(false);
      }
    };

    loadImages();
  }, []);

  useEffect(() => {
    async function loadGoogleStats() {
      const data = await getGoogleReviews();
      if (data) {
        setGoogleRating({
          rating: data.rating,
          total: data.totalReviews,
        });
      }
    }
    loadGoogleStats();
  }, []);

  useEffect(() => {
    if (images.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length, isPaused]);

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrev = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Pointer events menangani mouse (desktop) & touch (mobile) sekaligus
  const handlePointerDown = (e: React.PointerEvent) => {
    if (images.length <= 1) return;
    dragStartX.current = e.clientX;
    isDragging.current = true;
    setIsPaused(true);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current || dragStartX.current === null) return;

    const deltaX = e.clientX - dragStartX.current;

    if (deltaX > SWIPE_THRESHOLD) {
      goToPrev();
    } else if (deltaX < -SWIPE_THRESHOLD) {
      goToNext();
    }

    dragStartX.current = null;
    isDragging.current = false;
    // Lanjutkan auto-slide lagi setelah beberapa saat
    setTimeout(() => setIsPaused(false), 3000);
  };

  const handlePointerLeave = () => {
    if (isDragging.current) {
      dragStartX.current = null;
      isDragging.current = false;
      setTimeout(() => setIsPaused(false), 3000);
    }
  };

  if (isLoading) {
    return (
      <section id="hero" className="relative h-[60vh] sm:h-[80vh] flex items-center justify-center bg-gray-100">
        <div className="text-gray-500 font-poppins text-sm animate-pulse">Memuat Beranda...</div>
      </section>
    );
  }

  return (
    // Gunakan h-[80vh] min-h-[500px] alih-alih min-h-screen agar tidak gepeng saat zoom
    <section id="hero" className="relative h-[75vh] sm:h-[85vh] min-h-[500px] max-h-[800px] w-full flex items-center justify-center overflow-hidden font-poppins">
      
      {/* Background Images */}
      <div
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing touch-pan-y select-none"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${image})` }}
            />
          </div>
        ))}

        {/* Gradient Top & Bottom */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-black/25 pointer-events-none" />
      </div>

      {/* Content Container - Diberi max-w-5xl agar proporsional */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-10">
        <h1
          className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight"
          style={{
            textShadow: '0 3px 10px rgba(0,0,0,0.5), 0 6px 20px rgba(0,0,0,0.3)'
          }}
        >
          Kenali Dirimu,
          <br />
          Pulihkan Jiwamu
        </h1>
        
        <p
          className="text-sm sm:text-lg lg:text-xl text-white/95 mb-8 max-w-2xl mx-auto leading-relaxed"
          style={{
            textShadow: '0 2px 8px rgba(0,0,0,0.5)'
          }}
        >
          Layanan psikologi profesional untuk membantu Anda menemukan
          keseimbangan hidup dan kesehatan mental yang optimal.
        </p>

        <div className="flex gap-3 sm:gap-4 justify-center flex-wrap">
          <Link href="#services">
            <Button
              size="lg"
              className="bg-black/30 backdrop-blur-md text-white border border-white/80 hover:bg-white hover:text-slate-900 transition-all shadow-md text-xs sm:text-sm px-6 py-2.5 rounded-xl"
            >
              Lihat Layanan
            </Button>
          </Link>
          <Link href="https://wa.me/6281313888830" target="_blank">
            <Button
              size="lg"
              className="bg-black/30 backdrop-blur-md text-white border border-white/80 hover:bg-white hover:text-slate-900 transition-all shadow-md text-xs sm:text-sm px-6 py-2.5 rounded-xl"
            >
              Hubungi Kami
            </Button>
          </Link>
        </div>
      </div>

      {/* Prev / Next arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={() => {
              goToPrev();
              setIsPaused(true);
              setTimeout(() => setIsPaused(false), 3000);
            }}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-md text-white border border-white/50 hover:bg-white hover:text-slate-900 transition-all"
            aria-label="Gambar sebelumnya"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              goToNext();
              setIsPaused(true);
              setTimeout(() => setIsPaused(false), 3000);
            }}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-md text-white border border-white/50 hover:bg-white hover:text-slate-900 transition-all"
            aria-label="Gambar berikutnya"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Image indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentImageIndex(index);
                setIsPaused(true);
                setTimeout(() => setIsPaused(false), 3000);
              }}
              className={`h-2 rounded-full transition-all ${
                index === currentImageIndex
                  ? "bg-white w-8"
                  : "bg-white/50 w-2 hover:bg-white/75"
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}