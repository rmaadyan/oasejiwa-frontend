const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function getAuthToken(): string {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token") || "";
  }
  return "";
}

// Konversi response backend ke format frontend
function mapBackendToTesItem(raw: any) {
  const sectionKategoriMap: Record<string, any[]> = {};
  for (const s of raw.sectionKategori ?? []) {
    if (!sectionKategoriMap[s.sectionNama]) {
      sectionKategoriMap[s.sectionNama] = [];
    }
    sectionKategoriMap[s.sectionNama].push({
      id: s.id,
      nama: s.nama,
      minSkor: s.minSkor,
      maxSkor: s.maxSkor,
      deskripsi: s.deskripsi,
    });
  }

  return {
    id: raw.id,
    nama: raw.nama,
    jumlah: raw.jumlah,
    status: raw.status,
    deskripsi: raw.deskripsi,
    penjelasanHasil: raw.penjelasanHasil,
    jenis: raw.jenis,
    coverUrl: raw.coverUrl,
    pertanyaan: raw.pertanyaan ?? [],
    likert: raw.likertOptions ?? [],
    kategori: raw.kategori ?? [],
    sectionKategori: Object.keys(sectionKategoriMap).length > 0
      ? sectionKategoriMap
      : undefined,
  };
}

// GET: Semua Tes
export async function getAllTes() {
  const res = await fetch(`${API_BASE_URL}/tes`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Gagal fetch data tes");
  const data = await res.json();
  return data.map(mapBackendToTesItem);
}

// GET: Tes by ID
export async function getTesById(id: string) {
  const res = await fetch(`${API_BASE_URL}/tes/${id}`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Gagal fetch tes");
  const data = await res.json();
  return mapBackendToTesItem(data);
}

// POST: Buat Tes Baru
export async function createTes(data: any) {
  const res = await fetch(`${API_BASE_URL}/tes`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Gagal create tes");
  return res.json();
}

// PATCH: Update Tes
export async function updateTes(id: string, data: any) {
  const res = await fetch(`${API_BASE_URL}/tes/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Gagal update tes");
  return res.json();
}

// DELETE: Hapus Tes
export async function deleteTes(id: string) {
  const res = await fetch(`${API_BASE_URL}/tes/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Gagal delete tes");
  return res.json();
}


export async function uploadGambar(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE_URL}/upload/image`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,

    },
    body: formData,
  });

  if (!res.ok) throw new Error("Gagal upload gambar");
  const data = await res.json();
  return data.url;
}