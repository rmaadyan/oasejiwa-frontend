'use client'

import { useState, useEffect } from "react";
import { Quote, Sparkles } from "lucide-react";

// Daftar kutipan motivasi kesehatan mental
const PSYCHOLOGY_QUOTES = [
  "Setiap langkah menuju kesadaran diri adalah langkah menuju penyembuhan.",
  "Mengenali emosi diri adalah bentuk keberanian tertinggi.",
  "Istirahat bukanlah tanda menyerah, melainkan bagian dari perjalanan memulihkan jiwa.",
  "Tidak apa-apa untuk tidak menjadi sempurna setiap hari.",
  "Perasaanmu valid. Berikan ruang untuk dirimu bernapas dan bertumbuh.",
  "Kesehatan mentalmu adalah prioritas, bukan pilihan kedua.",
  "Penyembuhan butuh waktu, dan tidak apa-apa jika prosesmu bertahap.",
  "Merawat pikiranmu sama pentingnya dengan merawat tubuhmu.",
];

export default function QuoteOfDay() {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    // Pilih quote secara acak saat komponen dimuat
    const randomIndex = Math.floor(Math.random() * PSYCHOLOGY_QUOTES.length);
    setQuote(PSYCHOLOGY_QUOTES[randomIndex]);
  }, []);

  return (
    <div className="bg-white border-2 border-slate-300 border-l-4 border-l-amber-500 rounded-2xl shadow-sm p-5 sm:p-6 relative overflow-hidden">
      <div className="flex items-start gap-3">
        <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-600 shrink-0">
          <Quote size={20} />
        </div>
        <div className="space-y-1">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1">
            <Sparkles size={12} /> Refleksi Hari Ini
          </span>
          <p className="text-xs sm:text-sm font-medium text-slate-700 italic leading-relaxed">
            "{quote || "Setiap langkah menuju kesadaran diri adalah langkah menuju penyembuhan."}"
          </p>
        </div>
      </div>
    </div>
  );
}