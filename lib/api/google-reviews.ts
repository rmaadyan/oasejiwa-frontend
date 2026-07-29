const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface GoogleReview {
  id: string;
  author: string;
  rating: number;
  text: string;
  photoUrl?: string;
  relativeTime?: string;
  createdAt?: string;
}

export interface GoogleReviewsData {
  businessName: string;
  rating: number;
  totalReviews: number;
  googleMapsUrl: string;
  reviews: GoogleReview[];
  lastSyncedAt: string;
  isFromCache: boolean;
  status: string;
}

function getAuthToken(): string {
  if (typeof window !== "undefined") {
    return (
      localStorage.getItem("auth_token") ||
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("access_token") ||
      ""
    );
  }
  return "";
}

export async function getGoogleReviews(): Promise<GoogleReviewsData | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/google-reviews`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("Error fetching Google Reviews:", err);
    return null;
  }
}

export async function getAdminGoogleReviews(): Promise<GoogleReviewsData | null> {
  try {
    const token = getAuthToken();
    const res = await fetch(`${API_BASE_URL}/google-reviews/admin`, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) return getGoogleReviews();
    return await res.json();
  } catch (err) {
    console.error("Error fetching admin Google Reviews:", err);
    return getGoogleReviews();
  }
}
