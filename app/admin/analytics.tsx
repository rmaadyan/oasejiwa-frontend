"use client";

import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AnalyticsStats from "@/app/components/features/admin/analytics/AnalyticsStats";
import BookingChart from "@/app/components/features/admin/analytics/bookingchart";
import MonthlyChart from "@/app/components/features/admin/analytics/monthlychart";
import PatientTable from "@/app/components/features/admin/analytics/PatientTable";
import { mockAnalyticsData, type AnalyticsData } from "@/lib/data/mock-ui-data";

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData>(mockAnalyticsData);
  const [loading, setLoading] = useState(false);
  
  // Filter untuk Booking: Bulan + Tahun
  const [bookingDate, setBookingDate] = useState(new Date());
  
  // Filter untuk Pasien: Tahun saja
  const [patientYear, setPatientYear] = useState(new Date().getFullYear());

  // Fetch data berdasarkan filter
  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // Format: YYYY-MM untuk booking
      const bookingMonth = bookingDate.toISOString().slice(0, 7); // "2026-02"
      
      // TODO: Uncomment ini saat API sudah ready
      // const response = await fetch(`/api/analytics?bookingMonth=${bookingMonth}&patientYear=${patientYear}`);
      // if (!response.ok) throw new Error('Failed to fetch analytics');
      // const result = await response.json();
      // setData(result);
      
      // Sementara pakai mock data
      console.log('Filter:', { bookingMonth, patientYear });
      setData(mockAnalyticsData);
      
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
      // Fallback ke mock data
      setData(mockAnalyticsData);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data saat filter berubah (REALTIME)
  useEffect(() => {
    fetchAnalyticsData();
  }, [bookingDate, patientYear]);

  // Generate array tahun untuk dropdown
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  // Handle DatePicker change - bisa null
  const handleBookingDateChange = (date: Date | null) => {
    if (date) {
      setBookingDate(date);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-600 mt-1">
            Data booking: {bookingDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })} | 
            Data pasien: Tahun {patientYear}
          </p>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Left Column: Stats + Revenue */}
        <div className="flex flex-col gap-6">
          {/* Pengguna & Pengunjung */}
          <div className="grid grid-cols-2 gap-4">
            <AnalyticsStats label="Pengguna" value={data.stats.totalUsers} />
            <AnalyticsStats label="Pengunjung" value={data.stats.totalVisitors} />
          </div>

          {/* Pendapatan — flex-1 agar mengisi sisa tinggi kolom */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col flex-1">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              Pendapatan
            </h3>
            <div className="flex-1 flex flex-col justify-center space-y-6">
              <div>
                <div className="text-sm text-gray-600 mb-1">Lunas</div>
                <div className="text-2xl font-semibold text-[#2B5379]">
                  Rp. {data.revenue.paid.toLocaleString("id-ID")}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">DP</div>
                <div className="text-2xl font-semibold text-[#6B9AC4]">
                  Rp. {data.revenue.dp.toLocaleString("id-ID")}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Monthly Chart */}
        <div className="lg:col-span-2 h-full">
          <div className="bg-white rounded-lg border border-gray-200 p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900">
                Pasien Per Bulan
              </h3>
              {/* Filter Tahun Saja untuk Pasien */}
              <select
                value={patientYear}
                onChange={(e) => setPatientYear(Number(e.target.value))}
                className="text-sm text-gray-600 border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-[#2B5379] focus:border-transparent cursor-pointer bg-white"
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
              <div className="flex items-center justify-center h-80">
                <div className="text-gray-500">Loading data...</div>
              </div>
            ) : (
              <MonthlyChart data={data.monthlyPatients} height={320} />
            )}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Booking + Services */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Pie Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900">Booking</h3>
            {/* Filter Bulan + Tahun untuk Booking */}
            <DatePicker
              selected={bookingDate}
              onChange={handleBookingDateChange}
              dateFormat="MMMM yyyy"
              showMonthYearPicker
              disabled={loading}
              className="text-sm text-gray-600 border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-[#2B5379] focus:border-transparent cursor-pointer bg-white w-36 text-center"
            />
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">Loading data...</div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              {/* Wrapper untuk center konten booking */}
              <BookingChart data={data.bookings} compact={true} />
            </div>
          )}
        </div>

        {/* Layanan Terbanyak */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            Layanan Terbanyak
          </h3>
          <div className="space-y-4">
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
                      className="h-full bg-[#2B5379] rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <PatientTable 
          data={data.patients} 
          fullAnalyticsData={data}
        />
      </div>
    </div>
  );
}
