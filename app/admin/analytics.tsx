"use client";

import AnalyticsStats from "@/components/features/admin/analytics/AnalyticsStats";
import BookingChart from "@/components/features/admin/analytics/bookingchart";
import MonthlyChart from "@/components/features/admin/analytics/monthlychart";
import PatientTable from "@/components/features/admin/analytics/PatientTable";
import { Download } from "lucide-react";

import {
  mockAnalyticsData,
  mockRecentPatientsAdmin
} from "@/lib/data/mock-ui-data";

export default function AnalyticsPage() {
  const data = mockAnalyticsData;

  return (
    <div className="space-y-6">
      {/* Header with Download Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-[28px] font-bold text-secondary-heading">Analytics</h1>
        <button className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <Download size={16} />
          Download CSV
        </button>
      </div>

      {/* Top Section: Stats + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Column 1: Pengguna + Pengunjung & Pendapatan */}
        <div className="lg:col-span-1 space-y-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <AnalyticsStats label="Pengguna" value={data.stats.totalUsers} />
            <AnalyticsStats label="Pengunjung" value={data.stats.totalVisitors} />
          </div>

          {/* Pendapatan - height menyesuaikan Pasien */}
          <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-5 lg:h-[calc(100%-8.2rem)] flex flex-col">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              Pendapatan
            </h3>
            <div className="flex-1 flex flex-col justify-center space-y-4">
              <div>
                <div className="text-xs sm:text-sm text-gray-600 mb-1">Lunas</div>
                <div className="text-base sm:text-lg font-semibold text-gray-900">
                  Rp. {data.revenue.paid.toLocaleString("id-ID")}
                </div>
              </div>
              <div>
                <div className="text-xs sm:text-sm text-gray-600 mb-1">DP</div>
                <div className="text-base sm:text-lg font-semibold text-gray-900">
                  Rp. {data.revenue.dp.toLocaleString("id-ID")}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Pasien Bar Chart - UKURAN TETAP */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-5 h-fit flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-gray-900">
                Pasien Per Bulan
              </h3>
            </div>
            <MonthlyChart data={data.monthlyPatients} height={320} />
          </div>
        </div>
      </div>

      {/* Middle Section: Booking + Layanan - SAMA TINGGI */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Booking Chart - height sama dengan Layanan Terbanyak */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-5 lg:h-90 flex flex-col">
            <h3 className="text-base font-semibold text-gray-900 mb-3">
              Booking
            </h3>
            <div className="flex-1 flex items-center justify-center overflow-hidden">
              <BookingChart data={data.bookings} compact />
            </div>
          </div>
        </div>

        {/* Layanan Terbanyak - UKURAN TETAP */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-5 h-fit lg:h-90 flex flex-col">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              Layanan Terbanyak
            </h3>
            <div className="space-y-4 overflow-y-auto flex-1">
              {data.topServices.map((item, index: number) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-sm font-semibold text-gray-700 shrink-0">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </span>
                      <span className="text-sm text-gray-600 ml-2">
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
      </div>

      {/* Bottom Section: Data Pasien Table */}
      <PatientTable data={mockRecentPatientsAdmin} />
    </div>
  );
}
