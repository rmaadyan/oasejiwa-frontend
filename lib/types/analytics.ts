// Analytics Statistics
export interface AnalyticsStats {
  totalUsers: number;
  totalVisitors: number;
  activeUsers?: number;
  bounceRate?: number;
}

// Booking Data
export interface BookingData {
  returning: number;
  new: number;
}

// Monthly Patients
export interface MonthlyPatient {
  month: string;
  value: number;
}

// Revenue
export interface Revenue {
  paid: number;
  dp: number;
  pending?: number;
}

// Top Test/Service Item
export interface TopItem {
  id: number;
  name: string;
  percentage: number;
  count?: number;
}

// Patient Data
export interface Patient {
  id: number;
  name: string;
  date: string;
  service: string;
  description: string;
}

// Complete Analytics Data Response
export interface AnalyticsDataResponse {
  stats: AnalyticsStats;
  bookings: BookingData;
  monthlyPatients: MonthlyPatient[];
  revenue: Revenue;
  topTests: TopItem[];
  topServices: TopItem[];
  recentPatients: Patient[];
}
