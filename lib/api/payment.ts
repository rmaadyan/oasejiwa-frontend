const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.oasejiwa.id";

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
    credentials: "include", // ← cookie HttpOnly otomatis terkirim
    // JANGAN ada headers sama sekali untuk FormData
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
    credentials: "include", // ← ganti ini
    // hapus headers Authorization
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal upload bukti pelunasan");
  }
  return res.json();
}


