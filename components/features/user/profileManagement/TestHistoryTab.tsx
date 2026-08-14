"use client";

import { useEffect, useState } from "react";
import { ClipboardList, FileDown, Calendar, AlertCircle, ArrowRight } from "lucide-react";
import { getMyTesResults } from "@/lib/api/tes";
import { calculateDass21Result } from "@/lib/utils/dass21-calculator";
import { downloadDass21Pdf } from "@/lib/utils/dass21-pdf-generator";
import { useRouter } from "next/navigation";

export interface TesResultItem {
  id: string;
  namaTes: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  kategoriNama: string;
  diagnosis?: string;
  detailDiagnosis?: string;
  interpretasi?: string;
  sectionScores?: any;
  answers?: any;
  createdAt: string;
}

export default function TestHistoryTab() {
  const [results, setResults] = useState<TesResultItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchHistory() {
      try {
        setLoading(true);
        const data = await getMyTesResults();
        setResults(data || []);
      } catch (err: any) {
        console.error("Gagal mengambil riwayat tes:", err);
        setError("Gagal memuat riwayat tes psikologi.");
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  const handleDownloadPdf = (item: TesResultItem) => {
    const isDass21 = (item.namaTes || "").toUpperCase().includes("DASS");
    
    if (isDass21 && item.answers) {
      const dassRes = calculateDass21Result(item.answers);
      downloadDass21Pdf({
        userName: "Pengguna Oase Jiwa",
        date: new Date(item.createdAt).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        testName: item.namaTes,
        result: dassRes,
      });
    } else {
      alert(`Mendownload dokumen PDF hasil tes ${item.namaTes}...`);
    }
  };

  const handleBookingFromTest = (item: TesResultItem) => {
    router.push(`/booking/psychologists?tesResultId=${item.id}`);
  };

  if (loading) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl shadow-sm border border-slate-200">
        <div className="w-8 h-8 border-4 border-[#234463] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-slate-500 text-xs">Memuat riwayat tes psikologi...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-700 rounded-2xl text-xs flex items-center gap-2">
        <AlertCircle size={18} />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#234463] to-[#2B5379] text-white p-6 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-white/10 rounded-lg">
            <ClipboardList className="w-5 h-5 text-blue-200" />
          </div>
          <h2 className="text-xl font-bold">Riwayat Tes Psikologi</h2>
        </div>
        <p className="text-xs text-blue-100 max-w-2xl">
          Daftar seluruh pelaksanaan tes psikologi & skrining awal kesehatan mental (termasuk DASS-21). Anda dapat meninjau hasil, mengunduh laporan PDF, atau melanjutkan ke konsultasi psikolog.
        </p>
      </div>

      {results.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-sm">
          <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-700">Belum Ada Riwayat Tes</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Anda belum pernah mengisi tes psikologi. Silakan lakukan tes psikologi mandiri untuk mengetahui gambaran kondisi kesehatan mental Anda.
          </p>
          <button
            onClick={() => router.push("/tes")}
            className="mt-4 px-5 py-2 bg-[#234463] text-white text-xs font-semibold rounded-xl hover:bg-[#1c3650] transition-colors"
          >
            Mulai Tes Psikologi
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {results.map((item) => {
            const isDass21 = (item.namaTes || "").toUpperCase().includes("DASS");
            const dassRes = isDass21 && item.answers ? calculateDass21Result(item.answers) : null;

            return (
              <div
                key={item.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
                  <div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full mb-1">
                      <Calendar size={12} />
                      {new Date(item.createdAt).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <h3 className="text-base font-bold text-slate-800">{item.namaTes}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownloadPdf(item)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                    >
                      <FileDown size={15} />
                      <span>Download PDF</span>
                    </button>
                    <button
                      onClick={() => handleBookingFromTest(item)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#234463] hover:bg-[#1c3650] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                    >
                      <span>Booking Psikolog</span>
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </div>

                {/* Score breakdown */}
                {dassRes ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl text-xs">
                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                      <span className="text-slate-500 font-medium block mb-1">Depresi (Depression)</span>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 text-sm">{dassRes.depression.score} / 21</span>
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                          dassRes.depression.category === "Normal" ? "bg-emerald-100 text-emerald-800" :
                          dassRes.depression.category === "Ringan" ? "bg-yellow-100 text-yellow-800" :
                          dassRes.depression.category === "Sedang" ? "bg-amber-100 text-amber-800" :
                          "bg-red-100 text-red-800"
                        }`}>
                          {dassRes.depression.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                      <span className="text-slate-500 font-medium block mb-1">Kecemasan (Anxiety)</span>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 text-sm">{dassRes.anxiety.score} / 21</span>
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                          dassRes.anxiety.category === "Normal" ? "bg-emerald-100 text-emerald-800" :
                          dassRes.anxiety.category === "Ringan" ? "bg-yellow-100 text-yellow-800" :
                          dassRes.anxiety.category === "Sedang" ? "bg-amber-100 text-amber-800" :
                          "bg-red-100 text-red-800"
                        }`}>
                          {dassRes.anxiety.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                      <span className="text-slate-500 font-medium block mb-1">Stres (Stress)</span>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 text-sm">{dassRes.stress.score} / 21</span>
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                          dassRes.stress.category === "Normal" ? "bg-emerald-100 text-emerald-800" :
                          dassRes.stress.category === "Ringan" ? "bg-yellow-100 text-yellow-800" :
                          dassRes.stress.category === "Sedang" ? "bg-amber-100 text-amber-800" :
                          "bg-red-100 text-red-800"
                        }`}>
                          {dassRes.stress.category}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-slate-50 p-3.5 rounded-xl text-xs">
                    <div>
                      <span className="text-slate-500 block mb-0.5">Kategori Hasil</span>
                      <span className="font-bold text-slate-800 text-sm">{item.kategoriNama}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-0.5">Skor Total</span>
                      <span className="font-bold text-[#234463] text-sm">{item.totalScore} / {item.maxScore} ({Math.round(item.percentage)}%)</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
