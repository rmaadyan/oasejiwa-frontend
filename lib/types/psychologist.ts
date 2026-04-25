// ========================================
// 👨‍⚕️ Psychologist Profile
// ========================================

export interface Psychologist {
  id: number;
  name: string;
  email: string;
  phone?: string;
  photo?: string;
  specialization: string[];
  bio?: string;
  education: string[];
  certifications: string[];
  sipp?: string;
  languages: string[];
  experience: number;
  rating?: number;
  totalReviews?: number;
  status: "active" | "inactive";
  joinedDate: string;
}

// ========================================
// 📅 Session / Appointment
// ========================================

export type SessionStatus = "upcoming" | "completed" | "cancelled" | "no-show";

export interface Session {
  id: number;
  patientId: number;
  patientName: string;
  patientPhoto?: string;
  service: string;
  date: string;
  time: string;
  duration: number;
  status: SessionStatus;
  paymentStatus: "paid" | "pending";
  sessionNumber: number;
  meetingLink?: string;
  notes?: string;
}

// ========================================
// 👥 Patient
// ========================================

export interface PsychologistPatient {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  photo?: string;
  firstSessionDate: string;
  lastSessionDate?: string;
  totalSessions: number;
  upcomingSessionDate?: string;
  notes?: string;
}

export interface PsychologistPatientDetail extends PsychologistPatient {
  age?: number;
  gender?: "male" | "female";
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
  diagnosis?: string[];
  currentMedication?: string[];
  allergies?: string[];
  sessionHistory: SessionSummary[];
  lastNotes?: string;
}

export interface SessionSummary {
  id: string;
  date: string;
  time: string;
  duration: number;
  service: string;
  status: SessionStatus;
  hasNotes: boolean;
}

export interface PatientsQueryParams {
  search?: string;
  status?: "all" | "active" | "inactive";
  sortBy?: "name" | "lastSession" | "totalSessions";
}

export interface PatientsResponse {
  patients: PsychologistPatient[];
  total: number;
  activeCount: number;
  inactiveCount: number;
}

// ========================================
// 📊 Dashboard
// ========================================

export interface PsychologistDashboardStats {
  todaySessions: number;
  todayCompleted: number;
  weekSessions: number;
  totalPatients: number;
  activePatientsThisMonth: number;
  totalLifetimeSessions: number;
  averageRating: number;
  nextSessionTime?: string;
}

export interface PsychologistDashboardResponse {
  stats: PsychologistDashboardStats;
  todaySchedule: Session[];
  upcomingSessions: Session[];
  recentPatients: PsychologistPatient[];
}

// ========================================
// 📅 Schedule
// ========================================

export interface ScheduleQueryParams {
  date?: string;
  status?: SessionStatus | "all";
  view?: "calendar" | "list";
}

export interface ScheduleResponse {
  sessions: Session[];
  total: number;
  upcomingCount: number;
  completedCount: number;
  cancelledCount: number;
}

export interface SessionActionPayload {
  reason?: string;
  newDate?: string;
  newTime?: string;
}

// ========================================
// 📝 Session Notes
// Sesuai backend:
// POST /psychologist/notes menerima userId, bukan patientId.
// Backend mengembalikan patientId, patientName, scheduleId, dll.
// ========================================

export interface SessionNote {
  id: string;

  scheduleId?: string | null;
  sessionId?: string | null;

  psychologistId: string;
  patientId: string;
  patientName: string;

  sessionDate?: string | null;
  sessionTime?: string | null;
  duration?: number | null;
  sessionNumber: number;
  service: string;

  subjective: string;
  objective: string;
  assessment: string;
  plan: string;

  riskLevel?: "low" | "medium" | "high";
  followUpDate?: string | null;
  nextSessionRecommendation?: string | null;
  tags?: string[];
  attachments?: string[];

  createdAt: string;
  updatedAt: string;
}

export interface NotesQueryParams {
  search?: string;
  userId?: string;
  patientId?: string;
  riskLevel?: "low" | "medium" | "high" | "all";
  dateFrom?: string;
  dateTo?: string;
  sortBy?: "date" | "patient" | "riskLevel";
  page?: number;
  limit?: number;
}

export interface NotesResponse {
  notes: SessionNote[];
  total: number;
  lowRiskCount: number;
  mediumRiskCount: number;
  highRiskCount: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export interface SessionNotePayload {
  userId: string;
  scheduleId?: string;

  subjective: string;
  objective: string;
  assessment: string;
  plan: string;

  riskLevel?: "low" | "medium" | "high";
  followUpDate?: string;
  nextSessionRecommendation?: string;
  tags?: string[];
}