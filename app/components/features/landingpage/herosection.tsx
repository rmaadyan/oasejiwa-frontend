"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { loadBgheroImages } from "@/lib/imageLoader";

export default function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const loadedImages = await loadBgheroImages();
        setImages(loadedImages);
      } catch (error) {
        console.error("Error loading images:", error);
        setImages(["/bghero/gambar.jpg"]);
      } finally {
        setIsLoading(false);
      }
    };

    loadImages();
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
      <section id="hero" className="relative min-h-screen flex items-center justify-center bg-gray-200">
        <div className="text-gray-600 font-poppins">Loading...</div>
      </section>
    );
  }

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden font-poppins">
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

        {/* Dark gradient at top */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-linear-to-b from-black/50 to-transparent pointer-events-none" />

        {/* White gradient at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-white to-transparent pointer-events-none" />
        
        {/* Overlay gelap samar untuk kontras teks */}
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-2 sm:px-3 lg:px-4 text-center">
        <h1 
          className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
          style={{
            textShadow: '0 3px 10px rgba(0,0,0,0.4), 0 6px 20px rgba(0,0,0,0.3), 0 10px 40px rgba(0,0,0,0.2)'
          }}
        >
          Kenali Dirimu,
          <br />
          Pulihkan Jiwamu
        </h1>
        <p 
          className="text-lg md:text-xl text-white mb-10 max-w-2xl mx-auto"
          style={{
            textShadow: '0 2px 8px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3)'
          }}
        >
          Layanan psikologi profesional untuk membantu Anda menemukan
          keseimbangan hidup dan kesehatan mental yang optimal.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="#services">
            <Button
              size="lg"
              className="bg-black/20 backdrop-blur-sm text-white border-2 border-white hover:bg-black/30 transition-all shadow-lg"
            >
              Lihat Layanan
            </Button>
          </Link>
          <Link href="https://wa.me/6281313888830" target="_blank">
            <Button
              size="lg"
              className="bg-black/20 backdrop-blur-sm text-white border-2 border-white hover:bg-black/30 transition-all shadow-lg"
            >
              Hubungi Kami
            </Button>
          </Link>
        </div>
      </div>

      {/* Image indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
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
