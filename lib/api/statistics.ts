const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

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
