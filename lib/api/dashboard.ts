const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const USE_MOCK = process.env.NEXT_PUBLIC_SHOW_MOCK_UI === 'true';

// ========================================
// 🧪 MOCK DATA
// ========================================
const mockDashboardData = {
  stats: {
    totalPatients: 128,
    newPatientsThisMonth: 12,
    todayBookings: 8,
    upcomingBookings: 5,
    pendingPayments: 3,
    activePsychologists: 4,
    totalPsychologists: 6,
    monthlyRevenue: 14500000,
    revenueGrowth: 12.5,
    avgRating: 4.8,
    totalReviews: 94,
  },
  recentBookings: [
    {
      id: 1,
      patient: "Andi Pratama",
      service: "Konseling Individual",
      psychologist: "Dr. Sarah",
      date: "2026-02-26",
      time: "09:00",
      status: "confirmed" as const,
    },
    {
      id: 2,
      patient: "Budi Santoso",
      service: "Psikoterapi",
      psychologist: "Dr. Reza",
      date: "2026-02-26",
      time: "11:00",
      status: "pending" as const,
    },
    {
      id: 3,
      patient: "Citra Dewi",
      service: "Konseling Keluarga",
      psychologist: "Dr. Maya",
      date: "2026-02-25",
      time: "14:00",
      status: "completed" as const,
    },
    {
      id: 4,
      patient: "Dina Rahayu",
      service: "Konseling Individual",
      psychologist: "Dr. Sarah",
      date: "2026-02-25",
      time: "16:00",
      status: "cancelled" as const,
    },
    {
      id: 5,
      patient: "Eko Wijaya",
      service: "Psikoterapi",
      psychologist: "Dr. Reza",
      date: "2026-02-24",
      time: "10:00",
      status: "confirmed" as const,
    },
  ],
  pendingPayments: [
    {
      id: 1,
      patient: "Budi Santoso",
      service: "Psikoterapi",
      amount: 350000,
      uploadedAt: "2026-02-26T08:30:00",
      urgent: true,
      status: "pending" as const,
    },
    {
      id: 2,
      patient: "Fajar Nugroho",
      service: "Konseling Individual",
      amount: 250000,
      uploadedAt: "2026-02-25T15:00:00",
      urgent: false,
      status: "pending" as const,
    },
    {
      id: 3,
      patient: "Gita Permata",
      service: "Konseling Keluarga",
      amount: 450000,
      uploadedAt: "2026-02-25T10:00:00",
      urgent: true,
      status: "pending" as const,
    },
  ],
  todaySchedule: [
    {
      time: "09:00",
      psychologist: "Dr. Sarah",
      patient: "Andi Pratama",
      service: "Konseling Individual",
    },
    {
      time: "11:00",
      psychologist: "Dr. Reza",
      patient: "Budi Santoso",
      service: "Psikoterapi",
    },
    {
      time: "13:00",
      psychologist: "Dr. Maya",
      patient: "Hana Lestari",
      service: "Konseling Keluarga",
    },
    {
      time: "15:00",
      psychologist: "Dr. Sarah",
      patient: "Ivan Kurniawan",
      service: "Konseling Individual",
    },
  ],
  alerts: [],
};

// ========================================
// 🎁 GET ALL: Fetch semua data sekaligus
// ========================================
export async function getAllDashboardData() {
  if (USE_MOCK) {
    // Simulasi network delay agar loading state terlihat
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockDashboardData;
  }

  const [stats, bookings, payments, schedule, alertsList] =
    await Promise.all([
      getDashboardStats(),
      getRecentBookings(5),
      getPendingPayments(),
      getTodaySchedule(),
      getAlerts()
    ]);

  return {
    stats,
    recentBookings: bookings,
    pendingPayments: payments,
    todaySchedule: schedule,
    alerts: alertsList,
  };
}

// ========================================
// 📊 GET: Dashboard Stats
// ========================================
export async function getDashboardStats() {
  const res = await fetch(`${API_BASE_URL}/api/admin/dashboard/stats`, {
    cache: 'no-store',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) throw new Error('Failed to fetch dashboard stats');
  return res.json();
}

// ========================================
// 📅 GET: Recent Bookings
// ========================================
export async function getRecentBookings(limit = 5) {
  const res = await fetch(
    `${API_BASE_URL}/api/admin/bookings?limit=${limit}&sort=desc`,
    {
      cache: 'no-store',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    }
  );

  if (!res.ok) throw new Error('Failed to fetch recent bookings');
  return res.json();
}

// ========================================
// 💳 GET: Pending Payments
// ========================================
export async function getPendingPayments() {
  const res = await fetch(`${API_BASE_URL}/api/admin/payments?status=pending`, {
    cache: 'no-store',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) throw new Error('Failed to fetch pending payments');
  return res.json();
}

// ========================================
// 📋 GET: Today's Schedule
// ========================================
export async function getTodaySchedule() {
  const today = new Date().toISOString().split('T')[0];
  const res = await fetch(`${API_BASE_URL}/api/admin/schedule?date=${today}`, {
    cache: 'no-store',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) throw new Error('Failed to fetch today schedule');
  return res.json();
}

// ========================================
// 🔔 GET: Alerts
// ========================================
export async function getAlerts() {
  const res = await fetch(`${API_BASE_URL}/api/admin/alerts`, {
    cache: 'no-store',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) throw new Error('Failed to fetch alerts');
  return res.json();
}

// ========================================
// 🔐 Helper: Get Auth Token
// ========================================
function getAuthToken(): string {
  return process.env.NEXT_PUBLIC_AUTH_TOKEN || '';
}
