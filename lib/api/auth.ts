const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

/** Helper: parse JSON dengan aman — tidak crash jika response adalah HTML */
async function safeJson(res: Response) {
    const text = await res.text();
    try {
        return JSON.parse(text);
    } catch {
        // Server merespons dengan HTML (mis. 404/502), bukan JSON
        throw new Error(`Server error (${res.status}): Pastikan backend sudah berjalan di ${API_BASE_URL}`);
    }
}

export async function registerUser(data: any) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const result = await safeJson(res);

    if (!res.ok) {
        const message = Array.isArray(result.message)
        ? result.message.join(", ")
        : result.message;

        throw new Error(message);
    }

    return result;
}

export async function resendVerification(email: string) {
    const res = await fetch(`${API_BASE_URL}/auth/resend-verification`, {
        method: "POST",
        credentials: "include",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
    });

    const result = await safeJson(res);

    if (!res.ok) {
        throw new Error(result.message);
    }

    return result;
}

export async function loginUser(data: { email: string; password: string }) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const result = await safeJson(res);

    if (!res.ok) {
        const message = Array.isArray(result.message)
        ? result.message.join(", ")
        : result.message;

        throw new Error(message);
    }

    return result;
}

export async function logoutUser() {
    await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
    });
}

export function googleLogin() {
    window.location.href = `${API_BASE_URL}/auth/google`;
}

export async function emailInput(email: string) {
    const res = await fetch(`${API_BASE_URL}/auth/email-input`, {
        method: "POST",
        credentials: "include",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
    });

    const result = await res.json();

    if (!res.ok) {
        throw new Error(result.message);
    }

    return result;
}

export async function resetPassword(data: {
    token: string;
    newPassword: string;
}) {
    const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        credentials: "include",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
        throw new Error(result.message);
    }

    return result;
}

export async function changePasswordPsychologist(data: {
    oldPassword: string;
    newPassword: string;
}) {
    const res = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: "POST",
        credentials: "include",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
        throw new Error(result.message);
    }

    return result;
}

export async function getAuthMe() {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "GET",
        credentials: "include",
    });

    const result = await res.json();

    if (!res.ok) {
        throw new Error(result.message || "Unauthorized");
    }

    return result;
}