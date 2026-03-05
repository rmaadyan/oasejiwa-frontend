"use client";

import { useState } from "react";
import { Download } from "lucide-react";

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
}

const downloadCSV = (data: Patient[], filename: string) => {
  const headers = ["Nama", "Layanan", "Tanggal", "Keterangan", "Jumlah Booking"];
  const csvContent = [
    headers.join(","),
    ...data.map(row => 
      [
        `"${row.name}"`,
        `"${row.service}"`,
        row.date,
        `"${row.description || '-'}"`,
        row.bookingCount || 0
      ].join(",")
    )
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default function PatientTable({ data }: PatientTableProps) {
  const [sortBy, setSortBy] = useState<'recent' | 'bookings'>('bookings');
  const [selectedYear, setSelectedYear] = useState<string>("2026");

  // Sort data: by bookings descending if available, else by date
  const sortedData = [...data].sort((a, b) => {
    if (sortBy === 'bookings') {
      return (b.bookingCount || 0) - (a.bookingCount || 0);
    }
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Limit to 10 rows
  const displayedData = sortedData.slice(0, 10);
  const totalPatients = data.length;
  const hiddenCount = Math.max(0, totalPatients - 10);

  const years = ["2024", "2025", "2026"];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <h3 className="text-xs sm:text-sm font-semibold text-gray-900">Data Pasien Terbaru</h3>
        <div className="flex flex-wrap gap-2">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="text-xs text-gray-600 border border-gray-200 rounded px-2.5 sm:px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer hover:text-gray-900 bg-white"
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
            className="text-xs text-gray-600 border border-gray-200 rounded px-2.5 sm:px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer hover:text-gray-900 bg-white"
          >
            <option value="bookings">Terbanyak Booking</option>
            <option value="recent">Terbaru</option>
          </select>
          <button
            onClick={() => downloadCSV(displayedData, 'pasien-terbaru.csv')}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 text-xs text-gray-600 border border-gray-200 rounded hover:bg-gray-50 bg-white transition-colors whitespace-nowrap"
            title="Download data as CSV"
          >
            <Download size={14} />
            <span className="hidden sm:inline">CSV</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-sm sm:text-base">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">
                Nama
              </th>
              <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">
                Layanan
              </th>
              <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">
                Tanggal
              </th>
              <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">
                Keterangan
              </th>
              {sortBy === 'bookings' && (
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">
                  Booking
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {displayedData.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm font-medium text-gray-900">
                  {row.name}
                </td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-gray-600">{row.service}</td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-gray-600">{row.date}</td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-gray-600 max-w-xs truncate">
                  {row.description || "-"}
                </td>
                {sortBy === 'bookings' && (
                  <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm font-medium text-gray-900">
                    {row.bookingCount || 0}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hiddenCount > 0 && (
        <div className="text-xs text-gray-600 bg-gray-50 rounded px-3 sm:px-4 py-2 sm:py-3">
          Menampilkan 10 dari {totalPatients} pasien. {hiddenCount > 0 && <>Lihat selengkapnya di <a href="/admin/users" className="text-blue-600 hover:text-blue-700 font-medium">halaman manajemen user</a></>}
        </div>
      )}
    </div>
  );
}
