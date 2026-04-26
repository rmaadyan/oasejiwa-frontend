const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

function getAuthToken(): string {
  if (typeof window !== "undefined") {
    return (
      localStorage.getItem("auth_token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("token") ||
      ""
    );
  }

  return process.env.NEXT_PUBLIC_AUTH_TOKEN || "";
}

function getHeaders() {
  return {
    Authorization: `Bearer ${getAuthToken()}`,
    "Content-Type": "application/json",
  };
}

export async function getAllDashboardData() {
  const res = await fetch(`${API_BASE_URL}/admin-dashboard`, {
    cache: "no-store",
    headers: getHeaders(),
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