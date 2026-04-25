export async function registerUser(data: any) {
    const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
        const message = Array.isArray(result.message)
            ? result.message.join(", ")
            : result.message;

        throw new Error(message);
    }

    return result;
}

export async function resendVerification(email: string) {
    const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
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

export async function loginUser(data: { email: string; password: string }) {
    const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
        const message = Array.isArray(result.message)
            ? result.message.join(", ")
            : result.message;

        throw new Error(message);
    }

    return result;
}

export function googleLogin() {
    window.location.href = "http://localhost:3001/auth/google";
}

export async function emailInput(email: string) {
    const res = await fetch("/api/auth/email-input", {
        method: "POST",
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

export async function resetPassword(data: { token: string; newPassword: string }) {
    const res = await fetch("/api/auth/reset-password", {
        method: "POST",
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
    const token = document.cookie
        .split("; ")
        .find(row => row.startsWith("token="))
        ?.split("=")[1];

    const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
        throw new Error(result.message);
    }

    return result;
}