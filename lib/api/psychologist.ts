import type {
  Psychologist,
  PsychologistDashboardResponse,
  Session,
  ScheduleQueryParams,
  ScheduleResponse,
  SessionActionPayload,
  PatientsQueryParams,
  PatientsResponse,
  PsychologistPatientDetail,
  NotesQueryParams,
  NotesResponse,
  SessionNote,
  SessionNotePayload,
} from "@/lib/types/psychologist";

import {
  mockPsychologistProfile,
  mockPsychologistDashboardStats,
  mockTodaySessions,
  mockUpcomingSessions,
  mockRecentPatients,
  mockAllSessions,
  mockAllPatients,
  mockPatientDetails,
  mockSessionNotes,
} from "@/lib/data/mock-ui-data";

// ========================================
// 🔧 CONFIG
// ========================================

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Untuk sementara:
// - Notes pakai backend asli
// - Patients/dashboard/schedule masih mock dulu karena backend-nya belum dibuat
const USE_REAL_NOTES_API = true;
const USE_MOCK_DATA = true;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ========================================
// 🔐 Helper: Get Auth Token
// ========================================

function getAuthToken(): string {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token") || "";
  }

  return "";
}

function getAuthHeaders() {
  return {
    Authorization: `Bearer ${getAuthToken()}`,
    "Content-Type": "application/json",
  };
}

// ========================================
// 👨‍⚕️ GET: Psychologist Profile
// ========================================

export async function getPsychologistProfile(): Promise<Psychologist> {
  const res = await fetch(`${API_BASE_URL}/psychologist/profile`, {
    cache: "no-store",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch profile: ${res.status} ${errorText}`);
  }

  return res.json();
}

// ========================================
// 📊 GET: Dashboard Data
// ========================================

export async function getPsychologistDashboard(): Promise<PsychologistDashboardResponse> {
  const res = await fetch(`${API_BASE_URL}/psychologist/dashboard`, {
    cache: "no-store",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch dashboard: ${res.status} ${errorText}`);
  }

  return res.json();
}

// ========================================
// 📅 GET: Today's Sessions
// ========================================

export async function getTodaySessions(): Promise<Session[]> {
  await delay(400);
  return mockTodaySessions;
}

// ========================================
// 📅 GET: Upcoming Sessions
// ========================================

export async function getUpcomingSessions(): Promise<Session[]> {
  await delay(400);
  return mockUpcomingSessions;
}

// ========================================
// 📅 GET: All Sessions
// ========================================

export async function getAllSessions(
  params: ScheduleQueryParams = {}
): Promise<ScheduleResponse> {
  const { date, status } = params;

  const queryParams = new URLSearchParams();

  if (date) queryParams.set("date", date);
  if (status && status !== "all") queryParams.set("status", status);

  const queryString = queryParams.toString();

  const res = await fetch(
    `${API_BASE_URL}/psychologist/sessions${queryString ? `?${queryString}` : ""}`,
    {
      cache: "no-store",
      headers: getAuthHeaders(),
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch sessions: ${res.status} ${errorText}`);
  }

  return res.json();
}

// ========================================
// 📅 GET: Single Session Details
// ========================================

export async function getSessionDetails(
  sessionId: string
): Promise<Session | null> {
  const res = await fetch(`${API_BASE_URL}/psychologist/sessions/${sessionId}`, {
    cache: "no-store",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch session details: ${res.status} ${errorText}`);
  }

  return res.json();
}

// ========================================
// ✅ PUT: Mark Session as Completed
// ========================================

export async function markSessionCompleted(
  sessionId: number
): Promise<Session> {
  await delay(500);

  let session = mockAllSessions.find((s) => s.id === sessionId);

  if (!session) {
    session = mockTodaySessions.find((s) => s.id === sessionId);
  }

  if (!session) {
    throw new Error("Session not found");
  }

  session.status = "completed";

  const todaySession = mockTodaySessions.find((s) => s.id === sessionId);
  if (todaySession) {
    todaySession.status = "completed";
  }

  return session;
}

// ========================================
// ❌ PUT: Cancel Session
// ========================================

export async function cancelSession(
  sessionId: number,
  payload: SessionActionPayload
): Promise<Session> {
  await delay(500);

  let session = mockAllSessions.find((s) => s.id === sessionId);

  if (!session) {
    session = mockTodaySessions.find((s) => s.id === sessionId);
  }

  if (!session) {
    throw new Error("Session not found");
  }

  session.status = "cancelled";

  if (payload.reason) {
    session.notes = payload.reason;
  }

  const todaySession = mockTodaySessions.find((s) => s.id === sessionId);
  if (todaySession) {
    todaySession.status = "cancelled";

    if (payload.reason) {
      todaySession.notes = payload.reason;
    }
  }

  return session;
}

// ========================================
// 👥 GET: All Patients
// ========================================

export async function getAllPatients(
  params: PatientsQueryParams = {}
): Promise<PatientsResponse> {
  const { search, status = "all", sortBy = "name" } = params;

  const queryParams = new URLSearchParams();

  if (search) queryParams.set("search", search);
  if (status !== "all") queryParams.set("status", status);
  if (sortBy) queryParams.set("sortBy", sortBy);

  const queryString = queryParams.toString();

  const res = await fetch(
    `${API_BASE_URL}/psychologist/patients${queryString ? `?${queryString}` : ""}`,
    {
      cache: "no-store",
      headers: getAuthHeaders(),
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch patients: ${res.status} ${errorText}`);
  }

  return res.json();
}

// ========================================
// 👤 GET: Patient Detail
// ========================================

export async function getPatientDetail(
  patientId: string
): Promise<PsychologistPatientDetail | null> {
  const res = await fetch(`${API_BASE_URL}/psychologist/patients/${patientId}`, {
    cache: "no-store",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch patient detail: ${res.status} ${errorText}`);
  }

  return res.json();
}

// ========================================
// 👤 PUT: Update Patient Medical Info
// ========================================

export async function updatePatientMedicalInfo(
  patientId: string,
  data: {
    diagnosis?: string[];
    currentMedication?: string[];
    allergies?: string[];
  }
): Promise<void> {
  console.log("Update medical info belum tersedia di backend:", {
    patientId,
    data,
  });

  return;
}

// ========================================
// 📝 GET: All Session Notes
// ========================================

export async function getAllNotes(
  params: NotesQueryParams = {}
): Promise<NotesResponse> {
  const {
    search,
    patientId,
    userId,
    riskLevel = "all",
    dateFrom,
    dateTo,
    sortBy = "date",
    page,
    limit,
  } = params;

  if (!USE_REAL_NOTES_API) {
    await delay(500);

    let filteredNotes = [...mockSessionNotes] as unknown as SessionNote[];

    if (search) {
      const searchLower = search.toLowerCase();

      filteredNotes = filteredNotes.filter(
        (n) =>
          n.patientName.toLowerCase().includes(searchLower) ||
          n.service.toLowerCase().includes(searchLower) ||
          n.assessment.toLowerCase().includes(searchLower)
      );
    }

    if (patientId) {
      filteredNotes = filteredNotes.filter((n) => n.patientId === patientId);
    }

    if (riskLevel !== "all") {
      filteredNotes = filteredNotes.filter((n) => n.riskLevel === riskLevel);
    }

    if (sortBy === "date") {
      filteredNotes.sort((a, b) => {
        const dateA = new Date(a.sessionDate || 0);
        const dateB = new Date(b.sessionDate || 0);
        return dateB.getTime() - dateA.getTime();
      });
    } else if (sortBy === "patient") {
      filteredNotes.sort((a, b) => a.patientName.localeCompare(b.patientName));
    } else if (sortBy === "riskLevel") {
      const riskOrder = { high: 3, medium: 2, low: 1 };

      filteredNotes.sort((a, b) => {
        const riskA = riskOrder[a.riskLevel || "low"];
        const riskB = riskOrder[b.riskLevel || "low"];
        return riskB - riskA;
      });
    }

    return {
      notes: filteredNotes,
      total: filteredNotes.length,
      lowRiskCount: filteredNotes.filter((n) => n.riskLevel === "low").length,
      mediumRiskCount: filteredNotes.filter((n) => n.riskLevel === "medium")
        .length,
      highRiskCount: filteredNotes.filter((n) => n.riskLevel === "high").length,
    };
  }

  const queryParams = new URLSearchParams();

  if (search) queryParams.set("search", search);

  const finalUserId = userId || patientId;
  if (finalUserId) queryParams.set("userId", finalUserId);

  if (riskLevel !== "all") queryParams.set("riskLevel", riskLevel);
  if (dateFrom) queryParams.set("dateFrom", dateFrom);
  if (dateTo) queryParams.set("dateTo", dateTo);
  if (sortBy) queryParams.set("sortBy", sortBy);
  if (page) queryParams.set("page", String(page));
  if (limit) queryParams.set("limit", String(limit));

  const queryString = queryParams.toString();

  const res = await fetch(
    `${API_BASE_URL}/psychologist/notes${queryString ? `?${queryString}` : ""}`,
    {
      cache: "no-store",
      headers: getAuthHeaders(),
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch notes: ${res.status} ${errorText}`);
  }

  return res.json();
}

// ========================================
// 📝 GET: Single Note Detail by Schedule ID
// ========================================

export async function getNoteDetail(scheduleId: string): Promise<SessionNote> {
  const res = await fetch(
    `${API_BASE_URL}/psychologist/sessions/${scheduleId}/notes`,
    {
      cache: "no-store",
      headers: getAuthHeaders(),
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch session note: ${res.status} ${errorText}`);
  }

  return res.json();
}

// ========================================
// 📝 GET: Single Note by Note ID
// ========================================

export async function getNoteById(noteId: string): Promise<SessionNote> {
  const res = await fetch(`${API_BASE_URL}/psychologist/notes/${noteId}`, {
    cache: "no-store",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch note detail: ${res.status} ${errorText}`);
  }

  return res.json();
}

// ========================================
// 📝 POST: Create Note
// ========================================

export async function createNote(
  payload: SessionNotePayload
): Promise<SessionNote> {
  const res = await fetch(`${API_BASE_URL}/psychologist/notes`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to create note: ${res.status} ${errorText}`);
  }

  return res.json();
}

// ========================================
// 📝 PUT: Update Note
// ========================================

export async function updateNote(
  noteId: string,
  payload: Partial<SessionNotePayload>
): Promise<SessionNote> {
  const res = await fetch(`${API_BASE_URL}/psychologist/notes/${noteId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to update note: ${res.status} ${errorText}`);
  }

  return res.json();
}

// ========================================
// 📝 DELETE: Delete Note
// ========================================

export async function deleteNote(noteId: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/psychologist/notes/${noteId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to delete note: ${res.status} ${errorText}`);
  }
}

// ========================================
// 👤 PUT: Update Profile
// ========================================

export async function updatePsychologistProfile(
  data: Partial<Psychologist>
): Promise<Psychologist> {
  await delay(800);
  Object.assign(mockPsychologistProfile, data);
  return mockPsychologistProfile;
}

// ========================================
// 🔐 PUT: Change Password
// ========================================

export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean }> {
  await delay(1000);

  console.log("Change password mock:", {
    currentPassword,
    newPassword,
  });

  return { success: true };
}