"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Users,
  Calendar,
  CreditCard,
  TrendingUp,
  Loader2,
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
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const currentMonthLabel = useMemo(() => {
    return new Date().toLocaleDateString("id-ID", {
      month: "long",
      year: "numeric",
    });
  }, []);

  const previousMonthLabel = useMemo(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);

    return date.toLocaleDateString("id-ID", {
      month: "long",
    });
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="font-semibold text-red-600">
            {error || "No data available"}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { stats, recentBookings, pendingPayments, todaySchedule } = data;

  const revenueGrowthValue = stats.revenueGrowth ?? 0;
  const revenueGrowthText = `${
    revenueGrowthValue >= 0 ? "+" : ""
  }${revenueGrowthValue}%`;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
        <p className="mt-1 text-gray-600">
          Selamat datang kembali! Berikut ringkasan hari ini
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Pasien"
          value={stats.totalPatients}
          icon={Users}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
          trend={{
            value: `+${stats.newPatientsThisMonth}`,
            label: "bulan ini",
            isPositive: true,
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
            isPositive: true,
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
          title={`Revenue ${currentMonthLabel}`}
          value={formatCurrency(stats.monthlyRevenue)}
          icon={TrendingUp}
          iconBgColor="bg-emerald-100"
          iconColor="text-emerald-600"
          trend={{
            value: revenueGrowthText,
            label: `vs ${previousMonthLabel}`,
            isPositive: revenueGrowthValue >= 0,
          }}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentBookings bookings={recentBookings} />
        </div>

        <div className="space-y-6">
          <TodaySchedule schedule={todaySchedule} />
        </div>
      </div>

      {/* Pending Payments */}
      <PendingPayments
        payments={pendingPayments}
        totalPendingPayments={stats.pendingPayments}
      />
    </div>
  );
}