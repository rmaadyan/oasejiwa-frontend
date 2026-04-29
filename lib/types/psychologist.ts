// ========================================
// 👨‍⚕️ Psychologist Profile
// ========================================

export interface PsychologistSchedule {
  id: string;
  date: string;
  startTime: string;
  duration: number;
  isAvailable: boolean;
}

export interface Psychologist {
  id: string;
  name: string;
  email: string;
  photo?: string | null;
  experienceList?: string[];

  specialization: string[];
  bio?: string | null;
  education: string[];
  certifications: string[];

  sipp?: string | null;
  str?: string | null;

  experience: number;
  rating?: number;
  totalReviews?: number;

  status: "active" | "inactive";
  joinedDate: string;

  schedules?: PsychologistSchedule[];
}

// ========================================
// 📅 Session / Appointment
// ========================================

export type SessionStatus = "upcoming" | "completed" | "cancelled" | "no-show";

export interface Session {
  id: number;
  patientId: string;
  patientName: string;
  patientPhoto?: string | null;

  service: string;
  date: string;
  time: string;
  duration: number;

  status: SessionStatus;
  paymentStatus: "paid" | "pending";

  sessionNumber: number;
  meetingLink?: string;
  notes?: string | null;
}

// ========================================
// 👥 Patient
// ========================================

export interface PsychologistPatient {
  id: string;
  name: string;
  email?: string;
  phone?: string | null;
  photo?: string | null;

  firstSessionDate: string;
  lastSessionDate?: string | null;
  totalSessions: number;
  upcomingSessionDate?: string | null;

  notes?: string | null;
}

export interface PsychologistPatientDetail extends PsychologistPatient {
  age?: number | null;
  gender?: "MALE" | "FEMALE" | "male" | "female" | null;
  address?: string | null;

  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  } | null;

  diagnosis?: string[];
  currentMedication?: string[];
  allergies?: string[];

  sessionHistory: SessionSummary[];
  lastNotes?: string | null;
}

export interface SessionSummary {
  id: string;
  bookingId?: number | null;
  scheduleId?: string | null;
  noteId?: string | null;

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
// ========================================

export interface SessionNote {
  id: string;

  scheduleId?: string | null;

  psychologistId: string;
  patientId: string;
  patientName: string;

  sessionDate?: string | null;
  sessionTime?: string | null;
  duration?: number | null;
  sessionNumber: number;
  service: string;

  subjective?: string | null;
  objective?: string | null;
  assessment?: string | null;
  plan?: string | null;

  riskLevel?: "low" | "medium" | "high" | "LOW" | "MEDIUM" | "HIGH";

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