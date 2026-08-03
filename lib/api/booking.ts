// Fallback ke localhost untuk environment dev
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

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
// HELPER TRANSFORM DATA CONSULTATION FORM
// ---------------------------------------------------------
function sanitizeConsultationForm(rawForm: any) {
  if (!rawForm) return undefined;

  // Buat copy agar tidak merusak state asli
  const form = { ...rawForm };

  // 1. Hapus field yang memicu whitelistValidation jika tidak dipakai di DTO
  delete form.partnerSleepQuality;

  // 2. Pastikan Boolean murni
  if ("usesAddictiveSubstances" in form) {
    form.usesAddictiveSubstances =
      form.usesAddictiveSubstances === true ||
      form.usesAddictiveSubstances === "true" ||
      form.usesAddictiveSubstances === "Ya";
  }

  // 3. Transform Enum ke UPPERCASE (sesuai Enum Prisma/NestJS)
  const enumFields = [
    "selfHarmThoughts",
    "eatingPattern",
    "exerciseFrequency",
    "stressLevel",
    "therapyPreference",
  ];

  enumFields.forEach((field) => {
    if (form[field] && typeof form[field] === "string") {
      form[field] = form[field].toUpperCase();
    }
  });

  // 4. Pastikan consultationGoals berupa Array of String
  if (form.consultationGoals) {
    if (!Array.isArray(form.consultationGoals)) {
      form.consultationGoals = [String(form.consultationGoals)];
    }
  } else {
    form.consultationGoals = [];
  }

  return form;
}

// ---------------------------------------------------------
// USER ENDPOINTS
// ---------------------------------------------------------

export async function createBooking(payload: any) {
  // Transform consultationForm jika ada di dalam payload
  const formattedPayload = {
    ...payload,
    ...(payload.consultationForm && {
      consultationForm: sanitizeConsultationForm(payload.consultationForm),
    }),
  };

  const res = await authFetch(`${API_BASE_URL}/bookings`, {
    method: "POST",
    body: JSON.stringify(formattedPayload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));

    // Tangkap error validasi dari NestJS jika berupa Array of Strings
    const errorMessage = Array.isArray(err.message)
      ? err.message.join("\n• ")
      : err.message || "Gagal membuat booking";

    throw new Error(errorMessage);
  }
  return res.json();
}

export async function getUserBookings() {
  const res = await authFetch(`${API_BASE_URL}/bookings/my-bookings`);
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