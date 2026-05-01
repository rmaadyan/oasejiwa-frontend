"use client";

import { useState } from "react";

interface Patient {
  id: number | string;
  name: string;
  date: string;
  service: string;
  description: string;
  bookingCount?: number;
}

interface PatientTableProps {
  data: Patient[];
  fullAnalyticsData?: any;
}

export default function PatientTable({ data }: PatientTableProps) {
  const [sortBy, setSortBy] = useState<"recent" | "bookings">("bookings");

  const sortedData = [...data].sort((a, b) => {
    if (sortBy === "bookings") {
      return (b.bookingCount || 0) - (a.bookingCount || 0);
    }

    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const displayedData = sortedData.slice(0, 10);
  const totalPatients = data.length;
  const hiddenCount = Math.max(0, totalPatients - 10);

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-sm font-semibold text-[#2B5379]">
            Data Pasien Terbaru
          </h3>
          <p className="mt-1 text-xs text-gray-500">
            Data mengikuti filter tahun pada Analytics.
          </p>
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "recent" | "bookings")}
          className="cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-600 focus:border-transparent focus:ring-2 focus:ring-[#2B5379]"
        >
          <option value="bookings">Terbanyak Booking</option>
          <option value="recent">Terbaru</option>
        </select>
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
              {sortBy === "bookings" && (
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#2B5379]">
                  Booking
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {displayedData.length > 0 ? (
              displayedData.map((row) => (
                <tr key={row.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {row.name}
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-600">
                    {row.service}
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-600">
                    {row.date}
                  </td>

                  <td className="max-w-xs truncate px-4 py-3 text-sm text-gray-600">
                    {row.description || "-"}
                  </td>

                  {sortBy === "bookings" && (
                    <td className="px-4 py-3 text-sm font-medium text-[#2B5379]">
                      {row.bookingCount || 0}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={sortBy === "bookings" ? 5 : 4}
                  className="px-4 py-8 text-center text-sm text-gray-500"
                >
                  Belum ada data pasien untuk tahun yang dipilih.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {hiddenCount > 0 && (
        <div className="rounded-lg bg-[#D1EAFF] px-4 py-3 text-xs text-gray-600">
          Menampilkan 10 dari {totalPatients} pasien. Lihat selengkapnya di{" "}
          <a
            href="/admin/users"
            className="font-medium text-[#2B5379] hover:underline"
          >
            halaman manajemen user
          </a>
        </div>
      )}
    </div>
  );
}