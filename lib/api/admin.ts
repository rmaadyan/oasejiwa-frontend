function getToken() {
    return document.cookie
        .split("; ")
        .find(row => row.startsWith("token="))
        ?.split("=")[1];
}

function authHeader(): Record<string, string> {
    return { Authorization: `Bearer ${getToken()}` };
}

export async function getAllPsychologists() {
    const res = await fetch("/api/admin/psychologists", {
        headers: authHeader(),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Gagal mengambil data psikolog");
    return result;
}

export async function getPsychologistById(id: string) {
    const res = await fetch(`/api/admin/psychologists/${id}`, {
        headers: authHeader(),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Psikolog tidak ditemukan");
    return result;
}

export async function createPsychologist(data: any, avatarFile?: File) {
    const formData = buildFormData(data, avatarFile);

    const res = await fetch("/api/admin/psychologists", {
        method: "POST",
        headers: authHeader(),
        body: formData,
    });
    const result = await res.json();
    if (!res.ok) {
        const msg = Array.isArray(result.message)
            ? result.message.join(", ")
            : result.message;
        throw new Error(msg);
    }
    return result;
}

export async function updatePsychologist(id: string, data: any, avatarFile?: File) {
    const formData = buildFormData(data, avatarFile);

    const res = await fetch(`/api/admin/psychologists/${id}`, {
        method: "PATCH",
        headers: authHeader(),
        body: formData,
    });
    const result = await res.json();
    if (!res.ok) {
        const msg = Array.isArray(result.message)
            ? result.message.join(", ")
            : result.message;
        throw new Error(msg);
    }
    return result;
}

export async function deletePsychologist(id: string) {
    const res = await fetch(`/api/admin/psychologists/${id}`, {
        method: "DELETE",
        headers: authHeader(),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Gagal hapus psikolog");
    return result;
}

function buildFormData(data: any, avatarFile?: File): FormData {
    const formData = new FormData();

    formData.append("data", JSON.stringify(data));

    if (avatarFile) {
        formData.append("avatar", avatarFile);
    }

    return formData;
}