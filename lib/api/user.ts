const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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
    const res = await fetch(`${API_BASE_URL}/user/profile`, {
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
} // 👈 Kurung kurawal penutup updateUserProfile yang tadi hilang sudah ditambahkan

export async function changeUserPassword(data: { currentPassword: string; newPassword: string }) {
    const res = await fetch(`${API_BASE_URL}/user/change-password`, {
        method: "PATCH", // Ubah ke PATCH jika endpoint di NestJS backend kamu pakai @Patch
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
            : messages ?? "Gagal mengubah kata sandi";
        throw new Error(errorMessage);
    }

    return json;
}

export async function uploadUserAvatar(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_BASE_URL}/upload/image`, {
        method: "POST",
        credentials: "include",
        body: formData,
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
            : messages ?? "Gagal mengunggah foto";
        throw new Error(errorMessage);
    }

    const url = json?.url || json?.data?.url;
    if (!url) {
        throw new Error("Upload response missing url");
    }

    return url;
}