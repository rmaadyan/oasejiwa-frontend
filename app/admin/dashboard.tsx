"use client";

import { useEffect, useState } from "react";
import { 
  Users, 
  Calendar, 
  CreditCard, 
  TrendingUp,
  UserCheck,
  Activity,
  ArrowUpRight,
  Loader2
} from "lucide-react";
import StatCard from "@/components/features/admin/dashboard/statcard";
import RecentBookings from "@/components/features/admin/dashboard/recentbookings";
import TodaySchedule from "@/components/features/admin/dashboard/todayschedule";
import PendingPayments from "@/components/features/admin/dashboard/pendingpayments";
import { getAllDashboardData } from "@/lib/api/dashboard";
import type { DashboardDataResponse } from "@/lib/types/dashboard";


export default function Dashboard() {
  const [data, setData] = useState<DashboardDataResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    getAllDashboardData()
      .then(setData)
      .catch((err) => {
        console.error(err);
        setError("Failed to load dashboard data");
      })
      .finally(() => setLoading(false));
  }, []);


  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };


  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <p className="text-gray-600 mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }


  // Error state
  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-600 font-semibold">{error || "No data available"}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }


  const { stats, recentBookings, pendingPayments, todaySchedule, alerts } = data;


  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
        <p className="text-gray-600 mt-1">
          Selamat datang kembali! Berikut ringkasan hari ini
        </p>
      </div>


      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Pasien"
          value={stats.totalPatients}
          icon={Users}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
          trend={{
            value: `+${stats.newPatientsThisMonth}`,
            label: "bulan ini",
            isPositive: true
          }}
        />


        <StatCard
          title="Booking Hari Ini"
          value={stats.todayBookings}
          icon={Calendar}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
          trend={{
            value: `${stats.upcomingBookings} upcoming`,
            label: "",
            isPositive: true
          }}
        />


        <StatCard
          title="Pending Pembayaran"
          value={stats.pendingPayments}
          icon={CreditCard}
          iconBgColor="bg-orange-100"
          iconColor="text-orange-600"
          subtitle="Perlu validasi"
        />


        <StatCard
          title="Revenue Feb 2026"
          value={formatCurrency(stats.monthlyRevenue)}
          icon={TrendingUp}
          iconBgColor="bg-emerald-100"
          iconColor="text-emerald-600"
          trend={{
            value: `+${stats.revenueGrowth}%`,
            label: "vs Januari",
            isPositive: true
          }}
        />
      </div>


      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentBookings bookings={recentBookings} />
        </div>


        <div className="space-y-6">
          <TodaySchedule schedule={todaySchedule} />
        </div>
      </div>


      {/* Pending Payments */}
      <PendingPayments payments={pendingPayments} />
    </div>
  );
}