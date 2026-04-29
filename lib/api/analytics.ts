const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface AnalyticsFilters {
  bookingMonth?: string;
  patientYear?: number;
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
  const url = query
    ? `${API_BASE_URL}/admin-analytics?${query}`
    : `${API_BASE_URL}/admin-analytics`;

  console.log("FETCH ANALYTICS URL:", url);

  const res = await fetch(url, {
    cache: "no-store",
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch analytics: ${res.status} ${text}`);
  }

  return res.json();
}

export async function getAllAnalyticsData(filters?: AnalyticsFilters) {
  return getAnalytics(filters);
}

export async function getAnalyticsStats(filters?: AnalyticsFilters) {
  const data = await getAnalytics(filters);
  return data.stats;
}

export async function getBookingData(filters?: AnalyticsFilters) {
  const data = await getAnalytics(filters);
  return data.bookings;
}

export async function getMonthlyPatients(year?: number) {
  const data = await getAnalytics({
    patientYear: year || new Date().getFullYear(),
  });

  return data.monthlyPatients;
}

export async function getRevenueData(filters?: AnalyticsFilters) {
  const data = await getAnalytics(filters);
  return data.revenue;
}

export async function getTopTests(filters?: AnalyticsFilters) {
  const data = await getAnalytics(filters);
  return data.topTests ?? [];
}

export async function getTopServices(filters?: AnalyticsFilters) {
  const data = await getAnalytics(filters);
  return data.topServices;
}

export async function getRecentPatients(filters?: AnalyticsFilters) {
  const data = await getAnalytics(filters);
  return data.patients;
}