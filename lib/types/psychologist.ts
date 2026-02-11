// Psychologist Profile
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
  sipp?: string; // Nomor SIPP
  languages: string[];
  experience: number; // tahun
  rating?: number;
  totalReviews?: number;
  status: "active" | "inactive";
  joinedDate: string;
}

// Session/Appointment
export interface Session {
  id: number;
  patientId: number;
  patientName: string;
  patientPhoto?: string;
  service: string;
  date: string;
  time: string;
  duration: number; // minutes
  status: "upcoming" | "completed" | "cancelled" | "no-show";
  paymentStatus: "paid" | "pending";
  sessionNumber: number; // Sesi ke-berapa dengan pasien ini
  meetingLink?: string;
  notes?: string;
}

// Patient (Limited view for psychologist)
export interface PsychologistPatient {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  photo?: string;
  firstSessionDate: string;
  lastSessionDate?: string;
  totalSessions: number;
  upcomingSessionDate?: string;
  notes?: string; // Brief note
}

// Dashboard Stats
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

// Session Note (Confidential)
export interface SessionNote {
  id: number;
  sessionId: number;
  psychologistId: number;
  patientId: number;
  sessionDate: string;
  duration: number;
  sessionNumber: number;
  
  // SOAP Format
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  
  // Additional
  riskLevel?: "low" | "medium" | "high";
  followUpDate?: string;
  attachments?: string[];
  
  createdAt: string;
  updatedAt: string;
}

// API Responses
export interface PsychologistDashboardResponse {
  stats: PsychologistDashboardStats;
  todaySchedule: Session[];
  upcomingSessions: Session[];
  recentPatients: PsychologistPatient[];
}

// Schedule Query Params
export interface ScheduleQueryParams {
  date?: string;        // YYYY-MM-DD
  status?: SessionStatus | "all";
  view?: "calendar" | "list";
}

export type SessionStatus = "upcoming" | "completed" | "cancelled" | "no-show";

// Schedule Response
export interface ScheduleResponse {
  sessions: Session[];
  total: number;
  upcomingCount: number;
  completedCount: number;
  cancelledCount: number;
}

// Session Actions
export interface SessionActionPayload {
  reason?: string;
  newDate?: string;
  newTime?: string;
}

// Extended Patient Details for Psychologist
export interface PsychologistPatientDetail extends PsychologistPatient {
  phone?: string;
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
  id: number;
  date: string;
  time: string;
  duration: number;
  service: string;
  status: SessionStatus;
  hasNotes: boolean;
}

// Patients Query Params
export interface PatientsQueryParams {
  search?: string;
  status?: "all" | "active" | "inactive";
  sortBy?: "name" | "lastSession" | "totalSessions";
}

// Patients Response
export interface PatientsResponse {
  patients: PsychologistPatient[];
  total: number;
  activeCount: number;
  inactiveCount: number;
}

// Session Note (Confidential) - Already exists, just ensure it's there
export interface SessionNote {
  id: number;
  sessionId: number;
  psychologistId: number;
  patientId: number;
  patientName: string;
  sessionDate: string;
  sessionTime: string;
  duration: number;
  sessionNumber: number;
  service: string;
  
  // SOAP Format
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  
  // Additional
  riskLevel?: "low" | "medium" | "high";
  followUpDate?: string;
  nextSessionRecommendation?: string;
  tags?: string[];
  attachments?: string[];
  
  createdAt: string;
  updatedAt: string;
}

// Notes Query Params
export interface NotesQueryParams {
  search?: string;
  patientId?: number;
  riskLevel?: "low" | "medium" | "high" | "all";
  dateFrom?: string;
  dateTo?: string;
  sortBy?: "date" | "patient" | "riskLevel";
}

// Notes Response
export interface NotesResponse {
  notes: SessionNote[];
  total: number;
  lowRiskCount: number;
  mediumRiskCount: number;
  highRiskCount: number;
}

// ========================================
// 📝 Session Notes Types
// ========================================

// Note Payload for Create/Update
export interface SessionNotePayload {
  sessionId?: number; // Optional untuk create baru
  patientId: number;
  patientName?: string; // Optional, bisa di-resolve dari patientId
  sessionDate?: string; // Optional, default today
  sessionTime?: string; // Optional, default now
  duration?: number; // Optional, default 60
  sessionNumber?: number; // Optional, bisa dihitung dari history
  service?: string; // Optional
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  riskLevel?: "low" | "medium" | "high";
  followUpDate?: string;
  nextSessionRecommendation?: string;
  tags?: string[];
}

// Notes Query Parameters
export interface NotesQueryParams {
  search?: string;
  patientId?: number;
  riskLevel?: "low" | "medium" | "high" | "all"; // Tambahkan ini
  dateFrom?: string;
  dateTo?: string;
  sortBy?: "date" | "patient" | "riskLevel";
}

// Notes Response
export interface NotesResponse {
  notes: SessionNote[];
  total: number;
  lowRiskCount: number;
  mediumRiskCount: number;
  highRiskCount: number;
}
