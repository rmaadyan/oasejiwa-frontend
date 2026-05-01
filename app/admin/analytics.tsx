"use client";

import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import AnalyticsStats from "@/components/features/admin/analytics/AnalyticsStats";
import BookingChart from "@/components/features/admin/analytics/bookingchart";
import MonthlyChart from "@/components/features/admin/analytics/monthlychart";
import PatientTable from "@/components/features/admin/analytics/PatientTable";

import { getAnalytics } from "@/lib/api/analytics";
import { mockAnalyticsData, type AnalyticsData } from "@/lib/data/mock-ui-data";

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData>(mockAnalyticsData);
  const [loading, setLoading] = useState(false);

  const [bookingDate, setBookingDate] = useState(new Date());
  const [patientYear, setPatientYear] = useState(new Date().getFullYear());

  const formatYearMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");

    return `${year}-${month}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const selectedMonthLabel = bookingDate.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });

  const fetchAnalyticsData = async () => {
    setLoading(true);

    try {
      const bookingMonth = formatYearMonth(bookingDate);

      const result = await getAnalytics({
        bookingMonth,
        patientYear,
      });

      setData({
        stats: result.stats ?? { totalUsers: 0, totalVisitors: 0 },
        revenue: result.revenue ?? { paid: 0, dp: 0 },
        monthlyPatients: result.monthlyPatients ?? [],
        bookings: result.bookings ?? { returning: 0, new: 0 },
        topServices: result.topServices ?? [],
        topTests: result.topTests ?? [],
        patients: result.patients ?? [],
      });
    } catch (error) {
      console.error("Failed to fetch analytics:", error);

      setData({
        stats: { totalUsers: 0, totalVisitors: 0 },
        revenue: { paid: 0, dp: 0 },
        monthlyPatients: [],
        bookings: { returning: 0, new: 0 },
        topServices: [],
        topTests: [],
        patients: [],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [bookingDate, patientYear]);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const handleBookingDateChange = (date: Date | null) => {
    if (date) {
      setBookingDate(date);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
          <p className="mt-1 text-sm text-gray-600">
            Data booking dan pendapatan: {selectedMonthLabel} | Data pasien:
            Tahun {patientYear}
          </p>
        </div>
      </div>

      {/* Top Section */}
      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6">
          <AnalyticsStats label="Pengguna" value={data.stats.totalUsers} />

          <div className="flex flex-1 flex-col rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-900">
                  Pendapatan
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  Periode {selectedMonthLabel}
                </p>
              </div>

              <DatePicker
                selected={bookingDate}
                onChange={handleBookingDateChange}
                dateFormat="MMMM yyyy"
                showMonthYearPicker
                disabled={loading}
                className="w-36 cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-center text-sm text-gray-600 focus:border-transparent focus:ring-2 focus:ring-[#2B5379]"
              />
            </div>

            <div className="flex flex-1 flex-col justify-center space-y-6">
              <div>
                <div className="mb-1 text-sm text-gray-600">Lunas</div>
                <div className="text-2xl font-semibold text-[#2B5379]">
                  {formatCurrency(data.revenue.paid)}
                </div>
              </div>

              <div>
                <div className="mb-1 text-sm text-gray-600">DP</div>
                <div className="text-2xl font-semibold text-[#6B9AC4]">
                  {formatCurrency(data.revenue.dp)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-full lg:col-span-2">
          <div className="h-full rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900">
                Pasien Per Bulan
              </h3>

              <select
                value={patientYear}
                onChange={(e) => setPatientYear(Number(e.target.value))}
                className="cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-600 focus:border-transparent focus:ring-2 focus:ring-[#2B5379]"
                disabled={loading}
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {loading ? (
              <div className="flex h-80 items-center justify-center">
                <div className="text-gray-500">Loading data...</div>
              </div>
            ) : (
              <MonthlyChart data={data.monthlyPatients} height={320} />
            )}
          </div>
        </div>
      </div>

      {/* Booking and Services */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                Booking
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                Periode {selectedMonthLabel}
              </p>
            </div>

            <DatePicker
              selected={bookingDate}
              onChange={handleBookingDateChange}
              dateFormat="MMMM yyyy"
              showMonthYearPicker
              disabled={loading}
              className="w-36 cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-center text-sm text-gray-600 focus:border-transparent focus:ring-2 focus:ring-[#2B5379]"
            />
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="text-gray-500">Loading data...</div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <BookingChart data={data.bookings} compact={true} />
            </div>
          )}
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-base font-semibold text-gray-900">
            Layanan Terbanyak
          </h3>

          <div className="space-y-4">
            {data.topServices.length === 0 ? (
              <div className="text-sm text-gray-500">
                Belum ada data layanan.
              </div>
            ) : (
              data.topServices.map((item, index: number) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-200 text-sm font-semibold text-gray-700">
                    {String.fromCharCode(65 + index)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="truncate text-sm font-medium text-gray-900">
                        {item.name}
                      </span>
                      <span className="ml-2 text-sm text-gray-600">
                        {item.percentage}% User
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-[#2B5379] transition-all duration-500"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Patient Table */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <PatientTable data={data.patients} fullAnalyticsData={data} />
      </div>
    </div>
  );
}