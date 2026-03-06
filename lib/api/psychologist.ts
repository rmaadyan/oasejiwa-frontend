import type {
    NotesQueryParams,
    NotesResponse,
    PatientsQueryParams,
    PatientsResponse,
    Psychologist,
    PsychologistDashboardResponse,
    PsychologistPatientDetail,
    ScheduleQueryParams,
    ScheduleResponse,
    Session,
    SessionActionPayload,
    SessionNote,
    SessionNotePayload
} from "@/lib/types/psychologist";

import {
    mockAllPatients,
    mockAllSessions,
    mockPatientDetails,
    mockPsychologistDashboardStats,
    mockPsychologistProfile,
    mockRecentPatients,
    mockSessionNotes,
    mockTodaySessions,
    mockUpcomingSessions
} from "@/lib/data/mock-ui-data";

// ========================================
// 🔧 CONFIG
// ========================================
const USE_MOCK_DATA = true;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ========================================
// 🔐 Helper: Get Auth Token
// ========================================
function getAuthToken(): string {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('auth_token') || '';
    }
    return '';
}

// ========================================
// 👨‍⚕️ GET: Psychologist Profile (Current User)
// ========================================
export async function getPsychologistProfile(): Promise<Psychologist> {
    if (USE_MOCK_DATA) {
        await delay(400);
        return mockPsychologistProfile;
    }

    const res = await fetch(`${API_BASE_URL}/api/psychologist/profile`, {
        cache: 'no-store',
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
            'Content-Type': 'application/json'
        }
    });

    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
}

// ========================================
// 📊 GET: Dashboard Data
// ========================================
export async function getPsychologistDashboard(): Promise<PsychologistDashboardResponse> {
    if (USE_MOCK_DATA) {
        await delay(600);
        return {
            stats: mockPsychologistDashboardStats,
            todaySchedule: mockTodaySessions,
            upcomingSessions: mockUpcomingSessions,
            recentPatients: mockRecentPatients
        };
    }

    const res = await fetch(`${API_BASE_URL}/api/psychologist/dashboard`, {
        cache: 'no-store',
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
            'Content-Type': 'application/json'
        }
    });

    if (!res.ok) throw new Error('Failed to fetch dashboard');
    return res.json();
}

// ========================================
// 📅 GET: Today's Sessions
// ========================================
export async function getTodaySessions(): Promise<Session[]> {
    if (USE_MOCK_DATA) {
        await delay(400);
        return mockTodaySessions;
    }

    const res = await fetch(`${API_BASE_URL}/api/psychologist/sessions/today`, {
        cache: 'no-store',
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
            'Content-Type': 'application/json'
        }
    });

    if (!res.ok) throw new Error('Failed to fetch today sessions');
    return res.json();
}

// ========================================
// 📅 GET: Upcoming Sessions (Next 7 days)
// ========================================
export async function getUpcomingSessions(): Promise<Session[]> {
    if (USE_MOCK_DATA) {
        await delay(400);
        return mockUpcomingSessions;
    }

    const res = await fetch(`${API_BASE_URL}/api/psychologist/sessions/upcoming`, {
        cache: 'no-store',
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
            'Content-Type': 'application/json'
        }
    });

    if (!res.ok) throw new Error('Failed to fetch upcoming sessions');
    return res.json();
}

// ========================================
// 📅 GET: All Sessions (Schedule Page)
// ========================================
export async function getAllSessions(params: ScheduleQueryParams = {}): Promise<ScheduleResponse> {
    const { date, status } = params;

    if (USE_MOCK_DATA) {
        await delay(500);

        let filteredSessions = [...mockAllSessions];

        // Filter by status
        if (status && status !== "all") {
            filteredSessions = filteredSessions.filter(s => s.status === status);
        }

        // Filter by date (if provided)
        if (date) {
            filteredSessions = filteredSessions.filter(s => s.date === date);
        }

        // Count by status
        const upcomingCount = mockAllSessions.filter(s => s.status === "upcoming").length;
        const completedCount = mockAllSessions.filter(s => s.status === "completed").length;
        const cancelledCount = mockAllSessions.filter(s => s.status === "cancelled").length;

        return {
            sessions: filteredSessions,
            total: filteredSessions.length,
            upcomingCount,
            completedCount,
            cancelledCount
        };
    }

    // Real API call
    const queryParams = new URLSearchParams();
    if (date) queryParams.set('date', date);
    if (status && status !== 'all') queryParams.set('status', status);

    const res = await fetch(
        `${API_BASE_URL}/api/psychologist/sessions?${queryParams}`,
        {
            cache: 'no-store',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json'
            }
        }
    );

    if (!res.ok) throw new Error('Failed to fetch sessions');
    return res.json();
}

// ========================================
// 📅 GET: Single Session Details
// ========================================
export async function getSessionDetails(sessionId: number): Promise<Session | null> {
    if (USE_MOCK_DATA) {
        await delay(300);
        return mockAllSessions.find(s => s.id === sessionId) || null;
    }

    const res = await fetch(`${API_BASE_URL}/api/psychologist/sessions/${sessionId}`, {
        cache: 'no-store',
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
            'Content-Type': 'application/json'
        }
    });

    if (!res.ok) throw new Error('Failed to fetch session details');
    return res.json();
}

// ========================================
// ✅ PUT: Mark Session as Completed
// ========================================
export async function markSessionCompleted(sessionId: number): Promise<Session> {
    if (USE_MOCK_DATA) {
        await delay(500);

        let session = mockAllSessions.find(s => s.id === sessionId);

        if (!session) {
            session = mockTodaySessions.find(s => s.id === sessionId);
        }

        if (session) {
            session.status = "completed";

            const todaySession = mockTodaySessions.find(s => s.id === sessionId);
            if (todaySession) {
                todaySession.status = "completed";
            }

            return session;
        }

        throw new Error('Session not found');
    }

    const res = await fetch(`${API_BASE_URL}/api/psychologist/sessions/${sessionId}/complete`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
            'Content-Type': 'application/json'
        }
    });

    if (!res.ok) throw new Error('Failed to mark session as completed');
    return res.json();
}

// ========================================
// ❌ PUT: Cancel Session
// ========================================
export async function cancelSession(
    sessionId: number,
    payload: SessionActionPayload
): Promise<Session> {
    if (USE_MOCK_DATA) {
        await delay(500);

        let session = mockAllSessions.find(s => s.id === sessionId);

        if (!session) {
            session = mockTodaySessions.find(s => s.id === sessionId);
        }

        if (session) {
            session.status = "cancelled";
            if (payload.reason) {
                session.notes = payload.reason;
            }

            const todaySession = mockTodaySessions.find(s => s.id === sessionId);
            if (todaySession) {
                todaySession.status = "cancelled";
                if (payload.reason) {
                    todaySession.notes = payload.reason;
                }
            }

            return session;
        }

        throw new Error('Session not found');
    }

    const res = await fetch(`${API_BASE_URL}/api/psychologist/sessions/${sessionId}/cancel`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error('Failed to cancel session');
    return res.json();
}

// ========================================
// 👥 GET: All Patients
// ========================================
export async function getAllPatients(params: PatientsQueryParams = {}): Promise<PatientsResponse> {
    const { search, status = "all", sortBy = "name" } = params;

    if (USE_MOCK_DATA) {
        await delay(500);

        let filteredPatients = [...mockAllPatients];

        // Filter by search
        if (search) {
            const searchLower = search.toLowerCase();
            filteredPatients = filteredPatients.filter(p =>
                p.name.toLowerCase().includes(searchLower) ||
                p.email?.toLowerCase().includes(searchLower)
            );
        }

        // Filter by status
        if (status === "active") {
            filteredPatients = filteredPatients.filter(p => p.upcomingSessionDate);
        } else if (status === "inactive") {
            filteredPatients = filteredPatients.filter(p => !p.upcomingSessionDate);
        }

        // Sort
        if (sortBy === "name") {
            filteredPatients.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === "lastSession") {
            filteredPatients.sort((a, b) => {
                const dateA = new Date(a.lastSessionDate || 0);
                const dateB = new Date(b.lastSessionDate || 0);
                return dateB.getTime() - dateA.getTime();
            });
        } else if (sortBy === "totalSessions") {
            filteredPatients.sort((a, b) => b.totalSessions - a.totalSessions);
        }

        const activeCount = mockAllPatients.filter(p => p.upcomingSessionDate).length;
        const inactiveCount = mockAllPatients.length - activeCount;

        return {
            patients: filteredPatients,
            total: filteredPatients.length,
            activeCount,
            inactiveCount
        };
    }

    const queryParams = new URLSearchParams();
    if (search) queryParams.set('search', search);
    if (status !== 'all') queryParams.set('status', status);
    if (sortBy) queryParams.set('sortBy', sortBy);

    const res = await fetch(
        `${API_BASE_URL}/api/psychologist/patients?${queryParams}`,
        {
            cache: 'no-store',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json'
            }
        }
    );

    if (!res.ok) throw new Error('Failed to fetch patients');
    return res.json();
}

// ========================================
// 👤 GET: Patient Detail
// ========================================
export async function getPatientDetail(patientId: number): Promise<PsychologistPatientDetail | null> {
    if (USE_MOCK_DATA) {
        await delay(400);
        return mockPatientDetails[patientId] || null;
    }

    const res = await fetch(`${API_BASE_URL}/api/psychologist/patients/${patientId}`, {
        cache: 'no-store',
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
            'Content-Type': 'application/json'
        }
    });

    if (!res.ok) throw new Error('Failed to fetch patient detail');
    return res.json();
}

// ========================================
// 👤 PUT: Update Patient Medical Info
// ========================================
export async function updatePatientMedicalInfo(
    patientId: number,
    data: {
        diagnosis?: string[];
        currentMedication?: string[];
        allergies?: string[];
    }
): Promise<void> {
    if (USE_MOCK_DATA) {
        await delay(500);
        const patient = mockPatientDetails[patientId];
        if (patient) {
            if (data.diagnosis) patient.diagnosis = data.diagnosis;
            if (data.currentMedication) patient.currentMedication = data.currentMedication;
            if (data.allergies) patient.allergies = data.allergies;
        }
        return;
    }

    const res = await fetch(`${API_BASE_URL}/api/psychologist/patients/${patientId}/medical`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!res.ok) throw new Error('Failed to update patient medical info');
}

// ========================================
// 📝 GET: All Session Notes
// ========================================
export async function getAllNotes(params: NotesQueryParams = {}): Promise<NotesResponse> {
    const { search, patientId, riskLevel = "all", dateFrom, dateTo, sortBy = "date" } = params;

    if (USE_MOCK_DATA) {
        await delay(500);

        let filteredNotes = [...mockSessionNotes];

        // Filter by search (patient name or session)
        if (search) {
            const searchLower = search.toLowerCase();
            filteredNotes = filteredNotes.filter(n =>
                n.patientName.toLowerCase().includes(searchLower) ||
                n.service.toLowerCase().includes(searchLower)
            );
        }

        // Filter by patient ID
        if (patientId) {
            filteredNotes = filteredNotes.filter(n => n.patientId === patientId);
        }

        // Filter by risk level
        if (riskLevel !== "all") {
            filteredNotes = filteredNotes.filter(n => n.riskLevel === riskLevel);
        }

        // Sort
        if (sortBy === "date") {
            filteredNotes.sort((a, b) => {
                const dateA = new Date(a.sessionDate);
                const dateB = new Date(b.sessionDate);
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

        const lowRiskCount = mockSessionNotes.filter(n => n.riskLevel === "low").length;
        const mediumRiskCount = mockSessionNotes.filter(n => n.riskLevel === "medium").length;
        const highRiskCount = mockSessionNotes.filter(n => n.riskLevel === "high").length;

        return {
            notes: filteredNotes,
            total: filteredNotes.length,
            lowRiskCount,
            mediumRiskCount,
            highRiskCount
        };
    }

    const queryParams = new URLSearchParams();
    if (search) queryParams.set('search', search);
    if (patientId) queryParams.set('patientId', patientId.toString());
    if (riskLevel !== 'all') queryParams.set('riskLevel', riskLevel);
    if (dateFrom) queryParams.set('dateFrom', dateFrom);
    if (dateTo) queryParams.set('dateTo', dateTo);
    if (sortBy) queryParams.set('sortBy', sortBy);

    const res = await fetch(
        `${API_BASE_URL}/api/psychologist/notes?${queryParams}`,
        {
            cache: 'no-store',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json'
            }
        }
    );

    if (!res.ok) throw new Error('Failed to fetch notes');
    return res.json();
}

// ========================================
// 📝 GET: Single Note Detail (by Session ID)
// ========================================
export async function getNoteDetail(sessionId: number): Promise<SessionNote> {
    if (USE_MOCK_DATA) {
        await delay(300);
        const note = mockSessionNotes.find(n => n.sessionId === sessionId);

        if (!note) {
            throw new Error(`Note not found for session ${sessionId}`);
        }

        return note;
    }

    const res = await fetch(`${API_BASE_URL}/api/psychologist/sessions/${sessionId}/notes`, {
        cache: 'no-store',
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
            'Content-Type': 'application/json'
        }
    });

    if (!res.ok) throw new Error('Failed to fetch session note');
    return res.json();
}

// ========================================
// 📝 GET: Single Note by Note ID
// ========================================
export async function getNoteById(noteId: number): Promise<SessionNote | null> {
    if (USE_MOCK_DATA) {
        await delay(300);
        return mockSessionNotes.find(n => n.id === noteId) || null;
    }

    const res = await fetch(`${API_BASE_URL}/api/psychologist/notes/${noteId}`, {
        cache: 'no-store',
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
            'Content-Type': 'application/json'
        }
    });

    if (!res.ok) throw new Error('Failed to fetch note detail');
    return res.json();
}

// ========================================
// 📝 POST: Create Note
// ========================================
export async function createNote(payload: SessionNotePayload): Promise<SessionNote> {
    if (USE_MOCK_DATA) {
        await delay(800);

        // Find patient name
        const patient = mockAllPatients.find(p => p.id === payload.patientId);

        const newNote: SessionNote = {
            id: mockSessionNotes.length + 1,
            sessionId: payload.sessionId || Date.now(), // Generate sessionId jika tidak ada
            psychologistId: 6,
            patientId: payload.patientId,
            patientName: payload.patientName || patient?.name || "Unknown Patient",
            sessionDate: payload.sessionDate || new Date().toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }),
            sessionTime: payload.sessionTime || new Date().toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit'
            }),
            duration: payload.duration || 60,
            sessionNumber: payload.sessionNumber || 1,
            service: payload.service || "Konseling Individu",
            subjective: payload.subjective,
            objective: payload.objective,
            assessment: payload.assessment,
            plan: payload.plan,
            riskLevel: payload.riskLevel || "low",
            followUpDate: payload.followUpDate,
            nextSessionRecommendation: payload.nextSessionRecommendation,
            tags: payload.tags || [],
            createdAt: new Date().toLocaleString('id-ID'),
            updatedAt: new Date().toLocaleString('id-ID')
        };

        mockSessionNotes.push(newNote);
        return newNote;
    }

    const res = await fetch(`${API_BASE_URL}/api/psychologist/notes`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error('Failed to create note');
    return res.json();
}


// ========================================
// 📝 PUT: Update Note
// ========================================
export async function updateNote(noteId: number, payload: SessionNotePayload): Promise<SessionNote> {
    if (USE_MOCK_DATA) {
        await delay(800);
        const note = mockSessionNotes.find(n => n.id === noteId);
        if (note) {
            Object.assign(note, {
                ...payload,
                updatedAt: new Date().toLocaleString('id-ID')
            });
            return note;
        }
        throw new Error('Note not found');
    }

    const res = await fetch(`${API_BASE_URL}/api/psychologist/notes/${noteId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error('Failed to update note');
    return res.json();
}

// ========================================
// 📝 DELETE: Delete Note
// ========================================
export async function deleteNote(noteId: number): Promise<void> {
    if (USE_MOCK_DATA) {
        await delay(500);
        const index = mockSessionNotes.findIndex(n => n.id === noteId);
        if (index !== -1) {
            mockSessionNotes.splice(index, 1);
        }
        return;
    }

    const res = await fetch(`${API_BASE_URL}/api/psychologist/notes/${noteId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
            'Content-Type': 'application/json'
        }
    });

    if (!res.ok) throw new Error('Failed to delete note');
}

// ========================================
// 👤 PUT: Update Profile
// ========================================
export async function updatePsychologistProfile(
    data: Partial<Psychologist>
): Promise<Psychologist> {
    if (USE_MOCK_DATA) {
        await delay(800);
        Object.assign(mockPsychologistProfile, data);
        return mockPsychologistProfile;
    }

    const res = await fetch(`${API_BASE_URL}/api/psychologist/profile`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
}

// ========================================
// 🔐 PUT: Change Password
// ========================================
export async function changePassword(
    currentPassword: string,
    newPassword: string
): Promise<{ success: boolean }> {
    if (USE_MOCK_DATA) {
        await delay(1000);
        return { success: true };
    }

    const res = await fetch(`${API_BASE_URL}/api/psychologist/change-password`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ currentPassword, newPassword })
    });

    if (!res.ok) throw new Error('Failed to change password');
    return res.json();
}