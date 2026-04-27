"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";

import AnalyticsStats from "@/components/features/admin/analytics/AnalyticsStats";
import BookingChart from "./bookingchart";
import MonthlyChart from "./monthlychart";

import { getAnalytics } from "@/lib/api/analytics";
import { mockAnalyticsData, type AnalyticsData } from "@/lib/data/mock-ui-data";

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData>(mockAnalyticsData);
  const [loading, setLoading] = useState(true);
  const [bookingFilter, setBookingFilter] = useState("Bulan Ini");
  const [yearFilter, setYearFilter] = useState(String(new Date().getFullYear()));

  const getBookingMonth = () => {
    const now = new Date();

    if (bookingFilter === "Bulan Ini") {
      return now.toISOString().slice(0, 7);
    }

    return now.toISOString().slice(0, 7);
  };

  const fetchAnalytics = async () => {
    setLoading(true);

    try {
      const result = await getAnalytics({
        bookingMonth: getBookingMonth(),
        patientYear: Number(yearFilter),
      });

      console.log("ANALYTICS API RESULT:", result);

      setData({
        stats: result.stats ?? mockAnalyticsData.stats,
        revenue: result.revenue ?? mockAnalyticsData.revenue,
        monthlyPatients: result.monthlyPatients ?? [],
        bookings: result.bookings ?? { returning: 0, new: 0 },
        topServices: result.topServices ?? [],
        topTests: result.topTests ?? [],
        patients: result.patients ?? [],
      });
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
      setData(mockAnalyticsData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [bookingFilter, yearFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>

        <button className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <Download size={16} />
          Download CSV
        </button>
      </div>

      {loading && (
        <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-500">
          Loading analytics...
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <AnalyticsStats label="Pengguna" value={data.stats.totalUsers} />
          <AnalyticsStats label="Pengunjung" value={data.stats.totalVisitors} />
        </div>

        <div className="lg:col-span-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900">Booking</h3>

              <select
                value={bookingFilter}
                onChange={(e) => setBookingFilter(e.target.value)}
                className="text-sm text-gray-600 border-0 focus:ring-0 cursor-pointer hover:text-gray-900"
              >
                <option>Bulan Ini</option>
                <option>3 Bulan Terakhir</option>
                <option>Tahun Ini</option>
              </select>
            </div>

            <BookingChart data={data.bookings} />
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900">
                Pasien Per Bulan
              </h3>

              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="text-sm text-gray-600 border-0 focus:ring-0 cursor-pointer hover:text-gray-900"
              >
                <option>2026</option>
                <option>2025</option>
                <option>2024</option>
              </select>
            </div>

            <MonthlyChart data={data.monthlyPatients} height={320} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              Pendapatan
            </h3>

            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Lunas</div>
                <div className="text-xl font-semibold text-gray-900">
                  Rp. {data.revenue.paid.toLocaleString("id-ID")}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-600 mb-1">DP</div>
                <div className="text-xl font-semibold text-gray-900">
                  Rp. {data.revenue.dp.toLocaleString("id-ID")}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              Tes Terbanyak
            </h3>

            <div className="space-y-4">
              {data.topTests.length === 0 ? (
                <p className="text-sm text-gray-500">Belum ada data tes.</p>
              ) : (
                data.topTests.map((item, index: number) => (
                  <ProgressItem key={item.id} item={item} index={index} />
                ))
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              Layanan Terbanyak
            </h3>

            <div className="space-y-4">
              {data.topServices.length === 0 ? (
                <p className="text-sm text-gray-500">Belum ada data layanan.</p>
              ) : (
                data.topServices.map((item, index: number) => (
                  <ProgressItem key={item.id} item={item} index={index} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgressItem({
  item,
  index,
}: {
  item: { id: number | string; name: string; percentage: number };
  index: number;
}) {
  return (
    <div className="flex items-center gap-3">
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
  );
}