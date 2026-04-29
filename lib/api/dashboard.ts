const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function getAllDashboardData() {
  const res = await fetch(`${API_BASE_URL}/admin-dashboard`, {
    cache: "no-store",
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch dashboard data: ${res.status} ${text}`);
  }

  return res.json();
}

export async function getDashboardStats() {
  const data = await getAllDashboardData();
  return data.stats;
}

export async function getRecentBookings() {
  const data = await getAllDashboardData();
  return data.recentBookings;
}

export async function getPendingPayments() {
  const data = await getAllDashboardData();
  return data.pendingPayments;
}

export async function getTodaySchedule() {
  const data = await getAllDashboardData();
  return data.todaySchedule;
}

export async function getAlerts() {
  const data = await getAllDashboardData();
  return data.alerts;
}