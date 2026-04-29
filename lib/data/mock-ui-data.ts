// Mock data untuk development/preview UI
// Gunakan NEXT_PUBLIC_SHOW_MOCK_UI=true untuk menampilkan mock data
import type {
  Psychologist,
  PsychologistDashboardStats,
  PsychologistPatient,
  PsychologistPatientDetail,
  Session,
  SessionNote
} from "@/lib/types/psychologist.ts";
import type { User, UserDetails } from "@/lib/types/users";


// ========================================
// 👥 USERS MANAGEMENT DATA
// ========================================
export const mockUsers: User[] = [
  {
    id: 1,
    name: "Budi Santoso",
    email: "budi.santoso@email.com",
    gender: "male",
    role: "patient",
    phone: "081234567890",
    registeredAt: "15 Jan 2026",
    status: "active",
    bookingCount: 3
  },
  {
    id: 2,
    name: "Siti Rahayu",
    email: "siti.rahayu@email.com",
    gender: "female",
    role: "patient",
    phone: "082345678901",
    registeredAt: "18 Jan 2026",
    status: "active",
    bookingCount: 1
  },
  {
    id: 3,
    name: "Ahmad Rizki",
    email: "ahmad.rizki@email.com",
    gender: "male",
    role: "patient",
    phone: "083456789012",
    registeredAt: "20 Jan 2026",
    status: "active",
    bookingCount: 5
  },
  {
    id: 4,
    name: "Dewi Lestari",
    email: "dewi.lestari@email.com",
    gender: "female",
    role: "patient",
    phone: "084567890123",
    registeredAt: "22 Jan 2026",
    status: "active",
    bookingCount: 2
  },
  {
    id: 5,
    name: "Eko Prasetyo",
    email: "eko.prasetyo@email.com",
    gender: "male",
    role: "patient",
    phone: "085678901234",
    registeredAt: "25 Jan 2026",
    status: "active",
    bookingCount: 4
  },
  {
    id: 6,
    name: "Dr. Ani Wijaya",
    email: "ani.wijaya@oasejiwa.com",
    gender: "female",
    role: "psychologist",
    phone: "081234567899",
    registeredAt: "10 Jan 2026",
    status: "active",
    bookingCount: 0
  },
  {
    id: 7,
    name: "Rina Kusuma",
    email: "rina.kusuma@email.com",
    gender: "female",
    role: "patient",
    phone: "086789012345",
    registeredAt: "28 Jan 2026",
    status: "active",
    bookingCount: 6
  },
  {
    id: 8,
    name: "Fajar Nugroho",
    email: "fajar.nugroho@email.com",
    gender: "male",
    role: "patient",
    phone: "087890123456",
    registeredAt: "30 Jan 2026",
    status: "inactive",
    bookingCount: 1
  },
  {
    id: 9,
    name: "Dr. Budi Hartono",
    email: "budi.hartono@oasejiwa.com",
    gender: "male",
    role: "psychologist",
    phone: "081234567898",
    registeredAt: "12 Jan 2026",
    status: "active",
    bookingCount: 0
  },
  {
    id: 10,
    name: "Maya Sari",
    email: "maya.sari@email.com",
    gender: "female",
    role: "patient",
    phone: "088901234567",
    registeredAt: "1 Feb 2026",
    status: "active",
    bookingCount: 8
  },
];


// ========================================
// 📋 USER DETAILS WITH HISTORY (Admin View)
// ========================================
export const mockUserDetails: Record<number, UserDetails> = {
  1: {
    ...mockUsers[0],
    totalBookings: 3,
    completedBookings: 3,
    totalSpent: 600000,
    lastBooking: "9 Feb 2026",
    bookingHistory: [
      {
        id: 101,
        service: "Konseling Individu",
        psychologist: "Dr. Ani Wijaya",
        date: "9 Feb 2026",
        time: "09:00",
        status: "completed",
        price: 200000
      },
      {
        id: 102,
        service: "Konseling Individu",
        psychologist: "Dr. Ani Wijaya",
        date: "5 Feb 2026",
        time: "09:00",
        status: "completed",
        price: 200000
      },
      {
        id: 103,
        service: "Konseling Individu",
        psychologist: "Dr. Ani Wijaya",
        date: "15 Jan 2026",
        time: "14:00",
        status: "completed",
        price: 200000
      },
    ],
    transactionHistory: [
      {
        id: 201,
        date: "9 Feb 2026",
        description: "Konseling Individu - Dr. Ani Wijaya",
        amount: 200000,
        status: "paid",
        paymentMethod: "Transfer Bank"
      },
      {
        id: 202,
        date: "5 Feb 2026",
        description: "Konseling Individu - Dr. Ani Wijaya",
        amount: 200000,
        status: "paid",
        paymentMethod: "E-Wallet"
      },
      {
        id: 203,
        date: "15 Jan 2026",
        description: "Konseling Individu - Dr. Ani Wijaya",
        amount: 200000,
        status: "paid",
        paymentMethod: "Transfer Bank"
      },
    ]
  },
  2: {
    ...mockUsers[1],
    totalBookings: 1,
    completedBookings: 1,
    totalSpent: 200000,
    lastBooking: "9 Feb 2026",
    bookingHistory: [
      {
        id: 104,
        service: "Konseling Individu",
        psychologist: "Dr. Ani Wijaya",
        date: "9 Feb 2026",
        time: "11:00",
        status: "completed",
        price: 200000
      },
    ],
    transactionHistory: [
      {
        id: 204,
        date: "9 Feb 2026",
        description: "Konseling Individu - Dr. Ani Wijaya",
        amount: 200000,
        status: "paid",
        paymentMethod: "Transfer Bank"
      },
    ]
  },
  3: {
    ...mockUsers[2],
    totalBookings: 5,
    completedBookings: 5,
    totalSpent: 925000,
    lastBooking: "5 Feb 2026",
    bookingHistory: [
      {
        id: 105,
        service: "Konsultasi Psikologi",
        psychologist: "Dr. Ani Wijaya",
        date: "5 Feb 2026",
        time: "14:00",
        status: "completed",
        price: 150000
      },
      {
        id: 106,
        service: "Konsultasi Psikologi",
        psychologist: "Dr. Ani Wijaya",
        date: "1 Feb 2026",
        time: "14:00",
        status: "completed",
        price: 150000
      },
      {
        id: 107,
        service: "Konseling Individu",
        psychologist: "Dr. Ani Wijaya",
        date: "28 Jan 2026",
        time: "10:00",
        status: "completed",
        price: 200000
      },
      {
        id: 108,
        service: "Konsultasi Psikologi",
        psychologist: "Dr. Ani Wijaya",
        date: "25 Jan 2026",
        time: "14:00",
        status: "completed",
        price: 150000
      },
      {
        id: 109,
        service: "Mental Health Check-Up",
        psychologist: "Dr. Ani Wijaya",
        date: "20 Jan 2026",
        time: "09:00",
        status: "completed",
        price: 275000
      },
    ],
    transactionHistory: [
      {
        id: 205,
        date: "5 Feb 2026",
        description: "Konsultasi Psikologi - Dr. Ani Wijaya",
        amount: 150000,
        status: "paid",
        paymentMethod: "E-Wallet"
      },
      {
        id: 206,
        date: "1 Feb 2026",
        description: "Konsultasi Psikologi - Dr. Ani Wijaya",
        amount: 150000,
        status: "paid",
        paymentMethod: "Transfer Bank"
      },
      {
        id: 207,
        date: "28 Jan 2026",
        description: "Konseling Individu - Dr. Ani Wijaya",
        amount: 200000,
        status: "paid",
        paymentMethod: "E-Wallet"
      },
      {
        id: 208,
        date: "25 Jan 2026",
        description: "Konsultasi Psikologi - Dr. Ani Wijaya",
        amount: 150000,
        status: "paid",
        paymentMethod: "Transfer Bank"
      },
      {
        id: 209,
        date: "20 Jan 2026",
        description: "Mental Health Check-Up - Dr. Ani Wijaya",
        amount: 275000,
        status: "paid",
        paymentMethod: "Transfer Bank"
      },
    ]
  },
  4: {
    ...mockUsers[3],
    totalBookings: 2,
    completedBookings: 2,
    totalSpent: 400000,
    lastBooking: "7 Feb 2026",
    bookingHistory: [
      {
        id: 110,
        service: "Konseling Individu",
        psychologist: "Dr. Ani Wijaya",
        date: "7 Feb 2026",
        time: "13:00",
        status: "completed",
        price: 200000
      },
      {
        id: 111,
        service: "Konseling Individu",
        psychologist: "Dr. Ani Wijaya",
        date: "22 Jan 2026",
        time: "15:00",
        status: "completed",
        price: 200000
      },
    ],
    transactionHistory: [
      {
        id: 210,
        date: "7 Feb 2026",
        description: "Konseling Individu - Dr. Ani Wijaya",
        amount: 200000,
        status: "paid",
        paymentMethod: "E-Wallet"
      },
      {
        id: 211,
        date: "22 Jan 2026",
        description: "Konseling Individu - Dr. Ani Wijaya",
        amount: 200000,
        status: "paid",
        paymentMethod: "Transfer Bank"
      },
    ]
  },
  5: {
    ...mockUsers[4],
    totalBookings: 4,
    completedBookings: 3,
    totalSpent: 600000,
    lastBooking: "6 Feb 2026",
    bookingHistory: [
      {
        id: 112,
        service: "Konseling Individu",
        psychologist: "Dr. Ani Wijaya",
        date: "6 Feb 2026",
        time: "11:00",
        status: "completed",
        price: 200000
      },
      {
        id: 113,
        service: "Konseling Individu",
        psychologist: "Dr. Ani Wijaya",
        date: "2 Feb 2026",
        time: "09:00",
        status: "completed",
        price: 200000
      },
      {
        id: 114,
        service: "Konseling Individu",
        psychologist: "Dr. Ani Wijaya",
        date: "28 Jan 2026",
        time: "11:00",
        status: "cancelled",
        price: 200000
      },
      {
        id: 115,
        service: "Konseling Individu",
        psychologist: "Dr. Ani Wijaya",
        date: "25 Jan 2026",
        time: "16:00",
        status: "completed",
        price: 200000
      },
    ],
    transactionHistory: [
      {
        id: 212,
        date: "6 Feb 2026",
        description: "Konseling Individu - Dr. Ani Wijaya",
        amount: 200000,
        status: "paid",
        paymentMethod: "Transfer Bank"
      },
      {
        id: 213,
        date: "2 Feb 2026",
        description: "Konseling Individu - Dr. Ani Wijaya",
        amount: 200000,
        status: "paid",
        paymentMethod: "E-Wallet"
      },
      {
        id: 214,
        date: "25 Jan 2026",
        description: "Konseling Individu - Dr. Ani Wijaya",
        amount: 200000,
        status: "paid",
        paymentMethod: "Transfer Bank"
      },
    ]
  },
};


// ========================================
// 👨‍⚕️ PSYCHOLOGIST PROFILE & DASHBOARD
// ========================================
export const mockPsychologistProfile: Psychologist = {
  id: 6,
  name: "Dr. Ani Wijaya",
  email: "ani.wijaya@oasejiwa.com",
  phone: "081234567899",
  photo: "/images/psychologist/ani-wijaya.jpg",
  specialization: ["Anxiety Disorders", "Depression", "Relationship Counseling"],
  bio: "Psikolog klinis dengan pengalaman 8 tahun menangani kasus kecemasan, depresi, dan konseling hubungan.",
  education: [
    "S2 Psikologi Klinis - Universitas Indonesia (2016)",
    "S1 Psikologi - Universitas Gadjah Mada (2014)"
  ],
  certifications: [
    "Sertifikat Cognitive Behavioral Therapy (CBT)",
    "Sertifikat Mindfulness-Based Stress Reduction"
  ],
  sipp: "SIPP.1234.5678.9012",
  languages: ["Indonesian", "English"],
  experience: 8,
  rating: 4.8,
  totalReviews: 127,
  status: "active",
  joinedDate: "10 Jan 2026"
};

export const mockPsychologistDashboardStats: PsychologistDashboardStats = {
  todaySessions: 4,
  todayCompleted: 2,
  weekSessions: 18,
  totalPatients: 5,
  activePatientsThisMonth: 5,
  totalLifetimeSessions: 15,
  averageRating: 4.8,
  nextSessionTime: "14:00"
};


// ========================================
// 📅 SESSIONS DATA (Psychologist View)
// ========================================

// Today's Sessions (10 Feb 2026)
export const mockTodaySessions: Session[] = [
  {
    id: 1,
    patientId: 1,
    patientName: "Budi Santoso",
    service: "Konseling Individu",
    date: "10 Feb 2026",
    time: "09:00",
    duration: 60,
    status: "completed",
    paymentStatus: "paid",
    sessionNumber: 4,
    meetingLink: "https://meet.oasejiwa.com/session-1"
  },
  {
    id: 2,
    patientId: 5,
    patientName: "Eko Prasetyo",
    service: "Konseling Individu",
    date: "10 Feb 2026",
    time: "10:00",
    duration: 60,
    status: "upcoming",
    paymentStatus: "paid",
    sessionNumber: 5,
    meetingLink: "https://meet.oasejiwa.com/session-2"
  },
  {
    id: 3,
    patientId: 3,
    patientName: "Ahmad Rizki",
    service: "Konsultasi Psikologi",
    date: "10 Feb 2026",
    time: "14:00",
    duration: 45,
    status: "upcoming",
    paymentStatus: "paid",
    sessionNumber: 6,
    meetingLink: "https://meet.oasejiwa.com/session-3"
  },
  {
    id: 4,
    patientId: 7,
    patientName: "Rina Kusuma",
    service: "Mental Health Check-Up",
    date: "10 Feb 2026",
    time: "16:00",
    duration: 45,
    status: "upcoming",
    paymentStatus: "paid",
    sessionNumber: 2,
    meetingLink: "https://meet.oasejiwa.com/session-4"
  }
];

// Upcoming Sessions (Future)
export const mockUpcomingSessions: Session[] = [
  {
    id: 5,
    patientId: 1,
    patientName: "Budi Santoso",
    service: "Konseling Individu",
    date: "11 Feb 2026",
    time: "09:00",
    duration: 60,
    status: "upcoming",
    paymentStatus: "paid",
    sessionNumber: 5
  },
  {
    id: 6,
    patientId: 4,
    patientName: "Dewi Lestari",
    service: "Konseling Individu",
    date: "14 Feb 2026",
    time: "13:00",
    duration: 60,
    status: "upcoming",
    paymentStatus: "paid",
    sessionNumber: 3
  },
  {
    id: 7,
    patientId: 5,
    patientName: "Eko Prasetyo",
    service: "Konseling Individu",
    date: "13 Feb 2026",
    time: "10:00",
    duration: 60,
    status: "upcoming",
    paymentStatus: "paid",
    sessionNumber: 6
  },
  {
    id: 8,
    patientId: 2,
    patientName: "Siti Rahayu",
    service: "Konseling Individu",
    date: "16 Feb 2026",
    time: "11:00",
    duration: 60,
    status: "upcoming",
    paymentStatus: "paid",
    sessionNumber: 2
  },
  {
    id: 9,
    patientId: 10,
    patientName: "Maya Sari",
    service: "Konseling Individu",
    date: "17 Feb 2026",
    time: "14:00",
    duration: 60,
    status: "upcoming",
    paymentStatus: "pending",
    sessionNumber: 1
  }
];

// All Sessions (Combined: Past + Today + Upcoming)
export const mockAllSessions: Session[] = [
  // Past Sessions (Completed/Cancelled) - Sorted by date DESC
  {
    id: 20,
    patientId: 1,
    patientName: "Budi Santoso",
    service: "Konseling Individu",
    date: "9 Feb 2026",
    time: "09:00",
    duration: 60,
    status: "completed",
    paymentStatus: "paid",
    sessionNumber: 3
  },
  {
    id: 19,
    patientId: 4,
    patientName: "Dewi Lestari",
    service: "Konseling Individu",
    date: "7 Feb 2026",
    time: "13:00",
    duration: 60,
    status: "completed",
    paymentStatus: "paid",
    sessionNumber: 2
  },
  {
    id: 18,
    patientId: 5,
    patientName: "Eko Prasetyo",
    service: "Konseling Individu",
    date: "6 Feb 2026",
    time: "11:00",
    duration: 60,
    status: "completed",
    paymentStatus: "paid",
    sessionNumber: 4
  },
  {
    id: 17,
    patientId: 1,
    patientName: "Budi Santoso",
    service: "Konseling Individu",
    date: "5 Feb 2026",
    time: "09:00",
    duration: 60,
    status: "completed",
    paymentStatus: "paid",
    sessionNumber: 2
  },
  {
    id: 16,
    patientId: 3,
    patientName: "Ahmad Rizki",
    service: "Konsultasi Psikologi",
    date: "5 Feb 2026",
    time: "14:00",
    duration: 45,
    status: "completed",
    paymentStatus: "paid",
    sessionNumber: 5
  },
  {
    id: 15,
    patientId: 5,
    patientName: "Eko Prasetyo",
    service: "Konseling Individu",
    date: "2 Feb 2026",
    time: "09:00",
    duration: 60,
    status: "completed",
    paymentStatus: "paid",
    sessionNumber: 3
  },
  {
    id: 14,
    patientId: 3,
    patientName: "Ahmad Rizki",
    service: "Konsultasi Psikologi",
    date: "1 Feb 2026",
    time: "14:00",
    duration: 45,
    status: "completed",
    paymentStatus: "paid",
    sessionNumber: 4
  },
  {
    id: 13,
    patientId: 7,
    patientName: "Rina Kusuma",
    service: "Mental Health Check-Up",
    date: "1 Feb 2026",
    time: "10:00",
    duration: 45,
    status: "completed",
    paymentStatus: "paid",
    sessionNumber: 1
  },
  {
    id: 12,
    patientId: 5,
    patientName: "Eko Prasetyo",
    service: "Konseling Individu",
    date: "28 Jan 2026",
    time: "11:00",
    duration: 60,
    status: "cancelled",
    paymentStatus: "paid",
    sessionNumber: 2
  },
  {
    id: 11,
    patientId: 3,
    patientName: "Ahmad Rizki",
    service: "Konseling Individu",
    date: "28 Jan 2026",
    time: "10:00",
    duration: 60,
    status: "completed",
    paymentStatus: "paid",
    sessionNumber: 3
  },
  {
    id: 10,
    patientId: 3,
    patientName: "Ahmad Rizki",
    service: "Konsultasi Psikologi",
    date: "25 Jan 2026",
    time: "14:00",
    duration: 45,
    status: "completed",
    paymentStatus: "paid",
    sessionNumber: 2
  },
  {
    id: 24,
    patientId: 5,
    patientName: "Eko Prasetyo",
    service: "Konseling Individu",
    date: "25 Jan 2026",
    time: "16:00",
    duration: 60,
    status: "completed",
    paymentStatus: "paid",
    sessionNumber: 1
  },
  {
    id: 23,
    patientId: 4,
    patientName: "Dewi Lestari",
    service: "Konseling Individu",
    date: "22 Jan 2026",
    time: "15:00",
    duration: 60,
    status: "completed",
    paymentStatus: "paid",
    sessionNumber: 1
  },
  {
    id: 22,
    patientId: 3,
    patientName: "Ahmad Rizki",
    service: "Mental Health Check-Up",
    date: "20 Jan 2026",
    time: "09:00",
    duration: 60,
    status: "completed",
    paymentStatus: "paid",
    sessionNumber: 1
  },
  {
    id: 21,
    patientId: 1,
    patientName: "Budi Santoso",
    service: "Konseling Individu",
    date: "15 Jan 2026",
    time: "14:00",
    duration: 60,
    status: "completed",
    paymentStatus: "paid",
    sessionNumber: 1
  },
  {
    id: 25,
    patientId: 2,
    patientName: "Siti Rahayu",
    service: "Konseling Individu",
    date: "9 Feb 2026",
    time: "11:00",
    duration: 60,
    status: "completed",
    paymentStatus: "paid",
    sessionNumber: 1
  },
  // Today's Sessions
  ...mockTodaySessions,
  // Upcoming Sessions
  ...mockUpcomingSessions,
];


// ========================================
// 👥 PATIENTS DATA (Psychologist View)
// ========================================

// All Patients List
export const mockAllPatients: PsychologistPatient[] = [
  {
    id: "1",
    name: "Budi Santoso",
    email: "budi.santoso@email.com",
    firstSessionDate: "15 Jan 2026",
    lastSessionDate: "9 Feb 2026",
    totalSessions: 3,
    upcomingSessionDate: "11 Feb 2026"
  },
  {
    id: "2",
    name: "Siti Rahayu",
    email: "siti.rahayu@email.com",
    firstSessionDate: "9 Feb 2026",
    lastSessionDate: "9 Feb 2026",
    totalSessions: 1,
    upcomingSessionDate: "16 Feb 2026"
  },
  {
    id: "3",
    name: "Ahmad Rizki",
    email: "ahmad.rizki@email.com",
    firstSessionDate: "20 Jan 2026",
    lastSessionDate: "5 Feb 2026",
    totalSessions: 5,
    upcomingSessionDate: "10 Feb 2026"
  },
  {
    id: "4",
    name: "Dewi Lestari",
    email: "dewi.lestari@email.com",
    firstSessionDate: "22 Jan 2026",
    lastSessionDate: "7 Feb 2026",
    totalSessions: 2,
    upcomingSessionDate: "14 Feb 2026"
  },
  {
    id: "5",
    name: "Eko Prasetyo",
    email: "eko.prasetyo@email.com",
    firstSessionDate: "25 Jan 2026",
    lastSessionDate: "6 Feb 2026",
    totalSessions: 4,
    upcomingSessionDate: "13 Feb 2026"
  }
];

// Recent/Active Patients (for dashboard)
export const mockRecentPatients: PsychologistPatient[] = mockAllPatients.slice(0, 3);


// ========================================
// 📝 PATIENT DETAILS (Psychologist View)
// ========================================
export const mockPatientDetails: Record<string, PsychologistPatientDetail> = {
  // Budi Santoso - 3 Sessions
  "1": {
    id: "1",
    name: "Budi Santoso",
    email: "budi.santoso@email.com",
    phone: "081234567890",
    age: 28,
    gender: "male",
    address: "Jl. Merdeka No. 123, Jakarta",
    firstSessionDate: "15 Jan 2026",
    lastSessionDate: "9 Feb 2026",
    totalSessions: 3,
    upcomingSessionDate: "11 Feb 2026",
    emergencyContact: {
      name: "Siti Santoso",
      phone: "082234567890",
      relation: "Istri"
    },
    diagnosis: ["Anxiety Disorder", "Work Stress"],
    currentMedication: ["Alprazolam 0.5mg"],
    allergies: ["Tidak ada"],
    sessionHistory: [
      {
        id: "20",
        date: "9 Feb 2026",
        time: "09:00",
        duration: 60,
        service: "Konseling Individu",
        status: "completed",
        hasNotes: true
      },
      {
        id: "17",
        date: "5 Feb 2026",
        time: "09:00",
        duration: 60,
        service: "Konseling Individu",
        status: "completed",
        hasNotes: true
      },
      {
        id: "21",
        date: "15 Jan 2026",
        time: "14:00",
        duration: 60,
        service: "Konseling Individu",
        status: "completed",
        hasNotes: true
      }
    ],
    lastNotes: "Pasien menunjukkan perkembangan positif dalam mengelola kecemasan. Progress baik dengan CBT techniques."
  },

  // Siti Rahayu - 1 Session
  "2": {
    id: "2",
    name: "Siti Rahayu",
    email: "siti.rahayu@email.com",
    phone: "082345678901",
    age: 35,
    gender: "female",
    address: "Jl. Sudirman No. 456, Bandung",
    firstSessionDate: "9 Feb 2026",
    lastSessionDate: "9 Feb 2026",
    totalSessions: 1,
    upcomingSessionDate: "16 Feb 2026",
    emergencyContact: {
      name: "Ahmad Rahayu",
      phone: "083345678901",
      relation: "Suami"
    },
    diagnosis: ["Major Depressive Disorder"],
    currentMedication: ["Fluoxetine 20mg"],
    allergies: ["Penicillin"],
    sessionHistory: [
      {
        id: "25",
        date: "9 Feb 2026",
        time: "11:00",
        duration: 60,
        service: "Konseling Individu",
        status: "completed",
        hasNotes: true
      }
    ],
    lastNotes: "Sesi pertama berjalan baik. Pasien terbuka dan kooperatif. Sudah dimulai medikasi oleh psikiater."
  },

  // Ahmad Rizki - 5 Sessions
  "3": {
    id: "3",
    name: "Ahmad Rizki",
    email: "ahmad.rizki@email.com",
    phone: "083456789012",
    age: 32,
    gender: "male",
    address: "Jl. Gatot Subroto No. 789, Surabaya",
    firstSessionDate: "20 Jan 2026",
    lastSessionDate: "5 Feb 2026",
    totalSessions: 5,
    upcomingSessionDate: "10 Feb 2026",
    emergencyContact: {
      name: "Dewi Rizki",
      phone: "084456789012",
      relation: "Istri"
    },
    diagnosis: ["Panic Disorder", "Social Anxiety"],
    currentMedication: ["Sertraline 50mg"],
    allergies: ["Tidak ada"],
    sessionHistory: [
      {
        id: "16",
        date: "5 Feb 2026",
        time: "14:00",
        duration: 45,
        service: "Konsultasi Psikologi",
        status: "completed",
        hasNotes: true
      },
      {
        id: "14",
        date: "1 Feb 2026",
        time: "14:00",
        duration: 45,
        service: "Konsultasi Psikologi",
        status: "completed",
        hasNotes: true
      },
      {
        id: "11",
        date: "28 Jan 2026",
        time: "10:00",
        duration: 60,
        service: "Konseling Individu",
        status: "completed",
        hasNotes: true
      },
      {
        id: "10",
        date: "25 Jan 2026",
        time: "14:00",
        duration: 45,
        service: "Konsultasi Psikologi",
        status: "completed",
        hasNotes: true
      },
      {
        id: "22",
        date: "20 Jan 2026",
        time: "09:00",
        duration: 60,
        service: "Mental Health Check-Up",
        status: "completed",
        hasNotes: true
      }
    ],
    lastNotes: "Progress sangat baik. Panic attack berkurang drastis. Siap memasuki termination phase."
  },

  // Dewi Lestari - 2 Sessions
  "4": {
    id: "4",
    name: "Dewi Lestari",
    email: "dewi.lestari@email.com",
    phone: "084567890123",
    age: 29,
    gender: "female",
    address: "Jl. Diponegoro No. 234, Yogyakarta",
    firstSessionDate: "22 Jan 2026",
    lastSessionDate: "7 Feb 2026",
    totalSessions: 2,
    upcomingSessionDate: "14 Feb 2026",
    emergencyContact: {
      name: "Rina Lestari",
      phone: "085567890123",
      relation: "Kakak"
    },
    diagnosis: ["Adjustment Disorder", "Relationship Issues"],
    currentMedication: ["Tidak ada"],
    allergies: ["Tidak ada"],
    sessionHistory: [
      {
        id: "19",
        date: "7 Feb 2026",
        time: "13:00",
        duration: 60,
        service: "Konseling Individu",
        status: "completed",
        hasNotes: true
      },
      {
        id: "23",
        date: "22 Jan 2026",
        time: "15:00",
        duration: 60,
        service: "Konseling Individu",
        status: "completed",
        hasNotes: true
      }
    ],
    lastNotes: "Pasien mengalami kesulitan dalam hubungan interpersonal. Merespons baik terhadap terapi supportif."
  },

  // Eko Prasetyo - 4 Sessions (3 completed + 1 cancelled)
  "5": {
    id: "5",
    name: "Eko Prasetyo",
    email: "eko.prasetyo@email.com",
    phone: "085678901234",
    age: 30,
    gender: "male",
    address: "Jl. Ahmad Yani No. 567, Semarang",
    firstSessionDate: "25 Jan 2026",
    lastSessionDate: "6 Feb 2026",
    totalSessions: 4,
    upcomingSessionDate: "13 Feb 2026",
    emergencyContact: {
      name: "Lina Prasetyo",
      phone: "086678901234",
      relation: "Istri"
    },
    diagnosis: ["Generalized Anxiety Disorder", "Insomnia"],
    currentMedication: ["Escitalopram 10mg", "Melatonin 3mg"],
    allergies: ["Tidak ada"],
    sessionHistory: [
      {
        id: "18",
        date: "6 Feb 2026",
        time: "11:00",
        duration: 60,
        service: "Konseling Individu",
        status: "completed",
        hasNotes: true
      },
      {
        id: "15",
        date: "2 Feb 2026",
        time: "09:00",
        duration: 60,
        service: "Konseling Individu",
        status: "completed",
        hasNotes: true
      },
      {
        id: "12",
        date: "28 Jan 2026",
        time: "11:00",
        duration: 60,
        service: "Konseling Individu",
        status: "cancelled",
        hasNotes: false
      },
      {
        id: "24",
        date: "25 Jan 2026",
        time: "16:00",
        duration: 60,
        service: "Konseling Individu",
        status: "completed",
        hasNotes: true
      }
    ],
    lastNotes: "Pasien melaporkan improvement dalam pola tidur. Anxiety masih present tapi manageable dengan coping strategies."
  }
};


// ========================================
// 📋 SESSION NOTES (Confidential)
// ========================================
export const mockSessionNotes: SessionNote[] = [
  // BUDI SANTOSO - Session 3 (Latest)
  {
    id: "1",
    sessionId: "20",
    psychologistId: "6",
    patientId: "1",
    patientName: "Budi Santoso",
    sessionDate: "9 Feb 2026",
    sessionTime: "09:00",
    duration: 60,
    sessionNumber: 3,
    service: "Konseling Individu",

    subjective: "Pasien melaporkan penurunan frekuensi serangan kecemasan dari 3-4x/minggu menjadi 1-2x/minggu. Pasien merasa lebih percaya diri dalam menghadapi situasi sosial di kantor. Tidur membaik, bangun lebih segar. Work stress lebih manageable dengan coping strategies yang dipelajari.",

    objective: "Pasien tampak lebih rileks dibanding sesi sebelumnya. Kontak mata baik, berbicara dengan tempo normal. Tidak ada tanda-tanda agitasi. GAD-7 score: 12 (sebelumnya 18). Body language terbuka dan lebih confident.",

    assessment: "Anxiety Disorder - menunjukkan progress signifikan. Teknik grounding dan breathing exercises yang dipraktikkan di rumah efektif. Pasien mulai mengidentifikasi trigger dengan lebih baik. Work stress masih ada namun coping mechanism membaik. Risiko rendah.",

    plan: "1. Lanjutkan teknik CBT untuk challenging negative thoughts\n2. Introduce exposure therapy bertahap untuk social situations di kantor\n3. Homework: journal daily mood & anxiety triggers\n4. Continue breathing exercises 2x sehari\n5. Follow-up 1 minggu\n6. Pertimbangkan spacing out sessions ke 2 minggu jika progress continue",

    riskLevel: "low",
    followUpDate: "16 Feb 2026",
    nextSessionRecommendation: "Fokus pada exposure therapy untuk situasi sosial yang masih menimbulkan kecemasan ringan. Review journal.",
    tags: ["Anxiety", "CBT", "Progress Baik", "Work Stress"],

    createdAt: "9 Feb 2026 10:15",
    updatedAt: "9 Feb 2026 10:15"
  },

  // BUDI SANTOSO - Session 2
  {
    id: "2",
    sessionId: "17",
    psychologistId: "6",
    patientId: "1",
    patientName: "Budi Santoso",
    sessionDate: "5 Feb 2026",
    sessionTime: "09:00",
    duration: 60,
    sessionNumber: 2,
    service: "Konseling Individu",

    subjective: "Pasien melaporkan still experiencing anxiety attacks 3-4x/minggu, terutama saat meeting di kantor. Sudah mencoba breathing exercises yang diajarkan, cukup membantu tapi belum konsisten. Tidur masih terganggu 2-3x/minggu.",

    objective: "Pasien tampak sedikit lebih rileks dibanding sesi pertama. Kontak mata fair. GAD-7 score: 18 (baseline 20). Masih ada fidgeting namun berkurang.",

    assessment: "Anxiety Disorder - early response to therapy. Pasien cooperative dan motivated. Perlu reinforcement pada coping strategies dan consistency dalam homework.",

    plan: "1. Review dan practice breathing exercises di sesi\n2. Introduce grounding techniques (5-4-3-2-1)\n3. Psychoeducation tentang anxiety cycle\n4. Homework: practice breathing 2x sehari, log anxiety triggers\n5. Follow-up 1 minggu",

    riskLevel: "low",
    followUpDate: "12 Feb 2026",
    nextSessionRecommendation: "Assess consistency homework, lanjutkan CBT techniques.",
    tags: ["Anxiety", "CBT", "Breathing Exercises"],

    createdAt: "5 Feb 2026 10:15",
    updatedAt: "5 Feb 2026 10:15"
  },

  // BUDI SANTOSO - Session 1
  {
    id: "3",
    sessionId: "21",
    psychologistId: "6",
    patientId: "1",
    patientName: "Budi Santoso",
    sessionDate: "15 Jan 2026",
    sessionTime: "14:00",
    duration: 60,
    sessionNumber: 1,
    service: "Konseling Individu",

    subjective: "Pasien datang dengan keluhan anxiety yang mengganggu pekerjaan. Experiencing panic-like symptoms saat meeting: jantung berdebar, berkeringat, nafas pendek. Keluhan sudah berlangsung 2 bulan. Triggered by increased workload dan deadline pressure. Tidur terganggu, sering terbangun tengah malam khawatir tentang pekerjaan.",

    objective: "Pasien tampak anxious, kontak mata minimal. Fidgeting dengan tangan. Bicara cepat dengan tone tinggi. GAD-7 score: 20 (severe anxiety). Tidak ada suicidal ideation. Insight baik, motivated untuk terapi.",

    assessment: "Anxiety Disorder (suspected GAD) secondary to work stress. No panic disorder features. Functioning affected: work performance menurun, social withdrawal. Perlu CBT approach dan possible medical consultation untuk medication evaluation.",

    plan: "1. Psychoeducation tentang anxiety dan stress response\n2. Teach basic breathing exercises (diaphragmatic breathing)\n3. Discuss CBT framework untuk managing anxiety\n4. Homework: monitor anxiety triggers (time, situation, intensity)\n5. Rujuk ke psikiater untuk medication evaluation\n6. Follow-up 1 minggu",

    riskLevel: "low",
    followUpDate: "22 Jan 2026",
    nextSessionRecommendation: "Assess homework compliance, lanjutkan psychoeducation, mulai CBT techniques.",
    tags: ["Anxiety", "First Session", "Work Stress", "CBT"],

    createdAt: "15 Jan 2026 15:15",
    updatedAt: "15 Jan 2026 15:15"
  },

  // SITI RAHAYU - Session 1
  {
    id: "4",
    sessionId: "25",
    psychologistId: "6",
    patientId: "2",
    patientName: "Siti Rahayu",
    sessionDate: "9 Feb 2026",
    sessionTime: "11:00",
    duration: 60,
    sessionNumber: 1,
    service: "Konseling Individu",

    subjective: "Pasien pertama kali datang dengan keluhan mood rendah selama 3 bulan terakhir. Kehilangan minat pada aktivitas yang sebelumnya disukai (memasak, berkebun). Sulit konsentrasi di kantor, merasa 'tidak berguna'. Sering menangis tanpa sebab jelas. Nafsu makan menurun drastis, berat badan turun 4kg dalam 2 bulan. Merasa 'hampa' dan lelah terus-menerus.",

    objective: "Affect tumpul, kontak mata minimal. Berbicara pelan dengan jeda panjang. Postur membungkuk. PHQ-9 score: 16 (moderate depression). Tidak ada ideasi suicidal saat ini, namun ada riwayat pikiran 'ingin menghilang' 1 bulan lalu (passive SI). Grooming adequate.",

    assessment: "Major Depressive Disorder - episode moderate. Onset 3 bulan, triggered by work stress dan konflik keluarga (marital problems). Tidak ada psychotic features. Riwayat keluarga positif (ibu dengan depresi, dirawat 10 tahun lalu). Pasien kooperatif, insight baik. Risk: medium (perlu monitoring ketat karena riwayat passive SI).",

    plan: "1. Psychoeducation tentang depresi dan treatment options (psychotherapy + medication)\n2. Rujuk ke psikiater untuk medication evaluation - sudah dimulai Fluoxetine 20mg\n3. Safety planning - identifikasi support system (suami, kakak), crisis numbers\n4. Mulai behavioral activation - jadwal aktivitas harian (small achievable tasks)\n5. Assess suicidal ideation setiap sesi\n6. Follow-up 3-5 hari (monitoring awal medication)\n7. Emergency contact: 24/7 crisis line provided",

    riskLevel: "medium",
    followUpDate: "12 Feb 2026",
    nextSessionRecommendation: "Monitoring response terhadap medikasi, assess side effects, lanjutkan behavioral activation, re-assess suicide risk.",
    tags: ["Depression", "First Session", "Medium Risk", "Medication", "Safety Planning"],

    createdAt: "9 Feb 2026 12:30",
    updatedAt: "9 Feb 2026 12:30"
  },

  // AHMAD RIZKI - Session 5 (Latest)
  {
    id: "5",
    sessionId: "16",
    psychologistId: "6",
    patientId: "3",
    patientName: "Ahmad Rizki",
    sessionDate: "5 Feb 2026",
    sessionTime: "14:00",
    duration: 45,
    sessionNumber: 5,
    service: "Konsultasi Psikologi",

    subjective: "Pasien melaporkan serangan panik berkurang sangat signifikan. Sudah 2 minggu penuh tidak ada panic attack. Masih ada kecemasan antisipatori dalam situasi crowded places (mall, transportasi umum), tapi jauh lebih manageable. Teknik grounding dan breathing exercises sangat membantu. Social anxiety juga membaik - berani presentasi di kantor minggu lalu.",

    objective: "Pasien tampak confident dan relaxed. Berbicara jelas dengan pace normal. Mendemonstrasikan teknik breathing dengan baik dan benar. PDSS score: 8 (dari 15 di sesi pertama, 22 di assessment awal). Mampu mengidentifikasi early warning signs panic attack dan menggunakan coping skills secara efektif.",

    assessment: "Panic Disorder dengan Agoraphobia - excellent progress. Remisi dari panic attacks. CBT sangat efektif, pasien compliance tinggi dengan homework dan exposure exercises. Sudah mampu menggunakan coping skills secara mandiri tanpa prompting. Risiko rendah untuk relapse jika maintenance plan diikuti dengan baik.",

    plan: "1. Begin termination phase - gradual reduction session frequency\n2. Develop comprehensive relapse prevention plan\n3. Continue exposure exercises independently (gradual hierarchy)\n4. Homework: compile personal 'anxiety toolbox' - list semua coping strategies yang effective\n5. Next session spacing ke 2 minggu (mulai weaning)\n6. Booster session plan: 1 bulan setelah terminasi\n7. Encourage continue medication adherence (discuss dengan psikiater)",

    riskLevel: "low",
    followUpDate: "19 Feb 2026",
    nextSessionRecommendation: "Review overall progress, finalize relapse prevention plan, prepare untuk termination therapy. Discuss maintenance strategies.",
    tags: ["Panic Disorder", "Excellent Progress", "Termination Phase", "CBT Success"],

    createdAt: "5 Feb 2026 15:00",
    updatedAt: "5 Feb 2026 15:00"
  },

  // AHMAD RIZKI - Session 4
  {
    id: "6",
    sessionId: "14",
    psychologistId: "6",
    patientId: "3",
    patientName: "Ahmad Rizki",
    sessionDate: "1 Feb 2026",
    sessionTime: "14:00",
    duration: 45,
    sessionNumber: 4,
    service: "Konsultasi Psikologi",

    subjective: "Panic attacks reduced to 1x dalam 2 minggu (from 4-5x/week). Kecemasan di public places masih ada tapi bisa managed dengan grounding. Sudah mulai exposure ke mall (dengan istri sebagai support). Sleep better, energy level meningkat.",

    objective: "Pasien lebih rileks, kontak mata good. PDSS score: 15 (turun dari 22). Demonstrasi grounding technique menunjukkan mastery yang baik.",

    assessment: "Panic Disorder - significant improvement. Exposure therapy working well. Medication (Sertraline) sudah pada therapeutic level. Continue CBT approach.",

    plan: "1. Continue exposure hierarchy - gradual increase difficulty\n2. Reinforce cognitive restructuring untuk catastrophic thoughts\n3. Homework: solo exposure ke supermarket (short duration)\n4. Maintain medication compliance\n5. Follow-up 1 minggu",

    riskLevel: "low",
    followUpDate: "8 Feb 2026",
    nextSessionRecommendation: "Assess solo exposure, lanjutkan exposure therapy, prepare untuk termination discussion.",
    tags: ["Panic Disorder", "Exposure Therapy", "Good Progress"],

    createdAt: "1 Feb 2026 15:00",
    updatedAt: "1 Feb 2026 15:00"
  },

  // AHMAD RIZKI - Session 3
  {
    id: "7",
    sessionId: "11",
    psychologistId: "6",
    patientId: "3",
    patientName: "Ahmad Rizki",
    sessionDate: "28 Jan 2026",
    sessionTime: "10:00",
    duration: 60,
    sessionNumber: 3,
    service: "Konseling Individu",

    subjective: "Panic attacks frequency menurun menjadi 2x/minggu (from daily). Pasien report feeling 'more in control'. Sudah consistent dengan breathing exercises. Masih menghindari crowded places tapi awareness tentang avoidance behavior meningkat.",

    objective: "Pasien cooperative, affect lebih bright. PDSS score: 20 (baseline 22). Breathing technique executed dengan baik.",

    assessment: "Panic Disorder dengan Agoraphobia - early good response. Medication starting to work (week 2). CBT psychoeducation absorbed well. Ready untuk exposure therapy.",

    plan: "1. Introduce exposure therapy concept dan hierarchy\n2. Develop fear hierarchy dengan pasien (10 situations)\n3. Start with imaginal exposure\n4. Homework: continue breathing, start exposure homework (lowest level)\n5. Follow-up 1 minggu",

    riskLevel: "low",
    followUpDate: "4 Feb 2026",
    nextSessionRecommendation: "Begin gradual exposure therapy, assess homework compliance.",
    tags: ["Panic Disorder", "Exposure Therapy", "CBT"],

    createdAt: "28 Jan 2026 11:15",
    updatedAt: "28 Jan 2026 11:15"
  },

  // AHMAD RIZKI - Session 2
  {
    id: "8",
    sessionId: "10",
    psychologistId: "6",
    patientId: "3",
    patientName: "Ahmad Rizki",
    sessionDate: "25 Jan 2026",
    sessionTime: "14:00",
    duration: 45,
    sessionNumber: 2,
    service: "Konsultasi Psikologi",

    subjective: "Still experiencing daily panic attacks, tapi durasi lebih pendek (5-10 menit vs 20-30 menit sebelumnya). Breathing exercises mulai membantu. Medication baru dimulai kemarin (Sertraline 50mg). Avoidance behavior masih significant.",

    objective: "Pasien masih tampak anxious tapi lebih cooperative. PDSS score: 22 (no change). Started demonstrating breathing technique - needs more practice.",

    assessment: "Panic Disorder dengan Agoraphobia - early in treatment. Medication baru dimulai (expect response 2-4 weeks). Perlu intensive CBT.",

    plan: "1. Continue psychoeducation panic cycle\n2. Practice breathing exercises in session\n3. Teach grounding techniques (5-4-3-2-1)\n4. Homework: breathing 3x/day, log panic attacks\n5. Follow-up 3-4 hari (early medication monitoring)",

    riskLevel: "medium",
    followUpDate: "29 Jan 2026",
    nextSessionRecommendation: "Monitor medication side effects, reinforce coping skills, assess panic frequency.",
    tags: ["Panic Disorder", "Early Treatment", "Medication Started"],

    createdAt: "25 Jan 2026 15:00",
    updatedAt: "25 Jan 2026 15:00"
  },

  // AHMAD RIZKI - Session 1 (Initial Assessment)
  {
    id: "9",
    sessionId: "22",
    psychologistId: "6",
    patientId: "3",
    patientName: "Ahmad Rizki",
    sessionDate: "20 Jan 2026",
    sessionTime: "09:00",
    duration: 60,
    sessionNumber: 1,
    service: "Mental Health Check-Up",

    subjective: "Pasien datang dengan keluhan panic attacks yang sering (4-5x/minggu) selama 3 bulan terakhir. Symptoms: palpitasi, chest pain, shortness of breath, dizziness, fear of dying. Menghindari public transportation dan crowded places. Social anxiety juga present - takut presenting di meeting. Sudah ke IGD 2x, semua tes jantung normal. Quality of life sangat terganggu.",

    objective: "Pasien tampak very anxious, hyperventilating sedikit saat menceritakan panic attacks. Kontak mata poor. PDSS (Panic Disorder Severity Scale) score: 22 (severe). Tidak ada suicidal ideation. Medical workup negative (EKG, lab normal).",

    assessment: "Panic Disorder dengan Agoraphobia. Severe impairment in functioning (work dan social). No comorbid depression. Perlu kombinasi pharmacotherapy dan CBT. Good candidate untuk CBT with exposure therapy.",

    plan: "1. Comprehensive psychoeducation tentang panic disorder\n2. Rujuk ke psikiater untuk medication (SSRI recommended)\n3. Teach emergency breathing techniques\n4. Explain CBT approach dan treatment timeline\n5. Homework: monitor panic attacks (frequency, triggers, symptoms)\n6. Follow-up 3-5 hari (urgent untuk start treatment)\n7. Anticipate: perlu 8-12 sessions CBT",

    riskLevel: "medium",
    followUpDate: "23 Jan 2026",
    nextSessionRecommendation: "Confirm medication started, begin CBT psychoeducation, teach coping skills.",
    tags: ["Panic Disorder", "Agoraphobia", "First Session", "Assessment", "Urgent"],

    createdAt: "20 Jan 2026 10:30",
    updatedAt: "20 Jan 2026 10:30"
  },

  // DEWI LESTARI - Session 2 (Latest)
  {
    id: "10",
    sessionId: "19",
    psychologistId: "6",
    patientId: "4",
    patientName: "Dewi Lestari",
    sessionDate: "7 Feb 2026",
    sessionTime: "13:00",
    duration: 60,
    sessionNumber: 2,
    service: "Konseling Individu",

    subjective: "Pasien melaporkan slight improvement dalam mood. Sudah mulai komunikasi dengan partner meskipun masih awkward. Mencoba boundaries yang didiskusikan di sesi pertama - merasa lebih 'in control'. Masih ada sadness tapi tidak seberat minggu lalu. Tidur lebih baik, appetite kembali normal.",

    objective: "Pasien tampak lebih relaxed, kontak mata improved. Bicara lebih spontan. Affect masih slightly sad tapi tidak flat seperti sesi 1. Body language lebih open.",

    assessment: "Adjustment Disorder dengan mood disturbance - showing early improvement. Relationship issues masih primary concern. Pasien responsive terhadap supportive therapy dan problem-solving approach. No depression features.",

    plan: "1. Continue supportive counseling\n2. Communication skills training - assertiveness techniques\n3. Explore relationship patterns dan expectations\n4. Homework: practice assertive communication dengan partner (1 difficult topic)\n5. Journaling: daily mood dan relationship interactions\n6. Follow-up 1 minggu",

    riskLevel: "low",
    followUpDate: "14 Feb 2026",
    nextSessionRecommendation: "Assess communication homework, deepen exploration relationship dynamics, consider couples therapy referral if needed.",
    tags: ["Adjustment Disorder", "Relationship Issues", "Progress", "Communication Skills"],

    createdAt: "7 Feb 2026 14:15",
    updatedAt: "7 Feb 2026 14:15"
  },

  // DEWI LESTARI - Session 1
  {
    id: "11",
    sessionId: "23",
    psychologistId: "6",
    patientId: "4",
    patientName: "Dewi Lestari",
    sessionDate: "22 Jan 2026",
    sessionTime: "15:00",
    duration: 60,
    sessionNumber: 1,
    service: "Konseling Individu",

    subjective: "Pasien datang dengan keluhan kesulitan dalam hubungan dengan partner (2 tahun relationship). Merasa 'stuck' dan tidak happy. Communication problems - sering misunderstanding dan bertengkar tentang hal kecil. Merasa tidak didengar dan tidak dihargai. Mood turun sejak 1 bulan terakhir, kehilangan minat pada hobi. Appetite berkurang, tidur terganggu (sulit tidur karena overthinking tentang relationship).",

    objective: "Pasien tampak distressed, tearful saat menjelaskan relationship issues. Kontak mata fair. Affect sad tapi tidak severely depressed. No psychomotor changes. Tidak ada suicidal ideation. Insight good - aware bahwa perlu bantuan untuk relationship.",

    assessment: "Adjustment Disorder dengan mood disturbance, secondary to relationship stress. Tidak mencapai criteria Major Depression. Relationship issues dengan communication breakdown as core problem. Possible attachment issues (perlu explore lebih lanjut). No risk.",

    plan: "1. Psychoeducation: adjustment disorder vs depression\n2. Supportive counseling - validate feelings\n3. Explore relationship history dan patterns\n4. Discuss communication styles (self vs partner)\n5. Homework: identify specific communication problems (3 examples)\n6. Assess: perlu couples therapy atau individual dulu\n7. Follow-up 2 minggu",

    riskLevel: "low",
    followUpDate: "5 Feb 2026",
    nextSessionRecommendation: "Continue exploration relationship dynamics, begin communication skills training, assess mood stability.",
    tags: ["Adjustment Disorder", "Relationship Issues", "First Session", "Communication"],

    createdAt: "22 Jan 2026 16:15",
    updatedAt: "22 Jan 2026 16:15"
  },

  // EKO PRASETYO - Session 4 (Latest - Completed)
  {
    id: "12",
    sessionId: "18",
    psychologistId: "6",
    patientId: "5",
    patientName: "Eko Prasetyo",
    sessionDate: "6 Feb 2026",
    sessionTime: "11:00",
    duration: 60,
    sessionNumber: 4,
    service: "Konseling Individu",

    subjective: "Pasien melaporkan significant improvement dalam pola tidur - bisa tidur 6-7 jam/malam (from 3-4 jam). Sleep hygiene interventions working well. Anxiety masih present terutama work-related, tapi intensity berkurang (7/10 menjadi 4/10). Worry masih ada tapi tidak excessive seperti sebelumnya. Sudah mulai exercise routine (jogging 3x/week).",

    objective: "Pasien tampak less tense, good eye contact. Bicara dengan pace normal. GAD-7 score: 14 (from 19). Mendemonstrasikan good understanding of anxiety management techniques.",

    assessment: "Generalized Anxiety Disorder - showing good response to treatment. Sleep improvement sangat membantu overall functioning. Medication (Escitalopram 10mg) at therapeutic level. CBT techniques absorbed well. Perlu continue management work-related anxiety.",

    plan: "1. Continue CBT untuk work-related anxiety\n2. Introduce time management dan prioritization techniques\n3. Problem-solving therapy untuk work stressors\n4. Maintain sleep hygiene dan exercise routine\n5. Homework: identify top 3 work worries, practice problem-solving framework\n6. Follow-up 1-2 minggu",

    riskLevel: "low",
    followUpDate: "13 Feb 2026",
    nextSessionRecommendation: "Address work-related worries, lanjutkan CBT, assess need untuk spacing sessions.",
    tags: ["GAD", "Insomnia", "Good Progress", "Work Anxiety"],

    createdAt: "6 Feb 2026 12:15",
    updatedAt: "6 Feb 2026 12:15"
  },

  // EKO PRASETYO - Session 3 (Completed)
  {
    id: "13",
    sessionId: "15",
    psychologistId: "6",
    patientId: "5",
    patientName: "Eko Prasetyo",
    sessionDate: "2 Feb 2026",
    sessionTime: "09:00",
    duration: 60,
    sessionNumber: 3,
    service: "Konseling Individu",

    subjective: "Sleep slightly better dengan sleep hygiene (4-5 jam vs 3-4 jam). Melatonin helps. Worry masih excessive especially work deadlines. Mencoba worry time technique tapi sulit konsisten. Appetite OK, energy level still low.",

    objective: "Pasien masih tampak tired, dark circles under eyes. GAD-7 score: 19 (stable). Kontak mata fair. Medication compliance good (Escitalopram week 2).",

    assessment: "GAD dengan Insomnia - early response. Sleep hygiene helping slightly. Medication perlu waktu (expect response week 4-6). Perlu reinforce CBT techniques dan consistency.",

    plan: "1. Review dan reinforce sleep hygiene\n2. Cognitive restructuring untuk work worries\n3. Teach progressive muscle relaxation (for sleep)\n4. Homework: worry journal, practice PMR before bed\n5. Follow-up 1 minggu",

    riskLevel: "low",
    followUpDate: "9 Feb 2026",
    nextSessionRecommendation: "Assess sleep improvement, continue CBT for worry, monitor medication response.",
    tags: ["GAD", "Insomnia", "Sleep Hygiene", "CBT"],

    createdAt: "2 Feb 2026 10:15",
    updatedAt: "2 Feb 2026 10:15"
  },

  // EKO PRASETYO - Session 2 CANCELLED (28 Jan 2026)
  // No notes for cancelled session

  // EKO PRASETYO - Session 1
  {
    id: "14",
    sessionId: "24",
    psychologistId: "6",
    patientId: "5",
    patientName: "Eko Prasetyo",
    sessionDate: "25 Jan 2026",
    sessionTime: "16:00",
    duration: 60,
    sessionNumber: 1,
    service: "Konseling Individu",

    subjective: "Pasien datang dengan keluhan excessive worry about everything (work, health, family, finances) selama 6 bulan terakhir. Worry hampir every day, difficult to control. Insomnia severe - sulit tidur karena racing thoughts, hanya tidur 3-4 jam/malam. Fatigue, irritability, muscle tension (neck dan shoulders). Concentration problems affecting work performance. No specific panic attacks.",

    objective: "Pasien tampak fatigued, dark circles prominent. Muscle tension visible (shoulders raised). Kontak mata fair. Speech normal pace. GAD-7 score: 19 (moderately severe). PHQ-9: 11 (mild depression - likely secondary to sleep deprivation). Tidak ada suicidal ideation.",

    assessment: "Generalized Anxiety Disorder dengan Insomnia (likely anxiety-induced). Moderate severity. Chronic worry dengan significant impact on functioning. Sleep deprivation contributing to irritability dan depression symptoms. Perlu kombinasi medication untuk anxiety + sleep, plus CBT.",

    plan: "1. Psychoeducation: GAD dan relationship dengan insomnia\n2. Rujuk psikiater untuk medication (SSRI + sleep aid) - started Escitalopram 10mg dan Melatonin 3mg\n3. Sleep hygiene education (detailed)\n4. Teach worry time technique\n5. Homework: sleep diary, identify worry themes\n6. Follow-up 1 minggu (monitor medication)\n7. Plan: CBT for GAD (cognitive restructuring, worry exposure)",

    riskLevel: "low",
    followUpDate: "1 Feb 2026",
    nextSessionRecommendation: "Monitor medication adherence dan side effects, begin CBT for worry, assess sleep improvement.",
    tags: ["GAD", "Insomnia", "First Session", "Medication Started", "Chronic Worry"],

    createdAt: "25 Jan 2026 17:15",
    updatedAt: "25 Jan 2026 17:15"
  },

  // RINA KUSUMA - Session 1 (Preventive/Wellness)
  {
    id: "15",
    sessionId: "13",
    psychologistId: "6",
    patientId: "7",
    patientName: "Rina Kusuma",
    sessionDate: "1 Feb 2026",
    sessionTime: "10:00",
    duration: 45,
    sessionNumber: 1,
    service: "Mental Health Check-Up",

    subjective: "Pasien datang untuk preventive mental health check-up. Tidak ada keluhan spesifik. Bekerja di industri high-stress (investment banking). Ingin memastikan kesehatan mental tetap optimal dan belajar stress management yang lebih baik. Merasa 'cukup baik' secara umum tapi notice kadang overwhelmed dengan workload. Work-life balance challenging.",

    objective: "Pasien tampak sehat dan well-groomed. Energy baik, kontak mata excellent. Affect normal, speech spontan. Tidak ada distress yang signifikan. Insight dan judgment excellent. GAD-7: 6 (minimal), PHQ-9: 4 (minimal). Sleep hygiene perlu improvement (tidur larut, screen time tinggi before bed).",

    assessment: "No mental health diagnosis. Successful adjustment to high-stress work environment. Good baseline functioning dengan excellent coping skills. Fokus pada prevention dan wellness optimization. Sleep hygiene bisa ditingkatkan. Kandidat excellent untuk stress management coaching dan burnout prevention.",

    plan: "1. Psychoeducation: work-life balance, burnout signs dan prevention\n2. Stress management techniques: progressive muscle relaxation, mindfulness basics\n3. Sleep hygiene optimization (screen time, bedtime routine)\n4. Time management dan boundary-setting strategies\n5. Provide resources: meditation apps, self-care checklist\n6. Recommend monthly check-ins untuk maintenance mental health\n7. Follow-up optional 1 bulan atau as needed",

    riskLevel: "low",
    followUpDate: "1 Mar 2026",
    nextSessionRecommendation: "Optional follow-up untuk review implementation stress management strategies dan sleep hygiene. Check-in tentang work-life balance.",
    tags: ["Preventive", "Wellness", "Stress Management", "High Functioning", "No Diagnosis"],

    createdAt: "1 Feb 2026 11:00",
    updatedAt: "1 Feb 2026 11:00"
  }
];


// ========================================
// 📊 ADMIN DASHBOARD DATA
// ========================================

export const mockDashboardStats = {
  totalPatients: 8,
  newPatientsThisMonth: 3,
  todayBookings: 4,
  upcomingBookings: 5,
  pendingPayments: 2,
  monthlyRevenue: 3325000,
  revenueGrowth: 15,
  activePsychologists: 2,
  totalPsychologists: 2,
  avgRating: 4.8,
  totalReviews: 127
};

export const mockRecentBookings = [
  {
    id: "booking_001",
    patient: "Budi Santoso",
    psychologist: "Dr. Ani Wijaya",
    service: "Konseling Individu",
    date: "2026-02-10",
    time: "09:00",
    status: "completed",
    duration: 60
  },
  {
    id: "booking_002",
    patient: "Eko Prasetyo",
    psychologist: "Dr. Ani Wijaya",
    service: "Konseling Individu",
    date: "2026-02-10",
    time: "10:00",
    status: "confirmed",
    duration: 60
  },
  {
    id: "booking_003",
    patient: "Ahmad Rizki",
    psychologist: "Dr. Ani Wijaya",
    service: "Konsultasi Psikologi",
    date: "2026-02-10",
    time: "14:00",
    status: "confirmed",
    duration: 45
  },
  {
    id: "booking_004",
    patient: "Rina Kusuma",
    psychologist: "Dr. Ani Wijaya",
    service: "Mental Health Check-Up",
    date: "2026-02-10",
    time: "16:00",
    status: "confirmed",
    duration: 45
  },
  {
    id: "booking_005",
    patient: "Dewi Lestari",
    psychologist: "Dr. Ani Wijaya",
    service: "Konseling Individu",
    date: "2026-02-07",
    time: "13:00",
    status: "completed",
    duration: 60
  }
];

export const mockPendingPayments = [
  {
    id: 1,
    patient: "Budi Santoso",
    service: "Konseling Individu",
    amount: 60000,
    uploadedAt: "2 jam lalu",
    urgent: true
  },
  {
    id: 2,
    patient: "Dewi Lestari",
    service: "Mental Health Check-Up",
    amount: 100000,
    uploadedAt: "5 jam lalu",
    urgent: true
  }
];

export const mockTodaySchedule = [
  {
    id: "schedule_001",
    time: "09:00",
    psychologist: "Dr. Ani Wijaya",
    patient: "Budi Santoso",
    duration: 60,
    status: "completed"
  },
  {
    id: "schedule_002",
    time: "10:00",
    psychologist: "Dr. Ani Wijaya",
    patient: "Eko Prasetyo",
    duration: 60,
    status: "scheduled"
  },
  {
    id: "schedule_003",
    time: "14:00",
    psychologist: "Dr. Ani Wijaya",
    patient: "Ahmad Rizki",
    duration: 45,
    status: "scheduled"
  },
  {
    id: "schedule_004",
    time: "16:00",
    psychologist: "Dr. Ani Wijaya",
    patient: "Rina Kusuma",
    duration: 45,
    status: "scheduled"
  }
];

export const mockAlerts = [
  {
    id: 1,
    type: "info",
    title: "Sesi Hari Ini",
    description: "4 sesi terjadwal untuk hari ini",
    action: "Lihat Jadwal",
    link: "/admin/schedule"
  },
  {
    id: 2,
    type: "success",
    title: "Pasien Baru",
    description: "3 pasien baru bulan ini",
    action: "Lihat Pasien",
    link: "/admin/users"
  },
  {
    id: 3,
    type: "success",
    title: "Rating Tinggi",
    description: "Dr. Ani Wijaya mempertahankan rating 4.8/5",
    action: "Lihat Profil",
    link: "/admin/psychologists"
  }
];

export const mockRecentPatientsAdmin = [
  {
    id: 1,
    name: "Budi Santoso",
    date: "2026-02-10",
    service: "Konseling Individu",
    description: "Session 3 - Progress baik",
    bookingCount: 3
  },
  {
    id: 2,
    name: "Eko Prasetyo",
    date: "2026-02-06",
    service: "Konseling Individu",
    description: "Session 4 - Insomnia improvement",
    bookingCount: 4
  },
  {
    id: 3,
    name: "Dewi Lestari",
    date: "2026-02-07",
    service: "Konseling Individu",
    description: "Session 2 - Relationship counseling",
    bookingCount: 2
  },
  {
    id: 4,
    name: "Ahmad Rizki",
    date: "2026-02-05",
    service: "Konsultasi Psikologi",
    description: "Session 5 - Excellent progress",
    bookingCount: 5
  },
  {
    id: 5,
    name: "Siti Rahayu",
    date: "2026-02-09",
    service: "Konseling Individu",
    description: "First session - Depression assessment",
    bookingCount: 1
  }
];


// ========================================
// 📈 ANALYTICS DATA
// ========================================

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
    id: number;
    name: string;
    percentage: number;
  }>;
  topServices: Array<{
    id: number;
    name: string;
    percentage: number;
  }>;
  patients: Array<{
    id: number;
    name: string;
    date: string;
    service: string;
    description: string;
    bookingCount?: number;
  }>;
}

// Mock Analytics Data
export const mockAnalyticsData: AnalyticsData = {
  stats: {
    totalUsers: 1847,
    totalVisitors: 12543
  },
  bookings: {
    returning: 245,
    new: 156
  },
  monthlyPatients: [
    { month: "Jan", value: 245 },
    { month: "Feb", value: 312 },
    { month: "Mar", value: 289 },
    { month: "Apr", value: 356 },
    { month: "May", value: 401 },
    { month: "Jun", value: 378 },
    { month: "Jul", value: 423 },
    { month: "Aug", value: 389 },
    { month: "Sep", value: 445 },
    { month: "Oct", value: 412 },
    { month: "Nov", value: 467 },
    { month: "Dec", value: 20 }
  ],
  revenue: {
    paid: 125000000,
    dp: 45000000
  },
  topTests: [
    { id: 1, name: "Tes Kepribadian MBTI", percentage: 45 },
    { id: 2, name: "Tes Kecemasan (GAD-7)", percentage: 38 },
    { id: 3, name: "Tes Depresi (PHQ-9)", percentage: 32 },
    { id: 4, name: "Tes Stres (PSS)", percentage: 28 },
    { id: 5, name: "Tes Kecerdasan Emosional", percentage: 25 }
  ],
  topServices: [
    { id: 1, name: "Konseling Individu", percentage: 52 },
    { id: 2, name: "Konseling Keluarga", percentage: 38 },
    { id: 3, name: "Terapi Kognitif", percentage: 34 },
    { id: 4, name: "Konseling Pasangan", percentage: 29 },
    { id: 5, name: "Mental Health Check-Up", percentage: 25 }
  ],
  patients: [
    {
      id: 1,
      name: "Sarah Johnson",
      date: "2026-02-10",
      service: "Konseling Individu",
      description: "Sesi konseling rutin",
      bookingCount: 12
    },
    {
      id: 2,
      name: "Michael Chen",
      date: "2026-02-09",
      service: "Terapi Kognitif",
      description: "Terapi lanjutan minggu ke-4",
      bookingCount: 8
    },
    {
      id: 3,
      name: "Amanda Lee",
      date: "2026-02-09",
      service: "Konseling Keluarga",
      description: "Konsultasi keluarga",
      bookingCount: 6
    },
    {
      id: 4,
      name: "David Martinez",
      date: "2026-02-08",
      service: "Mental Health Check-Up",
      description: "Pemeriksaan kesehatan mental rutin",
      bookingCount: 5
    },
    {
      id: 5,
      name: "Lisa Anderson",
      date: "2026-02-08",
      service: "Konseling Individu",
      description: "Follow-up session",
      bookingCount: 10
    },
    {
      id: 6,
      name: "Robert Wilson",
      date: "2026-02-07",
      service: "Konseling Pasangan",
      description: "Sesi bersama pasangan",
      bookingCount: 4
    },
    {
      id: 7,
      name: "Emily Davis",
      date: "2026-02-07",
      service: "Terapi Kognitif",
      description: "Terapi CBT sesi 3",
      bookingCount: 7
    },
    {
      id: 8,
      name: "James Brown",
      date: "2026-02-06",
      service: "Konseling Individu",
      description: "Konseling untuk kecemasan",
      bookingCount: 9
    },
    {
      id: 9,
      name: "Patricia Garcia",
      date: "2026-02-06",
      service: "Konseling Keluarga",
      description: "Mediasi keluarga",
      bookingCount: 3
    },
    {
      id: 10,
      name: "Christopher Lopez",
      date: "2026-02-05",
      service: "Mental Health Check-Up",
      description: "Assessment lengkap",
      bookingCount: 2
    },
    {
      id: 11,
      name: "Jessica Martinez",
      date: "2026-02-05",
      service: "Konseling Individu",
      description: "Sesi perdana",
      bookingCount: 1
    },
    {
      id: 12,
      name: "Daniel Rodriguez",
      date: "2026-02-04",
      service: "Terapi Kognitif",
      description: "Terapi mingguan",
      bookingCount: 11
    },
    {
      id: 13,
      name: "Michelle Taylor",
      date: "2026-02-04",
      service: "Konseling Pasangan",
      description: "Perbaikan komunikasi",
      bookingCount: 5
    },
    {
      id: 14,
      name: "Kevin White",
      date: "2026-02-03",
      service: "Konseling Individu",
      description: "Konseling karir",
      bookingCount: 4
    },
    {
      id: 15,
      name: "Angela Thomas",
      date: "2026-02-03",
      service: "Konseling Keluarga",
      description: "Terapi keluarga",
      bookingCount: 6
    },
    {
      id: 16,
      name: "Brian Jackson",
      date: "2026-02-02",
      service: "Mental Health Check-Up",
      description: "Screening awal",
      bookingCount: 2
    },
    {
      id: 17,
      name: "Jennifer Harris",
      date: "2026-02-02",
      service: "Terapi Kognitif",
      description: "CBT untuk depresi",
      bookingCount: 8
    },
    {
      id: 18,
      name: "Steven Martin",
      date: "2026-02-01",
      service: "Konseling Individu",
      description: "Manajemen stres",
      bookingCount: 7
    },
    {
      id: 19,
      name: "Nancy Thompson",
      date: "2026-02-01",
      service: "Konseling Pasangan",
      description: "Pre-marital counseling",
      bookingCount: 3
    },
    {
      id: 20,
      name: "Paul Clark",
      date: "2026-01-31",
      service: "Konseling Individu",
      description: "Konseling trauma",
      bookingCount: 10
    }
  ]
};

// Existing Month Labels
export const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export const mockAnalyticsStats = {
  totalUsers: 10,
  totalVisitors: 156,
  totalBookings: 15,
  totalRevenue: 3325000
};

export const mockBookingData = [
  { date: "2026-01-15", count: 1 },
  { date: "2026-01-20", count: 1 },
  { date: "2026-01-22", count: 1 },
  { date: "2026-01-25", count: 2 },
  { date: "2026-01-28", count: 2 },
  { date: "2026-02-01", count: 2 },
  { date: "2026-02-02", count: 1 },
  { date: "2026-02-05", count: 2 },
  { date: "2026-02-06", count: 1 },
  { date: "2026-02-07", count: 1 },
  { date: "2026-02-09", count: 2 },
  { date: "2026-02-10", count: 4 }
];

export const mockMonthlyPatients = [
  { month: "Jan", count: 5 },
  { month: "Feb", count: 5 }
];

export const mockWeeklyPatients = [
  { week: "W1", count: 0 },
  { week: "W2", count: 2 },
  { week: "W3", count: 3 },
  { week: "W4", count: 4 },
  { week: "W5", count: 3 },
  { week: "W6", count: 3 }
];

export const mockDailyPatients = [
  { day: "01", date: "2026-02-01", count: 2 },
  { day: "02", date: "2026-02-02", count: 1 },
  { day: "05", date: "2026-02-05", count: 2 },
  { day: "06", date: "2026-02-06", count: 1 },
  { day: "07", date: "2026-02-07", count: 1 },
  { day: "09", date: "2026-02-09", count: 2 },
  { day: "10", date: "2026-02-10", count: 4 }
];

export const mockPatientsByService = [
  { service: "Konseling Individu", jan: 3, feb: 6 },
  { service: "Konsultasi Psikologi", jan: 1, feb: 3 },
  { service: "Mental Health Check-Up", jan: 1, feb: 1 }
];

export const mockPatientsByPsychologist = [
  { name: "Dr. Ani Wijaya", patients: 5, growth: 100 },
  { name: "Dr. Budi Hartono", patients: 0, growth: 0 }
];

export const mockRevenueData = {
  paid: 3325000,
  dp: 0,
  total: 3325000
};

export const mockTopTests = [
  { id: "1", name: "Anxiety Assessment (GAD-7)", count: 3 },
  { id: "2", name: "Depression Screening (PHQ-9)", count: 2 },
  { id: "3", name: "Panic Disorder Scale (PDSS)", count: 1 },
  { id: "4", name: "Mental Health Check-Up", count: 2 }
];

export const mockTopServices = [
  { id: "1", name: "Konseling Individu", revenue: 2400000, bookings: 12, percentage: 60 },
  { id: "2", name: "Konsultasi Psikologi", revenue: 600000, bookings: 4, percentage: 27 },
  { id: "3", name: "Mental Health Check-Up", revenue: 325000, bookings: 2, percentage: 13 }
];