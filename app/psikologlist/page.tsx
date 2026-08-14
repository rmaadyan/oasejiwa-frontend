"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BadgeCheck, User, Award, GraduationCap, Briefcase, FileText } from "lucide-react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { getAllPsychologistsPublic } from "@/lib/api/psychologist";

type Psikolog = {
  id: string;
  name: string;
  avatarUrl: string | null;
  sipp: string;
  str: string;
  about: string;
  specializations: string[];
  latestEducation?: string;
  experiences?: string[];
};

export default function PsikologList() {
  const router = useRouter();
  const [psikologList, setPsikologList] = useState<Psikolog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAllPsychologistsPublic();
        
        // 🟢 Ambil data langsung dari result.data
        const rawData = (result as any)?.data || result || [];
        const rawList = Array.isArray(rawData) ? rawData : [];

        const cleanList = rawList
          .filter((p: any) => {
            const name = p?.name || p?.fullName;
            return p?.id && name && name.trim() !== "" && name !== "Psikolog";
          })
          .map((p: any) => ({
            id: p.id,
            displayOrder: Number(p.displayOrder ?? 0),
            name: p.name || p.fullName,
            avatarUrl: p.avatarUrl && p.avatarUrl.trim() !== "" ? p.avatarUrl : null,
            sipp: p.sipp || "-",
            str: p.str || "-",
            about: p.about || "Psikolog Klinik Oase Jiwa",
            specializations: p.specializations || [],
            latestEducation: p.latestEducation || "",
            experiences: p.experiences || [],
          }));

        // 🟢 Urutkan sesuai displayOrder yang diatur admin
        cleanList.sort((a: any, b: any) => a.displayOrder - b.displayOrder);

        setPsikologList(cleanList);
      } catch (err: any) {
        setError(err.message || "Gagal memuat data psikolog");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    if (!isLoading && psikologList.length === 1) {
      router.push(`/psikologdetail/?id=${psikologList[0].id}`);
    }
  }, [psikologList, isLoading, router]);

  const handleLihatDetail = (id: string) => {
    router.push(`/psikologdetail/?id=${id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F0F4F8]">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-[#234463] font-medium">Memuat data psikolog...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F0F4F8]">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-red-500 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (psikologList.length === 0) {
    return (
      <div className="min-h-screen bg-[#F0F4F8]">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-gray-500 font-medium">Belum ada psikolog tersedia</p>
        </div>
      </div>
    );
  }

  if (psikologList.length === 1) return null;

  return (
    <div className="min-h-screen bg-[#F0F4F8]">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="pt-16 pb-10 px-6 lg:px-16">
          <div className="max-w-7xl mx-auto text-center space-y-3">
            <h1 className="text-[40px] md:text-[48px] font-bold mb-2">
              <span className="text-[#1E293B]">Psikolog </span>
              <span className="text-[#234463]">Kami</span>
            </h1>
            <p className="text-center text-[16px] md:text-[18px] text-[#4B5563] max-w-2xl mx-auto">
              Tim psikolog profesional dan berpengalaman siap membantu Anda mencapai kesehatan mental yang optimal
            </p>
          </div>
        </div>

        {/* GRID KARTU PSIKOLOG */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {psikologList.map((psikolog) => (
            <div
              key={psikolog.id}
              className="bg-[#DDEEFC] border-2 border-[#B3D7F8] rounded-3xl p-7 shadow-md hover:shadow-xl hover:border-[#234463] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                {/* FOTO AVATAR */}
                <div className="relative">
                  {psikolog.avatarUrl ? (
                    <img
                      src={psikolog.avatarUrl}
                      alt={psikolog.name}
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-white shadow-md"
                    />
                  ) : (
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white border-4 border-white flex items-center justify-center shadow-md">
                      <User className="w-12 h-12 text-slate-400" />
                    </div>
                  )}
                </div>

                {/* NAMA & DESKRIPSI SINGKAT */}
                <div>
                  <h2 className="text-xl font-bold text-[#1E3A5F] leading-snug">
                    {psikolog.name}
                  </h2>
                  <p className="text-xs font-medium text-[#234463]/80 mt-1">
                    {psikolog.about || "Psikolog Klinik Oase Jiwa"}
                  </p>
                </div>

                <div className="w-full border-t border-[#C3E0FA] my-1"></div>

               {/* 🟢 KOTAK NO SIPP & NO STR RESPONSIF PENUH (VERTIKAL STACK) */}
<div className="w-full bg-white/80 rounded-2xl p-3.5 border border-[#C3E0FA] space-y-2.5 shadow-xs">
  {/* Baris 1: SIPP */}
  <div className="flex items-start gap-2.5 text-left">
    <div className="p-1 rounded-lg bg-blue-50 text-[#234463] shrink-0 mt-0.5">
      <BadgeCheck className="w-3.5 h-3.5" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] font-bold text-[#1E3A5F] uppercase tracking-wider">No. SIPP / SILP</p>
      <p className="font-mono text-xs text-[#2B5379] font-medium break-all leading-tight mt-0.5">
        {psikolog.sipp || "-"}
      </p>
    </div>
  </div>

  {/* Garis Pembatas Tipis */}
  <div className="border-t border-slate-100/90 w-full" />

  {/* Baris 2: STR */}
  <div className="flex items-start gap-2.5 text-left">
    <div className="p-1 rounded-lg bg-blue-50 text-[#234463] shrink-0 mt-0.5">
      <FileText className="w-3.5 h-3.5" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] font-bold text-[#1E3A5F] uppercase tracking-wider">No. STR</p>
      <p className="font-mono text-xs text-[#2B5379] font-medium break-all leading-tight mt-0.5">
        {psikolog.str || "-"}
      </p>
    </div>
  </div>

                  {/* SPESIALISASI */}
                  <div className="flex items-start gap-2.5">
                    <Award className="w-4 h-4 text-[#234463] shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-[#1E3A5F]">Spesialisasi</p>
                      <p className="text-[#3B597B] mt-0.5 line-clamp-1">
                        {psikolog.specializations && psikolog.specializations.length > 0
                          ? psikolog.specializations.join(", ")
                          : "-"}
                      </p>
                    </div>
                  </div>

                  {/* PENDIDIKAN */}
                  {psikolog.latestEducation && (
                    <div className="flex items-start gap-2.5">
                      <GraduationCap className="w-4 h-4 text-[#234463] shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-semibold text-[#1E3A5F]">Pendidikan</p>
                        <p className="text-[#3B597B] mt-0.5 line-clamp-1">{psikolog.latestEducation}</p>
                      </div>
                    </div>
                  )}

                  {/* PENGALAMAN KERJA */}
                  {psikolog.experiences && psikolog.experiences.length > 0 && (
                    <div className="flex items-start gap-2.5">
                      <Briefcase className="w-4 h-4 text-[#234463] shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-semibold text-[#1E3A5F]">Pengalaman Kerja</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {psikolog.experiences.slice(0, 2).map((exp, idx) => (
                            <span key={idx} className="bg-white/80 text-[#1E3A5F] text-[11px] px-2 py-0.5 rounded-md border border-[#C3E0FA] font-medium">
                              {exp}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* TOMBOL LIHAT DETAIL */}
              <button
                type="button"
                onClick={() => handleLihatDetail(psikolog.id)}
                className="w-full bg-[#234463] hover:bg-[#1C364F] active:scale-[0.98] text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-200 shadow-md mt-6 cursor-pointer text-sm"
              >
                Lihat Detail & Jadwal
              </button>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}