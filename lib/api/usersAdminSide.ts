import type {
  User,
  UserFormData,
  UserDetails,
} from "@/lib/types/users";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function normalizeRoleToBackend(role?: string) {
  if (!role) return undefined;
  const upper = role.toUpperCase();
  if (upper === "PATIENT" || upper === "USER") return "PATIENT";
  if (upper === "ADMIN") return "ADMIN";
  if (upper === "PSYCHOLOGIST" || upper === "PSIKOLOG") return "PSYCHOLOGIST";
  return upper;
}

function normalizeUserFromApi(user: any): User {
  const roleUpper = String(user.role || "").toUpperCase();
  const isPsychologist = roleUpper === "PSYCHOLOGIST" || roleUpper === "PSIKOLOG";

  return {
    id: user.id,
    name: user.name || user.fullName || "-",
    email: user.email,
    gender: user.gender ?? null,
    role: isPsychologist ? "psychologist" : "patient",
    phone: user.phone ?? "-",
    registeredAt: user.registeredAt || user.joinedDate || user.createdAt,
    status: user.status ?? "active",
    bookingCount: user.bookingCount || user.stats?.totalBooking || 0,
  };
}

export async function getUsers(params?: any) {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
    const res = await fetch(`${BACKEND_URL}/admin/users`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.warn(`[getUsers] Status API: ${res.status}`);
      return {
        users: [],
        total: 0,
        totalPages: 1,
        meta: { totalUsers: 0, totalPatients: 0, totalPsychologists: 0, totalAdmins: 0 },
      };
    }

    const data = await res.json();
    const usersList = Array.isArray(data) ? data : data.users || [];

    const totalPatients = usersList.filter((u: any) => {
      const r = String(u.role).toUpperCase();
      return r === "PATIENT" || r === "PASIEN" || r === "USER";
    }).length;

    const totalPsychologists = usersList.filter((u: any) => {
      const r = String(u.role).toUpperCase();
      return r === "PSYCHOLOGIST" || r === "PSIKOLOG";
    }).length;

    return {
      users: usersList.map(normalizeUserFromApi),
      total: usersList.length,
      totalPages: 1,
      meta: {
        totalUsers: usersList.length,
        totalPatients,
        totalPsychologists,
        totalAdmins: 0,
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
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
    const res = await fetch(`${BACKEND_URL}/admin/users/${id}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) return null;
    const data = await res.json();
    return normalizeUserFromApi(data);
  } catch {
    return null;
  }
}

export async function getUserDetails(id: string | number): Promise<any> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
  const res = await fetch(`${BACKEND_URL}/admin/users/${id}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Gagal fetch detail user: status ${res.status}`);
  }

  return await res.json();
}

export async function updateUser(
  id: string | number,
  userData: Partial<UserFormData> & { status?: "active" | "inactive" }
): Promise<User> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
  const body: any = {};

  if (userData.role) {
    body.role = normalizeRoleToBackend(userData.role);
  }

  if (userData.status) {
    body.status = userData.status;
  }

  const res = await fetch(`${BACKEND_URL}/admin/users/${id}`, {
    method: "PATCH",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to update user: ${res.status} ${text}`);
  }

  const data = await res.json();
  return normalizeUserFromApi(data.data ?? data);
}

export async function deleteUser(id: string | number): Promise<void> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
  const res = await fetch(`${BACKEND_URL}/admin/users/${id}`, {
    method: "DELETE",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to delete user: ${res.status} ${text}`);
  }
}