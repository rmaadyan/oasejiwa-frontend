export async function getAllPsychologistsPublic() {
    const res = await fetch("/api/psychologists");
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Gagal mengambil data psikolog");
    return result;
}

export async function getPsychologistByIdPublic(id: string) {
    const res = await fetch(`/api/psychologists/${id}`);
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Psikolog tidak ditemukan");
    return result;
}