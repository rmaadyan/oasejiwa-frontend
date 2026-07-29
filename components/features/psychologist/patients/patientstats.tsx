"use client";

interface PatientStatsProps {
  total: number;
}

export default function PatientStats({ total }: PatientStatsProps) {
  return (
    <div className="bg-white p-5 rounded-2xl border-2 border-slate-500 shadow-xs space-y-2">
      <p className="text-sm font-medium text-gray-600 mb-1">Total Pasien</p>
      <p className="text-3xl font-bold text-[#2B5379]">{total}</p>
      <p className="text-xs text-gray-500 mt-1">Semua pasien yang terdaftar</p>
    </div>
  );
}
