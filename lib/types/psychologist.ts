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

  status: "active" | "inactive" | string;
  joinedDate: string;
  totalPatients?: number;
  totalSessions?: number;

  schedules?: PsychologistSchedule[];
  signatureUrl?: string | null;
  signatureUpdatedAt?: string | null;
  signatureMethod?: "UPLOAD" | "DRAW" | string | null;
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

  latestRiskLevel?: "low" | "medium" | "high" | string | null;
  hasSessionNotes?: boolean;
  latestTesName?: string | null;
  latestTesCategory?: string | null;
  latestTesScore?: string | null;
  latestTesDate?: string | null;
  latestTesSummary?: string | null;

  notes?: string | null;
}

export interface PsychologistPatientDetail extends PsychologistPatient {
  age?: number | null;
  gender?: "MALE" | "FEMALE" | "male" | "female" | null;
  address?: string | null;
  placeOfBirth?: string | null;
  birthday?: string | Date | null;
  originalAddress?: string | null;
  occupation?: string | null;
  maritalStatus?: string | null;
  siblingPosition?: number | null;
  totalSiblings?: number | null;
  isFirstVisit?: boolean;
  educationHistory?: any;

  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  } | null;

  diagnosis?: string[];
  currentMedication?: string[];
  allergies?: string[];

  riskLevel?: string | null;
  riskReason?: string | null;
  riskRecommendations?: string[] | null;
  assessmentDate?: string | null;
  assessingPsychologistName?: string | null;

  consultationForm?: any;
  tesResults?: any[];
  sessionNotesList?: SessionNote[];

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
  filter?: "my_patients" | "all";
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
  bookingId?: number | null;

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

  // === Field Rekam Medis ===
  consultationDate?: string | null;
  consultationStatus?: "ONGOING" | "COMPLETED" | "REFERRED";
  diagnosisSummary?: string | null;
  diagnosis?: string | null;
  medication?: string | null;
  currentMedication?: string | null;
  treatmentApproach?: string | null;
  recommendation?: string | null;
  followUpPlan?: "CONTINUE_SESSION" | "REFER_TO_OTHER" | "COMPLETED";
  additionalNotes?: string | null;

  riskLevel?:
    | "very_low"
    | "low"
    | "medium"
    | "high"
    | "very_high"
    | "VERY_LOW"
    | "LOW"
    | "MEDIUM"
    | "HIGH"
    | "VERY_HIGH"
    | string;
  riskReason?: string | null;
  riskRecommendations?: string[] | null;
  assessingPsychologistName?: string | null;
  assessmentDate?: string | null;

  followUpDate?: string | null;
  nextSessionRecommendation?: string | null;

  tags?: string[];
  attachments?: string[];

  createdAt: string;
  updatedAt: string;
}

export type RiskLevelKey = "very_low" | "low" | "medium" | "high" | "very_high";

export interface RiskLevelConfig {
  key: RiskLevelKey;
  label: string;
  emoji: string;
  badgeClass: string;
  description: string;
  recommendations: string[];
}

export const RISK_LEVEL_CONFIGS: Record<RiskLevelKey, RiskLevelConfig> = {
  very_low: {
    key: "very_low",
    label: "Sangat Rendah",
    emoji: "🟢",
    badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300",
    description:
      "Pasien menunjukkan kondisi psikologis stabil, tidak ditemukan indikasi gangguan serius maupun potensi membahayakan diri sendiri maupun orang lain.",
    recommendations: [
      "Lanjutkan konseling sesuai jadwal.",
      "Edukasi mengenai kesehatan mental.",
    ],
  },
  low: {
    key: "low",
    label: "Rendah",
    emoji: "🟢",
    badgeClass: "bg-green-100 text-green-800 border-green-300",
    description:
      "Terdapat beberapa gejala ringan yang masih dapat ditangani melalui konseling rutin dan pemantauan berkala.",
    recommendations: [
      "Monitoring perkembangan pasien.",
      "Latihan relaksasi mandiri.",
      "Konseling rutin.",
    ],
  },
  medium: {
    key: "medium",
    label: "Sedang",
    emoji: "🟡",
    badgeClass: "bg-amber-100 text-amber-800 border-amber-300",
    description:
      "Pasien menunjukkan gejala psikologis yang cukup mengganggu aktivitas sehari-hari sehingga memerlukan pendampingan dan evaluasi berkala.",
    recommendations: [
      "CBT (Cognitive Behavioral Therapy)",
      "Evaluasi dua minggu sekali.",
      "Monitoring gejala.",
    ],
  },
  high: {
    key: "high",
    label: "Tinggi",
    emoji: "🟠",
    badgeClass: "bg-orange-100 text-orange-800 border-orange-300",
    description:
      "Pasien mengalami gangguan yang cukup berat sehingga membutuhkan intervensi intensif serta pemantauan lebih sering.",
    recommendations: [
      "Konseling intensif.",
      "Evaluasi mingguan.",
      "Libatkan keluarga bila diperlukan.",
    ],
  },
  very_high: {
    key: "very_high",
    label: "Sangat Tinggi",
    emoji: "🔴",
    badgeClass: "bg-red-100 text-red-800 border-red-300",
    description:
      "Pasien memiliki kondisi yang memerlukan penanganan segera, evaluasi mendalam, serta kemungkinan rujukan ke psikiater atau layanan kesehatan jiwa lanjutan.",
    recommendations: [
      "Rujuk ke Psikiater.",
      "Pendampingan intensif.",
      "Monitoring ketat.",
      "Pertimbangkan penanganan darurat bila diperlukan.",
    ],
  },
};

export function getRiskConfig(riskLevel?: string | null): RiskLevelConfig {
  const norm = String(riskLevel || "medium")
    .toLowerCase()
    .trim()
    .replace(/[\s-]/g, "_");

  if (norm.includes("very_low") || norm.includes("sangat_rendah")) return RISK_LEVEL_CONFIGS.very_low;
  if (norm.includes("very_high") || norm.includes("sangat_tinggi")) return RISK_LEVEL_CONFIGS.very_high;
  if (norm.includes("high") || norm.includes("tinggi")) return RISK_LEVEL_CONFIGS.high;
  if (norm.includes("low") || norm.includes("rendah")) return RISK_LEVEL_CONFIGS.low;

  return RISK_LEVEL_CONFIGS.medium;
}

export interface NotesQueryParams {
  search?: string;
  userId?: string;
  patientId?: string;
  riskLevel?: "very_low" | "low" | "medium" | "high" | "very_high" | "all";
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
  bookingId?: number;

  subjective: string;
  objective: string;
  assessment: string;
  plan: string;

  sessionNumber?: number;
  consultationDate?: string;
  consultationStatus?: "ONGOING" | "COMPLETED" | "REFERRED";
  diagnosisSummary?: string;
  diagnosis?: string;
  medication?: string;
  treatmentApproach?: string;
  recommendation?: string;
  followUpPlan?: "CONTINUE_SESSION" | "REFER_TO_OTHER" | "COMPLETED";
  additionalNotes?: string;

  riskLevel?: RiskLevelKey | string;
  riskReason?: string;
  riskRecommendations?: string[];
  assessingPsychologistName?: string;
  assessmentDate?: string;
  followUpDate?: string;
  nextSessionRecommendation?: string;
  tags?: string[];
}