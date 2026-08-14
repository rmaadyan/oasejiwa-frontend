const rawUrl = (process.env.NEXT_PUBLIC_API_URL || "https://api.oasejiwa.id")
  .replace(/\/api\/?$/, "")
  .replace(/\/+$/, "");
const API_BASE_URL = rawUrl || "https://api.oasejiwa.id";

export interface PublicStatisticsData {
  totalClients: number;
  totalPsychologists: number;
  averageRating: number;
  totalReviews: number;
  lastUpdated: string;
}

export async function getPublicStatistics(): Promise<PublicStatisticsData | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/statistics`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("Error fetching public statistics:", err);
    return null;
  }
}
