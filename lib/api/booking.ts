const API_BASE_URL = "https://api.oasejiwa.id";

// Helper terpusat — selalu pakai cookie
const authFetch = (url: string, options: RequestInit = {}) =>
  fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

// ---------------------------------------------------------
// USER ENDPOINTS
// ---------------------------------------------------------

export async function createBooking(payload: any) {
  const res = await authFetch(`${API_BASE_URL}/bookings`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal membuat booking");
  }
  return res.json();
}

export async function getUserBookings() {
  const res = await authFetch(`${API_BASE_URL}/bookings`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal mengambil data booking");
  }
  return res.json();
}

export async function rescheduleBooking(id: string | number, payload: { newDate: string; newTime: string }) {
  const res = await authFetch(`${API_BASE_URL}/bookings/${id}/reschedule`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal reschedule booking");
  }
  return res.json();
}

export async function getUserBookingDetail(id: string | number) {
  const res = await authFetch(`${API_BASE_URL}/bookings/${id}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal mengambil detail booking");
  }
  return res.json();
}

export async function confirmFullPayment(id: string | number) {
  const res = await authFetch(`${API_BASE_URL}/bookings/${id}/confirm-full-payment`, {
    method: "PATCH",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal konfirmasi pelunasan");
  }
  return res.json();
}

// ---------------------------------------------------------
// ADMIN ENDPOINTS
// ---------------------------------------------------------

export async function getAdminBookings() {
  const res = await authFetch(`${API_BASE_URL}/admin/bookings`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal mengambil seluruh data booking");
  }
  return res.json();
}

export async function getAdminBookingDetail(id: string | number) {
  const res = await authFetch(`${API_BASE_URL}/admin/bookings/${id}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal mengambil detail booking");
  }
  return res.json();
}

export async function approveBooking(id: string | number) {
  const res = await authFetch(`${API_BASE_URL}/admin/bookings/${id}/approve`, {
    method: "PATCH",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal menyetujui booking");
  }
  return res.json();
}

export async function rejectBooking(id: string | number, reason: string) {
  const res = await authFetch(`${API_BASE_URL}/admin/bookings/${id}/reject`, {
    method: "PATCH",
    body: JSON.stringify({ reason }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal menolak booking");
  }
  return res.json();
}