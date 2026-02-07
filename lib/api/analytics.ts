// ========================================
// 🔧 CONFIG: Backend API Configuration
// ========================================
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ========================================
// 📊 GET: Analytics Stats
// ========================================
export async function getAnalyticsStats() {
  const res = await fetch(`${API_BASE_URL}/api/admin/analytics/stats`, {
    cache: 'no-store',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) throw new Error('Failed to fetch analytics stats');
  return res.json();
}

// ========================================
// 📅 GET: Booking Data
// ========================================
export async function getBookingData() {
  const res = await fetch(`${API_BASE_URL}/api/admin/analytics/bookings`, {
    cache: 'no-store',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) throw new Error('Failed to fetch booking data');
  return res.json();
}

// ========================================
// 📈 GET: Monthly Patients
// ========================================
export async function getMonthlyPatients(year?: number) {
  const yearParam = year || new Date().getFullYear();
  const res = await fetch(
    `${API_BASE_URL}/api/admin/analytics/monthly-patients?year=${yearParam}`,
    {
      cache: 'no-store',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    }
  );

  if (!res.ok) throw new Error('Failed to fetch monthly patients');
  return res.json();
}

// ========================================
// 💰 GET: Revenue Data
// ========================================
export async function getRevenueData() {
  const res = await fetch(`${API_BASE_URL}/api/admin/analytics/revenue`, {
    cache: 'no-store',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) throw new Error('Failed to fetch revenue data');
  return res.json();
}

// ========================================
// 🏆 GET: Top Tests
// ========================================
export async function getTopTests(limit = 5) {
  const res = await fetch(
    `${API_BASE_URL}/api/admin/analytics/top-tests?limit=${limit}`,
    {
      cache: 'no-store',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    }
  );

  if (!res.ok) throw new Error('Failed to fetch top tests');
  return res.json();
}

// ========================================
// 🎯 GET: Top Services
// ========================================
export async function getTopServices(limit = 5) {
  const res = await fetch(
    `${API_BASE_URL}/api/admin/analytics/top-services?limit=${limit}`,
    {
      cache: 'no-store',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    }
  );

  if (!res.ok) throw new Error('Failed to fetch top services');
  return res.json();
}

// ========================================
// 👥 GET: Recent Patients
// ========================================
export async function getRecentPatients(limit = 10) {
  const res = await fetch(
    `${API_BASE_URL}/api/admin/analytics/recent-patients?limit=${limit}`,
    {
      cache: 'no-store',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    }
  );

  if (!res.ok) throw new Error('Failed to fetch recent patients');
  return res.json();
}

// ========================================
// 🎁 GET ALL: Fetch semua data sekaligus
// ========================================
export async function getAllAnalyticsData() {
  const [stats, bookings, monthlyPatients, revenue, topTests, topServices, recentPatients] = 
    await Promise.all([
      getAnalyticsStats(),
      getBookingData(),
      getMonthlyPatients(),
      getRevenueData(),
      getTopTests(5),
      getTopServices(5),
      getRecentPatients(5)
    ]);

  return {
    stats,
    bookings,
    monthlyPatients,
    revenue,
    topTests,
    topServices,
    recentPatients
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
