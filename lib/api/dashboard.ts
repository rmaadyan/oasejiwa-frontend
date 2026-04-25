// ========================================
// 🔧 CONFIG: Backend API Configuration
// ========================================
const API_BASE_URL = "http://localhost:8000";

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

  if (!res.ok) {
    throw new Error('Failed to fetch dashboard stats');
  }

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

  if (!res.ok) {
    throw new Error('Failed to fetch recent bookings');
  }

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

  if (!res.ok) {
    throw new Error('Failed to fetch pending payments');
  }

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

  if (!res.ok) {
    throw new Error('Failed to fetch today schedule');
  }

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

  if (!res.ok) {
    throw new Error('Failed to fetch alerts');
  }

  return res.json();
}

// ========================================
// 🎁 GET ALL: Fetch semua data sekaligus
// ========================================
export async function getAllDashboardData() {
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
    alerts: alertsList
  };
}

// ========================================
// 🔐 Helper: Get Auth Token dari Cookies (Server-side safe)
// ========================================
function getAuthToken(): string {
  // Untuk development, return empty string jika belum ada token
  // Di production, ambil dari cookies atau header
  const token = process.env.NEXT_PUBLIC_AUTH_TOKEN || '';
  return token;
}
