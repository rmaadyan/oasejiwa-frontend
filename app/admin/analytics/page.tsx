"use client";

import { Download } from "lucide-react";
import AnalyticsStats from "@/components/features/admin/AnalyticsStats";
import BookingChart from "@/components/features/admin/analytics/bookingchart";
import MonthlyChart from "@/components/features/admin/analytics/monthlychart";
import PatientTable from "@/components/features/admin/PatientTable";
import { mockAnalyticsData } from "@/lib/admin-data";

export default function AnalyticsPage() {
  const data = mockAnalyticsData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
        <button className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <Download size={16} />
          Download
        </button>
      </div>

      {/* Top Grid: Stats + Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Column 1: Pengguna + Pengunjung (ATAS) & Pendapatan (BAWAH) - 2 cols */}
        <div className="lg:col-span-2 space-y-4">
          {/* Pengguna & Pengunjung - HORIZONTAL */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
            <AnalyticsStats label="Pengguna" value={data.stats.totalUsers} />
            <AnalyticsStats label="Pengunjung" value={data.stats.totalVisitors} />
          </div>

          {/* Pendapatan */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Pendapatan
            </h3>
            <div className="space-y-3">
              <div>
                <div className="text-xs text-gray-600 mb-0.5">Lunas</div>
                <div className="text-base font-bold text-gray-900">
                  Rp. {data.revenue.paid.toLocaleString("id-ID")}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-0.5">DP</div>
                <div className="text-base font-bold text-gray-900">
                  Rp. {data.revenue.dp.toLocaleString("id-ID")}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Booking Pie Chart - 3 cols */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg border border-gray-200 p-5 h-full">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">Booking</h3>
              <select className="text-xs text-gray-600 border-0 focus:ring-0 cursor-pointer hover:text-gray-900 bg-transparent">
                <option>Bulan Ini</option>
                <option>3 Bulan</option>
                <option>Tahun Ini</option>
              </select>
            </div>
            <BookingChart data={data.bookings} compact />
          </div>
        </div>

        {/* Column 3: Pasien Bar Chart - 7 cols */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-lg border border-gray-200 p-5 h-full">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">Pasien</h3>
              <select className="text-xs text-gray-600 border-0 focus:ring-0 cursor-pointer hover:text-gray-900 bg-transparent">
                <option>Tahun</option>
                <option>2026</option>
                <option>2025</option>
              </select>
            </div>
            <MonthlyChart data={data.monthlyPatients} height={240} />
          </div>
        </div>
      </div>

      {/* Middle Section: Progress Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Tes Terbanyak */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Tes Terbanyak
          </h3>
          <div className="space-y-3">
            {data.topTests.map((item, index) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gray-200 rounded-lg flex items-center justify-center text-xs font-semibold text-gray-700 shrink-0">
                  {String.fromCharCode(65 + index)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-900 truncate">
                      {item.name}
                    </span>
                    <span className="text-xs text-gray-600 ml-2">
                      {item.percentage}% User
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Layanan Terbanyak */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Layanan Terbanyak
          </h3>
          <div className="space-y-3">
            {data.topServices.map((item, index) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gray-200 rounded-lg flex items-center justify-center text-xs font-semibold text-gray-700 shrink-0">
                  {String.fromCharCode(65 + index)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-900 truncate">
                      {item.name}
                    </span>
                    <span className="text-xs text-gray-600 ml-2">
                      {item.percentage}% User
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Data Pasien Table */}
      <PatientTable data={data.recentPatients} />
    </div>
  );
}
