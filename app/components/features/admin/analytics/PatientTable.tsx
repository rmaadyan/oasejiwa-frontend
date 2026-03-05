"use client";

import { useState } from "react";

interface Patient {
  id: number;
  name: string;
  date: string;
  service: string;
  description: string;
  bookingCount?: number;
}

interface PatientTableProps {
  data: Patient[];
  fullAnalyticsData?: any; // Pass all analytics data for comprehensive export
}

export default function PatientTable({ data, fullAnalyticsData }: PatientTableProps) {
  const [sortBy, setSortBy] = useState<'recent' | 'bookings'>('bookings');
  const [selectedYear, setSelectedYear] = useState<string>("2026");

  const sortedData = [...data].sort((a, b) => {
    if (sortBy === 'bookings') {
      return (b.bookingCount || 0) - (a.bookingCount || 0);
    }
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const displayedData = sortedData.slice(0, 10);
  const totalPatients = data.length;
  const hiddenCount = Math.max(0, totalPatients - 10);

  const years = ["2024", "2025", "2026"];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-[#2B5379]">Data Pasien Terbaru</h3>
        <div className="flex flex-wrap gap-2">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="text-xs text-gray-600 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#2B5379] focus:border-transparent cursor-pointer bg-white"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'recent' | 'bookings')}
            className="text-xs text-gray-600 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#2B5379] focus:border-transparent cursor-pointer bg-white"
          >
            <option value="bookings">Terbanyak Booking</option>
            <option value="recent">Terbaru</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#2B5379]">
                Nama
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#2B5379]">
                Layanan
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#2B5379]">
                Tanggal
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#2B5379]">
                Keterangan
              </th>
              {sortBy === 'bookings' && (
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#2B5379]">
                  Booking
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {displayedData.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {row.name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{row.service}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{row.date}</td>
                <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                  {row.description || "-"}
                </td>
                {sortBy === 'bookings' && (
                  <td className="px-4 py-3 text-sm font-medium text-[#2B5379]">
                    {row.bookingCount || 0}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hiddenCount > 0 && (
        <div className="text-xs text-gray-600 bg-[#D1EAFF] rounded-lg px-4 py-3">
          Menampilkan 10 dari {totalPatients} pasien. Lihat selengkapnya di <a href="/admin/users" className="text-[#2B5379] hover:underline font-medium">halaman manajemen user</a>
        </div>
      )}
    </div>
  );
}
