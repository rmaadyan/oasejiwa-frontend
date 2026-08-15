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

// 🟢 BASE URL
let rawUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://api.oasejiwa.id";

if (rawUrl.startsWith("https:/") && !rawUrl.startsWith("https://")) {
  rawUrl = rawUrl.replace("https:/", "https://");
}

export const API_BASE_URL = rawUrl.replace(/\/$/, "");

const USE_REAL_NOTES_API = true;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function getAuthHeaders() {
  let token = "";

  if (typeof window !== "undefined") {
    token =
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      "";

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

async function safeParseJson(res: Response, fallbackValue: any = null) {
  const text = await res.text();
  if (!text || text.trim() === "") return fallbackValue;
  try {
    return JSON.parse(text);
  } catch (err) {
    return fallbackValue;
  }
}

function normalizeRiskLevel(
  riskLevel?: string | null
): "low" | "medium" | "high" {
  const normalized = String(riskLevel || "low").toLowerCase();

  if (normalized === "high") return "high";
  if (normalized === "medium") return "medium";

  return "low";
}

export function formatPsychologistProfile(data: any): Psychologist {
  if (!data) return {} as any;

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

    signatureUrl: data.signatureUrl
      ? data.signatureUrl.startsWith("http")
        ? data.signatureUrl
        : `${API_BASE_URL}${data.signatureUrl.startsWith("/") ? "" : "/"}${data.signatureUrl}`
      : null,
    signatureUpdatedAt: data.signatureUpdatedAt || null,
    signatureMethod: data.signatureMethod || "UPLOAD",
    totalPatients: typeof data.totalPatients === "number" ? data.totalPatients : 0,
    totalSessions: typeof data.totalSessions === "number" ? data.totalSessions : 0,
  } as any;
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

  const result = await safeParseJson(res, {});
  const data = result.data || result;

  return formatPsychologistProfile(data);
}

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE_URL}/upload/image`, {
    method: "POST",
    headers: {
      ...(getAuthHeaders().Authorization ? { Authorization: getAuthHeaders().Authorization } : {}),
    },
    body: formData,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Upload failed: ${res.status} ${errText}`);
  }

  const data = await safeParseJson(res, {});
  const rawUrl = data.url || data.data?.url || "";
  if (!rawUrl) throw new Error("Upload response missing URL");

  return rawUrl.startsWith("http") ? rawUrl : `${API_BASE_URL}${rawUrl}`;
}

export async function getPsychologistDashboard(): Promise<any> {
  try {
    const res = await fetch(`${API_BASE_URL}/psychologist/dashboard`, {
      cache: "no-store",
      credentials: "include",
      headers: getAuthHeaders(),
    });

    if (!res.ok) return { data: null };
    return await safeParseJson(res, { data: null });
  } catch (error) {
    console.error("Dashboard error fallback:", error);
    return { data: null };
  }
}

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
    throw new Error(`Failed to mark session as completed: ${res.status} ${errorText}`);
  }

  return await safeParseJson(res, {});
}

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
    throw new Error(`Failed to cancel session: ${res.status} ${errorText}`);
  }

  return await safeParseJson(res, {});
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
    `${API_BASE_URL}/psychologist/sessions${queryString ? `?${queryString}` : ""}`,
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

  return await safeParseJson(res, { data: [], total: 0 });
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
    throw new Error(`Failed to fetch session details: ${res.status} ${errorText}`);
  }

  return await safeParseJson(res, null);
}

export async function getAllPatients(
  params: PatientsQueryParams = {}
): Promise<PatientsResponse> {
  const { search, status = "all", sortBy = "name", filter } = params;
  const queryParams = new URLSearchParams();

  if (search) queryParams.set("search", search);
  if (status !== "all") queryParams.set("status", status);
  if (sortBy) queryParams.set("sortBy", sortBy);
  if (filter) queryParams.set("filter", filter);

  const queryString = queryParams.toString();

  const res = await fetch(
    `${API_BASE_URL}/psychologist/patients${queryString ? `?${queryString}` : ""}`,
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

  return await safeParseJson(res, { patients: [], total: 0 });
}

export async function createPatient(data: any): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/psychologist/patients`, {
    method: "POST",
    credentials: "include",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    let parsed: any = {};
    try {
      parsed = JSON.parse(errorText);
    } catch {}
    const msg = Array.isArray(parsed.message)
      ? parsed.message.join(", ")
      : parsed.message || errorText;
    throw new Error(`Gagal membuat pasien (${res.status}): ${msg}`);
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
    throw new Error(`Failed to fetch patient detail: ${res.status} ${errorText}`);
  }

  return await safeParseJson(res, null);
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
    throw new Error(`Failed to update patient medical info: ${res.status} ${errorText}`);
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

    return {
      notes: filteredNotes,
      total: filteredNotes.length,
      lowRiskCount: filteredNotes.filter((n: any) => normalizeRiskLevel(n.riskLevel) === "low").length,
      mediumRiskCount: filteredNotes.filter((n: any) => normalizeRiskLevel(n.riskLevel) === "medium").length,
      highRiskCount: filteredNotes.filter((n: any) => normalizeRiskLevel(n.riskLevel) === "high").length,
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
      credentials: "include",
      headers: getAuthHeaders(),
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch notes: ${res.status} ${errorText}`);
  }

  return await safeParseJson(res, { notes: [], total: 0 });
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

  return await safeParseJson(res, null);
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

  return await safeParseJson(res, null);
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

  return await safeParseJson(res, {});
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

  return await safeParseJson(res, {});
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

  const result = await safeParseJson(res, {});
  const profileData = result.data || result;
  return formatPsychologistProfile(profileData);
}

export async function getAllPsychologistsPublic() {
  try {
    let res = await fetch(`${API_BASE_URL}/psychologist/public`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      res = await fetch(`${API_BASE_URL}/psychologists`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });
    }

    if (!res.ok) {
      return { data: [] };
    }

    const result = await safeParseJson(res, { data: [] });
    const rawData =
      result.data ||
      result.psychologists ||
      (Array.isArray(result) ? result : []);

    const cleanData = (Array.isArray(rawData) ? rawData : [])
      .filter((p: any) => {
        const name = p?.name || p?.fullName;
        // Status Aktif
        const isActiveStatus =
          p?.isActive === true ||
          p?.status === "Aktif" ||
          p?.status === "ACTIVE" ||
          (p?.isActive === undefined && p?.status !== "INACTIVE");

        return (
          p?.id &&
          name &&
          name.trim() !== "" &&
          name !== "Psikolog" &&
          isActiveStatus
        );
      })
      .map((p: any) => ({
        ...p,
        displayOrder: Number(p.displayOrder ?? p.order ?? 0),
        name: p.fullName || p.name,
        avatarUrl:
          p.avatarUrl && p.avatarUrl.trim() !== "" ? p.avatarUrl : null,
        sipp: p.sipp || "-",
        str: p.str || "-",
        about: p.about || "Psikolog Klinik Oase Jiwa",
        specializations: p.specializations || [],
      }))
      .sort((a: any, b: any) => {
        const orderA = a.displayOrder;
        const orderB = b.displayOrder;
        if (orderA !== orderB) {
          return orderA - orderB;
        }
        return 0;
      });

    return { data: cleanData };
  } catch (err) {
    console.error("Gagal fetch data psikolog publik:", err);
    return { data: [] };
  }
}

// 🟢 GET BY ID PUBLIC
export async function getPsychologistByIdPublic(id: string) {
  let res = await fetch(`${API_BASE_URL}/psychologists/public/${id}`, { cache: "no-store" });

  if (!res.ok) {
    res = await fetch(`${API_BASE_URL}/psychologists/${id}`, { cache: "no-store" });
  }

  if (!res.ok) {
    throw new Error("Psikolog tidak ditemukan");
  }

  const result = await safeParseJson(res, null);
  if (!result) throw new Error("Response dari server kosong");

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

export async function addPsychologistSchedule(payload: {
  date: string;
  startTime: string;
  duration: number;
  isAvailable?: boolean;
}) {
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

  return await safeParseJson(res, {});
}

export async function deletePsychologistSchedule(scheduleId: string) {
  const res = await fetch(`${API_BASE_URL}/psychologist/weekly-schedules/${scheduleId}`, {
    method: "DELETE",
    credentials: "include",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gagal menghapus jadwal: ${res.status} ${errorText}`);
  }

  return await safeParseJson(res, {});
}

export async function createOfficialMedicalRecord(payload: any) {
  const res = await fetch(`${API_BASE_URL}/official-medical-records`, {
    method: "POST",
    credentials: "include",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gagal membuat rekam medis resmi: ${errorText}`);
  }

  return await safeParseJson(res, {});
}

export async function getOfficialMedicalRecords() {
  const res = await fetch(`${API_BASE_URL}/official-medical-records`, {
    method: "GET",
    credentials: "include",
    headers: getAuthHeaders(),
  });

  if (!res.ok) return { data: [] };
  return await safeParseJson(res, { data: [] });
}

export async function getPatientOfficialMedicalRecords(patientId: string) {
  const res = await fetch(`${API_BASE_URL}/official-medical-records/patient/${patientId}`, {
    method: "GET",
    credentials: "include",
    headers: getAuthHeaders(),
  });

  if (!res.ok) return { data: [] };
  return await safeParseJson(res, { data: [] });
}

export async function deletePatient(patientId: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/psychologist/patients/${patientId}`, {
    method: "DELETE",
    credentials: "include",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gagal menghapus data pasien: ${res.status} ${errorText}`);
  }
}

// 🟢 1. FETCH SEMUA PSIKOLOG KHUSUS ADMIN
export async function getAllPsychologistsAdmin() {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/psychologists`, {
      cache: "no-store",
      credentials: "include",
      headers: getAuthHeaders(),
    });

    if (!res.ok) return { data: [] };

    const result = await safeParseJson(res, { data: [] });
    const rawList =
      result?.data?.data ||
      result?.data ||
      result?.psychologists ||
      (Array.isArray(result) ? result : []);

    const cleanData = (Array.isArray(rawList) ? rawList : []).map((p: any) => ({
      ...p,
      id: p.id || p.userId || String(Math.random()),
      name: p.fullName || p.name || p.user?.fullName || "Psikolog",
      email: p.user?.email || p.email || "-",
      phone: p.user?.userProfile?.phone || p.phoneNumber || p.phone || "-",
      phoneNumber: p.user?.userProfile?.phone || p.phoneNumber || p.phone || "-",
      avatarUrl: p.avatarUrl || p.photo || p.user?.avatarUrl || null,
      sipp: p.sipp && p.sipp.trim() !== "" ? p.sipp : "-",
      str: p.str && p.str.trim() !== "" ? p.str : "-",
      specializations: p.specializations || p.specialization || [],
      status: p.status || "Aktif",
    }));

    return { data: cleanData };
  } catch (error) {
    console.error("Gagal fetch data psikolog admin:", error);
    return { data: [] };
  }
}

// 🟢 2. HAPUS PSIKOLOG KHUSUS ADMIN
export async function deletePsychologist(id: string): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/admin/psychologists/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: getAuthHeaders(),
  });

  const result = await safeParseJson(res, {});

  if (!res.ok) {
    throw new Error(result.message || `Gagal menghapus psikolog: ${res.status}`);
  }

  return result;
}

export async function updatePsychologistsOrder(orderedIds: string[]) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";

  const res = await fetch(`${API_BASE_URL}/admin/psychologists/reorder`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
    body: JSON.stringify({ orderedIds }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal menyimpan urutan psikolog");
  }

  return res.json();
}