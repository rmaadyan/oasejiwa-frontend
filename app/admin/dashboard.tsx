"use client";

import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import AnalyticsStats from "@/app/components/features/admin/analytics/AnalyticsStats";
import BookingChart from "@/app/components/features/admin/analytics/bookingchart";
import MonthlyChart from "@/app/components/features/admin/analytics/monthlychart";
import PatientTable from "@/app/components/features/admin/analytics/PatientTable";
import { mockAnalyticsData, type AnalyticsData } from "@/lib/data/mock-ui-data";
import { downloadToExcel } from "@/lib/utils/csv-export";

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData>(mockAnalyticsData);
  const [selectedYear, setSelectedYear] = useState("2026");
  const [bookingFilter, setBookingFilter] = useState("Bulan Ini");

  useEffect(() => {
    // TODO: Fetch data dari API berdasarkan filter
    console.log("Filter changed:", { selectedYear, bookingFilter });
  }, [selectedYear, bookingFilter]);

  const handleExportAll = () => {
    const exportData = {
      'Ringkasan': [
        { Kategori: 'Total Pengguna', Nilai: data.stats.totalUsers },
        { Kategori: 'Total Pengunjung', Nilai: data.stats.totalVisitors },
        { Kategori: 'Klien Lama', Nilai: data.bookings.returning },
        { Kategori: 'Klien Baru', Nilai: data.bookings.new },
        { Kategori: 'Pendapatan Lunas', Nilai: `Rp ${data.revenue.paid.toLocaleString('id-ID')}` },
        { Kategori: 'Pendapatan DP', Nilai: `Rp ${data.revenue.dp.toLocaleString('id-ID')}` },
      ],
      'Pasien Per Bulan': data.monthlyPatients.map(m => ({
        Bulan: m.month,
        'Jumlah Pasien': m.value
      })),
      'Tes Terbanyak': data.topTests.map(t => ({
        Nama: t.name,
        Persentase: `${t.percentage}%`
      })),
      'Layanan Terbanyak': data.topServices.map(s => ({
        Nama: s.name,
        Persentase: `${s.percentage}%`
      })),
      'Data Pasien': data.patients.map(p => ({
        Nama: p.name,
        Layanan: p.service,
        Tanggal: p.date,
        Keterangan: p.description || '-',
        'Jumlah Booking': p.bookingCount || 0
      }))
    };

    downloadToExcel(exportData, `analytics-complete-${Date.now()}.xlsx`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#2B5379]">Analytics</h1>
          <p className="text-sm text-gray-600 mt-1">Laporan dan statistik platform</p>
        </div>
        <button
          onClick={handleExportAll}
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#2B5379] rounded-lg hover:bg-[#1e3d57] transition-colors"
        >
          <Download size={16} />
          Export Lengkap
        </button>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnalyticsStats 
          label="Total Pengguna" 
          value={data.stats.totalUsers} 
        />
        <AnalyticsStats
          label="Total Pengunjung"
          value={data.stats.totalVisitors}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Booking Pie Chart */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-xl border border-gray-200 p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#2B5379]">Booking</h3>
              <select
                value={bookingFilter}
                onChange={(e) => setBookingFilter(e.target.value)}
                className="text-sm text-gray-600 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#2B5379] focus:border-transparent cursor-pointer bg-white"
              >
                <option>Bulan Ini</option>
                <option>3 Bulan Terakhir</option>
                <option>Tahun Ini</option>
              </select>
            </div>
            <BookingChart data={data.bookings} />
          </div>
        </div>

        {/* Monthly Bar Chart */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-xl border border-gray-200 p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#2B5379]">
                Pasien Per Bulan
              </h3>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="text-sm text-gray-600 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#2B5379] focus:border-transparent cursor-pointer bg-white"
              >
                <option>2026</option>
                <option>2025</option>
                <option>2024</option>
              </select>
            </div>
            <MonthlyChart data={data.monthlyPatients} height={280} />
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-[#2B5379] mb-4">
              Pendapatan
            </h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Lunas</div>
                <div className="text-xl font-semibold text-[#2B5379]">
                  Rp {data.revenue.paid.toLocaleString("id-ID")}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">DP</div>
                <div className="text-xl font-semibold text-[#2B5379]">
                  Rp {data.revenue.dp.toLocaleString("id-ID")}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Tests */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-[#2B5379] mb-4">
              Tes Terbanyak
            </h3>
            <div className="space-y-3">
              {data.topTests.map((item) => (
                <div key={item.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {item.name}
                    </span>
                    <span className="text-sm text-gray-600 ml-2">
                      {item.percentage}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#2B5379] rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Services */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-[#2B5379] mb-4">
              Layanan Terbanyak
            </h3>
            <div className="space-y-3">
              {data.topServices.map((item) => (
                <div key={item.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {item.name}
                    </span>
                    <span className="text-sm text-gray-600 ml-2">
                      {item.percentage}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#2B5379] rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <PatientTable 
          data={data.patients} 
          fullAnalyticsData={data}
        />
      </div>
    </div>
  );
}
