"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Calendar,
  FileText,
  Brain,
  Sparkles,
  ShieldCheck,
  Award,
  Clock,
  UserCheck,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import type { Psychologist } from "@/lib/types/psychologist";

interface WelcomeBannerProps {
  psychologist: Psychologist;
}

export default function WelcomeBanner({ psychologist }: WelcomeBannerProps) {
  const router = useRouter();

  // Dynamic Name
  const fullName =
    psychologist.name ||
    (psychologist as any).fullName ||
    "Psikolog OaseJiwa";

  const fullGreeting = `Selamat Datang, ${fullName}`;

  // Typing Effect State
  const [typedText, setTypedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    let index = 0;
    setTypedText("");
    setIsTypingComplete(false);

    const interval = setInterval(() => {
      if (index < fullGreeting.length) {
        setTypedText(fullGreeting.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setIsTypingComplete(true);
      }
    }, 55);

    return () => clearInterval(interval);
  }, [fullGreeting]);

  // 🟢 1. Spesialisasi: Ambil yang pertama diisi oleh psikolog
  const primarySpec =
    (psychologist as any).primarySpecialization ||
    (Array.isArray(psychologist.specialization) && psychologist.specialization.length > 0
      ? psychologist.specialization[0]
      : Array.isArray((psychologist as any).specializations) && (psychologist as any).specializations.length > 0
      ? (psychologist as any).specializations[0]
      : Array.isArray((psychologist as any).expertises) && (psychologist as any).expertises.length > 0
      ? (psychologist as any).expertises[0]
      : "Belum Diisi");

  // 🟢 2. SIPP / STR Dinamis (tanpa placeholder palsu)
  const strNumber =
    psychologist.str && psychologist.str !== "-"
      ? psychologist.str
      : (psychologist as any).sipp && (psychologist as any).sipp !== "-"
      ? (psychologist as any).sipp
      : "-";

  const joinedYear = psychologist.joinedDate
    ? new Date(psychologist.joinedDate).getFullYear()
    : new Date().getFullYear();

  const totalPatients = typeof psychologist.totalPatients === "number" ? psychologist.totalPatients : 0;
  const totalSessions = typeof psychologist.totalSessions === "number" ? psychologist.totalSessions : 0;

 const profilePercentage =
    Number((psychologist as any).profilePercentage ?? (psychologist as any).percentage ?? 0);
  
  const isComplete = profilePercentage === 100 || psychologist.status === "Aktif";

  const quickActions = [
    {
      title: "Lihat Pasien",
      desc: "Daftar & riwayat konseling pasien",
      icon: Users,
      href: "/psychologist/patients",
      color: "bg-blue-50 text-[#1F415F] border-blue-200 hover:bg-blue-100",
      iconBg: "bg-[#1F415F] text-white",
    },
    {
      title: "Jadwal Hari Ini",
      desc: "Sesi konseling & ketersediaan slot",
      icon: Calendar,
      href: "/psychologist/schedule",
      color: "bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100",
      iconBg: "bg-emerald-600 text-white",
    },
    {
      title: "Rekam Medis",
      desc: "Diagnosis & SOAP note digital",
      icon: FileText,
      href: "/psychologist/rekam-medis",
      color: "bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100",
      iconBg: "bg-amber-600 text-white",
    },
    {
      title: "Hasil Tes Psikologi",
      desc: "Catatan sesi & interpretasi tes",
      icon: Brain,
      href: "/psychologist/notes",
      color: "bg-indigo-50 text-indigo-900 border-indigo-200 hover:bg-indigo-100",
      iconBg: "bg-indigo-600 text-white",
    },
  ];

  return (
    <div className="w-full space-y-6 animate-fadeIn">
      {/* HERO WELCOME BANNER WITH GRADIENT & TYPING ANIMATION */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#1F415F] via-[#2B5379] to-[#3B6A99] rounded-3xl p-6 sm:p-8 lg:p-10 text-white shadow-xl border border-slate-700/30">
        {/* Decorative Background Elements */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          {/* Badge Sapaan */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold text-emerald-300">
            <Sparkles size={14} className="animate-pulse text-amber-300" />
            <span>Portal Psikolog OaseJiwa</span>
          </div>

          {/* Typing Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight min-h-[48px] sm:min-h-[56px] flex items-center leading-snug">
            <span>👋 {typedText}</span>
            {/* Blinking Cursor */}
            <span
              className={`inline-block w-1.5 h-7 sm:h-8 ml-1 bg-amber-400 rounded-xs transition-opacity duration-300 ${
                isTypingComplete ? "animate-pulse" : "opacity-100"
              }`}
            />
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-200/95 max-w-3xl leading-relaxed font-normal">
            Semoga hari ini menyenangkan. Terima kasih telah menjadi bagian dari{" "}
            <span className="font-semibold text-white">OaseJiwa</span> dan membantu menjaga kesehatan mental para pasien.
          </p>

          {/* Quick Info Badges inside Hero Banner */}
          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 text-slate-100">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>SIPP / STR: <strong className="text-white">{strNumber}</strong></span>
            </div>

            {/* 🟢 Badge Status Akun Dinamis */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 text-slate-100">
    {isComplete ? (
      <>
        <UserCheck size={14} className="text-emerald-300" />
        <span>Status: <strong className="text-emerald-300 font-bold">🟢 Aktif (100%)</strong></span>
      </>
    ) : (
      <>
        <AlertCircle size={14} className="text-amber-300" />
        <span>Status: <strong className="text-amber-300 font-bold">🟡 Menunggu Profil ({profilePercentage}%)</strong></span>
      </>
    )}
  </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 text-slate-100">
              <Clock size={14} className="text-amber-300" />
              <span>Bergabung Sejak: <strong className="text-white">{joinedYear}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* DYNAMIC STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Nama & Gelar */}
        <div className="bg-white p-5 rounded-2xl border-2 border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 text-[#1F415F] rounded-xl">
              <Award size={22} />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Nama Lengkap</p>
              <h4 className="text-xs sm:text-sm font-bold text-[#1F415F] line-clamp-1">{fullName}</h4>
            </div>
          </div>
        </div>

        {/* Card 2: Spesialisasi Utama */}
        <div className="bg-white p-5 rounded-2xl border-2 border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-50 text-purple-700 rounded-xl">
              <Brain size={22} />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Spesialisasi Utama</p>
              <h4 className="text-xs sm:text-sm font-bold text-[#1F415F] line-clamp-1">{primarySpec}</h4>
            </div>
          </div>
        </div>

        {/* Card 3: Total Pasien */}
        <div className="bg-white p-5 rounded-2xl border-2 border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
              <Users size={22} />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Total Pasien</p>
              <h4 className="text-sm sm:text-base font-extrabold text-[#1F415F]">{totalPatients} Pasien</h4>
            </div>
          </div>
        </div>

        {/* Card 4: Total Sesi */}
        <div className="bg-white p-5 rounded-2xl border-2 border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
              <Calendar size={22} />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Total Sesi Konseling</p>
              <h4 className="text-sm sm:text-base font-extrabold text-[#1F415F]">{totalSessions} Sesi</h4>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS SECTION */}
      <div className="bg-white p-6 rounded-2xl border-2 border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#1F415F] flex items-center gap-2">
              <Sparkles size={18} className="text-amber-500" />
              <span>Akses Cepat (Quick Actions)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Pilih menu navigasi utama untuk mengelola sesi dan pasien Anda</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, idx) => {
            const IconComponent = action.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => router.push(action.href)}
                className={`flex flex-col justify-between p-4 rounded-xl border-2 transition-all group cursor-pointer text-left ${action.color}`}
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <div className={`p-2.5 rounded-lg shadow-xs ${action.iconBg}`}>
                    <IconComponent size={20} />
                  </div>
                  <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm">{action.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{action.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}