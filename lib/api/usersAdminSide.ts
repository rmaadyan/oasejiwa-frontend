import type {
  User,
  UserFormData,
  UserDetails,
} from "@/lib/types/users";
import { API_BASE_URL } from "./psychologist";

function getAdminToken() {
  if (typeof window !== "undefined") {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      ""
    );
  }
  return "";
}

function normalizeRoleToBackend(role?: string) {
  if (!role) return undefined;
  const upper = role.toUpperCase();
  if (upper === "PATIENT" || upper === "USER" || upper === "PASIEN") return "PATIENT";
  if (upper === "ADMIN") return "ADMIN";
  if (upper === "PSYCHOLOGIST" || upper === "PSIKOLOG") return "PSYCHOLOGIST";
  return upper;
}

function normalizeUserFromApi(user: any): User {
  const roleUpper = String(user.role || "").toUpperCase();
  const isPsychologist = roleUpper === "PSYCHOLOGIST" || roleUpper === "PSIKOLOG";
  const isAdmin = roleUpper === "ADMIN";

  return {
    id: user.id || user.userId || String(Math.random()),
    name: user.name || user.fullName || user.userProfile?.fullName || "User Oase Jiwa",
    email: user.email || "-",
    gender: user.gender ?? user.userProfile?.gender ?? null,
    role: (isPsychologist ? "psychologist" : isAdmin ? "admin" : "patient") as any,
    phone: user.phone || user.phoneNumber || user.userProfile?.phone || "-",
    registeredAt: user.registeredAt || user.joinedDate || user.createdAt || new Date().toISOString(),
    status: user.status ?? "active",
    bookingCount: user.bookingCount || user.stats?.totalBooking || user._count?.bookings || 0,
  };
}

export async function getUsers(params?: any) {
  try {
    const token = getAdminToken();
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set("page", String(params.page));
    if (params?.perPage) queryParams.set("limit", String(params.perPage));
    if (params?.sort) queryParams.set("sort", params.sort);
    if (params?.search) queryParams.set("search", params.search);

    const queryString = queryParams.toString();

    // 🟢 1. Coba Tembak Endpoint Utama /users
    let res = await fetch(
      `${API_BASE_URL}/users${queryString ? `?${queryString}` : ""}`,
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    // 🟢 2. Fallback Jika /users 404/Failed
    if (!res.ok) {
      res = await fetch(
        `${API_BASE_URL}/admin/users${queryString ? `?${queryString}` : ""}`,
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );
    }

    if (!res.ok) {
      console.warn(`[getUsers] Status API Gagal: ${res.status}`);
      return {
        users: [],
        total: 0,
        totalPages: 1,
        meta: { totalUsers: 0, totalPatients: 0, totalPsychologists: 0, totalAdmins: 0 },
      };
    }

    const text = await res.text();
    if (!text || text.trim() === "") {
      return {
        users: [],
        total: 0,
        totalPages: 1,
        meta: { totalUsers: 0, totalPatients: 0, totalPsychologists: 0, totalAdmins: 0 },
      };
    }

    const data = JSON.parse(text);

    // 🟢 Ekstrak Array Users dari Berbagai Kemungkinan Format Response NestJS
    const usersList =
      data?.users ||
      data?.data?.data ||
      data?.data?.users ||
      data?.data ||
      (Array.isArray(data) ? data : []);

    const cleanUsers = (Array.isArray(usersList) ? usersList : []).map(normalizeUserFromApi);

    const totalPatients = cleanUsers.filter((u: any) => u.role === "patient").length;
const totalPsychologists = cleanUsers.filter((u: any) => u.role === "psychologist").length;
const totalAdmins = cleanUsers.filter((u: any) => u.role === "admin").length;

    const total = data?.total || data?.meta?.total || cleanUsers.length;

    return {
      users: cleanUsers,
      total,
      totalPages: Math.ceil(total / (params?.perPage || 10)) || 1,
      meta: {
        totalUsers: total,
        totalPatients,
        totalPsychologists,
        totalAdmins,
      },
    };
  } catch (error) {
    console.error("Error getUsers:", error);
    return {
      users: [],
      total: 0,
      totalPages: 1,
      meta: { totalUsers: 0, totalPatients: 0, totalPsychologists: 0, totalAdmins: 0 },
    };
  }
}

export async function getUserById(id: string | number): Promise<User | null> {
  try {
    const token = getAdminToken();
    let res = await fetch(`${API_BASE_URL}/users/${id}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      res = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });
    }

    if (!res.ok) return null;
    const data = await res.json();
    return normalizeUserFromApi(data.data ?? data);
  } catch {
    return null;
  }
}

export async function getUserDetails(id: string | number): Promise<any> {
  const token = getAdminToken();
  let res = await fetch(`${API_BASE_URL}/users/${id}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    res = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
  }

  if (!res.ok) {
    throw new Error(`Gagal fetch detail user: status ${res.status}`);
  }

  return await res.json();
}

export async function updateUser(
  id: string | number,
  userData: Partial<UserFormData> & { status?: "active" | "inactive" }
): Promise<User> {
  const token = getAdminToken();
  const body: any = {};

  if (userData.role) {
    body.role = normalizeRoleToBackend(userData.role);
  }

  if (userData.status) {
    body.status = userData.status;
  }

  let res = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: "PATCH",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    res = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: "PATCH",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to update user: ${res.status} ${text}`);
  }

  const data = await res.json();
  return normalizeUserFromApi(data.data ?? data);
}

export async function deleteUser(id: string | number): Promise<void> {
  const token = getAdminToken();
  let res = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: "DELETE",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    res = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: "DELETE",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to delete user: ${res.status} ${text}`);
  }
}