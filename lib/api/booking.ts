export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "https://api.oasejiwa.id"
).replace(/\/$/, "");

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

function sanitizeConsultationForm(rawForm: any) {
  if (!rawForm) return undefined;
  const form = { ...rawForm };

  if ("usesAddictiveSubstances" in form) {
    form.usesAddictiveSubstances =
      form.usesAddictiveSubstances === true ||
      form.usesAddictiveSubstances === "true" ||
      form.usesAddictiveSubstances === "Ya";
  }

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

  if (form.consultationGoals) {
    if (!Array.isArray(form.consultationGoals)) {
      form.consultationGoals = [String(form.consultationGoals)];
    }
  } else {
    form.consultationGoals = [];
  }

  return form;
}

export async function createBooking(payload: any) {
  // 🟢 Hanya ambil properti wajib
  const cleanPayload: any = {
    psychologistId: payload.psychologistId,
    serviceId: Number(payload.serviceId),
    scheduledDate: payload.scheduledDate,
    scheduledTime: payload.scheduledTime,
    consultationForm: sanitizeConsultationForm(payload.consultationForm),
    consentForm: payload.consentForm,
  };

  // 🟢 HANYA sertakan scheduleId jika valid (bukan null, "null", "undefined", atau string kosong)
  if (
    payload.scheduleId &&
    String(payload.scheduleId).trim() !== "" &&
    payload.scheduleId !== "null" &&
    payload.scheduleId !== "undefined"
  ) {
    cleanPayload.scheduleId = String(payload.scheduleId);
  }

  if (payload.notes && String(payload.notes).trim() !== "") {
    cleanPayload.notes = payload.notes;
  }

  const res = await authFetch(`${API_BASE_URL}/bookings`, {
    method: "POST",
    body: JSON.stringify(cleanPayload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
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

// 🟢 RESCHEDULE KHUSUS ADMIN (Simpan ke DB & Trigger Notifikasi)
export async function rescheduleBookingAdmin(
  id: string | number,
  payload: { newDate: string; newTime: string; reason?: string }
) {
  const res = await authFetch(`${API_BASE_URL}/admin/bookings/${id}/reschedule`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    // Fallback jika route admin belum ada, coba route standar bookings/:id/reschedule
    const fallbackRes = await authFetch(`${API_BASE_URL}/bookings/${id}/reschedule`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });

    if (!fallbackRes.ok) {
      const err = await fallbackRes.json().catch(() => ({}));
      throw new Error(err.message || "Gagal mengubah jadwal konseling");
    }
    return fallbackRes.json();
  }

  return res.json();
}