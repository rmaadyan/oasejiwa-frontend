const API_BASE_URL = "http://localhost:3001";

function getAuthToken(): string {
  if (typeof window !== "undefined") {
    // Check localStorage first
    let token: string | null | undefined = localStorage.getItem("auth_token");
    if (token) return token;
    
    // Fallback to cookies if stored there
    token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    return token || "";
  }
  return "";
}

// ---------------------------------------------------------
// USER ENDPOINTS
// ---------------------------------------------------------

/**
 * Membuat booking baru
 * @param payload Data form dan jadwal
 */
export async function createBooking(payload: any) {
  const res = await fetch(`${API_BASE_URL}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal membuat booking");
  }
  return res.json();
}

/**
 * Mendapatkan daftar booking milik user saat ini
 */
export async function getUserBookings() {
  const res = await fetch(`${API_BASE_URL}/bookings`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal mengambil data booking");
  }
  return res.json();
}

/**
 * Reschedule booking (khusus User)
 */
export async function rescheduleBooking(id: string | number, payload: { newDate: string; newTime: string }) {
  const res = await fetch(`${API_BASE_URL}/bookings/${id}/reschedule`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal reschedule booking");
  }
  return res.json();
}


// ---------------------------------------------------------
// ADMIN ENDPOINTS
// ---------------------------------------------------------

/**
 * Mendapatkan semua booking (khusus Admin)
 */
export async function getAdminBookings() {
  const res = await fetch(`${API_BASE_URL}/admin/bookings`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal mengambil seluruh data booking");
  }
  return res.json();
}

/**
 * Mendapatkan detail booking (Bisa digunakan User/Admin)
 * Endpoint di controller: GET /bookings/:id atau GET /admin/bookings/:id
 * Kita gunakan admin punya untuk admin, atau public jika role disesuaikan.
 */
export async function getAdminBookingDetail(id: string | number) {
  const res = await fetch(`${API_BASE_URL}/admin/bookings/${id}`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal mengambil detail booking");
  }
  return res.json();
}

export async function getUserBookingDetail(id: string | number) {
  const res = await fetch(`${API_BASE_URL}/bookings/${id}`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal mengambil detail booking");
  }
  return res.json();
}

/**
 * Menyetujui booking (khusus Admin)
 */
export async function approveBooking(id: string | number) {
  const res = await fetch(`${API_BASE_URL}/admin/bookings/${id}/approve`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal menyetujui booking");
  }
  return res.json();
}

/**
 * Menolak booking (khusus Admin)
 */
export async function rejectBooking(id: string | number, reason: string) {
  const res = await fetch(`${API_BASE_URL}/admin/bookings/${id}/reject`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify({ reason }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal menolak booking");
  }
  return res.json();
}

export async function confirmFullPayment(id: string | number) {
  const res = await fetch(`${API_BASE_URL}/bookings/${id}/confirm-full-payment`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal konfirmasi pelunasan");
  }
  return res.json();
}
