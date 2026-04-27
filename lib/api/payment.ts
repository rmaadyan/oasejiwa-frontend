const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function getAuthToken(): string {
  if (typeof window !== "undefined") {
    let token: string | null | undefined = localStorage.getItem("auth_token");
    if (token) return token;
    
    token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    return token || "";
  }
  return "";
}

/**
 * Upload bukti pembayaran DP
 * @param bookingId ID booking terkait
 * @param file File bukti transfer (gambar/pdf)
 */
export async function uploadPaymentDP(bookingId: number | string, file: File, method: string) {
  const formData = new FormData();
  formData.append("bookingId", String(bookingId));
  formData.append("method", method);
  formData.append("file", file); 

  const res = await fetch(`${API_BASE_URL}/payments/dp`, {
    method: "POST",
    headers: { 
      Authorization: `Bearer ${getAuthToken()}`
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal upload bukti pembayaran DP");
  }
  return res.json();
}

/**
 * Upload bukti pelunasan (Full Payment)
 * @param bookingId ID booking terkait
 * @param file File bukti transfer (gambar/pdf)
 */
export async function uploadPaymentFull(bookingId: number | string, file: File, method: string) {
  const formData = new FormData();
  formData.append("bookingId", String(bookingId));
  formData.append("method", method);
  formData.append("file", file);

  const res = await fetch(`${API_BASE_URL}/payments/full`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getAuthToken()}` },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal upload bukti pelunasan");
  }
  return res.json();
}
