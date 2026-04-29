const API_BASE_URL =process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
export async function getMe() {
    const res = await fetch(`${API_BASE_URL}/user/me`, {
        credentials: "include",
        cache: "no-store",
    });

    if (res.status === 401) {
        throw new Error("401: Unauthorized");
    }

    if (!res.ok) {
        const text = await res.text();
        throw new Error("Server error: " + text.slice(0, 100));
    }

    return res.json();
}

export async function updateUserProfile(data: any) {
    const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
    });

    const text = await res.text();
    let json: any;
    try {
        json = JSON.parse(text);
    } catch {
        throw new Error("Server error: " + text.slice(0, 100));
    }

    if (!res.ok) {
        const messages = json?.message;
        const errorMessage = Array.isArray(messages)
            ? messages.join(", ")
            : messages ?? "Gagal update profile";
        throw new Error(errorMessage);
    }

    return json;
}