'use client'

import { CheckCircle2 } from "lucide-react";

export default function ProfileProgressBar({
  fullName,
  birthday,
  gender,
  country,
  city,
  address,
  phone,
  email,
}: {
  fullName?: string;
  birthday?: string;
  gender?: string | null;
  country?: string;
  city?: string;
  address?: string;
  phone?: string;
  email?: string;
}) {
  const fields = [fullName, birthday, gender, country, city, address, phone, email];
  const filledCount = fields.filter((f) => f && String(f).trim() !== "").length;
  const percentage = Math.round((filledCount / fields.length) * 100);

  return (
    <div className="bg-white border-2 border-slate-300 border-l-4 border-l-blue-600 rounded-2xl shadow-sm p-5 sm:p-6 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm sm:text-base font-bold text-[#234463] flex items-center gap-2">
          <span>📊</span> Progress Kelengkapan Profil
        </h3>
        <span className="text-sm font-extrabold text-[#234463] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          {percentage}%
        </span>
      </div>

      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
        <div
          className="h-full bg-gradient-to-r from-[#234463] to-[#3B6E9B] transition-all duration-500 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="text-xs font-medium text-slate-500">
        {percentage === 100 ? (
          <span className="text-emerald-600 flex items-center gap-1 font-semibold">
            <CheckCircle2 size={14} /> Profil Anda sudah 100% lengkap! Siap untuk booking konsultasi.
          </span>
        ) : (
          `Profil Anda terisi ${percentage}%. Lengkapi sisa data Anda untuk mempermudah sesi konseling.`
        )}
      </p>
    </div>
  );
}