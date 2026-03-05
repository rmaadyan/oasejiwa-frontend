// User Interface
export interface User {
    id: number;
    name: string;
    email: string;
    gender: "male" | "female";
    role: "patient" | "psychologist";
    phone?: string;
    registeredAt?: string;
    status?: "active" | "inactive";
    bookingCount?: number; // ← Tambah untuk sorting
}

// User Create/Update DTO
export interface UserFormData {
    name: string;
    email: string;
    gender: "male" | "female";
    role: "patient" | "psychologist";
    phone?: string;
    password?: string;
}

// User Details dengan riwayat
export interface UserDetails extends User {
    totalBookings?: number;
    completedBookings?: number;
    totalSpent?: number;
    lastBooking?: string;
    bookingHistory?: Booking[];
    transactionHistory?: Transaction[];
}

// Booking History
export interface Booking {
    id: number;
    service: string;
    psychologist: string;
    date: string;
    time: string;
    status: "completed" | "cancelled" | "upcoming";
    price: number;
}

// Transaction History
export interface Transaction {
    id: number;
    date: string;
    description: string;
    amount: number;
    status: "paid" | "pending" | "cancelled";
    paymentMethod?: string;
}

// Sorting & Filter Options
export type SortOption = "newest" | "oldest" | "name-asc" | "name-desc" | "most-bookings";
export type GenderFilter = "all" | "male" | "female";

// Query Params untuk API
export interface UserQueryParams {
    page?: number;
    perPage?: number;
    sort?: SortOption;
    gender?: GenderFilter;
    search?: string;
}

// API Response
export interface UsersResponse {
    users: User[];
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
}