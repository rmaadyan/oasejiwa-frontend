"use client";

interface PatientStatsProps {
  total: number;
}

export default function PatientStats({ total }: PatientStatsProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <p className="text-sm font-medium text-gray-600 mb-1">Total Pasien</p>
      <p className="text-3xl font-bold text-[#2B5379]">{total}</p>
      <p className="text-xs text-gray-500 mt-1">Semua pasien yang terdaftar</p>
    </div>
  );
}
