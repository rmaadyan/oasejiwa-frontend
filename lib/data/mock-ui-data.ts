// Mock data untuk development/preview UI
// Gunakan NEXT_PUBLIC_SHOW_MOCK_UI=true untuk menampilkan mock data

export interface AnalyticsData {
  stats: {
    totalUsers: number;
    totalVisitors: number;
  };
  bookings: {
    returning: number;
    new: number;
  };
  monthlyPatients: Array<{
    month: string;
    value: number;
  }>;
  revenue: {
    paid: number;
    dp: number;
  };
  topTests: Array<{
    id: string;
    name: string;
    percentage: number;
  }>;
  topServices: Array<{
    id: string;
    name: string;
    percentage: number;
  }>;
}

export const mockAnalyticsData: AnalyticsData = {
  stats: {
    totalUsers: 999,
    totalVisitors: 8888
  },
  bookings: {
    returning: 300,
    new: 300
  },
  monthlyPatients: [
    { month: "Jan", value: 100 }, 
    { month: "Feb", value: 10 },
    { month: "Mar", value: 100 },
    { month: "Apr", value: 150 },
    { month: "Mei", value: 50 },
    { month: "Jun", value: 50 },
    { month: "Jul", value: 100 },
    { month: "Agu", value: 20 },
    { month: "Sep", value: 60 },
    { month: "Okt", value: 80 },
    { month: "Nov", value: 90 },
    { month: "Des", value: 50 }
  ],
  revenue: {
    paid: 999000000,     // Angka yang sangat berbeda
    dp: 888000000
  },
  topTests: [
    { id: "1", name: "Konseling Depresi", percentage: 50 },  // Ubah percentage
    { id: "2", name: "Tes Kepribadian", percentage: 40 },
    { id: "3", name: "Tes Kecemasan", percentage: 30 },
    { id: "4", name: "Stress Assessment", percentage: 20 },
    { id: "5", name: "MBTI Testing", percentage: 10 }
  ],
  topServices: [
    { id: "1", name: "Konseling Umum", percentage: 50 },
    { id: "2", name: "Terapi Keluarga", percentage: 40 },
    { id: "3", name: "Konseling Karir", percentage: 30 },
    { id: "4", name: "Tes Psikologi", percentage: 20 },
    { id: "5", name: "Coaching Personal", percentage: 10 }
  ]
};


export interface MonthlyChartData {
  month: string;
  value: number;
}

export const mockMonthlyChartData: MonthlyChartData[] = [
  { month: "Jan", value: 45 },
  { month: "Feb", value: 52 },
  { month: "Mar", value: 48 },
  { month: "Apr", value: 61 },
  { month: "Mei", value: 55 },
  { month: "Jun", value: 67 },
  { month: "Jul", value: 72 },
  { month: "Agu", value: 58 },
  { month: "Sep", value: 64 },
  { month: "Okt", value: 71 },
  { month: "Nov", value: 69 },
  { month: "Des", value: 75 }
];

export const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
];

export const mockDashboardStats = {
  totalPatients: 156,
  newPatientsThisMonth: 12,
  todayBookings: 8,
  upcomingBookings: 3,
  pendingPayments: 5,
  monthlyRevenue: 45000000,
  revenueGrowth: 15,
  activePsychologists: 7,
  totalPsychologists: 10,
  avgRating: 4.8,
  totalReviews: 234
};

export const mockRecentBookings = [
  {
    id: "booking_001",
    patient: "John Doe",
    psychologist: "Dr. Sarah",
    service: "Konseling Umum",
    date: "2026-02-05",
    time: "14:00",
    status: "confirmed",
    duration: 60
  },
  {
    id: "booking_002",
    patient: "Jane Smith",
    psychologist: "Dr. Ahmad",
    service: "Tes Psikologi",
    date: "2026-02-05",
    time: "15:30",
    status: "confirmed",
    duration: 90
  },
  {
    id: "booking_003",
    patient: "Michael Brown",
    psychologist: "Dr. Sarah",
    service: "Terapi Keluarga",
    date: "2026-02-06",
    time: "09:00",
    status: "pending",
    duration: 120
  },
  {
    id: "booking_004",
    patient: "Lisa Anderson",
    psychologist: "Dr. Budi",
    service: "Konseling Karir",
    date: "2026-02-06",
    time: "10:30",
    status: "confirmed",
    duration: 60
  },
  {
    id: "booking_005",
    patient: "David Wilson",
    psychologist: "Dr. Sarah",
    service: "Konseling Umum",
    date: "2026-02-06",
    time: "14:00",
    status: "completed",
    duration: 60
  }
];

export const mockPendingPayments = [
  {
    id: "payment_001",
    patient: "Robert Johnson",
    amount: 500000,
    service: "Konseling Umum",
    date: "2026-02-01",
    dueDate: "2026-02-08",
    method: "transfer",
    status: "pending"
  },
  {
    id: "payment_002",
    patient: "Emma Davis",
    amount: 750000,
    service: "Tes Kepribadian",
    date: "2026-02-02",
    dueDate: "2026-02-09",
    method: "kartu_kredit",
    status: "pending"
  },
  {
    id: "payment_003",
    patient: "Mark Taylor",
    amount: 1000000,
    service: "Terapi Keluarga",
    date: "2026-02-03",
    dueDate: "2026-02-10",
    method: "transfer",
    status: "overdue"
  },
  {
    id: "payment_004",
    patient: "Sarah Martinez",
    amount: 450000,
    service: "Konseling Karir",
    date: "2026-02-04",
    dueDate: "2026-02-11",
    method: "transfer",
    status: "pending"
  },
  {
    id: "payment_005",
    patient: "James Garcia",
    amount: 600000,
    service: "Konseling Umum",
    date: "2026-02-04",
    dueDate: "2026-02-11",
    method: "kartu_kredit",
    status: "pending"
  }
];

export const mockTodaySchedule = [
  {
    id: "schedule_001",
    time: "09:00",
    psychologist: "Dr. Sarah",
    patient: "John Doe",
    duration: 60,
    status: "scheduled"
  },
  {
    id: "schedule_002",
    time: "10:30",
    psychologist: "Dr. Ahmad",
    patient: "Jane Smith",
    duration: 90,
    status: "scheduled"
  },
  {
    id: "schedule_003",
    time: "13:00",
    psychologist: "Dr. Budi",
    patient: "Michael Brown",
    duration: 60,
    status: "in_progress"
  },
  {
    id: "schedule_004",
    time: "14:30",
    psychologist: "Dr. Sarah",
    patient: "Lisa Anderson",
    duration: 60,
    status: "scheduled"
  },
  {
    id: "schedule_005",
    time: "16:00",
    psychologist: "Dr. Yuni",
    patient: "David Wilson",
    duration: 60,
    status: "scheduled"
  }
];

export const mockAlerts = [
  {
    id: 1,
    type: "urgent",
    title: "Pembayaran Overdue",
    description: "3 pembayaran melewati batas waktu pembayaran",
    action: "Lihat Detail",
    link: "/admin/payments"
  },
  {
    id: 2,
    type: "info",
    title: "Booking Baru",
    description: "5 booking baru masuk hari ini",
    action: "Lihat Booking",
    link: "/admin/bookings"
  },
  {
    id: 3,
    type: "success",
    title: "Rating Tinggi",
    description: "Psikolog 'Dr. Sarah' menerima rating 5 bintang",
    action: "Lihat Profil",
    link: "/admin/psychologists"
  }
];

export const mockAnalyticsStats = {
  totalUsers: 340,
  totalVisitors: 1250,
  totalBookings: 567,
  totalRevenue: 234500000
};

export const mockBookingData = [
  { date: "2026-01-29", count: 12 },
  { date: "2026-01-30", count: 15 },
  { date: "2026-01-31", count: 18 },
  { date: "2026-02-01", count: 14 },
  { date: "2026-02-02", count: 16 },
  { date: "2026-02-03", count: 20 },
  { date: "2026-02-04", count: 22 },
  { date: "2026-02-05", count: 8 }
];

export const mockMonthlyPatients = [
  { month: "Jan", count: 156 },
  { month: "Feb", count: 198 },
  { month: "Mar", count: 234 },
  { month: "Apr", count: 201 },
  { month: "Mei", count: 289 },
  { month: "Jun", count: 267 },
  { month: "Jul", count: 312 },
  { month: "Agu", count: 298 },
  { month: "Sep", count: 276 },
  { month: "Okt", count: 334 },
  { month: "Nov", count: 356 },
  { month: "Des", count: 289 }
];

// Data pasien per minggu (detail chart)
export const mockWeeklyPatients = [
  { week: "W1", count: 38 },
  { week: "W2", count: 42 },
  { week: "W3", count: 45 },
  { week: "W4", count: 51 },
  { week: "W5", count: 48 },
  { week: "W6", count: 55 }
];

// Data pasien per hari di bulan saat ini (Feb 2026)
export const mockDailyPatients = [
  { day: "01", date: "2026-02-01", count: 12 },
  { day: "02", date: "2026-02-02", count: 15 },
  { day: "03", date: "2026-02-03", count: 18 },
  { day: "04", date: "2026-02-04", count: 14 },
  { day: "05", date: "2026-02-05", count: 16 },
  { day: "06", date: "2026-02-06", count: 20 },
  { day: "07", date: "2026-02-07", count: 22 },
  { day: "08", date: "2026-02-08", count: 19 },
  { day: "09", date: "2026-02-09", count: 25 },
  { day: "10", date: "2026-02-10", count: 23 }
];

// Data pasien per kategori layanan per bulan
export const mockPatientsByService = [
  { service: "Konseling Umum", feb: 45, mar: 52, apr: 48 },
  { service: "Terapi Keluarga", feb: 28, mar: 35, apr: 32 },
  { service: "Tes Psikologi", feb: 35, mar: 42, apr: 38 },
  { service: "Konseling Karir", feb: 32, mar: 38, apr: 35 },
  { service: "Coaching Personal", feb: 25, mar: 30, apr: 28 },
  { service: "Stress Management", feb: 18, mar: 22, apr: 20 },
  { service: "CBT Therapy", feb: 15, mar: 18, apr: 16 }
];

// Data pertumbuhan pasien per psikolog
export const mockPatientsByPsychologist = [
  { name: "Dr. Sarah", patients: 156, growth: 12 },
  { name: "Dr. Ahmad", patients: 142, growth: 8 },
  { name: "Dr. Budi", patients: 128, growth: 15 },
  { name: "Dr. Maria", patients: 134, growth: 10 },
  { name: "Dr. Eka", patients: 115, growth: 18 },
  { name: "Dr. Rina", patients: 105, growth: 6 }
];

export const mockRevenueData = {
  paid: 189000000,
  dp: 45500000,
  total: 234500000
};

export const mockTopTests = [
  { id: "1", name: "Konseling Depresi", count: 87 },
  { id: "2", name: "Tes Kepribadian", count: 65 },
  { id: "3", name: "Tes Kecemasan", count: 54 },
  { id: "4", name: "Stress Assessment", count: 42 },
  { id: "5", name: "MBTI Testing", count: 38 }
];

export const mockTopServices = [
  { id: "1", name: "Konseling Umum", revenue: 45000000, bookings: 120, percentage: 28 },
  { id: "2", name: "Terapi Keluarga", revenue: 38000000, bookings: 95, percentage: 23 },
  { id: "3", name: "Konseling Karir", revenue: 32000000, bookings: 80, percentage: 19 },
  { id: "4", name: "Tes Psikologi", revenue: 28000000, bookings: 70, percentage: 17 },
  { id: "5", name: "Coaching Personal", revenue: 25000000, bookings: 62, percentage: 13 }
];

export const mockRecentPatients = [
  { 
    id: 1, 
    name: "Michael Brown", 
    date: "2026-02-05",
    service: "Konseling Umum",
    description: "Follow-up session",
    bookingCount: 8 
  },
  { 
    id: 2, 
    name: "David Wilson", 
    date: "2026-02-05",
    service: "Terapi Keluarga",
    description: "Family therapy session",
    bookingCount: 6 
  },
  { 
    id: 3, 
    name: "John Doe", 
    date: "2026-02-05",
    service: "Tes Psikologi",
    description: "Psychological assessment",
    bookingCount: 5 
  },
  { 
    id: 4, 
    name: "Jane Smith", 
    date: "2026-02-04",
    service: "Konseling Karir",
    description: "Career counseling",
    bookingCount: 3 
  },
  { 
    id: 5, 
    name: "Lisa Anderson", 
    date: "2026-02-03",
    service: "Coaching Personal",
    description: "Personal coaching session",
    bookingCount: 2 
  },
  { 
    id: 6, 
    name: "Sarah Johnson", 
    date: "2026-02-02",
    service: "Konseling Umum",
    description: "Initial consultation",
    bookingCount: 4 
  },
  { 
    id: 7, 
    name: "Robert Miller", 
    date: "2026-02-01",
    service: "Tes Kepribadian",
    description: "Personality test",
    bookingCount: 3 
  },
  { 
    id: 8, 
    name: "Emma Wilson", 
    date: "2026-01-31",
    service: "Terapi Keluarga",
    description: "Couples therapy",
    bookingCount: 7 
  },
  { 
    id: 9, 
    name: "James Davis", 
    date: "2026-01-30",
    service: "Konseling Depresi",
    description: "Depression counseling",
    bookingCount: 5 
  },
  { 
    id: 10, 
    name: "Patricia Anderson", 
    date: "2026-01-29",
    service: "Stress Management",
    description: "Stress management program",
    bookingCount: 2 
  },
  { 
    id: 11, 
    name: "Christopher Lee", 
    date: "2026-01-28",
    service: "Konseling Umum",
    description: "General counseling",
    bookingCount: 4 
  },
  { 
    id: 12, 
    name: "Jennifer Martinez", 
    date: "2026-01-27",
    service: "Tes Kecemasan",
    description: "Anxiety assessment",
    bookingCount: 1 
  }
];
