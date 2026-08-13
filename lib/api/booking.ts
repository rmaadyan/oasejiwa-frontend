// 🟢 1. BASE URL (Otomatis pastikan ada /api di ujung URL)
let rawUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.oasejiwa.id/api";
if (!rawUrl.includes("/api")) {
  rawUrl = `${rawUrl.replace(/\/$/, "")}/api`;
}
export const API_BASE_URL = rawUrl;

// Helper Ambil Token JWT
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

// Helper terpusat — selalu pakai cookie & Token JWT
const authFetch = (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  return fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
};

// ---------------------------------------------------------
// HELPER TRANSFORM DATA CONSULTATION FORM & SANITASI PAYLOAD
// ---------------------------------------------------------
function sanitizeConsultationForm(rawForm: any) {
  if (!rawForm) return undefined;

  const form = { ...rawForm };

  // Hapus field yang memicu whitelistValidation jika tidak dipakai di DTO
  delete form.partnerSleepQuality;

  // Pastikan Boolean murni
  if ("usesAddictiveSubstances" in form) {
    form.usesAddictiveSubstances =
      form.usesAddictiveSubstances === true ||
      form.usesAddictiveSubstances === "true" ||
      form.usesAddictiveSubstances === "Ya";
  }

  // Transform Enum ke UPPERCASE (sesuai Enum Prisma/NestJS)
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

  // Pastikan consultationGoals berupa Array of String
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
  // 🟢 CLEAN PAYLOAD: Buat salinan data agar scheduleId & notes kosong diabaikan dari DTO whitelist validation
  const cleanPayload: any = {
    psychologistId: payload.psychologistId,
    serviceId: Number(payload.serviceId),
    scheduledDate: payload.scheduledDate,
    scheduledTime: payload.scheduledTime,
    consultationForm: sanitizeConsultationForm(payload.consultationForm),
    consentForm: payload.consentForm,
  };

  // Hanya sertakan scheduleId jika benar-benar ada nilainya dan bukan null/empty
  if (payload.scheduleId && String(payload.scheduleId).trim() !== "" && payload.scheduleId !== "null") {
    cleanPayload.scheduleId = String(payload.scheduleId);
  }

  // Hanya sertakan notes jika ada nilainya
  if (payload.notes && String(payload.notes).trim() !== "") {
    cleanPayload.notes = payload.notes;
  }

  const res = await authFetch(`${API_BASE_URL}/bookings`, {
    method: "POST",
    body: JSON.stringify(cleanPayload),
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