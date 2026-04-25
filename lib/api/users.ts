import { mockUserDetails, mockUsers } from "@/lib/data/mock-ui-data";
import type {
    SortOption,
    User,
    UserDetails,
    UserFormData,
    UserQueryParams,
    UsersResponse
} from "@/lib/types/users";

// ========================================
// 🔧 CONFIG: Toggle antara mock dan real API
// ========================================
const USE_MOCK_DATA = true;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ========================================
// Helper: Delay untuk simulasi network
// ========================================
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ========================================
// 👥 GET: All Users dengan Sorting & Filter
// ========================================
export async function getUsers(params: UserQueryParams = {}): Promise<UsersResponse> {
    const {
        page = 1,
        perPage = 10,
        sort = "newest",
        gender = "all",
        search = ""
    } = params;

    if (USE_MOCK_DATA) {
        await delay(500);

        // Filter by gender
        let filteredUsers = [...mockUsers];
        if (gender !== "all") {
            filteredUsers = filteredUsers.filter(u => u.gender === gender);
        }

        // Filter by search
        if (search) {
            const searchLower = search.toLowerCase();
            filteredUsers = filteredUsers.filter(u =>
                u.name.toLowerCase().includes(searchLower) ||
                u.email.toLowerCase().includes(searchLower)
            );
        }

        // Sorting
        filteredUsers = sortUsers(filteredUsers, sort);

        // Pagination
        const total = filteredUsers.length;
        const totalPages = Math.ceil(total / perPage);
        const start = (page - 1) * perPage;
        const end = start + perPage;
        const paginatedUsers = filteredUsers.slice(start, end);

        return {
            users: paginatedUsers,
            total,
            page,
            perPage,
            totalPages
        };
    }

    // Real API call
    const queryParams = new URLSearchParams({
        page: page.toString(),
        perPage: perPage.toString(),
        sort,
        gender,
        search
    });

    const res = await fetch(
        `${API_BASE_URL}/api/admin/users?${queryParams}`,
        {
            cache: 'no-store',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json'
            }
        }
    );

    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
}

// ========================================
// 🔀 Helper: Sort Users
// ========================================
function sortUsers(users: User[], sort: SortOption): User[] {
    const sorted = [...users];

    switch (sort) {
        case "newest":
            return sorted.sort((a, b) => {
                const dateA = new Date(a.registeredAt || "").getTime();
                const dateB = new Date(b.registeredAt || "").getTime();
                return dateB - dateA;
            });

        case "oldest":
            return sorted.sort((a, b) => {
                const dateA = new Date(a.registeredAt || "").getTime();
                const dateB = new Date(b.registeredAt || "").getTime();
                return dateA - dateB;
            });

        case "name-asc":
            return sorted.sort((a, b) => a.name.localeCompare(b.name));

        case "name-desc":
            return sorted.sort((a, b) => b.name.localeCompare(a.name));

        case "most-bookings":
            return sorted.sort((a, b) => (b.bookingCount || 0) - (a.bookingCount || 0));

        default:
            return sorted;
    }
}

// ========================================
// 👤 GET: Single User by ID
// ========================================
export async function getUserById(id: number): Promise<User | null> {
    if (USE_MOCK_DATA) {
        await delay(300);
        return mockUsers.find(u => u.id === id) || null;
    }

    const res = await fetch(`${API_BASE_URL}/api/admin/users/${id}`, {
        cache: 'no-store',
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
            'Content-Type': 'application/json'
        }
    });

    if (!res.ok) throw new Error('Failed to fetch user');
    return res.json();
}

// ========================================
// 📋 GET: User Details dengan History
// ========================================
export async function getUserDetails(id: number): Promise<UserDetails | null> {
    if (USE_MOCK_DATA) {
        await delay(400);

        // Get base user
        const user = mockUsers.find(u => u.id === id);
        if (!user) return null;

        // Get details or return basic user details
        const details = mockUserDetails[id];
        if (details) {
            return details;
        }

        // Return basic details if no history
        return {
            ...user,
            totalBookings: user.bookingCount || 0,
            completedBookings: 0,
            totalSpent: 0,
            lastBooking: undefined,
            bookingHistory: [],
            transactionHistory: []
        };
    }

    const res = await fetch(`${API_BASE_URL}/api/admin/users/${id}/details`, {
        cache: 'no-store',
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
            'Content-Type': 'application/json'
        }
    });

    if (!res.ok) throw new Error('Failed to fetch user details');
    return res.json();
}

// ========================================
// ➕ POST: Create New User
// ========================================
export async function createUser(userData: UserFormData): Promise<User> {
    if (USE_MOCK_DATA) {
        await delay(600);

        // Simulate creating user
        const newUser: User = {
            id: mockUsers.length + 1,
            name: userData.name,
            email: userData.email,
            gender: userData.gender,
            role: userData.role,
            phone: userData.phone,
            registeredAt: new Date().toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            }),
            status: "active",
            bookingCount: 0
        };

        mockUsers.push(newUser);
        return newUser;
    }

    const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    });

    if (!res.ok) throw new Error('Failed to create user');
    return res.json();
}

// ========================================
// ✏️ PUT: Update User
// ========================================
export async function updateUser(id: number, userData: Partial<UserFormData>): Promise<User> {
    if (USE_MOCK_DATA) {
        await delay(600);

        const userIndex = mockUsers.findIndex(u => u.id === id);
        if (userIndex === -1) throw new Error('User not found');

        mockUsers[userIndex] = {
            ...mockUsers[userIndex],
            ...userData
        };

        return mockUsers[userIndex];
    }

    const res = await fetch(`${API_BASE_URL}/api/admin/users/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    });

    if (!res.ok) throw new Error('Failed to update user');
    return res.json();
}

// ========================================
// 🗑️ DELETE: Delete User
// ========================================
export async function deleteUser(id: number): Promise<void> {
    if (USE_MOCK_DATA) {
        await delay(400);

        const userIndex = mockUsers.findIndex(u => u.id === id);
        if (userIndex === -1) throw new Error('User not found');

        mockUsers.splice(userIndex, 1);
        return;
    }

    const res = await fetch(`${API_BASE_URL}/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
            'Content-Type': 'application/json'
        }
    });

    if (!res.ok) throw new Error('Failed to delete user');
}

// ========================================
// 🔐 Helper: Get Auth Token
// ========================================
function getAuthToken(): string {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('auth_token') || '';
    }
    return '';
}