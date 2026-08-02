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

// 🟢 BASE URL (Fallback ke localhost:5000 / localhost:3000 backend NestJS)
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const USE_REAL_NOTES_API = true;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// 🟢 PERBAIKAN HEADER AUTHENTICATION (MEMBACA TOKEN JWT)
function getAuthHeaders() {
  let token = "";

  if (typeof window !== "undefined") {
    // 1. Ambil dari localStorage
    token =
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      "";

    // 2. Jika tidak ada di localStorage, ambil dari cookies
    if (!token) {
      const match = document.cookie.match(new RegExp("(^| )token=([^;]+)"));
      if (match) token = match[2];
    }
  }

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// 🟢 NORMALIZE RISK LEVEL
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

  const result = await res.json();
  const data = result.data || result;

  const parsedExperiences = Array.isArray(data.experiences)
    ? data.experiences.map((ex: any) =>
        typeof ex === "object" ? ex.name || ex : ex
      )
    : Array.isArray(data.experienceList)
    ? data.experienceList
    : [];

  return {
    id: data.id || "",
    name: data.fullName || data.name || "Psikolog",
    email: data.email || "",
    phoneNumber:
      data.phoneNumber || data.phone || data.user?.phoneNumber || "",
    phone: data.phoneNumber || data.phone || data.user?.phoneNumber || "",
    photo: data.avatarUrl || data.photo || "",

    specialization: Array.isArray(data.specializations)
      ? data.specializations.map((s: any) =>
          typeof s === "object" ? s.name || s : s
        )
      : Array.isArray(data.specialization)
      ? data.specialization
      : [],

    bio: data.about || data.bio || "",
    sipp: data.sipp || "",
    str: data.str || "",

    education:
      Array.isArray(data.education) && data.education.length > 0
        ? data.education
        : Array.isArray(data.educations) && data.educations.length > 0
        ? data.educations
        : [],

    expertises: Array.isArray(data.expertises)
      ? data.expertises.map((e: any) =>
          typeof e === "object" ? e.name || e : e
        )
      : Array.isArray(data.expertise)
      ? data.expertise
      : [],

    experienceList: parsedExperiences,
    experiences: parsedExperiences,

    certifications: data.certifications || [],
    experience: parsedExperiences.length,
    rating: data.rating || 0,
    totalReviews: data.totalReviews || 0,
    status: data.status || "active",
    joinedDate: data.joinedDate || data.createdAt || "",

    schedules: (data.schedules || []).map((schedule: any) => ({
      id: schedule.id,
      date: schedule.date ? String(schedule.date).split("T")[0] : "",
      day: schedule.day || schedule.hari || "Senin",
      startTime: schedule.startTime || schedule.time || "",
      duration: schedule.duration || 60,
      isAvailable: schedule.isAvailable ?? true,
    })),
  } as any;
}

export async function getPsychologistDashboard(): Promise<any> {
  try {
    const res = await fetch(`${API_BASE_URL}/psychologist/dashboard`, {
      cache: "no-store",
      credentials: "include",
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      return { data: null };
    }

    return await res.json();
  } catch (error) {
    console.error("Dashboard error fallback:", error);
    return { data: null };
  }
}

// 🟢 PERBAIKAN ENDPOINT COMPLETED KE PATCH /psychologist/sessions/:id/status
export async function markSessionCompleted(
  sessionId: number | string
): Promise<Session> {
  const res = await fetch(
    `${API_BASE_URL}/psychologist/sessions/${sessionId}/status`,
    {
      method: "PATCH",
      cache: "no-store",
      credentials: "include",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status: "COMPLETED" }),
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

// 🟢 PERBAIKAN ENDPOINT CANCEL KE PATCH /psychologist/sessions/:id/status
export async function cancelSession(
  sessionId: number | string,
  payload: SessionActionPayload
): Promise<Session> {
  const res = await fetch(
    `${API_BASE_URL}/psychologist/sessions/${sessionId}/status`,
    {
      method: "PATCH",
      cache: "no-store",
      credentials: "include",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        status: "CANCELLED",
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
  const res = await fetch(
    `${API_BASE_URL}/psychologist/sessions/${sessionId}`,
    {
      cache: "no-store",
      credentials: "include",
      headers: getAuthHeaders(),
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(
      `Failed to fetch session details: ${res.status} ${errorText}`
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
  const res = await fetch(
    `${API_BASE_URL}/psychologist/patients/${patientId}`,
    {
      cache: "no-store",
      credentials: "include",
      headers: getAuthHeaders(),
    }
  );

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

      filteredNotes = filteredNotes.filter((n: any) => {
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
      filteredNotes = filteredNotes.filter((n: any) => n.patientId === patientId);
    }

    if (riskLevel !== "all") {
      filteredNotes = filteredNotes.filter(
        (n: any) => normalizeRiskLevel(n.riskLevel) === riskLevel
      );
    }

    if (sortBy === "date") {
      filteredNotes.sort((a: any, b: any) => {
        const dateA = new Date(a.sessionDate || a.createdAt || 0);
        const dateB = new Date(b.sessionDate || b.createdAt || 0);
        return dateB.getTime() - dateA.getTime();
      });
    } else if (sortBy === "patient") {
      filteredNotes.sort((a: any, b: any) =>
        (a.patientName || "").localeCompare(b.patientName || "")
      );
    } else if (sortBy === "riskLevel") {
      const riskOrder: Record<"low" | "medium" | "high", number> = {
        high: 3,
        medium: 2,
        low: 1,
      };

      filteredNotes.sort((a: any, b: any) => {
        const riskA = riskOrder[normalizeRiskLevel(a.riskLevel)];
        const riskB = riskOrder[normalizeRiskLevel(b.riskLevel)];
        return riskB - riskA;
      });
    }

    return {
      notes: filteredNotes,
      total: filteredNotes.length,
      lowRiskCount: filteredNotes.filter(
        (n: any) => normalizeRiskLevel(n.riskLevel) === "low"
      ).length,
      mediumRiskCount: filteredNotes.filter(
        (n: any) => normalizeRiskLevel(n.riskLevel) === "medium"
      ).length,
      highRiskCount: filteredNotes.filter(
        (n: any) => normalizeRiskLevel(n.riskLevel) === "high"
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
  data: Partial<Psychologist> | any
): Promise<Psychologist> {
  const res = await fetch(`${API_BASE_URL}/psychologist/profile`, {
    method: "PUT",
    cache: "no-store",
    credentials: "include",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gagal memperbarui profil: ${res.status} ${errorText}`);
  }

  const result = await res.json();
  return result.data || result;
}

// 🟢 FIX 1: GET ALL PUBLIC (PERBAIKAN UTAMA TANPA PERLU DRAFT DB)
export async function getAllPsychologistsPublic() {
  let res = await fetch(`${API_BASE_URL}/psychologists/public`, { cache: "no-store" });
  
  if (!res.ok) {
    res = await fetch(`${API_BASE_URL}/psychologists`, { cache: "no-store" });
  }

  if (!res.ok) {
    throw new Error("Gagal mengambil data psikolog");
  }

  // 🟢 BACA BODY SEBAGAI TEXT TERLEBIH DAHULU UNTUK MENCEGAH CRASH UNEXPECTED END OF JSON
  const text = await res.text();
  if (!text || text.trim() === "") {
    return { data: [] };
  }

  let result: any = {};
  try {
    result = JSON.parse(text);
  } catch (err) {
    console.error("Gagal parse JSON dari server:", text);
    return { data: [] };
  }

  const rawData = result.data || result.psychologists || (Array.isArray(result) ? result : []);

  // 🟢 FILTER OTOMATIS: Saring hanya psikolog yang SUDAH ADA SIPP & NAMA VALID
  const cleanData = (Array.isArray(rawData) ? rawData : [])
    .filter((p: any) => {
      const name = p?.name || p?.fullName;
      const sipp = p?.sipp;
      const hasValidSipp = sipp && String(sipp).trim() !== "" && String(sipp).trim() !== "-";
      return p?.id && name && name.trim() !== "" && name !== "Psikolog" && hasValidSipp;
    })
    .map((p: any) => ({
      ...p,
      name: p.fullName || p.name,
      avatarUrl: p.avatarUrl && p.avatarUrl.trim() !== "" ? p.avatarUrl : null,
      sipp: p.sipp || "-",
      str: p.str || "-",
      about: p.about || "Psikolog Klinik Oase Jiwa",
      specializations: p.specializations || [],
    }));

  return { data: cleanData };
}

// 🟢 FIX 2: GET BY ID PUBLIC (BEBAS ERROR "Unexpected end of JSON input")
export async function getPsychologistByIdPublic(id: string) {
  let res = await fetch(`${API_BASE_URL}/psychologists/public/${id}`, { cache: "no-store" });
  
  if (!res.ok) {
    res = await fetch(`${API_BASE_URL}/psychologists/${id}`, { cache: "no-store" });
  }

  if (!res.ok) {
    throw new Error("Psikolog tidak ditemukan");
  }

  // 🟢 BACA BODY SEBAGAI TEXT TERLEBIH DAHULU
  const text = await res.text();
  if (!text || text.trim() === "") {
    throw new Error("Response dari server kosong");
  }

  let result: any = {};
  try {
    result = JSON.parse(text);
  } catch (err) {
    throw new Error("Response dari server bukan JSON yang valid");
  }

  const data = result.data || result.psychologist || result;
  const rawSchedules = data?.schedules || data?.schedule || data?.availableSchedules || [];

  return {
    data: {
      ...data,
      name: data?.fullName || data?.name || "Psikolog",
      avatarUrl: data?.avatarUrl && data.avatarUrl.trim() !== "" ? data.avatarUrl : null,
      schedules: rawSchedules,
    },
  };
}

export async function addPsychologistSchedule(payload: { date?: string; day?: string; time: string }) {
  const res = await fetch(`${API_BASE_URL}/psychologist/schedule`, {
    method: "POST",
    credentials: "include",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gagal menambahkan jadwal: ${res.status} ${errorText}`);
  }

  return res.json();
}

export async function deletePsychologistSchedule(scheduleId: string) {
  const res = await fetch(`${API_BASE_URL}/psychologist/schedule/${scheduleId}`, {
    method: "DELETE",
    credentials: "include",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gagal menghapus jadwal: ${res.status} ${errorText}`);
  }

  return res.json();
}