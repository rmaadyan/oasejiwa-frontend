"use client";

import { Button } from "@/components/ui/Button";
import { loadBgheroImages } from "@/lib/imageLoader";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getGoogleReviews } from "@/lib/api/google-reviews";

export default function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [googleRating, setGoogleRating] = useState<{ rating: number; total: number }>({
    rating: 4.9,
    total: 157,
  });

  useEffect(() => {
    const loadImages = async () => {
      try {
        const loadedImages = await loadBgheroImages();
        setImages(loadedImages);
      } catch (error) {
        console.error("Error loading images:", error);
        setImages(["/landingpage/gambar.jpg"]);
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
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

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
      <div className="absolute inset-0 w-full h-full">
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

      {/* Image indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
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