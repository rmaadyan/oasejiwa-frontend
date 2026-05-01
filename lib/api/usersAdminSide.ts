import type {
  User,
  UserFormData,
  UsersResponse,
  UserDetails,
  UserQueryParams,
} from "@/lib/types/users";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.oasejiwa.id";

function normalizeSort(sort?: string) {
  if (sort === "name-asc") return "name_asc";
  if (sort === "name-desc") return "name_desc";
  return sort || "newest";
}

function normalizeRoleToBackend(role?: string) {
  if (!role) return undefined;

  const upper = role.toUpperCase();

  if (upper === "PATIENT") return "USER";
  if (upper === "USER") return "USER";
  if (upper === "ADMIN") return "ADMIN";
  if (upper === "PSYCHOLOGIST") return "PSYCHOLOGIST";

  return upper;
}

function normalizeUserFromApi(user: any): User {
  return {
    id: user.id,
    name: user.name ?? "-",
    email: user.email,
    gender: user.gender ?? null,
    role:
      user.role === "USER"
        ? "patient"
        : user.role?.toLowerCase?.() ?? user.role,
    phone: user.phone ?? null,
    registeredAt: user.registeredAt,
    status: user.status ?? "active",
    bookingCount: user.bookingCount ?? 0,
  };
}

function formatDateForDisplay(date?: string | Date | null) {
  if (!date) return "-";

  const rawDate = String(date);

  if (/^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
    const [year, month, day] = rawDate.split("-").map(Number);

    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(year, month - 1, day));
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export async function getUsers(
  params: UserQueryParams = {}
): Promise<UsersResponse> {
  const {
    page = 1,
    perPage = 10,
    sort = "newest",
    gender = "all",
    search = "",
  } = params;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    perPage: perPage.toString(),
    sort: normalizeSort(sort),
    gender,
    search,
  });

  const res = await fetch(`${API_BASE_URL}/admin-users?${queryParams}`, {
    cache: "no-store",
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch users: ${res.status} ${text}`);
  }

  const data = await res.json();

  return {
    users: (data.users || []).map(normalizeUserFromApi),
    total: data.total ?? 0,
    page: data.page ?? page,
    perPage: data.perPage ?? perPage,
    totalPages: data.totalPages ?? 1,
    meta: data.meta,
  } as UsersResponse;
}

export async function getUserById(id: string | number): Promise<User | null> {
  const res = await fetch(`${API_BASE_URL}/admin-users/${id}`, {
    cache: "no-store",
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch user: ${res.status} ${text}`);
  }

  const data = await res.json();
  return normalizeUserFromApi(data);
}

export async function getUserDetails(
  id: string | number
): Promise<UserDetails | null> {
  const res = await fetch(`${API_BASE_URL}/admin-users/${id}`, {
    cache: "no-store",
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch user details: ${res.status} ${text}`);
  }

  const data = await res.json();
  const user = normalizeUserFromApi(data);

  return {
    ...user,
    registeredAt: formatDateForDisplay(data.registeredAt ?? user.registeredAt),

    totalBookings: data.totalBookings ?? 0,
    completedBookings: data.completedBookings ?? 0,
    totalTransactions: data.totalTransactions ?? 0,
    totalSpent: data.totalSpent ?? 0,
    lastBooking: data.lastBooking
      ? formatDateForDisplay(data.lastBooking)
      : undefined,

    bookingHistory: (data.bookingHistory || []).map((booking: any) => ({
      ...booking,
      date: formatDateForDisplay(booking.date),
    })),

    transactionHistory: (data.transactionHistory || []).map(
      (transaction: any) => ({
        ...transaction,
        date: formatDateForDisplay(transaction.date),
      })
    ),
  } as UserDetails;
}

export async function createUser(_userData: UserFormData): Promise<User> {
  throw new Error("Create user belum tersedia di backend admin-users");
}

export async function updateUser(
  id: string | number,
  userData: Partial<UserFormData> & { status?: "active" | "inactive" }
): Promise<User> {
  const body: any = {};

  if (userData.role) {
    body.role = normalizeRoleToBackend(userData.role);
  }

  if (userData.status) {
    body.status = userData.status;
  }

  const res = await fetch(`${API_BASE_URL}/admin-users/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
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
  const res = await fetch(`${API_BASE_URL}/admin-users/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to delete user: ${res.status} ${text}`);
  }
}