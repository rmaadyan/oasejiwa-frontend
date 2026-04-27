const API_BASE_URL = "http://localhost:3001";

function getAuthToken(): string {
  if (typeof window !== "undefined") {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1] || "";
  }
  return "";
}

// Konversi response backend ke format frontend
function mapBackendToLayananItem(raw: any) {
  return {
    id: raw.id,
    nama: raw.nama,
    jenis: raw.jenis,
    kategori: raw.kategori === "NonPaket" ? "Non Paket" : raw.kategori,
    deskripsi: raw.deskripsi ?? "",
    catatan: raw.catatan,
    durasiMenit: raw.durasiMenit,
    harga: raw.harga,
    status: raw.status,
    coverUrl: raw.gambar, // ← schema pakai "gambar"
  };
}

// GET: Semua Layanan
export async function getAllLayanan() {
  const res = await fetch(`${API_BASE_URL}/layanan`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Gagal fetch data layanan");
  const data = await res.json();
  return data.map(mapBackendToLayananItem);
}

export async function getAllLayananPublic() {
  const res = await fetch(`${API_BASE_URL}/layanan`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Gagal fetch data layanan");
  const data = await res.json();
  return data.map(mapBackendToLayananItem);
}

// GET: Layanan by ID
export async function getLayananById(id: string) {
  const res = await fetch(`${API_BASE_URL}/layanan/${id}`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Gagal fetch layanan");
  const data = await res.json();
  return mapBackendToLayananItem(data);
}

// Konversi payload frontend ke format backend
function mapToBackendPayload(data: any) {
  return {
    nama: data.nama,
    jenis: data.jenis,
    kategori: data.kategori === "Non Paket" ? "NonPaket" : data.kategori,
    deskripsi: data.deskripsi,
    catatan: data.catatan || undefined,
    durasiMenit: data.durasiMenit,
    harga: data.harga,
    status: data.status,
    gambar: data.coverUrl || undefined, // ← schema pakai "gambar"
  };
}

// POST: Buat Layanan Baru
export async function createLayanan(data: any) {
  const res = await fetch(`${API_BASE_URL}/layanan`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(mapToBackendPayload(data)),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = Array.isArray(err.message) ? err.message.join(", ") : err.message;
    throw new Error(msg || "Gagal create layanan");
  }
  return res.json();
}

// PATCH: Update Layanan
export async function updateLayanan(id: string, data: any) {
  const res = await fetch(`${API_BASE_URL}/layanan/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(mapToBackendPayload(data)),
  });
  if (!res.ok) throw new Error("Gagal update layanan");
  return res.json();
}

// POST: Upload Gambar ke Cloudinary
export async function uploadGambarLayanan(file: File): Promise<string> {
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
  const result = await res.json();
  return result.url;
}

// DELETE: Hapus Layanan
export async function deleteLayanan(id: string) {
  const res = await fetch(`${API_BASE_URL}/layanan/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });
  if (!res.ok) throw new Error("Gagal hapus layanan");
  return res.json();
}