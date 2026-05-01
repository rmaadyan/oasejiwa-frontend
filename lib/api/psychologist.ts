// psychologist side
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
  mockTodaySessions,
  mockUpcomingSessions,
  mockAllSessions,
  mockSessionNotes,
} from "@/lib/data/mock-ui-data";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.oasejiwa.id";

const USE_REAL_NOTES_API = true;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function getAuthHeaders() {
  return {
    "Content-Type": "application/json",
  };
}

function normalizeRiskLevel(
  riskLevel?: string | null
): "low" | "medium" | "high" {
  const normalized = String(riskLevel || "low").toLowerCase();

  if (normalized === "high") return "high";
  if (normalized === "medium") return "medium";

  return "low";
}

export async function getPsychologistProfile(): Promise<Psychologist> {
  const res = await fetch(`${API_BASE_URL}/psychologist/profile`, {
    cache: "no-store",
    credentials: "include",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch profile: ${res.status} ${errorText}`);
  }

  const data = await res.json();

  return {
    id: data.id,
    name: data.name || data.fullName || "Psikolog",
    email: data.email || "",
    photo: data.photo || data.avatarUrl || "",

    specialization: data.specialization || data.specializations || [],
    bio: data.bio || data.about || "",

    education: (data.education || data.educations || []).map((edu: any) =>
      typeof edu === "string"
        ? edu
        : `${edu.degree || ""} - ${edu.institution || ""}${
            edu.city ? `, ${edu.city}` : ""
          }${
            edu.startYear && edu.endYear
              ? ` (${edu.startYear} - ${edu.endYear})`
              : ""
          }`
    ),

    experienceList:
      data.experienceList ||
      data.experiences?.map((experience: any) =>
      typeof experience === "string" ? experience : experience.name
  ) ||
  [],

    certifications: data.certifications || [],

    sipp: data.sipp || "",
    str: data.str || "",

    experience: Array.isArray(data.experiences)
      ? data.experiences.length
      : data.experience || 0,

    rating: data.rating || 0,
    totalReviews: data.totalReviews || 0,

    status: data.status || "active",
    joinedDate: data.joinedDate || data.createdAt || "",

    schedules: (data.schedules || []).map((schedule: any) => ({
      id: schedule.id,
      date: schedule.date,
      startTime: schedule.startTime,
      duration: schedule.duration,
      isAvailable: schedule.isAvailable,
    })),
  };
}

export async function getPsychologistDashboard(): Promise<PsychologistDashboardResponse> {
  const res = await fetch(`${API_BASE_URL}/psychologist/dashboard`, {
    cache: "no-store",
    credentials: "include",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch dashboard: ${res.status} ${errorText}`);
  }

  return res.json();
}

export async function getTodaySessions(): Promise<Session[]> {
  await delay(400);
  return mockTodaySessions;
}

export async function getUpcomingSessions(): Promise<Session[]> {
  await delay(400);
  return mockUpcomingSessions;
}

export async function getAllSessions(
  params: ScheduleQueryParams = {}
): Promise<ScheduleResponse> {
  const { date, status } = params;

  const queryParams = new URLSearchParams();

  if (date) queryParams.set("date", date);
  if (status && status !== "all") queryParams.set("status", status);

  const queryString = queryParams.toString();

  const res = await fetch(
    `${API_BASE_URL}/psychologist/sessions${
      queryString ? `?${queryString}` : ""
    }`,
    {
      cache: "no-store",
      credentials: "include",
      headers: getAuthHeaders(),
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch sessions: ${res.status} ${errorText}`);
  }

  return res.json();
}

export async function getSessionDetails(
  sessionId: string
): Promise<Session | null> {
  const res = await fetch(`${API_BASE_URL}/psychologist/sessions/${sessionId}`, {
    cache: "no-store",
    credentials: "include",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(
      `Failed to fetch session details: ${res.status} ${errorText}`
    );
  }

  return res.json();
}

export async function markSessionCompleted(
  sessionId: number | string
): Promise<Session> {
  const res = await fetch(
    `${API_BASE_URL}/psychologist/sessions/${sessionId}/complete`,
    {
      method: "PATCH",
      cache: "no-store",
      credentials: "include",
      headers: getAuthHeaders(),
      body: JSON.stringify({}),
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(
      `Failed to mark session as completed: ${res.status} ${errorText}`
    );
  }

  return res.json();
}

export async function cancelSession(
  sessionId: number | string,
  payload: SessionActionPayload
): Promise<Session> {
  const res = await fetch(
    `${API_BASE_URL}/psychologist/sessions/${sessionId}/cancel`,
    {
      method: "PATCH",
      cache: "no-store",
      credentials: "include",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        reason: payload.reason,
      }),
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(
      `Failed to cancel session: ${res.status} ${errorText}`
    );
  }

  return res.json();
}

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
    `${API_BASE_URL}/psychologist/patients${
      queryString ? `?${queryString}` : ""
    }`,
    {
      cache: "no-store",
      credentials: "include",
      headers: getAuthHeaders(),
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch patients: ${res.status} ${errorText}`);
  }

  return res.json();
}

export async function getPatientDetail(
  patientId: string
): Promise<PsychologistPatientDetail | null> {
  const res = await fetch(`${API_BASE_URL}/psychologist/patients/${patientId}`, {
    cache: "no-store",
    credentials: "include",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(
      `Failed to fetch patient detail: ${res.status} ${errorText}`
    );
  }

  return res.json();
}

export async function updatePatientMedicalInfo(
  patientId: string,
  data: {
    diagnosis?: string[];
    currentMedication?: string[];
    allergies?: string[];
  }
): Promise<void> {
  const res = await fetch(
    `${API_BASE_URL}/psychologist/patients/${patientId}/medical`,
    {
      method: "PATCH",
      credentials: "include",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(
      `Failed to update patient medical info: ${res.status} ${errorText}`
    );
  }
}

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

      filteredNotes = filteredNotes.filter((n) => {
        const patientName = n.patientName || "";
        const service = n.service || "";
        const assessment = n.assessment || "";

        return (
          patientName.toLowerCase().includes(searchLower) ||
          service.toLowerCase().includes(searchLower) ||
          assessment.toLowerCase().includes(searchLower)
        );
      });
    }

    if (patientId) {
      filteredNotes = filteredNotes.filter((n) => n.patientId === patientId);
    }

    if (riskLevel !== "all") {
      filteredNotes = filteredNotes.filter(
        (n) => normalizeRiskLevel(n.riskLevel) === riskLevel
      );
    }

    if (sortBy === "date") {
      filteredNotes.sort((a, b) => {
        const dateA = new Date(a.sessionDate || a.createdAt || 0);
        const dateB = new Date(b.sessionDate || b.createdAt || 0);
        return dateB.getTime() - dateA.getTime();
      });
    } else if (sortBy === "patient") {
      filteredNotes.sort((a, b) =>
        (a.patientName || "").localeCompare(b.patientName || "")
      );
    } else if (sortBy === "riskLevel") {
      const riskOrder: Record<"low" | "medium" | "high", number> = {
        high: 3,
        medium: 2,
        low: 1,
      };

      filteredNotes.sort((a, b) => {
        const riskA = riskOrder[normalizeRiskLevel(a.riskLevel)];
        const riskB = riskOrder[normalizeRiskLevel(b.riskLevel)];
        return riskB - riskA;
      });
    }

    return {
      notes: filteredNotes,
      total: filteredNotes.length,
      lowRiskCount: filteredNotes.filter(
        (n) => normalizeRiskLevel(n.riskLevel) === "low"
      ).length,
      mediumRiskCount: filteredNotes.filter(
        (n) => normalizeRiskLevel(n.riskLevel) === "medium"
      ).length,
      highRiskCount: filteredNotes.filter(
        (n) => normalizeRiskLevel(n.riskLevel) === "high"
      ).length,
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
    `${API_BASE_URL}/psychologist/notes${
      queryString ? `?${queryString}` : ""
    }`,
    {
      cache: "no-store",
      credentials: "include",
      headers: getAuthHeaders(),
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch notes: ${res.status} ${errorText}`);
  }

  return res.json();
}

export async function getNoteDetail(scheduleId: string): Promise<SessionNote> {
  const res = await fetch(
    `${API_BASE_URL}/psychologist/sessions/${scheduleId}/notes`,
    {
      cache: "no-store",
      credentials: "include",
      headers: getAuthHeaders(),
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch session note: ${res.status} ${errorText}`);
  }

  return res.json();
}

export async function getNoteById(noteId: string): Promise<SessionNote> {
  const res = await fetch(`${API_BASE_URL}/psychologist/notes/${noteId}`, {
    cache: "no-store",
    credentials: "include",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch note detail: ${res.status} ${errorText}`);
  }

  return res.json();
}

export async function createNote(
  payload: SessionNotePayload
): Promise<SessionNote> {
  const res = await fetch(`${API_BASE_URL}/psychologist/notes`, {
    method: "POST",
    credentials: "include",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to create note: ${res.status} ${errorText}`);
  }

  return res.json();
}

export async function updateNote(
  noteId: string,
  payload: Partial<SessionNotePayload>
): Promise<SessionNote> {
  const res = await fetch(`${API_BASE_URL}/psychologist/notes/${noteId}`, {
    method: "PUT",
    credentials: "include",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to update note: ${res.status} ${errorText}`);
  }

  return res.json();
}

export async function deleteNote(noteId: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/psychologist/notes/${noteId}`, {
    method: "DELETE",
    credentials: "include",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to delete note: ${res.status} ${errorText}`);
  }
}

export async function updatePsychologistProfile(
  data: Partial<Psychologist>
): Promise<Psychologist> {
  await delay(800);

  Object.assign(mockPsychologistProfile, data);

  return mockPsychologistProfile as unknown as Psychologist;
}

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

export async function getAllPsychologistsPublic() {
  const res = await fetch("/api/psychologists");
  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Gagal mengambil data psikolog");
  }

  return result;
}

export async function getPsychologistByIdPublic(id: string) {
  const res = await fetch(`/api/psychologists/${id}`);
  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Psikolog tidak ditemukan");
  }

  return result;
}