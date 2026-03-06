"use client";

import type { Psychologist } from "@/lib/types/psychologist";

interface WelcomeCardProps {
  psychologist: Psychologist;
  nextSessionTime?: string;
}

export default function WelcomeCard({ psychologist, nextSessionTime }: WelcomeCardProps) {
  const getCurrentGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Selamat Pagi";
    if (hour < 15) return "Selamat Siang";
    if (hour < 18) return "Selamat Sore";
    return "Selamat Malam";
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-[#D1EAFF] rounded-xl p-6">
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-1 text-[#2B5379]">
          {getCurrentGreeting()}, {psychologist.name.split(' ')[1]}! 👋
        </h1>
        <p className="text-[#2B5379]/70 mb-4">
          Semangat untuk membantu pasien hari ini
        </p>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-[#2B5379]">
          <div>
            {getCurrentDate()}
          </div>
          {nextSessionTime && (
            <div className="px-3 py-1 bg-[#2B5379]/10 rounded-lg">
              Sesi berikutnya: {nextSessionTime}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
