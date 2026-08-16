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
      headers,
    });

    if (!res.ok) {
      res = await fetch(`${API_BASE_URL}/analytics/admin${query ? `?${query}` : ""}`, {
        cache: "no-store",
        headers,
      });
    }

    if (!res.ok) {
      return {
        stats: { totalUsers: 0, totalVisitors: 0 },
        bookings: { new: 0, returning: 0 },
        revenue: { paid: 0, dp: 0 },
        topTests: [],
        topServices: [],
        patients: [],
        monthlyPatients: [],
      };
    }

    return await res.json();
  } catch (error) {
    console.error("Gagal fetch analytics:", error);
    return {
      stats: { totalUsers: 0, totalVisitors: 0 },
      bookings: { new: 0, returning: 0 },
      revenue: { paid: 0, dp: 0 },
      topTests: [],
      topServices: [],
      patients: [],
      monthlyPatients: [],
    };
  }
}