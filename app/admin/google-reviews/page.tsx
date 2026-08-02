"use client";

import { useEffect, useState } from "react";
import {
  Star,
  RefreshCw,
  ShieldCheck,
  ExternalLink,
  MessageSquareText,
  Clock,
  Award,
} from "lucide-react";
import { getAdminGoogleReviews, type GoogleReviewsData, type GoogleReview } from "@/lib/api/google-reviews";

function GoogleIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.13C3.26 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.22c-.25-.72-.38-1.49-.38-2.22s.13-1.5.38-2.22V6.65H1.29C.47 8.27 0 10.08 0 12s.47 3.73 1.29 5.35l3.99-3.13z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.65l3.99 3.13c.95-2.85 3.6-4.96 6.72-4.96z"
      />
    </svg>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < rating;
        return (
          <Star
            key={i}
            className={
              filled
                ? "h-4 w-4 text-[#E7A14A]"
                : "h-4 w-4 text-[#E7A14A]/30"
            }
            fill={filled ? "#E7A14A" : "transparent"}
          />
        );
      })}
    </div>
  );
}

import { ReviewerAvatar } from "@/components/features/landingpage/testimonialssection";

export default function AdminGoogleReviewsPage() {
  const [data, setData] = useState<GoogleReviewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const fetchReviews = async (isManual = false) => {
    setLoading(true);
    try {
      const result = await getAdminGoogleReviews();
      if (result) {
        setData(result);
      }
      if (isManual) {
        setToastMsg("Data ulasan Google berhasil disinkronkan!");
        setTimeout(() => setToastMsg(null), 3500);
      }
    } catch (err) {
      console.error("Error fetching admin google reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-xl text-sm font-medium animate-bounce">
          <ShieldCheck className="w-5 h-5" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1E3A5F] via-[#2B5379] to-[#3B6A99] text-white p-6 rounded-2xl shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1.5 backdrop-blur-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-300" /> Mode Monitoring Admin (Read-Only)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
              <GoogleIcon /> Google Reviews & Rating Monitoring
            </h1>
            <p className="text-blue-100 text-sm mt-1">
              Pantau ulasan, rating rata-rata, dan statistik Google Business Profile resmi Oase Jiwa secara real-time.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            {data?.googleMapsUrl && (
              <a
                href={data.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm text-xs border border-white/30"
              >
                <span>Google Maps Profile</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            <button
              onClick={() => fetchReviews(true)}
              className="flex items-center justify-center gap-2 bg-white text-[#2B5379] hover:bg-blue-50 font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm text-xs"
              type="button"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              <span>Sinkronkan Sekarang</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-amber-50 text-amber-600 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Rating Rata-rata</p>
            <p className="text-2xl font-bold text-slate-900 flex items-center gap-1">
              {data ? data.rating.toFixed(1) : "4.9"}{" "}
              <span className="text-sm font-normal text-slate-400">/ 5.0</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-blue-50 text-[#2B5379] rounded-xl">
            <MessageSquareText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Ulasan Terverifikasi</p>
            <p className="text-2xl font-bold text-slate-900">{data ? data.totalReviews : 157} Ulasan</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Waktu Sinkronisasi Terakhir</p>
            <p className="text-xs font-bold text-slate-900 mt-1">
              {data ? formatDate(data.lastSyncedAt) : "Baru saja"}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-purple-50 text-purple-600 rounded-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Status Cache / API</p>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mt-1">
              {data?.isFromCache ? "Ter-cache (6 Jam)" : "Live Google API"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Reviews Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-200">
        <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 flex items-center justify-between">
          <h2 className="font-bold text-[#2B5379] text-base flex items-center gap-2">
            <GoogleIcon /> Daftar Ulasan Terbaru (Google Business Profile)
          </h2>
          <span className="text-xs text-slate-500 font-medium bg-slate-100 px-3 py-1 rounded-full">
            Read-Only (Tidak Dapat Diedit/Dihapus)
          </span>
        </div>

        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="space-y-2">
                  <div className="h-4 w-48 bg-slate-200 rounded" />
                  <div className="h-3 w-64 bg-slate-200 rounded" />
                </div>
                <div className="h-6 w-20 bg-slate-200 rounded-full" />
              </div>
            ))}
          </div>
        ) : data && data.reviews.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Reviewer</th>
                  <th className="px-6 py-4">Rating</th>
                  <th className="px-6 py-4 max-w-md">Isi Ulasan</th>
                  <th className="px-6 py-4">Waktu Ulasan</th>
                  <th className="px-6 py-4 text-center">Sumber Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.reviews.map((rev: GoogleReview, idx: number) => (
                  <tr key={rev.id || idx} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4 font-semibold text-slate-900 flex items-center gap-3">
                      <ReviewerAvatar photoUrl={rev.photoUrl} name={rev.author} sizeClass="w-8 h-8 text-xs border-2" />
                      <span>{rev.author}</span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <Stars rating={rev.rating} />
                        <span className="text-[11px] font-bold text-amber-700">{rev.rating}.0 / 5.0</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 max-w-md">
                      <p className="text-xs text-slate-700 leading-relaxed italic">
                        "{rev.text}"
                      </p>
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-500">
                      {rev.relativeTime || formatDate(rev.createdAt)}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#234463] border border-blue-200">
                        <GoogleIcon /> Google Maps
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500 text-xs">
            Belum ada ulasan yang disinkronkan.
          </div>
        )}
      </div>
    </div>
  );
}
