'use client'

import { CheckCircle2, Calendar, ShoppingBag } from "lucide-react";

export default function StatsSection({
  isVerified,
  bookingCount,
  memberSince,
}: {
  isVerified: boolean;
  bookingCount: number;
  memberSince?: string;
}) {
  return (
    <div className="bg-white border-2 border-slate-300 border-l-4 border-l-emerald-500 rounded-2xl shadow-sm p-5 sm:p-6 space-y-4">
      <h3 className="text-sm sm:text-base font-bold text-[#234463] flex items-center gap-2">
        <span>📈</span> Ringkasan Akun
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center gap-3">
          <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
            <CheckCircle2 size={18} />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-semibold uppercase">Status</p>
            <p className="text-xs font-bold text-emerald-700">
              {isVerified ? "Terverifikasi" : "Belum Verifikasi"}
            </p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center gap-3">
          <div className="p-2 bg-blue-100 text-[#234463] rounded-lg">
            <ShoppingBag size={18} />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-semibold uppercase">Konsultasi</p>
            <p className="text-xs font-bold text-[#234463]">{bookingCount} Sesi</p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center gap-3">
          <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
            <Calendar size={18} />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-semibold uppercase">Member Sejak</p>
            <p className="text-xs font-bold text-slate-700">{memberSince || "2026"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}