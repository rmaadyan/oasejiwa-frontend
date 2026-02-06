// Booking types
export interface Booking {
  id: number;
  patient: string;
  service: string;
  psychologist: string;
  date: string;
  time: string;
  status: "confirmed" | "pending" | "completed" | "cancelled";
}

// Payment types
export interface Payment {
  id: number;
  patient: string;
  service: string;
  amount: number;
  uploadedAt: string;
  urgent: boolean;
  status?: "pending" | "approved" | "rejected";
}

// Schedule types
export interface Schedule {
  time: string;
  psychologist: string;
  patient: string;
  service: string;
}

// Alert types
export interface Alert {
  id: number;
  type: "urgent" | "info" | "success";
  title: string;
  description: string;
  action: string;
  link: string;
}

// Dashboard stats types
export interface DashboardStats {
  totalPatients: number;
  newPatientsThisMonth: number;
  todayBookings: number;
  upcomingBookings: number;
  pendingPayments: number;
  activePsychologists: number;
  totalPsychologists: number;
  monthlyRevenue: number;
  revenueGrowth: number;
  avgRating: number;
  totalReviews: number;
}

// API Response types
export interface DashboardDataResponse {
  stats: DashboardStats;
  recentBookings: Booking[];
  pendingPayments: Payment[];
  todaySchedule: Schedule[];
  alerts: Alert[];
}
