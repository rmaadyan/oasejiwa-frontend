const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://api.oasejiwa.id";

// ─── USER PROFILE & ME ─────────────────────────────────────────────────────────

export async function getMe() {
  const res = await fetch(`${API_BASE_URL}/user/me`, {
    credentials: "include",
    cache: "no-store",
  });

  if (res.status === 401) {
    throw new Error("401: Unauthorized");
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error("Server error: " + text.slice(0, 100));
  }

  return res.json();
}

export async function updateUserProfile(data: any) {
  const res = await fetch(`${API_BASE_URL}/user/profile`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const text = await res.text();
  let json: any;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error("Server error: " + text.slice(0, 100));
  }

  if (!res.ok) {
    const messages = json?.message;
    const errorMessage = Array.isArray(messages)
      ? messages.join(", ")
      : messages ?? "Gagal update profile";
    throw new Error(errorMessage);
  }

  return json;
}

export async function changeUserPassword(data: {
  currentPassword: string;
  newPassword: string;
}) {
  const res = await fetch(`${API_BASE_URL}/user/change-password`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const text = await res.text();
  let json: any;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error("Server error: " + text.slice(0, 100));
  }

  if (!res.ok) {
    const messages = json?.message;
    const errorMessage = Array.isArray(messages)
      ? messages.join(", ")
      : messages ?? "Gagal mengubah kata sandi";
    throw new Error(errorMessage);
  }

  return json;
}

export async function uploadUserAvatar(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE_URL}/upload/image`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const text = await res.text();
  let json: any;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error("Server error: " + text.slice(0, 100));
  }

  if (!res.ok) {
    const messages = json?.message;
    const errorMessage = Array.isArray(messages)
      ? messages.join(", ")
      : messages ?? "Gagal mengunggah foto";
    throw new Error(errorMessage);
  }

  const url = json?.url || json?.data?.url;
  if (!url) {
    throw new Error("Upload response missing url");
  }

  return url;
}

// ─── ADMIN USERS MANAGEMENT ───────────────────────────────────────────────────

export async function getAdminUsers(params?: {
  page?: number;
  perPage?: number;
  search?: string;
  gender?: string;
  sort?: string;
}) {
  const query = new URLSearchParams();
  if (params?.page) query.append("page", String(params.page));
  if (params?.perPage) query.append("perPage", String(params.perPage));
  if (params?.search) query.append("search", params.search);
  if (params?.gender) query.append("gender", params.gender);
  if (params?.sort) query.append("sort", params.sort);

  const res = await fetch(`${API_BASE_URL}/admin/users?${query.toString()}`, {
    credentials: "include",
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.message || "Gagal mengambil data user");
  }

  return result;
}

export async function getAdminUserDetail(id: string) {
  const res = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
    credentials: "include",
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.message || "Gagal mengambil detail user");
  }

  return result;
}

export async function updateAdminUser(
  id: string,
  data: { role?: string; status?: "active" | "inactive" }
) {
  const res = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) {
    const msg = Array.isArray(result.message)
      ? result.message.join(", ")
      : result.message;
    throw new Error(msg || "Gagal update user");
  }

  return result;
}