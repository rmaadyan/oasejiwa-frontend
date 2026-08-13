let rawUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.oasejiwa.id/api";
if (!rawUrl.includes("/api")) {
  rawUrl = `${rawUrl.replace(/\/$/, "")}/api`;
}
export const API_BASE_URL = rawUrl;

export interface AnalyticsFilters {
  bookingMonth?: string;
  patientYear?: number;
}

function getAuthToken(): string {
  if (typeof window !== "undefined") {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("auth_token") ||
      ""
    );
  }
  return "";
}

export async function getAnalytics(filters?: AnalyticsFilters) {
  const params = new URLSearchParams();

  if (filters?.bookingMonth) {
    params.append("bookingMonth", filters.bookingMonth);
  }

  if (filters?.patientYear) {
    params.append("patientYear", filters.patientYear.toString());
  }

  const query = params.toString();
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    let res = await fetch(`${API_BASE_URL}/admin-analytics${query ? `?${query}` : ""}`, {
      cache: "no-store",
      credentials: "include",
      headers,
    });

    if (!res.ok) {
      res = await fetch(`${API_BASE_URL}/analytics/admin${query ? `?${query}` : ""}`, {
        cache: "no-store",
        credentials: "include",
        headers,
      });
    }

    if (!res.ok) {
      return { stats: {}, bookings: [], revenue: [], topTests: [], topServices: [], patients: [] };
    }

    return await res.json();
  } catch (error) {
    console.error("Gagal fetch analytics:", error);
    return { stats: {}, bookings: [], revenue: [], topTests: [], topServices: [], patients: [] };
  }
}

export async function getAllAnalyticsData(filters?: AnalyticsFilters) {
  return getAnalytics(filters);
}

export async function getAnalyticsStats(filters?: AnalyticsFilters) {
  const data = await getAnalytics(filters);
  return data?.stats || {};
}

export async function getBookingData(filters?: AnalyticsFilters) {
  const data = await getAnalytics(filters);
  return data?.bookings || [];
}

export async function getMonthlyPatients(year?: number) {
  const data = await getAnalytics({
    patientYear: year || new Date().getFullYear(),
  });
  return data?.monthlyPatients || [];
}

export async function getRevenueData(filters?: AnalyticsFilters) {
  const data = await getAnalytics(filters);
  return data?.revenue || [];
}

export async function getTopTests(filters?: AnalyticsFilters) {
  const data = await getAnalytics(filters);
  return data?.topTests || [];
}

export async function getTopServices(filters?: AnalyticsFilters) {
  const data = await getAnalytics(filters);
  return data?.topServices || [];
}

export async function getRecentPatients(filters?: AnalyticsFilters) {
  const data = await getAnalytics(filters);
  return data?.patients || [];
}