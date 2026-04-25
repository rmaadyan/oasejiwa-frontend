function getToken() {
    return document.cookie
        .split("; ")
        .find(row => row.startsWith("token="))
        ?.split("=")[1];
}

export async function getMe() {
    const res = await fetch("/api/user/me", {
        credentials: "include", 
    });

    const text = await res.text();
    try {
        const result = JSON.parse(text);
        if (!res.ok) throw new Error(result.message || "Gagal ambil profil");
        return result;
    } catch {
        throw new Error("Server error: " + text.slice(0, 100));
    }
}

export async function updateUserProfile(data: any) {
    const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
    });

    const text = await res.text();
    try {
        const result = JSON.parse(text);
        if (!res.ok) throw new Error(result.message || "Gagal update profile");
        return result;
    } catch {
        throw new Error("Server error: " + text.slice(0, 100));
    }
}