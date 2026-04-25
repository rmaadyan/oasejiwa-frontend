import {
  Calendar,
  CreditCard,
  TrendingUp,
  Users
} from "lucide-react";

// ✅ Import dari components/features/admin/dashboard
import PendingPayments from "@/components/features/admin/dashboard/pendingpayments";
import RecentBookings from "@/components/features/admin/dashboard/recentbookings";
import StatCard from "@/components/features/admin/dashboard/statcard";
import TodaySchedule from "@/components/features/admin/dashboard/todayschedule";

// Import API layer
import { getAllDashboardData } from "@/lib/api/dashboard";

// Import mock UI data untuk development/preview
import {
  mockAlerts,
  mockDashboardStats,
  mockPendingPayments,
  mockRecentBookings,
  mockTodaySchedule
} from "@/lib/data/mock-ui-data";

export default async function Dashboard() {
  let dashboardData = null;
  let error = null;
  const showMockUI = true;

  try {
    // Fetch data dari API layer (tidak hardcoded)
    dashboardData = await getAllDashboardData();
  } catch (err) {
    error = err instanceof Error ? err.message : 'Gagal memuat data dashboard';
    if (!showMockUI) {
      console.error('Dashboard Error:', error);
    }

    // Jika SHOW_MOCK_UI aktif, gunakan mock data untuk preview UI
    if (showMockUI) {
      dashboardData = {
        stats: mockDashboardStats,
        recentBookings: mockRecentBookings,
        pendingPayments: mockPendingPayments,
        todaySchedule: mockTodaySchedule,
        alerts: mockAlerts
      };
      error = null; // Clear error jika menampilkan mock UI
    }
  }

  // Jika SHOW_MOCK_UI aktif dan belum ada data, gunakan mock
  if (showMockUI && !dashboardData) {
    dashboardData = {
      stats: mockDashboardStats,
      recentBookings: mockRecentBookings,
      pendingPayments: mockPendingPayments,
      todaySchedule: mockTodaySchedule,
      alerts: mockAlerts
    };
  }

  // Jika error dan bukan mode mock UI, tampilkan pesan error
  if (error || !dashboardData) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
          <p className="text-gray-600 mt-1">
            Selamat datang kembali! Berikut ringkasan hari ini
          </p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-5 h-5 rounded-full bg-red-500" />
            <h2 className="text-lg font-semibold text-red-900">Koneksi Backend Error</h2>
          </div>
          <p className="text-red-800 text-sm">
            Tidak dapat terhubung ke server backend. Pastikan backend API berjalan di:
            <code className="block mt-2 p-2 bg-red-100 rounded text-xs font-mono">
              {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}
            </code>
          </p>
          <details className="mt-4 text-sm">
            <summary className="cursor-pointer text-red-700 font-medium">Error Details</summary>
            <pre className="mt-2 p-2 bg-red-100 rounded text-xs overflow-auto">
              {error}
            </pre>
          </details>
        </div>
      </div>
    );
  }

  const { stats, recentBookings, pendingPayments, todaySchedule, alerts } = dashboardData;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

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

        <div>
          <TodaySchedule schedule={todaySchedule} />
        </div>
      </div>

      {/* Pending Payments */}
      <PendingPayments payments={pendingPayments} />
    </div>
  );
}