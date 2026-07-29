'use client'; // 👈 Tambahkan directive client component

import { useState, useEffect } from "react";
import Image from "next/image";
import StatCard from "@/components/ui/StatCard";

// Icons for Stats
const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-10 h-10"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
    />
  </svg>
);

const StarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 24 24"
    className="w-10 h-10"
  >
    <path
      fillRule="evenodd"
      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
      clipRule="evenodd"
    />
  </svg>
);

const UsersIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-10 h-10"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
    />
  </svg>
);

export default function HeroSection() {
  // State untuk menyimpan data statistik dinamis
  const [stats, setStats] = useState({
    patientsCount: "0",
    ratingCount: "0",
    psychologistsCount: "0",
  });

  useEffect(() => {
    // Ambil data statistik dari backend
    const fetchStats = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        
        // Fetch psikolog count
        const psychRes = await fetch(`${baseUrl}/admin/psychologist`, { credentials: "include" });
        const psychData = await psychRes.json();
        
        const psychCount = Array.isArray(psychData) ? psychData.length : 0;

        setStats({
          patientsCount: "50+", // Bisa dihubungkan ke endpoint Rekam Medis nantinya
          ratingCount: "30+",   // Bisa dihubungkan ke endpoint Google Maps Review
          psychologistsCount: `${psychCount}`,
        });
      } catch (err) {
        console.error("Gagal mengambil data statistik:", err);
      }
    };

    fetchStats();
  }, []);

 return (
  <section className="relative w-full">
    {/* Hero Title */}
    <div className="pt-28 pb-6 px-4 text-center max-w-4xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold animate-fade-in-up">
        <span className="text-slate-900">About </span>
        <span className="text-[#234463]">Us</span>
      </h1>
    </div>

    {/* Hero Image - DIBERI MAX-WIDTH AGAR TIDAK KELEBARAN */}
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <div className="relative w-full h-[280px] md:h-[380px] rounded-3xl overflow-hidden shadow-lg">
        <Image
          src="/assets/about-us/aboutus1.JPG"
          alt="About Us Hero"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>
    </div>

    {/* Stats Floating Card */}
    <div className="relative z-10 -mt-12 md:-mt-16 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 p-6 animate-fade-in-up">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex justify-center">
            <StatCard
              icon={<UserIcon />}
              value={stats.patientsCount}
              label="Jumlah orang terbantu"
            />
          </div>
          <div className="flex justify-center md:border-x md:border-slate-200 md:px-6">
            <StatCard 
              icon={<StarIcon />} 
              value={stats.ratingCount} 
              label="Jumlah rating" 
            />
          </div>
          <div className="flex justify-center">
            <StatCard
              icon={<UsersIcon />}
              value={stats.psychologistsCount}
              label="Jumlah psikolog"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
);
}