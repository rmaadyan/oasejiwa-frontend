'use client'

import React from 'react';

interface HeroBannerProps {
  profileComplete: boolean;
}

export default function HeroBanner({ profileComplete }: HeroBannerProps) {
  return (
    <div className="mb-6 animate-fade-in opacity-90">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#234463] to-[#3B6E9B] p-8 md:p-10">
        {/* Subtle decorative circles */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
        
        {/* Content */}
        <div className="relative z-10">
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-2">
            ✨ Sempurna Profil Anda
          </h2>
          <p className="text-slate-100 text-sm md:text-base leading-relaxed">
            {profileComplete 
              ? 'Profil Anda sudah lengkap. Anda siap untuk memulai booking konsultasi dengan psikolog profesional kami.'
              : 'Lengkapi data profil Anda agar proses booking menjadi lebih cepat dan mudah. Informasi lengkap membantu kami memberikan layanan terbaik.'
            }
          </p>
        </div>
      </div>
    </div>
  );
}
